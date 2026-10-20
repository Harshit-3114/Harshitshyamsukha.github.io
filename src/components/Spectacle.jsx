import React, { useEffect, useRef } from 'react';

/**
 * SPECTACLES — the set pieces.
 *
 * Some phrases are not weather. "Dracarys" is dragonfire crossing the
 * screen. "Spidey" is webs. "Smash" is the glass going. "Snap" is the
 * light going.
 *
 * Each one is a single canvas timeline — a progress value from 0 to 1
 * that every effect draws against. That keeps them all in step with
 * the page and, more importantly, keeps them interruptible: the effect
 * unmounts the moment it is over and the site carries on.
 */

const TAU = Math.PI * 2;
const rand = (a, b) => a + Math.random() * (b - a);

/* ---------- shared helpers ---------- */

function flameBlob(ctx, x, y, r, alpha, hue) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(255,${hue},${Math.round(hue * 0.45)},${alpha})`);
  g.addColorStop(0.45, `rgba(255,${Math.round(hue * 0.62)},40,${alpha * 0.7})`);
  g.addColorStop(1, 'rgba(120,40,10,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(x, y, r * 0.86, r * 1.18, 0, 0, TAU);
  ctx.fill();
}

/* ---------- the effects ---------- */

const EFFECTS = {
  /* DRAKARYS — a streak of fire crossing the screen */
  fire: {
    duration: 2200,
    render(ctx, w, h, p, s) {
      const head = -0.12 + p * 1.35;
      const baseY = h * 0.58;
      const path = (t) => ({
        x: (-0.12 + t * 1.35) * w,
        y: baseY + Math.sin(t * 2.6) * h * 0.16 + Math.sin(t * 9.1) * h * 0.05,
      });

      /* the glow the fire leaves behind */
      const gx = path(head).x;
      const gy = path(head).y;
      const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(w, h) * 0.42);
      glow.addColorStop(0, `rgba(255,150,40,${0.3 * Math.sin(p * Math.PI)})`);
      glow.addColorStop(1, 'rgba(255,90,20,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'lighter';

      /* the trail — a chain of blobs, hottest at the head */
      const STEPS = 34;
      for (let i = STEPS; i >= 0; i--) {
        const t = head - (i / STEPS) * 0.5;
        if (t < -0.2 || t > 1.2) continue;
        const pos = path(t);
        const heat = 1 - i / STEPS;
        const flick = 0.7 + Math.random() * 0.6;
        const r = (22 + heat * 96) * flick * (0.45 + p * 0.85);
        flameBlob(ctx, pos.x + rand(-12, 12), pos.y + rand(-30, 30), r, 0.13 + heat * 0.26, Math.round(140 + heat * 115));
      }

      /* the core */
      const core = path(head);
      flameBlob(ctx, core.x, core.y, 62 * (0.5 + p), 0.42, 240);
      flameBlob(ctx, core.x - 20, core.y, 40 * (0.5 + p), 0.3, 210);

      ctx.globalCompositeOperation = 'source-over';

      /* embers */
      if (!s.embers) {
        s.embers = Array.from({ length: 90 }, () => ({
          x: rand(0, w), y: rand(0, h), vx: rand(-1.4, 0.6), vy: rand(-2.2, -0.3),
          r: rand(0.6, 2.2), life: rand(0, 1),
        }));
      }
      for (const e of s.embers) {
        e.x += e.vx * 2.2;
        e.y += e.vy * 2.2;
        e.life += 0.012;
        if (e.life > 1 || e.x < -20 || e.x > w + 20) {
          const head2 = path(head);
          e.x = head2.x + rand(-140, 40);
          e.y = head2.y + rand(-50, 50);
          e.life = 0;
          e.vx = rand(-1.4, 0.6);
          e.vy = rand(-2.2, -0.3);
        }
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, TAU);
        ctx.fillStyle = `rgba(255,${170 + Math.round(e.life * 60)},80,${(1 - e.life) * 0.85})`;
        ctx.fill();
      }

      /* the smoke it leaves */
      if (!s.smoke) {
        s.smoke = Array.from({ length: 26 }, () => ({
          x: rand(0, w), y: rand(0, h * 0.4), r: rand(20, 70), a: rand(0.02, 0.07), v: rand(0.2, 0.9),
        }));
      }
      for (const sm of s.smoke) {
        sm.x += sm.v;
        sm.y += 0.25;
        ctx.beginPath();
        ctx.arc(sm.x, sm.y, sm.r, 0, TAU);
        ctx.fillStyle = `rgba(60,45,38,${sm.a * Math.sin(p * Math.PI)})`;
        ctx.fill();
      }
    },
  },

  /* SPIDEY — webs from two corners */
  webs: {
    duration: 2600,
    render(ctx, w, h, p, s) {
      if (!s.webs) {
        s.webs = [
          { ax: w * 0.04, ay: -h * 0.04, rays: 13, spread: 1.25, delay: 0 },
          { ax: w * 0.97, ay: h * 1.04, rays: 11, spread: 1.1, delay: 0.18 },
        ];
      }
      for (const web of s.webs) {
        const local = Math.max(0, Math.min(1, (p - web.delay) / (1 - web.delay)));
        if (local <= 0) continue;
        const R = Math.hypot(w, h) * 1.05;
        const alpha = 0.55 * Math.min(1, local * 2.2) * (1 - Math.pow(Math.max(0, p - 0.8) / 0.2, 2));
        if (alpha <= 0) continue;

        ctx.strokeStyle = `rgba(28,28,34,${alpha * 0.42})`;
        ctx.lineWidth = 2.6;

        /* radial threads */
        const angles = [];
        for (let i = 0; i < web.rays; i++) {
          const a = web.spread * (i / (web.rays - 1)) - web.spread / 2;
          angles.push(a);
          const reach = R * local * (0.55 + 0.45 * Math.sin((i / web.rays) * Math.PI));
          ctx.beginPath();
          ctx.moveTo(web.ax, web.ay);
          /* a slight bow so the thread is not a ruler line */
          const mid = reach * 0.55;
          const bow = Math.sin((i / web.rays) * Math.PI) * 26;
          ctx.quadraticCurveTo(
            web.ax + Math.cos(a) * mid + bow * Math.sin(a),
            web.ay + Math.sin(a) * mid - bow * Math.cos(a),
            web.ax + Math.cos(a) * reach,
            web.ay + Math.sin(a) * reach,
          );
          ctx.stroke();
        }

        /* the silk itself, laid over the dark guide */
        ctx.strokeStyle = `rgba(244,248,252,${alpha})`;
        ctx.lineWidth = 1.2;

        /* concentric arcs */
        const rings = 7;
        for (let k = 1; k <= rings; k++) {
          const r = R * local * (k / rings) * 0.72;
          if (r < 6) continue;
          ctx.beginPath();
          for (let i = 0; i < angles.length - 1; i++) {
            const a1 = angles[i];
            const a2 = angles[i + 1];
            const x1 = web.ax + Math.cos(a1) * r;
            const y1 = web.ay + Math.sin(a1) * r;
            const x2 = web.ax + Math.cos(a2) * r;
            const y2 = web.ay + Math.sin(a2) * r;
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;
            const sag = r * 0.11;
            ctx.moveTo(x1, y1);
            ctx.quadraticCurveTo(mx - Math.sin(a1) * sag, my + Math.cos(a1) * sag, x2, y2);
          }
          ctx.stroke();
        }
      }
    },
  },

  /* SMASH — the glass goes */
  smash: {
    duration: 2400,
    render(ctx, w, h, p, s) {
      const ix = w * 0.5;
      const iy = h * 0.46;
      const fade = 1 - Math.pow(Math.max(0, p - 0.55) / 0.45, 1.6);

      if (!s.branches) {
        s.branches = [];
        const grow = (x, y, angle, len, depth) => {
          if (depth > 4 || len < 22) return;
          const pts = [{ x, y }];
          let cx = x;
          let cy = y;
          let a = angle;
          const steps = 4 + Math.floor(Math.random() * 4);
          for (let i = 0; i < steps; i++) {
            a += rand(-0.35, 0.35);
            cx += Math.cos(a) * (len / steps);
            cy += Math.sin(a) * (len / steps);
            pts.push({ x: cx, y: cy });
          }
          s.branches.push({ pts, depth });
          const mid = pts[Math.floor(pts.length / 2)];
          grow(mid.x, mid.y, a - rand(0.25, 0.75), len * 0.62, depth + 1);
          grow(mid.x, mid.y, a + rand(0.25, 0.75), len * 0.62, depth + 1);
        };
        for (let i = 0; i < 11; i++) {
          grow(ix, iy, (i / 11) * TAU + rand(-0.1, 0.1), rand(90, 190), 0);
        }
      }

      /* the impact bloom */
      const bloom = ctx.createRadialGradient(ix, iy, 0, ix, iy, Math.max(w, h) * 0.5);
      bloom.addColorStop(0, `rgba(210,255,210,${0.34 * fade})`);
      bloom.addColorStop(0.4, `rgba(90,200,90,${0.12 * fade})`);
      bloom.addColorStop(1, 'rgba(60,160,60,0)');
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, w, h);

      const reveal = Math.min(1, p / 0.22);
      ctx.lineCap = 'round';
      for (const b of s.branches) {
        const visible = Math.ceil(b.pts.length * reveal);
        if (visible < 2) continue;
        ctx.beginPath();
        ctx.moveTo(b.pts[0].x, b.pts[0].y);
        for (let i = 1; i < visible; i++) ctx.lineTo(b.pts[i].x, b.pts[i].y);
        ctx.strokeStyle = `rgba(255,255,255,${0.72 * fade})`;
        ctx.lineWidth = 2.6 - b.depth * 0.45;
        ctx.stroke();
        ctx.strokeStyle = `rgba(20,40,20,${0.4 * fade})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    },
  },

  /* SNAP — half the light goes */
  snap: {
    duration: 2600,
    render(ctx, w, h, p, s) {
      /* the flash */
      if (p < 0.08) {
        ctx.fillStyle = `rgba(255,255,255,${(1 - p / 0.08) * 0.9})`;
        ctx.fillRect(0, 0, w, h);
      }
      if (!s.dust) {
        s.dust = Array.from({ length: 260 }, () => ({
          x: rand(0, w), y: rand(0, h), r: rand(0.8, 3.4), v: rand(0.6, 2.2), t: rand(0, 1),
        }));
      }
      /* a dust wave sweeping left to right */
      const wave = p * (w + 260) - 130;
      for (const d of s.dust) {
        const front = d.x + wave;
        if (front < d.x) continue;
        const age = Math.min(1, (front - d.x) / 120);
        ctx.beginPath();
        ctx.arc(d.x + (front - d.x) * 0.9, d.y, d.r, 0, TAU);
        ctx.fillStyle = `rgba(196,192,186,${(1 - age) * 0.75})`;
        ctx.fill();
      }
      /* the grey that is left behind */
      const grey = Math.max(0, (p - 0.35) / 0.65);
      ctx.fillStyle = `rgba(120,118,114,${grey * 0.16})`;
      ctx.fillRect(0, 0, w, h);
    },
  },

  /* THE FLASH — everything moves at once */
  speed: {
    duration: 2200,
    render(ctx, w, h, p, s) {
      if (!s.lines) {
        s.lines = Array.from({ length: 150 }, () => ({
          x: rand(-w, w), y: rand(0, h), len: rand(40, 320), v: rand(14, 44), w: rand(0.6, 2.6),
        }));
      }
      const tint = ctx.createLinearGradient(0, 0, w, h);
      tint.addColorStop(0, `rgba(255,80,30,${0.16 * Math.sin(p * Math.PI)})`);
      tint.addColorStop(1, `rgba(255,200,60,${0.12 * Math.sin(p * Math.PI)})`);
      ctx.fillStyle = tint;
      ctx.fillRect(0, 0, w, h);

      for (const l of s.lines) {
        l.x += l.v * (1 + p * 3);
        if (l.x > w + l.len) { l.x = rand(-w * 0.6, -60); l.y = rand(0, h); }
        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(l.x - l.len, l.y);
        ctx.strokeStyle = `rgba(255,225,190,${0.16 + Math.random() * 0.4})`;
        ctx.lineWidth = l.w;
        ctx.stroke();
      }
      /* the shock at the centre */
      const cx = w / 2;
      const cy = h / 2;
      const r = p * Math.max(w, h) * 0.8;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, TAU);
      ctx.strokeStyle = `rgba(255,220,180,${(1 - p) * 0.5})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    },
  },

  /* KRYPTONITE — green gets into the paper */
  kryptonite: {
    duration: 3000,
    render(ctx, w, h, p, s) {      const fade = Math.sin(Math.min(1, p) * Math.PI);
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
      g.addColorStop(0, `rgba(74,222,128,${0.2 * fade})`);
      g.addColorStop(1, `rgba(20,120,60,${0.05 * fade})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      if (!s.veins) {
        s.veins = [];
        for (let i = 0; i < 16; i++) {
          const edge = Math.floor(rand(0, 4));
          const start = edge === 0 ? { x: rand(0, w), y: -10 }
            : edge === 1 ? { x: w + 10, y: rand(0, h) }
              : edge === 2 ? { x: rand(0, w), y: h + 10 }
                : { x: -10, y: rand(0, h) };
          const pts = [{ ...start }];
          let a = Math.atan2(h / 2 - start.y, w / 2 - start.x) + rand(-0.5, 0.5);
          let x = start.x;
          let y = start.y;
          for (let k = 0; k < 12; k++) {
            a += rand(-0.42, 0.42);
            x += Math.cos(a) * rand(24, 70);
            y += Math.sin(a) * rand(24, 70);
            pts.push({ x, y });
          }
          s.veins.push(pts);
        }
      }
      const reveal = Math.min(1, p / 0.5);
      ctx.strokeStyle = `rgba(110,240,150,${0.6 * fade})`;
      ctx.lineWidth = 1.6;
      for (const v of s.veins) {
        const visible = Math.ceil(v.length * reveal);
        ctx.beginPath();
        ctx.moveTo(v[0].x, v[0].y);
        for (let i = 1; i < visible; i++) ctx.lineTo(v[i].x, v[i].y);
        ctx.stroke();
      }
    },
  },

  /* VIBRANIUM — violet shimmer */
  vibranium: {
    duration: 2800,
    render(ctx, w, h, p, s) {
      const fade = Math.sin(Math.min(1, p) * Math.PI);
      const g = ctx.createRadialGradient(w * 0.5, h * 0.62, 0, w * 0.5, h * 0.62, Math.max(w, h) * 0.65);
      g.addColorStop(0, `rgba(170,110,255,${0.26 * fade})`);
      g.addColorStop(1, 'rgba(90,40,190,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      if (!s.motes) {
        s.motes = Array.from({ length: 130 }, () => ({
          x: rand(0, w), y: rand(0, h), r: rand(0.7, 2.6), v: rand(0.4, 1.8), ph: rand(0, TAU),
        }));
      }
      for (const m of s.motes) {
        m.y -= m.v * 2;
        m.ph += 0.04;
        m.x += Math.sin(m.ph) * 0.5;
        if (m.y < -10) { m.y = h + 10; m.x = rand(0, w); }
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, TAU);
        ctx.fillStyle = `rgba(206,168,255,${(0.25 + Math.sin(m.ph) * 0.25) * fade})`;
        ctx.fill();
      }
    },
  },

  /* DEATH STAR — a very large hole in the sky */
  blast: {
    duration: 2600,
    render(ctx, w, h, p) {
      const cx = w * 0.5;
      const cy = h * 0.46;
      /* the lock */
      if (p < 0.35) {
        const k = p / 0.35;
        ctx.strokeStyle = `rgba(255,90,90,${0.8 * (1 - k * 0.3)})`;
        ctx.lineWidth = 1.6;
        const r = 90 - k * 60;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, TAU);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - r - 30, cy); ctx.lineTo(cx - r + 6, cy);
        ctx.moveTo(cx + r - 6, cy); ctx.lineTo(cx + r + 30, cy);
        ctx.moveTo(cx, cy - r - 30); ctx.lineTo(cx, cy - r + 6);
        ctx.moveTo(cx, cy + r - 6); ctx.lineTo(cx, cy + r + 30);
        ctx.stroke();
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255,120,120,0.9)';
        ctx.fillText('TARGET LOCKED', cx - 42, cy - r - 44);
      } else {
        const k = (p - 0.35) / 0.65;
        const r = k * Math.max(w, h) * 0.85;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(r, 1));
        g.addColorStop(0, `rgba(255,255,255,${(1 - k) * 0.95})`);
        g.addColorStop(0.25, `rgba(255,210,140,${(1 - k) * 0.7})`);
        g.addColorStop(0.6, `rgba(220,110,50,${(1 - k) * 0.4})`);
        g.addColorStop(1, 'rgba(60,30,20,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        /* the shockwave */
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(1, r * 0.86), 0, TAU);
        ctx.strokeStyle = `rgba(255,240,210,${(1 - k) * 0.7})`;
        ctx.lineWidth = 4;
        ctx.stroke();
      }
    },
  },
};

export default function Spectacle({ effect, onDone }) {
  const ref = useRef(null);

  useEffect(() => {
    const spec = EFFECTS[effect];
    const canvas = ref.current;
    if (!spec || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const state = {};
    let raf = 0;
    let start = performance.now();
    let finished = false;

    /* some effects also move the page itself */
    const root = document.documentElement;
    if (effect === 'smash') root.classList.add('is-shaking');
    if (effect === 'snap') root.classList.add('is-snapped');

    const frame = (t) => {
      const p = Math.min(1, (t - start) / spec.duration);
      ctx.clearRect(0, 0, w, h);
      spec.render(ctx, w, h, p, state);
      if (p >= 1) {
        finished = true;
        root.classList.remove('is-shaking');
        root.classList.remove('is-snapped');
        onDone?.();
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      if (!finished) {
        root.classList.remove('is-shaking');
        root.classList.remove('is-snapped');
      }
    };
  }, [effect, onDone]);

  return <canvas className="spectacle" ref={ref} aria-hidden="true" />;
}
