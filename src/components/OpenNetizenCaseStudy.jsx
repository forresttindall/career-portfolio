import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Broadcast, Code, GlobeHemisphereWest, ShieldCheck, UsersThree, WifiHigh } from '@phosphor-icons/react';
import DecryptText from './DecryptText';

const sections = [
  "0.0 VISUAL SYSTEM NOTES",
  "1.0 BRAND OVERVIEW",
  "2.0 LOGO SYSTEM",
  "3.0 COLOR PALETTE",
  "4.0 TYPOGRAPHY",
  "5.0 GRAPHIC ELEMENTS",
  "6.0 IMAGERY DIRECTION",
  "7.0 LAYOUTS",
  "8.0 APPLICATIONS",
];

const BLUE = "#172EFF";
const WHITE = "#111111";
const BLACK = "#FFFFFF";
const UI_LIGHT = "#111111";
const PAGE_BG = BLACK;
const GRAY1 = "rgba(17, 17, 17, 0.56)";
const GRAY2 = "#C9C9C9";
const BRAND_WHITE = "#FFFFFF";
const BRAND_BLACK = "#111111";
const BRAND_GRAY_MID = "#676767";
const BRAND_GRAY_DARK = "#353535";

function SectionNav({ active, isMobile }) {
  if (isMobile) return null;
  const scrollToSection = (index) => {
    const sectionsElements = document.querySelectorAll('section, [data-section]');
    if (sectionsElements[index + 1]) {
      sectionsElements[index + 1].scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      right: 0,
      width: 260,
      height: "100vh",
      background: PAGE_BG,
      borderLeft: `1px solid ${GRAY2}`,
      padding: "48px 24px",
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
      gap: 0,
    }}>
      <p style={{ fontFamily: "'SF Mono', 'Courier New', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1, marginBottom: 16, textTransform: "uppercase" }}>SECTIONS</p>
      {sections.map((s, i) => (
        <button
          key={i}
          onClick={() => scrollToSection(i)}
          style={{
            background: "none",
            border: "none",
            borderBottom: `1px solid ${GRAY2}`,
            padding: "10px 0",
            textAlign: "left",
            fontFamily: "'SF Mono', 'Courier New', monospace",
            fontSize: 11,
            letterSpacing: 1,
            cursor: "pointer",
            color: active === i ? UI_LIGHT : GRAY1,
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "color 0.2s",
          }}
        >
          {active === i && <span style={{ color: BLUE }}>▶</span>}
          {s}
        </button>
      ))}
    </nav>
  );
}

function PageHeader({ number, title, isMobile }) {
  return (
    <div style={{ marginBottom: "clamp(16px, 3vh, 24px)" }}>
      <h2 style={{
        fontFamily: "var(--font-display)",
        fontWeight: 400, // Match site regular weight
        fontSize: "var(--fs-xl)", // Match site section title size
        letterSpacing: "-0.04em",
        lineHeight: 0.85,
        color: UI_LIGHT,
        margin: 0,
        whiteSpace: isMobile ? "normal" : "nowrap",
        textTransform: 'uppercase'
      }}>
        {number} {title}
      </h2>
      <div style={{ height: 1, background: GRAY2, marginTop: 12 }} />
    </div>
  );
}

function LogoMark({ size = 80, color = WHITE, bg = BLUE }) {
  // Use exact PNG file names as requested by the user
  const logoSrc = 
    color === BRAND_BLACK || color === 'black' || color === '#000000' || color === '#111111' ? '/images/open netizen logo black.png' :
    color === BLUE || color === 'blue' || color === '#172EFF' ? '/images/open netizen logo blue.png' :
    color === BRAND_GRAY_MID || color === 'gray medium' || color === '#676767' ? '/images/open netizen logo gray medium.png' :
    color === BRAND_GRAY_DARK || color === 'gray dark' || color === '#353535' ? '/images/open netizen logo gray dark.png' :
    '/images/open netizen logo white.png';

  return (
    <div style={{
      width: size,
      height: bg === 'transparent' ? 'auto' : size * 1.15,
      background: bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: bg === 'transparent' ? 0 : size * 0.12,
      boxSizing: "border-box",
    }}>
      <img 
        src={logoSrc} 
        alt="Open Netizen Logo" 
        style={{ 
          width: '100%', 
          height: 'auto',
          display: 'block'
        }} 
      />
    </div>
  );
}

function ColorSwatch({ letter, num, hex, cmyk, rgb, bg, textColor }) {
  return (
    <div style={{
      background: bg,
      border: `1px solid ${GRAY2}`,
      padding: "24px 28px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "clamp(100px, 14vh, 180px)",
      position: "relative",
      marginTop: "-1px", // Make blocks touch top-to-bottom
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ 
          fontFamily: "var(--font-display)", 
          fontSize: "var(--fs-xl)", 
          fontWeight: 400, 
          color: textColor, 
          lineHeight: 0.85,
          letterSpacing: "-0.04em",
          textTransform: "uppercase"
        }}>{letter}</span>
        <span style={{ 
          fontFamily: "var(--font-display)", 
          fontSize: "var(--fs-xl)", 
          fontWeight: 400, 
          color: textColor, 
          lineHeight: 0.85,
          letterSpacing: "-0.04em",
          textTransform: "uppercase"
        }}>{num}</span>
      </div>
      
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        gap: "48px", 
        fontFamily: "'SF Mono', monospace", 
        fontSize: "10px", 
        color: textColor,
        opacity: 0.8,
        letterSpacing: "1px"
      }}>
        <span>{cmyk}</span>
        <span>{rgb}</span>
        <span>HEX {hex}</span>
      </div>
    </div>
  );
}

