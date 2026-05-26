export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const token = process.env.PRINTIFY_API_TOKEN;
  if (!token) {
    res.status(500).json({ ok: false, error: 'Missing Printify API token' });
    return;
  }

  const baseUrl = 'https://api.printify.com/v1';
  const authHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };

  const resolveShopId = async () => {
    const envShopId = String(process.env.PRINTIFY_SHOP_ID ?? '').trim();
    if (envShopId) return envShopId;

    const shopsResp = await fetch(`${baseUrl}/shops.json`, { headers: authHeaders });
    const shopsText = await shopsResp.text();
    let shopsData;
    try {
      shopsData = shopsText ? JSON.parse(shopsText) : null;
    } catch {
      shopsData = null;
    }

    if (!shopsResp.ok) {
      const details = shopsData ?? shopsText;
      const status = typeof shopsResp.status === 'number' ? shopsResp.status : 502;
      res.status(status).json({ ok: false, error: 'Failed to load shops', details });
      return null;
    }

    const firstShopId = Array.isArray(shopsData) && shopsData[0]?.id ? String(shopsData[0].id) : '';
    if (!firstShopId) {
      res.status(500).json({ ok: false, error: 'No shops found for this token' });
      return null;
    }

    return firstShopId;
  };

  try {
    const wantsShops = String(req.query?.shops ?? '').trim() === '1';
    if (wantsShops) {
      const shopsResp = await fetch(`${baseUrl}/shops.json`, { headers: authHeaders });
      const shopsText = await shopsResp.text();
      let shopsData;
      try {
        shopsData = shopsText ? JSON.parse(shopsText) : null;
      } catch {
        shopsData = shopsText;
      }

      if (!shopsResp.ok) {
        res.status(shopsResp.status).json({ ok: false, error: 'Failed to load shops', details: shopsData });
        return;
      }

      res.status(200).json({ ok: true, shops: shopsData });
      return;
    }

    const shopId = await resolveShopId();
    if (!shopId) return;

    const url = new URL(`${baseUrl}/shops/${encodeURIComponent(shopId)}/products.json`);
    url.searchParams.set('limit', '50');
    url.searchParams.set('page', '1');

    const resp = await fetch(url.toString(), { headers: authHeaders });
    const text = await resp.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!resp.ok) {
      const apiError =
        resp.status === 404
          ? 'Shop not found (check PRINTIFY_SHOP_ID or token access)'
          : 'Failed to load products';
      res.status(resp.status).json({ ok: false, error: apiError, shopId, details: data });
      return;
    }

    const products = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    const pickPrimaryImage = (urls) => {
      const list = Array.isArray(urls) ? urls.filter(Boolean) : [];
      const front = list.find((u) => typeof u === 'string' && /[?&]camera_label=front\b/i.test(u));
      if (front) return front;
      const clean = list.find((u) => typeof u === 'string' && !/[?&]camera_label=context/i.test(u));
      return clean || list[0] || null;
    };

    const normalized = products.map((p) => {
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
      const bestExternalLink =
        externalUrl ||
        (externalHandle && /^https?:\/\//i.test(externalHandle) ? externalHandle : null);

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
    }).filter((p) => p.id && p.title);

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    res.status(200).json({ ok: true, shopId, products: normalized });
  } catch {
    res.status(500).json({ ok: false, error: 'Request failed' });
  }
}
