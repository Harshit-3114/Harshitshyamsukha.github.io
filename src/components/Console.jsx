import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { parseCommand, COMMAND_HINTS, WEATHER_COMMANDS, SPECTACLES } from '../lib/weather-commands.js';

/**
 * THE CONSOLE
 *
 * A command line in the corner of the page. It does two jobs:
 *
 *   1. It reports on the real world — the GitHub API, live.
 *   2. It takes instructions. Type "thor" and the sky cracks open.
 *      Type "let it rain" and it does. Type "help" and it tells you
 *      what it is and what it is currently doing.
 *
 * The weather commands are the point. There are plain ones (rain, fog,
 * snow) and there are film ones (thor, shazam, blade runner, mordor,
 * winterfell, the matrix, sunday Bloody Sunday). Every one of them
 * lands in the same lighting model the live forecast uses, so the site
 * never has two different ideas of what the weather looks like.
 */

const SECRET_CODES = [
  'rickroll',
  'rick astley',
  'never gonna give you up',
  'never gonna let you down',
  'up up down down left right left right b a',
  'dqw4w9wgxcq',
];

const isSecret = (t) => {
  const s = t.toLowerCase().replace(/\s+/g, ' ').trim();
  return SECRET_CODES.some((c) => s.includes(c));
};

/* the universes, in the order they are printed */
const UNIVERSES = ['Marvel', 'DC', 'Netflix', 'Hotstar', 'Prime Video', 'Hulu', 'Peacock', 'HBO', 'Cinema', 'Weather'];

/* the plain-language groups — weather, time of day, and the places */
const WEATHER_GROUPS = [
  { title: 'Weather', items: ['rain', 'snow', 'storm', 'fog', 'wind', 'drizzle', 'clear', 'overcast'] },
  { title: 'Time', items: ['midnight', 'sunset', 'dawn', 'golden hour', 'first light'] },
  { title: 'Places & films', items: ['thor', 'shazam', 'blade runner', 'the matrix', 'wednesday', 'mordor', 'winterfell', 'gotham', 'jurassic park', 'inception', 'hogwarts'] },
];

const phrasesFor = (universe) => WEATHER_COMMANDS
  .filter((c) => c.from === universe)
  .map((c) => c.phrases[0]);

const SPECTACLE_PHRASES = SPECTACLES.map((s) => s.phrases[0]);