function FontCard({ num, name, label, description }) {
  return (
    <div style={{ borderBottom: `1px solid ${GRAY2}`, paddingBottom: 40, marginBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 12 }}>
        <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1 }}>{num}</span>
        <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, textTransform: "uppercase", letterSpacing: 2 }}>{label}</span>
      </div>
      <h3 style={{
        fontFamily: name === "Bitcount Single" ? "'Bitcount Single', 'Arial Black', sans-serif"
          : name === "SF Mono" ? "'SF Mono', 'Courier New', monospace"
          : "'Geist', 'Helvetica Neue', sans-serif",
        fontWeight: name === "Bitcount Single" ? 900 : 400,
        fontSize: 48,
        color: UI_LIGHT,
        margin: "0 0 16px",
        letterSpacing: name === "Bitcount Single" ? -1 : 0,
      }}>
        {name}
      </h3>
      <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: GRAY1, lineHeight: 1.8, maxWidth: 600 }}>{description}</p>
    </div>
  );
}

const ScrollSection = ({ children, index, setActive, isMobile }) => {
  const containerRef = useRef(null);

  const isInView = useInView(containerRef, { 
    amount: 0.5,
  });

  useEffect(() => {
    if (isInView) {
      setActive(index + 1);
    }
  }, [isInView, index, setActive]);

  return (
    <div ref={containerRef} style={{ 
      position: "relative"
    }}>
      <motion.section
        style={{
          padding: isMobile ? "clamp(24px, 5vh, 48px) 20px" : "clamp(32px, 6vh, 64px) 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          background: PAGE_BG,
          marginBottom: "clamp(28px, 6vh, 72px)",
        }}
      >
        <div style={{ width: "100%", maxWidth: "var(--on-inner-max-w)", margin: "0 auto" }}>
          {children}
        </div>
      </motion.section>
    </div>
  );
};

