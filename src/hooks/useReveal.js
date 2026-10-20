import { useEffect, useRef, useState } from 'react';

/* ============================================================
   USE REVEAL — IntersectionObserver-driven scroll interpolation
   Never binds to window 'scroll' (avoids per-frame reflow).
   ============================================================ */
export function useReveal(options = {}) {
  const { threshold = 0.12, rootMargin = '0px 0px -8% 0px', once = true } = options;
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver (very old browsers): show content immediately.
    if (typeof IntersectionObserver === 'undefined') {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) io.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, visible];
}
