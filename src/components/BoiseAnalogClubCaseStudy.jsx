import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const sections = [
  "0.0 VISUAL SYSTEM NOTES",
  "1.0 BRAND OVERVIEW",
  "2.0 LOGO SYSTEM",
  "3.0 COLOR PALETTE",
  "4.0 TYPOGRAPHY",
  "5.0 GRAPHIC ELEMENTS",
  "6.0 PHOTOGRAPHY DIRECTION",
  "7.0 LAYOUTS",
  "8.0 APPLICATIONS",
];

const RED = "#ED1C23";
const WHITE = "#111111";
const BLACK = "#FFFFFF";
const UI_LIGHT = "#111111";
const PAGE_BG = BLACK;
const GRAY1 = "rgba(17, 17, 17, 0.56)";
const GRAY2 = "#C9C9C9";
const BRAND_WHITE = "#FFFFFF";
const BRAND_BLACK = "#111111";
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
          {active === i && <span style={{ color: RED }}>▶</span>}
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
        fontWeight: 400,
        fontSize: "var(--fs-xl)",
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

function ColorSwatch({ letter, num, hex, cmyk, rgb, bg, textColor }) {
  return (
    <div style={{
      background: bg,
      border: `1px solid ${GRAY2}`,
      marginTop: "-1px",
      padding: "24px 28px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "clamp(100px, 14vh, 180px)",
      position: "relative",
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

function FontCard({ num, name, label, description, isMobile }) {
  const normalizedName = String(name).toLowerCase();
  const fontFamily =
    normalizedName === "bucklane script" ? "'Bucklane Script', 'Caveat', 'Helvetica Neue', Arial, sans-serif"
    : normalizedName === "impact" ? "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif"
    : normalizedName === "geist" ? "'Geist', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
    : normalizedName === "caveat" ? "'Caveat', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
    : "'SF Mono', monospace";

  return (
    <div style={{
      border: `1px solid ${GRAY2}`,
      padding: isMobile ? "16px" : "24px 24px",
      display: "grid",
      gridTemplateColumns: isMobile ? "minmax(120px, 160px) minmax(0, 1fr)" : "minmax(220px, 1fr) minmax(0, 520px)",
      gap: isMobile ? 14 : 24,
      marginTop: "-1px",
    }}>
      <div>
        <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1, marginBottom: 10, textTransform: "uppercase" }}>
          {num} — {label}
        </p>
        <p style={{
          fontFamily,
          fontSize: isMobile ? 18 : 24,
          fontWeight: normalizedName === "impact" ? 400 : 900,
          margin: 0,
          color: UI_LIGHT,
          whiteSpace: isMobile ? "normal" : "nowrap",
          textTransform: normalizedName === "geist" ? "uppercase" : "none",
        }}>
          {name}
        </p>
      </div>
      <div>
        <p style={{ fontFamily: "'SF Mono', monospace", fontSize: isMobile ? 12 : 12, color: UI_LIGHT, lineHeight: 1.8, margin: 0 }}>
          {description}
        </p>
      </div>
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
        <div style={{ width: "100%", maxWidth: "var(--bac-inner-max-w)", margin: "0 auto" }}>
          {children}
        </div>
      </motion.section>
    </div>
  );
};

const BoiseAnalogClubCaseStudy = () => {
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
        <section style={{
          position: 'relative',
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          background: BLACK,
          marginBottom: "clamp(28px, 6vh, 72px)",
        }}>
          <div style={{ width: '100%', height: '100%' }}>
            <img
              src="/images/analogmockup 2.png"
              alt="Boise Analog Club Background"
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
                KEEP FILM ALIVE
              </p>
              <h1 style={{
                fontFamily: "'Bucklane Script', 'Bitcount Single', 'Arial Black', sans-serif",
                fontWeight: 400,
                fontSize: "clamp(48px, 6vw, 96px)",
                color: BRAND_WHITE,
                letterSpacing: "-0.04em",
                lineHeight: 0.85,
                margin: 0,
                textTransform: 'none',
                whiteSpace: isMobile ? 'normal' : 'nowrap'
              }}>
                Boise Analog Club
              </h1>
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '48px', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: BRAND_WHITE, lineHeight: 1.8, marginTop: 14, maxWidth: 720 }}>
                    Visual identity and flyer system for a community film photography club—built for repeatable event promotion and print consistency.
                  </p>

                  <div style={{ marginTop: '24px' }}>
                    <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: BRAND_WHITE, opacity: 0.6, letterSpacing: 2, margin: "0 0 12px", textTransform: "uppercase" }}>STRATEGY & DESIGN</p>
                    <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: BRAND_WHITE, opacity: 0.8, lineHeight: 1.6, maxWidth: 640 }}>
                      The Boise Analog Club (BAC) required an identity that felt as tactile and authentic as the medium it celebrates. Our approach focused on 'The Digital-Analog Bridge'—creating a flexible visual system that works seamlessly across social media promotions and physical street-flyers.
                      <br /><br />
                      We developed a typographic-heavy system that pays homage to darkroom aesthetics while maintaining a modern, high-contrast edge. This system was designed specifically for the Boise community, utilizing a local street-photography aesthetic that resonates with Treasure Valley creators.
                      <br /><br />
                      The resulting identity has become a staple of the local creative scene, providing the club with a consistent, recognizable voice that scales from microscopic Instagram thumbnails to large-format wheatpaste posters across Downtown Boise.
                    </div>
                  </div>
                </div>

                <div style={{ flex: '0 0 auto', minWidth: isMobile ? '100%' : '240px' }}>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: BRAND_WHITE, opacity: 0.6, letterSpacing: 2, margin: "0 0 12px", textTransform: "uppercase" }}>PROJECT INFO</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 24, rowGap: 12 }}>
                    <span style={{ fontSize: 11, color: BRAND_WHITE, opacity: 0.4 }}>CLIENT</span>
                    <span style={{ fontSize: 11, color: BRAND_WHITE }}>BOISE ANALOG CLUB</span>
                    <span style={{ fontSize: 11, color: BRAND_WHITE, opacity: 0.4 }}>SCOPE</span>
                    <span style={{ fontSize: 11, color: BRAND_WHITE }}>IDENTITY + PRINT SYSTEM</span>
                    <span style={{ fontSize: 11, color: BRAND_WHITE, opacity: 0.4 }}>LOCATION</span>
                    <span style={{ fontSize: 11, color: BRAND_WHITE }}>BOISE, ID</span>
                    <span style={{ fontSize: 11, color: BRAND_WHITE, opacity: 0.4 }}>TECH</span>
                    <span style={{ fontSize: 11, color: BRAND_WHITE }}>ADOBE CC + FIGMA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section ref={summaryRef} style={{ background: PAGE_BG, display: "flex", alignItems: "flex-start", marginBottom: "clamp(28px, 6vh, 72px)" }}>
          <div style={{ padding: isMobile ? "clamp(24px, 5vh, 48px) 20px" : "clamp(32px, 6vh, 64px) 56px", width: "100%" }}>
            <div style={{ width: "100%", maxWidth: "var(--bac-inner-max-w)", margin: "0 auto" }}>
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
                <div style={{ width: isMobile ? "100%" : "clamp(84px, 10vw, 140px)", maxWidth: isMobile ? 220 : undefined, aspectRatio: "1/1", border: `1px solid ${GRAY2}`, overflow: "hidden", background: WHITE, flex: "0 0 auto" }}>
                  <img
                    src="/images/analog2.png"
                    alt="Boise Analog Club mark"
                    style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: GRAY2 }}>
                <div style={{ background: PAGE_BG, padding: "clamp(16px, 2.5vw, 24px)" }}>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1, margin: "0 0 10px", textTransform: "uppercase" }}>What Is The Problem?</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: UI_LIGHT, lineHeight: 1.8, margin: 0 }}>
                    A growing film photography community needed consistent event promotion that could scale across flyers, social assets, and recurring meetups.
                  </p>
                </div>
                <div style={{ background: PAGE_BG, padding: "clamp(16px, 2.5vw, 24px)" }}>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1, margin: "0 0 10px", textTransform: "uppercase" }}>What Constraints?</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: UI_LIGHT, lineHeight: 1.8, margin: 0 }}>
                    Rapid turnarounds, print readiness, and repeatable templates that stay legible in dark venues and on mobile screens.
                  </p>
                </div>
                <div style={{ background: PAGE_BG, padding: "clamp(16px, 2.5vw, 24px)" }}>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1, margin: "0 0 10px", textTransform: "uppercase" }}>Decisions & Why</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: UI_LIGHT, lineHeight: 1.8, margin: 0 }}>
                    A strict grid, high-contrast black/white photography, and a single red accent to keep the system bold, fast, and unmistakable across formats.
                  </p>
                </div>
                <div style={{ background: PAGE_BG, padding: "clamp(16px, 2.5vw, 24px)" }}>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1, margin: "0 0 10px", textTransform: "uppercase" }}>Outcome</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: UI_LIGHT, lineHeight: 1.8, margin: 0 }}>
                    A flyer-first identity system that supports consistent promotion month after month without losing character.
                  </p>
                </div>
              </div>

              <div style={{ marginTop: "clamp(12px, 2vh, 20px)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, margin: 0, textTransform: "uppercase" }}>0.1 ROLE / SCOPE / DELIVERABLES</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, color: GRAY1, letterSpacing: 2, margin: 0, textTransform: "uppercase" }}>[ PRINT READY ]</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 1, background: GRAY2 }}>
                  <div style={{ background: PAGE_BG, padding: 14 }}>
                    <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1, margin: "0 0 8px", textTransform: "uppercase" }}>Role</p>
                    <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: UI_LIGHT, lineHeight: 1.6, margin: 0 }}>Brand identity + flyer system.</p>
                  </div>
                  <div style={{ background: PAGE_BG, padding: 14 }}>
                    <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1, margin: "0 0 8px", textTransform: "uppercase" }}>Scope</p>
                    <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: UI_LIGHT, lineHeight: 1.6, margin: 0 }}>Logo, type hierarchy, color rules, poster/flyer layouts, social posts.</p>
                  </div>
                  <div style={{ background: PAGE_BG, padding: 14 }}>
                    <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1, margin: "0 0 8px", textTransform: "uppercase" }}>Deliverables</p>
                    <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: UI_LIGHT, lineHeight: 1.6, margin: 0 }}>Flyer templates, print-ready exports, brand assets, and a repeatable promo kit.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <main>
          <ScrollSection index={0} setActive={setActive} isMobile={isMobile}>
            <PageHeader number="1.0" title="BRAND OVERVIEW" isMobile={isMobile} />
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 48 }}>
              <div>
                <div style={{
                  background: WHITE,
                  border: `1px solid ${GRAY2}`,
                  overflow: "hidden",
                  aspectRatio: '1/1',
                  width: '100%',
                }}>
                  <img
                    src="/images/analog2.png"
                    alt="Boise Analog Club mark"
                    style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <div>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: 12 }}>ABOUT</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 13, color: UI_LIGHT, lineHeight: 1.8 }}>
                    BOISE ANALOG CLUB is a community for film photography enthusiasts—meetups, photo walks, events, and shared practice.
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: 12 }}>1.1 MISSION</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 13, color: UI_LIGHT, lineHeight: 1.8 }}>
                    Keep analog photography alive through community, education, and consistent event programming.
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: 12 }}>1.2 POSITIONING</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 13, color: UI_LIGHT, lineHeight: 1.8 }}>
                    A local culture club for film photography: community-led, approachable, and built around real meetups and shared practice. The visual system stays bold and poster-forward while keeping event details clear and consistent.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: isMobile ? 24 : 48 }}>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: 24 }}>1.3 BRAND PERSONALITY</p>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 1, background: GRAY2 }}>
                {[
                  { n: "1", label: "BOLD", subs: ["Poster First", "High Contrast", "Immediate"] },
                  { n: "2", label: "NOSTALGIC", subs: ["Analog Culture", "Tactile", "Timeless"] },
                  { n: "3", label: "COMMUNITY", subs: ["Welcoming", "Local", "Inclusive"] },
                  { n: "4", label: "RAW", subs: ["Real Photos", "Grain", "Truthful"] },
                ].map((p) => (
                  <div key={p.n} style={{ background: PAGE_BG, padding: isMobile ? "18px 14px" : "24px 20px" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
                      <span style={{ fontFamily: "'Bitcount Single', 'Arial Black', sans-serif", fontSize: 28, fontWeight: 900, color: RED }}>{p.n}</span>
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

          <ScrollSection index={1} setActive={setActive} isMobile={isMobile}>
            <PageHeader number="2.0" title="LOGO SYSTEM" isMobile={isMobile} />

            <div style={{ marginBottom: "clamp(12px, 2vh, 20px)", maxWidth: 820 }}>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 13, color: UI_LIGHT, lineHeight: 1.8, margin: 0 }}>
                The mark bridges analog heritage and modern clarity—graphic enough for posters, simple enough to live on every event template.
              </p>
            </div>

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
                  { kind: "img", src: "/images/analog.png", alt: "Boise Analog Club mark variation 01" },
                  { kind: "img", src: "/images/analog2.png", alt: "Boise Analog Club mark variation 02" },
                  { kind: "impact", label: "ANALOG" },
                ].map((item, idx) => (
                  <div key={item.kind === "img" ? item.src : `impact-${idx}`} style={{
                    background: item.kind === "impact" ? RED : BRAND_WHITE,
                    border: `1px solid ${GRAY2}`,
                    overflow: "hidden",
                    aspectRatio: "var(--bac-logomark-ar)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    {item.kind === "img" ? (
                      <img
                        src={item.src}
                        alt={item.alt}
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
                      />
                    ) : (
                      <span style={{
                        fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
                        fontSize: "clamp(28px, 4vw, 56px)",
                        lineHeight: 1,
                        letterSpacing: 1,
                        color: BRAND_WHITE,
                        textTransform: "uppercase"
                      }}>
                        {item.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: "clamp(6px, 1vh, 12px)" }}>2.2 TYPEMARK</p>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  { bg: RED, color: BRAND_WHITE, label: "Analog" },
                  { bg: BRAND_WHITE, color: RED, label: "Analog" },
                  { bg: RED, color: BRAND_WHITE, label: "ANALOG", isImpact: true },
                ].map((v, i) => (
                  <div key={i} style={{
                    background: v.bg,
                    border: `1px solid ${GRAY2}`,
                    padding: "0 var(--bac-typemark-pad-x)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: "var(--bac-typemark-h)",
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
                        fontFamily: v.isImpact ? "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" : "'Bucklane Script', 'Bitcount Single', 'Arial Black', sans-serif",
                        fontWeight: v.isImpact ? 400 : 900,
                        fontSize: "clamp(18px, 3.2vw, 40px)",
                        color: v.color,
                        letterSpacing: v.isImpact ? 0 : -1,
                        lineHeight: 1,
                        textTransform: v.isImpact ? "uppercase" : "none"
                      }}>{v.label}</span>
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
                    Maintain clearspace equal to the mark&apos;s inner ring thickness. Keep it off the trim and off the photo subject.
                  </p>
                </div>
                <div style={{ background: PAGE_BG, padding: "clamp(14px, 2vh, 18px)" }}>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1, margin: "0 0 10px", textTransform: "uppercase" }}>Minimum Size</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: UI_LIGHT, lineHeight: 1.7, margin: 0 }}>
                    Digital: 24px height. Print: 7mm height. For micro use, default to the typemark only.
                  </p>
                </div>
                <div style={{ background: PAGE_BG, padding: "clamp(14px, 2vh, 18px)" }}>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1, margin: "0 0 10px", textTransform: "uppercase" }}>Production</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: UI_LIGHT, lineHeight: 1.7, margin: 0 }}>
                    Red is the primary brand color and the contrast accent for flyers. Keep the rest of the system black and white for clarity.
                  </p>
                </div>
              </div>
            </div>
          </ScrollSection>

          <ScrollSection index={2} setActive={setActive} isMobile={isMobile}>
            <PageHeader number="3.0" title="COLOR PALETTE" isMobile={isMobile} />
            <div style={{ marginBottom: "clamp(12px, 2vh, 20px)", maxWidth: 820 }}>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 13, color: UI_LIGHT, lineHeight: 1.8, margin: 0 }}>
                A minimal black-and-white foundation keeps photography honest and legible; a single red accent (#ED1C23) brings poster energy and instant recognition.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <ColorSwatch
                letter="A" num="01"
                hex="ED1C23"
                cmyk="CMYK C0 M100 Y92 K0"
                rgb="RGB R237 G28 B35"
                bg={RED} textColor={BRAND_WHITE}
              />
              <ColorSwatch
                letter="B" num="02"
                hex="FFFFFF"
                cmyk="CMYK C0 M0 Y0 K0"
                rgb="RGB R255 G255 B255"
                bg={BRAND_WHITE} textColor={BRAND_BLACK}
              />
              <ColorSwatch
                letter="C" num="03"
                hex="000000"
                cmyk="CMYK C72 M68 Y67 K88"
                rgb="RGB R0 G0 B0"
                bg={BRAND_BLACK} textColor={BRAND_WHITE}
              />
              <ColorSwatch
                letter="D" num="04"
                hex="353535"
                cmyk="CMYK C67 M63 Y62 K57"
                rgb="RGB R53 G53 B53"
                bg={BRAND_GRAY_DARK} textColor={BRAND_WHITE}
              />
            </div>
          </ScrollSection>

          <ScrollSection index={3} setActive={setActive} isMobile={isMobile}>
            <PageHeader number="4.0" title="TYPOGRAPHY" isMobile={isMobile} />
            <div style={{ marginBottom: "clamp(12px, 2vh, 20px)", maxWidth: 820 }}>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 13, color: UI_LIGHT, lineHeight: 1.8, margin: 0 }}>
                The typography system bridges retro and modern—timeless, hand-made character paired with bold, structured utility type. Together, the fonts keep the identity loud enough for flyers and still clean enough to feel contemporary across digital posts.
              </p>
            </div>
            <FontCard
              num="1" name="Bucklane Script" label="Primary Font"
              description="Display script used for the typemark and select headline moments. Adds analog character and a hand-made feel without sacrificing legibility."
              isMobile={isMobile}
            />
            <FontCard
              num="2" name="Impact" label="Secondary Font"
              description="All-caps poster voice for emphasis and callouts. Used sparingly for maximum contrast and immediate recognition."
              isMobile={isMobile}
            />
            <FontCard
              num="3" name="Geist" label="Tertiary Font"
              description="All-caps utility font for details, metadata, and structured information blocks across flyers and social posts."
              isMobile={isMobile}
            />
            <FontCard
              num="4" name="Caveat" label="Quaternary Font"
              description="Handwritten accent used selectively for notes, highlights, and informal callouts to reinforce the community tone."
              isMobile={isMobile}
            />
          </ScrollSection>

          <ScrollSection index={4} setActive={setActive} isMobile={isMobile}>
            <PageHeader number="5.0" title="GRAPHIC ELEMENTS" isMobile={isMobile} />
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 1, background: GRAY2 }}>
              <div style={{ background: PAGE_BG, padding: isMobile ? 16 : 40 }}>
                <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: 24 }}>5.1 — GRAIN</p>
                <div style={{ border: `1px solid ${GRAY2}`, overflow: "hidden", background: PAGE_BG }}>
                  <img
                    src="/images/IMG_5153.JPG"
                    alt="Grain reference"
                    style={{ width: "100%", height: isMobile ? "var(--bac-elements-media-h-mobile)" : "var(--bac-elements-media-h)", objectFit: "cover", display: "block", filter: "grayscale(100%) contrast(1.1)" }}
                  />
                </div>
                <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: GRAY1, lineHeight: 1.8, marginTop: 24 }}>
                  Grain is intentional—both film grain and digital grain. It keeps the work tactile, imperfect, and consistent across photography, flyers, and social posts.
                </p>
              </div>
              <div style={{ background: PAGE_BG, padding: isMobile ? 16 : 40 }}>
                <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: 24 }}>5.2 — PAPER TEXTURES</p>
                <div style={{ border: `1px solid ${GRAY2}`, overflow: "hidden", background: PAGE_BG }}>
                  <img
                    src="/images/paper.jpg"
                    alt="Paper texture"
                    style={{ width: "100%", height: isMobile ? "var(--bac-elements-media-h-mobile)" : "var(--bac-elements-media-h)", objectFit: "var(--bac-elements-media-fit)", display: "block" }}
                  />
                </div>
                <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: GRAY1, lineHeight: 1.8, marginTop: 24 }}>
                  Paper textures reinforce the flyer-first identity. They add physicality and help the system feel like a real poster series, even when viewed on screens.
                </p>
              </div>
            </div>
          </ScrollSection>

          <ScrollSection index={5} setActive={setActive} isMobile={isMobile}>
            <PageHeader number="6.0" title="PHOTOGRAPHY DIRECTION" isMobile={isMobile} />
            <div style={{ marginBottom: 16, maxWidth: 820 }}>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: 12 }}>DIRECTION</p>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 13, color: UI_LIGHT, lineHeight: 1.8 }}>
                Photography centers on black and white group photos and candid event moments—members laughing, shooting, and socializing. The goal is human and documentary: real people, real film culture, and a sense of community you can feel at a glance.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: 1, background: GRAY2 }}>
              {[
                { src: "/images/IMG_3141.JPG", label: "00" },
                { src: "/images/IMG_5153.JPG", label: "01" },
                { src: "/images/P2201155.jpg", label: "02" },
                { src: "/images/IMG_3145 2.JPG", label: "03" },
                { src: "/images/IMG_2418 4.jpg", label: "04" },
                { src: "/images/IMG_1679.JPG", label: "05" },
              ].map((img) => (
                <div key={img.src} style={{ background: PAGE_BG, position: "relative", overflow: "hidden", aspectRatio: "1 / 1" }}>
                  <img src={img.src} alt={`Boise Analog Club photography ${img.label}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "grayscale(100%) contrast(1.1)" }} />
                </div>
              ))}
            </div>
          </ScrollSection>

          <ScrollSection index={6} setActive={setActive} isMobile={isMobile}>
            <PageHeader number="7.0" title="LAYOUTS" isMobile={isMobile} />

            <div style={{ marginBottom: 24, maxWidth: "800px" }}>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, marginBottom: 12 }}>DESIGN DIRECTION</p>
              <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 13, color: UI_LIGHT, lineHeight: 1.8 }}>
                Layouts are built around a flyer-first system with social posts in mind. Each meetup uses the same core grid, type hierarchy, and information modules so details stay consistent while imagery and headlines change week to week.
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "clamp(16px, 2.5vw, 32px)",
              width: "100%",
              alignItems: "start",
            }}>
              <div style={{ background: PAGE_BG, border: `1px solid ${GRAY2}`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={isMobile ? { position: "relative", width: "100%", aspectRatio: "4 / 5", overflow: "hidden" } : { position: "relative", width: "100%", aspectRatio: "var(--bac-layout-media-ar)", overflow: "hidden" }}>
                  <img
                    src="/images/BAC january.png"
                    alt="Meetup flyer layout example"
                    style={isMobile ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block" } : { width: "100%", height: "100%", objectFit: "var(--bac-app-media-fit)", objectPosition: "center", display: "block" }}
                  />
                </div>
                <div style={{ borderTop: `1px solid ${GRAY2}`, padding: "var(--case-study-app-label-pad)", display: "flex", justifyContent: "space-between", alignItems: "baseline", background: PAGE_BG }}>
                  <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 1, color: UI_LIGHT }}>01</span>
                  <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 1, color: GRAY1 }}>MEETUP FLYER LAYOUT</span>
                </div>
              </div>

              <div style={{ background: PAGE_BG, border: `1px solid ${GRAY2}`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={isMobile ? { position: "relative", width: "100%", aspectRatio: "4 / 5", overflow: "hidden" } : { position: "relative", width: "100%", aspectRatio: "var(--bac-layout-media-ar)", overflow: "hidden" }}>
                  <img
                    src="/images/propagranda 3.png"
                    alt="Promotional social post layout example"
                    style={isMobile ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block" } : { width: "100%", height: "100%", objectFit: "var(--bac-app-media-fit)", objectPosition: "center", display: "block" }}
                  />
                </div>
                <div style={{ borderTop: `1px solid ${GRAY2}`, padding: "var(--case-study-app-label-pad)", display: "flex", justifyContent: "space-between", alignItems: "baseline", background: PAGE_BG }}>
                  <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 1, color: UI_LIGHT }}>02</span>
                  <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 1, color: GRAY1 }}>SOCIAL PROMO LAYOUT</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "clamp(16px, 2.5vh, 28px)" }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 1, background: GRAY2 }}>
                <div style={{ background: PAGE_BG, padding: "clamp(16px, 2.5vw, 24px)" }}>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1, margin: "0 0 10px", textTransform: "uppercase" }}>Meetup Flyers</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: UI_LIGHT, lineHeight: 1.8, margin: 0 }}>
                    The flyer system evolves month to month while keeping the same structure: event name first, then date/time/location, then supporting details. Photography and headline treatments change to match each meetup, while type stays locked to consistent margins and a repeatable hierarchy.
                  </p>
                </div>
                <div style={{ background: PAGE_BG, padding: "clamp(16px, 2.5vw, 24px)" }}>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1, margin: "0 0 10px", textTransform: "uppercase" }}>Social Posts</p>
                  <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: UI_LIGHT, lineHeight: 1.8, margin: 0 }}>
                    Social layouts reuse the same hierarchy in tighter crops. The system is designed to export quickly for feed, story, and square formats without redesigning each time.
                  </p>
                </div>
              </div>
            </div>
          </ScrollSection>

          <ScrollSection index={7} setActive={setActive} isMobile={isMobile}>
            <PageHeader number="8.0" title="APPLICATIONS" isMobile={isMobile} />
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(16px, 2.5vw, 32px)" }}>
              <div style={{ maxWidth: 820 }}>
                <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: GRAY1, letterSpacing: 2, margin: "0 0 12px" }}>FLYERS & SOCIAL</p>
                <p style={{ fontFamily: "'SF Mono', monospace", fontSize: 13, color: UI_LIGHT, lineHeight: 1.8, margin: 0 }}>
                  Applications are built for rapid iteration: posters, event flyers, and social posts share the same core grid, type hierarchy, and color rules.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "clamp(16px, 2.5vw, 32px)" }}>
                <div style={{ background: PAGE_BG, border: `1px solid ${GRAY2}`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <div style={isMobile ? { position: "relative", width: "100%", aspectRatio: "4 / 5", overflow: "hidden" } : { position: "relative", width: "100%", aspectRatio: "var(--bac-layout-media-ar)", overflow: "hidden" }}>
                    <img
                      src="/images/BAC march 2026.png"
                      alt="Boise Analog Club flyer application"
                      style={isMobile ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block" } : { width: "100%", height: "100%", objectFit: "var(--bac-application-media-fit)", objectPosition: "center", display: "block" }}
                    />
                  </div>
                  <div style={{ borderTop: `1px solid ${GRAY2}`, padding: "var(--case-study-app-label-pad)", display: "flex", justifyContent: "space-between", alignItems: "baseline", background: PAGE_BG }}>
                    <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 1, color: UI_LIGHT }}>01</span>
                    <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 1, color: GRAY1 }}>EVENT FLYER</span>
                  </div>
                </div>

                <div style={{ background: PAGE_BG, border: `1px solid ${GRAY2}`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <div style={isMobile ? { position: "relative", width: "100%", aspectRatio: "4 / 5", overflow: "hidden" } : { position: "relative", width: "100%", aspectRatio: "var(--bac-layout-media-ar)", overflow: "hidden" }}>
                    <img
                      src="/images/bac 2.png"
                      alt="Boise Analog Club social application"
                      style={isMobile ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block" } : { width: "100%", height: "100%", objectFit: "var(--bac-application-media-fit)", objectPosition: "center", display: "block" }}
                    />
                  </div>
                  <div style={{ borderTop: `1px solid ${GRAY2}`, padding: "var(--case-study-app-label-pad)", display: "flex", justifyContent: "space-between", alignItems: "baseline", background: PAGE_BG }}>
                    <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 1, color: UI_LIGHT }}>02</span>
                    <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 1, color: GRAY1 }}>POSTER SERIES</span>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: "'Bucklane Script', 'Bitcount Single', 'Arial Black', sans-serif", fontWeight: 400, fontSize: "clamp(32px, 4vw, 56px)", letterSpacing: "-0.04em", color: UI_LIGHT, lineHeight: 0.9 }}>
                    Boise Analog Club
                  </span>
                  <span style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, letterSpacing: 2, color: GRAY1 }}>
                    GRID / MODULAR
                  </span>
                </div>
              </div>
            </div>
          </ScrollSection>
        </main>
      </div>

      <style>{`
        :root {
          --bac-inner-max-w: 1200px;
          --bac-section-h: 100vh;
          --bac-snap-type: y mandatory;
          --bac-snap-align: start;
          --bac-logo-size: clamp(50px, 7vh, 120px);
          --bac-brand-logo-size: 120px;
          --bac-layout-row-h: clamp(260px, 24vh, 340px);
          --bac-layout-media-ar: 4 / 5;
          --bac-photo-tile-ar: 1 / 1;
          --bac-logomark-ar: 1 / 1;
          --bac-logomark-pad: clamp(16px, 3vh, 32px);
          --bac-typemark-h: clamp(60px, 9vh, 120px);
          --bac-typemark-pad-x: 28px;
          --bac-app-media-fit: contain;
          --bac-application-media-fit: contain;
          --bac-applications-grid-h: 56vh;
          --bac-applications-grid-offset: 340px;
          --bac-elements-media-h-mobile: clamp(240px, 38vh, 360px);
          --bac-elements-media-h: 200px;
          --bac-elements-media-fit: cover;
        }

        @media (max-width: 1680px), (max-height: 980px) {
          :root {
            --bac-inner-max-w: 1060px;
          }
        }

        @media (max-width: 1536px), (max-height: 920px) {
          :root {
            --bac-inner-max-w: 980px;
          }
        }

        @media (max-width: 1440px), (max-height: 900px) {
          :root {
            --bac-inner-max-w: 880px;
            --bac-layout-row-h: clamp(220px, 22vh, 320px);
            --bac-layout-media-ar: 4 / 5;
            --bac-applications-grid-h: 52vh;
            --bac-applications-grid-offset: 320px;
            --bac-section-h: auto;
            --bac-snap-type: none;
            --bac-snap-align: unset;
          }
        }

        @media (max-width: 1280px), (max-height: 820px) {
          :root {
            --bac-inner-max-w: 780px;
            --bac-layout-row-h: clamp(200px, 20vh, 300px);
            --bac-layout-media-ar: 4 / 5;
            --bac-applications-grid-h: 48vh;
            --bac-applications-grid-offset: 300px;
            --bac-section-h: auto;
            --bac-snap-type: none;
            --bac-snap-align: unset;
          }
        }

        @media (min-width: 1800px) and (min-aspect-ratio: 16/9) {
          :root {
            --bac-photo-tile-ar: 3 / 2;
            --bac-app-media-fit: contain;
            --bac-applications-grid-h: 62vh;
            --bac-applications-grid-offset: 320px;
            --bac-elements-media-h: 260px;
            --bac-elements-media-fit: cover;
          }
        }

        @media (max-aspect-ratio: 10/16) {
          :root {
            --bac-applications-grid-h: 70vh;
            --bac-applications-grid-offset: 320px;
          }
        }

        @media (min-width: 1800px) and (min-height: 900px) {
          :root {
            --bac-layout-row-h: clamp(360px, 30vh, 460px);
            --bac-brand-logo-size: 140px;
            --bac-logomark-ar: 6 / 5;
            --bac-logomark-pad: clamp(10px, 1.6vh, 18px);
            --bac-typemark-h: clamp(52px, 6.5vh, 96px);
            --bac-typemark-pad-x: 20px;
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

export default BoiseAnalogClubCaseStudy;
