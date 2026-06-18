const ProjectNarrative = ({ eyebrow, meta = [], sections }) => {
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
          {filteredMeta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--spacing-lg)',
            alignItems: 'start',
          }}
        >
          {sections.map((section) => (
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
                  color: 'var(--color-text)',
                  fontWeight: 'var(--font-mono-weight-bold)',
                }}
              >
                {section.label}
              </div>
              <p
                style={{
                  margin: 0,
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.6,
                  fontSize: 'var(--fs-md)',
                }}
              >
                {section.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectNarrative;
