import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DecryptText from './DecryptText';

const BLACK = '#FFFFFF';
const WHITE = '#111111';

const FASTBURGER_IMAGES = [
  { src: '/images/FASTBURGER MENU MOCKUP.webp', alt: 'Fastburger menu mockup', className: 'fastburger-gallery__item fastburger-gallery__item--hero' },
  { src: '/images/fastburger logo.webp', alt: 'Fastburger logo identity', className: 'fastburger-gallery__item fastburger-gallery__item--square' },
  { src: '/images/fastburger website mockup 2.webp', alt: 'Fastburger printed menu', className: 'fastburger-gallery__item fastburger-gallery__item--landscape' },
  { src: '/images/fastburger box vertical.webp', alt: 'Fastburger vertical packaging detail', className: 'fastburger-gallery__item fastburger-gallery__item--portrait' },
  { src: '/images/fastburger a board.webp', alt: 'Fastburger a-board signage', className: 'fastburger-gallery__item fastburger-gallery__item--landscape' },
  { src: '/images/fastburger tote vertical.webp', alt: 'Fastburger vertical tote detail', className: 'fastburger-gallery__item fastburger-gallery__item--portrait' },
  { src: '/images/fastburger typemark.webp', alt: 'Fastburger typemark', className: 'fastburger-gallery__item fastburger-gallery__item--square' },
  { src: '/images/fastburger website mockup 1.webp', alt: 'Fastburger website mockup', className: 'fastburger-gallery__item fastburger-gallery__item--landscape' },
];

