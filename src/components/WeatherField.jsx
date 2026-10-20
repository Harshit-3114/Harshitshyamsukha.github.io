import React, { useEffect, useRef } from 'react';

/**
 * THE WEATHER FIELD — the air, rendered.
 *
 * The ambience engine decides the LIGHT; this decides what is moving
 * through it. Each kind gets the treatment it deserves rather than a
 * generic particle effect:
 *
 *   storm    heavy slanted rain, a low scud of cloud, branching
 *            lightning, a flash that lights the whole page, and drops
 *            landing
 *   rain     a sky full of cloud, steady rain with a slant, splashes
 *   drizzle  a fine mist under a soft, low sky
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
 *
 * The colours come from CSS custom properties that flip with the
 * theme, because a light-blue rain streak is invisible on cream
 * paper and a dark one is invisible in the Void.
 */

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const rand = (a, b) => a + Math.random() * (b - a);

function readPalette() {
  const s = getComputedStyle(document.documentElement);
  const get = (name, fallback) => (s.getPropertyValue(name).trim() || fallback);
  return {
    ink: get('--weather-rgb', '74, 96, 120'),
    fog: get('--weather-fog-rgb', '152, 164, 176'),
    cloud: get('--weather-cloud-rgb', '92, 100, 114'),
    sun: get('--weather-sun-rgb', '255, 224, 160'),
  };
}

function makeDrops(kind, w, h) {
  const area = (w * h) / 1_000_000;
  const heavy = kind === 'storm';
  const fine = kind === 'drizzle';
  let count = fine ? Math.round(60 + area * 70)
    : heavy ? Math.round(170 + area * 220)
      : Math.round(110 + area * 150);
  count = Math.min(count, 460);

  const list = [];
  for (let i = 0; i < count; i++) {
    list.push({
      x: rand(-w * 0.15, w),
      y: rand(-h, h),
      len: fine ? rand(4, 9) : heavy ? rand(18, 38) : rand(11, 24),
      v: fine ? rand(5, 9) : heavy ? rand(16, 26) : rand(11, 18),
      w: fine ? rand(0.5, 0.9) : rand(0.7, 1.5),
      a: rand(0.24, 0.6),
    });
  }
  return list;
}

function makeSnow(w, h) {
  const area = (w * h) / 1_000_000;
  const count = Math.min(Math.round(80 + area * 120), 280);
  const list = [];
  for (let i = 0; i < count; i++) {
    const depth = Math.random();
    list.push({
      x: rand(0, w),
      y: rand(-h, h),
      r: 0.7 + depth * 2.8,
      v: 0.25 + depth * 0.9,
      sway: rand(0.4, 1.5),
      swaySpeed: rand(0.4, 1.2),
      phase: rand(0, Math.PI * 2),
      a: 0.35 + depth * 0.6,
    });
  }
  return list;
}

/** The sky: banks of cloud drifting across the frame. */
function makeClouds(kind, w, h) {
  const heavy = kind === 'storm';
  const fine = kind === 'drizzle';
  const count = heavy ? 16 : fine ? 9 : 13;
  const list = [];
  for (let i = 0; i < count; i++) {
    list.push({
      x: rand(-w * 0.5, w * 1.3),
      /* the sky is heaviest overhead and breaks up toward the horizon */
      y: rand(-h * 0.22, h * (heavy ? 0.5 : 0.34)),
      rx: rand(w * 0.14, w * 0.4),
      ry: rand(h * 0.045, h * 0.12),
      v: rand(0.16, 0.55) * (heavy ? 2.4 : 1),
      a: heavy ? rand(0.26, 0.42) : fine ? rand(0.1, 0.2) : rand(0.16, 0.3),
      puffs: 4 + Math.floor(Math.random() * 4),
      seed: Math.random() * Math.PI * 2,
    });
  }
  return list;
}

function makeFog(w, h) {
  const area = (w * h) / 1_000_000;
  const count = Math.min(Math.round(7 + area * 8), 18);
  const list = [];
  for (let i = 0; i < count; i++) {
    list.push({
      x: rand(-w * 0.3, w * 1.1),
      y: rand(-h * 0.1, h),
      rx: rand(w * 0.18, w * 0.5),
      ry: rand(h * 0.08, h * 0.24),
      v: rand(0.12, 0.5) * (Math.random() > 0.5 ? 1 : -1),
      a: rand(0.07, 0.2),
    });
  }
  return list;
}

