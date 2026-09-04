import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DecryptText from './DecryptText';
import ProjectNarrative from './ProjectNarrative';

const BLACK = 'var(--color-bg)';
const WHITE = 'var(--color-text)';

const BOISE_ANALOG_CLUB_IMAGES = [
  { src: '/images/new%20mockeup.webp', alt: 'Boise Analog Club campaign mockup' },
  { src: '/images/analog%20new%20mobile.webp', alt: 'Boise Analog Club mobile website mockup' },
  { src: '/images/newseltter%20mockup%20reel.webp', alt: 'Boise Analog Club newsletter reel mockup' },
  { src: '/images/bac%20july%202026.webp', alt: 'Boise Analog Club July 2026 campaign graphic' },
];

const BOISE_ANALOG_CLUB_NARRATIVE = {
  meta: [
    'ROLE( Brand Designer + UI/UX Designer + Developer )',
    'SCOPE( Identity, Website, Newsletter, Event Promotion )',
    'TECH( Figma, React, Vite, Framer Motion )',
  ],
  sections: [
    {
      label: 'Context',
      text: 'Boise Analog Club needed a visual identity and digital presence that could feel culturally specific, current, and credible to a local creative community.',
    },
    {
      label: 'Problem',
      text: 'The project had to support recurring events, newsletter touchpoints, and community storytelling without feeling overbuilt or losing the raw energy of the analog scene.',
    },
    {
      label: 'Process',
      text: 'I developed a sharper visual system, designed campaign and editorial assets, and translated that direction into a responsive website built to promote events and keep the club visible between drops.',
    },
    {
      label: 'Proposal',
      text: 'The solution combined a flexible identity, social and newsletter-ready promotional assets, and a mobile-friendly site that could highlight programming, reinforce tone, and grow the audience over time.',
    },
    {
      label: 'Result',
      text: 'The final system gave Boise Analog Club a clearer public presence across web and campaign touchpoints, making the project feel more cohesive, more legible, and easier to recognize.',
    },
  ],
};

