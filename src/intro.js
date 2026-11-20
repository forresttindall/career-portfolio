import { useEffect, useState } from 'react';

// The homepage load intro (IntroLoader) and everything that should wait for it, chiefly the decrypt
// animations, share this gate. Decided once, when the app first loads:
// plays only when the first page is the homepage, once per browser session, and never for people who
// prefer reduced motion.

const SEEN_KEY = 'ft-intro-seen';

const decide = () => {
  if (typeof window === 'undefined') return false;
  if (window.location.pathname !== '/') return false;
  // /?intro always replays the intro (ignores the once-per-session rule), for previewing it.
  if (new URLSearchParams(window.location.search).has('intro')) return true;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    if (window.sessionStorage.getItem(SEEN_KEY)) return false;
    window.sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Storage blocked: still play once for this page load.
  }
  return true;
};

let active = decide();
const listeners = new Set();

export const introActive = () => active;

export const finishIntro = () => {
  if (!active) return;
  active = false;
  listeners.forEach((fn) => fn());
  listeners.clear();
};

// true once the intro is over (or never played). Components wait on this before animating.
export const useIntroDone = () => {
  const [done, setDone] = useState(!active);
  useEffect(() => {
    if (!active) {
      setDone(true);
      return undefined;
    }
    const fn = () => setDone(true);
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, []);
  return done;
};
