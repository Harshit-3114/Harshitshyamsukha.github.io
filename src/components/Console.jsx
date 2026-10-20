import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { runShell, complete } from '../lib/shell.js';
import { buildVfs } from '../lib/vfs.js';
import { formatHour } from '../lib/sun.js';

/**
 * THE CONSOLE
 *
 * A shell, not a widget. It has a filesystem, a working directory, a
 * command history, tab completion and a prompt that tells you where
 * you are. On top of that it understands weather phrases, so you can
 * type "thor" and the sky cracks open.
 *
 * The terminal emulator lives here; the commands live in
 * src/lib/shell.js.
 */

const VFS = buildVfs();

export default function Console({
  username = 'Harshit-3114',
  ambience,
  onWeather,
  onAuto,
  onSound,
  onTheme,
  onSpectacle,
  onOpenProject,
  onDownloadResume,
  onSetHour,
  soundEnabled,
  open,
  onToggle,
  onRickroll,
}) {
  const [log, setLog] = useState([]);
  const [input, setInput] = useState('');
  const [typed, setTyped] = useState(0);
  const [rick, setRick] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyAt, setHistoryAt] = useState(-1);
  const [cwd, setCwd] = useState('/');
  const [openedCount, setOpenedCount] = useState(0);
  const [repos, setRepos] = useState([]);
  const [commits, setCommits] = useState([]);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  /* ---- the live GitHub readout, and the shell's data ---- */
  useEffect(() => {
    let alive = true;
    (async () => {
      const out = [];
      const push = (kind, text) => { if (alive) out.push({ kind, text }); };

      push('cmd', `$ gh api /users/${username}`);
      try {
        const res = await fetch(`https://api.github.com/users/${username}`);
        const u = await res.json();
        if (!alive) return;
        push('out', `  public_repos  ${u.public_repos}`);
        push('out', `  followers     ${u.followers}`);
        push('out', `  location      ${u.location || 'chennai, in'}`);
        push('out', `  joined        ${String(u.created_at || '').slice(0, 10)}`);
        push('ok', `  ✓ resolved ${u.login}`);
      } catch {
        push('err', '  ! offline — cached values');
      }

      push('cmd', `$ gh api /users/${username}/repos?sort=updated`);
      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        const json = await res.json();
        if (!alive || !Array.isArray(json)) return;
        const langs = {};
        json.forEach((r) => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
        const top = Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 4);
        top.forEach(([l, n]) => push('out', `  ${l.padEnd(12)} ${String(n).padStart(2)} repo${n > 1 ? 's' : ''}`));
        push('ok', `  ✓ ${json.length} repositories indexed`);
        setRepos(json.filter((r) => !r.fork).map((r) => ({
          name: r.name, language: r.language, stars: r.stargazers_count || 0,
        })));
      } catch {
        push('err', '  ! repo index unavailable');
      }

      if (alive) {
        setLog(out);
        /* the opening readout is already history — print it whole
           rather than making the visitor wait for it to type */
        setTyped(out.reduce((n, l) => n + l.text.length + 1, 0));
      }
    })();
    return () => { alive = false; };
  }, [username]);

  /* the commit history of this very site */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('https://api.github.com/repos/Harshit-3114/Harshitshyamsukha.github.io/commits?per_page=30');
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();
        if (alive && Array.isArray(json)) setCommits(json);
      } catch { /* offline: `git log` will say so */ }
    })();
    return () => { alive = false; };
  }, []);

  const print = useCallback((kind, text) => {
    setLog((prev) => [...prev, { kind, text }]);
  }, []);

  const flat = useMemo(() => log.map((l) => l.text).join('\n'), [log]);

  /* commit one character at a time */
  useEffect(() => {
    if (typed >= flat.length) return;
    const id = setTimeout(() => setTyped((t) => t + 1), 7);
    return () => clearTimeout(id);
  }, [typed, flat.length]);

  const rendered = useMemo(() => log.map((l, i) => {
    const start = log.slice(0, i).reduce((n, x) => n + x.text.length + 1, 0);
    const end = start + l.text.length;
    const shown = flat.slice(start, Math.min(end, typed));
    return { ...l, shown, cursorHere: typed <= end };
  }), [log, flat, typed]);

  const activeLine = rendered.findIndex((l) => l.cursorHere);

  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [rendered.length, rick, typed]);

  /* ---- the shell ---- */
  const execute = useCallback((raw) => {
    const text = String(raw || '').trim();
    if (!text) return;

    print('cmd', `${cwd} ❯ ${text}`);
    setHistory((h) => [text, ...h.filter((x) => x !== text)].slice(0, 40));
    setHistoryAt(-1);

    const result = runShell(text, {
      vfs: VFS,
      cwd,
      setCwd,
      ambience,
      soundEnabled,
      history,
      repos,
      commits,
      openedCount,
      sun: ambience.sun || {
        isDay: typeof document !== 'undefined' && document.documentElement.dataset.sunUp === 'true',
        elevation: 0,
        azimuth: 0,
        length: 1,
        shadowX: 0,
        sunrise: 6,
        sunset: 18,
      },
      onWeather,
      onAuto,
      onSound,
      onTheme,
      onSpectacle,
      onOpenProject: (id) => { setOpenedCount((n) => n + 1); onOpenProject?.(id); },
      onDownloadResume,
      onSetHour,
      onRickroll,
      onClear: () => { setLog([]); setTyped(0); },
    });

    setCwd(result.cwd);
    result.lines.forEach((l) => print(l.kind, l.text));
    if (result.lines.some((l) => l.kind === 'rick')) setRick(true);
  }, [cwd, print, ambience, soundEnabled, history, repos, commits, openedCount,
    onWeather, onAuto, onSound, onTheme, onSpectacle, onOpenProject, onDownloadResume, onSetHour, onRickroll]);

  const onKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      execute(input);
      setInput('');
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const matches = complete(input, { vfs: VFS, cwd });
      if (matches.length === 1) {
        const parts = input.split(/\s+/);
        parts[parts.length - 1] = matches[0];
        setInput(parts.join(' '));
      } else if (matches.length > 1) {
        print('dim', `  ${matches.join('   ')}`);
      }
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const next = historyAt === -1 ? 0 : Math.min(historyAt + 1, history.length - 1);
      setHistoryAt(next);
      setInput(history[next]);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyAt === -1) return;
      const next = historyAt - 1;
      setHistoryAt(next);
      setInput(next === -1 ? '' : history[next]);
    }
  }, [execute, input, history, historyAt, cwd, print]);

  const onSubmit = (e) => {
    e.preventDefault();
    execute(input);
    setInput('');
  };

  const hour = Math.floor(ambience.hour ?? 12);

  return (
    <div className={`console${open ? ' is-open' : ''}${rick ? ' is-rick' : ''}`}>
      <button
        className="console-head"
        onClick={onToggle}
        aria-expanded={open}
        aria-label="Toggle the console"
      >
        <span className="rt-lights"><i /><i /><i /></span>
        <span className="console-title">console — gh api · weather · shell</span>
        <span className="console-hint">try “thor”</span>
        <span className="rt-chevron"><Icon name="arrowUp" size={11} style={{ transform: open ? 'rotate(180deg)' : 'none' }} /></span>
      </button>

      {open && (
        <div className="console-body" ref={bodyRef}>
          {rendered.map((l, i) => (
            <div key={i} className={`rt-line rt-${l.kind}`}>
              {l.shown}
              {l.cursorHere && i === activeLine && <span className="rt-cursor" />}
            </div>
          ))}
          {rendered.length === 0 && <div className="rt-line rt-cmd"><span className="rt-cursor" /></div>}

          {rick && (
            <div className="rt-rickroll">
              <div className="rt-dancer">
                <span className="rt-dancer-head" />
                <span className="rt-dancer-body" />
                <span className="rt-dancer-arm rt-dancer-arm-l" />
                <span className="rt-dancer-arm rt-dancer-arm-r" />
                <span className="rt-dancer-leg rt-dancer-leg-l" />
                <span className="rt-dancer-leg rt-dancer-leg-r" />
              </div>
              <div className="rt-rick-text">
                <span className="rt-rick-stamp">RICKROLL</span>
                <span className="rt-rick-line">Never gonna give you up</span>
                <span className="rt-rick-line">Never gonna let you down</span>
              </div>
            </div>
          )}

          <form className="console-input-row" onSubmit={onSubmit}>
            <span className="console-prompt">{cwd} ❯</span>
            <input
              ref={inputRef}
              className="console-input"
              type="text"
              value={input}
              placeholder="ls · cat · tree · weather thor · sun 17 · help"
              aria-label="Console command"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
            />
          </form>

          {/* the light table — drag the sun across the day */}
          <div className="console-sun">
            <span className="console-sun-label">☀</span>
            <input
              className="console-sun-range"
              type="range"
              min="0"
              max="23.5"
              step="0.5"
              value={hour}
              aria-label="Time of day"
              onChange={(e) => onSetHour?.(parseFloat(e.target.value))}
            />
            <span className="console-sun-time">{formatHour(ambience.hour ?? 12)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
