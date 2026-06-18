import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DecryptText from './DecryptText';
import ProjectNarrative from './ProjectNarrative';

const BLACK = 'var(--color-bg)';
const WHITE = 'var(--color-text)';

const MICRON_IMAGES = [
  { src: '/images/lobby.webp', alt: 'Micron lobby environmental signage' },
  { src: '/images/stair.webp', alt: 'Micron stairwell ADA signage' },
  { src: '/images/bathroom.webp', alt: 'Micron bathroom ADA compliance signage' },
  { src: '/images/level.webp', alt: 'Micron level and floor identification signage' },
];

const MICRON_NARRATIVE = {
  meta: ['LOCATION( Boise, ID )', 'ROLE( Lead Environmental Graphic Designer )', 'TECH( Adobe Illustrator, CAD, Industrial Production Standards )'],
  sections: [
    {
      label: 'Context',
      text: "Micron's Boise expansion needed a signage system that could support a large, high-performance workplace while aligning with the facility's clean architectural language.",
    },
    {
      label: 'Problem',
      text: 'The core challenge was balancing strict ADA compliance and wayfinding clarity with the visual expectations of a modern, highly technical environment.',
    },
    {
      label: 'Process',
      text: 'I mapped the signage requirements, designed the system around legibility and durability, and worked through how each sign type would integrate with the building materials and circulation paths.',
    },
    {
      label: 'Proposal',
      text: 'The proposal was a unified environmental graphics system that made navigation easier, kept compliance intact, and maintained a restrained, high-tech aesthetic throughout the campus.',
    },
    {
      label: 'Result',
      text: 'The final wayfinding package delivered a clearer and more accessible experience for employees while giving the facility a consistent signage language from lobby markers to stair and restroom identification.',
    },
  ],
};

const MicronProject = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [loadedBySrc, setLoadedBySrc] = useState({});

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

      <section style={{ padding: 'var(--spacing-md) 10px var(--spacing-xxl)' }}>
        <div style={{ height: 1, background: 'var(--color-border)', marginLeft: -10, marginRight: -10 }} />
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
      <ProjectNarrative eyebrow="MICRON" meta={MICRON_NARRATIVE.meta} sections={MICRON_NARRATIVE.sections} />
    </motion.div>
  );
};

export default MicronProject;
