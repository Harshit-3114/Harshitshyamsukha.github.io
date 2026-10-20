import { useEffect } from 'react';

/**
 * Observes every `.reveal` element inside the app and adds `.is-visible`
 * when it enters the viewport. Re-runs whenever `deps` change so that
 * content remounted by a tab switch is re-observed.
 *
 * Uses IntersectionObserver (never a window 'scroll' listener) so it
 * never triggers layout thrash on mobile.
 */
export default function useRevealObserver(deps = []) {
  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal');
    if (!nodes.length) return;

    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach((n) => n.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    );

    nodes.forEach((n) => {
      if (!n.classList.contains('is-visible')) io.observe(n);
    });

    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
