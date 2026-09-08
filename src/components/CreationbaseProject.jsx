import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DecryptText from './DecryptText';
import ProjectNarrative from './ProjectNarrative';

const BLACK = 'var(--color-bg)';
const WHITE = 'var(--color-text)';

const CREATIONBASE_IMAGES = [
  { src: '/images/creationbase%20website%20consultancy.webp', alt: 'Creationbase website consultancy mockup' },
  { src: '/images/Creationbase%20T-shirt%20Mockup.webp', alt: 'Creationbase t-shirt mockup' },
  { src: '/images/creationbase%20A-Board%20Mockup.webp', alt: 'Creationbase A-Board mockup' },
  { src: '/images/creationbase%20consultacy%20mockup%202.webp', alt: 'Creationbase studio display website mockup' },
];

const CREATIONBASE_NARRATIVE = {
  meta: ['LOCATION( Boise, ID / Remote )', 'ROLE( Founder — Brand Identity, UI/UX, Creative Direction )', 'TECH( Figma, React, Framer Motion )'],
  sections: [
    {
      label: 'Context',
      text: 'Creationbase is a strategic creation consultancy built to help growing teams align brand, product, and digital execution under one coherent system. The studio operates across the entire product lifecycle — from identity work and positioning to production-ready UI code.',
    },
    {
      label: 'Problem',
      text: 'Consultancy brands often fall into one of two traps: they look corporate and lifeless, or they look stylized but unserious. The challenge was to build a brand that felt sharp, opinionated, and design-literate without sacrificing credibility with technical and operational stakeholders.',
    },
    {
      label: 'Process',
      text: 'I developed the visual identity system in parallel with the website structure, treating the UI as both a delivery medium and a brand surface. Motion, typography, and asset behavior were prototyped together rather than siloed into separate deliverables.',
    },
    {
      label: 'Proposal',
      text: 'The proposal centered on a minimalist but high-contrast typographic system, a tight motion vocabulary, and a set of modular brand assets (apparel, signage, collateral) that prove the identity works at every physical and digital scale.',
    },
    {
      label: 'Result',
      text: 'The final system ties brand identity, UI/UX, and creative direction into one cohesive studio expression at www.creationbase.io — a foundation that scales cleanly across client work, marketing, and in-studio operations.',
    },
  ],
};

const CreationbaseProject = () => {
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
              <DecryptText as="span" text="Creationbase" trigger="mount" delay={200} duration={900} />
            </div>
          </h1>
        </div>
      </section>

      <section style={{ padding: 'var(--spacing-md) 10px var(--spacing-xxl)' }}>
        <div style={{ height: 1, background: 'var(--color-border)', marginLeft: -10, marginRight: -10 }} />
        <div>
          <div className="small-text" style={{ marginTop: 'var(--spacing-sm)', marginBottom: 20 }}>
            <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>CREATIONBASE</span>
            <span> — STRATEGIC CREATION CONSULTANCY</span>
            <span style={{ marginLeft: 'var(--spacing-md)' }}>
              <a
                href="https://www.creationbase.io"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '3px' }}
              >
                WWW.CREATIONBASE.IO
              </a>
            </span>
          </div>
          <div className="wim-rows">
            {CREATIONBASE_IMAGES.reduce((rows, img, idx) => {
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
      <ProjectNarrative eyebrow="CREATIONBASE" meta={CREATIONBASE_NARRATIVE.meta} sections={CREATIONBASE_NARRATIVE.sections} />
    </motion.div>
  );
};

export default CreationbaseProject;
