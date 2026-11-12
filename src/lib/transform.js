/**
 * THE TRANSFORMER
 *
 * A transformer does not set a class on <body>. It reads a sequence
 * of tokens, attends over them with a query, and writes a new
 * representation back out. This is that, applied to a layout.
 *
 * Every meaningful piece of the site is a TOKEN. Each token carries an
 * embedding that says how strongly it responds to each of five style
 * AXES:
 *
 *   density   how much room the layout gives itself
 *   emphasis  how hard the hierarchy shouts
 *   temp      the colour of the light
 *   gravity   how vertical the page stands
 *   flow      how the content reads
 *
 * The user's intent is a QUERY — a vector over those axes. Attention
 * is scaled dot-product attention between that query and the tokens'
 * own keys, so the elements that best match the intent receive the
 * most of it, and the ones that do not, do not.
 *
 * The output is per-element. A "loud" transform hits a section title
 * hard and a caption barely; a "dense" transform closes the bento
 * grid and leaves the hero alone. That is the whole difference
 * between a transformer and a stylesheet switch.
 *
 * The intent itself can come from a real language model: the NEURAL
 * path embeds the visitor's sentence with a transformer encoder and
 * compares it against each axis's anchors — zero-shot classification,
 * the same trick every zero-shot classifier uses.
 */

/* ------------------------------------------------------------
   THE AXES
   ------------------------------------------------------------ */
export const AXES = [
  {
    id: 'density',
    label: 'Density',
    neg: 'airy',
    pos: 'dense',
    desc: 'how much room the layout gives itself',
    negAnchors: [
      'spacious', 'airy', 'roomy', 'breathing room', 'open', 'minimal whitespace',
      'elegant', 'generous', 'relaxed',
    ],
    posAnchors: [
      'tight', 'compact', 'dense', 'packed', 'cramped', 'condensed', 'squeezed',
      'information dense', 'utilitarian', 'crammed',
    ],
  },
  {
    id: 'emphasis',
    label: 'Emphasis',
    neg: 'quiet',
    pos: 'loud',
    desc: 'how hard the hierarchy shouts',
    negAnchors: [
      'quiet', 'subtle', 'understated', 'muted', 'restrained', 'gentle', 'whisper',
      'soft', 'humble', 'low key',
    ],
    posAnchors: [
      'loud', 'bold', 'emphatic', 'shouty', 'dramatic', 'punchy', 'stark',
      'attention grabbing', 'insistent', 'strident',
    ],
  },
  {
    id: 'temp',
    label: 'Temperature',
    neg: 'cold',
    pos: 'warm',
    desc: 'the colour of the light',
    negAnchors: [
      'cold', 'cool', 'icy', 'clinical', 'sterile', 'blue', 'winter', 'arctic',
      'cold blooded', 'cautious',
    ],
    posAnchors: [
      'warm', 'cozy', 'sunny', 'amber', 'sepia', 'summer', 'inviting', 'fire',
      'golden', 'candid',
    ],
  },
  {
    id: 'gravity',
    label: 'Gravity',
    neg: 'flat',
    pos: 'tall',
    desc: 'how vertical the page stands',
    negAnchors: [
      'flat', 'horizontal', 'grounded', 'low', 'wide', 'spread out', 'casual',
      'landscape', 'relaxed horizontal',
    ],
    posAnchors: [
      'tall', 'vertical', 'upright', 'monumental', 'towering', 'lofty', 'soaring',
      'portrait', 'columnar', 'upward',
    ],
  },
  {
    id: 'flow',
    label: 'Flow',
    neg: 'gridded',
    pos: 'editorial',
    desc: 'how the content reads',
    negAnchors: [
      'technical', 'gridded', 'systematic', 'tabular', 'structured', 'dashboard',
      'data', 'engineered', 'schematic', 'matrix',
    ],
    posAnchors: [
      'editorial', 'magazine', 'literary', 'prose', 'narrative', 'journal',
      'flowing', 'book', 'essay', 'feature',
    ],
  },
];

