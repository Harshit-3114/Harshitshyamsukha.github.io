import React, { useEffect, useState } from 'react';
import Icon from '../components/Icon.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import { About, AboutCards } from '../components/About.jsx';
import { WordReveal } from '../hooks/WordReveal.jsx';
import { PROCESS_DATA, CORE_PROJECTS, PROFILE } from '../data/portfolio.js';

function Typewriter({ text, speed = 45 }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return <>{displayed}<span className="typewriter-cursor">|</span></>;
}

const GRID_TONE = {
  all: 'brass',
  ai: 'indigo',
  fullstack: 'sage',
  client: 'clay',
  credentials: 'wine',
  experience: 'teal',
  activity: 'slate',
  void: 'wine',
};

const GRID_LABEL = {
  all: 'Selected Work',
  ai: 'AI / Research',
  fullstack: 'Full-Stack',
  client: 'Client Work',
  credentials: 'Credentials',
  experience: 'Experience',
  activity: 'GitHub Activity',
  void: 'The Void',
};

const GRID_TITLE = {
  all: 'Everything I have built.',
  ai: 'Research & intelligent systems.',
  fullstack: 'Products that hold up in production.',
  client: 'Work shipped for real clients.',
  credentials: 'Certifications & coursework.',
  experience: 'Where I have worked.',
  activity: 'Live from GitHub.',
  void: 'Everything, unfiltered.',
};

const GRID_NOTE = {
  all: 'Nine public repositories, one internship, and a research pipeline in progress.',
  ai: 'Forecasting, agents, RAG and fine-tuning — the models I have actually put in front of users.',
  fullstack: 'FastAPI, React and the unglamorous parts in between: auth, queues, migrations, deploys.',
  client: 'Paid work for real businesses, including a multi-tenant SaaS and an industrial manufacturer.',
  credentials: 'Red Hat twice over, plus the fundamentals that make the rest possible.',
  experience: 'Production incidents fixed, features shipped, and code that outlived the sprint.',
  activity: 'Pulled live from the GitHub API — commits, PRs and issues, as they happen.',
  void: 'The full index, in no particular order.',
};