export default function Console({
  username = 'Harshit-3114',
  ambience,
  onWeather,
  onAuto,
  onSound,
  onTheme,
  onSpectacle,
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
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  /* ---- the live GitHub readout ---- */
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
        const repos = await res.json();
        if (!alive || !Array.isArray(repos)) return;
        const langs = {};
        repos.forEach((r) => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
        const top = Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 4);
        top.forEach(([l, n]) => push('out', `  ${l.padEnd(12)} ${String(n).padStart(2)} repo${n > 1 ? 's' : ''}`));
        push('ok', `  ✓ ${repos.length} repositories indexed`);
      } catch {
        push('err', '  ! repo index unavailable');
      }

      if (alive) setLog(out);
    })();
    return () => { alive = false; };
  }, [username]);

  const print = useCallback((kind, text) => {
    setLog((prev) => [...prev, { kind, text }]);
  }, []);

  const flat = useMemo(() => log.map((l) => l.text).join('\n'), [log]);

  /* commit one character at a time */
  useEffect(() => {
    if (typed >= flat.length) return;
    const id = setTimeout(() => setTyped((t) => t + 1), 10);
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

  /* ---- the commands ---- */
  const printStatus = useCallback(() => {
    const hard = ambience.hardness;
    const shadow = hard > 0.7 ? 'hard, directional' : hard > 0.3 ? 'soft' : 'almost none';
    print('hdr', 'VIBE');
    print('out', `  mood        ${ambience.name}`);
    print('out', `  weather     ${ambience.weather}`);
    print('out', `  time        ${ambience.timeLabel}`);
    print('out', `  shadows     ${shadow} (${hard.toFixed(2)})`);
    print('out', `  source      ${ambience.override ? 'manual override' : 'live forecast'}`);
    if (ambience.temp !== null && ambience.temp !== undefined) {
      print('out', `  air         ${Math.round(ambience.temp)}°C`);
    }
  }, [print, ambience]);

  const printHelp = useCallback(() => {
    print('hdr', 'WEATHER — type any of these');
    WEATHER_GROUPS.forEach((g) => {
      print('out', `  ${g.title.padEnd(15)} ${g.items.join(' · ')}`);
    });
    UNIVERSES.forEach((u) => {
      const p = phrasesFor(u);
      if (!p.length) return;
      print('out', `  ${u.padEnd(15)} ${p.join(' · ')}`);
    });
    print('hdr', 'SET PIECES — these do something');
    print('out', `  ${'Spectacles'.padEnd(15)} ${SPECTACLE_PHRASES.join(' · ')}`);
    print('hdr', 'THE CONSOLE');
    print('out', `  ${'Commands'.padEnd(15)} help · status · clear · auto · sound on|off · theme void|light`);
    print('dim', '  There are also codes nobody is supposed to know.');
    printStatus();
  }, [print, printStatus]);

  const execute = useCallback((raw) => {
    const text = raw.trim();
    if (!text) return;
    print('cmd', `$ ${text}`);
    setHistory((h) => [text, ...h.filter((x) => x !== text)].slice(0, 20));
    setHistoryAt(-1);

    const lower = text.toLowerCase();

    if (isSecret(text)) {
      setRick(true);
      print('ok', '  ✓ code accepted');
      print('rick', '  ♪ Never gonna give you up ♪');
      print('rick', '  ♪ Never gonna let you down ♪');
      print('dim', '  (there are no other commands. there are only more songs.)');
      onRickroll?.();
      return;
    }

    if (lower === 'help' || lower === '?' || lower === 'commands') { printHelp(); return; }
    if (lower === 'status' || lower === 'vibe' || lower === 'mood') { printStatus(); return; }
    if (lower === 'clear' || lower === 'cls') { setLog([]); setTyped(0); return; }
    if (lower === 'auto' || lower === 'reset' || lower === 'real') {
      onAuto?.();
      print('ok', '  ✓ back to the live sky — clock and forecast');
      return;
    }
    if (lower === 'sound on') { onSound?.(true); print('ok', '  ✓ interface sound on'); return; }
    if (lower === 'sound off') { onSound?.(false); print('ok', '  ✓ interface sound muted'); return; }
    if (lower === 'theme void') { onTheme?.('void'); print('ok', '  ✓ the void opens'); return; }
    if (lower === 'theme light') { onTheme?.('light'); print('ok', '  ✓ back to daylight'); return; }

    const cmd = parseCommand(text);
    if (cmd) {
      if (cmd.kind === 'reset') {
        onAuto?.();
        print('ok', '  ✓ back to the live sky — clock and forecast');
        return;
      }
      if (cmd.kind === 'spectacle') {
        onSpectacle?.(cmd);
        print('ok', `  ✓ ${cmd.name}`);
        print('dim', `  ${cmd.line}`);
        return;
      }
      onWeather?.(cmd);
      print('ok', `  ✓ ${cmd.name}`);
      print('dim', `  ${cmd.line}`);
      if (!soundEnabled) print('dim', '  (interface sound is muted — "sound on" to hear the thunder)');
      return;
    }

    print('err', `  ! unknown command: ${text}`);
    print('dim', '  try "help"');
  }, [print, printHelp, printStatus, onAuto, onWeather, onSpectacle, onSound, onTheme, soundEnabled, onRickroll]);

  const onKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      execute(input);
      setInput('');
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
  }, [execute, input, history, historyAt]);

  const onSubmit = (e) => {
    e.preventDefault();
    execute(input);
    setInput('');
  };

  return (
    <div className={`console${open ? ' is-open' : ''}${rick ? ' is-rick' : ''}`}>
      <button
        className="console-head"
        onClick={onToggle}
        aria-expanded={open}
        aria-label="Toggle the console"
      >
        <span className="rt-lights"><i /><i /><i /></span>
        <span className="console-title">console — gh api · weather</span>
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
            <span className="console-prompt">❯</span>
            <input
              ref={inputRef}
              className="console-input"
              type="text"
              value={input}
              placeholder="type a command — help, thor, let it rain…"
              aria-label="Console command"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
            />
          </form>
        </div>
      )}
    </div>
  );
}

export { WEATHER_COMMANDS };
