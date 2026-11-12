/**
 * THE ENCODER BENCHMARK
 *
 * Proves that the neural path works before the site depends on it.
 *
 * It loads the same encoder the browser loads (Xenova/all-MiniLM-L6-v2,
 * quantised to q8) and checks the thing that actually matters: that the
 * embeddings mean something. "make it colder and quieter" should sit
 * closer to "colder" than to "louder", and closer to "colder" than to a
 * mainframe terminal — the anchor phrases the transformer classifies
 * against are the same kind of thing.
 *
 *     node scripts/embed-bench.mjs
 *
 * The first run downloads the model (~23 MB) into the transformers
 * cache; later runs reuse it.
 */

import { pipeline, env } from '@huggingface/transformers';

env.allowLocalModels = false;

const MODEL = 'Xenova/all-MiniLM-L6-v2';

const t0 = Date.now();
const fe = await pipeline('feature-extraction', MODEL, { dtype: 'q8' });
console.log(`model    ${MODEL}`);
console.log(`load     ${Date.now() - t0} ms`);

const embed = async (s) => {
  const out = await fe(s, { pooling: 'mean', normalize: true });
  return Array.from(out.data);
};
const cos = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);

const t1 = Date.now();
const A = await embed('make it colder and quieter');
const B = await embed('colder');
const C = await embed('louder');
const D = await embed('like a 1980s mainframe terminal');
console.log(`embed    ${Date.now() - t1} ms for 4 sentences, dim ${A.length}`);

console.log('');
console.log(`A·B  cold       ${cos(A, B).toFixed(3)}   expect high`);
console.log(`A·C  loud       ${cos(A, C).toFixed(3)}   expect low`);
console.log(`A·D  mainframe  ${cos(A, D).toFixed(3)}   expect low`);

const cold = cos(A, B);
const loud = cos(A, C);
console.log('');
if (cold > loud) {
  console.log(`PASS   cold (${cold.toFixed(3)}) > loud (${loud.toFixed(3)}) — the encoder separates the axes`);
} else {
  console.log(`FAIL   cold (${cold.toFixed(3)}) did not beat loud (${loud.toFixed(3)})`);
  process.exitCode = 1;
}
