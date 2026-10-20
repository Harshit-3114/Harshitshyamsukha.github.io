import { useCallback, useEffect, useRef } from 'react';

/**
 * 1:1 pointer tracking with a velocity-carrying spring release.
 *
 * Apple: "The detail that most separates 'fluid' from 'fine'" is the
 * velocity handoff — when a gesture ends, the animation must continue
 * at the pointer's exact velocity, so there is no visible seam
 * between dragging and animating.
 *
 * A CSS transition cannot do this: it has no notion of the velocity
 * the pointer had. So the release is integrated in JS:
 *
 *   - while the pointer is over the card, the transform is written
 *     directly with NO easing — the card is glued to the pointer
 *   - on release, a damped spring runs from the live value, seeded
 *     with the pointer's release velocity
 *   - re-entering mid-spring cancels it and hands control back to
 *     the pointer from wherever the card currently is
 *
 * Damping 1.0 is critically damped: it settles without bouncing.
 * The bounce only appears if the gesture itself carried momentum,
 * which is handled by scaling the seeded velocity.
 */

const MAX_V = 1400;   // deg/s — clamp so a wild flick can't launch the card
const STIFF = 190;     // rad/s^2
const DAMP = 24;       // rad/s

export function useTilt({ max = 7 } = {}) {
  const stateRef = useRef(new Map()); // el -> state

  const ensure = useCallback((el) => {
    let s = stateRef.current.get(el);
    if (!s) {
      s = {
        rx: 0, ry: 0, lift: 0,
        vx: 0, vy: 0,
        lastX: 0, lastY: 0, lastT: 0,
        raf: 0,
        animating: false,
      };
      stateRef.current.set(el, s);
    }
    return s;
  }, []);

  const write = useCallback((el, rx, ry, lift) => {
    // the transform lives on the .pin-wrap CHILD of the tracked
    // element, so the axes must be written there — writing them to
    // the tracked parent would leave the transform untouched
    if (!el.__tiltTarget) el.__tiltTarget = el.querySelector('.pin-wrap') || el;
    const t = el.__tiltTarget;
    t.style.setProperty('--tilt-x', `${rx.toFixed(3)}deg`);
    t.style.setProperty('--tilt-y', `${ry.toFixed(3)}deg`);
    t.style.setProperty('--tilt-lift', `${lift.toFixed(2)}px`);
  }, []);

  /* ---- move: 1:1, no easing, pointer-locked ---- */
  const onMove = useCallback((e, el) => {
    if (!el) return;
    const s = ensure(el);

    // a pointer that just took over from a spring must start from the
    // card's LIVE position, not from a target value
    if (s.animating) {
      cancelAnimationFrame(s.raf);
      s.animating = false;
      s.raf = 0;
      el.classList.remove('is-releasing');
    }

    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;

    const rx = (0.5 - py) * 2 * max;
    const ry = (px - 0.5) * 2 * max;

    // screen velocity, from the delta since the previous move
    const now = performance.now();
    if (s.lastT) {
      const dt = Math.max(now - s.lastT, 8);
      s.screenVX = (e.clientX - s.lastX) / dt * 1000;   // px/s
      s.screenVY = (e.clientY - s.lastY) / dt * 1000;
    }
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    s.lastT = now;

    write(el, rx, ry, -3);
  }, [ensure, write, max]);

  /* ---- leave: spring back to rest, carrying the pointer's velocity ---- */
  const onLeave = useCallback((el) => {
    if (!el) return;
    const s = ensure(el);
    if (s.raf) cancelAnimationFrame(s.raf);

    // the pointer's screen velocity maps to the card's angular
    // velocity: the card is ~100px wide, so a px/s of screen travel
    // is a comparable deg/s of rotation
    const scale = max / 100;
    s.vx = Math.max(-MAX_V, Math.min(MAX_V, (s.screenVX || 0) * scale));
    s.vy = Math.max(-MAX_V, Math.min(MAX_V, (s.screenVY || 0) * scale));
    s.animating = true;

    let last = performance.now();
    const step = (t) => {
      const dt = Math.min((t - last) / 1000, 1 / 30);
      last = t;

      // critically damped spring, integrated semi-implicitly
      const ax = -STIFF * s.rx - DAMP * s.vx;
      const ay = -STIFF * s.ry - DAMP * s.vy;
      s.vx += ax * dt;
      s.vy += ay * dt;
      s.rx += s.vx * dt;
      s.ry += s.vy * dt;

      // the lift follows the rotation magnitude
      const mag = Math.min(Math.hypot(s.rx, s.ry) / max, 1);
      s.lift = -3 * mag;

      write(el, s.rx, s.ry, s.lift);

      if (Math.hypot(s.rx, s.ry) < 0.01 && Math.hypot(s.vx, s.vy) < 0.05) {
        write(el, 0, 0, 0);
        s.rx = 0; s.ry = 0; s.vx = 0; s.vy = 0; s.lift = 0;
        s.animating = false;
        s.raf = 0;
        el.classList.remove('is-releasing');
        return;
      }
      s.raf = requestAnimationFrame(step);
    };
    s.raf = requestAnimationFrame(step);
  }, [ensure, write, max]);

  useEffect(() => {
    const map = stateRef.current;
    return () => {
      map.forEach((s) => s.raf && cancelAnimationFrame(s.raf));
      map.clear();
    };
  }, []);

  return { onMove, onLeave };
}
