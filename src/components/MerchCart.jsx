import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
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

const writeCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('merchbase-cart'));
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

const MerchCart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState([]);
  const [productMap, setProductMap] = useState({});
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [banner, setBanner] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('canceled') === '1') {
      setBanner('Checkout canceled.');
      navigate('/merch/cart', { replace: true });
    }
  }, [location.search, navigate]);

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
      if (distinctProductIds.length === 0) {
        setProductMap({});
        setStatus('success');
        setError('');
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
        setError(e instanceof Error ? e.message : 'Failed to load cart');
      }
    };
    run();
    return () => { cancelled = true; };
  }, [distinctProductIds]);

  const rows = useMemo(() => {
    return cart.map((item) => {
      const p = productMap[item.productId] || null;
      const variants = Array.isArray(p?.variants) ? p.variants : [];
      const v = variants.find((vv) => String(vv?.id) === String(item.variantId)) || null;
      const unit = Number.isFinite(v?.price) ? v.price : null;
      return {
        key: `${item.productId}:${item.variantId}`,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        title: p?.title || item.productId,
        image: p?.image || (Array.isArray(p?.images) && p.images[0]) || null,
        variantTitle: v?.title || item.variantId,
        currency: p?.currency || 'USD',
        unitPrice: unit,
        lineTotal: unit !== null ? unit * item.quantity : null,
      };
    });
  }, [cart, productMap]);

  const subtotal = useMemo(() => {
    const totals = rows.map((r) => r.lineTotal).filter((n) => Number.isFinite(n));
    return totals.length ? totals.reduce((a, b) => a + b, 0) : null;
  }, [rows]);

  const setQty = (productId, variantId, qty) => {
    const next = readCart()
      .map((i) => {
        if (i.productId === productId && i.variantId === variantId) return { ...i, quantity: qty };
        return i;
      })
      .filter((i) => i.quantity > 0);
    writeCart(next);
  };

  const removeItem = (productId, variantId) => {
    const next = readCart().filter((i) => !(i.productId === productId && i.variantId === variantId));
    writeCart(next);
  };

  const clearCart = () => {
    writeCart([]);
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
            <h1 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>CART</h1>
            <button
              type="button"
              className="small-text"
              style={{ border: `1px solid ${GRAY2}`, borderRadius: 12, padding: '10px 12px', background: 'transparent', cursor: 'pointer' }}
              onClick={() => navigate('/merch')}
            >
              Back
            </button>
          </header>
          <div style={{ height: 1, background: 'var(--color-border)', marginTop: 'var(--spacing-sm)' }} aria-hidden="true" />
          {banner ? (
            <div className="small-text" style={{ marginTop: 10, color: GRAY1 }}>
              {banner}
            </div>
          ) : null}
        </div>
      </section>

      <section style={{ padding: 'var(--spacing-xl) var(--spacing-md) var(--spacing-xxl)' }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          {status === 'loading' ? (
            <div className="small-text" style={{ color: GRAY1 }}>Loading…</div>
          ) : status === 'error' ? (
            <div className="small-text" style={{ color: GRAY1 }}>{error}</div>
          ) : rows.length === 0 ? (
            <div className="small-text" style={{ color: GRAY1 }}>Your cart is empty.</div>
          ) : (
            <div className="merch-layout">
              <div className="merch-cart-list">
                {rows.map((r) => (
                  <div key={r.key} className="merch-cart-item">
                    <div className="merch-cart-item__media">
                      {r.image ? <img src={r.image} alt="" /> : null}
                    </div>
                    <div className="merch-cart-item__content">
                      <div className="merch-cart-item__top">
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-mono-weight-bold)', letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1.2 }}>
                          {r.title}
                        </div>
                        <button type="button" className="small-text" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: GRAY1 }} onClick={() => removeItem(r.productId, r.variantId)}>
                          Remove
                        </button>
                      </div>
                      <div className="small-text" style={{ color: GRAY1 }}>
                        {r.variantTitle}
                      </div>
                      <div className="merch-cart-item__bottom">
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <div className="small-text" style={{ color: GRAY1 }}>Qty</div>
                          <input
                            className="merch-input"
                            style={{ width: 96 }}
                            type="number"
                            min={1}
                            max={10}
                            value={r.quantity}
                            onChange={(ev) => setQty(r.productId, r.variantId, Math.max(1, Math.min(10, Number(ev.target.value) || 1)))}
                          />
                        </div>
                        <div className="small-text" style={{ color: GRAY1 }}>
                          {Number.isFinite(r.unitPrice) ? `${formatMoney(r.unitPrice, r.currency)} ea` : ''}
                          {Number.isFinite(r.lineTotal) ? ` • ${formatMoney(r.lineTotal, r.currency)}` : ''}
                        </div>
                      </div>
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

                <button
                  type="button"
                  className="newsletter-button"
                  onClick={() => navigate('/merch/checkout')}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Checkout
                  <ArrowUpRight size={14} weight="thin" />
                </button>

                <button
                  type="button"
                  className="small-text"
                  style={{ border: `1px solid ${GRAY2}`, borderRadius: 12, padding: '10px 12px', background: 'transparent', cursor: 'pointer' }}
                  onClick={clearCart}
                >
                  Clear cart
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default MerchCart;
