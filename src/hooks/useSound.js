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
  rain:    { gain: 0.095, tone: 1500, q: 0.7, hiss: 2600 },
  storm:   { gain: 0.115, tone: 1300, q: 0.7, hiss: 2200 },
  drizzle: { gain: 0.048, tone: 2600, q: 0.5, hiss: 4200 },
  snow:    { gain: 0.018, tone: 900,  q: 0.4, hiss: 1600 },
  fog:     { gain: 0.014, tone: 420,  q: 0.4, hiss: 700 },
  wind:    { gain: 0.052, tone: 700,  q: 0.6, hiss: 1400 },
  cloud:   { gain: 0.012, tone: 380,  q: 0.4, hiss: 600 },
  clear:   { gain: 0,     tone: 500,  q: 0.4, hiss: 800 },
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
     Rain is two layers: a low patter (brown noise) and a bright hiss
     (white noise) — one alone never sounds like weather. It fades in
     and out so switching weather never clicks. */
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
      setTimeout(() => {
        try { bed.src.forEach((s) => s.stop()); } catch { /* already stopped */ }
      }, 1000);
    } catch { /* context gone */ }
  }, []);

  const setBed = useCallback((kind) => {
    const cfg = BEDS[kind] || BEDS.clear;
    if (!enabled || !cfg.gain) { stopBed(); return; }
    const ctx = ensure();
    if (!ctx) return;

    const current = bedRef.current;
    if (current && current.kind === kind) return;
    if (current) stopBed();

    /* the patter — brown noise, band-limited */
    const brown = ctx.createBufferSource();
    brown.buffer = noiseBuffer(ctx, 3);
    brown.loop = true;

    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = cfg.tone;
    band.Q.value = cfg.q;

    /* the hiss — white noise, high-passed */
    const white = ctx.createBufferSource();
    const wlen = Math.floor(ctx.sampleRate * 2);
    const wbuf = ctx.createBuffer(1, wlen, ctx.sampleRate);
    const wd = wbuf.getChannelData(0);
    for (let i = 0; i < wlen; i++) wd[i] = Math.random() * 2 - 1;
    white.buffer = wbuf;
    white.loop = true;

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = cfg.hiss;
    hp.Q.value = 0.6;

    const low = ctx.createBiquadFilter();
    low.type = 'lowpass';
    low.frequency.value = 340;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(cfg.gain, ctx.currentTime + 1.4);

    brown.connect(band).connect(gain);
    brown.connect(low).connect(gain);
    white.connect(hp).connect(gain);
    gain.connect(ctx.destination);
    brown.start();
    white.start();

    bedRef.current = { src: [brown, white], gain, kind };
  }, [enabled, ensure, noiseBuffer, stopBed]);

  /* ---- thunder ----
     `distance` 0 = overhead, 1 = far away. The delay and the timbre
     both fall off with distance, the way they do in the world.

     Real thunder ROLLS. That roll is not a filter sweep — it is
     several distinct slaps arriving at different moments because the
     sound reaches you by different paths. So it is built that way:
     a handful of decaying envelopes over brown noise, a bright crack
     for near strikes, and a sub-bass boom underneath. */
  const thunder = useCallback((distance = 0.4) => {
    const ctx = ensure();
    if (!ctx) return;
    const d = Math.max(0, Math.min(1, distance));
    const delay = d * 3.4;                 // light first, sound later
    const dur = 5.4 - d * 2.2;             // far thunder rolls longer
    const level = 0.46 * (1 - d * 0.6);
    const t0 = ctx.currentTime + delay;
    const sr = ctx.sampleRate;

    /* --- the crack: only for a near strike --- */
    if (d < 0.55) {
      const len = Math.floor(sr * 0.42);
      const buf = ctx.createBuffer(1, len, sr);
      const dd = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        const k = i / len;
        dd[i] = (Math.random() * 2 - 1) * Math.pow(1 - k, 3.2);
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 380;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 5600 - d * 2800;
      const g = ctx.createGain();
      g.gain.setValueAtTime(level * 1.15, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.4);
      src.connect(hp).connect(lp).connect(g).connect(ctx.destination);
      src.start(t0);
    }

    /* --- the roll --- */
    const len = Math.floor(sr * dur);
    const buf = ctx.createBuffer(1, len, sr);
    const dd = buf.getChannelData(0);

    /* several slaps arriving at different moments — this is the roll */
    const slaps = [];
    const n = 5 + Math.floor(Math.random() * 4);
    for (let i = 0; i < n; i++) {
      slaps.push({
        at: Math.random() * dur * 0.5,
        amp: 0.35 + Math.random() * 0.65,
        len: 0.35 + Math.random() * 1.7,
      });
    }

    const cutoff = 1600 - d * 1150;        // further away = duller
    const lpA = 1 - Math.exp(-2 * Math.PI * cutoff / sr);
    const hpA = 1 - Math.exp(-2 * Math.PI * 26 / sr);
    let lpState = 0;
    let hpState = 0;
    let brown = 0;

    for (let i = 0; i < len; i++) {
      const t = i / sr;
      let env = 0;
      for (const s of slaps) {
        if (t >= s.at) env += s.amp * Math.exp(-(t - s.at) / s.len);
      }
      env *= Math.exp(-t / (dur * 0.42));

      const white = Math.random() * 2 - 1;
      brown = (brown + 0.02 * white) / 1.02;
      let v = brown * 3.4 * env;

      lpState += lpA * (v - lpState);
      v = lpState;
      hpState += hpA * (v - hpState);
      v = v - hpState;

      dd[i] = v;
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(level, t0 + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(g).connect(ctx.destination);
    src.start(t0);

    /* --- the boom underneath --- */
    const osc = ctx.createOscillator();
    const og = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(62 - d * 16, t0);
    osc.frequency.exponentialRampToValueAtTime(24, t0 + 1.2);
    og.gain.setValueAtTime(0.0001, t0);
    og.gain.linearRampToValueAtTime(level * 0.9, t0 + 0.1);
    og.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.5);
    osc.connect(og).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + 1.6);
  }, [ensure]);

  const toggle = useCallback(() => setEnabled((v) => !v), []);

  useEffect(() => () => {
    try { ctxRef.current?.close(); } catch { /* already closed */ }
    ctxRef.current = null;
  }, []);

  return { enabled, setEnabled, toggle, play, setBed, thunder };
}
