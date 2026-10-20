/**
 * THE FILESYSTEM
 *
 * The console is not a prop. It is a shell, and a shell needs a
 * filesystem. This one is built from the same data the rest of the
 * site renders from, so `cat projects/skillroute.md` can never drift
 * from the card that says "SkillRoute".
 *
 * Everything here is generated at runtime from src/data/portfolio.js.
 * Nothing is duplicated, nothing can go stale.
 */

import {
  PROFILE, KNOWLEDGE, PROJECTS_DETAILED, CERTIFICATIONS, EXPERIENCE, ACADEMIC,
} from '../data/portfolio.js';

const pad = (label) => label.padEnd(12, ' ');

function projectFile(p) {
  const lines = [];
  lines.push(`# ${p.title}`);
  lines.push('');
  lines.push(`${pad('category')}${p.category}`);
  lines.push(`${pad('status')}${p.status || '—'}`);
  lines.push(`${pad('date')}${p.date || '—'}`);
  if (p.stack?.length) lines.push(`${pad('stack')}${p.stack.join(' · ')}`);
  if (p.github) lines.push(`${pad('repo')}${p.github}`);
  if (p.demo) lines.push(`${pad('demo')}${p.demo}`);
  lines.push('');
  if (p.desc) { lines.push('## Summary'); lines.push(''); lines.push(p.desc); lines.push(''); }
  if (p.problem) { lines.push('## The problem'); lines.push(''); lines.push(p.problem); lines.push(''); }
  if (p.architecture?.length) {
    lines.push('## Architecture');
    lines.push('');
    p.architecture.forEach((a, i) => lines.push(`${String(i + 1).padStart(2, '0')}. ${a}`));
    lines.push('');
  }
  if (p.decisions?.length) {
    lines.push('## Key decisions');
    lines.push('');
    p.decisions.forEach((d) => lines.push(`- ${d}`));
    lines.push('');
  }
  if (p.skills?.length) {
    lines.push('## Skills covered');
    lines.push('');
    p.skills.forEach((s) => lines.push(`- ${s}`));
    lines.push('');
  }
  if (p.metrics) { lines.push('## Outcome'); lines.push(''); lines.push(p.metrics); lines.push(''); }
  if (p.files?.length) {
    lines.push('## Files');
    lines.push('');
    p.files.forEach((f) => lines.push(`  ${f.path}  →  ${f.url}`));
    lines.push('');
  }
  return lines.join('\n');
}

function certFile(c) {
  const lines = [];
  lines.push(`# ${c.title}`);
  lines.push('');
  lines.push(`${pad('issuer')}${c.issuer}`);
  lines.push(`${pad('date')}${c.date}`);
  if (c.badge) lines.push(`${pad('badge')}${c.badge}`);
  lines.push('');
  if (c.desc) { lines.push('## About'); lines.push(''); lines.push(c.desc); lines.push(''); }
  if (c.skills?.length) {
    lines.push('## Skills covered');
    lines.push('');
    c.skills.forEach((s) => lines.push(`- ${s}`));
    lines.push('');
  }
  return lines.join('\n');
}

function experienceFile(e) {
  const lines = [];
  lines.push(`# ${e.title} — ${e.company}`);
  lines.push('');
  lines.push(`${pad('product')}${e.product || '—'}`);
  lines.push(`${pad('dates')}${e.date}`);
  lines.push('');
  if (e.desc) { lines.push('## What the role was'); lines.push(''); lines.push(e.desc); lines.push(''); }
  if (e.highlights?.length) {
    lines.push('## What I shipped and fixed');
    lines.push('');
    e.highlights.forEach((h) => lines.push(`- ${h}`));
    lines.push('');
  }
  if (e.skills?.length) {
    lines.push('## Skills');
    lines.push('');
    e.skills.forEach((s) => lines.push(`- ${s}`));
    lines.push('');
  }
  return lines.join('\n');
}

function academicFile(a) {
  const lines = [];
  lines.push(`# ${a.title}`);
  lines.push('');
  lines.push(`${pad('institution')}${a.institution}`);
  lines.push(`${pad('date')}${a.date}`);
  lines.push('');
  if (a.desc) { lines.push('## About'); lines.push(''); lines.push(a.desc); lines.push(''); }
  if (a.highlights?.length) {
    lines.push('## Takeaways');
    lines.push('');
    a.highlights.forEach((h) => lines.push(`- ${h}`));
    lines.push('');
  }
  return lines.join('\n');
}

