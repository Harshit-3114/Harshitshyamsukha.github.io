import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * UI SOUND — synthesized, not sampled.
 *
 * Every cue is a few oscillators and a noise buffer. No asset files,
 * no network, no megabytes. The point is not decoration: a portfolio
 * is an interface, and interfaces make noise when they confirm an
 * action.
 *
 * There is also a WEATHER BED — a continuous loop of filtered noise
 * that becomes rain, wind or a low room hum depending on what the sky
 * is doing, plus THUNDER, which is a scheduled rumble whose delay
 * depends on how far away the strike was.
 *
 * Off by default and never autoplaying — a site that makes sounds
 * without being asked is a site people mute and never un-mute. The
 * state persists, and the toggle is right there in the nav.
 */

const KEY = 'uiSoundEnabled';

/* how each weather band sounds, and how loud */
const BEDS = {
  rain:  { gain: 0.075, tone: 1600, q: 0.7, rumble: 0.030 },
  storm: { gain: 0.090, tone: 1400, q: 0.7, rumble: 0.042 },
  drizzle: { gain: 0.038, tone: 2600, q: 0.5, rumble: 0.014 },
  snow:  { gain: 0.014, tone: 900,  q: 0.4, rumble: 0.010 },
  fog:   { gain: 0.012, tone: 420,  q: 0.4, rumble: 0.016 },
  wind:  { gain: 0.048, tone: 700,  q: 0.6, rumble: 0.020 },
  cloud: { gain: 0.010, tone: 380,  q: 0.4, rumble: 0.010 },
  clear: { gain: 0,     tone: 500,  q: 0.4, rumble: 0 },
};

