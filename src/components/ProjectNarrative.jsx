import { ArrowUpRight } from '@phosphor-icons/react';
import TechIcon from './TechIcon';

const TECH_PATTERN = /^TECH\s*\((.*)\)$/i;

const ProjectNarrative = ({ eyebrow, meta = [], sections, ctaHref, ctaLabel = 'View Live Site' }) => {
  const filteredMeta = meta.filter((item) => !String(item).trim().toUpperCase().startsWith('LOCATION('));

  return (
    <section style={{ padding: '0 10px var(--spacing-xxl)' }}>
      <div style={{ height: 1, background: 'var(--color-border)', marginLeft: -10, marginRight: -10 }} />
      <div style={{ paddingTop: 'var(--spacing-sm)', display: 'grid', gap: 'var(--spacing-xl)' }}>
        <div
          className="small-text"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px 18px',
            alignItems: 'baseline',
          }}
        >
          <span style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>{eyebrow}</span>
          {filteredMeta.map((item) => {
            const text = String(item);
            const match = text.match(TECH_PATTERN);
            if (!match) return <span key={text}>{text}</span>;
            const techItems = match[1].split(',').map((t) => t.trim()).filter(Boolean);
            return (
              <span key={text} style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                <span>TECH(</span>
                {techItems.map((tech, i) => (
                  <span key={tech} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <TechIcon name={tech} />
                    <span>
                      {tech}
                      {i < techItems.length - 1 ? ',' : ''}
                    </span>
                  </span>
                ))}
                <span>)</span>
              </span>
            );
          })}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--spacing-lg)',
            alignItems: 'start',
          }}
        >
          {sections.map((section, index) => (
            <div
              key={section.label}
              style={{
                display: 'grid',
                gap: '10px',
                paddingTop: '12px',
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <div
                className="small-text"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--color-text)',
                  fontWeight: 'var(--font-mono-weight-bold)',
                }}
              >
                <span
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    width: 18,
                    height: 18,
                    flexShrink: 0,
                    border: '1px solid var(--color-border)',
                    borderRadius: '50%',
                    fontSize: 'var(--fs-xs)',
                    lineHeight: 1,
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {index + 1}
                </span>
                {section.label}
              </div>
              <p
                style={{
                  margin: 0,
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.6,
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                  fontSize: 'var(--fs-sm)',
                }}
              >
                {section.text}
              </p>
            </div>
          ))}
        </div>

        {ctaHref && (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--spacing-sm)' }}>
            <a className="newsletter-button" href={ctaHref} target="_blank" rel="noreferrer">
              {ctaLabel}
              <ArrowUpRight size={14} weight="thin" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectNarrative;
