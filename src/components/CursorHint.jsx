import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Small tags that pop up beside the cursor and follow it: a boast over my name, and short labels on the
// site's buttons and links. Same look as the homepage card VIEW tag (CursorTag). Ported from the
// Creationbase site. Mouse users only (App renders it alongside the cross cursor).
//
// What gets a tag, and what it says:
// - data-cursor="..." on any element: exactly that text (wins over everything else).
// - data-boast: a random boast.
// - Buttons and links (TARGETS): picked by their text first, then by kind. Lists pick a random line, a new
//   one each time the cursor arrives.

const BOASTS = [
  'Yes, that’s me',
  'Designs it. Builds it. Ships it.',
  'Figma to production, no handoff',
  'Pixel-perfect, on purpose',
  'Probably your next hire',
  'Taste: excellent',
  'Built different',
  'Best in Boise. Fight me.',
];

const CONTACT = [
  'Let’s make something good',
  'Your move',
  'I reply fast',
  'Go on, I don’t bite',
];

const GENERIC = ['Go on', 'Do it', 'You know you want to'];

const TARGETS = [
  '[data-cursor]',
  '[data-boast]',
  '.newsletter-button',
  '.footer-links-list a',
  '.mobile-nav-link',
  '.site-nav__home-link',
  '.site-nav__menu-toggle',
].join(', ');

// By the button's own words. First match wins.
const BY_TEXT = [
  [/contact/i, CONTACT],
  [/copy email|email copied/i, ['Straight to your clipboard']],
  [/github/i, ['Read the code']],
  [/linkedin/i, ['Let’s connect']],
  [/instagram/i, ['Behind the scenes']],
  [/resume/i, ['The short version']],
  [/brand design/i, ['Logos, systems, identity']],
  [/ui\/ux design/i, ['Products people enjoy']],
  [/^\s*about\s*$/i, ['Who I am']],
];

const pick = (list, avoid) => {
  if (list.length === 1) return list[0];
  let s = list[Math.floor(Math.random() * list.length)];
  if (s === avoid) s = list[(list.indexOf(s) + 1) % list.length];
  return s;
};

const labelFor = (el, last) => {
  if (el.hasAttribute('data-cursor')) return el.getAttribute('data-cursor');
  if (el.hasAttribute('data-boast')) return pick(BOASTS, last);
  if (el.matches('.site-nav__home-link')) return 'Home';
  if (el.matches('.site-nav__menu-toggle')) return el.getAttribute('aria-expanded') === 'true' ? 'Close it' : 'Everything’s in here';
  const text = el.textContent || '';
  const hit = BY_TEXT.find(([re]) => re.test(text));
  if (hit) return pick(hit[1], last);
  if (el.matches('a[target="_blank"]')) return 'Opens in a new tab';
  return pick(GENERIC, last);
};

const OFFSET = 16;

const CursorHint = () => {
  const ref = useRef(null);
  const [line, setLine] = useState(null);
  const lastLine = useRef(null);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { damping: 28, stiffness: 420, mass: 0.25 });
  const sy = useSpring(y, { damping: 28, stiffness: 420, mass: 0.25 });

  useEffect(() => {
    let current = null; // the tagged element under the cursor

    const place = (ev, jump) => {
      const tag = ref.current;
      const w = tag?.offsetWidth || 0;
      const h = tag?.offsetHeight || 0;
      // Flip to the left / above near the window edge so the tag never runs off screen.
      const nx = ev.clientX + OFFSET + w > window.innerWidth - 8 ? ev.clientX - OFFSET - w : ev.clientX + OFFSET;
      const ny = ev.clientY + OFFSET + h > window.innerHeight - 8 ? ev.clientY - OFFSET - h : ev.clientY + OFFSET;
      x.set(nx);
      y.set(ny);
      if (jump) { sx.jump(nx); sy.jump(ny); }
    };

    // Checked on every move rather than on pointerover, so the tag comes back after a scroll or click
    // hides it as soon as the cursor moves again.
    const onMove = (ev) => {
      const hit = ev.target instanceof Element ? ev.target.closest(TARGETS) : null;
      if (hit && hit.matches(':disabled')) { current = null; setLine(null); return; }
      if (hit === current) { if (hit) place(ev, false); return; }
      current = hit;
      if (!hit) { setLine(null); return; }
      const next = labelFor(hit, lastLine.current);
      lastLine.current = next;
      setLine(next);
      // Size the tag for its new text before placing it, so the edge flip uses the right width.
      requestAnimationFrame(() => place(ev, true));
    };
    const hide = () => { current = null; setLine(null); };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', hide, { passive: true });
    document.addEventListener('mouseleave', hide);
    window.addEventListener('scroll', hide, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', hide);
      document.removeEventListener('mouseleave', hide);
      window.removeEventListener('scroll', hide);
    };
  }, [x, y, sx, sy]);

  return (
    <motion.span
      ref={ref}
      className="cursor-tag cursor-tag--hint"
      style={{ x: sx, y: sy, opacity: line ? 1 : 0 }}
      aria-hidden="true"
    >
      {line}
    </motion.span>
  );
};

export default CursorHint;
