import React, { useEffect, useRef } from 'react';

/**
 * THE WEATHER FIELD — the air, rendered.
 *
 * The ambience engine decides the LIGHT; this decides what is moving
 * through it. Each kind gets the treatment it deserves rather than a
 * generic particle effect:
 *
 *   storm    heavy slanted rain, wind gusts, branching lightning and
 *            a flash that lights the whole page, plus splashes where
 *            the drops land
 *   rain     steady rain with a slant and ground splashes
 *   drizzle  a fine mist, almost too small to notice
 *   snow     flakes of different sizes drifting at different speeds,
 *            with frost gathering at the bottom of the frame
 *   fog      soft banks of vapour sliding over each other
 *   wind     dust and grit tearing sideways in gusts
 *   cloud    slow, enormous shadows crossing the page
 *   clear    warm motes in the light and a low sun bloom
 *
 * It is a canvas rather than DOM nodes because a hundred falling
 * things must not cost a hundred layout passes. It is capped by
 * viewport area, it pauses when the tab is hidden, and it does not
 * run at all when the visitor has asked for reduced motion.
 */

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const rand = (a, b) => a + Math.random() * (b - a);

function makeField(kind, w, h) {
  const area = (w * h) / 1_000_000;
  const list = [];

  if (kind === 'rain' || kind === 'storm' || kind === 'drizzle') {
    const heavy = kind === 'storm';
    const fine = kind === 'drizzle';
    let count = fine ? Math.round(50 + area * 60)
      : heavy ? Math.round(150 + area * 190)
        : Math.round(90 + area * 120);
    count = Math.min(count, 420);
    for (let i = 0; i < count; i++) {
      list.push({
        x: rand(-w * 0.15, w),
        y: rand(-h, h),
        len: fine ? rand(3, 7) : heavy ? rand(16, 34) : rand(9, 20),
        v: fine ? rand(5, 9) : heavy ? rand(15, 24) : rand(10, 16),
        w: fine ? rand(0.4, 0.7) : rand(0.6, 1.3),
        a: rand(0.1, 0.38),
      });
    }
  } else if (kind === 'snow') {
    const count = Math.min(Math.round(70 + area * 110), 260);
    for (let i = 0; i < count; i++) {
      const depth = Math.random();
      list.push({
        x: rand(0, w),
        y: rand(-h, h),
        r: 0.7 + depth * 2.6,
        v: 0.25 + depth * 0.9,
        sway: rand(0.4, 1.5),
        swaySpeed: rand(0.4, 1.2),
        phase: rand(0, Math.PI * 2),
        a: 0.25 + depth * 0.6,
      });
    }
  } else if (kind === 'fog') {
    const count = Math.min(Math.round(7 + area * 8), 18);
    for (let i = 0; i < count; i++) {
      list.push({
        x: rand(-w * 0.3, w * 1.1),
        y: rand(-h * 0.1, h),
        rx: rand(w * 0.18, w * 0.5),
        ry: rand(h * 0.08, h * 0.24),
        v: rand(0.12, 0.5) * (Math.random() > 0.5 ? 1 : -1),
        a: rand(0.05, 0.16),
      });
    }
  } else if (kind === 'wind') {
    const count = Math.min(Math.round(26 + area * 40), 120);
    for (let i = 0; i < count; i++) {
      list.push({
        x: rand(-w * 0.2, w),
        y: rand(0, h),
        len: rand(14, 70),
        v: rand(2.5, 9),
        r: rand(0.5, 1.6),
        a: rand(0.06, 0.26),
        wob: rand(0, Math.PI * 2),
      });
    }
  } else if (kind === 'cloud') {
    const count = Math.min(Math.round(3 + area * 4), 10);
    for (let i = 0; i < count; i++) {
      list.push({
        x: rand(-w * 0.4, w * 1.2),
        y: rand(-h * 0.2, h),
        rx: rand(w * 0.3, w * 0.7),
        ry: rand(h * 0.12, h * 0.3),
        v: rand(0.1, 0.35) * (Math.random() > 0.5 ? 1 : -1),
        a: rand(0.04, 0.1),
      });
    }
  } else {
    /* clear: warm motes, and a low sun */
    const count = Math.min(Math.round(18 + area * 30), 90);
    for (let i = 0; i < count; i++) {
      list.push({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(0.4, 1.5),
        vx: rand(-0.12, 0.22),
        vy: rand(-0.16, 0.05),
        a: rand(0.06, 0.24),
        wob: rand(0, Math.PI * 2),
      });
    }
  }
  return list;
}

