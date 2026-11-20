import { useCallback, useEffect, useRef, useState } from 'react';
import { useIntroDone } from '../intro';

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*+-=?<>[]{}';

function isScrambleChar(char) {
  return /[A-Za-z0-9]/.test(char);
}

function scrambleText(text, revealCount) {
  let revealed = 0;

  return text
    .split('')
    .map((char) => {
      if (!isScrambleChar(char)) return char;
      if (revealed < revealCount) {
        revealed += 1;
        return char;
      }
      return CHARSET[Math.floor(Math.random() * CHARSET.length)];
    })
    .join('');
}

export default function DecryptText({
  as: Tag = 'span',
  text,
  trigger = 'mount',
  playKey,
  delay = 0,
  duration = 700,
  threshold = 0.4,
  className,
  style,
}) {
  const [displayText, setDisplayText] = useState(text);
  const elementRef = useRef(null);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const hasAnimatedInViewRef = useRef(false);
  // Hold every decrypt until the homepage load intro has finished (immediately true when it doesn't play).
  const introDone = useIntroDone();

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const runAnimation = useCallback(() => {
    clearTimers();

    const totalScrambleChars = text.split('').filter(isScrambleChar).length;
    if (totalScrambleChars === 0) {
      setDisplayText(text);
      return;
    }

    const stepMs = 32;
    const steps = Math.max(10, Math.ceil(duration / stepMs));
    let frame = 0;

    setDisplayText(scrambleText(text, 0));

    intervalRef.current = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / steps, 1);
      const revealCount = Math.floor(totalScrambleChars * progress);

      if (progress >= 1) {
        clearTimers();
        setDisplayText(text);
        return;
      }

      setDisplayText(scrambleText(text, revealCount));
    }, stepMs);
  }, [clearTimers, duration, text]);

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  useEffect(() => {
    if (trigger !== 'mount' || !introDone) return undefined;

    timeoutRef.current = window.setTimeout(runAnimation, delay);

    return clearTimers;
  }, [clearTimers, delay, introDone, runAnimation, text, trigger]);

  useEffect(() => {
    if (trigger !== 'manual' || playKey == null) return undefined;

    timeoutRef.current = window.setTimeout(runAnimation, delay);

    return clearTimers;
  }, [clearTimers, delay, playKey, runAnimation, text, trigger]);

  useEffect(() => {
    if (trigger !== 'inView' || !introDone) return undefined;
    const node = elementRef.current;
    if (!node || hasAnimatedInViewRef.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimatedInViewRef.current) return;
        hasAnimatedInViewRef.current = true;
        timeoutRef.current = window.setTimeout(runAnimation, delay);
        observer.disconnect();
      },
      { threshold }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      clearTimers();
    };
  }, [clearTimers, delay, introDone, runAnimation, text, threshold, trigger]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return (
    <Tag ref={elementRef} className={className} style={style}>
      {displayText}
    </Tag>
  );
}
