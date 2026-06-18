import { useEffect } from 'react';
import { motion } from 'framer-motion';

const UI_DARK = 'var(--color-bg)';
const UI_LIGHT = 'var(--color-text)';
const BORDER = 'var(--color-border)';

const ITEMS = [
  { src: '/images/device-1.PNG', tag: 'Product Design', maxWidth: 640 },
  { src: '/images/IMG_4027-3.webp', tag: 'Personal Work', maxWidth: 560 },
  { src: '/images/worm primary.JPG', tag: 'Art Print', maxWidth: 600 },
  { src: '/images/device-2.PNG', tag: 'Product Design', maxWidth: 640 },
  { src: '/images/network.jpg', tag: 'Development Project', maxWidth: 700 },
  { src: '/images/P3221595.jpg', tag: 'Personal Work', maxWidth: 600 },
  { src: '/images/pilot micro new.png', tag: 'Art Print', maxWidth: 560 },
  { src: '/images/look see 2.JPG', tag: 'Art Print', maxWidth: 680 },
  { src: '/images/bar.jpg', tag: 'Film Studies', maxWidth: 560 },
  { src: '/images/shell.jpg', tag: 'Film Studies', maxWidth: 640 },
];

const Playground = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-header-theme="light"
      className="playground-page"
      style={{ background: UI_DARK, color: UI_LIGHT, minHeight: '100vh' }}
    >
      <section style={{ padding: 'var(--spacing-xxl) var(--spacing-md) var(--spacing-xl)', borderBottom: `1px solid ${BORDER}` }}>
        <div className="full-bleed playground-bleed">
          <div className="playground-header flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
            <h1 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: UI_LIGHT }}>
              PLAYGROUND
            </h1>
            <div className="playground-kicker small-text" style={{ color: UI_LIGHT }}>
              DESIGN / ART / DEV
            </div>
          </div>
          <div style={{ height: 1, background: BORDER, marginTop: 'var(--spacing-sm)' }} />
          <div className="small-text" style={{ marginTop: 'var(--spacing-md)', maxWidth: 860, opacity: 0.9, color: UI_LIGHT }}>
            A space for visual experiments, technical prototypes, and Boise-based creative studies. This is where the workflow begins—testing shaders, exploring typography, and documenting life in the Treasure Valley.
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--spacing-xl) var(--spacing-md) var(--spacing-xxl)' }}>
        <div className="full-bleed playground-bleed">
          <div className="playground-stack">
            {ITEMS.map((item, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div
                  key={item.src}
                  className={isLeft ? 'playground-row playground-row--left' : 'playground-row playground-row--right'}
                >
                  <div className="playground-card" style={{ width: '100%', maxWidth: item.maxWidth }}>
                    <div className="playground-frame">
                      <img src={item.src} alt={item.tag} loading="lazy" decoding="async" />
                    </div>
                    <div className="playground-tag small-text" style={{ color: UI_LIGHT }}>{item.tag}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        .playground-page .playground-bleed {
          padding-left: clamp(24px, 6vw, 120px);
          padding-right: clamp(24px, 6vw, 120px);
        }

        .playground-stack {
          display: flex;
          flex-direction: column;
          gap: clamp(48px, 10vh, 140px);
        }

        .playground-row {
          display: flex;
          width: 100%;
        }

        .playground-row--left {
          justify-content: flex-start;
        }

        .playground-row--right {
          justify-content: flex-end;
        }

        .playground-card {
          max-width: 100%;
        }

        .playground-frame {
          position: relative;
          width: 100%;
          overflow: visible;
          background: ${UI_DARK};
        }

        .playground-frame img {
          width: 100%;
          height: auto;
          display: block;
        }

        .playground-tag {
          margin-top: 14px;
          width: 100%;
          text-align: left;
        }

        @media (max-width: 700px) {
          .playground-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-sm);
          }

          .playground-kicker {
            width: 100%;
          }

          .playground-page .playground-bleed {
            padding-left: var(--spacing-sm);
            padding-right: var(--spacing-sm);
          }

          .playground-stack {
            gap: var(--spacing-xxl);
          }

          .playground-row--left,
          .playground-row--right {
            justify-content: stretch;
          }

          .playground-card {
            width: 100%;
            max-width: 100% !important;
          }

          .playground-frame {
            height: auto;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Playground;
