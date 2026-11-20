import { useEffect, useRef, useState } from 'react';
import GrainBackdrop from './GrainBackdrop';
import { finishIntro, introActive } from '../intro';

// Homepage load intro: a dark, moving grain screen that types my name and a dictionary-style entry for
// it, holds for a beat, then fades to the page, which is when the hero title decrypts. Ported from the
// Creationbase site.
// Plays once per session (see src/intro.js). A click, tap or key press skips it.

const WORD = 'FORREST TINDALL';
const LINES = [
  'for·rest tin·dall  |  /ˈfɔːr.ɪst ˈtɪn.dəl/  |  noun',
  '1. Senior Design Engineer.',
];

const WORD_MS = 55; // per letter of the wordmark
const LINE_MS = 12; // per character of the definition
const PAUSE_MS = 220; // between lines
const HOLD_MS = 1300; // pause after the last character, before the site loads in
const TEXT_OUT_MS = 380; // the type fades and lifts away first...
const FADE_MS = 1000; // ...then the grain dissolves into the page

const IntroLoader = () => {
  const [show, setShow] = useState(introActive);
  const [word, setWord] = useState('');
  const [lines, setLines] = useState(() => LINES.map(() => ''));
  const [typingLine, setTypingLine] = useState(-1); // -1: still on the wordmark
  const [phase, setPhase] = useState('typing'); // typing -> text-out -> leaving
  const timers = useRef([]);

  useEffect(() => {
    if (!show) return undefined;
    const later = (fn, ms) => { timers.current.push(window.setTimeout(fn, ms)); };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Two steps, so the handoff reads as one motion: the type clears, then the grain dissolves and the
    // page decrypts in underneath it. Opacity and transform only, which the browser composites cheaply.
    const leave = (fast = false) => {
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
      setPhase('text-out');
      later(() => {
        setPhase('leaving');
        finishIntro(); // the page starts its decrypts as the grain fades
        later(() => {
          document.body.style.overflow = prevOverflow;
          setShow(false);
        }, FADE_MS);
      }, fast ? 120 : TEXT_OUT_MS - 120);
    };

    // Build the typing schedule: wordmark letter by letter, then each line character by character.
    let t = 350;
    for (let i = 1; i <= WORD.length; i += 1) {
      const n = i;
      later(() => setWord(WORD.slice(0, n)), t);
      t += WORD_MS;
    }
    LINES.forEach((line, li) => {
      t += PAUSE_MS;
      later(() => setTypingLine(li), t);
      for (let i = 1; i <= line.length; i += 1) {
        const n = i;
        later(() => setLines((prev) => prev.map((v, k) => (k === li ? line.slice(0, n) : v))), t);
        t += LINE_MS;
      }
    });
    later(() => setTypingLine(LINES.length), t);
    later(() => { skipped = true; leave(); }, t + HOLD_MS);

    let skipped = false;
    const skip = () => { if (!skipped && timers.current.length) { skipped = true; leave(true); } };
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);

    return () => {
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
      document.body.style.overflow = prevOverflow;
    };
  }, [show]);

  if (!show) return null;

  const cursor = <span className="intro__cursor" aria-hidden="true" />;

  return (
    <div className={`intro is-${phase}`} role="presentation" aria-hidden="true">
      <GrainBackdrop rotation={160} speed={1} playDuringIntro />
      <div className="intro__content">
        {/* Centered on screen, fixed width so it doesn't shift as it types; text left-aligned inside. */}
        <div className="intro__block">
        <div className="intro__word">
          {word}
          {typingLine === -1 && cursor}
        </div>
        <div className="intro__def">
          {LINES.map((line, i) => (
            <p key={line} className="intro__line">
              {lines[i]}
              {typingLine === i && cursor}
            </p>
          ))}
        </div>
        </div>
        <span className="intro__skip">Click or press any key to skip</span>
      </div>

      <style>{`
        .intro {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: #111111;
          color: #9a9a96;
          transition: opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1);
          will-change: opacity;
          cursor: default;
        }
        .intro.is-leaving { opacity: 0; pointer-events: none; }
        .intro__content { transition: opacity ${TEXT_OUT_MS}ms ease, transform ${TEXT_OUT_MS}ms cubic-bezier(0.4, 0, 1, 1); }
        .intro.is-text-out .intro__content,
        .intro.is-leaving .intro__content { opacity: 0; transform: translateY(-10px); }
        .intro__content {
          position: absolute;
          inset: 0;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 20px;
        }
        .intro__block {
          width: min(62ch, 100%);
          display: grid;
          gap: 14px;
          text-align: left;
          font-family: var(--font-mono);
          font-size: clamp(13px, 1.25vw, 16px);
          line-height: 1.5;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .intro__word {
          min-height: 1.5em;
          font-weight: var(--font-mono-weight-bold);
          color: #b0b0ab;
          white-space: nowrap;
        }
        .intro__def { display: grid; gap: 4px; }
        .intro__line {
          min-height: 1.5em;
          margin: 0;
          font-weight: var(--font-mono-weight);
        }
        .intro__cursor {
          display: inline-block;
          width: 0.55em;
          height: 1em;
          margin-left: 0.08em;
          vertical-align: -0.12em;
          background: currentColor;
          animation: intro-blink 0.9s steps(1) infinite;
        }
        .intro__skip {
          position: absolute;
          right: 20px;
          bottom: 20px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #5c5c59;
        }
        @keyframes intro-blink { 50% { opacity: 0; } }
        @media (hover: none) { .intro__skip::before { content: 'Tap to skip'; } .intro__skip { font-size: 0; } .intro__skip::before { font-size: 10px; } }
      `}</style>
    </div>
  );
};

export default IntroLoader;
