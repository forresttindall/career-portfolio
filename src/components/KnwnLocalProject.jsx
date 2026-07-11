import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DecryptText from './DecryptText';
import ProjectNarrative from './ProjectNarrative';

const BLACK = 'var(--color-bg)';
const WHITE = 'var(--color-text)';

const KNWNLOCAL_IMAGES = [
  { src: '/images/knwnlocal%20mockup.webp', alt: 'KnwnLocal homepage and editorial layout' },
  { src: '/images/knwnlocal%202.webp', alt: 'KnwnLocal AI editing and content workflow interface' },
];

const KNWNLOCAL_NARRATIVE = {
  meta: [
    'ROLE( UI/UX Designer + Developer )',
    'SCOPE( Marketing Website, Design System, CMS Editing Workflow )',
    'TECH( Next.js, Tailwind CSS, Sanity, Claude API, Vercel )',
  ],
  sections: [
    {
      label: 'Context',
      text: 'KnwnLocal needed a refreshed marketing website that felt modern, premium, and flexible enough to evolve as the brand and offer changed.',
    },
    {
      label: 'Problem',
      text: 'The core challenge was not just redesigning the frontend, but giving the site the ability to edit itself with Claude AI and push approved updates live without breaking the design system.',
    },
    {
      label: 'Process',
      text: 'I redesigned the UI/UX around reusable marketing sections, established design-system rules for layout and voice, and mapped those constraints into an AI-assisted content editing workflow.',
    },
    {
      label: 'Proposal',
      text: 'The solution paired a refreshed Next.js marketing site with Sanity content modeling, Claude AI-assisted editing, and a publishing flow that can generate structured updates and send them live.',
    },
    {
      label: 'Result',
      text: 'The final result gave KnwnLocal a sharper marketing presence and a smarter publishing system, making it possible to refresh messaging quickly through Claude-powered edits and push updates live.',
    },
  ],
};

const KnwnLocalProject = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [loadedBySrc, setLoadedBySrc] = useState({});

  useEffect(() => {
    const adjustRowHeights = () => {
      const rows = Array.from(document.querySelectorAll('.knwnlocal-row'));
      rows.forEach((row) => {
        const frames = Array.from(row.querySelectorAll('.knwnlocal-frame'));
        const imgs = Array.from(row.querySelectorAll('.knwnlocal-frame img'));
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
      className="knwnlocal-page"
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
              <DecryptText as="span" text="REAL ESTATE KNWN" trigger="mount" delay={200} duration={900} />
            </div>
          </h1>
        </div>
      </section>

      <section style={{ padding: 'var(--spacing-md) 10px var(--spacing-xxl)' }}>
        <div style={{ height: 1, background: 'var(--color-border)', marginLeft: -10, marginRight: -10 }} />
        <div>
          <div className="small-text" style={{ marginTop: 'var(--spacing-sm)', marginBottom: 20 }}>
            <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>REAL ESTATE KNWN</span>
            <span style={{ margin: '0 14px' }}>•</span>
            <span style={{ marginLeft: 14 }}>SCOPE( UI/UX DESIGN, DEVELOPMENT )</span>
          </div>
          <div className="knwnlocal-rows">
            {KNWNLOCAL_IMAGES.reduce((rows, img, idx) => {
              const rowIndex = Math.floor(idx / 2);
              if (!rows[rowIndex]) rows[rowIndex] = [];
              rows[rowIndex].push(img);
              return rows;
            }, []).map((row, rIdx) => {
              const single = row.length === 1;
              const rowClass = single
                ? 'knwnlocal-row knwnlocal-row--single'
                : (rIdx % 2 === 0 ? 'knwnlocal-row knwnlocal-row--left' : 'knwnlocal-row knwnlocal-row--right');

              return (
                <div key={`row-${rIdx}`} className={rowClass}>
                  {row.map((image) => {
                    const isLoaded = !!loadedBySrc[image.src];
                    return (
                      <motion.div
                        key={image.src}
                        className="knwnlocal-card"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-10%' }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      >
                        <div className={`knwnlocal-frame${isLoaded ? ' knwnlocal-frame--loaded' : ' knwnlocal-frame--loading'}`}>
                          <div className="knwnlocal-skeleton" aria-hidden="true" />
                          <img
                            className="knwnlocal-img"
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
                              const card = ev.currentTarget.closest('.knwnlocal-card');
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

      <ProjectNarrative eyebrow="REAL ESTATE KNWN" meta={KNWNLOCAL_NARRATIVE.meta} sections={KNWNLOCAL_NARRATIVE.sections} />

      <style>{`
        .knwnlocal-rows {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-bottom: var(--spacing-xxl);
        }

        .knwnlocal-row {
          display: flex;
          gap: 10px;
          width: 100%;
          box-sizing: border-box;
        }

        .knwnlocal-card {
          border-radius: 12px;
          overflow: hidden;
          background: ${BLACK};
          min-width: 0;
        }

        .knwnlocal-frame {
          height: auto;
          position: relative;
        }

        .knwnlocal-skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(17, 17, 17, 0.06) 0%,
            rgba(17, 17, 17, 0.12) 50%,
            rgba(17, 17, 17, 0.06) 100%
          );
          background-size: 200% 100%;
          animation: knwnlocalSkeleton 1.2s ease-in-out infinite;
          opacity: 1;
          transition: opacity 260ms ease;
        }

        @keyframes knwnlocalSkeleton {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .knwnlocal-img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          opacity: 0;
          filter: blur(12px);
          transform: scale(1.01);
          transition: opacity 380ms ease, filter 520ms ease, transform 520ms ease;
        }

        .knwnlocal-frame--loaded .knwnlocal-skeleton {
          opacity: 0;
        }

        .knwnlocal-frame--loaded .knwnlocal-img {
          opacity: 1;
          filter: blur(0);
          transform: scale(1);
        }

        @media (prefers-reduced-motion: reduce) {
          .knwnlocal-skeleton {
            animation: none;
          }

          .knwnlocal-img {
            transition: none;
          }
        }

        .knwnlocal-row--left .knwnlocal-card:first-child { flex: 3 1 0; }
        .knwnlocal-row--left .knwnlocal-card:last-child { flex: 2 1 0; }
        .knwnlocal-row--right .knwnlocal-card:first-child { flex: 2 1 0; }
        .knwnlocal-row--right .knwnlocal-card:last-child { flex: 3 1 0; }
        .knwnlocal-row--single .knwnlocal-card { flex: 1 1 auto; }

        @media (max-width: 700px) {
          .knwnlocal-page .home-hero__title {
            max-width: 100%;
            white-space: normal;
            overflow-wrap: anywhere;
          }

          .knwnlocal-row {
            flex-direction: column;
          }

          .knwnlocal-row--left .knwnlocal-card:first-child,
          .knwnlocal-row--left .knwnlocal-card:last-child,
          .knwnlocal-row--right .knwnlocal-card:first-child,
          .knwnlocal-row--right .knwnlocal-card:last-child,
          .knwnlocal-row--single .knwnlocal-card {
            flex: 0 0 auto;
          }

          .knwnlocal-card {
            width: 100%;
          }

          .knwnlocal-img {
            height: auto;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default KnwnLocalProject;
