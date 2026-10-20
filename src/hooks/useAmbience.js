import { useCallback, useEffect, useRef, useState } from 'react';
import { resolveAmbience, BAND_HOUR } from '../lib/ambience.js';
import { sunState } from '../lib/sun.js';

/**
 * AMBIENCE — the page reads the room it is in.
 *
 * Time of day and local weather decide the LIGHT: how warm the paper
 * is, how hard the shadows fall, what colour the sky bleeds, how much
 * grain sits on top. The chromatic identity of the site — one accent
 * per discipline — never moves. Ambience changes the weather, not the
 * voice.
 *
 * There are two ways in:
 *
 *   AUTO     the live forecast and the visitor's own clock
 *   OVERRIDE a phrase typed into the console — "thor", "let it
 *            rain", "wednesday" — which pins the site to a mood until
 *            the visitor says "auto" again
 *
 * Weather comes from Open-Meteo (no key, CORS-friendly). If the
 * network, the geolocation permission or anything else fails, the page
 * keeps its default light. Ambience is an enhancement, never a
 * dependency, and there is always a manual override.
 */

const CACHE_KEY = 'ambience-cache-v1';
const MODE_KEY = 'ambience-mode-v1';
const CACHE_TTL = 30 * 60 * 1000;

export const AMBIENCE_MODES = [
  { id: 'auto', label: 'Auto — follow time & weather' },
  { id: 'day', label: 'Daylight — always noon' },
  { id: 'night', label: 'Night — always midnight' },
  { id: 'overcast', label: 'Overcast — flat light' },
  { id: 'off', label: 'Off — fixed paper' },
];

function getPosition(timeout = 6000) {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(null),
      { timeout, maximumAge: 30 * 60 * 1000 }
    );
  });
}

async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(3)}&longitude=${lon.toFixed(3)}&current=temperature_2m,weather_code,is_day&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('weather ' + res.status);
  const json = await res.json();
  return {
    code: json.current?.weather_code ?? 0,
    temp: json.current?.temperature_2m ?? null,
  };
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw);
    if (Date.now() - c.at > CACHE_TTL) return null;
    return c;
  } catch {
    return null;
  }
}

