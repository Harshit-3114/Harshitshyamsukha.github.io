/**
 * THE SHELL
 *
 * Everything the console can do, in one place: the filesystem
 * commands, the weather commands, the housekeeping. The console
 * component is only the terminal emulator around it.
 *
 * Every command returns lines of output rather than writing to the
 * screen, so the shell stays pure and testable, and so a command can
 * ask the shell to do something the DOM owns (open a project, change
 * the theme) without knowing anything about React.
 */

import { parseCommand, COMMAND_HINTS, SPECTACLES } from './weather-commands.js';
import { buildVfs, resolvePath, treeOf } from './vfs.js';
import { formatHour } from './sun.js';
import { ALL_PINS, PROFILE } from '../data/portfolio.js';

export const COMMANDS = [
  { name: 'ls', args: '[path]', desc: 'list the contents of a directory' },
  { name: 'cd', args: '<path>', desc: 'change directory' },
  { name: 'pwd', args: '', desc: 'print the working directory' },
  { name: 'cat', args: '<file>', desc: 'print a file' },
  { name: 'tree', args: '', desc: 'draw the filesystem' },
  { name: 'open', args: '<file|id>', desc: 'open a project in the dossier' },
  { name: 'whoami', args: '', desc: 'print the profile' },
  { name: 'about', args: '', desc: 'print the long version' },
  { name: 'contact', args: '', desc: 'print the ways to reach him' },
  { name: 'resume', args: '', desc: 'download the résumé' },
  { name: 'projects', args: '[filter]', desc: 'list the projects' },
  { name: 'repos', args: '', desc: 'list the live GitHub repositories' },
  { name: 'git', args: 'log', desc: 'the commit history of this site' },
  { name: 'weather', args: '[phrase]', desc: 'change the weather — try "thor"' },
  { name: 'sun', args: '[hour]', desc: 'move the sun — try "sun 17"' },
  { name: 'theme', args: '[void|light]', desc: 'switch themes' },
  { name: 'sound', args: '[on|off]', desc: 'switch the interface sound' },
  { name: 'status', args: '', desc: 'the current vibe' },
  { name: 'history', args: '', desc: 'what you have typed' },
  { name: 'receipt', args: '', desc: 'a receipt for this visit' },
  { name: 'clear', args: '', desc: 'clear the screen' },
  { name: 'help', args: '', desc: 'this list' },
];

const SECRET_CODES = [
  'rickroll',
  'rick astley',
  'never gonna give you up',
  'never gonna let you down',
  'up up down down left right left right b a',
  'dqw4w9wgxcq',
];

const isSecret = (t) => {
  const s = String(t).toLowerCase().replace(/\s+/g, ' ').trim();
  return SECRET_CODES.some((c) => s.includes(c));
};

const out = (kind, text) => ({ kind, text });

/** The name of a file without its extension, for matching `open`. */
const stem = (n) => n.replace(/\.[a-z]+$/, '').replace(/\/$/, '');

/**
 * Run one command.
 *
 * `ctx` carries the state and the callbacks. Returns { cwd, lines }.
 */
