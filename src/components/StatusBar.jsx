import React, { useEffect, useState } from 'react';
import Icon from './Icon.jsx';

/**
 * THE STATUS BAR — an application instrument strip.
 *
 * Not decoration: every field on it is live. The clock is the
 * visitor's own clock, the mood is what the ambience engine resolved
 * from the hour and the sky, the temperature is the real air
 * temperature, the GitHub lamp is GitHub's own operational status,
 * and the line at the very top is how far down the page you are.
 */

const WEATHER_ICON = {
  clear: 'sun',
  cloud: 'cloud',
  fog: 'cloud',
  drizzle: 'rain',
  rain: 'rain',
  snow: 'snow',
  storm: 'rain',
  wind: 'wind',
};

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/**
 * LIVE TELEMETRY
 *
 * The status bar is an instrument strip, so it should carry real
 * readings: the frame rate the page is actually running at, how much
 * heap the browser is holding, and how long the first byte took.
 * All of it is measured, none of it is decorative.
 */
function useTelemetry() {
  const [t, setT] = useState({ fps: 0, heap: null, ttfb: null, nodes: 0 });

  useEffect(() => {
    let frames = 0;
    let raf = 0;
    let last = performance.now();

    const loop = () => {
      frames++;
      const now = performance.now();
      if (now - last >= 500) {
        const nav = performance.getEntriesByType('navigation')[0];
        setT({
          fps: Math.round((frames * 1000) / (now - last)),
          heap: performance.memory?.usedJSHeapSize
            ? Math.round(performance.memory.usedJSHeapSize / 1048576)
            : null,
          ttfb: nav ? Math.round(nav.responseStart) : null,
          nodes: document.getElementsByTagName('*').length,
        });
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return t;
}

export default function StatusBar({ ambience, gh, build = '5a974cf' }) {
  const now = useClock();
  const tel = useTelemetry();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const clock = now.toLocaleTimeString([], { hour12: false });
  const wx = WEATHER_ICON[ambience.weatherId] || 'sun';
  const tone = gh.indicator === 'none' ? 'ok' : gh.indicator;

  return (
    <div className="status-bar" role="status" aria-live="off">
      <div className="sb-progress" style={{ transform: `scaleX(${progress})` }} />
      <div className="sb-inner">
        <span className="sb-mark" title="Harshit Shyamsukha">
          <span className="sb-glyph">◈</span>
          <span className="sb-id">HS-3114</span>
        </span>

        <span className="sb-sep" />

        <span className="sb-cell sb-clock" title="Your local time">
          <Icon name="clock" size={11} />
          <span className="sb-mono">{clock}</span>
        </span>

        <span className="sb-sep" />

        <span className="sb-cell sb-mood" title={`Ambience: ${ambience.name}`}>
          <Icon name="sparkle" size={11} />
          <span>{ambience.name}</span>
          {ambience.temp !== null && ambience.temp !== undefined && (
            <span className="sb-temp">{Math.round(ambience.temp)}°</span>
          )}
        </span>

        <span className="sb-sep" />

        <span className="sb-cell sb-wx" title={`${ambience.weather}${ambience.located ? ' at your location' : ''}`}>
          <Icon name={wx} size={11} />
          <span>{ambience.weather}</span>
        </span>

        <span className="sb-grow" />

        <span className="sb-cell sb-tel" title="Live page telemetry">
          <span className="sb-mono">{String(tel.fps).padStart(2, '0')} fps</span>
          {tel.heap !== null && <span className="sb-mono">{tel.heap} MB</span>}
          {tel.ttfb !== null && <span className="sb-mono">ttfb {tel.ttfb}ms</span>}
        </span>

        <span className="sb-sep" />

        <span className="sb-cell sb-gh" title={`GitHub is ${gh.label}`}>
          <span className={`sb-lamp ${tone}`} />
          <span>github {gh.label}</span>
        </span>

        <span className="sb-sep" />

        <span className="sb-cell sb-build" title="Build">
          <span className="sb-mono">build {build}</span>
        </span>

        <span className="sb-sep" />

        <span className="sb-cell sb-pct" title="Scroll position">
          <span className="sb-mono">{String(Math.round(progress * 100)).padStart(3, ' ')}%</span>
        </span>
      </div>
    </div>
  );
}
