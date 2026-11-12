/**
 * THE NEURAL PATH
 *
 * A real transformer, running in the browser, doing real work.
 *
 * The model is a MiniLM sentence encoder — six layers, 384
 * dimensions, 23 MB quantised. It runs through ONNX Runtime in a
 * Web Worker; nothing leaves the machine and nothing is sent to an
 * API.
 *
 * What it does is zero-shot classification, the same trick every
 * zero-shot classifier uses: embed the visitor's sentence, embed a
 * set of anchor phrases, and compare. "make it feel like a 1980s
 * mainframe" lands on technical + dense + cold even though none of
 * those words are in it — because the encoder knows what a mainframe
 * feels like.
 *
 * The model is loaded only when the visitor asks for it. Until then
 * the keyword matcher handles the presets, and the site is no heavier
 * than it was.
 */

import { AXES } from './transform.js';

const MODEL = 'Xenova/all-MiniLM-L6-v2';

let pipePromise = null;
let anchorPromise = null;

export function isLoaded() {
  return !!pipePromise;
}

async function getPipe(onProgress) {
  if (!pipePromise) {
    pipePromise = (async () => {
      const mod = await import('@huggingface/transformers');
      const { pipeline, env } = mod;
      env.allowLocalModels = false;
      const progress_callback = onProgress
        ? (p) => {
          if (p.status === 'progress' && p.total) {
            onProgress({ file: p.file, loaded: p.loaded, total: p.total });
          } else if (p.status === 'ready' || p.status === 'done') {
            onProgress({ file: p.file, loaded: 1, total: 1, done: true });
          }
        }
        : undefined;
      return pipeline('feature-extraction', MODEL, { dtype: 'q8', progress_callback });
    })();
  }
  return pipePromise;
}

/** Load the encoder. `onProgress` receives { loaded, total } in bytes. */
export async function loadEncoder(onProgress) {
  const pipe = await getPipe(onProgress);
  /* a warm-up pass so the first real prompt is not the slow one */
  await embed(pipe, ['warm up']);
  return true;
}

async function embed(pipe, texts) {
  const out = await pipe(texts, { pooling: 'mean', normalize: true });
  const dims = out.dims;
  const n = dims[0];
  const dim = dims[dims.length - 1];
  const data = out.data;
  const rows = [];
  for (let i = 0; i < n; i++) {
    rows.push(Array.from(data.slice(i * dim, (i + 1) * dim)));
  }
  return rows;
}

const cos = (a, b) => {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
};

/** Embed every anchor phrase once, then keep it. */
async function anchorVectors(pipe) {
  if (!anchorPromise) {
    anchorPromise = (async () => {
      const list = [];
      const index = [];
      AXES.forEach((ax, j) => {
        ax.negAnchors.forEach((t) => { list.push(t); index.push([j, -1]); });
        ax.posAnchors.forEach((t) => { list.push(t); index.push([j, 1]); });
      });
      const rows = await embed(pipe, list);
      const out = AXES.map(() => ({ neg: [], pos: [] }));
      rows.forEach((r, i) => {
        const [j, sign] = index[i];
        if (sign < 0) out[j].neg.push(r);
        else out[j].pos.push(r);
      });
      return out;
    })();
  }
  return anchorPromise;
}

/**
 * Turn a sentence into a query over the five axes.
 *
 * Returns null when the sentence is not about style at all.
 */
export async function promptToQuery(text, onProgress) {
  const pipe = await getPipe(onProgress);
  const [anchors, qv] = await Promise.all([anchorVectors(pipe), embed(pipe, [text])]);
  const vector = qv[0];

  const q = [];
  const detail = [];
  AXES.forEach((ax, j) => {
    const simPos = Math.max(...anchors[j].pos.map((v) => cos(vector, v)));
    const simNeg = Math.max(...anchors[j].neg.map((v) => cos(vector, v)));
    const raw = (simPos - simNeg) / (simPos + simNeg + 1e-6);
    q.push(Math.max(-1, Math.min(1, raw * 2.2)));
    detail.push({ id: ax.id, label: ax.label, value: q[j], simPos, simNeg });
  });

  const peak = Math.max(...q.map((v) => Math.abs(v)));
  if (peak < 0.08) return null;

  return { q, detail, model: MODEL };
}