const BoiseAnalogClubProject = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [loadedBySrc, setLoadedBySrc] = useState({});

  useEffect(() => {
    const adjustRowHeights = () => {
      const rows = Array.from(document.querySelectorAll('.boise-analog-row'));
      rows.forEach((row) => {
        const frames = Array.from(row.querySelectorAll('.boise-analog-frame'));
        const imgs = Array.from(row.querySelectorAll('.boise-analog-frame img'));
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
      className="boise-analog-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-header-theme="dark"
      style={{ background: BLACK, color: WHITE, minHeight: '100vh' }}
    >
      <section data-header-theme="dark" style={{ position: 'relative', overflow: 'hidden', background: BLACK, color: WHITE }}>
        <div style={{ minHeight: '42vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 'var(--spacing-lg)', padding: 'var(--spacing-md) var(--spacing-md) var(--spacing-sm)', position: 'relative', zIndex: 1 }}>
          <h1 className="project-hero__title" style={{ marginBottom: 'auto' }}>
            <div style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
              <DecryptText as="span" text="BOISE ANALOG CLUB" trigger="mount" delay={200} duration={900} />
            </div>
          </h1>
        </div>
      </section>

      <section style={{ padding: 'var(--spacing-md) 10px var(--spacing-xxl)' }}>
        <div style={{ height: 1, background: 'var(--color-border)', marginLeft: -10, marginRight: -10 }} />
        <div>
          <div className="small-text" style={{ marginTop: 'var(--spacing-sm)', marginBottom: 20 }}>
            <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>BOISE ANALOG CLUB</span>
            <span style={{ margin: '0 14px' }}>•</span>
            <span style={{ marginLeft: 14 }}>SCOPE( BRAND, WEBSITE, CAMPAIGN ASSETS )</span>
          </div>
          <div className="boise-analog-rows">
            {BOISE_ANALOG_CLUB_IMAGES.reduce((rows, img, idx) => {
              const rowIndex = Math.floor(idx / 2);
              if (!rows[rowIndex]) rows[rowIndex] = [];
              rows[rowIndex].push(img);
              return rows;
            }, []).map((row, rIdx) => {
              const single = row.length === 1;
              const rowClass = single
                ? 'boise-analog-row boise-analog-row--single'
                : (rIdx % 2 === 0 ? 'boise-analog-row boise-analog-row--left' : 'boise-analog-row boise-analog-row--right');

              return (
                <div key={`row-${rIdx}`} className={rowClass}>
                  {row.map((image) => {
                    const isLoaded = !!loadedBySrc[image.src];
                    return (
                      <motion.div
                        key={image.src}
                        className="boise-analog-card"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-10%' }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      >
                        <div className={`boise-analog-frame${isLoaded ? ' boise-analog-frame--loaded' : ' boise-analog-frame--loading'}`}>
                          <div className="boise-analog-skeleton" aria-hidden="true" />
                          <img
                            className="boise-analog-img"
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
                              const card = ev.currentTarget.closest('.boise-analog-card');
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

      <ProjectNarrative eyebrow="BOISE ANALOG CLUB" meta={BOISE_ANALOG_CLUB_NARRATIVE.meta} sections={BOISE_ANALOG_CLUB_NARRATIVE.sections} />

      <style>{`
        .boise-analog-rows {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-bottom: var(--spacing-xxl);
        }

        .boise-analog-row {
          display: flex;
          gap: 10px;
          width: 100%;
          box-sizing: border-box;
        }

        .boise-analog-card {
          border-radius: 12px;
          overflow: hidden;
          background: ${BLACK};
          min-width: 0;
        }

        .boise-analog-frame {
          height: auto;
          position: relative;
        }

        .boise-analog-skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(17, 17, 17, 0.06) 0%,
            rgba(17, 17, 17, 0.12) 50%,
            rgba(17, 17, 17, 0.06) 100%
          );
          background-size: 200% 100%;
          animation: boiseAnalogSkeleton 1.2s ease-in-out infinite;
          opacity: 1;
          transition: opacity 260ms ease;
        }

        @keyframes boiseAnalogSkeleton {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .boise-analog-img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          opacity: 0;
          filter: blur(12px);
          transform: scale(1.01);
          transition: opacity 380ms ease, filter 520ms ease, transform 520ms ease;
        }

        .boise-analog-frame--loaded .boise-analog-skeleton {
          opacity: 0;
        }

        .boise-analog-frame--loaded .boise-analog-img {
          opacity: 1;
          filter: blur(0);
          transform: scale(1);
        }

        @media (prefers-reduced-motion: reduce) {
          .boise-analog-skeleton {
            animation: none;
          }

          .boise-analog-img {
            transition: none;
          }
        }

        .boise-analog-row--left .boise-analog-card:first-child { flex: 3 1 0; }
        .boise-analog-row--left .boise-analog-card:last-child { flex: 2 1 0; }
        .boise-analog-row--right .boise-analog-card:first-child { flex: 2 1 0; }
        .boise-analog-row--right .boise-analog-card:last-child { flex: 3 1 0; }
        .boise-analog-row--single .boise-analog-card { flex: 1 1 auto; }

        @media (max-width: 700px) {
          .boise-analog-page .project-hero__title {
            max-width: 100%;
            white-space: normal;
            overflow-wrap: anywhere;
          }

          .boise-analog-row {
            flex-direction: column;
          }

          .boise-analog-row--left .boise-analog-card:first-child,
          .boise-analog-row--left .boise-analog-card:last-child,
          .boise-analog-row--right .boise-analog-card:first-child,
          .boise-analog-row--right .boise-analog-card:last-child,
          .boise-analog-row--single .boise-analog-card {
            flex: 0 0 auto;
          }

          .boise-analog-card {
            width: 100%;
          }

          .boise-analog-img {
            height: auto;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default BoiseAnalogClubProject;
