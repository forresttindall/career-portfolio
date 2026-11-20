import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useIntroDone } from '../intro';

// A slow, grainy, monochrome gradient band that sits behind a section to break up the flat page color.
// Ported from the Creationbase site (dark palette only; this site has no light theme).
// Place it as the first child of a `position: relative` section; it fills the section and stays behind the
// content (give the content `position: relative; z-index: 1`).
//
// What renders:
// - Always: a CSS fallback (soft gradient + film grain), so the band looks right before the shader loads,
//   with reduced motion, or without WebGL.
// - Near the screen: the WebGL grain shader, lazy-loaded, fading in over the fallback.
//
// Performance: the shader renders at 1x and is capped near 2 megapixels (the grain is noise, so the extra
// retina resolution is invisible but quadruples the GPU work). Once mounted it stays mounted and just pauses
// off screen, so scrolling never pays to rebuild a WebGL context. Backdrops under the load intro wait for it.

const GrainShader = lazy(() => import('./GrainShader'));

// Greys tuned to sit just off --color-bg (#111111).
const PALETTE = { colorBack: '#191918', colors: ['#2c2c2a', '#3f3f3c', '#141414'], noise: 0.35, intensity: 0.4 };

// About 1920x1080. Big sections render a little softer than native, which grain hides.
const MAX_PIXELS = 1920 * 1080;

// SVG film grain for the fallback layer.
const NOISE = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

// fadeTop / fadeBottom: blend the band into the page color at that edge instead of ending on a hard line.
// playDuringIntro: keep moving while the load intro is up (only the intro's own backdrop sets this).
const GrainBackdrop = ({ shape = 'wave', speed = 1.2, rotation = 0, fadeTop = false, fadeBottom = false, playDuringIntro = false }) => {
  // One fade gets the longer blend (hero); a band faded on both edges splits it.
  const fadeSize = fadeTop && fadeBottom ? '32%' : '45%';
  const ref = useRef(null);
  const [near, setNear] = useState(false);
  const [mounted, setMounted] = useState(false); // shader loaded once; kept after that
  const [reduced, setReduced] = useState(false);
  const introDone = useIntroDone();
  // Phones: the band is tall and narrow, so the soft edge stretches into a haze. Tighten it there.
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const nq = window.matchMedia('(max-width: 700px)');
    const onNarrow = () => setNarrow(nq.matches);
    nq.addEventListener('change', onNarrow);
    return () => nq.removeEventListener('change', onNarrow);
  }, []);

  // Mount the shader the first time it comes near the viewport; afterwards just pause it when far away.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => { setNear(e.isIntersecting); if (e.isIntersecting) setMounted(true); }, { rootMargin: '200px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = near && !reduced && (introDone || playDuringIntro);

  return (
    <div ref={ref} className="grain-backdrop" aria-hidden="true">
      {mounted && (
        <Suspense fallback={null}>
          <div className="grain-backdrop__shader">
            <GrainShader
              colorBack={PALETTE.colorBack}
              colors={PALETTE.colors}
              shape={shape}
              softness={narrow ? 0.55 : 1}
              intensity={PALETTE.intensity}
              noise={PALETTE.noise}
              speed={running ? speed : 0}
              minPixelRatio={1}
              maxPixelCount={MAX_PIXELS}
              scale={1.1}
              rotation={rotation}
            />
          </div>
        </Suspense>
      )}
      {fadeTop && <div className="grain-backdrop__fade grain-backdrop__fade--top" style={{ height: fadeSize }} />}
      {fadeBottom && <div className="grain-backdrop__fade grain-backdrop__fade--bottom" style={{ height: fadeSize }} />}
      <style>{`
        .grain-backdrop {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .grain-backdrop::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(60% 70% at 30% 40%, rgba(90, 90, 84, 0.35), transparent 70%),
            radial-gradient(50% 60% at 75% 65%, rgba(60, 60, 58, 0.4), transparent 70%),
            #141414;
        }
        .grain-backdrop::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: ${NOISE};
          opacity: 0.16;
        }
        .grain-backdrop__shader {
          position: absolute;
          inset: 0;
          z-index: 1;
          animation: grain-backdrop-in 1.2s ease both;
        }
        .grain-backdrop__fade {
          position: absolute;
          left: 0;
          right: 0;
          z-index: 2;
        }
        .grain-backdrop__fade--top { top: 0; background: linear-gradient(to top, transparent, var(--color-bg)); }
        .grain-backdrop__fade--bottom { bottom: 0; background: linear-gradient(to bottom, transparent, var(--color-bg)); }
        @keyframes grain-backdrop-in { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default GrainBackdrop;
