import Stripe from 'stripe';

const stripeErrorToSafeMessage = (err) => {
  const message =
    (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string' && err.message) ||
    (err &&
      typeof err === 'object' &&
      'raw' in err &&
      err.raw &&
      typeof err.raw === 'object' &&
      'message' in err.raw &&
      typeof err.raw.message === 'string' &&
      err.raw.message) ||
    '';
  return message ? message.slice(0, 300) : '';
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    res.status(500).json({ ok: false, error: 'Missing Stripe secret key' });
    return;
  }

  const printifyToken = process.env.PRINTIFY_API_TOKEN;
  const printifyShopId = String(process.env.PRINTIFY_SHOP_ID ?? '').trim();
  if (!printifyToken) {
    res.status(500).json({ ok: false, error: 'Missing Printify API token' });
    return;
  }
  if (!printifyShopId) {
    res.status(500).json({ ok: false, error: 'Missing Printify shop id' });
    return;
  }

  let body = req.body;
  try {
    if (typeof body === 'string') body = JSON.parse(body);
  } catch {
    res.status(400).json({ ok: false, error: 'Invalid JSON' });
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
    res.status(400).json({ ok: false, error: 'Cart is empty' });
    return;
  }
  if (items.length > 20) {
    res.status(400).json({ ok: false, error: 'Too many items' });
    return;
  }
  if (items.some((i) => i.quantity < 1 || i.quantity > 10)) {
    res.status(400).json({ ok: false, error: 'Invalid quantity' });
    return;
  }

  const origin =
    String(req.headers['x-forwarded-proto'] || '').includes('https')
      ? `https://${req.headers.host}`
      : `http://${req.headers.host}`;

  const baseUrl = 'https://api.printify.com/v1';

  try {
    const productCache = new Map();
    const fetchProduct = async (productId) => {
      if (productCache.has(productId)) return productCache.get(productId);
      const resp = await fetch(
        `${baseUrl}/shops/${encodeURIComponent(printifyShopId)}/products/${encodeURIComponent(productId)}.json`,
        {
          headers: {
            Authorization: `Bearer ${printifyToken}`,
            Accept: 'application/json',
          },
        }
      );
      const text = await resp.text();
      let data;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }
      const value = { ok: resp.ok, status: resp.status, data };
      productCache.set(productId, value);
      return value;
    };

    const resolved = [];
    for (const item of items) {
      const p = await fetchProduct(item.productId);
      if (!p.ok || !p.data) {
        res.status(p.status || 500).json({ ok: false, error: 'Failed to load product' });
        return;
      }

      const variants = Array.isArray(p.data?.variants) ? p.data.variants : [];
      const variant = variants.find((v) => Number(v?.id) === item.variantId);
      if (!variant) {
        res.status(400).json({ ok: false, error: 'Variant not found' });
        return;
      }
      if (variant?.is_enabled === false) {
        res.status(400).json({ ok: false, error: 'Variant disabled' });
        return;
      }

      const unitAmount = Number(variant?.price);
      if (!Number.isFinite(unitAmount) || unitAmount <= 0) {
        res.status(400).json({ ok: false, error: 'Invalid variant price' });
        return;
      }

      const currency = typeof p.data?.currency === 'string' ? p.data.currency.toLowerCase() : 'usd';
      const title = typeof p.data?.title === 'string' ? p.data.title : 'Printify Product';
      const variantTitle = typeof variant?.title === 'string' ? variant.title : '';
      const images = Array.isArray(p.data?.images) ? p.data.images : [];
      const imageUrl =
        images
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
      res.status(400).json({ ok: false, error: 'Mixed currencies are not supported' });
      return;
    }

    const stripe = new Stripe(stripeSecret);
    const itemsMetadata = resolved.map((i) => `${i.productId}:${i.variantId}:${i.quantity}`).join('|').slice(0, 450);

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
        printify_shop_id: printifyShopId,
        printify_items: itemsMetadata,
      },
    });

    res.status(200).json({ ok: true, url: session.url });
  } catch (err) {
    const details = stripeErrorToSafeMessage(err);
    res.status(500).json({ ok: false, error: 'Checkout failed', ...(details ? { details } : {}) });
  }
}
