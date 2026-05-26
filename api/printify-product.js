export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const token = process.env.PRINTIFY_API_TOKEN;
  const shopId = String(process.env.PRINTIFY_SHOP_ID ?? '').trim();
  if (!token) {
    res.status(500).json({ ok: false, error: 'Missing Printify API token' });
    return;
  }
  if (!shopId) {
    res.status(500).json({ ok: false, error: 'Missing Printify shop id' });
    return;
  }

  const productId = String(req.query?.id ?? req.query?.productId ?? '').trim();
  if (!productId) {
    res.status(400).json({ ok: false, error: 'Missing product id' });
    return;
  }

  const baseUrl = 'https://api.printify.com/v1';

  try {
    const resp = await fetch(`${baseUrl}/shops/${encodeURIComponent(shopId)}/products/${encodeURIComponent(productId)}.json`, {
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

    if (!resp.ok) {
      res.status(resp.status).json({ ok: false, error: 'Failed to load product', details: data });
      return;
    }

    const images = Array.isArray(data?.images) ? data.images : [];
    const imageUrls = images
      .map((img) => (typeof img?.src === 'string' ? img.src : null))
      .filter(Boolean);

    const pickPrimaryImage = (urls) => {
      const list = Array.isArray(urls) ? urls.filter(Boolean) : [];
      const front = list.find((u) => typeof u === 'string' && /[?&]camera_label=front\b/i.test(u));
      if (front) return front;
      const clean = list.find((u) => typeof u === 'string' && !/[?&]camera_label=context/i.test(u));
      return clean || list[0] || null;
    };

    const variants = Array.isArray(data?.variants) ? data.variants : [];
    const normalized = {
      id: data?.id ? String(data.id) : productId,
      title: typeof data?.title === 'string' ? data.title : '',
      description: typeof data?.description === 'string' ? data.description : '',
      image: pickPrimaryImage(imageUrls),
      images: imageUrls.slice(0, 12),
      currency: typeof data?.currency === 'string' ? data.currency : 'USD',
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

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    res.status(200).json({ ok: true, shopId, product: normalized });
  } catch {
    res.status(500).json({ ok: false, error: 'Request failed' });
  }
}
