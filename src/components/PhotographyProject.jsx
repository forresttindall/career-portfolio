import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DecryptText from './DecryptText';
import ProjectNarrative from './ProjectNarrative';

const BLACK = 'var(--color-bg)';
const WHITE = 'var(--color-text)';

const PHOTOGRAPHY_IMAGES = [
  { src: '/images/1.webp', alt: 'Photography portfolio website design' },
  { src: '/images/2.webp', alt: 'Photography portfolio website layout' },
  { src: '/images/3.webp', alt: 'Photography portfolio website interface' },
  { src: '/images/4.webp', alt: 'Photography portfolio website detail' },
];

const PHOTOGRAPHY_NARRATIVE = {
  meta: ['ROLE( UI/UX Designer + Design Engineer )', 'SCOPE( Web Design, Development )'],
  sections: [
    {
      label: 'Context',
      text: 'A personal photography portfolio site built to present a film-based body of work — and to act as a live, self-directed study in the UI/UX and front-end work I do for clients.',
    },
    {
      label: 'Problem',
      text: 'The site had to put the images first: large, immersive photography with an interface that stays out of the way, while still loading fast and holding up across screen sizes.',
    },
    {
      label: 'Process',
      text: 'I designed and built the experience end to end — layout, type system, image grid, and navigation — then implemented it with performance-focused front-end code.',
    },
    {
      label: 'Proposal',
      text: 'The direction centered on a minimal, editorial layout that lets full-bleed photographs carry the page, supported by restrained interface elements and considered motion.',
    },
    {
      label: 'Result',
      text: 'The result is a fast, responsive portfolio at forresttindall.art that presents the work cleanly and doubles as a proof point for my design and engineering practice.',
    },
  ],
};

const PhotographyProject = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [loadedBySrc, setLoadedBySrc] = useState({});

  useEffect(() => {
    const adjustRowHeights = () => {
      const isMobile = window.matchMedia('(max-width: 700px)').matches;
      const maxRowH = Math.round(Math.max(480, Math.min(820, window.innerHeight * 0.72)));
      const maxSingleRowH = Math.round(Math.max(580, Math.min(980, window.innerHeight * 0.82)));
      const rows = Array.from(document.querySelectorAll('.wim-row'));
      rows.forEach((row) => {
        const frames = Array.from(row.querySelectorAll('.wim-frame'));
        const imgs = Array.from(row.querySelectorAll('.wim-frame img'));
        if (frames.length !== imgs.length || frames.length === 0) return;
        if (isMobile) {
          frames.forEach((frame) => {
            frame.style.height = '';
          });
          return;
        }
        const heights = imgs.map((img, idx) => {
          const frame = frames[idx];
          const w = frame.getBoundingClientRect().width;
          const naturalW = img.naturalWidth || w;
          const naturalH = img.naturalHeight || w;
          const ratio = naturalH / naturalW;
          return Math.max(0, Math.round(w * ratio));
        });
        const single = row.classList.contains('wim-row--single');
        const maxCap = single ? maxSingleRowH : maxRowH;
        const minH = Math.min(...heights);
        const targetH = Math.min(Math.max(minH, Math.round(maxCap * 0.72)), maxCap);
        frames.forEach((frame) => {
          frame.style.height = `${targetH}px`;
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
          <h1 className="project-hero__title" style={{ marginBottom: 'auto' }}>
            <div style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
              <DecryptText as="span" text="Photography Portfolio" trigger="mount" delay={200} duration={900} />
            </div>
          </h1>
        </div>
      </section>

      <section style={{ padding: 'var(--spacing-md) 10px var(--spacing-xxl)' }}>
        <div style={{ height: 1, background: 'var(--color-border)', marginLeft: -10, marginRight: -10 }} />
        <div>
          <div className="small-text" style={{ marginTop: 'var(--spacing-sm)', marginBottom: 20 }}>
            <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>PHOTOGRAPHY PORTFOLIO</span>
          </div>
          <div className="wim-rows">
            {PHOTOGRAPHY_IMAGES.reduce((rows, img, idx) => {
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
      <ProjectNarrative eyebrow="PHOTOGRAPHY PORTFOLIO" meta={PHOTOGRAPHY_NARRATIVE.meta} sections={PHOTOGRAPHY_NARRATIVE.sections} ctaHref="https://www.forresttindall.art" />
    </motion.div>
  );
};

export default PhotographyProject;