function makeGrit(w, h) {
  const area = (w * h) / 1_000_000;
  const count = Math.min(Math.round(26 + area * 40), 120);
  const list = [];
  for (let i = 0; i < count; i++) {
    list.push({
      x: rand(-w * 0.2, w),
      y: rand(0, h),
      len: rand(14, 70),
      v: rand(2.5, 9),
      r: rand(0.5, 1.6),
      a: rand(0.1, 0.34),
      wob: rand(0, Math.PI * 2),
    });
  }
  return list;
}

function makeMotes(w, h) {
  const area = (w * h) / 1_000_000;
  const count = Math.min(Math.round(18 + area * 30), 90);
  const list = [];
  for (let i = 0; i < count; i++) {
    list.push({
      x: rand(0, w), y: rand(0, h),
      r: rand(0.4, 1.5),
      vx: rand(-0.12, 0.22), vy: rand(-0.16, 0.05),
      a: rand(0.08, 0.3),
      wob: rand(0, Math.PI * 2),
    });
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
    if (kind === 'clear') return;
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
    let frameCount = 0;
    let pal = readPalette();

    let clouds = [];
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

      if (kind === 'rain' || kind === 'storm' || kind === 'drizzle') {
        parts = makeDrops(kind, w, h);
        clouds = makeClouds(kind, w, h);
      } else if (kind === 'snow') {
        parts = makeSnow(w, h);
      } else if (kind === 'fog') {
        parts = makeFog(w, h);
      } else if (kind === 'wind') {
        parts = makeGrit(w, h);
      } else if (kind === 'cloud') {
        parts = makeFog(w, h);
        clouds = makeClouds('cloud', w, h);
      } else {
        parts = makeMotes(w, h);
      }
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
      const distance = rand(0.05, 0.85);
      onLightning?.(distance);
      nextStrike = rand(3200, 11000);
    };

    const frame = (t) => {
      if (!running) return;
      const dt = Math.min((t - last) / 16.67, 3);
      last = t;
      frameCount++;

      /* the palette can change under us — the Void flips it */
      if (frameCount % 30 === 0) pal = readPalette();

      ctx.clearRect(0, 0, w, h);

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
        g.addColorStop(0, `rgba(226,236,255,${a * 0.46})`);
        g.addColorStop(0.55, `rgba(226,236,255,${a * 0.18})`);
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
          for (const [width, colour] of [[10, 'rgba(150,190,255,0.18)'], [4, 'rgba(200,225,255,0.5)'], [1.8, 'rgba(255,255,255,0.98)']]) {
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

      /* ---------- the sky ---------- */
      if (clouds.length) {
        /* the ceiling — an overcast sky is not just a few blobs, it is
           a lid. This is the part that makes it read as weather. */
        const lid = ctx.createLinearGradient(0, 0, 0, h * 0.75);
        lid.addColorStop(0, `rgba(${pal.cloud}, ${kind === 'storm' ? 0.3 : kind === 'drizzle' ? 0.12 : 0.2})`);
        lid.addColorStop(0.45, `rgba(${pal.cloud}, ${kind === 'storm' ? 0.12 : 0.05})`);
        lid.addColorStop(1, `rgba(${pal.cloud}, 0)`);
        ctx.fillStyle = lid;
        ctx.fillRect(0, 0, w, h * 0.75);

        for (const c of clouds) {
          c.x += c.v * dt;
          if (c.x - c.rx > w) c.x = -c.rx * 2;
          if (c.x + c.rx < 0) c.x = w + c.rx;
          for (let p = 0; p < c.puffs; p++) {
            const spread = (p - (c.puffs - 1) / 2);
            const px = c.x + spread * c.rx * 0.36;
            const py = c.y + Math.sin(c.seed + p * 1.9) * c.ry * 0.55 - Math.abs(spread) * c.ry * 0.18;
            const pr = c.rx * (0.3 + 0.14 * Math.abs(Math.sin(c.seed + p * 2.3)));
            const g = ctx.createRadialGradient(px, py - pr * 0.2, 0, px, py, pr);
            g.addColorStop(0, `rgba(${pal.cloud}, ${c.a})`);
            g.addColorStop(0.55, `rgba(${pal.cloud}, ${c.a * 0.55})`);
            g.addColorStop(1, `rgba(${pal.cloud}, 0)`);
            ctx.save();
            ctx.translate(px, py);
            ctx.scale(1, c.ry / c.rx * 1.5);
            ctx.translate(-px, -py);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(px, py, pr, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      /* ---------- the field ---------- */
      if (kind === 'rain' || kind === 'storm' || kind === 'drizzle') {
        const slant = kind === 'storm' ? 0.26 + gust * 0.55 : kind === 'drizzle' ? 0.12 : 0.18 + gust * 0.16;
        for (const p of parts) {
          p.y += p.v * dt;
          p.x += p.v * slant * dt;
          if (p.y > h) {
            p.y = rand(-30, -4);
            p.x = rand(-w * 0.1, w);
            if (kind !== 'drizzle' && splashes.length < 110) {
              splashes.push({ x: p.x, y: h - rand(0, 6), t: 0 });
            }
          }
          if (p.x > w + 20) p.x = -20;

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.len * slant, p.y + p.len);
          ctx.strokeStyle = `rgba(${pal.ink}, ${p.a})`;
          ctx.lineWidth = p.w;
          ctx.stroke();
        }

        for (let i = splashes.length - 1; i >= 0; i--) {
          const s = splashes[i];
          s.t += dt;
          const life = 22;
          if (s.t > life) { splashes.splice(i, 1); continue; }
          const k = s.t / life;
          ctx.beginPath();
          ctx.ellipse(s.x, s.y, 2 + k * 10, 1 + k * 3, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${pal.ink}, ${(1 - k) * 0.4})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        /* the light under the cloud is colder and flatter */
        const cool = ctx.createLinearGradient(0, 0, 0, h);
        cool.addColorStop(0, `rgba(${pal.cloud}, 0.16)`);
        cool.addColorStop(0.5, `rgba(${pal.cloud}, 0.05)`);
        cool.addColorStop(1, `rgba(${pal.cloud}, 0)`);
        ctx.fillStyle = cool;
        ctx.fillRect(0, 0, w, h);
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
          ctx.fillStyle = `rgba(${pal.fog}, ${p.a})`;
          ctx.fill();
        }
        const fg = ctx.createLinearGradient(0, h - 90, 0, h);
        fg.addColorStop(0, `rgba(${pal.fog}, 0)`);
        fg.addColorStop(1, `rgba(${pal.fog}, 0.4)`);
        ctx.fillStyle = fg;
        ctx.fillRect(0, h - 90, w, 90);
      } else if (kind === 'fog') {
        for (const p of parts) {
          p.x += p.v * dt * (0.6 + gust);
          if (p.x - p.rx > w) p.x = -p.rx * 2;
          if (p.x + p.rx < 0) p.x = w + p.rx;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.rx);
          g.addColorStop(0, `rgba(${pal.fog}, ${p.a})`);
          g.addColorStop(1, `rgba(${pal.fog}, 0)`);
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
        ctx.fillStyle = `rgba(${pal.fog}, 0.18)`;
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
          ctx.strokeStyle = `rgba(${pal.cloud}, ${p.a})`;
          ctx.lineWidth = p.r;
          ctx.stroke();
        }
      } else if (kind === 'cloud') {
        for (const p of parts) {
          p.x += p.v * dt * (0.5 + gust * 0.6);
          if (p.x - p.rx > w) p.x = -p.rx * 2;
          if (p.x + p.rx < 0) p.x = w + p.rx;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.rx);
          g.addColorStop(0, `rgba(${pal.cloud}, ${p.a})`);
          g.addColorStop(1, `rgba(${pal.cloud}, 0)`);
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
          ctx.fillStyle = `rgba(${pal.sun}, ${p.a})`;
          ctx.fill();
        }
        const sx = w * 0.82;
        const sy = h * 0.16;
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, Math.min(w, h) * 0.4);
        sg.addColorStop(0, `rgba(${pal.sun}, 0.2)`);
        sg.addColorStop(1, `rgba(${pal.sun}, 0)`);
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

  if (kind === 'clear') return null;

  return <canvas className="weather-field" ref={ref} aria-hidden="true" />;
}
