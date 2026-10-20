import React, { useEffect, useRef, useState } from 'react';

/**
 * THE SIGIL
 *
 * A generated ring that sits around the portrait and reads the same
 * things the rest of the site reads: where the sun is, how hard the
 * light is, what the sky is doing.
 *
 * It is a compass rose for a person. The lit arc is the sun's path
 * across the day; the needle is where the sun is right now; the
 * waveform underneath is the weather — flat and slow under overcast,
 * jagged under a storm.
 *
 * Nothing about it is random at rest: the same hour and the same
 * weather always draw the same sigil.
 */

const TICK_COUNT = 48;

function hashSeed(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

export default function Portrait({ sun, weatherId = 'clear', hardness = 1, size = 112 }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      setTilt({ x: px * 12, y: py * 12 });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const R = 50;
  const C = 60;
  const sunX = sun?.x ?? 0;
  const isDay = sun?.isDay ?? true;

  /* the needle points at the sun */
  const angle = -Math.PI / 2 + sunX * 1.25;
  const nx = C + Math.cos(angle) * (R - 6);
  const ny = C + Math.sin(angle) * (R - 6);

  /* the waveform under the ring reads the weather */
  const seed = hashSeed(`${weatherId}:${sun?.hour ?? 12}`);
  const rough = weatherId === 'storm' ? 7 : weatherId === 'rain' ? 4
    : weatherId === 'wind' ? 5 : weatherId === 'snow' ? 1.6
      : weatherId === 'fog' ? 0.7 : 1;
  const wave = [];
  for (let i = 0; i <= 60; i++) {
    const x = 8 + (i / 60) * 104;
    const t = i / 60;
    const y = C + Math.sin(t * 9 + seed * 6) * rough
      + Math.sin(t * 21 + seed * 3) * rough * 0.4;
    wave.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  const ticks = [];
  for (let i = 0; i < TICK_COUNT; i++) {
    const a = (i / TICK_COUNT) * Math.PI * 2 - Math.PI / 2;
    const near = Math.abs(((i / TICK_COUNT) * 2 - 1) - sunX);
    const lit = near < 0.28;
    const len = lit ? 7 : 3;
    ticks.push(
      <line
        key={i}
        x1={C + Math.cos(a) * (R + 2)}
        y1={C + Math.sin(a) * (R + 2)}
        x2={C + Math.cos(a) * (R + 2 + len)}
        y2={C + Math.sin(a) * (R + 2 + len)}
        className={lit ? 'sigil-tick lit' : 'sigil-tick'}
      />,
    );
  }

  return (
    <div className="sigil-wrap" ref={wrapRef} style={{ width: size, height: size }}>
      <svg
        className="sigil"
        viewBox="0 0 120 120"
        aria-hidden="true"
        style={{ transform: `rotate(${tilt.x}deg) translate(${tilt.x * 0.2}px, ${tilt.y * 0.2}px)` }}
      >
        {/* the arc the sun walks */}
        <path
          className="sigil-arc"
          d={`M ${C - R * 0.86} ${C + R * 0.5} A ${R * 0.98} ${R * 0.98} 0 0 1 ${C + R * 0.86} ${C + R * 0.5}`}
        />
        <circle className="sigil-ring" cx={C} cy={C} r={R} />
        <circle className="sigil-ring faint" cx={C} cy={C} r={R - 9} />
        {ticks}

        {/* the needle */}
        <line className="sigil-needle" x1={C} y1={C} x2={nx} y2={ny} />
        <circle className={`sigil-sun${isDay ? '' : ' is-moon'}`} cx={nx} cy={ny} r={isDay ? 4 : 3} />

        {/* the weather, as a waveform */}
        <polyline className="sigil-wave" points={wave.join(' ')} />
        <circle className="sigil-core" cx={C} cy={C} r={3} />
      </svg>
      <div className="sigil-veil" style={{ opacity: 0.1 + (1 - hardness) * 0.35 }} />
    </div>
  );
}