export default function useSound() {
  const ctxRef = useRef(null);
  const bedRef = useRef(null);
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    try { return localStorage.getItem(KEY) === 'true'; } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, String(enabled)); } catch { /* private mode */ }
  }, [enabled]);

  /* A context can only start from a user gesture, so it is created
     lazily on the first real interaction rather than on mount. */
  const ensure = useCallback(() => {
    if (!enabled) return null;
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { ctxRef.current = new AC(); } catch { return null; }
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume().catch(() => {});
    return ctxRef.current;
  }, [enabled]);

  const noiseBuffer = useCallback((ctx, seconds = 2) => {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    /* brown-ish noise: a running sum, scaled down — closer to real
       rain than white noise is */
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      d[i] = last * 3.5;
    }
    return buf;
  }, []);

  const noise = useCallback((ctx, duration, freq, q, gain) => {
    const len = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = freq;
    bp.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    src.connect(bp).connect(g).connect(ctx.destination);
    src.start();
  }, []);

  const tone = useCallback((ctx, { freq, to, type = 'sine', dur = 0.16, gain = 0.05, delay = 0 }) => {
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }, []);

  const play = useCallback((kind) => {
    const ctx = ensure();
    if (!ctx) return;
    switch (kind) {
      case 'tick':
        tone(ctx, { freq: 2100, to: 1600, type: 'sine', dur: 0.05, gain: 0.018 });
        break;
      case 'open':
        tone(ctx, { freq: 320, to: 190, type: 'triangle', dur: 0.18, gain: 0.045 });
        tone(ctx, { freq: 1500, type: 'sine', dur: 0.1, gain: 0.012, delay: 0.02 });
        break;
      case 'close':
        tone(ctx, { freq: 190, to: 300, type: 'triangle', dur: 0.13, gain: 0.03 });
        break;
      case 'key':
        noise(ctx, 0.03, 2600, 3, 0.014);
        break;
      case 'success':
        tone(ctx, { freq: 660, type: 'sine', dur: 0.13, gain: 0.035 });
        tone(ctx, { freq: 990, type: 'sine', dur: 0.2, gain: 0.03, delay: 0.1 });
        break;
      case 'error':
        tone(ctx, { freq: 240, to: 150, type: 'sawtooth', dur: 0.24, gain: 0.026 });
        break;
      case 'scratch': {
        /* a record being scratched to a halt */
        const len = Math.floor(ctx.sampleRate * 0.36);
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 0.6);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.Q.value = 9;
        bp.frequency.setValueAtTime(3400, ctx.currentTime);
        bp.frequency.exponentialRampToValueAtTime(380, ctx.currentTime + 0.3);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.075, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.33);
        src.connect(bp).connect(g).connect(ctx.destination);
        src.start();
        break;
      }
      default:
        break;
    }
  }, [ensure, noise, tone]);

  /* ---- the weather bed ----
     A looping noise bed, filtered into whatever the sky is doing.
     It fades in and out so switching weather never clicks. */
  const stopBed = useCallback(() => {
    const bed = bedRef.current;
    if (!bed) return;
    bedRef.current = null;
    const ctx = ctxRef.current;
    if (!ctx) return;
    try {
      bed.gain.gain.cancelScheduledValues(ctx.currentTime);
      bed.gain.gain.setValueAtTime(bed.gain.gain.value, ctx.currentTime);
      bed.gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
      setTimeout(() => { try { bed.src.stop(); } catch { /* already stopped */ } }, 1000);
    } catch { /* context gone */ }
  }, []);

  const setBed = useCallback((kind) => {
    const cfg = BEDS[kind] || BEDS.clear;
    if (!enabled || !cfg.gain) { stopBed(); return; }
    const ctx = ensure();
    if (!ctx) return;

    const current = bedRef.current;
    if (current && current.kind === kind) return;

    if (current) {
      stopBed();
    }

    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, 3);
    src.loop = true;

    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = cfg.tone;
    band.Q.value = cfg.q;

    const low = ctx.createBiquadFilter();
    low.type = 'lowpass';
    low.frequency.value = 380;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(cfg.gain, ctx.currentTime + 1.4);

    src.connect(band).connect(gain).connect(ctx.destination);
    src.connect(low).connect(gain).connect(ctx.destination);
    src.start();

    bedRef.current = { src, gain, kind };
  }, [enabled, ensure, noiseBuffer, stopBed]);

  /* ---- thunder ----
     `distance` 0 = overhead, 1 = far away. The delay and the brightness
     both fall off with distance, the way they do in the world. */
  const thunder = useCallback((distance = 0.4) => {
    const ctx = ensure();
    if (!ctx) return;
    const d = Math.max(0, Math.min(1, distance));
    const delay = d * 2.6;
    const dur = 3.2 - d * 1.4;
    const vol = 0.16 * (1 - d * 0.68);
    const t0 = ctx.currentTime + delay;

    /* the crack — only for close strikes */
    if (d < 0.45) {
      const crack = ctx.createBufferSource();
      const len = Math.floor(ctx.sampleRate * 0.5);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const dd = buf.getChannelData(0);
      for (let i = 0; i < len; i++) dd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2);
      crack.buffer = buf;
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 380;
      const cg = ctx.createGain();
      cg.gain.setValueAtTime(vol * 0.9, t0);
      cg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.45);
      crack.connect(hp).connect(cg).connect(ctx.destination);
      crack.start(t0);
    }

    /* the rumble — filtered noise with a long tail */
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const dd = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.05 * white) / 1.05;
      const env = Math.pow(1 - i / len, 1.6);
      dd[i] = last * 3.2 * env;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(900 - d * 500, t0);
    lp.frequency.exponentialRampToValueAtTime(90, t0 + dur);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    src.connect(lp).connect(g).connect(ctx.destination);
    src.start(t0);
    src.stop(t0 + dur + 0.1);
  }, [ensure]);

  const toggle = useCallback(() => setEnabled((v) => !v), []);

  useEffect(() => () => {
    try { ctxRef.current?.close(); } catch { /* already closed */ }
    ctxRef.current = null;
  }, []);

  return { enabled, setEnabled, toggle, play, setBed, thunder };
}
