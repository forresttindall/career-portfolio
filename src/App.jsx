import { useState, useEffect, useRef, useMemo, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { ArrowUpRight, CopySimple } from '@phosphor-icons/react';
import { useLocation, useNavigate } from 'react-router-dom';
import BoiseAnalogClubCaseStudy from './components/BoiseAnalogClubCaseStudy';
import OpenNetizenProject from './components/OpenNetizenProject';
import Contact from './components/Contact';
import RicochetProject from './components/RicochetProject';
import MicronProject from './components/MicronProject';
import Playground from './components/Playground';
import WimProject from './components/WimProject';
import ContinuityProject from './components/ContinuityProject';
import DecryptText from './components/DecryptText';
import Schema from './components/Schema';
import { Analytics } from '@vercel/analytics/react';

const UI_LIGHT = 'var(--color-text)';
const UI_DARK = 'var(--color-bg)';
const HOME_SECTION_DIVIDER = '1px solid var(--color-border)';
const HOME_HERO_TITLE_LINES = [
  'Designing products that ship.',
  'Clear UX. Real business impact.',
];
const HERO_AVAILABILITY = {
  label: 'Available',
  color: '#5FE37C',
};
const INDEX01_PROJECTS = [
  {
    id: 'wim',
    titleLines: ['WIM'],
    scope: 'Scope(Identity, App UI/UX Design)',
    primaryImage: '/images/wim truck mockup.webp',
    primaryAlt: 'WIM truck mockup',
    secondaryImage: '/images/wim software.webp',
    secondaryAlt: 'WIM software mockup',
    secondaryFallbackImage: '/images/wim HAT MOCKUP.webp',
    sideOffset: 'clamp(2rem, 7vw, 5rem)',
  },
  {
    id: 'continuity',
    titleLines: ['Continuity'],
    scope: 'Scope(Identity, App UI/UX Design)',
    primaryImage: '/images/continuity/screens.webp',
    primaryAlt: 'Continuity screens',
    secondaryImage: '/images/continuity/app.webp',
    secondaryAlt: 'Continuity app',
    secondaryFallbackImage: '/images/continuity/TSHIRT%20MOCKUP.webp',
    sideOffset: 'clamp(2rem, 7vw, 5rem)',
  },
  {
    id: 'on',
    titleLines: ['Open Netizen'],
    scope: 'Scope(Identity, Visual System)',
    primaryImage: '/images/OPEN NETIZEN CARD.jpg',
    primaryAlt: 'Open Netizen brand card',
    secondaryImage: '/images/OPEN NETIZEN WEBSITE MOCKUP.jpg',
    secondaryAlt: 'Open Netizen website mockup',
    sideOffset: 'clamp(3rem, 8vw, 6rem)',
  },
  {
    id: 'micron',
    titleLines: ['Micron'],
    scope: 'Scope(Environmental Signage, ADA Systems)',
    primaryImage: '/images/bathroom.webp',
    primaryAlt: 'Micron bathroom ADA signage',
    secondaryImage: '/images/lobby.webp',
    secondaryAlt: 'Micron lobby environmental signage',
    sideOffset: 'clamp(2rem, 7vw, 5rem)',
  },
];

const SiteFooter = ({
  onContactClick,
  reserveRightRail = false,
}) => {
  const [emailCopied, setEmailCopied] = useState(false);
  const shuffledFooterImages = useMemo(() => {
    const arr = [...FOOTER_CAROUSEL_IMAGES];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }, []);
  const footerImageMarqueeDuration = useMemo(() => {
    const seconds = Math.max(34, shuffledFooterImages.length * 2);
    return `${seconds}s`;
  }, [shuffledFooterImages.length]);
  const copyEmailAddress = async () => {
    const email = 'Forrest@creationbase.io';
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };
  return (
    <motion.section
      data-header-theme="light"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      style={{ position: 'relative', overflow: 'hidden', background: UI_DARK }}
    >
      <div className={`footer-shell${reserveRightRail ? ' footer-shell--tracker' : ''}`} style={{ padding: 'var(--spacing-md) var(--spacing-md) var(--spacing-xxl)', minHeight: '80vh', position: 'relative', zIndex: 1 }}>
        <div className="footer-top">
          <div className="footer-cta">
            <div>
              <h2 className="section-title" style={{ fontWeight: 400, marginBottom: 0, fontSize: 'clamp(22px, 9vw, 72px)' }}>Let&apos;s Work<br />Together</h2>
              <div className="footer-cta__actions">
                <button type="button" className="newsletter-button footer-cta__primary" onClick={onContactClick}>
                  Contact Form
                </button>
                <button type="button" className="newsletter-button newsletter-button--outline footer-cta__secondary" onClick={copyEmailAddress}>
                  <CopySimple size={14} weight="regular" aria-hidden="true" />
                  {emailCopied ? 'Email Copied' : 'Copy Email Address'}
                </button>
              </div>
            </div>
          </div>
          <div className="footer-links-column">
            <p className="small-text" style={{ marginBottom: 'var(--spacing-md)', fontWeight: 'var(--font-mono-weight-bold)' }}>LINKS</p>
            <ul className="small-text footer-links-list">
              <li><a href="/contact" onClick={(ev) => { ev.preventDefault(); onContactClick(); }}>CONTACT FORM</a></li>
              <li><a href="https://instagram.com/creationbase.io" target="_blank" rel="noreferrer">INSTAGRAM</a></li>
              <li><a href="https://www.linkedin.com/company/creationbaseio/" target="_blank" rel="noreferrer">LINKEDIN</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-marquee footer-marquee--text full-bleed">
          <div className="footer-marquee__track footer-marquee__track--reverse">
            {[...Array(20)].map((_, index) => (
              <span key={index} className="footer-marquee__text-item small-text">
                FORREST TINDALL •
              </span>
            ))}
          </div>
        </div>

        <div className="footer-marquee footer-marquee--images full-bleed">
          <div className="footer-marquee__track" style={{ '--footer-marquee-duration': footerImageMarqueeDuration }}>
            {[...shuffledFooterImages, ...shuffledFooterImages].map((item, index) => (
              <div key={`${item.src}-${index}`} className="footer-carousel-card">
                <img src={item.src} alt={item.alt} className="footer-carousel-card__image" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '0', borderTop: HOME_SECTION_DIVIDER, paddingTop: '10px' }} className="flex">
          <p className="small-text" style={{ flex: 1 }}>© 2026 FORREST TINDALL</p>
          <p className="small-text" style={{ textAlign: 'right' }}>
            DESIGNED & CODED IN BOISE, ID
          </p>
        </div>
      </div>
    </motion.section>
  );
};

const projects = [
  {
    title: "Wim Software",
    category: "UI/UX Design",
    image: "/images/wim software.webp",
    description: "website design and prototyping",
    year: "2026"
  },
  {
    title: "Amore",
    category: "UI/UX Design & Dev",
    image: "/images/amore mockup.png",
    description: "Restaurant website design in figma and dev in REACT",
    year: "2025"
  },
  {
    title: "Clearfeed",
    category: "UI/UX Design & Dev",
    image: "/images/clearfeed.png",
    description: "Desktop application design in figma and dev in ELECTRON",
    year: "2025"
  },
  {
    title: "Arrowleaf",
    category: "UI/UX Design & Dev",
    image: "/images/arrowleaf2.webp",
    description: "Website design in figma and dev in REACT",
    year: "2024"
  },
];

const graphicDesign = [

    {
    title: "WIM",
    category: "Brand Identity",
    image: "/images/wim safety shirt.webp",
    description: "Logo and Visual Identity System",
    year: "2026"
  },

 {
    title: "Alias Zine",
    category: "Brand Identity",
    image: "/images/gif.gif",
    description: "Logo Design, Animation Design",
    year: "2025"
  },
 
  {
    title: "Continuity",
    category: "Brand Identity",
    image: "/images/continuity/screens.webp",
    description: "Social Media Promotional Asset Design",
    year: "2026"
  },
 
  
  {
    title: "Creationbase",
    category: "Asset Design",
    image: "/images/FUTURE SOUNDS MOCKUP.png",
    description: "Digital assets for launch campaign.",
    year: "2025"
  },


  


  {
    title: "WIM",
    category: "Design",
    image: "/images/wim truck mockup.webp",
    description: "Label illustration and design",
    year: "2025"
  },
  {
    title: "Continuity",
    category: "Brand Identity",
    image: "/images/continuity/TSHIRT MOCKUP.webp",
    description: "Promotional Poster Design",
    year: "2025"
  }
];

const testimonials = [
  {
    name: "Lori Tindall",
    image: "/images/lori.jpg",
    stars: "★★★★★",
    headline: "FIVE STARS!!!",
    text: "I put off rebranding my business and building out a new website because I just didn't have the time or inclination to do it all myself. Working with Forrest was easy and fun because he was able to draw information out of me that helped make the design and layout reflect my values. He also built elements into my website that gets it ranked higher in search engines and it gets noticed."
  },
  {
    name: "Jackie Beauchaine",
    image: "/images/jackie.jpg",
    stars: "★★★★★",
    headline: "I couldn't be happier!",
    text: "Forrest did a fantastic job on my website. It's now ranking higher on Google and bringing in more business. He gave my site the professional look I always wanted!"
  },
  {
    name: "Douglas Herlocker",
    image: "/images/douglas.webp",
    stars: "★★★★★",
    headline: "Very pleased with the results!",
    text: "His quality and attention to detail is among the best. He built a website for my business partner that was clean, professional, and exceeded expectations."
  }
];

const WORK_HISTORY = [
  { year: '2026', company: 'Electric Fun', role: 'UI/UX Designer', current: true },
  { year: '2026', company: 'CMYK Graphics', role: 'Graphic Designer' },
  { year: '2025', company: 'Superbase', role: 'UI/UX Designer' },
  { year: '2022', company: 'Creationbase', role: 'Visual Designer' },
  { year: '2019', company: 'Ramboll', role: 'Junior Frontend Engineer' },
];

const FOOTER_CAROUSEL_IMAGES = [
  { src: '/images/ricochet mockup.webp', alt: 'Ricochet footer carousel image' },
  { src: '/images/amore mockup.png', alt: 'Amore footer carousel image' },
  { src: '/images/clearfeed.png', alt: 'Clearfeed footer carousel image' },
  { src: '/images/gif.gif', alt: 'Graphic design footer carousel image' },
  { src: '/images/bac gen x soft club.png', alt: 'Boise Analog footer carousel image' },
  { src: '/images/device-1.PNG', alt: 'Playground footer carousel image' },
  { src: '/images/pilot micro new.png', alt: 'Art print footer carousel image' },
  { src: '/images/OPEN NETIZEN CARD.jpg', alt: 'Open Netizen footer carousel image' },
  { src: '/images/OPEN NETIZEN WEBSITE MOCKUP.jpg', alt: 'Open Netizen footer carousel image' },
  { src: '/images/OPEN NETIZEN.jpg', alt: 'Open Netizen footer carousel image' },
  { src: '/images/continuity/screens.webp', alt: 'Continuity screens footer carousel image' },
  { src: '/images/continuity/app.webp', alt: 'Continuity app footer carousel image' },
  { src: '/images/continuity/continuity%20logo.webp', alt: 'Continuity logo footer carousel image' },
  { src: '/images/continuity/TSHIRT%20MOCKUP.webp', alt: 'Continuity t-shirt mockup footer carousel image' },
  { src: '/images/continuity/Cotton%20Totebag%20Mockup.webp', alt: 'Continuity totebag mockup footer carousel image' },
  { src: '/images/wim software.webp', alt: 'WIM software mockup footer carousel image' },
  { src: '/images/wim typemark.webp', alt: 'WIM typemark footer carousel image' },
  { src: '/images/wim logomark.webp', alt: 'WIM logomark footer carousel image' },
  { src: '/images/wim safety shirt.webp', alt: 'WIM safety shirt mockup footer carousel image' },
  { src: '/images/wim truck mockup.webp', alt: 'WIM truck mockup footer carousel image' },
  { src: '/images/wim HAT MOCKUP.webp', alt: 'WIM hat mockup footer carousel image' },
];

const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-md)',
        cursor: 'zoom-out'
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={onClose}
        style={{
          width: '100%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'zoom-out',
          position: 'relative'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-46px',
            right: 0,
            padding: 4,
            background: 'rgba(0, 0, 0, 0.55)',
            borderRadius: 12,
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
          }}
        >
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--color-border)',
              borderRadius: 10,
              padding: '10px 16px',
              color: UI_LIGHT,
              fontSize: 'calc(var(--fs-xs) + 3px)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontWeight: 'var(--font-mono-weight)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
            }}
          >
            Close
          </button>
        </div>
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '100%' }}>
            <img 
              src={project.image} 
              alt={project.title}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '80vh', 
                objectFit: 'contain',
                display: 'block'
              }} 
            />
            <div className="home-project-layer__meta" style={{ marginTop: 'var(--spacing-md)', color: UI_LIGHT, padding: 0 }}>
              <div className="home-project-layer__copy">
                <h3
                  className="home-project-layer__inline-title"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 'var(--font-mono-weight-bold)',
                    fontSize: 'var(--fs-sm)',
                    lineHeight: 1.2,
                    color: UI_LIGHT,
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                  }}
                >
                  {`${project.title} •`}
                </h3>
                <div className="home-project-layer__details">
                  <span>{`SCOPE( ${project.category} )`}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const heroTitleRef = useRef(null);
  const [heroTitleFontSizePx, setHeroTitleFontSizePx] = useState(null);
  const [, setHeaderTheme] = useState(() => {
    if (typeof window === 'undefined' || !window.location) return 'light';
    const p = window.location.pathname;
    if (p === '/') return 'dark';
    return 'light';
  });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [navLogoSpinTick, setNavLogoSpinTick] = useState(0);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 700px)');
    setIsMobile(mql.matches);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  
  const location = useLocation();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (location.pathname !== '/') {
      setHeroTitleFontSizePx(null);
      return;
    }

    const el = heroTitleRef.current;
    if (!el) return;

    let raf = 0;
    let ro = null;

    const compute = () => {
      const node = heroTitleRef.current;
      if (!node) return;

      const prevInlineSize = node.style.fontSize;
      node.style.fontSize = '';
      const computed = window.getComputedStyle(node);
      const baseSize = Number.parseFloat(computed.fontSize || '0');
      const fontFamily = computed.fontFamily || '';
      const fontWeight = computed.fontWeight || '400';
      const fontStyle = computed.fontStyle || 'normal';
      const fontVariant = computed.fontVariant || 'normal';
      const letterSpacingValue = computed.letterSpacing || '0px';
      const textTransform = computed.textTransform || 'none';
      node.style.fontSize = prevInlineSize;

      const availableWidth = node.clientWidth;
      if (!Number.isFinite(baseSize) || baseSize <= 0 || !availableWidth) return;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.font = `${fontStyle} ${fontVariant} ${fontWeight} ${baseSize}px ${fontFamily}`;

      const letterSpacingNum = Number.parseFloat(letterSpacingValue);
      const letterSpacingPx =
        Number.isFinite(letterSpacingNum) && letterSpacingValue.endsWith('em')
          ? letterSpacingNum * baseSize
          : (Number.isFinite(letterSpacingNum) ? letterSpacingNum : 0);

      const lineWidths = HOME_HERO_TITLE_LINES.map((line) => {
        const t =
          textTransform === 'uppercase'
            ? String(line).toUpperCase()
            : String(line);
        const measured = ctx.measureText(t).width;
        const extra = Math.max(0, t.length - 1) * letterSpacingPx;
        return measured + extra;
      });

      const maxLineWidth = Math.max(...lineWidths);
      if (!Number.isFinite(maxLineWidth) || maxLineWidth <= 0) return;

      const safety = 0.92;
      const scale = (availableWidth / maxLineWidth) * safety;
      if (scale >= 1) {
        setHeroTitleFontSizePx(null);
        return;
      }

      const minPx = 22;
      const targetPx = Math.floor(baseSize * scale);
      const next = Math.max(minPx, Math.min(baseSize, targetPx));
      setHeroTitleFontSizePx((prev) => (prev === next ? prev : next));
    };

    const schedule = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = 0;
        compute();
      });
    };

    schedule();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(schedule).catch(() => {});
    }

    ro = new ResizeObserver(schedule);
    ro.observe(el);
    window.addEventListener('resize', schedule);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', schedule);
      if (ro) ro.disconnect();
    };
  }, [location.pathname]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    let lastWidth = window.innerWidth;
    const setStableVh = () => {
      document.documentElement.style.setProperty('--vh-stable', `${window.innerHeight}px`);
    };
    const onResize = () => {
      const w = window.innerWidth;
      if (w !== lastWidth) {
        lastWidth = w;
        setStableVh();
      }
    };
    setStableVh();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') return;
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect');
    if (!redirect) return;
    navigate(redirect, { replace: true });
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    if (location.pathname !== '/') return;
    const adjustRowHeights = () => {
      const isMobile = window.matchMedia('(max-width: 700px)').matches;
      const rows = Array.from(document.querySelectorAll('.uiux-row'));
      const maxRowH = Math.round(Math.max(260, Math.min(520, window.innerHeight * 0.6)));
      const maxSingleRowH = Math.round(Math.max(340, Math.min(680, window.innerHeight * 0.72)));
      rows.forEach((row) => {
        const frames = Array.from(row.querySelectorAll('.uiux-frame'));
        if (frames.length === 0) return;
        if (isMobile) {
          frames.forEach((frame) => {
            frame.style.height = '';
          });
          return;
        }
        const imgs = Array.from(row.querySelectorAll('.uiux-frame img'));
        if (frames.length !== imgs.length) return;
        const isSingle = row.classList.contains('uiux-row--single');
        const heights = imgs.map((img, idx) => {
          const frame = frames[idx];
          const w = frame.getBoundingClientRect().width;
          const naturalW = img.naturalWidth || w;
          const naturalH = img.naturalHeight || w;
          const ratio = naturalH / naturalW;
          return Math.max(0, Math.round(w * ratio));
        });
        const minH = Math.min(...heights);
        const targetH = Math.min(minH, isSingle ? maxSingleRowH : maxRowH);
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
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/') {
      setHeaderTheme('light');
      return;
    }

    const parseRgb = (value) => {
      const m =
        value &&
        value.match(/rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)(?:\s*,\s*([0-9.]+))?\s*\)/i);
      if (!m) return null;
      const r = Number(m[1]);
      const g = Number(m[2]);
      const b = Number(m[3]);
      const a = m[4] !== undefined ? Number(m[4]) : 1;
      if (![r, g, b, a].every((n) => Number.isFinite(n))) return null;
      return { r, g, b, a };
    };

    const isTransparent = (value) =>
      value === 'transparent' || value === 'rgba(0, 0, 0, 0)' || value === 'rgba(0,0,0,0)';

    const luminance = ({ r, g, b }) => {
      const toLinear = (v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      const R = toLinear(r);
      const G = toLinear(g);
      const B = toLinear(b);
      return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    };

    const getThemeFromElement = (startEl) => {
      let el = startEl;
      while (el && el !== document.documentElement) {
        if (el.getAttribute) {
          const explicit = el.getAttribute('data-header-theme');
          if (explicit === 'dark' || explicit === 'light') return explicit;
        }
        if (el instanceof Element) {
          const bg = window.getComputedStyle(el).backgroundColor;
          if (bg && !isTransparent(bg)) {
            const rgb = parseRgb(bg);
            if (rgb && rgb.a > 0) return luminance(rgb) < 0.4 ? 'dark' : 'light';
          }
        }
        el = el.parentElement;
      }
      return 'light';
    };

    const sampleBelowHeader = () => {
      if ((window.scrollY || 0) < 8) {
        setHeaderTheme('dark');
        return;
      }
      const x = Math.floor(window.innerWidth / 2);
      const headerEl = document.querySelector('.site-header');
      let y = 2;
      if (headerEl) {
        const rect = headerEl.getBoundingClientRect();
        y = Math.max(2, Math.ceil(rect.bottom + 2));
      }
      const el = document.elementFromPoint(x, y);
      if (!el) return;
      setHeaderTheme(getThemeFromElement(el));
    };

    let raf = 0;
    const schedule = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = 0;
        sampleBelowHeader();
      });
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    setHeaderTheme('dark');
    requestAnimationFrame(() => requestAnimationFrame(sampleBelowHeader));

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [location.pathname]);

  const [activeCaseStudy, setActiveCaseStudy] = useState(null);
  const homeScrollYRef = useRef(0);
  const pendingHomeScrollRestoreRef = useRef(false);
  const openCaseStudy = (id) => {
    const y = window.scrollY || 0;
    homeScrollYRef.current = y;
    sessionStorage.setItem('homeScrollY', String(y));
    pendingHomeScrollRestoreRef.current = true;
    if (id === 'wim') navigate('/wim');
    else if (id === 'continuity') navigate('/continuity');
    else if (id === 'on') navigate('/open-netizen');
    else if (id === 'bac') navigate('/boise-analog-club');
    else if (id === 'ricochet') navigate('/ricochet');
    else if (id === 'micron') navigate('/micron');
    else if (id === 'playground') navigate('/playground');
  };

  const openContact = () => {
    setMobileNavOpen(false);
    if (location.pathname === '/') {
      const y = window.scrollY || 0;
      homeScrollYRef.current = y;
      sessionStorage.setItem('homeScrollY', String(y));
      pendingHomeScrollRestoreRef.current = true;
    } else {
      pendingHomeScrollRestoreRef.current = false;
    }
    navigate('/contact');
  };

  const goToSection = (id) => {
    setMobileNavOpen(false);
    pendingHomeScrollRestoreRef.current = false;
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `/#${id}`);
    } else {
      window.location.hash = id;
    }
  };

  const restoreHomeScroll = () => {
    const stored = sessionStorage.getItem('homeScrollY');
    const y = stored ? Number(stored) : homeScrollYRef.current;
    window.scrollTo(0, Number.isFinite(y) ? y : 0);
  };

  useEffect(() => {
    if (location.pathname !== '/') return;
    const hash = (location.hash || '').replace('#', '');
    if (!hash) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === '/wim') setActiveCaseStudy('wim');
    else if (pathname === '/fastburger') {
      setActiveCaseStudy(null);
      navigate('/', { replace: true });
    }
    else if (pathname === '/continuity') setActiveCaseStudy('continuity');
    else if (pathname === '/open-netizen') setActiveCaseStudy('on');
    else if (pathname === '/boise-analog-club') setActiveCaseStudy('bac');
    else if (pathname === '/ricochet') setActiveCaseStudy('ricochet');
    else if (pathname === '/micron') setActiveCaseStudy('micron');
    else if (pathname === '/playground') setActiveCaseStudy('playground');
    else if (pathname === '/contact') setActiveCaseStudy('contact');
    else if (
      pathname === '/services' ||
      pathname === '/merch' ||
      pathname === '/merch/cart' ||
      pathname === '/merch/checkout' ||
      pathname === '/blog' ||
      pathname.startsWith('/blog/') ||
      pathname === '/material-lab' ||
      pathname.startsWith('/material-lab/') ||
      pathname === '/tools' ||
      pathname.startsWith('/tools/') ||
      pathname === '/photography' ||
      pathname === '/gallery' ||
      pathname === '/worksharp'
    ) {
      setActiveCaseStudy(null);
      navigate('/', { replace: true });
    }
    else setActiveCaseStudy(null);
  }, [location.pathname, navigate]);

  const headerColor = UI_LIGHT;
  const headerLogoSrc = '/images/new logo.png';
  const mobileNavBg = 'rgba(0, 0, 0, 0.62)';
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothScrollVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const navScrollSpin = useMotionValue(0);
  const navScrollSpinReverse = useTransform(navScrollSpin, (v) => -v);
  const navScrollRotate = navScrollSpin;
  const navScrollRotateReverse = navScrollSpinReverse;
  const [cursorEnabled, setCursorEnabled] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorXSpring = useSpring(cursorX, { damping: 30, stiffness: 500, mass: 0.2 });
  const cursorYSpring = useSpring(cursorY, { damping: 30, stiffness: 500, mass: 0.2 });

  useEffect(() => {
    if (reduceMotion) {
      setCursorEnabled(false);
      return;
    }
    const pointerQuery = window.matchMedia('(pointer: fine)');
    const hoverQuery = window.matchMedia('(hover: hover)');
    const update = () => setCursorEnabled(pointerQuery.matches && hoverQuery.matches);
    update();
    if (pointerQuery.addEventListener) {
      pointerQuery.addEventListener('change', update);
      hoverQuery.addEventListener('change', update);
      return () => {
        pointerQuery.removeEventListener('change', update);
        hoverQuery.removeEventListener('change', update);
      };
    }
    pointerQuery.addListener(update);
    hoverQuery.addListener(update);
    return () => {
      pointerQuery.removeListener(update);
      hoverQuery.removeListener(update);
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (!cursorEnabled) return;
    const onMove = (ev) => {
      cursorX.set(ev.clientX);
      cursorY.set(ev.clientY);
    };
    const onLeave = () => {
      cursorX.set(-100);
      cursorY.set(-100);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onMove, { passive: true });
    window.addEventListener('blur', onLeave);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onMove);
      window.removeEventListener('blur', onLeave);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [cursorEnabled, cursorX, cursorY]);

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return;
    const v = smoothScrollVelocity.get();
    const clamped = Math.max(-4000, Math.min(4000, v));
    navScrollSpin.set(navScrollSpin.get() + clamped * 0.05 * (delta / 1000));
  });

  const goHome = () => {
    setNavLogoSpinTick((value) => value + 1);
    setMobileNavOpen(false);
    pendingHomeScrollRestoreRef.current = false;
    homeScrollYRef.current = 0;
    sessionStorage.removeItem('homeScrollY');
    setHeaderTheme('dark');
    if (location.pathname !== '/') navigate('/');
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  const toggleMobileNav = () => {
    setNavLogoSpinTick((value) => value + 1);
    setMobileNavOpen((value) => !value);
  };

  return (
    <div className="app">
      <Schema type="LocalBusiness" />
      {cursorEnabled && (
         <motion.div
           aria-hidden="true"
           className="cursor-follower"
           style={{ x: cursorXSpring, y: cursorYSpring }}
         />
       )}
      <motion.header 
        className="site-header"
        data-mobile-nav-open={mobileNavOpen ? 'true' : 'false'}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ 
          color: headerColor
        }}
      >
        <nav className="site-nav" aria-label="Primary">
          <div className="site-nav__menu-button">
            <button
              type="button"
              className="site-nav__home-link"
              aria-label="Go to home"
              onClick={goHome}
            >
              <span className="site-nav__menu-logos" aria-hidden="true">
                <motion.span style={{ display: 'inline-flex', rotate: navScrollRotate }}>
                  <motion.img
                    src={headerLogoSrc}
                    alt=""
                    className="site-nav__menu-logo"
                    animate={{ rotate: navLogoSpinTick * 360 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  />
                </motion.span>
                <motion.span style={{ display: 'inline-flex', rotate: navScrollRotateReverse }}>
                  <motion.img
                    src={headerLogoSrc}
                    alt=""
                    className="site-nav__menu-logo"
                    animate={{ rotate: navLogoSpinTick * -360 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  />
                </motion.span>
              </span>
            </button>
            <button
              type="button"
              className="site-nav__menu-toggle"
              aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav-panel"
              onClick={toggleMobileNav}
            >
              <span className="site-nav__menu-label">{mobileNavOpen ? 'Close' : 'Menu'}</span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            id="mobile-nav-panel"
            key="mobile-nav"
            className="mobile-nav-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileNavOpen(false)}
            style={{ background: mobileNavBg, color: headerColor }}
          >
            <motion.div
              className="mobile-nav-panel__inner"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              onClick={(ev) => ev.stopPropagation()}
            >
              <div className="mobile-nav-grid">
                <button type="button" className="mobile-nav-link" onClick={() => goToSection('design')}>
                  Graphic Design
                </button>
                <button type="button" className="mobile-nav-link" onClick={() => goToSection('dev')}>
                  UI/UX Design
                </button>
                <button type="button" className="mobile-nav-link" onClick={() => goToSection('resume')}>
                  Resume
                </button>
                <button type="button" className="mobile-nav-link" onClick={() => goToSection('about')}>
                  About
                </button>
                <button type="button" className="mobile-nav-link" onClick={openContact}>
                  Contact Form
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          if (!activeCaseStudy && pendingHomeScrollRestoreRef.current) {
            requestAnimationFrame(() => requestAnimationFrame(() => restoreHomeScroll()));
            pendingHomeScrollRestoreRef.current = false;
          }
        }}
      >
        {activeCaseStudy === 'contact' ? (
          <Contact key="contact" />
        ) : activeCaseStudy === 'wim' ? (
          <WimProject key="wim" />
        ) : activeCaseStudy === 'continuity' ? (
          <ContinuityProject key="continuity" />
        ) : activeCaseStudy === 'bac' ? (
          <BoiseAnalogClubCaseStudy key="bac" />
        ) : activeCaseStudy === 'on' ? (
          <OpenNetizenProject key="on" />
        ) : activeCaseStudy === 'ricochet' ? (
          <RicochetProject key="ricochet" />
        ) : activeCaseStudy === 'micron' ? (
          <MicronProject key="micron" />
        ) : activeCaseStudy === 'playground' ? (
          <Playground key="playground" />
        ) : (
          <motion.div
            key="homepage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Hero */}
            <section data-header-theme="light" style={{ position: 'relative', overflow: 'hidden', background: UI_DARK, color: UI_LIGHT, borderBottom: HOME_SECTION_DIVIDER }}>
              <div style={{ minHeight: 'var(--home-hero-min-h)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 'var(--spacing-lg)', padding: 'var(--spacing-md) var(--spacing-md) var(--spacing-sm)', position: 'relative', zIndex: 1 }}>
                <h1 className="home-hero__title" ref={heroTitleRef} style={{ 
                  fontFamily: 'var(--font-display)', fontWeight: 'var(--font-display-weight)', 
                  fontSynthesis: 'weight',
                  marginBottom: 'auto',
                  fontSize: heroTitleFontSizePx ? `${heroTitleFontSizePx}px` : undefined,
                }}>
                  <div className="home-hero__title-line" style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
                    <DecryptText as="span" text={HOME_HERO_TITLE_LINES[0]} trigger="mount" delay={200} duration={900} />
                  </div>
                  <div className="home-hero__title-line" style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
                    <DecryptText as="span" text={HOME_HERO_TITLE_LINES[1]} trigger="mount" delay={320} duration={900} />
                  </div>
                </h1>
                <motion.div 
                  className="home-hero__meta"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(220px, 1.15fr) minmax(240px, 1.7fr) minmax(160px, 0.9fr)',
                    alignItems: 'start',
                    gap: 'var(--spacing-lg)'
                  }}
                >
                  <div className="small-text home-hero__identity" style={{ fontSize: 'var(--fs-sm)', lineHeight: 1.2 }}>
                    <div className="home-hero__identity-desktop home-hero__meta-col">
                      <div className="home-hero__meta-top">
                        <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Forrest Tindall</span>
                        <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: 'var(--color-text)', display: 'inline-block', flex: '0 0 auto' }} />
                      </div>
                      <div className="home-hero__meta-bottom">(PRODUCT DESIGNER + UI/UX DESIGNER)</div>
                    </div>
                    <div className="home-hero__identity-mobile">
                      <div style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>Forrest Tindall •</div>
                      <div>(PRODUCT DESIGNER + UI/UX DESIGNER)</div>
                    </div>
                  </div>
                  <div className="small-text home-hero__services home-hero__meta-col" style={{ fontSize: 'var(--fs-sm)', lineHeight: 1.2, textAlign: 'center', fontWeight: 'var(--font-mono-weight-bold)' }}>
                    <div className="home-hero__meta-top" style={{ visibility: 'hidden' }}>Spacer</div>
                    <div className="home-hero__meta-bottom">UI/UX + Product + Brand + Visual Systems</div>
                  </div>
                  <div className="small-text home-hero__availability home-hero__meta-col" style={{ fontSize: 'var(--fs-sm)', lineHeight: 1.2, justifySelf: 'end', textAlign: 'right' }}>
                    <div className="home-hero__meta-top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <span>currently:</span>
                      <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: HERO_AVAILABILITY.color, display: 'inline-block' }} />
                      <span>{HERO_AVAILABILITY.label}</span>
                    </div>
                    <div className="home-hero__meta-bottom">Remote / Worldwide</div>
                  </div>
                </motion.div>
              </div>

            </section>



            {/* Featured Case Studies */}
            <motion.section 
              data-header-theme="light"
              style={{ 
                padding: '0',
                borderBottom: 'none',
                minHeight: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div className="home-project-stack">
                {INDEX01_PROJECTS.map((project, index) => (
                  <article
                    key={project.id}
                    className="home-project-layer"
                    style={{ zIndex: index + 1 }}
                  >
                    <motion.div
                      onClick={() => openCaseStudy(project.id)}
                      className="home-project-layer__sticky"
                    >
                      <div className="home-project-layer__panel">
                        <motion.div className="home-project-layer__media" whileHover="hover">
                          <div className="home-project-layer__media-main">
                            <img
                              src={project.secondaryImage}
                              alt={project.secondaryAlt}
                              className="home-project-layer__image"
                              onError={(ev) => {
                                ev.currentTarget.onerror = null;
                                ev.currentTarget.src = project.secondaryFallbackImage || project.primaryImage;
                              }}
                            />
                          </div>
                          <div className="home-project-layer__media-side">
                            <img
                              src={project.primaryImage}
                              alt={project.primaryAlt}
                              className="home-project-layer__image"
                            />
                          </div>
                          <motion.div
                            className="home-project-layer__media-overlay"
                            variants={{
                              hover: { opacity: 1 },
                            }}
                          >
                            <div className="home-project-layer__media-overlay-panels" aria-hidden="true">
                              <div className="home-project-layer__media-overlay-panel home-project-layer__media-overlay-panel--main" />
                              <div className="home-project-layer__media-overlay-panel home-project-layer__media-overlay-panel--side" />
                            </div>
                            <div className="home-project-layer__view-chip">View</div>
                          </motion.div>
                        </motion.div>
                        <div className="home-project-layer__meta">
                          <div className="home-project-layer__copy">
                            <h3
                              className="home-project-layer__inline-title"
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontWeight: 'var(--font-mono-weight-bold)',
                                fontSize: 'var(--fs-sm)',
                                lineHeight: 1.2,
                                color: UI_LIGHT,
                                margin: 0,
                                textTransform: 'uppercase',
                                letterSpacing: '0.02em',
                              }}
                            >
                              {`${project.titleLines.join(' ')} •`}
                            </h3>
                            <div className="home-project-layer__details small-text">
                              <span>{project.scope}</span>
                              <span>{`Project (${String(index + 1).padStart(2, '0')})`}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </article>
                ))}
              </div>
            </motion.section>

            <section id="dev" style={{ padding: 'var(--spacing-xxl) var(--spacing-md)', background: UI_DARK, color: UI_LIGHT }}>
              <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)', alignItems: 'baseline', paddingBottom: 'var(--spacing-sm)', borderBottom: HOME_SECTION_DIVIDER }}>
                <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: UI_LIGHT }}>
                  <DecryptText as="span" text="UI/UX DESIGN + DEV" trigger="inView" duration={800} />
                </h2>
                <span className="small-text">Index (03)</span>
              </div>
              
              <div className="uiux-rows">
                {projects.reduce((rows, project, idx) => {
                  const rowIndex = Math.floor(idx / 2);
                  if (!rows[rowIndex]) rows[rowIndex] = [];
                  rows[rowIndex].push(project);
                  return rows;
                }, []).map((row, rIdx) => {
                  const single = row.length === 1;
                  const rowClass = single ? 'uiux-row uiux-row--single' : (rIdx % 2 === 0 ? 'uiux-row uiux-row--left' : 'uiux-row uiux-row--right');
                  return (
                    <div key={`uiux-row-${rIdx}`} className={rowClass}>
                      {row.map((project) => (
                        <motion.div
                          key={project.title}
                          className="uiux-card"
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-10%" }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          onClick={() => setSelectedProject(project)}
                        >
                          <div className="uiux-frame">
                            <img
                              src={project.image}
                              alt={project.title}
                              loading="lazy"
                              decoding="async"
                              onError={(ev) => {
                                const card = ev.currentTarget.closest('.uiux-card');
                                if (card) card.style.display = 'none';
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </section>

            <section id="design" style={{ padding: 'var(--spacing-xxl) var(--spacing-md)', background: UI_DARK, color: UI_LIGHT }}>
              <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)', alignItems: 'baseline', paddingBottom: 'var(--spacing-sm)', borderBottom: HOME_SECTION_DIVIDER }}>
                <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: UI_LIGHT }}>
                  <DecryptText as="span" text="GRAPHIC DESIGN" trigger="inView" duration={800} />
                </h2>
                <span className="small-text">Index (04)</span>
              </div>

              <div className="uiux-rows">
                {graphicDesign.reduce((rows, project, idx) => {
                  const rowIndex = Math.floor(idx / 2);
                  if (!rows[rowIndex]) rows[rowIndex] = [];
                  rows[rowIndex].push(project);
                  return rows;
                }, []).map((row, rIdx) => {
                  const single = row.length === 1;
                  const rowClass = single ? 'uiux-row uiux-row--single' : (rIdx % 2 === 0 ? 'uiux-row uiux-row--left' : 'uiux-row uiux-row--right');
                  return (
                    <div key={`design-row-${rIdx}`} className={rowClass}>
                      {row.map((project) => (
                        <motion.div
                          key={project.title}
                          className="uiux-card"
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-10%" }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          onClick={() => setSelectedProject(project)}
                        >
                          <div className="uiux-frame">
                            <img
                              src={project.image}
                              alt={project.title}
                              loading="lazy"
                              decoding="async"
                              onError={(ev) => {
                                const card = ev.currentTarget.closest('.uiux-card');
                                if (card) card.style.display = 'none';
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </section>

            <section id="resume" style={{ padding: 'var(--spacing-xxl) var(--spacing-md)', background: UI_DARK, color: UI_LIGHT }}>
              <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)', alignItems: 'baseline', paddingBottom: 'var(--spacing-sm)', borderBottom: HOME_SECTION_DIVIDER }}>
                <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: UI_LIGHT }}>
                  <DecryptText as="span" text="RESUME" trigger="inView" duration={800} />
                </h2>
                <span className="small-text">Index (05)</span>
              </div>

              <div className="resume-timeline" role="list">
                {WORK_HISTORY.map((item) => (
                  <div key={`${item.year}-${item.company}-${item.role}`} className="resume-item" role="listitem">
                    <div className="resume-rail" aria-hidden="true">
                      <div className={`resume-dot${item.current ? ' is-current' : ''}`} />
                    </div>
                    <div className="resume-content">
                      <div className="resume-top">
                        <div className="resume-company">{item.company}</div>
                        <div className="resume-year">
                          {item.current ? 'CURRENT' : item.year}
                        </div>
                      </div>
                      <div className="resume-role small-text">
                        {item.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)', alignItems: 'baseline', paddingBottom: 'var(--spacing-sm)', borderBottom: HOME_SECTION_DIVIDER }}>
                  <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: UI_LIGHT }}>
                    <DecryptText as="span" text="TESTIMONIALS" trigger="inView" duration={800} />
                  </h2>
                  <span className="small-text">Index (05.1)</span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: 'var(--spacing-lg)',
                  alignItems: 'start',
                }}>
                  {testimonials.map((testimonial, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        borderTop: HOME_SECTION_DIVIDER,
                        paddingTop: 'var(--spacing-md)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: `1px solid ${UI_LIGHT}`
                          }}>
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          </div>
                          <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 'var(--font-mono-weight)',
                            fontSize: 'var(--fs-sm)',
                            textTransform: 'uppercase'
                          }}>
                            [{testimonial.name}]
                          </div>
                        </div>

                        <div className="small-text" style={{ color: UI_LIGHT }}>
                          {`T${String(i + 1).padStart(2, '0')}`}
                        </div>
                      </div>

                      <div>
                        <h4 style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 'var(--font-mono-weight-bold)',
                          fontSize: 'var(--fs-sm)',
                          textTransform: 'uppercase',
                          marginBottom: 'var(--spacing-sm)',
                          lineHeight: 1,
                          letterSpacing: '0.02em'
                        }}>
                          {testimonial.headline}
                        </h4>
                        <p className="small-text" style={{
                          lineHeight: 1.6,
                          marginBottom: 'var(--spacing-md)',
                          textTransform: 'uppercase',
                          maxWidth: '90%'
                        }}>
                          “{testimonial.text}”
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            <section id="about" style={{ padding: '0', background: UI_DARK, color: UI_LIGHT, minHeight: 'auto', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
              <div className="studio-practice">
                <div className="studio-practice__header">
                  <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', borderBottom: HOME_SECTION_DIVIDER, paddingBottom: 'var(--spacing-sm)' }}>
                    <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>
                      <DecryptText as="span" text="ABOUT" trigger="inView" duration={800} />
                    </h2>
                    <span className="small-text">Index (06)</span>
                  </div>
                </div>

                <div className="studio-practice__grid">
                  <div className="studio-practice__content">
                    <div className="studio-practice__top">
                      <div className="studio-practice__copy">
                        <div className="studio-practice__team-meta" style={{ marginBottom: 'var(--spacing-md)', alignSelf: 'start', justifySelf: 'start', textAlign: 'left' }}>
                          <div className="studio-practice__team-name">Forrest Tindall</div>
                          <div className="studio-practice__team-role">UI/UX Designer / Product Designer</div>
                        </div>
                        <div className="small-text" style={{ maxWidth: '640px', lineHeight: 1.6 }}>
                          I am a UI/UX and product designer who builds. My path into tech started in blue-collar work, an environment that taught me how to solve practical, real-world problems under pressure. Today, I apply that same grounded, no-nonsense work ethic to digital products, translating complex user needs into clean, functional interfaces and production-ready code.
                        </div>
                        <div className="small-text" style={{ maxWidth: '640px', marginTop: 'var(--spacing-md)', lineHeight: 1.6 }}>
                          Based in Boise, Idaho, I operate across the entire product lifecycle, bridging the gap between high-fidelity visual systems and technical implementation.
                        </div>
                        <div className="small-text" style={{ maxWidth: '640px', marginTop: 'var(--spacing-lg)', fontWeight: 'var(--font-mono-weight-bold)' }}>
                          Focus Areas
                        </div>
                        <div className="small-text" style={{ maxWidth: '640px', marginTop: '10px', lineHeight: 1.6 }}>
                          Product &amp; UI/UX Design: Systems thinking, high-fidelity prototyping, and interface design in Figma.
                        </div>
                        <div className="small-text" style={{ maxWidth: '640px', marginTop: '10px', lineHeight: 1.6 }}>
                          Visual System Design: Building brand identity systems and UI/UX design systems that stay consistent across products and touchpoints.
                        </div>
                        <div className="small-text" style={{ maxWidth: '640px', marginTop: '10px', lineHeight: 1.6 }}>
                          Front-End Development: Translating complex layouts into clean, semantic code from scratch.
                        </div>
                        <div className="small-text" style={{ maxWidth: '640px', marginTop: 'var(--spacing-lg)', fontWeight: 'var(--font-mono-weight-bold)' }}>
                          Outside the Screen
                        </div>
                        <div className="small-text" style={{ maxWidth: '640px', marginTop: '10px', lineHeight: 1.6 }}>
                          When I&apos;m not designing or coding, I&apos;m usually behind an analog rangefinder camera. I have a deep interest in street photography and run a local film photography club in Boise.
                        </div>
                      </div>

                      <div className="studio-practice__team">
                        <div className="studio-practice__team-grid">
                          <div className="studio-practice__team-card">
                            <div className="studio-practice__team-image">
                              <img src="/images/newphotome.JPG" alt="Forrest Tindall" loading="lazy" decoding="async" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="studio-practice__passion">
                      <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', borderBottom: HOME_SECTION_DIVIDER, paddingBottom: 'var(--spacing-sm)' }}>
                        <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>
                          <DecryptText as="span" text="PASSION PROJECTS" trigger="inView" duration={800} />
                        </h2>
                    <span className="small-text">Index (06.1)</span>
                      </div>

                      <div className="passion-projects-block">
                        <div className="passion-projects-grid">
                          <div className="passion-projects-item passion-projects-item--full">
                            <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
                              <div className="small-text">PLAYGROUND</div>
                              <motion.button
                                onClick={() => openCaseStudy('playground')}
                                whileHover={{ opacity: 0.7 }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  padding: 0,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 'var(--spacing-sm)',
                                  fontFamily: 'var(--font-mono)',
                                  fontWeight: 'var(--font-mono-weight)',
                                  fontSize: 'var(--fs-sm)',
                                  textTransform: 'uppercase',
                                  color: UI_LIGHT,
                                }}
                              >
                                [VIEW]
                                <ArrowUpRight size={20} weight="thin" aria-hidden="true" focusable="false" />
                              </motion.button>
                            </div>
                            <div className="small-text" style={{ marginTop: 'var(--spacing-sm)', opacity: 0.85 }}>
                              Experiments in design, art, development, and image-making.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
      <SiteFooter
        onContactClick={openContact}
        reserveRightRail={activeCaseStudy === 'bac'}
      />
      <Analytics />
    </div>
  );
}

export default App;
