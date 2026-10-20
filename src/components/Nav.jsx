import React, { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { TABS, PROFILE } from '../data/portfolio.js';

/* ============================================================
   FLUID ISLAND NAV
   - Desktop: floating glass pill with magnetic tab cluster
   - Mobile: pill collapses to brand + burger; burger morphs to X
   - Burger opens a full-bleed glass sheet with staggered
     mask-reveal of the links
   ============================================================ */

export default function Nav({
  filterTab,
  onTabChange,
  konamiCount,
  foundEggs,
  eggTotal,
  eggExpanded,
  onEggToggle,
}) {
  const [open, setOpen] = useState(false);
  const barRef = useRef(null);
  const overlayRef = useRef(null);

  // close overlay on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  // stagger the overlay links in on open
  useEffect(() => {
    if (!open || !overlayRef.current) return;
    const nodes = overlayRef.current.querySelectorAll('.overlay-link, .overlay-foot');
    nodes.forEach((n) => n.classList.remove('in'));
    const raf = requestAnimationFrame(() => {
      nodes.forEach((n) => n.classList.add('in'));
    });
    return () => cancelAnimationFrame(raf);
  }, [open]);

  /* magnetic tab cluster */
  const handleMagnet = (e) => {
    const bar = barRef.current;
    if (!bar) return;
    const tabs = bar.querySelectorAll('.tab-btn');
    tabs.forEach((t) => {
      const tr = t.getBoundingClientRect();
      const dx = e.clientX - (tr.left + tr.width / 2);
      const dy = e.clientY - (tr.top + tr.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxD = 150;
      if (dist < maxD) {
        const f = (1 - dist / maxD) * 6;
        const a = Math.atan2(dy, dx);
        t.style.transform = `translate3d(${Math.cos(a) * f}px, ${Math.sin(a) * f}px, 0)`;
      } else {
        t.style.transform = '';
      }
    });
  };
  const resetMagnet = () => {
    barRef.current?.querySelectorAll('.tab-btn').forEach((t) => { t.style.transform = ''; });
  };

  const pick = (key) => {
    onTabChange(key);
    setOpen(false);
  };

  return (
    <>
      <div className="nav-island">
        <div className="nav-pill">
          <a className="nav-brand" href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            Harshit<span className="nb-dim"> Shyamsukha</span>
          </a>

          <div
            className="tab-bar"
            role="tablist"
            ref={barRef}
            onMouseMove={handleMagnet}
            onMouseLeave={resetMagnet}
          >
            {TABS.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={filterTab === t.key}
                className={`tab-btn${filterTab === t.key ? ' active' : ''}${t.key === 'void' ? ' void-tab' : ''}`}
                onClick={(e) => {
                  if (t.key === 'void' && e.shiftKey) {
                    onTabChange('void', { voidPlus: true });
                  } else {
                    onTabChange(t.key);
                  }
                }}
              >
                {t.short}
              </button>
            ))}
          </div>

          <div className="nav-tools">
            {konamiCount !== null && <span className="konami-counter">🕹 {konamiCount}</span>}
            <button
              className={`egg-header-btn${eggExpanded ? ' expanded' : ''}`}
              onClick={onEggToggle}
              aria-label="Easter egg progress"
            >
              <span className="egg-icon">🥚</span>
              {eggExpanded && <span className="egg-header-count">{foundEggs}/{eggTotal}</span>}
            </button>
          </div>

          <button
            className={`nav-burger${open ? ' open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className="burger-bar" />
            <span className="burger-bar" />
          </button>
        </div>
      </div>

      {open && (
        <div className="nav-overlay" ref={overlayRef} role="dialog" aria-modal="true" aria-label="Menu">
          <div className="overlay-inner">
            {TABS.map((t, i) => (
              <button
                key={t.key}
                className={`overlay-link${filterTab === t.key ? ' active' : ''}${t.key === 'void' ? ' void-tab' : ''}`}
                style={{ '--i': i }}
                onClick={() => pick(t.key)}
              >
                <span className="ol-idx">{String(i + 1).padStart(2, '0')}</span>
                {t.label}
              </button>
            ))}
            <div className="overlay-foot">
              <a className="btn btn-ghost" href={PROFILE.github} target="_blank" rel="noopener noreferrer">
                <span className="btn-label">GitHub</span>
                <span className="btn-icon"><Icon name="arrowUpRight" size={14} /></span>
              </a>
              <a className="btn" href="mailto:harshitshyamsukha@gmail.com">
                <span className="btn-label">Get in touch</span>
                <span className="btn-icon"><Icon name="mail" size={14} /></span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
