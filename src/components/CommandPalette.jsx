import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Icon from './Icon.jsx';

/**
 * THE COMMAND PALETTE — ⌘K
 *
 * Everything on this site is reachable from one keystroke: every tab,
 * every project, every credential, every action. A portfolio is a
 * small application, and small applications should have a command
 * line.
 *
 * Deliberately instant. A keyboard-driven surface that opens with an
 * animation is a keyboard-driven surface you now have to wait for.
 */

/* --- fuzzy matching -------------------------------------------------
   A subsequence match with bonuses for word starts and runs of
   consecutive characters. Good enough to feel like it understands
   "ghinno" -> "GitHub Innovator", and cheap enough to run on every
   keystroke over a few hundred rows. */
function score(query, target) {
  if (!query) return 1;
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  const direct = t.indexOf(q);
  if (direct === 0) return 1000 - target.length;
  if (direct > 0) return 600 - direct - target.length * 0.2;

  let ti = 0;
  let s = 0;
  let run = 0;
  for (let qi = 0; qi < q.length; qi++) {
    const ch = q[qi];
    if (ch === ' ') continue;
    let found = -1;
    for (let k = ti; k < t.length; k++) {
      if (t[k] === ch) { found = k; break; }
    }
    if (found === -1) return 0;
    const prev = found > 0 ? t[found - 1] : ' ';
    if (found === ti && qi > 0) { run++; s += 12 + run * 6; }
    else { run = 0; s += 2; }
    if (prev === ' ' || prev === '-' || prev === '_' || prev === '/') s += 10;
    ti = found + 1;
  }
  return s - target.length * 0.15;
}

export default function CommandPalette({ onClose, commands, onRun }) {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  /* the input must be focused before the browser restores scroll */
  useEffect(() => {
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, []);

  const results = useMemo(() => {
    const base = query.trim()
      ? commands
        .map((c) => ({ c, s: Math.max(score(query, c.label), score(query, c.group) * 0.4) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 40)
        .map((r) => r.c)
      : commands.slice(0, 40);

    /* flag the first row of each group so the headers can be drawn
       without mutating anything during render */
    const flags = [];
    let previous = null;
    for (const cmd of base) {
      flags.push(cmd.group !== previous);
      previous = cmd.group;
    }
    return base.map((cmd, i) => ({ cmd, showGroup: flags[i] }));
  }, [commands, query]);

  /* the selection can never point past the end of the list */
  const active = Math.min(index, Math.max(0, results.length - 1));

  const run = useCallback((cmd) => {
    if (!cmd) return;
    onClose();
    // let the palette unmount before the action changes the page
    requestAnimationFrame(() => onRun(cmd.action));
  }, [onClose, onRun]);

  const onKeyDown = useCallback((e) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndex((i) => (results.length ? (i + 1) % results.length : 0));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      run(results[active]?.cmd);
      return;
    }
    if (e.key === 'Tab') {
      // trap focus inside the palette
      e.preventDefault();
    }
  }, [results, active, run, onClose]);

  useEffect(() => {
    if (!results.length) return;
    const el = listRef.current?.querySelector('.cp-item.is-active');
    el?.scrollIntoView({ block: 'nearest' });
  }, [active, results]);

  return (
    <div className="cp-overlay" onClick={onClose}>
      <div
        className="cp-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cp-search-row">
          <Icon name="search" size={15} />
          <input
            ref={inputRef}
            className="cp-input"
            type="text"
            value={query}
            placeholder="Jump to a project, tab, or action…"
            aria-label="Search commands"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            onChange={(e) => { setQuery(e.target.value); setIndex(0); }}
            onKeyDown={onKeyDown}
          />
          <button className="cp-esc" onClick={onClose} aria-label="Close palette">esc</button>
        </div>

        <div className="cp-list" ref={listRef}>
          {results.length === 0 && (
            <div className="cp-empty">
              <span className="cp-empty-mark">∅</span>
              <p>No match for “{query}”.</p>
            </div>
          )}
          {results.map(({ cmd, showGroup }, i) => (
            <React.Fragment key={cmd.id}>
              {showGroup && <div className="cp-group">{cmd.group}</div>}
              <button
                className={`cp-item${i === active ? ' is-active' : ''}`}
                onMouseEnter={() => setIndex(i)}
                onClick={() => run(cmd)}
              >
                {cmd.icon
                  ? <span className="cp-icon"><Icon name={cmd.icon} size={14} /></span>
                  : <span className="cp-icon cp-icon-dot" />}
                <span className="cp-label">{cmd.label}</span>
                {cmd.hint && <span className="cp-hint">{cmd.hint}</span>}
                {cmd.kbd && <span className="cp-kbd">{cmd.kbd}</span>}
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="cp-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> move</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> dismiss</span>
          <span className="cp-count">{results.length} of {commands.length}</span>
        </div>
      </div>
    </div>
  );
}
