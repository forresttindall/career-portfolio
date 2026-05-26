import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShoppingCart } from '@phosphor-icons/react';
import { useNavigate, useLocation } from 'react-router-dom';

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

const stop = (ev) => ev.stopPropagation();

const Merch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [banner, setBanner] = useState('');

  const [activeId, setActiveId] = useState(null);
  const [activeStatus, setActiveStatus] = useState('idle');
  const [activeError, setActiveError] = useState('');
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [activeLink, setActiveLink] = useState(null);
  const [variantId, setVariantId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [checkoutError, setCheckoutError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('success') === '1') {
      writeCart([]);
      setBanner('Payment received. Order is processing.');
      navigate('/merch', { replace: true });
      return;
    }
    if (params.get('canceled') === '1') {
      setBanner('Checkout canceled.');
      navigate('/merch', { replace: true });
    }
  }, [location.search, navigate]);

  useEffect(() => {
    const sync = () => {
      const items = readCart();
      const count = items.reduce((acc, i) => acc + (Number.isFinite(i.quantity) ? i.quantity : 0), 0);
      setCartCount(count);
    };
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

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setStatus('loading');
      setError('');
      try {
        const resp = await fetch('/api/printify-products', { method: 'GET' });
        const rawText = await resp.text();
        const contentType = resp.headers.get('content-type') || '';
        let data = null;
        try {
          data = rawText ? JSON.parse(rawText) : null;
        } catch {
          data = null;
        }

        const looksLikeHtml = contentType.includes('text/html') || /^\s*<!doctype html/i.test(rawText) || /^\s*<html/i.test(rawText);
        if (resp.ok && !data?.ok && looksLikeHtml) {
          throw new Error('API route not running (you are hitting the SPA fallback). Start `npm run dev:vercel` instead of `npm run dev`.');
        }

        if (!resp.ok || !data?.ok) {
          const apiError = typeof data?.error === 'string' ? data.error : '';
          const details = data?.details ? ` — ${typeof data.details === 'string' ? data.details : JSON.stringify(data.details)}` : '';
          const hint =
            resp.status === 404
              ? ' (API route not found — use Vercel dev for local API routes)'
              : resp.status === 500 && apiError.includes('Missing Printify API token')
                ? ' (set PRINTIFY_API_TOKEN in .env and restart)'
                : '';
          throw new Error(apiError ? `${apiError}${details}${hint}` : `Failed to load merch (HTTP ${resp.status})${hint}`);
        }
        if (cancelled) return;
        setProducts(Array.isArray(data.products) ? data.products : []);
        setStatus('success');
      } catch (e) {
        if (cancelled) return;
        setStatus('error');
        setError(e instanceof Error ? e.message : 'Failed to load merch');
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  const visibleProducts = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    const visible = list.filter((p) => p?.visible !== false);
    return (visible.length ? visible : list).filter((p) => p?.id && p?.title);
  }, [products]);

  const openProduct = async (p) => {
    setActiveId(p.id);
    setActiveStatus('loading');
    setActiveError('');
    setActiveProduct(null);
    setActiveImage(null);
    setActiveLink(typeof p?.externalLink === 'string' ? p.externalLink : null);
    setVariantId('');
    setQuantity(1);
    setCheckoutError('');
    try {
      const resp = await fetch(`/api/printify-product?id=${encodeURIComponent(p.id)}`);
      const data = await resp.json().catch(() => null);
      if (!resp.ok || !data?.ok) throw new Error(data?.error || 'Failed to load product');
      const product = data.product;
      const variants = Array.isArray(product?.variants) ? product.variants : [];
      const enabled = variants.filter((v) => v?.isEnabled !== false);
      const defaultVariant = enabled.find((v) => v?.isDefault) || enabled[0] || variants[0] || null;
      const firstImage = product?.image || (Array.isArray(product?.images) && product.images[0]) || null;
      setActiveProduct(product);
      setActiveImage(firstImage);
      setVariantId(defaultVariant?.id ? String(defaultVariant.id) : '');
      setActiveStatus('success');
    } catch (e) {
      setActiveStatus('error');
      setActiveError(e instanceof Error ? e.message : 'Failed to load product');
    }
  };

  const closeProduct = () => {
    setActiveId(null);
    setActiveStatus('idle');
    setActiveError('');
    setActiveProduct(null);
    setActiveImage(null);
    setActiveLink(null);
    setVariantId('');
    setQuantity(1);
    setCheckoutError('');
  };

  const activeVariant = useMemo(() => {
    const variants = Array.isArray(activeProduct?.variants) ? activeProduct.variants : [];
    return variants.find((v) => String(v?.id) === String(variantId)) || null;
  }, [activeProduct, variantId]);

  const addToCart = () => {
    if (!activeProduct?.id) return;
    if (!variantId) return;
    const qty = Math.max(1, Math.min(10, Number(quantity) || 1));
    const items = readCart();
    const idx = items.findIndex((i) => i.productId === activeProduct.id && i.variantId === String(variantId));
    if (idx >= 0) {
      const nextQty = Math.max(1, Math.min(10, (Number(items[idx].quantity) || 0) + qty));
      const next = items.slice();
      next[idx] = { ...next[idx], quantity: nextQty };
      writeCart(next);
    } else {
      writeCart([...items, { productId: activeProduct.id, variantId: String(variantId), quantity: qty }]);
    }
    setCheckoutError('Added to cart.');
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
            <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <h1 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>MERCHBASE</h1>
              <div className="small-text" style={{ color: GRAY1 }}>INDEX (06)</div>
            </div>
            <button
              type="button"
              className="merch-cart-button"
              onClick={() => navigate('/merch/cart')}
              aria-label="Open cart"
            >
              <ShoppingCart size={18} weight="thin" />
              {cartCount > 0 ? <span className="merch-cart-badge">{cartCount}</span> : null}
            </button>
          </header>
          <div style={{ height: 1, background: 'var(--color-border)', marginTop: 'var(--spacing-sm)' }} aria-hidden="true" />
          <div className="small-text" style={{ marginTop: 'var(--spacing-md)', maxWidth: 760, opacity: 0.85 }}>
            Limited Run Goods
          </div>
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
            <div className="small-text" style={{ color: GRAY1 }}>
              {error || 'Failed to load merch.'}
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="small-text" style={{ color: GRAY1 }}>No products found.</div>
          ) : (
            <div className="merch-grid">
              {visibleProducts.map((p) => {
                const image = p.image || (Array.isArray(p.images) && p.images[0]) || null;
                const priceText = Number.isFinite(p.minPrice) ? formatMoney(p.minPrice, p.currency) : '';
                const isOpen = activeId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    className="merch-card"
                    aria-haspopup="dialog"
                    aria-expanded={isOpen}
                    onClick={() => openProduct(p)}
                  >
                    <div className="merch-card__media">
                      {image ? (
                        <img src={image} alt={p.title} loading="lazy" decoding="async" />
                      ) : (
                        <div className="merch-card__media-empty small-text" style={{ color: GRAY1 }}>No image</div>
                      )}
                    </div>
                    <div className="merch-card__meta">
                      <div className="merch-card__title">{p.title}</div>
                      <div className="merch-card__price small-text" style={{ color: GRAY1 }}>
                        {priceText || ' '}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {activeId && (
        <div className="merch-modal" role="dialog" aria-modal="true" onClick={closeProduct}>
          <div className="merch-modal__panel" onClick={stop}>
            <div className="merch-modal__top">
              <div style={{ display: 'grid', gap: 6 }}>
                <div className="small-text" style={{ color: GRAY1 }}>PRODUCT</div>
                <div className="merch-modal__title">{activeProduct?.title || 'Loading…'}</div>
              </div>
              <button type="button" className="merch-modal__close" onClick={closeProduct} aria-label="Close">
                Close
              </button>
            </div>

            {activeStatus === 'loading' ? (
              <div className="small-text" style={{ color: GRAY1, padding: 16 }}>Loading…</div>
            ) : activeStatus === 'error' ? (
              <div className="small-text" style={{ color: GRAY1, padding: 16 }}>{activeError}</div>
            ) : (
              <div className="merch-modal__body">
                <div className="merch-modal__media">
                  {activeImage ? (
                    <img src={activeImage} alt={activeProduct?.title || ''} />
                  ) : (
                    <div className="merch-card__media-empty small-text" style={{ color: GRAY1 }}>No image</div>
                  )}
                  {Array.isArray(activeProduct?.images) && activeProduct.images.length > 1 && (
                    <div className="merch-modal__thumbs">
                      {activeProduct.images.slice(0, 8).map((src) => (
                        <button
                          key={src}
                          type="button"
                          className="merch-modal__thumb"
                          onClick={() => setActiveImage(src)}
                          aria-label="Select image"
                        >
                          <img src={src} alt="" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="merch-modal__controls">
                  <div className="merch-modal__row">
                    <label className="small-text" style={{ color: GRAY1 }}>Variant</label>
                    <select
                      className="merch-input"
                      value={variantId}
                      onChange={(ev) => setVariantId(ev.target.value)}
                    >
                      {(Array.isArray(activeProduct?.variants) ? activeProduct.variants : [])
                        .filter((v) => v?.isEnabled !== false)
                        .map((v) => {
                          const price = Number.isFinite(v.price) ? formatMoney(v.price, activeProduct?.currency) : '';
                          return (
                            <option key={v.id} value={String(v.id)}>
                              {price ? `${v.title} — ${price}` : v.title}
                            </option>
                          );
                        })}
                    </select>
                  </div>

                  <div className="merch-modal__row">
                    <label className="small-text" style={{ color: GRAY1 }}>Quantity</label>
                    <input
                      className="merch-input"
                      type="number"
                      min={1}
                      max={10}
                      value={quantity}
                      onChange={(ev) => setQuantity(Math.max(1, Math.min(10, Number(ev.target.value) || 1)))}
                    />
                  </div>

                  {activeVariant?.price !== null ? (
                    <div className="small-text" style={{ color: GRAY1 }}>
                      Item: {formatMoney(activeVariant.price, activeProduct?.currency)}
                    </div>
                  ) : null}

                  {activeLink ? (
                    <a href={activeLink} target="_blank" rel="noreferrer" className="small-text" style={{ color: GRAY1 }}>
                      View in store
                    </a>
                  ) : null}

                  {checkoutError ? (
                    <div className="small-text" style={{ color: GRAY1 }}>
                      {checkoutError}
                    </div>
                  ) : null}

                  <button
                    type="button"
                    className="newsletter-button"
                    onClick={addToCart}
                    disabled={!variantId}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Add to cart
                    <ArrowUpRight size={14} weight="thin" />
                  </button>

                  <button
                    type="button"
                    className="small-text"
                    style={{ border: `1px solid ${GRAY2}`, borderRadius: 12, padding: '10px 12px', background: 'transparent', cursor: 'pointer' }}
                    onClick={() => navigate('/merch/cart')}
                  >
                    View cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Merch;
