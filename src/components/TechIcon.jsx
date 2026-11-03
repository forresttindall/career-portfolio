const adobeGlyph = (
  <>
    <rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M7.8 16.4 12 7.6l4.2 8.8M9.4 13.6h5.2" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </>
);

const claudeGlyph = (
  <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M12 2.5v6M12 15.5v6M2.5 12h6M15.5 12h6M5.4 5.4l4.2 4.2M14.4 14.4l4.2 4.2M18.6 5.4l-4.2 4.2M9.6 14.4l-4.2 4.2" />
  </g>
);

const TECH_ICONS = {
  figma: (
    <>
      <path d="M12 2H8.6a3.4 3.4 0 0 0 0 6.8H12V2Z" />
      <path d="M12 2h3.4a3.4 3.4 0 0 1 0 6.8H12V2Z" />
      <path d="M12 8.8h3.4a3.4 3.4 0 1 1 0 6.8H12V8.8Z" />
      <path d="M12 8.8H8.6a3.4 3.4 0 0 0 0 6.8H12V8.8Z" />
      <path d="M8.6 15.6H12V19a3.4 3.4 0 1 1-3.4-3.4Z" />
    </>
  ),
  framer: (
    <>
      <path d="M4 2h16v6.6h-8.4L4 2Z" />
      <path d="M4 8.6h8.4L20 15.2H4V8.6Z" />
      <path d="M4 15.2h8.4V22L4 15.2Z" />
    </>
  ),
  'framer motion': (
    <path
      d="M3 14.5c2.6-6.5 5.6-6.5 9 0s6.4 6.5 9 0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  ),
  react: (
    <>
      <circle cx="12" cy="12" r="2.3" />
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="12" rx="10" ry="4.2" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
      </g>
    </>
  ),
  trae: (
    <path d="M12 2.5l1.7 4.9 4.9 1.7-4.9 1.7L12 15.7l-1.7-4.9-4.9-1.7 4.9-1.7L12 2.5Zm6 11l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9.9-2.4Z" />
  ),
  next: (
    <>
      <circle cx="12" cy="12" r="9.4" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8.8 16.6V8.1l6.5 9.3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.3 8.1v4.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  sanity: (
    <>
      <circle cx="12" cy="12" r="9.4" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M15.6 8.6c-.6-1-1.9-1.6-3.5-1.6-2 0-3.4 1-3.4 2.5 0 1.3 1 2 3 2.5l1.3.3c2 .5 3 1.2 3 2.5 0 1.5-1.5 2.6-3.6 2.6-1.7 0-3-.6-3.7-1.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </>
  ),
  claude: claudeGlyph,
  'claude api': claudeGlyph,
  node: (
    <>
      <path d="M12 2.6 20.4 7.4v9.2L12 21.4 3.6 16.6V7.4Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9.3 15.4V8.6l5.4 6.8V8.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  bun: (
    <>
      <path d="M4.2 13.2a7.8 7.8 0 0 1 15.6 0V14a5.2 5.2 0 0 1-5.2 5.2H9.4A5.2 5.2 0 0 1 4.2 14Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="9.6" cy="13.4" r="1.05" fill="currentColor" />
      <circle cx="14.4" cy="13.4" r="1.05" fill="currentColor" />
    </>
  ),
  affinity: (
    <>
      <path d="M12 3.4 15.2 8.8H8.8Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <rect x="12.6" y="12.6" width="8.2" height="8.2" rx="2.2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="7.2" cy="16.4" r="4.2" fill="none" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  tailwind: (
    <>
      <path d="M4 12.4c1.4-3.2 3.4-4.3 5.9-3.6 1.4.4 2.3 1.4 3.2 2.3.9 1 2 1.4 3.4 1-.6 1.6-1.6 2.6-3 3-1.9.4-3.3-.5-4.5-1.9-.9-1-2-1.4-3.3-1.1Zm7-5c1.4-3.2 3.4-4.3 5.9-3.6 1.4.4 2.3 1.4 3.2 2.3.9 1 2 1.4 3.4 1-.6 1.6-1.6 2.6-3 3-1.9.4-3.3-.5-4.5-1.9-.9-1-2-1.4-3.3-1.1Z" />
    </>
  ),
  typescript: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3.4" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11.4h5.2M10.6 11.4v7.2" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path
        d="M15.4 18.3c.7.5 1.5.7 2.3.6 1.1-.1 1.7-.7 1.7-1.5 0-.7-.5-1.2-1.6-1.6l-.8-.3c-1.1-.4-1.7-1-1.7-1.9 0-1.1 1-1.9 2.4-1.9.7 0 1.3.2 1.8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  three: (
    <>
      <path d="M12 3.5 20 19.2H4Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 19.2 12 11.4l4 7.8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </>
  ),
  electron: (
    <>
      <circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="12" cy="12" rx="9.4" ry="5.4" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(-30 12 12)" />
      <circle cx="18.4" cy="7.9" r="1.9" fill="currentColor" />
    </>
  ),
  firebase: (
    <>
      <path d="M5.6 17.9 7.3 5.3c0-.5.7-.7 1-.2l2.3 3.9 1.7-2.1c.3-.4.9-.2 1 .3l1.6 6.1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M5.6 17.9 11 20.8c.6.3 1.3.3 1.9 0l5.5-2.9-2.2-8.9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </>
  ),
  stripe: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M14.5 9.7c-.7-.5-1.6-.7-2.5-.6-1.4.1-2.3.8-2.3 1.8 0 .9.7 1.4 2.1 1.8l1 .3c1.3.4 2 .9 2 1.9 0 1.2-1.1 2-2.8 2-1 0-2-.3-2.7-.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  vercel: <path d="M12 4l9 16H3z" />,
  vite: <path d="M13 2L4 14h6l-1 8 9-12h-6z" />,
  gsap: (
    <>
      <path d="M4.5 12l4-4 4 4-4 4z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M13.5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16.5 9.2 19.3 12l-2.8 2.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  adobe: adobeGlyph,
  'adobe illustrator': adobeGlyph,
  'adobe cc': adobeGlyph,
  cad: (
    <>
      <path d="M12 3 19 7v10l-7 4-7-4V7z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 3v8m0 0 7-4m-7 4L5 7m7 4v8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </>
  ),
  'industrial production standards': (
    <>
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 3.2v2.4M12 18.4v2.4M3.2 12h2.4M18.4 12h2.4M5.8 5.8l1.7 1.7M16.5 16.5l1.7 1.7M18.2 5.8l-1.7 1.7M7.5 16.5l-1.7 1.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
  'design system': (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1.6" />
      <rect x="14" y="3" width="7" height="7" rx="1.6" />
      <rect x="3" y="14" width="7" height="7" rx="1.6" />
      <rect x="14" y="14" width="7" height="7" rx="1.6" />
    </g>
  ),
  prototyping: <path d="M5.5 3.2 18 12.4l-5 .7 2.7 4.8-2 1.1-2.7-4.8L5.5 18z" />,
  _default: <path d="M12 3.5 20.5 12 12 20.5 3.5 12z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />,
};

export const normalizeTech = (name) => name.trim().toLowerCase().replace(/\.js$/, '').replace(/\s+/g, ' ');

const TechIcon = ({ name, size = 12 }) => {
  const icon = TECH_ICONS[normalizeTech(name)] || TECH_ICONS._default;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
      style={{ flexShrink: 0, color: 'inherit' }}
    >
      {icon}
    </svg>
  );
};

export default TechIcon;
