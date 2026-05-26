import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const createPrintifyDevApiPlugin = (env) => {
  const token = String(env.PRINTIFY_API_TOKEN ?? process.env.PRINTIFY_API_TOKEN ?? '').trim();
  const envShopId = String(env.PRINTIFY_SHOP_ID ?? process.env.PRINTIFY_SHOP_ID ?? '').trim();
  const stripeSecret = String(env.STRIPE_SECRET_KEY ?? process.env.STRIPE_SECRET_KEY ?? '').trim();
  const baseUrl = 'https://api.printify.com/v1';

  const sendJson = (res, status, body) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(body));
  };

  const fetchJson = async (url) => {
    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    const text = await resp.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    return { ok: resp.ok, status: resp.status, data };
  };

  const readJsonBody = async (req) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    const raw = Buffer.concat(chunks).toString('utf8');
    return raw ? JSON.parse(raw) : null;
  };

  const pickPrimaryImage = (urls) => {
    const list = Array.isArray(urls) ? urls.filter(Boolean) : [];
    const front = list.find((u) => typeof u === 'string' && /[?&]camera_label=front\b/i.test(u));
    if (front) return front;
    const clean = list.find((u) => typeof u === 'string' && !/[?&]camera_label=context/i.test(u));
    return clean || list[0] || null;
  };

  const resolveShopId = async () => {
    if (envShopId) return envShopId;
    const shops = await fetchJson(`${baseUrl}/shops.json`);
    if (!shops.ok) return null;
    const firstShopId = Array.isArray(shops.data) && shops.data[0]?.id ? String(shops.data[0].id) : '';
    return firstShopId || null;
  };

  return {
    name: 'printify-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlStr = req.url || '';
        if (
          !urlStr.startsWith('/api/printify-products') &&
          !urlStr.startsWith('/api/printify-product') &&
          !urlStr.startsWith('/api/checkout-session')
        ) return next();

        if (urlStr.startsWith('/api/checkout-session')) {
          if ((req.method || '').toUpperCase() !== 'POST') {
            sendJson(res, 405, { ok: false, error: 'Method not allowed' });
            return;
          }
          if (!stripeSecret) {
            sendJson(res, 500, { ok: false, error: 'Missing Stripe secret key' });
            return;
          }
          if (!token) {
            sendJson(res, 500, { ok: false, error: 'Missing Printify API token' });
            return;
          }

          let body;
          try {
            body = await readJsonBody(req);
          } catch {
            sendJson(res, 400, { ok: false, error: 'Invalid JSON' });
            return;
          }

          const rawItems = Array.isArray(body?.items)
            ? body.items
            : [
                {
                  productId: body?.productId,
                  variantId: body?.variantId,
                  quantity: body?.quantity,
                },
              ];
          const items = rawItems
            .map((i) => ({
              productId: String(i?.productId ?? '').trim(),
              variantId: Number(i?.variantId),
              quantity: Number(i?.quantity),
            }))
            .filter((i) => i.productId && Number.isFinite(i.variantId) && Number.isFinite(i.quantity) && i.quantity > 0);

          if (items.length === 0) {
            sendJson(res, 400, { ok: false, error: 'Cart is empty' });
            return;
          }
          if (items.length > 20) {
            sendJson(res, 400, { ok: false, error: 'Too many items' });
            return;
          }
          if (items.some((i) => i.quantity < 1 || i.quantity > 10)) {
            sendJson(res, 400, { ok: false, error: 'Invalid quantity' });
            return;
          }

          const shopId = await resolveShopId();
          if (!shopId) {
            sendJson(res, 500, { ok: false, error: 'No shops found for this token' });
            return;
          }

          const productCache = new Map();
          const fetchProduct = async (productId) => {
            if (productCache.has(productId)) return productCache.get(productId);
            const p = await fetchJson(`${baseUrl}/shops/${encodeURIComponent(shopId)}/products/${encodeURIComponent(productId)}.json`);
            productCache.set(productId, p);
            return p;
          };

          const resolved = [];
          for (const item of items) {
            const p = await fetchProduct(item.productId);
            if (!p.ok || !p.data) {
              sendJson(res, p.status || 500, { ok: false, error: 'Failed to load product' });
              return;
            }

            const variants = Array.isArray(p.data?.variants) ? p.data.variants : [];
            const variant = variants.find((v) => Number(v?.id) === item.variantId);
            if (!variant) {
              sendJson(res, 400, { ok: false, error: 'Variant not found' });
              return;
            }
            if (variant?.is_enabled === false) {
              sendJson(res, 400, { ok: false, error: 'Variant disabled' });
              return;
            }

            const unitAmount = Number(variant?.price);
            if (!Number.isFinite(unitAmount) || unitAmount <= 0) {
              sendJson(res, 400, { ok: false, error: 'Invalid variant price' });
              return;
            }

            const currency = typeof p.data?.currency === 'string' ? p.data.currency.toLowerCase() : 'usd';
            const title = typeof p.data?.title === 'string' ? p.data.title : 'Printify Product';
            const variantTitle = typeof variant?.title === 'string' ? variant.title : '';
            const images = Array.isArray(p.data?.images) ? p.data.images : [];
            const imageUrl = images
              .map((img) => (typeof img?.src === 'string' ? img.src : null))
              .filter(Boolean)
              .find((u) => /[?&]camera_label=front\b/i.test(u)) || null;

            resolved.push({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              unitAmount,
              currency,
              name: variantTitle ? `${title} — ${variantTitle}` : title,
              imageUrl,
            });
          }

          const currency = resolved[0]?.currency || 'usd';
          if (resolved.some((i) => i.currency !== currency)) {
            sendJson(res, 400, { ok: false, error: 'Mixed currencies are not supported' });
            return;
          }

          let Stripe;
          try {
            Stripe = (await import('stripe')).default;
          } catch {
            sendJson(res, 500, { ok: false, error: 'Stripe dependency missing' });
            return;
          }

          const stripe = new Stripe(stripeSecret);
          const origin = `http://${req.headers.host}`;
          const itemsMetadata = resolved.map((i) => `${i.productId}:${i.variantId}:${i.quantity}`).join('|').slice(0, 450);
          try {
            const session = await stripe.checkout.sessions.create({
              mode: 'payment',
              success_url: `${origin}/merch?success=1`,
              cancel_url: `${origin}/merch/cart?canceled=1`,
              line_items: resolved.map((i) => ({
                quantity: i.quantity,
                price_data: {
                  currency,
                  unit_amount: i.unitAmount,
                  product_data: {
                    name: i.name,
                    ...(i.imageUrl ? { images: [i.imageUrl] } : {}),
                  },
                },
              })),
              shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'GB', 'AU', 'NZ', 'IE', 'DE', 'FR', 'ES', 'IT', 'NL', 'SE', 'NO', 'DK', 'FI'],
              },
              metadata: {
                printify_shop_id: shopId,
                printify_items: itemsMetadata,
              },
            });
            sendJson(res, 200, { ok: true, url: session.url });
          } catch (err) {
            const details =
              (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string' && err.message) || '';
            sendJson(res, 500, { ok: false, error: 'Checkout failed', ...(details ? { details: details.slice(0, 300) } : {}) });
          }
          return;
        }

        if (!token) {
          sendJson(res, 500, { ok: false, error: 'Missing Printify API token' });
          return;
        }

        const url = new URL(urlStr, 'http://localhost');
        const wantsShops = url.searchParams.get('shops') === '1' && url.pathname === '/api/printify-products';

        if (wantsShops) {
          const shops = await fetchJson(`${baseUrl}/shops.json`);
          if (!shops.ok) {
            sendJson(res, shops.status, { ok: false, error: 'Failed to load shops', details: shops.data });
            return;
          }
          sendJson(res, 200, { ok: true, shops: shops.data });
          return;
        }

        const shopId = await resolveShopId();
        if (!shopId) {
          sendJson(res, 500, { ok: false, error: 'No shops found for this token' });
          return;
        }

        if (url.pathname === '/api/printify-product') {
          const productId = String(url.searchParams.get('id') || url.searchParams.get('productId') || '').trim();
          if (!productId) {
            sendJson(res, 400, { ok: false, error: 'Missing product id' });
            return;
          }

          const productResp = await fetchJson(`${baseUrl}/shops/${encodeURIComponent(shopId)}/products/${encodeURIComponent(productId)}.json`);
          if (!productResp.ok) {
            sendJson(res, productResp.status, { ok: false, error: 'Failed to load product', details: productResp.data });
            return;
          }

          const images = Array.isArray(productResp.data?.images) ? productResp.data.images : [];
          const imageUrls = images
            .map((img) => (typeof img?.src === 'string' ? img.src : null))
            .filter(Boolean);

          const variants = Array.isArray(productResp.data?.variants) ? productResp.data.variants : [];
          const product = {
            id: productResp.data?.id ? String(productResp.data.id) : productId,
            title: typeof productResp.data?.title === 'string' ? productResp.data.title : '',
            description: typeof productResp.data?.description === 'string' ? productResp.data.description : '',
            image: pickPrimaryImage(imageUrls),
            images: imageUrls.slice(0, 12),
            currency: typeof productResp.data?.currency === 'string' ? productResp.data.currency : 'USD',
            variants: variants
              .map((v) => ({
                id: v?.id,
                title: typeof v?.title === 'string' ? v.title : '',
                price: Number.isFinite(Number(v?.price)) ? Number(v.price) : null,
                isEnabled: v?.is_enabled === undefined ? true : Boolean(v.is_enabled),
                isDefault: Boolean(v?.is_default),
                sku: typeof v?.sku === 'string' ? v.sku : '',
              }))
              .filter((v) => Number.isFinite(Number(v.id)) && v.title),
          };

          sendJson(res, 200, { ok: true, shopId, product });
          return;
        }

        const productsUrl = new URL(`${baseUrl}/shops/${encodeURIComponent(shopId)}/products.json`);
        productsUrl.searchParams.set('limit', '50');
        productsUrl.searchParams.set('page', '1');

        const productsResp = await fetchJson(productsUrl.toString());
        if (!productsResp.ok) {
          const apiError = productsResp.status === 404 ? 'Shop not found (check PRINTIFY_SHOP_ID or token access)' : 'Failed to load products';
          sendJson(res, productsResp.status, { ok: false, error: apiError, shopId, details: productsResp.data });
          return;
        }

        const products = Array.isArray(productsResp.data?.data)
          ? productsResp.data.data
          : Array.isArray(productsResp.data)
            ? productsResp.data
            : [];

        const normalized = products
          .map((p) => {
            const images = Array.isArray(p?.images) ? p.images : [];
            const variants = Array.isArray(p?.variants) ? p.variants : [];
            const prices = variants
              .filter((v) => v?.is_enabled !== false)
              .map((v) => Number(v?.price))
              .filter((n) => Number.isFinite(n) && n > 0);
            const minPrice = prices.length ? Math.min(...prices) : null;

            const external = p?.external && typeof p.external === 'object' ? p.external : null;
            const externalUrl = typeof external?.url === 'string' ? external.url : null;
            const externalHandle = typeof external?.handle === 'string' ? external.handle : null;
            const bestExternalLink = externalUrl || (externalHandle && /^https?:\/\//i.test(externalHandle) ? externalHandle : null);

            const imageUrls = images
              .map((img) => (typeof img?.src === 'string' ? img.src : null))
              .filter(Boolean)
              .slice(0, 12);

            return {
              id: p?.id ? String(p.id) : '',
              title: typeof p?.title === 'string' ? p.title : '',
              description: typeof p?.description === 'string' ? p.description : '',
              visible: Boolean(p?.visible),
              image: pickPrimaryImage(imageUrls),
              images: imageUrls.slice(0, 8),
              minPrice,
              currency: typeof p?.currency === 'string' ? p.currency : 'USD',
              externalLink: bestExternalLink,
            };
          })
          .filter((p) => p.id && p.title);

        sendJson(res, 200, { ok: true, shopId, products: normalized });
      });
    },
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), createPrintifyDevApiPlugin(env)],
    server: {
      host: true,
      port: 5173,
      strictPort: true,
    },
    optimizeDeps: {
      exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/core', '@ffmpeg/util'],
    },
  };
});