const OpenNetizenCaseStudy = () => {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const summaryRef = useRef(null);
  const summaryInView = useInView(summaryRef, { amount: 0.5 });

  useEffect(() => {
    const mobileMql = window.matchMedia("(max-width: 900px)");
    const navMql = window.matchMedia("(max-width: 1100px)");

    const onMobileChange = (e) => setIsMobile(e.matches);
    const onNavChange = (e) => setIsNavHidden(e.matches);

    setIsMobile(mobileMql.matches);
    setIsNavHidden(navMql.matches);

    mobileMql.addEventListener("change", onMobileChange);
    navMql.addEventListener("change", onNavChange);
    return () => {
      mobileMql.removeEventListener("change", onMobileChange);
      navMql.removeEventListener("change", onNavChange);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (summaryInView) setActive(0);
  }, [summaryInView]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ 
      background: PAGE_BG,
        overflowX: "hidden",
        fontFamily: "'SF Mono', monospace",
        color: UI_LIGHT,
        position: 'relative'
      }}>
      <SectionNav active={active} isMobile={isMobile || isNavHidden} />

      <div style={{ marginRight: isMobile || isNavHidden ? 0 : 260 }}>
        {/* Hero Section */}
        <section style={{
          position: 'relative',
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          background: BLACK,
          marginBottom: "clamp(28px, 6vh, 72px)",
        }}>
          <div 
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <img 
              src="/images/OPEN NETIZEN CARD.jpg" 
              alt="Open Netizen Background" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: isMobile ? '0 20px' : '0 56px',
            }}
          >
            <div style={{ marginTop: 'auto', marginBottom: '48px' }}>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: BRAND_WHITE, letterSpacing: 2, margin: "0 0 14px", textTransform: "uppercase" }}>
                FREE THE WEB
              </p>
              <h1 className="home-hero__title" style={{ margin: 0, color: BRAND_WHITE }}>
                <div style={{ overflow: 'hidden', paddingBottom: '0.1em' }}>
                  <DecryptText as="span" text="OPEN" trigger="mount" delay={200} duration={900} />
                </div>
                <div style={{ overflow: 'hidden', paddingBottom: '0.1em', marginTop: '-0.2em' }}>
                  <DecryptText as="span" text="NETIZEN" trigger="mount" delay={440} duration={900} />
                </div>
              </h1>
            </div>
          </div>
        </section>

        <section ref={summaryRef} style={{ background: PAGE_BG, display: "flex", alignItems: "flex-start", marginBottom: "clamp(28px, 6vh, 72px)" }}>
          <div style={{ padding: isMobile ? "clamp(24px, 5vh, 48px) 20px" : "clamp(32px, 6vh, 64px) 56px", width: "100%" }}>
            <div style={{ width: "100%", maxWidth: "var(--on-inner-max-w)", margin: "0 auto" }}>
              <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: "flex-start", gap: "clamp(16px, 2.5vw, 32px)", marginBottom: "clamp(16px, 2.5vh, 24px)" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, margin: "0 0 12px", textTransform: "uppercase" }}>CASE STUDY SUMMARY</p>
                  <h2 style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 400,
                    fontSize: "var(--fs-xl)",
                    letterSpacing: "-0.04em",
                    lineHeight: 0.85,
                    color: UI_LIGHT,
                    margin: 0,
                    whiteSpace: isMobile ? "normal" : "nowrap",
                    textTransform: "uppercase"
                  }}>
                    0.0 VISUAL SYSTEM NOTES
                  </h2>
                  <div style={{ height: 1, background: GRAY2, marginTop: 12 }} />
                </div>
                <div style={{ width: isMobile ? "100%" : "clamp(84px, 10vw, 140px)", maxWidth: isMobile ? 220 : undefined, aspectRatio: "1/1", border: `1px solid ${GRAY2}`, overflow: "hidden", background: BLACK, flex: "0 0 auto" }}>
                  <img
                    src="/images/OPEN NETIZEN.jpg"
                    alt="Open Netizen preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: GRAY2 }}>
                <div style={{ background: PAGE_BG, padding: "clamp(16px, 2.5vw, 24px)" }}>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1, margin: "0 0 10px", textTransform: "uppercase" }}>What Is The Problem?</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: UI_LIGHT, lineHeight: 1.8, margin: 0 }}>
                    A civic non-profit needed a modern identity that signals the open web without reading as a startup, government agency, or corporate platform.
                  </p>
                </div>
                <div style={{ background: PAGE_BG, padding: "clamp(16px, 2.5vw, 24px)" }}>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1, margin: "0 0 10px", textTransform: "uppercase" }}>What Constraints?</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: UI_LIGHT, lineHeight: 1.8, margin: 0 }}>
                    High contrast accessibility, fast legibility at distance, and a system that works across print, signage, and UI with minimal production complexity.
                  </p>
                </div>
                <div style={{ background: PAGE_BG, padding: "clamp(16px, 2.5vw, 24px)" }}>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1, margin: "0 0 10px", textTransform: "uppercase" }}>Decisions & Why</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: UI_LIGHT, lineHeight: 1.8, margin: 0 }}>
                    Swiss grid discipline, a single electric blue anchor, and a modular mark/typemark system to keep the brand objective, repeatable, and scalable.
                  </p>
                </div>
                <div style={{ background: PAGE_BG, padding: "clamp(16px, 2.5vw, 24px)" }}>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1, margin: "0 0 10px", textTransform: "uppercase" }}>Outcome</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: UI_LIGHT, lineHeight: 1.8, margin: 0 }}>
                    A technical, civic-forward visual system that stays consistent across screens and environments while leaving space for future campaigns and programs.
                  </p>
                </div>
              </div>

              <div style={{ marginTop: "clamp(12px, 2vh, 20px)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, margin: 0, textTransform: "uppercase" }}>0.1 ROLE / SCOPE / DELIVERABLES</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, color: GRAY1, letterSpacing: 2, margin: 0, textTransform: "uppercase" }}>[ HANDOFF READY ]</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 1, background: GRAY2 }}>
                  <div style={{ background: PAGE_BG, padding: 14 }}>
                    <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1, margin: "0 0 8px", textTransform: "uppercase" }}>Role</p>
                    <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: UI_LIGHT, lineHeight: 1.6, margin: 0 }}>Visual identity + system design.</p>
                  </div>
                  <div style={{ background: PAGE_BG, padding: 14 }}>
                    <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1, margin: "0 0 8px", textTransform: "uppercase" }}>Scope</p>
                    <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: UI_LIGHT, lineHeight: 1.6, margin: 0 }}>Logo, type, color, layout rules, icon + illustration direction, imagery direction.</p>
                  </div>
                  <div style={{ background: PAGE_BG, padding: 14 }}>
                    <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1, margin: "0 0 8px", textTransform: "uppercase" }}>Deliverables</p>
                    <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: UI_LIGHT, lineHeight: 1.6, margin: 0 }}>Logo suite, usage rules, palette specs, layout modules, application templates.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Continuous Scroll Sections */}
        <main>
          {/* 1.0 BRAND OVERVIEW */}
          <ScrollSection index={0} setActive={setActive} isMobile={isMobile}>
            <PageHeader number="1.0" title="BRAND OVERVIEW" isMobile={isMobile} />
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 48 }}>
              <div>
                <div style={{
                  background: BLUE,
                  padding: isMobile ? 24 : 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  aspectRatio: '1/1',
                  width: '100%',
                }}>
                  <LogoMark size="var(--on-brand-logo-size)" color={BRAND_WHITE} bg="transparent" />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <div>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: 12 }}>ABOUT</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 13, color: UI_LIGHT, lineHeight: 1.8 }}>
                    OPEN NETIZEN is a 501(c)(3) non-profit organization established in 2023 to promote the free web, decentralized web and open source web.
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: 12 }}>1.1 MISSION</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 13, color: UI_LIGHT, lineHeight: 1.8 }}>
                    Open Netizen exists to protect the web as a public commons. Open to everyone, owned by no one, built to last beyond any single company&apos;s interests.
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: 12 }}>1.2 POSITIONING</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 13, color: UI_LIGHT, lineHeight: 1.8 }}>
                    Open Netizen is the civic voice of the open web. Not a tech startup. Not a government agency. A community organization that holds the web&apos;s future accountable to the public.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: isMobile ? 24 : 48 }}>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: 24 }}>1.3 BRAND PERSONALITY</p>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 1, background: GRAY2 }}>
                {[
                  { n: "1", label: "PRINCIPLED", subs: ["Firm Convictions", "Grounded in Values", "Justice for All"] },
                  { n: "2", label: "ACCESSIBLE", subs: ["Open Means Everyone", "Easy to Understand", "Welcoming of All"] },
                  { n: "3", label: "OPTIMISTIC", subs: ["Firm Convictions", "Grounded in Values", "Justice for All"] },
                  { n: "4", label: "INDEPENDENT", subs: ["Firm Convictions", "Grounded in Values", "Justice for All"] },
                ].map((p) => (
                  <div key={p.n} style={{ background: PAGE_BG, padding: isMobile ? "18px 14px" : "24px 20px" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
                      <span style={{ fontFamily: "'Bitcount Single', 'Arial Black', sans-serif", fontSize: 28, fontWeight: 900, color: BLUE }}>{p.n}</span>
                      <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: UI_LIGHT, letterSpacing: 1 }}>{p.label}</span>
                    </div>
                    {p.subs.map((s, i) => (
                      <p key={i} style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, color: GRAY1, margin: "4px 0" }}>{s}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </ScrollSection>

          {/* 2.0 LOGO SYSTEM */}
          <ScrollSection index={1} setActive={setActive} isMobile={isMobile}>
            <PageHeader number="2.0" title="LOGO SYSTEM" isMobile={isMobile} />

            <div style={{ marginBottom: "clamp(12px, 2vh, 20px)", maxWidth: 820 }}>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 13, color: UI_LIGHT, lineHeight: 1.8, margin: 0 }}>
                The logo bridges technical systems and human form—precise geometry softened into a civic mark that feels both infrastructural and personal.
              </p>
            </div>
            
            {/* 2.1 LOGOMARK GRID */}
            <div style={{ marginBottom: "clamp(12px, 2vh, 24px)" }}>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: "clamp(6px, 1vh, 12px)" }}>2.1 LOGOMARK</p>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(3, 1fr)", 
                gap: 1, 
                background: GRAY2,
                width: "100%" 
              }}>
                {[
                  { bg: BLUE, color: BRAND_WHITE },
                  { bg: BRAND_WHITE, color: BLUE },
                  { bg: BRAND_GRAY_MID, color: BRAND_WHITE },
                ].map((v, i) => (
                  <div key={i} style={{
                    background: v.bg,
                    aspectRatio: "var(--on-logomark-ar)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: isMobile ? 10 : "var(--on-logomark-pad)",
                  }}>
                    <LogoMark size={isMobile ? "min(52px, 15vw)" : "var(--on-logo-size)"} color={v.color} bg="transparent" />
                  </div>
                ))}
              </div>
            </div>

            {/* 2.2 TYPEMARK BARS */}
            <div>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: "clamp(6px, 1vh, 12px)" }}>2.2 TYPEMARK</p>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  { bg: BLUE, color: BRAND_WHITE },
                  { bg: BRAND_WHITE, color: BLUE },
                  { bg: BRAND_GRAY_MID, color: BRAND_WHITE },
                ].map((v, i) => (
                  <div key={i} style={{
                    background: v.bg,
                    border: `1px solid ${GRAY2}`,
                    padding: "0 var(--on-typemark-pad-x)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: "var(--on-typemark-h)",
                    marginTop: "-1px",
                  }}>
                    <span style={{ 
                      fontFamily: "var(--font-display)", 
                      fontSize: "var(--fs-xl)", 
                      fontWeight: 400, 
                      color: v.color, 
                      lineHeight: 0.85,
                      letterSpacing: "-0.04em",
                      textTransform: "uppercase"
                    }}>{i + 1}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                      <span style={{
                        fontFamily: "'Bitcount Single', 'Arial Black', sans-serif",
                        fontWeight: 900,
                        fontSize: "clamp(20px, 3.8vw, 44px)",
                        color: v.color,
                        letterSpacing: -1,
                        lineHeight: 1,
                        textTransform: "uppercase"
                      }}>OPEN NETIZEN</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: "clamp(16px, 2.5vh, 28px)" }}>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: "clamp(6px, 1vh, 12px)" }}>2.3 USAGE RULES</p>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 1, background: GRAY2 }}>
                <div style={{ background: PAGE_BG, padding: "clamp(14px, 2vh, 18px)" }}>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1, margin: "0 0 10px", textTransform: "uppercase" }}>Clearspace</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: UI_LIGHT, lineHeight: 1.7, margin: 0 }}>
                    Maintain minimum clearspace equal to the mark&apos;s inner aperture. Never let type or edges crowd the icon.
                  </p>
                </div>
                <div style={{ background: PAGE_BG, padding: "clamp(14px, 2vh, 18px)" }}>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1, margin: "0 0 10px", textTransform: "uppercase" }}>Minimum Size</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: UI_LIGHT, lineHeight: 1.7, margin: 0 }}>
                    Digital: 24px height. Print: 6mm height. Below minimum, use the typemark only.
                  </p>
                </div>
                <div style={{ background: PAGE_BG, padding: "clamp(14px, 2vh, 18px)" }}>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1, margin: "0 0 10px", textTransform: "uppercase" }}>Files</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: UI_LIGHT, lineHeight: 1.7, margin: 0 }}>
                    Use vector for print/signage. Use PNG for UI when transparency is needed. Keep colors locked to the palette.
                  </p>
                </div>
              </div>
            </div>
          </ScrollSection>

          {/* 3.0 COLOR PALETTE */}
          <ScrollSection index={2} setActive={setActive} isMobile={isMobile}>
            <PageHeader number="3.0" title="COLOR PALETTE" isMobile={isMobile} />
            <div style={{ marginBottom: "clamp(12px, 2vh, 20px)", maxWidth: 820 }}>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 13, color: UI_LIGHT, lineHeight: 1.8, margin: 0 }}>
                The palette pairs an electric blue signal with neutral whites and grays—bold meets calm, blending technical clarity with human warmth.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <ColorSwatch
                letter="A" num="01" label="Primary"
                hex="172EFF"
                cmyk="CMYK C85 M74 Y0 K0"
                rgb="RGB R23 G46 B255"
                bg={BLUE} textColor={BRAND_WHITE}
              />
              <ColorSwatch
                letter="B" num="02" label="Secondary"
                hex="FFFFFF"
                cmyk="CMYK C0 M0 Y0 K0"
                rgb="RGB R255 G255 B255"
                bg={BRAND_WHITE} textColor={BRAND_BLACK}
              />
              <ColorSwatch
                letter="C" num="03" label="Gray Mid"
                hex="676767"
                cmyk="CMYK C58 M58 Y51 K20"
                rgb="RGB R103 G103 B103"
                bg={BRAND_GRAY_MID} textColor={BRAND_WHITE}
              />
              <ColorSwatch
                letter="D" num="04" label="Gray Dark"
                hex="353535"
                cmyk="CMYK C67 M63 Y62 K57"
                rgb="RGB R53 G53 B53"
                bg={BRAND_GRAY_DARK} textColor={BRAND_WHITE}
              />
              <ColorSwatch
                letter="E" num="05" label="Black"
                hex="000000"
                cmyk="CMYK C72 M68 Y67 K88"
                rgb="RGB R0 G0 B0"
                bg={BRAND_BLACK} textColor={BRAND_WHITE}
              />
            </div>
          </ScrollSection>

          {/* 4.0 TYPOGRAPHY */}
          <ScrollSection index={3} setActive={setActive} isMobile={isMobile}>
            <PageHeader number="4.0" title="TYPOGRAPHY" isMobile={isMobile} />
            <FontCard
              num="1" name="Bitcount Single" label="Primary Font"
              description="A contemporary grotesque typeface that blends mechanical precision with expressive character. Its slightly unconventional proportions and technical tone give it a strong, modern presence for bold headlines and brand moments."
            />
            <FontCard
              num="2" name="SF Mono" label="Secondary Font"
              description="A monospaced typeface designed for clarity and consistency in technical environments. Each character occupies the same width, creating an organized and structured rhythm ideal for data, labeling, and system-oriented information."
            />
            <FontCard
              num="3" name="Geist Sans" label="Tertiary Font"
              description="A modern sans-serif designed with simplicity and performance in mind. Clean structure and balanced proportions allow it to work comfortably across both digital interfaces and printed materials."
            />
          </ScrollSection>

          {/* 5.0 GRAPHIC ELEMENTS */}
          <ScrollSection index={4} setActive={setActive} isMobile={isMobile}>
            <PageHeader number="5.0" title="GRAPHIC ELEMENTS" isMobile={isMobile} />
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 1, background: GRAY2 }}>
              <div style={{ background: PAGE_BG, padding: isMobile ? 16 : 40 }}>
                <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: 24 }}>{isMobile ? "5.1 — PHOSPHOR REACT ICONS" : "1 — PHOSPHOR REACT ICONS"}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: GRAY2 }}>
                  {[
                    { Icon: GlobeHemisphereWest, label: "GLOBE" },
                    { Icon: WifiHigh, label: "WIFI" },
                    { Icon: Broadcast, label: "BROADCAST" },
                    { Icon: UsersThree, label: "PEOPLE" },
                    { Icon: ShieldCheck, label: "SECURITY" },
                    { Icon: Code, label: "CODE" },
                  ].map(({ Icon, label }) => (
                    <div key={label} style={{ background: PAGE_BG, padding: isMobile ? "14px 12px" : "18px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                      <Icon size={isMobile ? 30 : 34} color={BLUE} weight="regular" />
                      <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1 }}>{label}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: GRAY1, lineHeight: 1.8, marginTop: 24 }}>
                  Phosphor is a flexible icon family for interfaces, diagrams, and presentations. Consistent stroke weight and clear metaphors align with the brand&apos;s technical clarity.
                </p>
              </div>
              <div style={{ background: PAGE_BG, padding: isMobile ? 16 : 40 }}>
                <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: 24 }}>{isMobile ? "5.2 — ISOMETRIC ILLUSTRATION" : "2 — ISOMETRIC ILLUSTRATION"}</p>
                <div style={{ border: `1px solid ${GRAY2}`, overflow: "hidden", background: PAGE_BG }}>
                  <img
                    src="/images/isometric-city-blue.svg"
                    alt="Isometric city illustration"
                    style={{ width: "100%", height: isMobile ? 160 : 200, objectFit: "cover", display: "block" }}
                  />
                </div>
                <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: GRAY1, lineHeight: 1.8, marginTop: 24 }}>
                  Isometric illustration brings technical concepts to life with geometric precision. Used for conceptual diagrams representing network infrastructure, data flows, and open systems.
                </p>
              </div>
            </div>
          </ScrollSection>

          {/* Placeholder Sections */}
          <ScrollSection index={5} setActive={setActive} isMobile={isMobile}>
            <PageHeader number="6.0" title="IMAGERY DIRECTION" isMobile={isMobile} />
            <div style={{ marginBottom: 16, maxWidth: 820 }}>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: 12 }}>DIRECTION</p>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 13, color: UI_LIGHT, lineHeight: 1.8 }}>
                Imagery should balance cybercore infrastructure with humanist presence. Use high-contrast, low-light environments, screen glow, and hard edges—then anchor it with candid, real people and tactile moments. The result feels technical, civic, and alive.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: 1, background: GRAY2 }}>
              {[
                { src: "/images/open netizen background.jpg", label: "00" },
                { src: "/images/photo1.jpg", label: "01" },
                { src: "/images/photo2.jpg", label: "02" },
                { src: "/images/photo3.jpg", label: "03" },
                { src: "/images/photo4.jpg", label: "04" },
                { src: "/images/photo5.jpg", label: "05" },
              ].map((img) => (
                <div key={img.src} style={{ background: PAGE_BG, position: "relative", overflow: "hidden", aspectRatio: "1 / 1" }}>
                  <img src={img.src} alt={`Open Netizen imagery ${img.label}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ))}
            </div>
          </ScrollSection>
          <ScrollSection index={6} setActive={setActive} isMobile={isMobile}>
            <PageHeader number="7.0" title="LAYOUTS" isMobile={isMobile} />
            
            <div style={{ marginBottom: 24, maxWidth: "800px" }}>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: 12 }}>DESIGN DIRECTION</p>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 13, color: UI_LIGHT, lineHeight: 1.8 }}>
                Open Netizen follows the International Typographic Style: strict Swiss grids, asymmetric white space, and objective typography. Layouts prioritize repeatable modules and clear hierarchy so technical information stays legible across screens.
              </p>
            </div>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", 
              gap: "clamp(16px, 2.5vw, 32px)", 
              gridAutoRows: isMobile ? "auto" : "var(--on-layout-row-h)",
              width: "100%",
            }}>
              {/* Example 1: Technical Dashboard UI */}
              <div style={{ 
                background: BLACK, 
                padding: isMobile ? 16 : "clamp(16px, 2vh, 24px)", 
                border: `1px solid ${GRAY2}`, 
                color: WHITE,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                height: isMobile ? "auto" : "100%",
                aspectRatio: isMobile ? "4/3" : undefined,
                overflow: "hidden"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${GRAY2}`, paddingBottom: 12, marginBottom: "clamp(12px, 2vh, 24px)" }}>
                  <span style={{ fontFamily: "'SF Mono', monospace", fontSize: "clamp(8px, 1vh, 10px)", letterSpacing: 1 }}>NETWORK_NODE_V.01</span>
                  <span style={{ fontFamily: "'SF Mono', monospace", fontSize: "clamp(8px, 1vh, 10px)", color: BLUE }}>STATUS: ACTIVE</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(8px, 1.5vh, 16px)" }}>
                  <div style={{ border: `1px solid ${GRAY2}`, padding: "clamp(8px, 1.5vh, 16px)" }}>
                    <p style={{ fontFamily: "'SF Mono', monospace", fontSize: "clamp(7px, 1vh, 9px)", color: GRAY1, marginBottom: 4 }}>LATENCY</p>
                    <p style={{ fontFamily: "'Bitcount Single', sans-serif", fontSize: "clamp(16px, 2.5vh, 24px)", fontWeight: 900 }}>24ms</p>
                  </div>
                  <div style={{ border: `1px solid ${GRAY2}`, padding: "clamp(8px, 1.5vh, 16px)" }}>
                    <p style={{ fontFamily: "'SF Mono', monospace", fontSize: "clamp(7px, 1vh, 9px)", color: GRAY1, marginBottom: 4 }}>UPTIME</p>
                    <p style={{ fontFamily: "'Bitcount Single', sans-serif", fontSize: "clamp(16px, 2.5vh, 24px)", fontWeight: 900 }}>99.9%</p>
                  </div>
                </div>
                <div style={{ marginTop: "auto", height: isMobile ? 40 : "clamp(40px, 6vh, 60px)", background: `linear-gradient(90deg, ${BLUE} 0%, transparent 100%)`, opacity: 0.2 }} />
                <p style={{ fontFamily: "'SF Mono', monospace", fontSize: "clamp(8px, 1vh, 10px)", marginTop: 8, color: GRAY1 }}>0x172EFF...A4B2</p>
              </div>

              {/* Example 2: Swiss Editorial Layout */}
              <div style={{ 
                background: PAGE_BG, 
                padding: "clamp(16px, 2vh, 24px)", 
                border: `1px solid ${GRAY2}`, 
                color: UI_LIGHT, 
                position: "relative", 
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                height: isMobile ? "auto" : "100%",
                aspectRatio: isMobile ? "4/3" : undefined
              }}>
                <div style={{ display: "flex", gap: "clamp(12px, 2vw, 24px)", flex: 1 }}>
                  <div style={{ width: "45%" }}>
                    <h4 style={{ fontFamily: "'Bitcount Single', sans-serif", fontSize: "clamp(20px, 3vh, 32px)", fontWeight: 900, lineHeight: 0.9, marginBottom: 12 }}>THE OPEN WEB</h4>
                    <p style={{ fontFamily: "'SF Mono', monospace", fontSize: "clamp(8px, 1vh, 10px)", lineHeight: 1.5 }}>Built on the principles of transparency and decentralization.</p>
                  </div>
                  <div style={{ flex: 1, background: BLUE, position: "relative", marginBottom: "clamp(24px, 4vh, 40px)" }}>
                    <div style={{ position: "absolute", bottom: 8, right: 8 }}>
                      <LogoMark size={isMobile ? 40 : "clamp(24px, 3vh, 32px)"} color={BRAND_WHITE} bg="transparent" />
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <span style={{ fontFamily: "'SF Mono', monospace", fontSize: "clamp(32px, 5vh, 48px)", fontWeight: 900, color: "#EEE", position: "absolute", bottom: -8, left: 8 }}>01</span>
                  <div style={{ width: "50%", marginLeft: "auto" }}>
                    <div style={{ height: 1, background: UI_LIGHT, marginBottom: 6 }} />
                    <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 8, letterSpacing: 1 }}>PAGE REF. 42-A</p>
                  </div>
                </div>
              </div>

              {/* Example 3: Mobile UI / App Mockup */}
              <div style={{ 
                background: BLUE, 
                padding: isMobile ? "24px 20px" : "clamp(24px, 4vh, 48px) clamp(16px, 3vw, 32px)", 
                border: `1px solid ${GRAY2}`, 
                color: BRAND_WHITE, 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "space-between",
                minHeight: 0,
                height: isMobile ? "auto" : "100%",
                aspectRatio: isMobile ? "4/3" : undefined,
                overflow: "hidden"
              }}>
                <div>
                  <LogoMark size="clamp(32px, 5vh, 48px)" color={BRAND_WHITE} bg="transparent" />
                  <h4 style={{ fontFamily: "'Bitcount Single', sans-serif", fontSize: isMobile ? "clamp(24px, 9vw, 36px)" : "clamp(24px, 4vh, 40px)", fontWeight: 900, lineHeight: 0.85, marginTop: isMobile ? 12 : "clamp(12px, 2vh, 24px)" }}>CONNECT<br/>TO THE<br/>NETIZEN.</h4>
                </div>
                <div style={{ border: `1px solid ${BRAND_WHITE}`, padding: "clamp(8px, 1.5vh, 12px) clamp(16px, 2vw, 24px)", alignSelf: "flex-start", marginTop: 12 }}>
                  <span style={{ fontFamily: "'SF Mono', monospace", fontSize: "clamp(8px, 1vh, 10px)", letterSpacing: 2 }}>[ INITIALIZE ]</span>
                </div>
              </div>

              {/* Example 4: Typography Grid */}
              <div style={{ 
                background: BLACK, 
                border: `1px solid ${GRAY2}`, 
                padding: isMobile ? 16 : "clamp(16px, 2vh, 24px)", 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "space-between",
                minHeight: 0,
                height: isMobile ? "auto" : "100%",
                aspectRatio: isMobile ? "4/3" : undefined,
                overflow: "hidden"
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1 }}>
                  {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} style={{ border: `1px solid ${GRAY2}`, aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bitcount Single', sans-serif", fontSize: "clamp(8px, 1vh, 12px)", color: GRAY1 }}>
                      {i < 10 ? `0${i}` : i}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "auto", paddingTop: 12 }}>
                  <p style={{ fontFamily: "'Bitcount Single', sans-serif", fontSize: "clamp(14px, 2vh, 18px)", fontWeight: 900, color: BLUE }}>TYPE SYSTEM GRID V.02</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: "clamp(8px, 1vh, 10px)", color: GRAY1 }}>STRUCTURAL ALIGNMENT</p>
                </div>
              </div>
            </div>
          </ScrollSection>
          <ScrollSection index={7} setActive={setActive} isMobile={isMobile}>
            <PageHeader number="8.0" title="APPLICATIONS" isMobile={isMobile} />
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(16px, 2.5vw, 32px)" }}>
              <div style={{ maxWidth: 820 }}>
                <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, margin: "0 0 12px" }}>SIGNAGE & ADVERTISING</p>
                <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 13, color: UI_LIGHT, lineHeight: 1.8, margin: 0 }}>
                  Applications should feel like modern civic signage: blunt hierarchy, strict grid alignment, and high-contrast color pairing. Use the logomark as a repeatable stamp and let the typemark carry scale—cropped, oversized, and always locked to a consistent baseline.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "clamp(16px, 2.5vw, 32px)", minHeight: isMobile ? "auto" : "clamp(320px, 44vh, 480px)", alignItems: "start" }}>
                <div style={{ background: PAGE_BG, border: `1px solid ${GRAY2}`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", background: BLACK, overflow: "hidden" }}>
                    <img
                      src="/images/sign mockup open netizen.png"
                      alt="Open Netizen signage mockup"
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
                    />
                  </div>
                  <div style={{ borderTop: `1px solid ${GRAY2}`, padding: "var(--case-study-app-label-pad)", display: "flex", justifyContent: "space-between", alignItems: "baseline", background: PAGE_BG }}>
                    <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 1, color: UI_LIGHT }}>01</span>
                    <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 1, color: GRAY1 }}>AD APPLICATION</span>
                  </div>
                </div>

                <div style={{ background: PAGE_BG, border: `1px solid ${GRAY2}`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", background: BLACK, overflow: "hidden" }}>
                    <img
                      src="/images/OPEN NETIZEN.jpg"
                      alt="Open Netizen advertising application"
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
                    />
                  </div>
                  <div style={{ borderTop: `1px solid ${GRAY2}`, padding: "var(--case-study-app-label-pad)", display: "flex", justifyContent: "space-between", alignItems: "baseline", background: PAGE_BG }}>
                    <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 1, color: UI_LIGHT }}>02</span>
                    <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 1, color: GRAY1 }}>AD APPLICATION</span>
                  </div>
                </div>

                <div style={{ background: PAGE_BG, border: `1px solid ${GRAY2}`, overflow: "hidden", display: "flex", flexDirection: "column", gridColumn: isMobile ? undefined : "1 / -1" }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", background: BLACK, overflow: "hidden" }}>
                    <img
                      src="/images/OPEN NETIZEN WEBSITE MOCKUP.jpg"
                      alt="Open Netizen website mockup"
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
                    />
                  </div>
                  <div style={{ borderTop: `1px solid ${GRAY2}`, padding: "var(--case-study-app-label-pad)", display: "flex", justifyContent: "space-between", alignItems: "baseline", background: PAGE_BG }}>
                    <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 1, color: UI_LIGHT }}>03</span>
                    <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 1, color: GRAY1 }}>WEBSITE</span>
                  </div>
                </div>

                <div style={{ background: PAGE_BG, border: `1px solid ${GRAY2}`, overflow: "hidden", display: "flex", flexDirection: "column", gridColumn: isMobile ? undefined : "1 / -1" }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "7 / 4", background: BLACK, overflow: "hidden" }}>
                    <img
                      src="/images/OPEN NETIZEN CARD.jpg"
                      alt="Open Netizen business card"
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
                    />
                  </div>
                  <div style={{ borderTop: `1px solid ${GRAY2}`, padding: "var(--case-study-app-label-pad)", display: "flex", justifyContent: "space-between", alignItems: "baseline", background: PAGE_BG }}>
                    <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 1, color: UI_LIGHT }}>04</span>
                    <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 1, color: GRAY1 }}>BUSINESS CARD</span>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: "'PP Neue Machina', 'Neue Machina', sans-serif", fontWeight: 400, fontSize: "clamp(32px, 4vw, 56px)", letterSpacing: "-0.04em", color: UI_LIGHT, lineHeight: 0.9 }}>
                    OPEN NETIZEN
                  </span>
                  <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1 }}>
                    GRID / 12 COL
                  </span>
                </div>
              </div>
            </div>
          </ScrollSection>
        </main>
      </div>

      <style>{`
        :root {
          --on-inner-max-w: 1200px;
          --on-logo-size: clamp(50px, 7vh, 120px);
          --on-brand-logo-size: 120px;
          --on-layout-row-h: clamp(260px, 24vh, 340px);
          --on-image-tile-ar: 1 / 1;
          --on-logomark-ar: 1 / 1;
          --on-logomark-pad: clamp(16px, 3vh, 32px);
          --on-typemark-h: clamp(60px, 9vh, 120px);
          --on-typemark-pad-x: 28px;
        }

        @media (max-width: 1680px), (max-height: 980px) {
          :root {
            --on-inner-max-w: 1060px;
          }
        }

        @media (max-width: 1536px), (max-height: 920px) {
          :root {
            --on-inner-max-w: 980px;
          }
        }

        @media (max-width: 1440px), (max-height: 900px) {
          :root {
            --on-inner-max-w: 880px;
            --on-layout-row-h: clamp(300px, 34vh, 460px);
          }
        }

        @media (max-width: 1280px), (max-height: 820px) {
          :root {
            --on-inner-max-w: 780px;
            --on-layout-row-h: clamp(280px, 32vh, 420px);
          }
        }

        /* Large Screen / iMac Optimizations only apply to wide, tall viewports */
        @media (min-width: 1800px) and (min-height: 900px) {
          :root {
            --on-layout-row-h: clamp(360px, 30vh, 460px);
            --on-logo-size: clamp(80px, 12vh, 180px);
            --on-brand-logo-size: 140px;
            --on-logomark-ar: 6 / 5;
            --on-logomark-pad: clamp(10px, 1.6vh, 18px);
            --on-typemark-h: clamp(52px, 6.5vh, 96px);
            --on-typemark-pad-x: 20px;
          }
        }


        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }
        button:hover { color: white !important; }
      `}</style>
    </motion.div>
  );
};

export default OpenNetizenCaseStudy;
