import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';

const BLACK = '#FFFFFF';
const GRAY1 = 'rgba(17, 17, 17, 0.56)';
const GRAY2 = '#C9C9C9';
const WHITE = '#111111';
const STRATEGY_CALL_URL = 'https://calendly.com/forrest-creationbase/30min';

const Services = () => {
  const navigate = useNavigate();

  const sections = useMemo(
    () => [
      { id: 'overview', label: 'Overview' },
      { id: 'four-cs', label: '4 Cs' },
      { id: 'uiux', label: 'UI/UX' },
      { id: 'dev', label: 'Development' },
      { id: 'photo', label: 'Photography' },
      { id: 'logos', label: 'Logo Psychology' },
      { id: 'color', label: 'Color Memory' },
    ],
    []
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const jumpTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `/services#${id}`);
    } else {
      window.location.hash = id;
    }
  };

  const openStrategyCall = () => {
    const win = window.open(STRATEGY_CALL_URL, '_blank', 'noopener,noreferrer');
    if (win) win.opener = null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-header-theme="light"
      style={{ background: BLACK, color: WHITE, minHeight: '100vh' }}
      role="main"
    >
      <section style={{ padding: 'var(--spacing-xxl) var(--spacing-md) var(--spacing-xl)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          <header className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
            <h1 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>SERVICES</h1>
            <div className="small-text" style={{ color: GRAY1 }}>INDEX (03)</div>
          </header>
          <div style={{ height: 1, background: 'var(--color-border)', marginTop: 'var(--spacing-sm)' }} aria-hidden="true" />
          <div className="small-text" style={{ marginTop: 'var(--spacing-md)', maxWidth: 760, opacity: 0.85 }}>
            Strategy-first UI/UX design, high-performance web development, brand systems, and photography—built to be understood fast and remembered longer.
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--spacing-xl) var(--spacing-md) var(--spacing-xxl)' }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(240px, 0.7fr) minmax(0, 1.3fr)',
              gap: 'var(--spacing-xl)',
              alignItems: 'start',
            }}
          >
            <aside style={{ position: 'sticky', top: 120, alignSelf: 'start' }}>
              <div className="small-text" style={{ color: GRAY1, marginBottom: 12 }}>NAV</div>
              <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 14 }}>
                <div style={{ display: 'grid', gap: 10 }}>
                  {sections.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => jumpTo(s.id)}
                      className="small-text"
                      style={{
                        background: 'transparent',
                        border: `1px solid ${GRAY2}`,
                        borderRadius: 10,
                        padding: '12px 12px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: WHITE,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        gap: 12,
                      }}
                    >
                      <span style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</span>
                      <span style={{ color: GRAY1 }}>{idx < 9 ? `0${idx + 1}` : idx + 1}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 'var(--spacing-lg)' }}>
                <button
                  type="button"
                  onClick={openStrategyCall}
                  className="newsletter-button"
                  style={{ width: '100%' }}
                >
                  Book Strategy Call
                  <ArrowUpRight size={14} weight="thin" />
                </button>
              </div>
            </aside>

            <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 'var(--spacing-xl)' }}>
              <section id="overview" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 1.02, margin: '0 0 var(--spacing-md)' }}>
                  What We Do
                </h2>
                <p className="small-text" style={{ lineHeight: 1.6, margin: '0 0 var(--spacing-lg)', color: WHITE, maxWidth: 860 }}>
                  Creationbase is a design, development, and photography studio focused on visual systems—how your brand looks, behaves, and earns trust across the web. We build experiences that are minimal but not generic: clear messaging, deliberate typography, strong imagery, precise interaction, and code that stays fast as you scale.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                  {[
                    { k: 'UI/UX Design', v: 'Flows, IA, product thinking, and interfaces that reduce friction.' },
                    { k: 'Web Development', v: 'React/Vite builds with performance, accessibility, and polish.' },
                    { k: 'Brand Systems', v: 'Logo, type, color, and motion rules that stay consistent.' },
                    { k: 'Photography', v: 'Commercial and event photography that matches the brand system.' },
                    { k: 'Launch Support', v: 'QA, handoff, and iteration after launch based on real behavior.' },
                  ].map((item) => (
                    <div key={item.k} style={{ border: `1px solid ${GRAY2}`, borderRadius: 10, padding: 14 }}>
                      <div className="small-text" style={{ letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                        {item.k}
                      </div>
                      <div className="small-text" style={{ color: WHITE, lineHeight: 1.6 }}>
                        {item.v}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="four-cs" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 1.02, margin: '0 0 var(--spacing-md)' }}>
                  The 4 Cs Framework
                </h2>
                <p className="small-text" style={{ lineHeight: 1.6, margin: '0 0 var(--spacing-lg)', color: WHITE, maxWidth: 860 }}>
                  The 4 Cs are how we turn “looks good” into “works.” It’s a repeatable system for making your site and product feel obvious to new users: earn attention, remove confusion, build trust, then make action effortless.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                  {[
                    { t: 'Connect', d: 'First impressions: tone, typography, imagery, and the opening claim.' },
                    { t: 'Clarify', d: 'Explain the offer fast: hierarchy, page structure, and decision flow.' },
                    { t: 'Convince', d: 'Proof over adjectives: outcomes, constraints, process, and credibility.' },
                    { t: 'Convert', d: 'Remove friction: CTA strategy, forms, mobile ergonomics, and speed.' },
                  ].map((item, idx) => (
                    <div key={item.t} style={{ border: `1px solid ${GRAY2}`, borderRadius: 10, padding: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                        <div className="small-text" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                          {item.t}
                        </div>
                        <div className="small-text" style={{ color: GRAY1 }}>
                          {`C${idx + 1}`}
                        </div>
                      </div>
                      <div className="small-text" style={{ marginTop: 10, color: WHITE, lineHeight: 1.6 }}>
                        {item.d}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="uiux" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 1.02, margin: '0 0 var(--spacing-md)' }}>
                  UI/UX Design
                </h2>
                <p className="small-text" style={{ lineHeight: 1.6, margin: '0 0 var(--spacing-lg)', color: WHITE, maxWidth: 860 }}>
                  Good UI is quiet. It makes the next step feel inevitable. We design interfaces by reducing cognitive load: fewer choices at once, clearer hierarchy, stronger naming, and consistent interaction rules.
                </p>
                <div style={{ border: `1px solid ${GRAY2}`, borderRadius: 10, padding: 14 }}>
                  <div className="small-text" style={{ letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>What you get</div>
                  <ul className="small-text" style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6, color: WHITE }}>
                    <li style={{ marginBottom: 10 }}>Information architecture and page/flow mapping</li>
                    <li style={{ marginBottom: 10 }}>Wireframes → high-fidelity layouts with a scalable system</li>
                    <li style={{ marginBottom: 10 }}>Component states: hover, focus, error, loading, empty</li>
                    <li>Interaction rules: spacing, motion, and feedback patterns</li>
                  </ul>
                </div>
              </section>

              <section id="dev" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 1.02, margin: '0 0 var(--spacing-md)' }}>
                  Web Development
                </h2>
                <p className="small-text" style={{ lineHeight: 1.6, margin: '0 0 var(--spacing-lg)', color: WHITE, maxWidth: 860 }}>
                  Design is only real when it runs. We build fast sites that feel stable and intentional: clean structure, responsive behavior, accessible markup, and performance that holds up when content grows.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                  {[
                    { k: 'Performance', v: 'Ship less, render fast, keep interactions smooth.' },
                    { k: 'Accessibility', v: 'Keyboard-friendly, readable contrast, sensible semantics.' },
                    { k: 'Maintainability', v: 'Components as systems, not one-off pages.' },
                    { k: 'Iteration', v: 'Small changes stay safe because the system is consistent.' },
                  ].map((item) => (
                    <div key={item.k} style={{ border: `1px solid ${GRAY2}`, borderRadius: 10, padding: 14 }}>
                      <div className="small-text" style={{ letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                        {item.k}
                      </div>
                      <div className="small-text" style={{ color: WHITE, lineHeight: 1.6 }}>
                        {item.v}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="photo" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 1.02, margin: '0 0 var(--spacing-md)' }}>
                  Photography
                </h2>
                <p className="small-text" style={{ lineHeight: 1.6, margin: '0 0 var(--spacing-lg)', color: WHITE, maxWidth: 860 }}>
                  Photography is part of the system. We shoot commercial and event photography that feels cohesive with the brand—so your site, socials, and campaigns read as one studio, not a collage.
                </p>
                <div style={{ border: `1px solid ${GRAY2}`, borderRadius: 10, padding: 14 }}>
                  <div className="small-text" style={{ letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>What you get</div>
                  <ul className="small-text" style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6, color: WHITE }}>
                    <li style={{ marginBottom: 10 }}>Creative direction, shot list, and location planning</li>
                    <li style={{ marginBottom: 10 }}>Commercial and event coverage</li>
                    <li style={{ marginBottom: 10 }}>Editing and color that matches the brand system</li>
                    <li>Delivery formats for web, social, and print</li>
                  </ul>
                </div>
              </section>

              <section id="logos" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 1.02, margin: '0 0 var(--spacing-md)' }}>
                  Memorable Logo Psychology
                </h2>
                <p className="small-text" style={{ lineHeight: 1.6, margin: '0 0 var(--spacing-lg)', color: WHITE, maxWidth: 860 }}>
                  Logos are recognition devices. The job is not to “say everything,” it’s to create a distinct silhouette that the brain can store and retrieve quickly. Simpler shapes win because they survive time, scale, and repetition.
                </p>
                <div style={{ border: `1px solid ${GRAY2}`, borderRadius: 10, padding: 14 }}>
                  <div className="small-text" style={{ letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Why simpler is better</div>
                  <ul className="small-text" style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6, color: WHITE }}>
                    <li style={{ marginBottom: 10 }}>Faster recognition: fewer details means less processing effort</li>
                    <li style={{ marginBottom: 10 }}>Better recall: strong shapes become mental shortcuts</li>
                    <li style={{ marginBottom: 10 }}>More applications: icons, favicons, motion marks, signage</li>
                    <li>More consistent reproduction: across devices and materials</li>
                  </ul>
                </div>
              </section>

              <section id="color" style={{ paddingBottom: 'var(--spacing-xxl)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 1.02, margin: '0 0 var(--spacing-md)' }}>
                  Unique Color = Stronger Memory
                </h2>
                <p className="small-text" style={{ lineHeight: 1.6, margin: '0 0 var(--spacing-lg)', color: WHITE, maxWidth: 860 }}>
                  Color becomes a retrieval cue. When a category looks the same, a distinctive palette creates separation. The advantage isn’t being loud—it’s being uniquely identifiable when your brand is seen in a feed, a browser tab, or a crowded market.
                </p>
                <div style={{ border: `1px solid ${GRAY2}`, borderRadius: 10, padding: 14 }}>
                  <div className="small-text" style={{ letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>How we choose color</div>
                  <ol className="small-text" style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6, color: WHITE }}>
                    <li style={{ marginBottom: 10 }}>Define the brand feeling (precision, warmth, speed, depth)</li>
                    <li style={{ marginBottom: 10 }}>Audit the category (what everyone else is already using)</li>
                    <li style={{ marginBottom: 10 }}>Choose a primary cue color and supporting neutrals</li>
                    <li>Test legibility and contrast across real UI states</li>
                  </ol>
                </div>
              </section>

              <section style={{ paddingBottom: 'var(--spacing-xxl)' }}>
                <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 'var(--spacing-xl)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                    <div className="small-text" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>Next Step</div>
                    <div className="small-text" style={{ color: GRAY1 }}>Contact</div>
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 1.02, margin: '12px 0 var(--spacing-md)' }}>
                    Let’s build something that converts and lasts.
                  </h2>
                  <div className="small-text" style={{ color: GRAY1, maxWidth: 760, lineHeight: 1.6 }}>
                    If you want a site or product that feels premium, communicates fast, and stays consistent as you grow, we’ll map the system and ship it clean.
                  </div>
                  <div style={{ marginTop: 'var(--spacing-lg)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={openStrategyCall}
                      className="newsletter-button"
                    >
                      Book Strategy Call
                      <ArrowUpRight size={14} weight="thin" />
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/contact')}
                      className="newsletter-button newsletter-button--outline"
                    >
                      Contact Form
                    </button>
                    <button
                      type="button"
                      onClick={() => jumpTo('overview')}
                      className="small-text"
                      style={{
                        background: 'transparent',
                        color: WHITE,
                        border: `1px solid ${GRAY2}`,
                        borderRadius: 10,
                        padding: '14px 16px',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      Back to Top
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Services;
