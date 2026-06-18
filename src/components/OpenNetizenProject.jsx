import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DecryptText from './DecryptText';
import ProjectNarrative from './ProjectNarrative';

const BLACK = 'var(--color-bg)';
const WHITE = 'var(--color-text)';

const OPEN_NETIZEN_IMAGES = [
  { src: '/images/OPEN NETIZEN CARD.jpg', alt: 'Open Netizen card mockup' },
  { src: '/images/OPEN NETIZEN WEBSITE MOCKUP.jpg', alt: 'Open Netizen website mockup' },
  { src: '/images/OPEN NETIZEN.jpg', alt: 'Open Netizen identity mockup' },
  { src: '/images/sign mockup open netizen.png', alt: 'Open Netizen signage mockup' },

];

const OPEN_NETIZEN_NARRATIVE = {
  meta: ['LOCATION( Boise, ID / Remote )', 'ROLE( Lead Brand Strategist, UI/UX Designer + Full-Stack Developer )', 'TECH( Figma, Adobe CC, React, Vite, Framer Motion )'],
  sections: [
    {
      label: 'Context',
      text: 'Open Netizen was a mission-driven initiative built to advocate for the open web through a brand and digital experience that felt both credible and approachable.',
    },
    {
      label: 'Problem',
      text: 'The project had to communicate a complex civic and technical mission without losing people in jargon or making the platform feel inaccessible to everyday users.',
    },
    {
      label: 'Process',
      text: 'I used the 4 Cs framework to connect the brand to the history of the open web, clarify the message, shape trust through accessible design, and build the site around intuitive interactions.',
    },
    {
      label: 'Proposal',
      text: 'The proposal combined a more authoritative identity system with a high-performance, thumb-friendly website that could serve as both a source of truth and an action-oriented hub.',
    },
    {
      label: 'Result',
      text: 'The final project delivered a civic-minded brand and digital platform that made advocacy clearer, more trustworthy, and easier for people to engage with.',
    },
  ],
};

const OpenNetizenProject = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [loadedBySrc, setLoadedBySrc] = useState({});

  useEffect(() => {
    const adjustRowHeights = () => {
      const rows = Array.from(document.querySelectorAll('.open-netizen-row'));
      rows.forEach((row) => {
        const frames = Array.from(row.querySelectorAll('.open-netizen-frame'));
        const imgs = Array.from(row.querySelectorAll('.open-netizen-frame img'));
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
      className="open-netizen-page"
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
              <DecryptText as="span" text="FREE THE WEB" trigger="mount" delay={200} duration={900} />
            </div>
          </h1>
        </div>
      </section>

      <section style={{ padding: 'var(--spacing-md) 10px var(--spacing-xxl)' }}>
        <div style={{ height: 1, background: 'var(--color-border)', marginLeft: -10, marginRight: -10 }} />
        <div>
          <div className="small-text" style={{ marginTop: 'var(--spacing-sm)', marginBottom: 20 }}>
            <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>OPEN NETIZEN</span>
            <span style={{ margin: '0 14px' }}>•</span>
            <span style={{ marginLeft: 14 }}>SCOPE( BRAND IDENTITY SYSTEM, WEBSITE)</span>
          </div>
          <div className="open-netizen-rows">
            {OPEN_NETIZEN_IMAGES.reduce((rows, img, idx) => {
              const rowIndex = Math.floor(idx / 2);
              if (!rows[rowIndex]) rows[rowIndex] = [];
              rows[rowIndex].push(img);
              return rows;
            }, []).map((row, rIdx) => {
              const single = row.length === 1;
              const rowClass = single ? 'open-netizen-row open-netizen-row--single' : (rIdx % 2 === 0 ? 'open-netizen-row open-netizen-row--left' : 'open-netizen-row open-netizen-row--right');
              return (
                <div key={`row-${rIdx}`} className={rowClass}>
                  {row.map((image) => {
                    const isLoaded = !!loadedBySrc[image.src];
                    return (
                      <motion.div
                        key={image.src}
                        className="open-netizen-card"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      >
                        <div className={`open-netizen-frame${isLoaded ? ' open-netizen-frame--loaded' : ' open-netizen-frame--loading'}`}>
                          <div className="open-netizen-skeleton" aria-hidden="true" />
                          <img
                            className="open-netizen-img"
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
                              const card = ev.currentTarget.closest('.open-netizen-card');
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
      <ProjectNarrative eyebrow="OPEN NETIZEN" meta={OPEN_NETIZEN_NARRATIVE.meta} sections={OPEN_NETIZEN_NARRATIVE.sections} />

      <style>{`
        .open-netizen-rows {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-bottom: var(--spacing-xxl);
        }

        .open-netizen-row {
          display: flex;
          gap: 10px;
          width: 100%;
          box-sizing: border-box;
        }

        .open-netizen-card {
          border-radius: 12px;
          overflow: hidden;
          background: ${BLACK};
          min-width: 0;
        }

        .open-netizen-frame {
          height: auto;
          position: relative;
        }

        .open-netizen-skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(17, 17, 17, 0.06) 0%,
            rgba(17, 17, 17, 0.12) 50%,
            rgba(17, 17, 17, 0.06) 100%
          );
          background-size: 200% 100%;
          animation: openNetizenSkeleton 1.2s ease-in-out infinite;
          opacity: 1;
          transition: opacity 260ms ease;
        }

        @keyframes openNetizenSkeleton {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .open-netizen-img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          opacity: 0;
          filter: blur(12px);
          transform: scale(1.01);
          transition: opacity 380ms ease, filter 520ms ease, transform 520ms ease;
        }

        .open-netizen-frame--loaded .open-netizen-skeleton {
          opacity: 0;
        }

        .open-netizen-frame--loaded .open-netizen-img {
          opacity: 1;
          filter: blur(0);
          transform: scale(1);
        }

        @media (prefers-reduced-motion: reduce) {
          .open-netizen-skeleton {
            animation: none;
          }
          .open-netizen-img {
            transition: none;
          }
        }

        .open-netizen-row--left .open-netizen-card:first-child { flex: 3 1 0; }
        .open-netizen-row--left .open-netizen-card:last-child { flex: 2 1 0; }
        .open-netizen-row--right .open-netizen-card:first-child { flex: 2 1 0; }
        .open-netizen-row--right .open-netizen-card:last-child { flex: 3 1 0; }
        .open-netizen-row--single .open-netizen-card { flex: 1 1 auto; }

        @media (max-width: 700px) {
          .open-netizen-page .home-hero__title {
            max-width: 100%;
            white-space: normal;
            overflow-wrap: anywhere;
          }
          .open-netizen-row {
            flex-direction: column;
          }
          .open-netizen-row--left .open-netizen-card:first-child,
          .open-netizen-row--left .open-netizen-card:last-child,
          .open-netizen-row--right .open-netizen-card:first-child,
          .open-netizen-row--right .open-netizen-card:last-child,
          .open-netizen-row--single .open-netizen-card {
            flex: 0 0 auto;
          }
          .open-netizen-card {
            width: 100%;
          }
          .open-netizen-img {
            height: auto;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default OpenNetizenProject;