export default function TabContent({
  filterTab, shuffledPins, openProjectModal,
  handleCardMouseEnter, handleCardMouseMove, handleCardMouseLeave, resetCardTilt,
  onNavigate, onGitHubClick, onGearClick, gearSpun,
  CORE_PROJECTS: CP, PROCESS_DATA: PD, selectedProcessProject, setSelectedProcessProject,
  contactTab, setContactTab,
  formSubmitted, setFormSubmitted, formName, setFormName,
  formEmail, setFormEmail, formSubject, setFormSubject,
  formMessage, setFormMessage, formError, formSending, handleContactSubmit,
  crSubmitted, setCrSubmitted, crName, setCrName,
  crEmail, setCrEmail, crRepo, setCrRepo, crPRLink, setCrPRLink,
  crLanguage, setCrLanguage, crDescription, setCrDescription,
  crConcerns, setCrConcerns, crError, crSending, handleCodeReviewSubmit,
}) {
  const projects = CP || CORE_PROJECTS;
  const process = PD || PROCESS_DATA;

  return (
    <>
      {filterTab === 'about' && (
        <>
          <About onNavigate={onNavigate} onGitHubClick={onGitHubClick} />
          <AboutCards onNavigate={onNavigate} onGitHubClick={onGitHubClick} />
        </>
      )}

      {filterTab !== 'about' && filterTab !== 'contact' && filterTab !== 'process' && (
        <>
          <header className="grid-head reveal">
            <div>
              <span className={`eyebrow tone-${GRID_TONE[filterTab] || 'brass'}`}>
                {GRID_LABEL[filterTab] || 'Work'}
              </span>
              <h1 className="section-title" style={{ marginBottom: 0 }}>
                {GRID_TITLE[filterTab] || 'All work'}
              </h1>
            </div>
            <p className="grid-head-note">
              {GRID_NOTE[filterTab] || 'Everything I have built, publicly and in production.'}
            </p>
          </header>
          <div className={`bento${filterTab === 'void' ? ' void-mode' : ''}`}>
            {shuffledPins.map((pin, i) => (
              <ProjectCard
                key={pin.id}
                pin={pin}
                index={i}
                onOpen={openProjectModal}
                onMouseEnter={handleCardMouseEnter}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                onResetTilt={resetCardTilt}
                onGearClick={onGearClick}
                gearSpun={gearSpun}
              />
            ))}
          </div>
        </>
      )}

      {filterTab === 'process' && (
        <section className="process-section">
          <span className="eyebrow reveal tone-indigo">Thinking Process</span>
          <h1 className="section-title reveal tone-indigo">How the work actually went.</h1>
          <p className="lede reveal" style={{ marginBottom: 'var(--sp-8)' }}>
            Not the pitch — the decisions, the dead ends, and the bugs that cost a weekend.
          </p>
          <div className="process-nav reveal">
            {projects.map((p) => (
              <button
                key={p.id}
                className={`process-nav-btn${selectedProcessProject === p.id ? ' active' : ''}`}
                onClick={() => setSelectedProcessProject(p.id)}
              >
                {p.title}
              </button>
            ))}
          </div>
          {selectedProcessProject && process[selectedProcessProject] ? (
            <div className="process-content reveal">
              <h3 className="process-title">
                {projects.find((p) => p.id === selectedProcessProject)?.title}
              </h3>
              <a
                href={projects.find((p) => p.id === selectedProcessProject)?.githubUrl
                  || `https://github.com/${PROFILE.githubHandle}/${projects.find((p) => p.id === selectedProcessProject)?.repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="process-repo-link"
              >
                View on GitHub <Icon name="arrowUpRight" size={12} />
              </a>
              <div className="process-block">
                <h4 className="process-block-title">Thinking Process</h4>
                <p className="process-text">
                  <WordReveal text={process[selectedProcessProject].thinking} />
                </p>
              </div>
              <div className="process-block">
                <h4 className="process-block-title">Errors Encountered</h4>
                <ul className="process-list">
                  {process[selectedProcessProject].errors.map((e, i) => (
                    <li key={i} className="process-list-item">{e}</li>
                  ))}
                </ul>
              </div>
              <div className="process-block">
                <h4 className="process-block-title">Skills Learned</h4>
                <div className="process-tags">
                  {process[selectedProcessProject].skillsLearned.map((s, i) => (
                    <span key={i} className="process-tag">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="process-content reveal">
              <p className="process-text" style={{ textAlign: 'center', color: 'var(--c-ink-3)' }}>
                Select a project above to see the thinking process, errors encountered, and skills learned.
              </p>
            </div>
          )}
        </section>
      )}

      {filterTab === 'contact' && (
        <section id="contact" className="contact-section">
          <span className="eyebrow reveal tone-clay">Contact</span>
          <h1 className="section-title reveal tone-clay"><Typewriter text="Let's build something." /></h1>
          <p className="lede reveal" style={{ marginBottom: 'var(--sp-8)' }}>
            Open to SDE internships and full-time roles from 2027. The fastest way to reach me is email —
            I read everything, and I reply.
          </p>
          <div className="contact-tabs reveal">
            <button className={`contact-tab${contactTab === 'message' ? ' active' : ''}`} onClick={() => setContactTab('message')}>Contact Me</button>
            <button className={`contact-tab${contactTab === 'codereview' ? ' active' : ''}`} onClick={() => setContactTab('codereview')}>Code Review Request</button>
          </div>
          <div className="contact-wrap reveal">
            {contactTab === 'message' ? (
              formSubmitted ? (
                <div className="form-success">
                  <p>Message sent successfully!</p>
                  <p>Thank you for reaching out. I'll get back to you soon.</p>
                  <button className="btn" style={{ marginTop: 'var(--sp-6)' }} onClick={() => setFormSubmitted(false)}>
                    <span className="btn-label">Send another message</span>
                    <span className="btn-icon"><Icon name="arrowUpRight" size={14} /></span>
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleContactSubmit}>
                  <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                    <input type="text" name="bot-field" tabIndex="-1" autoComplete="off" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="form-name">Name *</label>
                    <input id="form-name" type="text" placeholder="Your name" autoComplete="name" enterKeyHint="next" value={formName} onChange={e => setFormName(e.target.value)} required />
                  </div>
                  <div className="form-field">
                    <label htmlFor="form-email">Email *</label>
                    <input id="form-email" type="email" placeholder="your@email.com" autoComplete="email" enterKeyHint="next" inputMode="email" autoCapitalize="none" autoCorrect="off" value={formEmail} onChange={e => setFormEmail(e.target.value)} required />
                  </div>
                  <div className="form-field">
                    <label htmlFor="form-subject">Subject</label>
                    <select id="form-subject" value={formSubject} onChange={e => setFormSubject(e.target.value)}>
                      <option value="Internship Opportunity">Internship Opportunity</option>
                      <option value="Collaboration">Collaboration</option>
                      <option value="Just saying hi">Just saying hi</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="form-message">Message *</label>
                    <textarea id="form-message" rows="5" placeholder="Your message..." value={formMessage} onChange={e => setFormMessage(e.target.value)} required />
                  </div>
                  {formError && <p className="form-error">{formError}</p>}
                  <button type="submit" className="btn" disabled={formSending}>
                    <span className="btn-label">{formSending ? 'Sending…' : 'Send Message'}</span>
                    <span className="btn-icon"><Icon name="arrowUpRight" size={14} /></span>
                  </button>
                </form>
              )
            ) : (
              crSubmitted ? (
                <div className="form-success">
                  <p>Review request submitted!</p>
                  <p>I'll review the code and get back to you at {crEmail}.</p>
                  <button className="btn" style={{ marginTop: 'var(--sp-6)' }} onClick={() => { setCrSubmitted(false); setCrName(''); setCrEmail(''); setCrRepo(''); setCrPRLink(''); setCrLanguage(''); setCrDescription(''); setCrConcerns(''); }}>
                    <span className="btn-label">Submit another</span>
                    <span className="btn-icon"><Icon name="arrowUpRight" size={14} /></span>
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleCodeReviewSubmit}>
                  <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                    <input type="text" name="bot-field" tabIndex="-1" autoComplete="off" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="cr-name">Name *</label>
                    <input id="cr-name" type="text" placeholder="Your name" autoComplete="name" enterKeyHint="next" value={crName} onChange={e => setCrName(e.target.value)} required />
                  </div>
                  <div className="form-field">
                    <label htmlFor="cr-email">Email *</label>
                    <input id="cr-email" type="email" placeholder="your@email.com" autoComplete="email" enterKeyHint="next" inputMode="email" autoCapitalize="none" autoCorrect="off" value={crEmail} onChange={e => setCrEmail(e.target.value)} required />
                  </div>
                  <div className="form-field">
                    <label htmlFor="cr-repo">GitHub Repo URL *</label>
                    <input id="cr-repo" type="url" placeholder="https://github.com/user/repo" autoCapitalize="none" autoCorrect="off" enterKeyHint="next" value={crRepo} onChange={e => setCrRepo(e.target.value)} required />
                  </div>
                  <div className="form-field">
                    <label htmlFor="cr-pr">PR / Issue Link</label>
                    <input id="cr-pr" type="url" placeholder="https://github.com/user/repo/pull/1" autoCapitalize="none" autoCorrect="off" value={crPRLink} onChange={e => setCrPRLink(e.target.value)} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="cr-lang">Language / Framework</label>
                    <input id="cr-lang" type="text" placeholder="e.g. Python, React, Go" autoCapitalize="none" autoCorrect="off" value={crLanguage} onChange={e => setCrLanguage(e.target.value)} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="cr-desc">What needs reviewing? *</label>
                    <textarea id="cr-desc" rows="4" placeholder="Describe what the code does and what you'd like me to focus on..." value={crDescription} onChange={e => setCrDescription(e.target.value)} required />
                  </div>
                  <div className="form-field">
                    <label htmlFor="cr-concerns">Specific Concerns</label>
                    <textarea id="cr-concerns" rows="3" placeholder="Performance, security, architecture, code style..." value={crConcerns} onChange={e => setCrConcerns(e.target.value)} />
                  </div>
                  {crError && <p className="form-error">{crError}</p>}
                  <button type="submit" className="btn" disabled={crSending}>
                    <span className="btn-label">{crSending ? 'Sending…' : 'Submit for Review'}</span>
                    <span className="btn-icon"><Icon name="arrowUpRight" size={14} /></span>
                  </button>
                </form>
              )
            )}
          </div>
          <div className="contact-social reveal">
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" onClick={onGitHubClick}>
              <Icon name="github" size={14} /> GitHub
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
            <a href={`mailto:${PROFILE.email}`}>
              <Icon name="mail" size={14} /> {PROFILE.email}
            </a>
            <a href={PROFILE.resume} download>
              <Icon name="download" size={14} /> Résumé
            </a>
          </div>
        </section>
      )}
    </>
  );
}
