import Stripe from 'stripe';

const readRawBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
};

const splitName = (fullName) => {
  const safe = String(fullName || '').trim().replace(/\s+/g, ' ').slice(0, 120);
  if (!safe) return { first: '', last: '' };
  const parts = safe.split(' ');
  return { first: parts[0] || '', last: parts.slice(1).join(' ') || '' };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeSecret || !webhookSecret) {
    res.status(500).json({ ok: false, error: 'Missing Stripe webhook configuration' });
    return;
  }

  const printifyToken = process.env.PRINTIFY_API_TOKEN;
  if (!printifyToken) {
    res.status(500).json({ ok: false, error: 'Missing Printify API token' });
    return;
  }

  const signature = req.headers['stripe-signature'];
  if (!signature) {
    res.status(400).json({ ok: false, error: 'Missing Stripe signature' });
    return;
  }

  const stripe = new Stripe(stripeSecret);
  let event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    res.status(400).json({ ok: false, error: 'Invalid signature' });
    return;
  }

  if (event.type !== 'checkout.session.completed') {
    res.status(200).json({ ok: true });
    return;
  }

  let session = event.data?.object;
  if (session?.id && (!session?.metadata || !session?.shipping_details || !session?.customer_details)) {
    try {
      session = await stripe.checkout.sessions.retrieve(String(session.id));
    } catch {
      res.status(200).json({ ok: true });
      return;
    }
  }

  const metadata = session?.metadata || {};
  const shopId = String(metadata.printify_shop_id || '').trim();
  const itemsRaw = String(metadata.printify_items || '').trim();
  const items = itemsRaw
    ? itemsRaw
        .split('|')
        .map((part) => {
          const [productId, variantId, quantity] = String(part || '').split(':');
          return {
            productId: String(productId || '').trim(),
            variantId: Number(variantId),
            quantity: Number(quantity),
          };
        })
        .filter((i) => i.productId && Number.isFinite(i.variantId) && Number.isFinite(i.quantity) && i.quantity > 0)
    : [];

  if (!shopId || items.length === 0) {
    res.status(200).json({ ok: true });
    return;
  }

  const shipping = session?.shipping_details;
  const email = String(session?.customer_details?.email || '').trim();
  const name = splitName(shipping?.name || session?.customer_details?.name || '');
  const address = shipping?.address || session?.customer_details?.address || null;

  const address1 = String(address?.line1 || '').trim();
  const address2 = String(address?.line2 || '').trim();
  const city = String(address?.city || '').trim();
  const region = String(address?.state || '').trim();
  const zip = String(address?.postal_code || '').trim();
  const country = String(address?.country || '').trim();

  if (!email || !name.first || !name.last || !address1 || !city || !region || !zip || !country) {
    res.status(200).json({ ok: true });
    return;
  }

  const baseUrl = 'https://api.printify.com/v1';
  const externalId = `cb-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  try {
    const resp = await fetch(`${baseUrl}/shops/${encodeURIComponent(shopId)}/orders.json`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${printifyToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        external_id: externalId,
        label: `Merchbase Order ${externalId}`,
        line_items: items.map((i) => ({
          product_id: i.productId,
          variant_id: i.variantId,
          quantity: i.quantity,
        })),
        send_shipping_notification: true,
        address_to: {
          first_name: name.first,
          last_name: name.last,
          email,
          address1,
          ...(address2 ? { address2 } : {}),
          city,
          region,
          zip,
          country,
        },
      }),
    });

    if (!resp.ok) {
      res.status(200).json({ ok: true });
      return;
    }

    res.status(200).json({ ok: true });
  } catch {
    res.status(200).json({ ok: true });
  }
}