export function runShell(input, ctx) {
  const vfs = ctx.vfs || buildVfs();
  let cwd = ctx.cwd || '/';

  const raw = String(input || '').trim();
  if (!raw) return { cwd, lines: [] };

  const lines = [];
  const args = raw.split(/\s+/);
  let cmd = args.shift();
  const rest = args.join(' ').trim();

  /* ---- sudo: the same command, with the lights on ---- */
  let sudo = false;
  if (cmd === 'sudo') {
    sudo = true;
    cmd = args.shift();
    if (!cmd) {
      lines.push(out('err', 'sudo: a command is required'));
      lines.push(out('dim', '  try `sudo weather thor`'));
      return { cwd, lines };
    }
  }

  if (isSecret(raw)) {
    lines.push(out('ok', '  ✓ code accepted'));
    lines.push(out('rick', '  ♪ Never gonna give you up ♪'));
    lines.push(out('rick', '  ♪ Never gonna let you down ♪'));
    lines.push(out('dim', '  (there are no other commands. there are only more songs.)'));
    ctx.onRickroll?.();
    return { cwd, lines };
  }

  switch (cmd) {
    /* ---------------- filesystem ---------------- */
    case 'ls': {
      const path = resolvePath(cwd, rest);
      const children = vfs.dirs.get(path);
      if (children) {
        children.forEach((c) => {
          const isDir = c.endsWith('/');
          const size = isDir ? '' : `${(vfs.files.get(`${path === '/' ? '' : path}/${c}`) || '').length}`;
          lines.push(out('out', `  ${isDir ? c.padEnd(24, ' ') : c.padEnd(24, ' ')}${size}`));
        });
        if (!children.length) lines.push(out('dim', '  (empty)'));
      } else if (vfs.files.has(path)) {
        lines.push(out('out', `  ${path.split('/').pop()}`));
      } else {
        lines.push(out('err', `  ls: ${path}: no such file or directory`));
      }
      break;
    }

    case 'cd': {
      if (!rest) { cwd = '/'; break; }
      const path = resolvePath(cwd, rest);
      if (vfs.dirs.has(path) || vfs.files.has(path)) {
        cwd = vfs.dirs.has(path) ? path : path.slice(0, path.lastIndexOf('/')) || '/';
      } else {
        lines.push(out('err', `  cd: ${path}: no such file or directory`));
      }
      break;
    }

    case 'pwd':
      lines.push(out('out', `  ${cwd}`));
      break;

    case 'cat': {
      if (!rest) { lines.push(out('err', '  cat: a file is required')); break; }
      const path = resolvePath(cwd, rest);
      const content = vfs.files.get(path);
      if (!content) {
        lines.push(out('err', `  cat: ${path}: no such file`));
        break;
      }
      content.split('\n').forEach((l) => lines.push(out('out', l || ' ')));
      break;
    }

    case 'tree':
      treeOf(vfs).split('\n').forEach((l) => lines.push(out('out', l)));
      break;

    /* ---------------- the portfolio ---------------- */
    case 'open': {
      if (!rest) { lines.push(out('err', '  open: a file or project id is required')); break; }
      if (rest === 'resume') { ctx.onDownloadResume?.(); lines.push(out('ok', '  ✓ résumé downloaded')); break; }
      const path = resolvePath(cwd, rest);
      const name = path.split('/').pop();
      const pin = ALL_PINS.find((p) => p.id === stem(name)) || ALL_PINS.find((p) => p.id === rest);
      if (pin) {
        ctx.onOpenProject?.(pin.id);
        lines.push(out('ok', `  ✓ opening ${pin.title}`));
      } else {
        lines.push(out('err', `  open: ${rest}: not a project`));
      }
      break;
    }

    case 'whoami':
      lines.push(out('out', `  ${PROFILE.name}`));
      lines.push(out('out', `  ${PROFILE.role}`));
      lines.push(out('out', `  ${PROFILE.location}`));
      lines.push(out('out', `  ${PROFILE.github}`));
      break;

    case 'about':
      (vfs.files.get('/about.txt') || '').split('\n').forEach((l) => lines.push(out('out', l || ' ')));
      break;

    case 'contact':
      (vfs.files.get('/contact.txt') || '').split('\n').forEach((l) => lines.push(out('out', l || ' ')));
      break;

    case 'resume':
      lines.push(out('out', `  ${PROFILE.resume}`));
      lines.push(out('out', `  ${PROFILE.resumeDrive}`));
      lines.push(out('dim', '  type `open resume` to download it'));
      break;

    case 'projects': {
      const filter = rest.toLowerCase();
      const list = ALL_PINS.filter((p) => p.category === 'project' || p.category === 'ai'
        || p.category === 'fullstack' || p.category === 'client');
      const shown = filter ? list.filter((p) => `${p.title} ${p.stack?.join(' ')}`.toLowerCase().includes(filter)) : list;
      if (!shown.length) { lines.push(out('err', `  no projects match "${rest}"`)); break; }
      shown.forEach((p) => {
        lines.push(out('out', `  ${p.title.padEnd(34, ' ')} ${(p.stack || []).slice(0, 3).join(' · ')}`));
      });
      lines.push(out('dim', `  ${shown.length} of ${list.length} — cd projects/ to read one`));
      break;
    }

    case 'repos': {
      if (!ctx.repos?.length) { lines.push(out('dim', '  the repository index is still loading')); break; }
      ctx.repos.forEach((r) => {
        lines.push(out('out', `  ${String(r.name).padEnd(28, ' ')} ${String(r.language || '—').padEnd(14, ' ')} ★${r.stars}`));
      });
      break;
    }

    case 'git': {
      if (rest !== 'log') { lines.push(out('err', '  git: only `git log` is implemented here')); break; }
      if (!ctx.commits?.length) { lines.push(out('dim', '  the commit history is still loading')); break; }
      ctx.commits.slice(0, 14).forEach((c) => {
        const sha = c.sha.slice(0, 7);
        const date = String(c.commit?.author?.date || '').slice(0, 10);
        const msg = String(c.commit?.message || '').split('\n')[0];
        lines.push(out('out', `  ${sha}  ${date}  ${msg}`));
      });
      lines.push(out('dim', `  ${ctx.commits.length} commits`));
      break;
    }

    /* ---------------- the site ---------------- */
    case 'weather': {
      if (!rest) {
        lines.push(out('out', `  now     ${ctx.ambience.name} — ${ctx.ambience.weather}, ${ctx.ambience.timeLabel}`));
        lines.push(out('dim', '  try `weather thor`, `weather let it rain`, `weather auto`'));
        break;
      }
      const cmd2 = parseCommand(rest);
      if (!cmd2) { lines.push(out('err', `  weather: "${rest}" is not a forecast I know`)); break; }
      if (cmd2.kind === 'reset') {
        ctx.onAuto?.();
        lines.push(out('ok', '  ✓ back to the live sky'));
      } else if (cmd2.kind === 'spectacle') {
        ctx.onSpectacle?.(cmd2);
        lines.push(out('ok', `  ✓ ${cmd2.name}`));
      } else {
        ctx.onWeather?.(cmd2);
        lines.push(out('ok', `  ✓ ${cmd2.name}`));
        lines.push(out('dim', `  ${cmd2.line}`));
      }
      break;
    }

    case 'sun': {
      if (!rest) {
        const s = ctx.sun || {};
        lines.push(out('out', `  hour       ${formatHour(ctx.ambience.hour ?? 12)}`));
        lines.push(out('out', `  light      ${ctx.ambience.timeLabel}`));
        lines.push(out('out', `  sun        ${s.isDay ? 'up' : 'down'} · ${Math.round(s.elevation ?? 0)}° elevation`));
        lines.push(out('out', `  daylight   ${s.sunrise ? `${formatHour(s.sunrise)} → ${formatHour(s.sunset)}` : '—'}`));
        lines.push(out('out', `  shadows    ${s.length ? `${s.length.toFixed(2)}× long, ${s.shadowX > 0.02 ? 'to the right' : s.shadowX < -0.02 ? 'to the left' : 'straight down'}` : '—'}`));
        lines.push(out('dim', '  try `sun 17` to move it'));
        break;
      }
      const hour = parseFloat(rest);
      if (Number.isNaN(hour) || hour < 0 || hour > 24) {
        lines.push(out('err', '  sun: give an hour between 0 and 24'));
        break;
      }
      ctx.onSetHour?.(hour);
      lines.push(out('ok', `  ✓ the sun moves to ${formatHour(hour)}`));
      break;
    }

    case 'theme': {
      if (!rest) { lines.push(out('out', `  now     ${ctx.ambience.mode}`)); break; }
      if (rest === 'void') { ctx.onTheme?.('void'); lines.push(out('ok', '  ✓ the void opens')); }
      else if (rest === 'light' || rest === 'day') { ctx.onTheme?.('light'); lines.push(out('ok', '  ✓ back to daylight')); }
      else lines.push(out('err', '  theme: try void or light'));
      break;
    }

    case 'sound': {
      if (!rest) { lines.push(out('out', `  now     ${ctx.soundEnabled ? 'on' : 'off'}`)); break; }
      if (rest === 'on') { ctx.onSound?.(true); lines.push(out('ok', '  ✓ interface sound on')); }
      else if (rest === 'off') { ctx.onSound?.(false); lines.push(out('ok', '  ✓ interface sound muted')); }
      else lines.push(out('err', '  sound: try on or off'));
      break;
    }

    case 'status': {
      const a = ctx.ambience;
      const hard = a.hardness;
      const shadow = hard > 0.7 ? 'hard, directional' : hard > 0.3 ? 'soft' : 'almost none';
      lines.push(out('hdr', 'VIBE'));
      lines.push(out('out', `  mood        ${a.name}`));
      lines.push(out('out', `  weather     ${a.weather}`));
      lines.push(out('out', `  time        ${a.timeLabel}`));
      lines.push(out('out', `  shadows     ${shadow} (${hard.toFixed(2)})`));
      lines.push(out('out', `  source      ${a.override ? 'manual override' : 'live forecast'}`));
      if (a.temp !== null && a.temp !== undefined) lines.push(out('out', `  air         ${Math.round(a.temp)}°C`));
      break;
    }

    case 'history': {
      (ctx.history || []).forEach((h, i) => lines.push(out('out', `  ${String(i + 1).padStart(3, ' ')}  ${h}`)));
      if (!(ctx.history || []).length) lines.push(out('dim', '  (nothing yet)'));
      break;
    }

    case 'receipt': {
      const a = ctx.ambience;
      const w = 34;
      const line = (l, r) => `  ${String(l).padEnd(w - 6, ' ')}${String(r).padStart(4, ' ')}`;
      lines.push(out('out', '  ┌' + '─'.repeat(w) + '┐'));
      lines.push(out('out', `  ${'HARSHIT SHYAMSUKHA'.padEnd(w - 4, ' ')}  │`));
      lines.push(out('out', '  ' + '─'.repeat(w)));
      lines.push(out('out', line('VISITOR', '')));
      lines.push(out('out', line('mood', a.name)));
      lines.push(out('out', line('weather', a.weather)));
      lines.push(out('out', line('time', a.timeLabel)));
      lines.push(out('out', line('light', `${(a.hardness).toFixed(2)} hardness`)));
      lines.push(out('out', line('commands run', String((ctx.history || []).length))));
      lines.push(out('out', line('projects opened', String(ctx.openedCount || 0))));
      lines.push(out('out', '  ' + '─'.repeat(w)));
      lines.push(out('out', line('TOTAL', `${(ctx.history || []).length} CUP`)));
      lines.push(out('out', '  └' + '─'.repeat(w) + '┘'));
      lines.push(out('dim', '  keep this screenshot. nobody will believe it.'));
      break;
    }

    case 'clear':
      ctx.onClear?.();
      break;

    case 'help': {
      lines.push(out('hdr', 'COMMANDS'));
      COMMANDS.forEach((c) => {
        const sig = `${c.name}${c.args ? ' ' + c.args : ''}`;
        lines.push(out('out', `  ${sig.padEnd(20, ' ')}${c.desc}`));
      });
      lines.push(out('hdr', 'WEATHER PHRASES'));
      lines.push(out('out', `  ${COMMAND_HINTS.join(' · ')}`));
      lines.push(out('dim', '  and one more: `help` has a cousin called `weather help`'));
      break;
    }

    /* ---------------- jokes, carefully ---------------- */
    case 'rm':
      lines.push(out('err', '  rm: read-only filesystem. this is a portfolio, not a server.'));
      break;
    case 'exit':
      lines.push(out('dim', '  there is no exit. there is only the next tab.'));
      break;
    case 'sudo':
      lines.push(out('err', '  sudo: a command is required'));
      break;
    case 'who':
    case 'sudoers':
      lines.push(out('dim', '  you are a visitor with read access and one weather spell.'));
      break;
    case 'lsblk':
      lines.push(out('err', '  lsblk: no block devices. it is all weather.'));
      break;
    case 'fortune':
      lines.push(out('out', `  ${Math.random() < 0.5 ? 'A journey of a thousand miles begins with a single commit.' : 'Ship it, then fix it in production — that is the job.'}`));
      break;
    case 'echo':
      lines.push(out('out', `  ${rest}`));
      break;

    default: {
      /* not a command — maybe it is a weather phrase, which may be
         several words long ("let it rain") */
      const cmd2 = parseCommand(raw);
      if (cmd2) {
        const fake = runShell(`weather ${raw}`, ctx);
        return { cwd: fake.cwd, lines: [...lines, ...fake.lines] };
      }
      lines.push(out('err', `  ${cmd}: command not found`));
      lines.push(out('dim', '  type `help`'));
    }
  }

  if (sudo && !lines.some((l) => l.kind === 'err')) {
    lines.unshift(out('ok', '  ⚡ elevated'));
  }

  return { cwd, lines };
}

/** Tab completion: commands first, then paths. */
export function complete(input, ctx) {
  const vfs = ctx.vfs || buildVfs();
  const parts = String(input || '').split(/\s+/);
  const last = parts[parts.length - 1] ?? '';

  if (parts.length <= 1) {
    return COMMANDS.map((c) => c.name)
      .concat(['sudo', 'echo', 'fortune', 'rm', 'exit'])
      .filter((n) => n.startsWith(last.toLowerCase()));
  }

  /* path completion */
  const dir = resolvePath(ctx.cwd || '/', last.includes('/') ? last.slice(0, last.lastIndexOf('/')) : '');
  const prefix = last.includes('/') ? last.slice(last.lastIndexOf('/') + 1) : last;
  const children = vfs.dirs.get(dir) || [];
  const files = [...vfs.files.keys()].filter((p) => p.startsWith(dir === '/' ? '/' : `${dir}/`));
  const names = [...children.map((c) => c.replace(/\/$/, '')), ...files.map((f) => f.split('/').pop())];
  return names.filter((n) => n.toLowerCase().startsWith(prefix.toLowerCase()));
}
