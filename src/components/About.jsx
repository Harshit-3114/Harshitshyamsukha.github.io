import React from 'react';
import Icon from './Icon.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { PROFILE } from '../data/portfolio.js';

/* ============================================================
   ABOUT — Editorial Split
   Massive type on the left, staged content on the right
   ============================================================ */

function SocialLink({ href, label, children, onClick }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} aria-label={label} title={label}>
      {children}
    </a>
  );
}

export function About({ onNavigate, onGitHubClick }) {
  const [ref] = useReveal({ threshold: 0.05 });

  return (
    <section className="about-hero" id="top" ref={ref}>
      <div className="about-hero-left">
        <div className="about-avatar" title="Harshit Shyamsukha">
          <picture>
            <source srcSet="/profile.webp" type="image/webp" />
            <img src="/profile.png" alt="Harshit Shyamsukha" width="512" height="512" loading="eager" decoding="async" />
          </picture>
        </div>
        <span className="eyebrow">Open to SDE Internships · 2027</span>
        <h1 className="about-name">
          Harshit<br />
          <em>Shyamsukha</em>
        </h1>
        <p className="about-role">
          Software Engineer — AI/ML &amp; Full-Stack. I build production systems across the
          stack: agentic LLM pipelines, forecasting models, and multi-service products that
          survive real users. Currently a final-year B.Tech CSE student at SRMIST, Chennai.
        </p>
        <div className="about-tags">
          <span>AI / ML</span>
          <span>Full Stack</span>
          <span>Agentic Systems</span>
          <span>System Design</span>
          <span>DevOps / Cloud</span>
        </div>
        <div className="about-actions">
          <button className="btn" onClick={() => onNavigate('all')}>
            <span className="btn-label">View selected work</span>
            <span className="btn-icon"><Icon name="arrowUpRight" size={14} /></span>
          </button>
          <a className="btn btn-ghost" href={PROFILE.resume} download onClick={() => window.plausible?.('Download Resume')}>
            <span className="btn-label">Download résumé</span>
            <span className="btn-icon"><Icon name="download" size={14} /></span>
          </a>
        </div>
        <div className="about-social">
          <SocialLink href={PROFILE.github} label="GitHub" onClick={onGitHubClick}>
            <Icon name="github" size={17} />
          </SocialLink>
          <SocialLink href={PROFILE.linkedin} label="LinkedIn">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </SocialLink>
          <SocialLink href={`mailto:${PROFILE.email}`} label="Email">
            <Icon name="mail" size={17} />
          </SocialLink>
        </div>
      </div>

      <div className="about-hero-right">
        <div className="about-panel about-panel-dark">
          <span className="eyebrow">At a glance</span>
          <dl className="fact-list">
            <div className="fact-row">
              <dt>Education</dt>
              <dd>B.Tech CSE (Core) — Computing Technologies, SRMIST · 2023–2027</dd>
            </div>
            <div className="fact-row">
              <dt>Certification</dt>
              <dd>Red Hat Certified Specialist — Linux Diagnostics &amp; Troubleshooting (EX342)<br />
                Red Hat OpenShift Development I (DO188)</dd>
            </div>
            <div className="fact-row">
              <dt>Experience</dt>
              <dd>Web Developer Intern, CanIT Solutions — Canit Pulse SaaS</dd>
            </div>
            <div className="fact-row">
              <dt>Based in</dt>
              <dd>Chennai, India · {PROFILE.phone}</dd>
            </div>
          </dl>
        </div>

        <div className="about-panel tone-indigo">
          <span className="eyebrow tone-indigo">Core languages</span>
          <div className="about-card-tags">
            {['Python', 'TypeScript', 'JavaScript', 'C', 'C++', 'Java', 'SQL', 'Bash'].map((t) => (
              <span key={t} className="about-card-tag">{t}</span>
            ))}
          </div>
        </div>

        <div className="about-panel tone-teal">
          <span className="eyebrow tone-teal">Frameworks &amp; infrastructure</span>
          <div className="about-card-tags">
            {['React', 'FastAPI', 'Node.js', 'PyTorch', 'LangGraph', 'FAISS', 'Docker', 'Kubernetes', 'Red Hat OpenShift', 'PostgreSQL', 'Supabase', 'MinIO', 'GitHub Actions'].map((t) => (
              <span key={t} className="about-card-tag">{t}</span>
            ))}
          </div>
        </div>

        <div className="about-panel tone-wine">
          <span className="eyebrow tone-wine">AI / ML stack</span>
          <div className="about-card-tags">
            {['Llama 3', 'Phi-3 Mini', 'Gemini', 'Groq', 'NVIDIA NIM', 'Ollama', 'LoRA / QLoRA', 'HuggingFace', 'Sentence Transformers', 'MuRIL', 'GDELT', 'ACLED', 'Pandas', 'scikit-learn'].map((t) => (
              <span key={t} className="about-card-tag">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ABOUT CARDS — layered paper stack
   ============================================================ */

const ABOUT_CARDS = [
  {
    icon: 'education',
    title: 'Education',
    tone: 'brass',
    onClick: 'credentials',
    rows: [
      { strong: 'B.Tech CSE (Core)' },
      { text: 'Computing Technologies — SRM Institute of Science & Technology, Chennai' },
      { mono: 'Aug 2023 — May 2027' },
    ],
    tags: ['Compiler Design', 'Software Engineering', 'Data Science', 'DevOps'],
  },
  {
    icon: 'badge',
    title: 'Certifications',
    tone: 'wine',
    onClick: 'credentials',
    rows: [
      { text: 'Red Hat Certified Specialist — Linux Diagnostics & Troubleshooting (EX342)' },
      { text: 'Red Hat OpenShift Development I (DO188) — Containers with Podman' },
    ],
    tags: ['DSA in C', 'DBMS', 'Operating Systems'],
  },
  {
    icon: 'cube',
    title: 'Languages',
    tone: 'teal',
    onClick: 'all',
    tags: ['Python', 'JavaScript', 'TypeScript', 'C++', 'Java', 'SQL', 'Bash', 'C'],
  },
  {
    icon: 'frameworks',
    title: 'Frameworks & Tools',
    tone: 'sage',
    onClick: 'all',
    tags: ['React', 'FastAPI', 'Node.js', 'PyTorch', 'FAISS', 'Docker', 'Kubernetes', 'Red Hat OpenShift', 'Podman', 'GitHub Actions', 'MongoDB', 'Supabase', 'MinIO'],
  },
  {
    icon: 'ai',
    title: 'AI / ML Stack',
    tone: 'indigo',
    onClick: 'ai',
    tags: ['Llama 3', 'Phi-3 Mini', 'Gemini', 'Groq', 'LangGraph', 'NVIDIA NIM', 'Sentence Transformers', 'Ollama', 'MuRIL', 'GDELT', 'ACLED', 'Pandas', 'NumPy', 'scikit-learn'],
  },
  {
    icon: 'doc',
    title: 'Projects',
    tone: 'clay',
    onClick: 'all',
    rows: [
      { strong: 'DSFS' }, { text: 'Conflict forecasting model (LTROC 0.73)' },
      { strong: 'GitHub Innovator' }, { text: 'Autonomous six-stage LangGraph agent' },
      { strong: 'SkillRoute' }, { text: 'Semantic talent routing with FAISS' },
      { strong: 'AI Ethics Advisor' }, { text: 'Llama 3 powered ethical analysis' },
      { strong: 'DeepFake Detection' }, { text: 'Microservices-based detection' },
      { strong: 'InsightX Analytics' }, { text: 'NL-to-SQL analytics engine' },
      { strong: 'Crest Automotive' }, { text: 'Client portal with 3 role views' },
    ],
  },
  {
    icon: 'flask',
    title: 'Research',
    tone: 'indigo',
    onClick: 'ai',
    rows: [
      { text: 'DSFS — IEEE-format paper on conflict forecasting with LTROC 0.73 benchmark' },
      { text: 'SkillRoute — IEEE-format paper on semantic talent routing using FAISS vector search' },
      { text: 'LLM-IoT Bridge — B.Tech project report on LLM-integrated IoT systems' },
      { text: 'Kissan AI — Multimodal crop disease detection academic report' },
    ],
  },
  {
    icon: 'github',
    title: 'Open Source',
    tone: 'slate',
    onClick: 'activity',
    rows: [
      { text: 'Active on GitHub with public repositories spanning AI/ML, full-stack apps, and academic projects' },
    ],
    link: { href: `github.com/${PROFILE.githubHandle}`, text: `github.com/${PROFILE.githubHandle}` },
  },
  {
    icon: 'compass',
    title: 'Interests',
    tone: 'sage',
    onClick: 'all',
    tags: ['AI / ML', 'Systems Programming', 'Linux', 'DevOps', 'Conflict Forecasting', 'NLP', 'Containerization', 'Open Source'],
    rows: [{ text: 'Chennai, India — Open to SDE internships' }],
  },
];

export function AboutCards({ onNavigate, onGitHubClick }) {
  return (
    <div className="about-cards">
      {ABOUT_CARDS.map((c) => (
        <article
          key={c.title}
          className={`about-card tone-${c.tone}`}
          onClick={() => onNavigate(c.onClick)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate(c.onClick); } }}
        >
          <div className="about-card-hdr">
            <div className="about-card-icon"><Icon name={c.icon} size={16} /></div>
            <span className="about-card-title">{c.title}</span>
          </div>
          <div className="about-card-body">
            {c.rows?.map((r, i) => (
              <div key={i} className="about-card-row">
                {r.strong && <strong>{r.strong}</strong>}
                {r.text}
                {r.mono && <span className="about-card-mono"> {r.mono}</span>}
              </div>
            ))}
            {c.tags && (
              <div className="about-card-tags">
                {c.tags.map((t) => (<span key={t} className="about-card-tag">{t}</span>))}
              </div>
            )}
            {c.link && (
              <div className="about-card-row">
                <a
                  className="about-card-link"
                  href={`https://${c.link.href}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => { e.stopPropagation(); onGitHubClick?.(); }}
                >
                  {c.link.text} ↗
                </a>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