const FastburgerProject = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [readMoreOpen, setReadMoreOpen] = useState(false);
  const [loadedBySrc, setLoadedBySrc] = useState({});

  useEffect(() => {
    if (readMoreOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('fastburger-info-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('fastburger-info-open');
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
      document.body.classList.remove('fastburger-info-open');
      document.removeEventListener('click', handleNavClick, true);
    };
  }, [readMoreOpen]);

  useEffect(() => {
    const adjustRowHeights = () => {
      const rows = Array.from(document.querySelectorAll('.fastburger-row'));
      rows.forEach((row) => {
        const frames = Array.from(row.querySelectorAll('.fastburger-frame'));
        const imgs = Array.from(row.querySelectorAll('.fastburger-frame img'));
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
    const container = document;
    container.addEventListener('load', onLoad, true);
    window.addEventListener('resize', adjustRowHeights);
    // initial adjust once images have layout
    const initialAdjust = () => adjustRowHeights();
    const raf = requestAnimationFrame(initialAdjust);
    return () => {
      container.removeEventListener('load', onLoad, true);
      window.removeEventListener('resize', adjustRowHeights);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <motion.div
      className="fastburger-page"
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
              <DecryptText as="span" text="QUALITY BURGERS," trigger="mount" delay={200} duration={900} />
            </div>
            <div style={{ overflow: 'hidden', paddingBottom: '0.1em', marginTop: '-0.2em' }}>
              <DecryptText as="span" text="FAST" trigger="mount" delay={440} duration={900} />
            </div>
          </h1>
        </div>
      </section>

      <button
        type="button"
        className="fastburger-readmore"
        aria-label="Read more"
        onClick={() => setReadMoreOpen(true)}
      >
        <div className="fastburger-readmore__track">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="fastburger-readmore__item small-text">
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
          className="fastburger-overlay"
          onClick={() => setReadMoreOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(150,150,150,0.32)',
            backdropFilter: 'blur(26px)',
            WebkitBackdropFilter: 'blur(26px)',
            zIndex: 390,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            className="fastburger-overlay__inner"
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
              color: '#111111'
            }}
          >
            <div className="small-text" style={{ marginBottom: 'var(--spacing-lg)', fontWeight: 'var(--font-mono-weight-bold)' }}>
              FASTBURGER •
            </div>
            <div className="small-text" style={{ color: '#111111', fontWeight: 'var(--font-mono-weight-bold)' }}>ROLE</div>
            <div className="small-text" style={{ marginTop: 8 }}>Brand + Web Designer + Developer</div>
            <div className="small-text" style={{ color: '#111111', fontWeight: 'var(--font-mono-weight-bold)', marginTop: 'var(--spacing-lg)' }}>SCOPE</div>
            <div className="small-text" style={{ marginTop: 8 }}>Identity system, packaging, signage, merch, website design and development</div>
            <div className="small-text" style={{ color: '#111111', fontWeight: 'var(--font-mono-weight-bold)', marginTop: 'var(--spacing-lg)' }}>STRATEGY & DESIGN</div>
            <div className="small-text" style={{ marginTop: 12, lineHeight: 1.6, textTransform: 'none', maxWidth: 680 }}>
              Fastburger represents a modern take on the classic quick-service restaurant. Our challenge was to create an identity that communicated speed and accessibility without sacrificing the perception of quality.
              <br /><br />
              We developed a visual system rooted in bold typography and a vibrant, appetite-stimulating color palette. The logo suite was designed to be versatile, functioning equally well on a digital menu board as it does embossed on recycled burger packaging.
              <br /><br />
              The website development focused on a 'mobile-first' approach, ensuring that hungry customers could navigate the menu and find locations with zero friction. By combining custom iconography with high-fidelity mockups, we built a brand that feels both established and energetic.
            </div>
            <div className="small-text" style={{ color: '#111111', fontWeight: 'var(--font-mono-weight-bold)', marginTop: 'var(--spacing-lg)' }}>PROJECT SUMMARY</div>
            <div className="small-text" style={{ marginTop: 8, textTransform: 'none' }}>
              Comprehensive brand identity system with packaging assets and website design and development—logo suite, packaging and signage applications, merchandise, and responsive web interface.
            </div>
            <a
              href="https://fastburger.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="small-text"
              style={{
                marginTop: 'var(--spacing-lg)',
                display: 'inline-flex',
                color: '#111111',
                textDecoration: 'none',
                fontWeight: 'var(--font-mono-weight-bold)',
              }}
            >
              SEE LIVE SITE
            </a>
          </motion.div>
        </motion.div>
      )}

      <section style={{ padding: 'var(--spacing-md) 10px var(--spacing-xxl)' }}>
        <div style={{ height: 1, background: '#000000', marginLeft: -10, marginRight: -10 }} />
        <div>
          <div className="small-text" style={{ marginTop: 'var(--spacing-sm)', marginBottom: 20 }}>
            <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>FASTBURGER</span>
            <span style={{ margin: '0 14px' }}>•</span>
            <span style={{ marginLeft: 14 }}>SCOPE( FULL BRAND IDENTITY SYSTEM, WEBSITE)</span>
          </div>
          <div className="fastburger-rows">
            {FASTBURGER_IMAGES.reduce((rows, img, idx) => {
              const rowIndex = Math.floor(idx / 2);
              if (!rows[rowIndex]) rows[rowIndex] = [];
              rows[rowIndex].push(img);
              return rows;
            }, []).map((row, rIdx) => {
              const single = row.length === 1;
              const rowClass = single ? 'fastburger-row fastburger-row--single' : (rIdx % 2 === 0 ? 'fastburger-row fastburger-row--left' : 'fastburger-row fastburger-row--right');
              return (
                <div key={`row-${rIdx}`} className={rowClass}>
                  {row.map((image) => {
                    const isLoaded = !!loadedBySrc[image.src];
                    return (
                      <motion.div
                        key={image.src}
                        className="fastburger-card"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      >
                        <div className={`fastburger-frame${isLoaded ? ' fastburger-frame--loaded' : ' fastburger-frame--loading'}`}>
                          <div className="fastburger-skeleton" aria-hidden="true" />
                          <img
                            className="fastburger-img"
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
                              const card = ev.currentTarget.closest('.fastburger-card');
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

      <style>{`
        .fastburger-rows {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-bottom: var(--spacing-xxl);
        }

        .fastburger-readmore {
          position: fixed;
          left: 50%;
          bottom: 78px;
          transform: translateX(-50%);
          display: block;
          width: clamp(280px, 64vw, 740px);
          height: 34px;
          border-radius: 999px;
          border: none;
          background: rgba(191, 191, 191, 0.45);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          color: inherit;
          overflow: hidden;
          z-index: 402;
          pointer-events: auto;
        }
        .fastburger-readmore__track {
          display: inline-flex;
          align-items: center;
          gap: 24px;
          white-space: nowrap;
          will-change: transform;
          animation: fastburgerMarquee 12s linear infinite;
          padding: 0 12px;
        }
        .fastburger-readmore__item {
          letter-spacing: 0.05em;
        }
        @keyframes fastburgerMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        body.fastburger-info-open .fastburger-readmore { display: none; }
        body.fastburger-info-open .site-nav__menu-label {
          position: relative;
          color: transparent;
        }
        body.fastburger-info-open .site-nav__menu-label::after {
          content: 'Close';
          position: absolute;
          inset: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #111111;
          pointer-events: none;
        }

        .fastburger-row {
          display: flex;
          gap: 10px;
          width: 100%;
        }

        .fastburger-card {
          border-radius: 12px;
          overflow: hidden;
          background: ${BLACK};
        }

        .fastburger-frame {
          height: auto;
          position: relative;
        }

        .fastburger-skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(17, 17, 17, 0.06) 0%,
            rgba(17, 17, 17, 0.12) 50%,
            rgba(17, 17, 17, 0.06) 100%
          );
          background-size: 200% 100%;
          animation: fastburgerSkeleton 1.2s ease-in-out infinite;
          opacity: 1;
          transition: opacity 260ms ease;
        }

        @keyframes fastburgerSkeleton {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .fastburger-img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          opacity: 0;
          filter: blur(12px);
          transform: scale(1.01);
          transition: opacity 380ms ease, filter 520ms ease, transform 520ms ease;
        }

        .fastburger-frame--loaded .fastburger-skeleton {
          opacity: 0;
        }

        .fastburger-frame--loaded .fastburger-img {
          opacity: 1;
          filter: blur(0);
          transform: scale(1);
        }

        @media (prefers-reduced-motion: reduce) {
          .fastburger-skeleton {
            animation: none;
          }
          .fastburger-img {
            transition: none;
          }
        }

        .fastburger-row--left .fastburger-card:first-child { flex: 0 0 60%; }
        .fastburger-row--left .fastburger-card:last-child { flex: 0 0 40%; }
        .fastburger-row--right .fastburger-card:first-child { flex: 0 0 40%; }
        .fastburger-row--right .fastburger-card:last-child { flex: 0 0 60%; }
        .fastburger-row--single .fastburger-card { flex: 1 1 auto; }

        @media (max-width: 1100px) {
          .fastburger-frame { height: auto; }
        }

        @media (max-width: 700px) {
          .fastburger-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .fastburger-page .home-hero__title {
            max-width: 100%;
            white-space: normal;
            overflow-wrap: anywhere;
          }
          .fastburger-readmore {
            bottom: 72px;
            width: calc(100% - 20px);
          }
          .fastburger-row {
            flex-direction: column;
          }
          .fastburger-card {
            width: 100%;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default FastburgerProject;