/* every anchor, in one list — used by the keyword matcher */
AXES.forEach((ax) => {
  ax.anchors = [...ax.negAnchors, ...ax.posAnchors];
});

/* ------------------------------------------------------------
   PRESETS — hand-authored queries, always available
   ------------------------------------------------------------ */
export const PRESETS = [
  { id: 'reset', label: 'reset', hint: 'the site as it is', q: [0, 0, 0, 0, 0] },
  { id: 'dense', label: 'dense', hint: 'packed, information-first', q: [0.95, 0.35, -0.15, -0.1, -0.45] },
  { id: 'airy', label: 'airy', hint: 'room to breathe', q: [-0.95, -0.3, 0.15, 0.2, 0.5] },
  { id: 'loud', label: 'loud', hint: 'the hierarchy shouts', q: [0.1, 1, 0.15, 0.3, -0.1] },
  { id: 'quiet', label: 'quiet', hint: 'nothing raises its voice', q: [0, -1, -0.1, -0.25, 0.35] },
  { id: 'cold', label: 'cold', hint: 'clinical, blue, precise', q: [0.2, 0.3, -1, 0.1, 0.15] },
  { id: 'warm', label: 'warm', hint: 'amber and human', q: [-0.1, -0.15, 1, 0.1, 0.2] },
  { id: 'tall', label: 'tall', hint: 'vertical, monumental', q: [0, 0.25, 0, 1, 0.35] },
  { id: 'editorial', label: 'editorial', hint: 'a magazine spread', q: [-0.35, 0.05, 0.1, 0.35, 1] },
  { id: 'technical', label: 'technical', hint: 'a schematic', q: [0.55, 0.4, -0.3, -0.15, -1] },
  { id: 'wonk', label: 'wonk', hint: 'the type gets a personality', q: [0, 0.85, 0.15, 0.2, 0.3] },
];

/* ------------------------------------------------------------
   AFFINITY — how much each kind of element responds to each axis
   ------------------------------------------------------------ */
export const AFFINITY = {
  hero:   { density: 0.15, emphasis: 0.95, temp: 0.55, gravity: 0.95, flow: 0.7 },
  lede:   { density: 0.10, emphasis: 0.55, temp: 0.50, gravity: 0.30, flow: 0.95 },
  title:  { density: 0.15, emphasis: 1.00, temp: 0.45, gravity: 0.80, flow: 0.50 },
  card:   { density: 0.90, emphasis: 0.60, temp: 0.60, gravity: 0.25, flow: 0.45 },
  panel:  { density: 0.70, emphasis: 0.45, temp: 0.55, gravity: 0.20, flow: 0.30 },
  label:  { density: 0.15, emphasis: 0.30, temp: 0.35, gravity: 0.10, flow: 0.20 },
  caption:{ density: 0.20, emphasis: 0.25, temp: 0.30, gravity: 0.15, flow: 0.55 },
  body:   { density: 0.25, emphasis: 0.35, temp: 0.40, gravity: 0.30, flow: 0.70 },
  chrome: { density: 0.40, emphasis: 0.50, temp: 0.40, gravity: 0.20, flow: 0.20 },
};

/* ------------------------------------------------------------
   THE TOKENS — the elements the transformer reads
   ------------------------------------------------------------ */
export const TOKEN_SELECTORS = [
  { sel: '.about-name', kind: 'hero' },
  { sel: '.about-role', kind: 'lede' },
  { sel: '.about-status', kind: 'label' },
  { sel: '.now-strip', kind: 'body' },
  { sel: '.about-avatar-wrap', kind: 'chrome' },
  { sel: '.about-hero-right', kind: 'panel' },
  { sel: '.about-panel', kind: 'panel' },
  { sel: '.eyebrow', kind: 'label' },
  { sel: '.about-card', kind: 'card' },
  { sel: '.about-card-title', kind: 'title' },
  { sel: '.about-card-row', kind: 'caption' },
  { sel: '.section-title', kind: 'title' },
  { sel: '.grid-head-note', kind: 'caption' },
  { sel: '.pin-cell', kind: 'card' },
  { sel: '.pin-title', kind: 'title' },
  { sel: '.pin-desc', kind: 'caption' },
  { sel: '.pin-category', kind: 'label' },
  { sel: '.constellation', kind: 'panel' },
  { sel: '.commit-log', kind: 'panel' },
  { sel: '.process-content', kind: 'body' },
  { sel: '.contact-wrap', kind: 'card' },
  { sel: '.footer', kind: 'body' },
  { sel: '.nav-pill', kind: 'chrome' },
  { sel: '.status-bar', kind: 'chrome' },
];

