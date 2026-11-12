/**
 * THE TRANSFORM PANEL
 *
 * The controls for the transformer: a prompt box, the hand-authored
 * presets, the five axes as live meters, and the focus dial.
 *
 * The panel is presentational. The state lives in the hook, which the
 * app owns, so the console can drive the same transformer without
 * going through the UI.
 */

import React, { useEffect, useRef, useState } from 'react';
import { PRESETS } from '../lib/transform.js';

const fmt = (v) => (v > 0 ? `+${v.toFixed(2)}` : v.toFixed(2));

export default function TransformPanel({
  active,
  readout,
  source,
  detail,
  showAttention,
  focus,
  neuralReady,
  neuralLoading,
  neuralProgress,
  neuralError,
  applyPreset,
  loadNeural,
  runPrompt,
  setFocus,
  setShowAttention,
  reset,
  onClose,
}) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (active) inputRef.current?.focus();
  }, [active]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); runPrompt(text); }
  };

  /* the source line under the prompt */
  let sourceLine = null;
  if (source?.kind === 'preset') sourceLine = `preset · ${source.label}`;
  else if (source?.kind === 'keyword') sourceLine = `keyword match · ${source.label}`;
  else if (source?.kind === 'neural') sourceLine = `neural · ${source.label}`;
  else if (source?.kind === 'miss') sourceLine = 'no style signal found';

  return (
    <aside className="tf-panel" role="dialog" aria-label="The transformer">
      <div className="tf-panel-hdr">
        <span className={`tf-dot${active ? ' is-on' : ''}`} aria-hidden="true" />
        <span className="rt-title">transformer</span>
        <button type="button" className="tf-panel-close" onClick={onClose} aria-label="Close the transformer">
          close
        </button>
      </div>

      <div className="tf-panel-body">
        <div className="tf-prompt-row">
          <input
            ref={inputRef}
            className="tf-prompt"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={'describe a look — "like a 1980s mainframe"'}
            aria-label="Describe the style you want"
          />
          <button type="button" className="tf-go" onClick={() => runPrompt(text)} disabled={neuralLoading || !text.trim()}>
            go
          </button>
        </div>

        {sourceLine && <p className="tf-note">source · <b>{sourceLine}</b></p>}
        {neuralError && <p className="tf-note tf-note-err">· <b>{neuralError}</b></p>}

        <p className="tf-section-label">presets</p>
        <div className="tf-chips">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className="tf-chip"
              title={p.hint}
              onClick={() => applyPreset(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <p className="tf-section-label">axes</p>
        <div className="tf-axes">
          {readout.map((ax) => {
            const pct = Math.abs(ax.value) * 50;
            const left = ax.value >= 0 ? 50 : 50 - pct;
            return (
              <div className="tf-axis" key={ax.id} title={`${ax.desc} · ${ax.neg} ↔ ${ax.pos}`}>
                <span className="tf-axis-name">{ax.label}</span>
                <span className="tf-axis-track">
                  <span className="tf-axis-zero" />
                  <span className="tf-axis-fill" style={{ left: `${left}%`, width: `${pct}%` }} />
                </span>
                <span className="tf-axis-val">{fmt(ax.value)}</span>
              </div>
            );
          })}
        </div>

        <p className="tf-section-label">focus</p>
        <div className="tf-axis tf-focus-row">
          <span className="tf-axis-name">attention</span>
          <input
            className="tf-range"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={focus}
            onChange={(e) => setFocus(Number(e.target.value))}
            aria-label="Attention focus — higher concentrates the intent on fewer elements"
          />
          <span className="tf-axis-val">{focus.toFixed(2)}</span>
        </div>
        <p className="tf-note">
          high focus concentrates the intent on the elements that match it;
          low focus spreads it across the whole page.
        </p>

        <label className={`tf-toggle${showAttention ? ' is-on' : ''}`}>
          <input
            type="checkbox"
            checked={showAttention}
            onChange={(e) => setShowAttention(e.target.checked)}
          />
          show the attention map
        </label>

        <div className="tf-neural">
          {neuralReady ? (
            <p className="tf-note">
              the encoder is loaded — your sentence is read by a real transformer
              running on this machine. <b>nothing leaves the browser.</b>
            </p>
          ) : (
            <button type="button" className="tf-neural-btn" onClick={loadNeural} disabled={neuralLoading}>
              {neuralLoading ? 'loading the encoder…' : 'load the neural encoder'}
            </button>
          )}
          {neuralProgress && neuralProgress.total > 0 && (
            <div className="tf-bar">
              <span style={{ width: `${Math.round((neuralProgress.loaded / neuralProgress.total) * 100)}%` }} />
            </div>
          )}
          {detail && detail.length > 0 && (
            <p className="tf-note">
              {detail.map((d) => `${d.label} ${fmt(d.value)}`).join(' · ')}
            </p>
          )}
        </div>

        <button type="button" className="tf-neural-btn tf-reset" onClick={reset}>
          reset the site
        </button>
      </div>
    </aside>
  );
}
