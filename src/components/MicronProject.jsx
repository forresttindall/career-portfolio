import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DecryptText from './DecryptText';

const BLACK = '#FFFFFF';
const WHITE = '#111111';

const MICRON_IMAGES = [
  { src: '/images/lobby.webp', alt: 'Micron lobby environmental signage' },
  { src: '/images/stair.webp', alt: 'Micron stairwell ADA signage' },
  { src: '/images/bathroom.webp', alt: 'Micron bathroom ADA compliance signage' },
  { src: '/images/level.webp', alt: 'Micron level and floor identification signage' },
];

const MicronProject = () => {
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
              <DecryptText as="span" text="ACCESSIBLE BY DESIGN" trigger="mount" delay={200} duration={900} />
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
          className="continuity-overlay"
          onClick={() => setReadMoreOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(150,150,150,0.32)',
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
            className="continuity-overlay__inner"
            onClick={(ev) => ev.stopPropagation()}
            style={{
              position: 'relative',
              width: 'min(820px, calc(100% - 40px))',
              borderRadius: 16,
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              border: 'none',
              padding: 'var(--spacing-xl) var(--spacing-lg)',
              color: '#111111',
              marginTop: 'auto',
              marginBottom: 'auto'
            }}
          >
            <div className="small-text" style={{ marginBottom: 'var(--spacing-lg)', fontWeight: 'var(--font-mono-weight-bold)' }}>
              MICRON •
            </div>
            <div className="small-text" style={{ color: '#111111', fontWeight: 'var(--font-mono-weight-bold)' }}>LOCATION</div>
            <div className="small-text" style={{ marginTop: 8 }}>Boise, ID</div>
            
            <div className="small-text" style={{ color: '#111111', fontWeight: 'var(--font-mono-weight-bold)', marginTop: 'var(--spacing-lg)' }}>ROLE</div>
            <div className="small-text" style={{ marginTop: 8 }}>Lead Environmental Graphic Designer</div>
            
            <div className="small-text" style={{ color: '#111111', fontWeight: 'var(--font-mono-weight-bold)', marginTop: 'var(--spacing-lg)' }}>TECH</div>
            <div className="small-text" style={{ marginTop: 8 }}>Adobe Illustrator, CAD, Industrial Production Standards</div>
            
            <div className="small-text" style={{ color: '#111111', fontWeight: 'var(--font-mono-weight-bold)', marginTop: 'var(--spacing-lg)' }}>SCOPE</div>
            <div className="small-text" style={{ marginTop: 8 }}>Environmental Graphics, ADA Compliance, Signage Systems, Wayfinding.</div>
            
            <div className="small-text" style={{ color: '#111111', fontWeight: 'var(--font-mono-weight-bold)', marginTop: 'var(--spacing-lg)' }}>STRATEGY & DESIGN</div>
            <div className="small-text" style={{ marginTop: 12, lineHeight: 1.6, textTransform: 'none', maxWidth: 680 }}>
              The Micron expansion in Boise required a signage system that balanced strict ADA compliance with the high-tech, minimalist aesthetic of the new facility. We designed a comprehensive wayfinding strategy that guides thousands of employees through complex industrial and office environments.
              <br /><br />
              Every sign—from lobby identification to stairwell level indicators—was engineered for clarity, durability, and perfect integration with the building's physical materials.
            </div>
            <div className="small-text" style={{ color: '#111111', fontWeight: 'var(--font-mono-weight-bold)', marginTop: 'var(--spacing-lg)' }}>PROJECT SUMMARY</div>
            <div className="small-text" style={{ marginTop: 8, textTransform: 'none', lineHeight: 1.5 }}>
              A unified environmental signage system for Micron's Boise headquarters, prioritizing accessibility and technical precision.
            </div>
          </motion.div>
        </motion.div>
      )}

      <section style={{ padding: 'var(--spacing-md) 10px var(--spacing-xxl)' }}>
        <div style={{ height: 1, background: '#000000', marginLeft: -10, marginRight: -10 }} />
        <div>
          <div className="small-text" style={{ marginTop: 'var(--spacing-sm)', marginBottom: 20 }}>
            <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>MICRON</span>
          </div>
          <div className="wim-rows">
            {MICRON_IMAGES.reduce((rows, img, idx) => {
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

export default MicronProject;