/* a jagged path from the top of the frame down into the clouds */
function makeBolt(w, h) {
  const x0 = rand(w * 0.08, w * 0.92);
  const y0 = -10;
  const y1 = rand(h * 0.22, h * 0.62);
  const pts = [{ x: x0, y: y0 }];
  const steps = 9;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    pts.push({
      x: x0 + rand(-1, 1) * (w * 0.06) * (1 - t * 0.4),
      y: y0 + (y1 - y0) * t,
    });
  }
  return pts;
}

export default function WeatherField({ kind = 'clear', onLightning }) {
  const ref = useRef(null);

  useEffect(() => {
    if (kind === 'clear' && kind === 'cloud') return;   // no field needed
    if (reduced()) return;

    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let parts = [];
    let splashes = [];
    let raf = 0;
    let last = performance.now();
    let running = true;
    let gust = 0;
    let gustPhase = rand(0, 100);

    /* lightning state */
    let bolt = null;
    let boltAge = 0;
    let flash = 0;
    let nextStrike = rand(2200, 7000);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      parts = makeField(kind, w, h);
    };

    resize();
    window.addEventListener('resize', resize);

    const onVisibility = () => {
      running = !document.hidden;
      if (running) { last = performance.now(); raf = requestAnimationFrame(frame); }
      else cancelAnimationFrame(raf);
    };
    document.addEventListener('visibilitychange', onVisibility);

    const strike = () => {
      bolt = makeBolt(w, h);
      boltAge = 0;
      flash = 1;
      /* the thunder arrives later than the light — and later still if
         the strike was far away */
      const distance = rand(0.05, 0.85);
      onLightning?.(distance);
      nextStrike = rand(3200, 11000);
    };

    const frame = (t) => {
      if (!running) return;
      const dt = Math.min((t - last) / 16.67, 3);
      last = t;

      ctx.clearRect(0, 0, w, h);

      /* wind gusts affect rain slant, snow drift and grit speed */
      gustPhase += dt * 0.012;
      const target = 0.5 + Math.sin(gustPhase) * 0.5;
      gust += (target - gust) * 0.04 * dt;

      /* ---------- lightning ---------- */
      if (kind === 'storm') {
        nextStrike -= dt * 16.67;
        if (nextStrike <= 0) strike();
      }
      if (flash > 0) {
        flash -= dt * 0.05;
        const a = Math.max(0, flash);
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, `rgba(226,236,255,${a * 0.42})`);
        g.addColorStop(0.55, `rgba(226,236,255,${a * 0.16})`);
        g.addColorStop(1, 'rgba(226,236,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      if (bolt) {
        boltAge += dt * 16.67;
        const life = 260;
        if (boltAge > life) {
          bolt = null;
        } else {
          const a = 1 - boltAge / life;
          ctx.save();
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          for (const [width, colour] of [[9, 'rgba(150,190,255,0.16)'], [4, 'rgba(200,225,255,0.45)'], [1.6, 'rgba(255,255,255,0.95)']]) {
            ctx.beginPath();
            ctx.moveTo(bolt[0].x, bolt[0].y);
            for (let i = 1; i < bolt.length; i++) ctx.lineTo(bolt[i].x, bolt[i].y);
            ctx.strokeStyle = colour;
            ctx.globalAlpha = a;
            ctx.lineWidth = width;
            ctx.stroke();
          }
          ctx.restore();
        }
      }

      /* ---------- the field ---------- */
      if (kind === 'rain' || kind === 'storm' || kind === 'drizzle') {
        const slant = kind === 'storm' ? 0.24 + gust * 0.5 : kind === 'drizzle' ? 0.1 : 0.16 + gust * 0.14;
        for (const p of parts) {
          p.y += p.v * dt;
          p.x += p.v * slant * dt;
          if (p.y > h) {
            p.y = rand(-30, -4);
            p.x = rand(-w * 0.1, w);
            if (kind !== 'drizzle' && splashes.length < 90) {
              splashes.push({ x: p.x, y: h - rand(0, 6), t: 0 });
            }
          }
          if (p.x > w + 20) p.x = -20;

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.len * slant, p.y + p.len);
          ctx.strokeStyle = `rgba(214,226,240,${p.a + (kind === 'storm' ? 0.16 : 0.08)})`;
          ctx.lineWidth = p.w;
          ctx.stroke();
        }

        /* splashes where the drops land */
        for (let i = splashes.length - 1; i >= 0; i--) {
          const s = splashes[i];
          s.t += dt;
          const life = 22;
          if (s.t > life) { splashes.splice(i, 1); continue; }
          const k = s.t / life;
          ctx.beginPath();
          ctx.ellipse(s.x, s.y, 2 + k * 9, 1 + k * 3, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(214,226,240,${(1 - k) * 0.24})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        if (kind === 'storm') {
          /* a low scud of moving cloud across the bottom */
          const cg = ctx.createLinearGradient(0, h * 0.6, 0, h);
          cg.addColorStop(0, 'rgba(120,134,152,0)');
          cg.addColorStop(1, 'rgba(90,102,120,0.16)');
          ctx.fillStyle = cg;
          ctx.fillRect(0, h * 0.6, w, h * 0.4);
        }
      } else if (kind === 'snow') {
        for (const p of parts) {
          p.phase += 0.014 * p.swaySpeed * dt;
          p.y += p.v * dt;
          p.x += Math.sin(p.phase) * p.sway * dt + gust * 0.5 * dt;
          if (p.y > h) { p.y = -8; p.x = rand(0, w); }
          if (p.x > w + 6) p.x = -6;
          if (p.x < -6) p.x = w + 6;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${p.a})`;
          ctx.fill();
        }
        /* frost gathering along the bottom edge */
        const fg = ctx.createLinearGradient(0, h - 90, 0, h);
        fg.addColorStop(0, 'rgba(226,236,246,0)');
        fg.addColorStop(1, 'rgba(226,236,246,0.34)');
        ctx.fillStyle = fg;
        ctx.fillRect(0, h - 90, w, 90);
      } else if (kind === 'fog') {
        for (const p of parts) {
          p.x += p.v * dt * (0.6 + gust);
          if (p.x - p.rx > w) p.x = -p.rx * 2;
          if (p.x + p.rx < 0) p.x = w + p.rx;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.rx);
          g.addColorStop(0, `rgba(226,230,234,${p.a})`);
          g.addColorStop(1, 'rgba(226,230,234,0)');
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.scale(1, p.ry / p.rx);
          ctx.translate(-p.x, -p.y);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.rx, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = 'rgba(224,228,232,0.14)';
        ctx.fillRect(0, 0, w, h);
      } else if (kind === 'wind') {
        for (const p of parts) {
          p.wob += 0.03 * dt;
          p.x += p.v * (0.4 + gust * 1.8) * dt;
          p.y += Math.sin(p.wob) * 0.22 * dt;
          if (p.x - p.len > w) { p.x = rand(-w * 0.2, 0); p.y = rand(0, h); }
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.len * (0.5 + gust), p.y + Math.sin(p.wob) * 3);
          ctx.strokeStyle = `rgba(190,182,164,${p.a})`;
          ctx.lineWidth = p.r;
          ctx.stroke();
        }
      } else if (kind === 'cloud') {
        for (const p of parts) {
          p.x += p.v * dt * (0.5 + gust * 0.6);
          if (p.x - p.rx > w) p.x = -p.rx * 2;
          if (p.x + p.rx < 0) p.x = w + p.rx;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.rx);
          g.addColorStop(0, `rgba(96,102,112,${p.a})`);
          g.addColorStop(1, 'rgba(96,102,112,0)');
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.scale(1, p.ry / p.rx);
          ctx.translate(-p.x, -p.y);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.rx, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      } else {
        /* clear: motes in the light */
        for (const p of parts) {
          p.wob += 0.02 * dt;
          p.x += (p.vx + Math.sin(p.wob) * 0.14) * dt;
          p.y += p.vy * dt;
          if (p.x < -4) p.x = w + 4;
          if (p.x > w + 4) p.x = -4;
          if (p.y < -4) p.y = h + 4;
          if (p.y > h + 4) p.y = -4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,236,196,${p.a})`;
          ctx.fill();
        }
        /* a low sun bloom in the corner */
        const sx = w * 0.82;
        const sy = h * 0.16;
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, Math.min(w, h) * 0.4);
        sg.addColorStop(0, 'rgba(255,226,168,0.16)');
        sg.addColorStop(1, 'rgba(255,226,168,0)');
        ctx.fillStyle = sg;
        ctx.fillRect(0, 0, w, h);
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [kind, onLightning]);

  if (kind === 'clear' || kind === 'cloud') return null;

  return <canvas className="weather-field" ref={ref} aria-hidden="true" />;
}
