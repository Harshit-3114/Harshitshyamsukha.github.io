import React from 'react';
import { PROFILE, EXPERIENCE, CERTIFICATIONS, PROJECTS_DETAILED } from '../data/portfolio.js';

/**
 * THE PRINT CV
 *
 * A portfolio is a website. Recruiters print things.
 *
 * This block is hidden on screen and becomes the whole document when
 * you hit Ctrl+P — one clean page, ink-efficient, with the accent
 * colours reduced to rules and labels. It is built from the same
 * records as the site, so it cannot drift from what you see.
 */
const TOP_PROJECTS = ['github-innovator', 'skillroute', 'ai-ethics', 'insightx', 'edee', 'sosp'];

export default function PrintCV() {
  const projects = TOP_PROJECTS
    .map((id) => PROJECTS_DETAILED.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <article className="print-cv">
      <header className="print-cv-head">
        <h1>{PROFILE.name}</h1>
        <p className="print-cv-role">{PROFILE.role}</p>
        <p className="print-cv-contact">
          {PROFILE.location} · {PROFILE.email} · {PROFILE.phone} · {PROFILE.github}
        </p>
      </header>

      <section className="print-cv-sec">
        <h2>Profile</h2>
        <p>
          Final-year B.Tech CSE student at SRM Institute of Science &amp; Technology, Chennai.
          Builds production systems across the stack — agentic LLM pipelines, forecasting
          models and multi-service products. Red Hat Certified Specialist in Linux Diagnostics
          and Troubleshooting (EX342) and OpenShift Development I (DO188). Open to SDE
          internships and full-time roles from 2027.
        </p>
      </section>

      <section className="print-cv-sec">
        <h2>Experience</h2>
        {EXPERIENCE.map((e) => (
          <div key={e.id} className="print-cv-item">
            <h3>{e.title} — {e.company} <span className="print-cv-date">{e.date}</span></h3>
            {e.product && <p className="print-cv-sub">{e.product}</p>}
            <ul>
              {(e.highlights || []).map((h, i) => <li key={i}>{h}</li>)}
            </ul>
          </div>
        ))}
      </section>

      <section className="print-cv-sec">
        <h2>Selected work</h2>
        {projects.map((p) => (
          <div key={p.id} className="print-cv-item">
            <h3>{p.title} <span className="print-cv-date">{p.date}</span></h3>
            <p className="print-cv-sub">{(p.stack || []).join(' · ')}</p>
            <p>{p.desc}</p>
            {p.metrics && <p className="print-cv-metric">{p.metrics}</p>}
          </div>
        ))}
      </section>

      <section className="print-cv-sec">
        <h2>Certifications</h2>
        <ul className="print-cv-certs">
          {CERTIFICATIONS.map((c) => (
            <li key={c.id}><strong>{c.title}</strong> — {c.issuer}, {c.date}</li>
          ))}
        </ul>
      </section>

      <section className="print-cv-sec">
        <h2>Skills</h2>
        <p className="print-cv-skills">
          Python · TypeScript · JavaScript · C++ · Java · SQL · Bash · React · FastAPI ·
          Node.js · PyTorch · LangGraph · FAISS · Sentence Transformers · Docker · Kubernetes ·
          Red Hat OpenShift · PostgreSQL · Supabase · MinIO · GitHub Actions · MongoDB ·
          Llama 3 · Phi-3 Mini · Gemini · Groq · NVIDIA NIM · Ollama · LoRA/QLoRA · HuggingFace ·
          MuRIL · GDELT · ACLED · Pandas · scikit-learn
        </p>
      </section>

      <footer className="print-cv-foot">
        {PROFILE.site} · {PROFILE.linkedin} · Résumé: {PROFILE.resume}
      </footer>
    </article>
  );
}
