import { useEffect, useRef } from 'react';

const GITHUB_USERNAME = 'forresttindall';
const CALENDAR_SCRIPT_SRC = '/github-calendar.js';

function loadCalendarScript() {
  if (typeof window.GitHubCalendar === 'function') return Promise.resolve();

  const existing = document.querySelector(`script[src="${CALENDAR_SCRIPT_SRC}"]`);
  if (existing) {
    return new Promise((resolve) => {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', resolve, { once: true });
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = CALENDAR_SCRIPT_SRC;
    script.async = true;
    script.addEventListener('load', resolve, { once: true });
    script.addEventListener('error', resolve, { once: true });
    document.head.appendChild(script);
  });
}

export default function ActivityCalendar() {
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    loadCalendarScript().then(() => {
      const node = containerRef.current;
      if (cancelled || !node) return;
      if (typeof window.GitHubCalendar !== 'function') return;
      node.innerHTML = '';
      window.GitHubCalendar(node, GITHUB_USERNAME, {
        responsive: true,
        // GitHub's markup no longer exposes .js-calendar-graph-svg or data-count,
        // so github-calendar.js cannot bind tooltip handlers.
        tooltips: false,
        global_stats: false,
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // The graph is a table with fixed-size cells, so stretching it to 100% would
  // distort them. Instead scale the whole graph uniformly to fill the panel.
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    let frame = 0;
    let lastAvailableWidth = 0;

    const fitGraphToPanel = () => {
      frame = 0;

      const table = node.querySelector('table.js-calendar-graph-table');
      const track = table ? table.parentElement : null;
      if (!table || !track) return;

      const availableWidth = track.getBoundingClientRect().width;
      if (!availableWidth || Math.abs(availableWidth - lastAvailableWidth) < 0.5) return;

      table.style.zoom = '1';
      const naturalWidth = table.getBoundingClientRect().width;
      table.style.zoom = '';
      if (!naturalWidth) return;

      lastAvailableWidth = availableWidth;
      // Shave a hair off so sub-pixel rounding can't trigger an overflow scrollbar.
      table.style.zoom = String(Math.max(availableWidth - 1, 0) / naturalWidth);
    };

    const scheduleFit = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(fitGraphToPanel);
    };

    const mutationObserver = new MutationObserver(scheduleFit);
    mutationObserver.observe(node, { childList: true, subtree: true });

    const resizeObserver = new ResizeObserver(scheduleFit);
    resizeObserver.observe(node);

    scheduleFit();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      mutationObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  return <div className="calendar" ref={containerRef} />;
}
