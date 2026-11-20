import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// A small label that trails the pointer, kept inside its card. Put it anywhere inside the element it
// should track (matched by `within`); it positions itself relative to that element and never leaves it.
// Touch screens have no hover, so they keep a plain centered chip instead.

const OFFSET = 16; // sits down-right of the pointer so the cross cursor stays visible

const CursorTag = ({ label, within }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { damping: 28, stiffness: 420, mass: 0.25 });
  const sy = useSpring(y, { damping: 28, stiffness: 420, mass: 0.25 });

  useEffect(() => {
    const tag = ref.current;
    const area = tag?.closest(within);
    if (!tag || !area) return undefined;

    const place = (ev, jump) => {
      const box = area.getBoundingClientRect();
      const w = tag.offsetWidth;
      const h = tag.offsetHeight;
      const nx = Math.min(Math.max(ev.clientX - box.left + OFFSET, 8), box.width - w - 8);
      const ny = Math.min(Math.max(ev.clientY - box.top + OFFSET, 8), box.height - h - 8);
      x.set(nx);
      y.set(ny);
      // Entering: start at the pointer rather than sliding in from the last spot.
      if (jump) { sx.jump(nx); sy.jump(ny); }
    };
    const onEnter = (ev) => place(ev, true);
    const onMove = (ev) => place(ev, false);
    area.addEventListener('pointerenter', onEnter);
    area.addEventListener('pointermove', onMove);
    return () => {
      area.removeEventListener('pointerenter', onEnter);
      area.removeEventListener('pointermove', onMove);
    };
  }, [within, x, y, sx, sy]);

  return (
    <motion.span ref={ref} className="cursor-tag" style={{ x: sx, y: sy }} aria-hidden="true">
      {label}
    </motion.span>
  );
};

export default CursorTag;
