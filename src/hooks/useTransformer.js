import { useCallback, useEffect, useState } from 'react';
import { AXES, PRESETS, attend, collectTokens, keywordQuery, presetQuery } from '../lib/transform.js';

/**
 * THE TRANSFORMER HOOK
 *
 * Holds the intent, runs the attention over the live DOM, and writes
 * the result back as CSS custom properties. Nothing is re-rendered by
 * React when the transform changes — the browser does the work, which
 * is why dragging the focus slider stays at 60fps.
 *
 * The transform is OFF until the visitor asks for it. A site that
 * transforms itself unprompted is a site nobody can read.
 */

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export default function useTransformer({ tab } = {}) {
  const [active, setActive] = useState(false);
  const [query, setQuery] = useState([0, 0, 0, 0, 0]);
  const [source, setSource] = useState(null);
  const [showAttention, setShowAttention] = useState(false);
  const [focus, setFocus] = useState(0.45);
  const [detail, setDetail] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [neuralReady, setNeuralReady] = useState(false);
  const [neuralLoading, setNeuralLoading] = useState(false);
  const [neuralProgress, setNeuralProgress] = useState(null);
  const [neuralError, setNeuralError] = useState(null);

  /* ---- collect the tokens whenever the page changes shape ---- */
  useEffect(() => {
    const id = setTimeout(() => {
      setTokens(collectTokens(document));
    }, 120);
    return () => clearTimeout(id);
  }, [tab]);

  /* ---- write the transform onto the document ---- */
  const apply = useCallback((q, nextFocus, viz) => {
    const root = document.documentElement;
    if (!q || !q.some((v) => v !== 0)) {
      root.dataset.tf = 'off';
      root.style.removeProperty('--tf-density');
      root.style.removeProperty('--tf-emphasis');
      root.style.removeProperty('--tf-temp');
      root.style.removeProperty('--tf-gravity');
      root.style.removeProperty('--tf-flow');
      root.style.removeProperty('--tf-sharp');
      root.style.removeProperty('--tf-scale');
      root.style.removeProperty('--tf-col-a');
      root.style.removeProperty('--tf-col-b');
      root.style.removeProperty('--tf-measure');
      root.style.removeProperty('--tf-lead');
      document.querySelectorAll('[data-tf]').forEach((el) => {
        el.removeAttribute('data-tf');
        el.style.removeProperty('--tf-a');
        el.style.removeProperty('--tf-e');
        el.style.removeProperty('--tf-d');
      });
      return;
    }

    const [density, emphasis, temp, gravity, flow] = q;

    root.dataset.tf = 'on';
    root.style.setProperty('--tf-density', density.toFixed(3));
    root.style.setProperty('--tf-emphasis', emphasis.toFixed(3));
    root.style.setProperty('--tf-temp', temp.toFixed(3));
    root.style.setProperty('--tf-gravity', gravity.toFixed(3));
    root.style.setProperty('--tf-flow', flow.toFixed(3));
    root.style.setProperty('--tf-sharp', clamp(-(density * 0.4 + emphasis * 0.3), -1, 1).toFixed(3));
    root.style.setProperty('--tf-scale', (1 + emphasis * 0.05 + gravity * 0.05).toFixed(3));
    root.style.setProperty('--tf-col-a', (1.05 + flow * 0.3).toFixed(2));
    root.style.setProperty('--tf-col-b', (0.95 - flow * 0.3).toFixed(2));
    root.style.setProperty('--tf-measure', `${Math.round(44 - flow * 8)}ch`);
    root.style.setProperty('--tf-lead', (density * 0.12 + flow * 0.06).toFixed(3));
    root.classList.toggle('tf-viz', !!viz);

    const live = collectTokens(document);
    /* focus is a concentration dial: 1 sharpens the softmax onto the few
       elements that match, 0 spreads it across the page. The attention
       function takes a temperature, which runs the other way, so the
       dial is inverted here - and never reaches zero, because a zero
       temperature makes the max term NaN. */
    const temperature = 0.15 + (1 - nextFocus) * 0.85;
    const { elements } = attend(live, q, { temperature });
    elements.forEach((el) => {
      el.el.setAttribute('data-tf', el.kind);
      el.el.style.setProperty('--tf-a', el.attention.toFixed(3));
      el.el.style.setProperty('--tf-e', el.axes.emphasis.toFixed(3));
      el.el.style.setProperty('--tf-d', el.axes.density.toFixed(3));
    });
  }, []);

  /* re-apply when the query, the focus or the tokens change */
  useEffect(() => {
    if (!active) return;
    apply(query, focus, showAttention);
  }, [active, query, focus, showAttention, tokens, apply]);

  useEffect(() => {
    if (!active) apply([0, 0, 0, 0, 0], focus, false);
  }, [active, apply, focus]);

  /* keep the viz class in sync when it is toggled while off */
  useEffect(() => {
    document.documentElement.classList.toggle('tf-viz', showAttention && active);
  }, [showAttention, active]);

  const applyPreset = useCallback((id) => {
    const q = presetQuery(id);
    setQuery(q);
    setSource({ kind: 'preset', label: PRESETS.find((p) => p.id === id)?.label || id });
    setActive(true);
  }, []);

  const applyText = useCallback((text) => {
    const q = keywordQuery(text);
    if (!q) {
      setSource({ kind: 'miss', label: 'no style signal found' });
      return false;
    }
    setQuery(q);
    setSource({ kind: 'keyword', label: text });
    setActive(true);
    return true;
  }, []);

  const setNeuralQuery = useCallback((q, info) => {
    setQuery(q);
    setSource({ kind: 'neural', label: info?.label || 'neural', detail: info?.detail });
    setActive(true);
  }, []);

  /* ---- the neural path --------------------------------------------
     The encoder is 23 MB of quantised weights. It is only ever
     downloaded because the visitor asked for it, and it stays in this
     machine — the page never calls an API with what they type. */
  const loadNeural = useCallback(async () => {
    setNeuralLoading(true);
    setNeuralError(null);
    setNeuralProgress({ loaded: 0, total: 0 });
    try {
      const { loadEncoder } = await import('../lib/neural.js');
      await loadEncoder((p) => setNeuralProgress(p));
      setNeuralReady(true);
      setNeuralProgress(null);
      return true;
    } catch {
      setNeuralError('the encoder could not be loaded — the keyword path still works');
      setNeuralProgress(null);
      return false;
    } finally {
      setNeuralLoading(false);
    }
  }, []);

  /* Read a sentence down whichever path is available. */
  const runPrompt = useCallback(async (text) => {
    const t = String(text || '').trim();
    if (!t) return false;

    if (neuralReady) {
      setNeuralError(null);
      try {
        const { promptToQuery } = await import('../lib/neural.js');
        const result = await promptToQuery(t);
        if (!result) {
          setSource({ kind: 'miss', label: 'no style signal found' });
          setNeuralError('no style signal in that sentence');
          return false;
        }
        setNeuralQuery(result.q, { label: t, detail: result.detail });
        return true;
      } catch {
        setNeuralError('the encoder failed — falling back to keywords');
        return applyText(t);
      }
    }

    const ok = applyText(t);
    if (!ok) setNeuralError('no style signal in that sentence');
    return ok;
  }, [neuralReady, setNeuralQuery, applyText]);

  const reset = useCallback(() => {
    setActive(false);
    setQuery([0, 0, 0, 0, 0]);
    setSource(null);
    setDetail(null);
    setNeuralError(null);
  }, []);

  const readout = AXES.map((ax, i) => ({
    id: ax.id,
    label: ax.label,
    neg: ax.neg,
    pos: ax.pos,
    desc: ax.desc,
    value: query[i] || 0,
  }));

  return {
    active, query, source, detail, readout, showAttention, focus, tokens,
    neuralReady, neuralLoading, neuralProgress, neuralError,
    setActive, setShowAttention, setFocus, setQuery, setDetail,
    applyPreset, applyText, setNeuralQuery, loadNeural, runPrompt, reset, apply,
  };
}
