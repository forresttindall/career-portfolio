import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';

const BLACK = '#FFFFFF';
const GRAY1 = 'rgba(17, 17, 17, 0.56)';
const GRAY2 = '#C9C9C9';
const WHITE = '#111111';
const CART_KEY = 'merchbase-cart-v1';

const readCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const data = raw ? JSON.parse(raw) : null;
    const items = Array.isArray(data) ? data : [];
    return items
      .map((i) => ({
        productId: String(i?.productId || '').trim(),
        variantId: String(i?.variantId || '').trim(),
        quantity: Number(i?.quantity),
      }))
      .filter((i) => i.productId && i.variantId && Number.isFinite(i.quantity) && i.quantity > 0);
  } catch {
    return [];
  }
};

const formatMoney = (value, currency) => {
  if (!Number.isFinite(value)) return '';
  const amount = value / 100;
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
};

const MerchCheckout = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);
  const [productMap, setProductMap] = useState({});

  const [checkoutStatus, setCheckoutStatus] = useState('idle');
  const [checkoutError, setCheckoutError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const sync = () => setCart(readCart());
    sync();
    const onStorage = (ev) => {
      if (ev.key === CART_KEY) sync();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('merchbase-cart', sync);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('merchbase-cart', sync);
    };
  }, []);

  const distinctProductIds = useMemo(() => {
    const ids = new Set();
    cart.forEach((i) => ids.add(i.productId));
    return [...ids];
  }, [cart]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (cart.length === 0) {
        setStatus('success');
        setError('');
        setProductMap({});
        return;
      }
      setStatus('loading');
      setError('');
      try {
        const entries = await Promise.all(
          distinctProductIds.map(async (id) => {
            const resp = await fetch(`/api/printify-product?id=${encodeURIComponent(id)}`);
            const data = await resp.json().catch(() => null);
            if (!resp.ok || !data?.ok) throw new Error(data?.error || 'Failed to load product');
            return [id, data.product];
          })
        );
        if (cancelled) return;
        setProductMap(Object.fromEntries(entries));
        setStatus('success');
      } catch (e) {
        if (cancelled) return;
        setStatus('error');
        setError(e instanceof Error ? e.message : 'Failed to load checkout');
      }
    };
    run();
    return () => { cancelled = true; };
  }, [cart, distinctProductIds]);

  const rows = useMemo(() => {
    return cart.map((item) => {
      const p = productMap[item.productId] || null;
      const variants = Array.isArray(p?.variants) ? p.variants : [];
      const v = variants.find((vv) => String(vv?.id) === String(item.variantId)) || null;
      const unit = Number.isFinite(v?.price) ? v.price : null;
      return {
        key: `${item.productId}:${item.variantId}`,
        title: p?.title || item.productId,
        variantTitle: v?.title || item.variantId,
        currency: p?.currency || 'USD',
        unitPrice: unit,
        quantity: item.quantity,
        lineTotal: unit !== null ? unit * item.quantity : null,
      };
    });
  }, [cart, productMap]);

  const subtotal = useMemo(() => {
    const totals = rows.map((r) => r.lineTotal).filter((n) => Number.isFinite(n));
    return totals.length ? totals.reduce((a, b) => a + b, 0) : null;
  }, [rows]);

  const startCheckout = async () => {
    if (cart.length === 0) return;
    if (checkoutStatus === 'loading') return;
    setCheckoutStatus('loading');
    setCheckoutError('');
    try {
      const resp = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
        }),
      });
      const data = await resp.json().catch(() => null);
      if (!resp.ok || !data?.ok || typeof data?.url !== 'string') {
        const msg = typeof data?.error === 'string' && data.error ? data.error : 'Checkout failed';
        const details = typeof data?.details === 'string' && data.details ? data.details : '';
        throw new Error(details ? `${msg}: ${details}` : msg);
      }
      window.location.href = data.url;
    } catch (e) {
      setCheckoutStatus('error');
      setCheckoutError(e instanceof Error ? e.message : 'Checkout failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-header-theme="light"
      style={{ background: BLACK, color: WHITE, minHeight: '100vh' }}
      role="main"
    >
      <section style={{ padding: 'var(--spacing-xxl) var(--spacing-md) var(--spacing-xl)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          <header className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
            <h1 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>CHECKOUT</h1>
            <button
              type="button"
              className="small-text"
              style={{ border: `1px solid ${GRAY2}`, borderRadius: 12, padding: '10px 12px', background: 'transparent', cursor: 'pointer' }}
              onClick={() => navigate('/merch/cart')}
            >
              Back
            </button>
          </header>
          <div style={{ height: 1, background: 'var(--color-border)', marginTop: 'var(--spacing-sm)' }} aria-hidden="true" />
          <div className="small-text" style={{ marginTop: 'var(--spacing-md)', maxWidth: 760, opacity: 0.85 }}>
            Secure payment powered by Stripe.
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--spacing-xl) var(--spacing-md) var(--spacing-xxl)' }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          {status === 'loading' ? (
            <div className="small-text" style={{ color: GRAY1 }}>Loading…</div>
          ) : status === 'error' ? (
            <div className="small-text" style={{ color: GRAY1 }}>{error}</div>
          ) : cart.length === 0 ? (
            <div className="small-text" style={{ color: GRAY1 }}>
              Your cart is empty.
            </div>
          ) : (
            <div className="merch-layout">
              <div className="merch-panel" style={{ gap: 10 }}>
                <div className="small-text" style={{ color: GRAY1 }}>Items</div>
                {rows.map((r) => (
                  <div key={r.key} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-mono-weight-bold)', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.2 }}>
                        {r.title}
                      </div>
                      <div className="small-text" style={{ color: GRAY1 }}>
                        {r.variantTitle} • Qty {r.quantity}
                      </div>
                    </div>
                    <div className="small-text" style={{ color: GRAY1, whiteSpace: 'nowrap' }}>
                      {Number.isFinite(r.lineTotal) ? formatMoney(r.lineTotal, r.currency) : '—'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="merch-panel">
                <div className="small-text" style={{ color: GRAY1 }}>Summary</div>
                <div className="small-text" style={{ color: GRAY1 }}>
                  Subtotal: {subtotal !== null ? formatMoney(subtotal, rows[0]?.currency) : '—'}
                </div>
                <div className="small-text" style={{ color: GRAY1 }}>
                  Shipping + tax calculated at checkout.
                </div>

                {checkoutError ? (
                  <div className="small-text" style={{ color: GRAY1 }}>{checkoutError}</div>
                ) : null}

                <button
                  type="button"
                  className="newsletter-button"
                  onClick={startCheckout}
                  disabled={checkoutStatus === 'loading'}
                  style={{ width: '100%', justifyContent: 'center', opacity: checkoutStatus === 'loading' ? 0.6 : 1 }}
                >
                  Pay with Stripe
                  <ArrowUpRight size={14} weight="thin" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default MerchCheckout;
