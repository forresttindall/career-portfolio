import { useEffect } from 'react';
import { motion } from 'framer-motion';

const BLACK = 'var(--color-bg)';
const WHITE = 'var(--color-text)';
const GRAY1 = 'var(--color-text-dim)';
const GRAY2 = 'var(--color-border)';

const RicochetProject = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-header-theme="light"
      style={{ background: BLACK, color: WHITE, minHeight: '100vh' }}
    >
      <section style={{ padding: 'var(--spacing-xxl) var(--spacing-md) var(--spacing-xl)', borderBottom: `1px solid ${GRAY2}` }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
            <h1 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>
              RICOCHET
            </h1>
            <div className="small-text" style={{ color: GRAY1 }}>
              UI/UX DESIGN & SYSTEM ARCHITECTURE
            </div>
          </div>
          <div style={{ height: 1, background: GRAY2, marginTop: 'var(--spacing-sm)' }} />
          <div className="small-text" style={{ marginTop: 'var(--spacing-md)', maxWidth: 760, opacity: 0.9, textTransform: 'none', lineHeight: 1.6 }}>
            A comprehensive website redesign and visual system rebrand for Ricochet, a high-growth platform in the resale tech space. Post-acquisition, the focus shifted from a generic "startup SaaS" look to a sophisticated, high-fidelity aesthetic that reflects the scale and reliability of the product. This project involved deep collaboration with the Superbase team to define a new contemporary standard for their interface.
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--spacing-xl) var(--spacing-md) var(--spacing-xxl)' }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 'var(--spacing-xl)', alignItems: 'start' }}>
            <div style={{ border: `1px solid ${GRAY2}`, overflow: 'hidden' }}>
              <img
                src="/images/ricochet mockup.webp"
                alt="Ricochet UI mockup"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            <div>
              <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 'var(--spacing-md)' }}>
                <div className="small-text" style={{ color: GRAY1, letterSpacing: 2 }}>
                  LOCATION
                </div>
                <div className="small-text" style={{ marginTop: 8, textTransform: 'none' }}>
                  Boise, ID / Remote
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
                <div className="small-text" style={{ color: GRAY1, letterSpacing: 2 }}>
                  TECH STACK
                </div>
                <div className="small-text" style={{ marginTop: 8, textTransform: 'none' }}>
                  Figma, React, Tailwind CSS, Framer Motion
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
                <div className="small-text" style={{ color: GRAY1, letterSpacing: 2 }}>
                  ROLE
                </div>
                <div className="small-text" style={{ marginTop: 8, textTransform: 'none' }}>
                  UI/UX Lead Designer
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
                <div className="small-text" style={{ color: GRAY1, letterSpacing: 2 }}>
                  TEAM
                </div>
                <div className="small-text" style={{ marginTop: 8, textTransform: 'none', display: 'grid', gap: 6 }}>
                  <div>Mickey Martin (Product)</div>
                  <div>Tyler Crabb (Strategy)</div>
                  <div>Madi Cleave (Design)</div>
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
                <div className="small-text" style={{ color: GRAY1, letterSpacing: 2 }}>
                  STRATEGY
                </div>
                <div className="small-text" style={{ marginTop: 8, textTransform: 'none', opacity: 0.9, lineHeight: 1.5 }}>
                  The goal was to eliminate visual noise and focus on data density. We moved from rounded, bubbly elements to a more architectural, grid-based layout. This improved scannability for power users who spend hours in the dashboard daily.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 var(--spacing-md) var(--spacing-xxl)' }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 'var(--spacing-xl)' }}>
            <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
              <h2 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>
                UI ELEMENTS
              </h2>
              <div className="small-text" style={{ color: GRAY1 }}>
                DASHBOARDS / TABLES / CHARTS
              </div>
            </div>

            <div className="small-text" style={{ marginTop: 'var(--spacing-md)', maxWidth: 860, textTransform: 'none', opacity: 0.9 }}>
              Designed core UI components for reporting and operational workflows: summary cards, data tables, export actions, and chart modules with consistent spacing, typography, and hierarchy.
            </div>
          </div>

          <div className="ricochet-ui-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xl)' }}>
            <div style={{ border: `1px solid ${GRAY2}`, overflow: 'hidden' }}>
              <img
                src="/images/Hourly Sales.PNG"
                alt="Ricochet UI elements — store summary and hourly sales"
                style={{ width: '100%', height: 'auto', display: 'block' }}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div style={{ border: `1px solid ${GRAY2}`, overflow: 'hidden' }}>
              <img
                src="/images/Exportable tables.PNG"
                alt="Ricochet UI elements — payout history table and inventory chart"
                style={{ width: '100%', height: 'auto', display: 'block' }}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div className="ricochet-ui-notes" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 1, background: GRAY2, marginTop: 'var(--spacing-xl)' }}>
            <div style={{ background: BLACK, padding: 'var(--spacing-md)' }}>
              <div className="small-text" style={{ color: GRAY1, letterSpacing: 2 }}>
                SUMMARY CARDS
              </div>
              <div className="small-text" style={{ marginTop: 8, textTransform: 'none' }}>
                KPI blocks for sales, transactions, products sold, and net sales—built for quick scanning and consistent alignment.
              </div>
            </div>
            <div style={{ background: BLACK, padding: 'var(--spacing-md)' }}>
              <div className="small-text" style={{ color: GRAY1, letterSpacing: 2 }}>
                DATA TABLES
              </div>
              <div className="small-text" style={{ marginTop: 8, textTransform: 'none' }}>
                Structured table patterns with clear column rhythm, row separation, and action affordances like export.
              </div>
            </div>
            <div style={{ background: BLACK, padding: 'var(--spacing-md)' }}>
              <div className="small-text" style={{ color: GRAY1, letterSpacing: 2 }}>
                CHART MODULES
              </div>
              <div className="small-text" style={{ marginTop: 8, textTransform: 'none' }}>
                Line and pie chart layouts designed to pair cleanly with labels and totals without visual noise.
              </div>
            </div>
          </div>

          <style>{`
            @media (max-width: 900px) {
              .ricochet-ui-grid { grid-template-columns: 1fr !important; }
              .ricochet-ui-notes { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </section>
    </motion.div>
  );
};

export default RicochetProject;