const ABOUT_TEXT = [
  `# ${PROFILE.name}`,
  '',
  `${pad('role')}${PROFILE.role}`,
  `${pad('based in')}${PROFILE.location}`,
  `${pad('phone')}${PROFILE.phone}`,
  `${pad('email')}${PROFILE.email}`,
  `${pad('github')}${PROFILE.github}`,
  `${pad('linkedin')}${PROFILE.linkedin}`,
  `${pad('site')}${PROFILE.site}`,
  `${pad('resume')}${PROFILE.resume}`,
  '',
  '## Short version',
  '',
  KNOWLEDGE.default,
  '',
  '## Skills',
  '',
  KNOWLEDGE.skill,
  '',
  '## Experience',
  '',
  KNOWLEDGE.experience,
  '',
  '## Projects',
  '',
  KNOWLEDGE.project,
  '',
  '## Certifications',
  '',
  KNOWLEDGE.certifications,
  '',
].join('\n');

const CONTACT_TEXT = [
  '# Contact',
  '',
  `email      ${PROFILE.email}`,
  `phone      ${PROFILE.phone}`,
  `linkedin   ${PROFILE.linkedin}`,
  `github     ${PROFILE.github}`,
  `location   ${PROFILE.location}`,
  '',
  KNOWLEDGE.hire,
].join('\n');

const RESUME_TEXT = [
  '# Résumé',
  '',
  `The PDF lives at ${PROFILE.resume}`,
  `A Google Drive copy: ${PROFILE.resumeDrive}`,
  '',
  'Type `open resume` to download it, or `cat resume.txt` to read the',
  'text version, which is assembled from the same records as this site.',
].join('\n');

/**
 * Build the tree.
 *
 * Returns { dirs, files } where dirs maps a path to its child names
 * and files maps a path to its contents.
 */
export function buildVfs() {
  const dirs = new Map();
  const files = new Map();

  const addDir = (path, children) => {
    dirs.set(path, children);
  };

  const projectNames = [];
  PROJECTS_DETAILED.forEach((p) => {
    const name = `${p.id}.md`;
    projectNames.push(name);
    files.set(`/projects/${name}`, projectFile(p));
  });

  const certNames = [];
  CERTIFICATIONS.forEach((c) => {
    const name = `${c.id}.md`;
    certNames.push(name);
    files.set(`/certs/${name}`, certFile(c));
  });

  const expNames = [];
  EXPERIENCE.forEach((e) => {
    const name = `${e.id}.md`;
    expNames.push(name);
    files.set(`/experience/${name}`, experienceFile(e));
  });

  const acadNames = [];
  ACADEMIC.forEach((a) => {
    const name = `${a.id}.md`;
    acadNames.push(name);
    files.set(`/academic/${name}`, academicFile(a));
  });

  files.set('/about.txt', ABOUT_TEXT);
  files.set('/contact.txt', CONTACT_TEXT);
  files.set('/resume.txt', RESUME_TEXT);
  files.set('/now.json', '{\n  "currently": "This file is yours — edit it and the site updates.\n}\n');

  addDir('/', [
    'about.txt', 'contact.txt', 'resume.txt', 'now.json',
    'projects/', 'certs/', 'experience/', 'academic/',
  ]);
  addDir('/projects', projectNames);
  addDir('/certs', certNames);
  addDir('/experience', expNames);
  addDir('/academic', acadNames);

  return { dirs, files };
}

/** Resolve a user-supplied path against a working directory. */
export function resolvePath(cwd, input) {
  if (!input) return cwd;
  let p = input;
  if (p.startsWith('~')) p = p.slice(1) || '/';
  if (!p.startsWith('/')) p = `${cwd}/${p}`;
  const parts = [];
  for (const seg of p.split('/')) {
    if (!seg || seg === '.') continue;
    if (seg === '..') parts.pop();
    else parts.push(seg);
  }
  const path = `/${parts.join('/')}`;
  return path === '//' ? '/' : path;
}

/** ASCII tree of the whole filesystem. */
export function treeOf(vfs) {
  const lines = ['.'];
  const walk = (dir, prefix) => {
    const children = vfs.dirs.get(dir) || [];
    children.forEach((child, i) => {
      const last = i === children.length - 1;
      const branch = last ? '└── ' : '├── ';
      const isDir = child.endsWith('/');
      lines.push(`${prefix}${branch}${child}`);
      if (isDir) walk(`${dir}/${child.replace(/\/$/, '')}`.replace(/\/+/g, '/'), `${prefix}${last ? '    ' : '│   '}`);
    });
  };
  walk('/', '');
  return lines.join('\n');
}
