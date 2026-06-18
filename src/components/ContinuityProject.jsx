import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DecryptText from './DecryptText';
import ProjectNarrative from './ProjectNarrative';

const BLACK = 'var(--color-bg)';
const WHITE = 'var(--color-text)';

const CONTINUITY_IMAGES = [
  { src: '/images/continuity/screens.webp', alt: 'Continuity screens' },
  { src: '/images/continuity/app.webp', alt: 'Continuity app' },
  { src: '/images/continuity/continuity%20logo.webp', alt: 'Continuity logo' },
  { src: '/images/continuity/TSHIRT%20MOCKUP.webp', alt: 'Continuity t-shirt mockup' },
  { src: '/images/continuity/Cotton%20Totebag%20Mockup.webp', alt: 'Continuity totebag mockup' },
];

const CONTINUITY_NARRATIVE = {
  meta: ['LOCATION( Boise, ID / Remote )', 'ROLE( Lead Product Designer + Brand Strategist )', 'TECH( Figma, React, Framer Motion, GSAP )'],
  sections: [
    {
      label: 'Context',
      text: 'Continuity was conceived as a software-facing brand and product system that needed to communicate seamless persistence from first glance to product interaction.',
    },
    {
      label: 'Problem',
      text: 'The challenge was making the experience feel structural and trustworthy without becoming cold, static, or difficult to navigate through more complex workflows.',
    },
    {
      label: 'Process',
      text: 'I developed the visual language in Figma, translated that logic into a React build, and used motion studies to test how the interface could reinforce the idea of continuity.',
    },
    {
      label: 'Proposal',
      text: 'The proposal focused on a minimalist grid system, restrained motion feedback, and a digital identity that made performance and clarity feel like part of the brand.',
    },
    {
      label: 'Result',
      text: 'The final outcome tied brand, interface, and motion into one cohesive product story built to earn trust and feel modern on the web.',
    },
  ],
};

const ContinuityProject = () => {
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
              <DecryptText as="span" text="THE FUTURE IS NOW" trigger="mount" delay={200} duration={900} />
            </div>
          </h1>
        </div>
      </section>

      <section style={{ padding: 'var(--spacing-md) 10px var(--spacing-xxl)' }}>
        <div style={{ height: 1, background: 'var(--color-border)', marginLeft: -10, marginRight: -10 }} />
        <div>
          <div className="small-text" style={{ marginTop: 'var(--spacing-sm)', marginBottom: 20 }}>
            <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>CONTINUITY</span>
          </div>
          <div className="wim-rows">
            {CONTINUITY_IMAGES.reduce((rows, img, idx) => {
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
      <ProjectNarrative eyebrow="CONTINUITY" meta={CONTINUITY_NARRATIVE.meta} sections={CONTINUITY_NARRATIVE.sections} />
    </motion.div>
  );
};

export default ContinuityProject;