export default function useAmbience() {
  const [mode, setModeState] = useState(() => {
    if (typeof window === 'undefined') return 'auto';
    try {
      const m = localStorage.getItem(MODE_KEY);
      return AMBIENCE_MODES.some((x) => x.id === m) ? m : 'auto';
    } catch { return 'auto'; }
  });

  /* a phrase typed into the console pins the site to a mood */
  const [override, setOverrideState] = useState(null);

  /* the sun can be moved by hand — `sun 17` */
  const [hourOverride, setHourOverride] = useState(null);

  const [state, setState] = useState({
    ready: false,
    name: 'Hard Noon',
    temp: null,
    weather: 'Clear',
    weatherId: 'clear',
    timeLabel: 'Afternoon',
    hardness: 1,
    hour: 12,
    located: false,
  });

  const codeRef = useRef(0);
  const modeRef = useRef(mode);
  const overrideRef = useRef(override);
  const hourRef = useRef(hourOverride);
  const latRef = useRef(13.0827);
  modeRef.current = mode;
  overrideRef.current = override;
  hourRef.current = hourOverride;

  /* paint the ambience onto <html> — one place, so every component
     reads the same light without prop-drilling */
  const paint = useCallback((code, temp, located) => {
    const now = new Date();
    const m = modeRef.current;
    const ov = overrideRef.current;
    const manualHour = hourRef.current;

    let hour = manualHour !== null ? manualHour : now.getHours() + now.getMinutes() / 60;
    let weather = code;             // a WMO code
    let name = null;

    if (ov) {
      weather = ov.weather;         // a band
      if (ov.time && manualHour === null) hour = BAND_HOUR[ov.time];
      name = ov.name || null;
    } else if (m === 'day') { hour = manualHour ?? 14; weather = 'clear'; }
    else if (m === 'night') { hour = manualHour ?? 23; weather = 'clear'; }
    else if (m === 'overcast') { hour = manualHour ?? 13; weather = 'cloud'; }
    else if (m === 'off') { hour = manualHour ?? 14; weather = 'clear'; }

    /* the sun, and the shadows it throws */
    const sun = sunState(hour, latRef.current, now);

    const amb = resolveAmbience(hour, weather, sun.band);

    const root = document.documentElement;
    root.style.setProperty('--amb-paper', amb.paper);
    root.style.setProperty('--amb-field-1', amb.field[0]);
    root.style.setProperty('--amb-field-2', amb.field[1]);
    root.style.setProperty('--amb-field-3', amb.field[2]);
    root.style.setProperty('--amb-shade', amb.shade);
    root.style.setProperty('--amb-hard', String(amb.hard));
    root.style.setProperty('--amb-grain', String(amb.grain));

    /* the sun's position on the page, and the shadows it throws */
    root.style.setProperty('--sun-x', sun.x.toFixed(3));
    root.style.setProperty('--sun-height', sun.height.toFixed(3));
    root.style.setProperty('--sun-warmth', sun.warmth.toFixed(3));
    root.style.setProperty('--shadow-dx', sun.shadowX.toFixed(3));
    root.style.setProperty('--shadow-dy', sun.shadowY.toFixed(3));
    root.style.setProperty('--shadow-len', sun.length.toFixed(3));

    /* a flat sky throws almost no shadow at all */
    const hard = amb.hard;
    root.style.setProperty('--shadow-a1', `${(22 * hard).toFixed(1)}%`);
    root.style.setProperty('--shadow-a2', `${(26 * hard).toFixed(1)}%`);
    root.style.setProperty('--shadow-a3', `${(30 * hard).toFixed(1)}%`);

    root.dataset.ambience = amb.key;
    root.dataset.ambienceName = name || amb.name;
    root.dataset.weather = amb.weatherCode;
    root.dataset.ambienceTime = amb.timeBand.id;
    root.dataset.sunUp = sun.isDay ? 'true' : 'false';

    setState({
      ready: true,
      name: name || amb.name,
      temp: (m === 'auto' && !ov) ? temp : null,
      weather: amb.weather.label,
      weatherId: amb.weatherCode,
      timeLabel: amb.timeBand.label,
      hardness: amb.hard,
      hour,
      sun,
      located,
    });
  }, []);

  const setMode = useCallback((next) => {
    setModeState(next);
    try { localStorage.setItem(MODE_KEY, next); } catch { /* private mode */ }
  }, []);

  /* ---- fetch the weather once, then keep the clock honest ---- */
  useEffect(() => {
    let cancelled = false;

    const cached = readCache();
    if (cached) {
      codeRef.current = cached.code;
      paint(cached.code, cached.temp, !!cached.located);
    }

    (async () => {
      try {
        const pos = await getPosition();
        const lat = pos?.lat ?? 13.0827;   // Chennai
        const lon = pos?.lon ?? 80.2707;
        latRef.current = lat;
        const w = await fetchWeather(lat, lon);
        if (cancelled) return;
        codeRef.current = w.code;
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            at: Date.now(), code: w.code, temp: w.temp, located: !!pos,
          }));
        } catch { /* storage may be unavailable */ }
        paint(w.code, w.temp, !!pos);
      } catch {
        if (!cached) paint(codeRef.current, null, false);
      }
    })();

    return () => { cancelled = true; };
  }, [paint]);

  /* the sky changes while the tab is open — re-read the hour, and
     re-read it the moment the tab wakes up */
  useEffect(() => {
    const tick = () => paint(codeRef.current, state.temp, state.located);
    const onVisible = () => { if (!document.hidden) tick(); };
    const id = setInterval(tick, 60 * 1000);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [paint, state.temp, state.located]);

  /* a mode, override or hour change repaints immediately */
  useEffect(() => {
    paint(codeRef.current, state.temp, state.located);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, override, hourOverride]);

  const pinOverride = useCallback((next) => setOverrideState(next), []);
  const setHour = useCallback((h) => setHourOverride(h), []);

  return {
    ...state, mode, setMode, override, setOverride: pinOverride, setHour, hourOverride,
  };
}
