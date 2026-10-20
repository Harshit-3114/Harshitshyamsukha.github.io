import React, { useEffect, useMemo, useRef, useState } from 'react';
import Icon from './Icon.jsx';

/**
 * THE REPOSITORY CONSTELLATION
 *
 * The GitHub API returns a list. A list is fine, but it is not a
 * picture of anything. This renders the same list as a field: the
 * account at the centre, every public repository orbiting it, sized by
 * how much work is in it.
 *
 * The layout is deterministic — a phyllotaxis spiral, so the same
 * account always draws the same constellation. It is not a physics
 * simulation because a graph that jitters every time you look at it
 * is a graph you stop looking at. You can drag any node and it stays
 * where you put it.
 */

const HANDLE = 'Harshit-3114';

function layout(nodes, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const maxR = Math.min(w, h) * 0.42;
  const n = nodes.length;
  const golden = Math.PI * (3 - Math.sqrt(5));

  return nodes.map((repo, i) => {
    /* the hub owns the centre — every node starts outside it */
    const t = (i + 1) / (n + 0.5);
    const r = maxR * Math.sqrt(t);
    const a = i * golden;
    // a slight vertical squash reads better than a perfect circle
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r * 0.78;
    const weight = Math.max(1, repo.weight ?? 1);
    return {
      ...repo,
      x,
      y,
      homeX: x,
      homeY: y,
      size: 5 + Math.min(weight, 6.5) * 2.4,
    };
  });
}

export default function Constellation({ username = HANDLE, ghStatus = { indicator: 'none' } }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [moved, setMoved] = useState({});
  const svgRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const W = 640;
  const H = 460;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();
        if (!alive || !Array.isArray(json)) return;
        const clean = json
          .filter((r) => !r.fork)
          .slice(0, 24)
          .map((r) => {
            const days = r.pushed_at
              ? (Date.now() - new Date(r.pushed_at).getTime()) / 86_400_000
              : 999;
            /* weight = the work in it (stars) plus how recently it
               moved (recency), so the field has real structure */
            const weight = Math.log2((r.stargazers_count || 0) + 2)
              + Math.max(0, 2.4 - days / 45);
            return {
              id: r.id,
              name: r.name,
              desc: r.description || 'No description yet — the code is the description.',
              lang: r.language || '—',
              stars: r.stargazers_count || 0,
              url: r.html_url,
              pushed: r.pushed_at,
              weight,
            };
          });
        setRepos(clean);
      } catch {
        if (alive) setFailed(true);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [username]);

  const nodes = useMemo(() => {
    const laid = layout(repos, W, H);
    return laid.map((n) => {
      const mv = moved[n.id];
      return mv ? { ...n, x: mv.x, y: mv.y } : n;
    });
  }, [repos, moved]);

  const cx = W / 2;
  const cy = H / 2;

  const toLocal = (e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const r = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * W,
      y: ((e.clientY - r.top) / r.height) * H,
    };
  };

  const onPointerDown = (e, node) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const p = toLocal(e);
    dragOffset.current = { x: p.x - node.x, y: p.y - node.y };
    setDragging(node.id);
    setActive(node);
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const p = toLocal(e);
    const x = Math.max(18, Math.min(W - 18, p.x - dragOffset.current.x));
    const y = Math.max(18, Math.min(H - 18, p.y - dragOffset.current.y));
    setMoved((m) => ({ ...m, [dragging]: { x, y } }));
  };

  const endDrag = () => setDragging(null);

  const degraded = ghStatus.indicator && ghStatus.indicator !== 'none';

  return (
    <section className={`constellation${degraded ? ' is-degraded' : ''}`} aria-label="Repository constellation">
      <div className="const-head">
        <div className="const-head-left">
          <span className="const-icon"><Icon name="graph" size={15} /></span>
          <div>
            <h3 className="const-title">Repository constellation</h3>
            <p className="const-sub">
              {loading
                ? 'plotting the field…'
                : failed
                  ? 'the API is out of reach — try again later'
                  : `${nodes.length} public repositories, plotted by weight`}
            </p>
          </div>
        </div>
        {degraded && (
          <span className="const-degraded" title="GitHub is degraded, so the field is dimmed">
            <span className="sb-lamp major" /> github {ghStatus.label}
          </span>
        )}
      </div>

      <div className="const-body">
        <svg
          ref={svgRef}
          className="const-svg"
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Graph of public repositories"
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
        >
          <defs>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--c-violet)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--c-violet)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx={cx} cy={cy} r="54" fill="url(#hubGlow)" />

          {nodes.map((n) => (
            <line
              key={`e-${n.id}`}
              className={`const-edge${active && active.id !== n.id ? ' dim' : ''}`}
              x1={cx} y1={cy} x2={n.x} y2={n.y}
            />
          ))}

          {nodes.map((n) => (
            <g
              key={n.id}
              className={`const-node${active?.id === n.id ? ' is-active' : ''}${dragging === n.id ? ' is-dragging' : ''}`}
              transform={`translate(${n.x} ${n.y})`}
              onPointerEnter={() => setActive(n)}
              onPointerDown={(e) => onPointerDown(e, n)}
              tabIndex={0}
              role="link"
              aria-label={`${n.name} — ${n.lang}, ${n.stars} stars`}
              onKeyDown={(e) => { if (e.key === 'Enter') window.open(n.url, '_blank', 'noopener'); }}
            >
              <circle className="const-halo" r={n.size + 8} />
              <circle className="const-dot" r={n.size} />
              {active?.id === n.id && (
                <text className="const-label" x={n.size + 8} y="4">{n.name}</text>
              )}
            </g>
          ))}

          <g className="const-hub" transform={`translate(${cx} ${cy})`}>
            <circle className="const-hub-ring" r="17" />
            <circle className="const-hub-dot" r="9" />
            <text className="const-hub-label" y="32">Harshit-3114</text>
          </g>
        </svg>

        <aside className="const-readout">
          {active ? (
            <>
              <span className="const-readout-name">{active.name}</span>
              <span className="const-readout-desc">{active.desc}</span>
              <div className="const-readout-meta">
                <span className="const-chip">{active.lang}</span>
                <span className="const-chip">★ {active.stars}</span>
                {active.pushed && (
                  <span className="const-chip">pushed {active.pushed.slice(0, 10)}</span>
                )}
              </div>
              <a
                className="const-open"
                href={active.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open on GitHub <Icon name="arrowUpRight" size={13} />
              </a>
            </>
          ) : (
            <>
              <span className="const-readout-name const-idle">Hover a node</span>
              <span className="const-readout-desc">
                Each point is a public repository. Size follows the work in it.
                Drag any point to rearrange the field.
              </span>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
