import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DecryptText from './DecryptText';

const BLACK = 'var(--color-bg)';
const WHITE = 'var(--color-text)';

const WIM_IMAGES = 
[{ src: '/images/wim software.webp', alt: 'WIM software mockup' },
   { src: '/images/wim typemark.webp', alt: 'WIM typemark' },
    { src: '/images/wim logomark.webp', alt: 'WIM logomark' },
  { src: '/images/wim safety shirt.webp', alt: 'WIM safety shirt mockup' },
 
 { src: '/images/wim truck mockup.webp', alt: 'WIM truck mockup' },
  { src: '/images/wim HAT MOCKUP.webp', alt: 'WIM hat mockup' },
  
  
];

const WimProject = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [readMoreOpen, setReadMoreOpen] = useState(false);
  const [loadedBySrc, setLoadedBySrc] = useState({});

  useEffect(() => {
    if (readMoreOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('wim-info-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('wim-info-open');
    }
    const handleNavClick = (ev) => {
      const el = ev.target.closest('.site-nav__menu-toggle');
      if (readMoreOpen && el) {
        ev.preventDefault();
        ev.stopPropagation();
        setReadMoreOpen(false);
      }
    };
    document.addEventListener('click', handleNavClick, true);
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('wim-info-open');
      document.removeEventListener('click', handleNavClick, true);
    };
  }, [readMoreOpen]);

  useEffect(() => {
    const adjustRowHeights = () => {
      const rows = Array.from(document.querySelectorAll('.wim-row'));
      rows.forEach((row) => {
        const frames = Array.from(row.querySelectorAll('.wim-frame'));
        const imgs = Array.from(row.querySelectorAll('.wim-frame img'));
        if (frames.length !== imgs.length || frames.length === 0) return;
        const heights = imgs.map((img, idx) => {
          const frame = frames[idx];
          const w = frame.getBoundingClientRect().width;
          const naturalW = img.naturalWidth || w;
          const naturalH = img.naturalHeight || w;
          const ratio = naturalH / naturalW;
          return Math.max(0, Math.round(w * ratio));
        });
        const minH = Math.min(...heights);
        frames.forEach((frame) => {
          frame.style.height = `${minH}px`;
        });
      });
    };
    const onLoad = (ev) => {
      if (ev && ev.target && ev.target.tagName === 'IMG') adjustRowHeights();
    };
    document.addEventListener('load', onLoad, true);
    window.addEventListener('resize', adjustRowHeights);
    const raf = requestAnimationFrame(adjustRowHeights);
    return () => {
      document.removeEventListener('load', onLoad, true);
      window.removeEventListener('resize', adjustRowHeights);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <motion.div
      className="wim-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-header-theme="light"
      style={{ background: BLACK, color: WHITE, minHeight: '100vh' }}
    >
      <section data-header-theme="light" style={{ position: 'relative', overflow: 'hidden', background: BLACK, color: WHITE }}>
        <div style={{ minHeight: '42vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 'var(--spacing-lg)', padding: 'var(--spacing-md) var(--spacing-md) var(--spacing-sm)', position: 'relative', zIndex: 1 }}>
          <h1 className="home-hero__title" style={{ marginBottom: 'auto' }}>
            <div style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
              <DecryptText as="span" text="WAREHOUSE INTELLIGENCE" trigger="mount" delay={200} duration={900} />
            </div>
          </h1>
        </div>
      </section>

      <button
        type="button"
        className="wim-readmore"
        aria-label="Read more"
        onClick={() => setReadMoreOpen(true)}
      >
        <div className="wim-readmore__track">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="wim-readmore__item small-text">
              READ MORE •
            </span>
          ))}
        </div>
      </button>

      {readMoreOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="wim-overlay"
          onClick={() => setReadMoreOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(26px)',
            WebkitBackdropFilter: 'blur(26px)',
            zIndex: 390,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            overflowY: 'auto',
            padding: '60px 20px'
          }}
        >
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            className="wim-overlay__inner"
            onClick={(ev) => ev.stopPropagation()}
            style={{
              position: 'relative',
              width: 'min(820px, calc(100% - 40px))',
              borderRadius: 16,
              background: 'rgba(17, 17, 17, 0.92)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              border: '1px solid var(--color-border)',
              padding: 'var(--spacing-xl) var(--spacing-lg)',
              color: 'var(--color-text)',
              marginTop: 'auto',
              marginBottom: 'auto'
            }}
          >
            <div className="small-text" style={{ marginBottom: 'var(--spacing-lg)', fontWeight: 'var(--font-mono-weight-bold)' }}>
              WAREHOUSE INTELLIGENCE •
            </div>
            <div className="small-text" style={{ color: 'var(--color-text)', fontWeight: 'var(--font-mono-weight-bold)' }}>ROLE</div>
            <div className="small-text" style={{ marginTop: 8 }}>BRAND + IDENTITY DESIGN</div>
            <div className="small-text" style={{ color: 'var(--color-text)', fontWeight: 'var(--font-mono-weight-bold)', marginTop: 'var(--spacing-lg)' }}>SCOPE</div>
            <div className="small-text" style={{ marginTop: 8 }}>IDENTITY SYSTEM, SOFTWARE APP UI/UX DESIGN</div>
            <div className="small-text" style={{ color: 'var(--color-text)', fontWeight: 'var(--font-mono-weight-bold)', marginTop: 'var(--spacing-lg)' }}>STRATEGY & DESIGN</div>
            <div className="small-text" style={{ marginTop: 12, lineHeight: 1.6, textTransform: 'none', maxWidth: 680 }}>
              The Warehouse Intelligence Management (WIM) system required a visual identity that felt as precise and efficient as the software it represents. Our approach centered on the concept of 'Clarity in Chaos'—developing a bold, geometric system that remains legible in high-intensity warehouse environments.
              <br /><br />
              We re-engineered the core brand assets to prioritize immediate recognition, specifically for field use and apparel application. The software UI/UX was designed with a focus on high-contrast interaction patterns, ensuring ease of use on rugged mobile devices under varied lighting conditions.
              <br /><br />
              The resulting system is a cohesive blend of utility and identity, providing a unified visual language that scales from microscopic digital icons to large-scale fleet graphics. Every element—from the custom typeface weight to the high-visibility safety shirt suite—was meticulously crafted to support WIM's position as a leader in logistics technology.
            </div>
            <div className="small-text" style={{ color: 'var(--color-text)', fontWeight: 'var(--font-mono-weight-bold)', marginTop: 'var(--spacing-lg)' }}>PROJECT SUMMARY</div>
            <div className="small-text" style={{ marginTop: 8, textTransform: 'none' }}>
              WAREHOUSE INTELLIGENCE BRAND SYSTEM AND UNIFORM SUITE—BUILT FOR CLARITY, RECOGNITION, AND APPLICATION ACROSS APPAREL AND FIELD USE.
            </div>
          </motion.div>
        </motion.div>
      )}

      <section style={{ padding: 'var(--spacing-md) 10px var(--spacing-xxl)' }}>
        <div style={{ height: 1, background: 'var(--color-border)', marginLeft: -10, marginRight: -10 }} />
        <div>
          <div className="small-text" style={{ marginTop: 'var(--spacing-sm)', marginBottom: 20 }}>
            <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>WIM</span>
          </div>
          <div className="wim-rows">
            {WIM_IMAGES.reduce((rows, img, idx) => {
              const rowIndex = Math.floor(idx / 2);
              if (!rows[rowIndex]) rows[rowIndex] = [];
              rows[rowIndex].push(img);
              return rows;
            }, []).map((row, rIdx) => {
              const single = row.length === 1;
              const rowClass = single ? 'wim-row wim-row--single' : (rIdx % 2 === 0 ? 'wim-row wim-row--left' : 'wim-row wim-row--right');
              return (
                <div key={`row-${rIdx}`} className={rowClass}>
                  {row.map((image) => {
                    const isLoaded = !!loadedBySrc[image.src];
                    return (
                      <motion.div
                        key={image.src}
                        className="wim-card"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-10%' }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      >
                        <div className={`wim-frame${isLoaded ? ' wim-frame--loaded' : ' wim-frame--loading'}`}>
                          <div className="wim-skeleton" aria-hidden="true" />
                          <img
                            className="wim-img"
                            src={image.src}
                            alt={image.alt}
                            loading="lazy"
                            decoding="async"
                            onLoad={() => {
                              setLoadedBySrc((prev) => {
                                if (prev[image.src]) return prev;
                                return { ...prev, [image.src]: true };
                              });
                            }}
                            onError={(ev) => {
                              const card = ev.currentTarget.closest('.wim-card');
                              if (card) card.style.display = 'none';
                            }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default WimProject;
