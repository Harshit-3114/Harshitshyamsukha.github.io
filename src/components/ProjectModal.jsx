import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import VisualBlock from './VisualBlock.jsx';
import { GitHubStats, GitHubActivityFeed } from './GitHub.jsx';
import { getPinCategory, ALL_PINS, PIN_TONES, PROFILE } from '../data/portfolio.js';

const FILE_ICON = {
  py: '◆', md: 'M', pdf: '▤', jsx: '◇', yml: '⚙', yaml: '⚙',
  sql: '⊞', txt: '≡', c: 'C', ymlx: '⚙',
};

function CategoryPill({ category }) {
  const tone = PIN_TONES[category] || 'brass';
  return <span className={`pin-category tone-${tone}`}>{getPinCategory(category)}</span>;
}

function Block({ icon, label, children }) {
  return (
    <div className="comment-block">
      <div className="comment-header">
        <div className="comment-icon"><Icon name={icon} size={13} /></div>
        <span className="comment-label">{label}</span>
      </div>
      <div className="comment-divider" />
      {children}
    </div>
  );
}

export default function ProjectModal({ project, origin, onClose, onNav, onOpenById, onGitHubClick }) {
  const [showHint, setShowHint] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef(null);
  const shellRef = useRef(null);

  /* The shared-element transform. `origin` is where the card was when
     it was clicked; the shell starts there and grows into the
     dossier, so the two surfaces are visibly the same object. */
  const [flip, setFlip] = useState({ transform: null, animate: false });

  /* Apple: the exit retraces the entry path. Keep the surface
     mounted for the length of the exit animation instead of
     unmounting it the instant close is requested. */
  const requestClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    document.body.style.overflow = '';

    const shell = shellRef.current;
    if (shell && origin) {
      const r = shell.getBoundingClientRect();
      /* re-measure the card: the page may have moved under the modal */
      const card = origin.pinId
        ? document.querySelector(`[data-pin-id="${origin.pinId}"] .pin-card`)
        : null;
      const o = card ? card.getBoundingClientRect() : origin;
      if (r.width && o.width) {
        const s = o.width / r.width;
        setFlip({
          transform: `translate(${o.left - r.left}px, ${o.top - r.top}px) scale(${s})`,
          animate: true,
        });
      }
    }

    closeTimer.current = setTimeout(() => {
      setClosing(false);
      onClose();
    }, flip.transform ? 460 : 320);
  }, [closing, onClose, origin, flip.transform]);

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  /* ---- open: start at the card, then release into the dossier ---- */
  useLayoutEffect(() => {
    if (!origin) return;
    const shell = shellRef.current;
    if (!shell) return;
    const r = shell.getBoundingClientRect();
    if (!r.width) return;
    const s = origin.width / r.width;
    const start = `translate(${origin.left - r.left}px, ${origin.top - r.top}px) scale(${s})`;

    /* applied before the first paint, with transitions off, so the
       shell never appears at full size and then snaps back */
    setFlip({ transform: start, animate: false });

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setFlip({ transform: 'translate(0px, 0px) scale(1)', animate: true });
      });
    });
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
  }, [origin]);

  const shellClass = [
    'modal-shell',
    closing ? 'is-closing' : '',
    flip.transform ? (flip.animate ? 'is-flip' : 'is-flip no-anim') : '',
  ].filter(Boolean).join(' ');

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') requestClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [requestClose]);

  // show the "scroll" hint only while there is more to reach
  useEffect(() => {
    if (!project) return;
    const update = () => {
      const el = document.querySelector('.modal-right');
      if (!el) { setShowHint(false); return; }
      const more = el.scrollHeight - el.clientHeight - el.scrollTop > 24;
      setShowHint(more);
      el.classList.toggle('has-more', more);
    };
    update();
    const t = setTimeout(update, 350);
    const el = document.querySelector('.modal-right');
    el?.addEventListener('scroll', update, { passive: true });
    return () => {
      clearTimeout(t);
      el?.removeEventListener('scroll', update);
      el?.classList.remove('has-more');
    };
  }, [project]);

  if (!project) return null;

  const usedInRow = (project.usedIn || []).map((id) => ({
    id,
    pin: ALL_PINS.find((x) => x.id === id),
  })).filter((x) => x.pin);

  return (
    <div className={`modal-overlay${closing ? ' is-closing' : ''}`} onClick={requestClose}>
      <button className="modal-nav-btn prev" aria-label="Previous project" onClick={(e) => { e.stopPropagation(); onNav(-1); }}>
        <Icon name="arrowUpRight" size={18} style={{ transform: 'rotate(-90deg)' }} />
      </button>

      <div className={shellClass} onClick={(e) => e.stopPropagation()} ref={shellRef}>
        <div className="modal-inner">
          <div className="modal-left">
            <div className="modal-top-row">
              <CategoryPill category={project.category} />
              {project.status && (
                <span className={`pin-status ${project.status}`} title={project.status === 'live' ? 'Live / Complete' : 'In Progress'} />
              )}
            </div>
            <h2 className="modal-title">{project.title}</h2>
            {project.issuer && <span className="modal-date">{project.issuer}</span>}
            {project.institution && <span className="modal-date">{project.institution}</span>}
            {project.company && (
              <span className="modal-company">
                {project.company}
                {project.product && <em> · {project.product}</em>}
              </span>
            )}
            <span className="modal-date">{project.date}</span>

            {project.stack && (
              <div className="pin-stack" style={{ marginTop: 'var(--sp-2)' }}>
                {project.stack.map((s, i) => (<span key={i} className="pin-tag">{s}</span>))}
              </div>
            )}

            <div className="modal-divider" />
            <p className="modal-caption">{project.desc}</p>

            {project.problem && (
              <div className="modal-problem">
                <span className="modal-problem-label">The Problem</span>
                <p>{project.problem}</p>
              </div>
            )}

            {project.metrics && (
              <div className="modal-metrics">
                <span className="modal-metrics-label">Outcome</span>
                <span className="modal-metrics-value">{project.metrics}</span>
              </div>
            )}

            {project.category === 'academic' && project.highlights && (
              <div className="modal-problem tone-clay">
                <span className="modal-problem-label">Key Takeaways</span>
                {project.highlights.map((h, i) => (
                  <div key={i} className="comment-item" style={{ gap: 'var(--sp-2)', padding: '3px 0', borderBottom: 'none' }}>
                    <span className="comment-bullet">→</span>
                    <span className="comment-text">{h}</span>
                  </div>
                ))}
              </div>
            )}

            {project.category === 'experience' && project.highlights && (
              <div className="modal-problem tone-teal">
                <span className="modal-problem-label">What I shipped &amp; fixed</span>
                {project.highlights.map((h, i) => (
                  <div key={i} className="comment-item" style={{ gap: 'var(--sp-2)', padding: '5px 0', borderBottom: 'none' }}>
                    <span className="comment-bullet">→</span>
                    <span className="comment-text">{h}</span>
                  </div>
                ))}
              </div>
            )}

            {project.category === 'activity' && (
              <>
                <VisualBlock project={project} height="170px" />
                <p className="modal-caption">
                  All active development happens on GitHub. Repositories span AI/ML research prototypes,
                  production full-stack applications, and academic lab experiments.
                </p>
                <GitHubStats username={PROFILE.githubHandle} />
              </>
            )}

            <div className="modal-links-row">
              {project.badge && (
                <a href={project.badge} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  <span className="btn-label">View credential</span>
                  <span className="btn-icon"><Icon name="badge" size={14} /></span>
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn" onClick={onGitHubClick}>
                  <span className="btn-label">View on GitHub</span>
                  <span className="btn-icon"><Icon name="arrowUpRight" size={14} /></span>
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  <span className="btn-label">Live Demo</span>
                  <span className="btn-icon"><Icon name="arrowUpRight" size={14} /></span>
                </a>
              )}
              {usedInRow.length > 0 && usedInRow.map(({ id, pin }) => (
                <button key={id} className="modal-link-btn" onClick={() => onOpenById(id)}>{pin.title}</button>
              ))}
            </div>
          </div>

          <div className="modal-right">
            {project.architecture && (
              <Block icon="layers" label="Architecture">
                <div className="comment-list">
                  {project.architecture.map((point, i) => (
                    <div key={i} className="comment-item">
                      <span className="comment-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="comment-text">{point}</span>
                    </div>
                  ))}
                </div>
              </Block>
            )}

            {project.decisions && (
              <Block icon="badge" label="Key Decisions">
                <div className="comment-list">
                  {project.decisions.map((d, i) => (
                    <div key={i} className="comment-item" style={{ gap: 'var(--sp-2)' }}>
                      <span className="comment-bullet">→</span>
                      <span className="comment-text">{d}</span>
                    </div>
                  ))}
                </div>
              </Block>
            )}

            {project.skills && (
              <Block icon="check" label="Skills Covered">
                <div className="comment-list">
                  {project.skills.map((s, i) => (
                    <div key={i} className="comment-item" style={{ gap: 'var(--sp-2)' }}>
                      <span className="comment-bullet">→</span>
                      <span className="comment-text">{s}</span>
                    </div>
                  ))}
                </div>
              </Block>
            )}

            {project.files && project.files.length > 0 && (
              <Block icon="doc" label="Related Files">
                {project.files.map((f, i) => (
                  <a key={i} href={f.url} target="_blank" rel="noopener noreferrer" className="file-link" onClick={onGitHubClick}>
                    <span className="file-icon">{FILE_ICON[f.type] || '▤'}</span>
                    <div className="file-info">
                      <span className="file-name">{f.name}</span>
                      <span className="file-path">{f.path}</span>
                    </div>
                    <span className="file-ext"><Icon name="arrowUpRight" size={12} /></span>
                  </a>
                ))}
              </Block>
            )}

            {project.category === 'activity' && (
              <Block icon="activity" label="Live Activity Feed">
                <GitHubActivityFeed username={PROFILE.githubHandle} />
              </Block>
            )}

            {project.stack && (
              <Block icon="grid" label="Stack">
                <div className="pin-stack">
                  {project.stack.map((s, i) => (<span key={i} className="pin-tag">{s}</span>))}
                </div>
              </Block>
            )}
          </div>
        </div>

        <button className="modal-close" onClick={requestClose} aria-label="Close">
          <Icon name="close" size={14} />
        </button>

        {showHint && (
          <span className="scroll-hint">
            <Icon name="arrowUp" size={11} style={{ transform: 'rotate(180deg)' }} />
            Scroll for more
          </span>
        )}
      </div>

      <button className="modal-nav-btn next" aria-label="Next project" onClick={(e) => { e.stopPropagation(); onNav(1); }}>
        <Icon name="arrowUpRight" size={18} style={{ transform: 'rotate(90deg)' }} />
      </button>
    </div>
  );
}
