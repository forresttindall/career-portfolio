import { useEffect, useRef, useState } from 'react';

// Muted, looping video that only downloads when it scrolls near the viewport and pauses when it
// leaves. Unlike <img loading="lazy">, browsers start fetching autoplay videos immediately, so a
// video far down the page would otherwise compete with the first paint.
const LazyVideo = ({ src, poster, alt, className, style, rootMargin = '300px' }) => {
  const ref = useRef(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          el.play?.().catch(() => {});
        } else if (!el.paused) {
          el.pause();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <video
      ref={ref}
      src={near ? src : undefined}
      poster={poster}
      aria-label={alt}
      className={className}
      style={style}
      autoPlay={near}
      muted
      loop
      playsInline
      preload={near ? 'auto' : 'none'}
    />
  );
};

export default LazyVideo;