const dot = (a, b) => a.reduce((s, v, i) => s + v * (b[i] ?? 0), 0);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/**
 * Collect the tokens from the live DOM.
 *
 * The embedding of a token is not a learned vector — it is its
 * affinity: which axes it listens to. That is the only thing that
 * matters for how it should respond.
 */
export function collectTokens(root = document) {
  const tokens = [];
  const seen = new Set();
  TOKEN_SELECTORS.forEach(({ sel, kind }) => {
    let nodes;
    try { nodes = root.querySelectorAll(sel); } catch { return; }
    nodes.forEach((el, i) => {
      if (seen.has(el)) return;
      seen.add(el);
      tokens.push({
        id: `${kind}-${sel.replace(/[^a-z]/gi, '')}-${i}`,
        el,
        kind,
        affinity: { ...AFFINITY[kind] },
      });
    });
  });
  return tokens;
}

/**
 * THE ATTENTION
 *
 * Scaled dot-product attention between the intent and every token,
 * then the value vectors are written back per token.
 *
 * The softmax is sharpened by a temperature: at a high temperature
 * the intent spreads evenly over the page; at a low one it
 * concentrates on the few elements that actually match. That knob is
 * the difference between "restyle everything" and "make this part
 * louder".
 */
export function attend(tokens, q, { temperature = 0.45, scale = 1 } = {}) {
  const d = AXES.length;
  const keys = tokens.map((t) => AXES.map((ax) => t.affinity[ax.id] ?? 0));

  const scores = keys.map((k) => dot(q, k) / Math.sqrt(d));
  const max = Math.max(...scores, -Infinity);
  const exps = scores.map((s) => Math.exp((s - max) / temperature));
  const sum = exps.reduce((a, b) => a + b, 0) || 1;
  const alpha = exps.map((e) => e / sum);

  /* the most-attended token defines the scale, so one element can
     reach full strength without everything else becoming noise */
  const peak = Math.max(...alpha, 1e-6);

  const elements = tokens.map((t, i) => {
    const a = alpha[i] / peak;
    const axes = {};
    AXES.forEach((ax, j) => {
      axes[ax.id] = clamp(q[j] * a * (t.affinity[ax.id] ?? 0) * scale, -1, 1);
    });
    return { id: t.id, el: t.el, kind: t.kind, attention: a, axes };
  });

  return { elements, alpha };
}

/** A query from a preset id. */
export function presetQuery(id) {
  const p = PRESETS.find((x) => x.id === id);
  return p ? [...p.q] : [0, 0, 0, 0, 0];
}

/**
 * A query from a sentence, without a model.
 *
 * This is the fallback when the neural encoder is not loaded. It is
 * honest about what it is: a keyword matcher. The neural path does
 * the same job with a real transformer, and does it better, because
 * it understands "make it feel like a 1980s mainframe" without
 * having been told what that means.
 */
export function keywordQuery(text) {
  const t = String(text || '').toLowerCase();
  const q = [0, 0, 0, 0, 0];
  let hits = 0;
  AXES.forEach((ax, j) => {
    let score = 0;
    ax.anchors.forEach((a) => {
      const words = a.split(' ');
      if (t.includes(a)) score += 1.2;
      else if (words.some((w) => w.length > 4 && t.includes(w))) score += 0.5;
    });
    if (score > 0) {
      hits++;
      q[j] = clamp(score / 2.2, 0, 1);
    }
  });
  if (!hits) return null;
  return q;
}
