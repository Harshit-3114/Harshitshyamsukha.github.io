import React from 'react';
import { GitHubChart } from './GitHub.jsx';

/* ============================================================
   VISUAL BLOCKS — inline technical engravings
   Palette is token-driven so they re-theme with the Void variant.
   ============================================================ */

const S = {
  ink: 'var(--c-ink)',
  ink3: 'var(--c-ink-3)',
  line: 'var(--c-line-2)',
  hair: 'var(--c-line)',
  accent: 'var(--c-brass)',
  sage: 'var(--c-sage)',
  clay: 'var(--c-clay)',
  surf2: 'var(--c-surface-2)',
  surf3: 'var(--c-surface-3)',
  mono: "'JetBrains Mono', monospace",
  sans: "'Plus Jakarta Sans', sans-serif",
  disp: "'Fraunces', serif",
};

export default function VisualBlock({ project, height }) {
  const defaultH =
    project.id === 'dsfs' || project.id === 'skillroute' ? '170px' :
    project.category === 'activity' ? '190px' : '110px';
  const h = height || defaultH;

  let content = null;

  if (project.id === 'dsfs') {
    const shape = "M200,12 L260,18 L310,28 L350,38 L355,55 L320,68 L310,85 L270,100 L245,115 L200,128 L155,115 L135,105 L115,90 L100,75 L88,55 L100,38 L130,25 L165,15 Z";
    content = (
      <svg viewBox="0 0 400 170" style={{ width: '100%', height: '100%' }}>
        <path d={shape} fill="none" stroke={S.line} strokeWidth="1" />
        <path d={shape} fill="none" stroke={S.accent} strokeWidth="1" opacity="0.45" />
        <circle cx="165" cy="30" r="3.5" fill={S.clay}><animate attributeName="r" values="2.5;5;2.5" dur="2.4s" repeatCount="indefinite" /></circle>
        <circle cx="100" cy="68" r="3.5" fill={S.clay}><animate attributeName="r" values="2.5;5;2.5" dur="2.4s" begin="0.8s" repeatCount="indefinite" /></circle>
        <circle cx="245" cy="105" r="3.5" fill={S.clay}><animate attributeName="r" values="2.5;5;2.5" dur="2.4s" begin="1.6s" repeatCount="indefinite" /></circle>
        <text x="288" y="146" fill={S.accent} fontFamily={S.mono} fontSize="10">LTROC 0.73</text>
      </svg>
    );
  } else if (project.id === 'skillroute') {
    const nodes = [{ cx: 80, cy: 80 }, { cx: 160, cy: 40 }, { cx: 200, cy: 100 }, { cx: 280, cy: 50 }, { cx: 300, cy: 110 }, { cx: 120, cy: 120 }, { cx: 340, cy: 80 }];
    const edges = [[0, 1], [0, 5], [1, 2], [2, 3], [3, 4], [2, 5], [3, 6], [4, 6], [5, 2]];
    content = (
      <svg viewBox="0 0 400 170" style={{ width: '100%', height: '100%' }}>
        {edges.map(([a, b], i) => (<line key={i} x1={nodes[a].cx} y1={nodes[a].cy} x2={nodes[b].cx} y2={nodes[b].cy} stroke={S.hair} strokeWidth="0.8" />))}
        {nodes.slice(0, 3).map((n, i) => (
          <circle key={i} cx={n.cx} cy={n.cy} r="3.5" fill={S.accent}>
            <animate attributeName="cx" values={`${n.cx};${n.cx + 2};${n.cx}`} dur="3.4s" repeatCount="indefinite" />
            <animate attributeName="cy" values={`${n.cy};${n.cy - 2};${n.cy}`} dur="3.4s" repeatCount="indefinite" />
          </circle>
        ))}
        {nodes.slice(3).map((n, i) => (<circle key={i + 3} cx={n.cx} cy={n.cy} r="2.6" fill={S.ink3} opacity="0.5" />))}
        <text x="182" y="112" fill={S.ink3} fontFamily={S.mono} fontSize="9" textAnchor="middle">FAISS</text>
      </svg>
    );
  } else if (project.id === 'ai-ethics') {
    content = (
      <svg viewBox="0 0 400 150" style={{ width: '100%', height: '100%' }}>
        <rect x="30" y="32" width="165" height="30" rx="15" fill="none" stroke={S.line} strokeWidth="1" />
        <text x="46" y="51" fill={S.ink3} fontFamily={S.sans} fontSize="9">Analyze this decision…</text>
        <rect x="205" y="74" width="165" height="30" rx="15" fill={S.surf3} />
        <text x="221" y="93" fill={S.clay} fontFamily={S.sans} fontSize="9">Risk: High · Privacy</text>
      </svg>
    );
  } else if (project.id === 'deepfake') {
    content = (
      <svg viewBox="0 0 400 150" style={{ width: '100%', height: '100%' }}>
        {[0, 1, 2].map((row) => [0, 1, 2].map((col) => (
          <rect key={`${row}-${col}`} x={80 + col * 90} y={25 + row * 34} width="60" height="24" rx="3" fill="none" stroke={S.hair} strokeWidth="0.8" />
        )))}
        <line x1="80" y1="25" x2="380" y2="140" stroke={S.clay} strokeWidth="2" opacity="0.12" />
        <line x1="80" y1="59" x2="380" y2="140" stroke={S.clay} strokeWidth="2" opacity="0.12" />
        <line x1="80" y1="93" x2="380" y2="140" stroke={S.clay} strokeWidth="2" opacity="0.12" />
        <text x="240" y="118" fill={S.clay} fontFamily={S.sans} fontSize="18" fontWeight="400">✕</text>
      </svg>
    );
  } else if (project.id === 'insightx') {
    content = (
      <svg viewBox="0 0 400 150" style={{ width: '100%', height: '100%' }}>
        <text x="30" y="32" fill={S.ink3} fontFamily={S.mono} fontSize="9">SELECT revenue FROM…</text>
        {[40, 65, 90, 115, 140].map((x, i) => (
          <rect key={i} x={x} y={72 + (4 - i) * 10} width="30" height={(i + 1) * 16} rx="2" fill={S.accent} opacity="0.55" />
        ))}
      </svg>
    );
  } else if (project.id === 'crest') {
    content = (
      <svg viewBox="0 0 400 150" style={{ width: '100%', height: '100%' }}>
        <path d="M80 104 Q100 52 180 46 Q260 40 320 51 Q360 56 380 104" fill="none" stroke={S.line} strokeWidth="1.2" />
        <circle cx="90" cy="104" r="19" fill="none" stroke={S.hair} strokeWidth="1" />
        <circle cx="360" cy="104" r="19" fill="none" stroke={S.hair} strokeWidth="1" />
        <path d="M96 96 Q180 62 352 96" fill="none" stroke={S.accent} strokeWidth="0.8" opacity="0.6" />
      </svg>
    );
  } else if (project.id === 'redhat') {
    content = (
      <div className="vb-centered">
        <span className="vb-mark vb-mark-rh">RH</span>
        <span className="vb-sub">Certified Specialist</span>
      </div>
    );
  } else if (project.id === 'practera') {
    content = (
      <div className="vb-centered">
        <span className="vb-mark">Practera</span>
        <span className="vb-sub">Study Australia</span>
      </div>
    );
  } else if (project.id === 'dsa-c') {
    content = (
      <svg viewBox="0 0 400 110" style={{ width: '100%', height: '100%' }}>
        <circle cx="200" cy="22" r="7" fill="none" stroke={S.line} strokeWidth="1" />
        <circle cx="130" cy="58" r="7" fill="none" stroke={S.line} strokeWidth="1" />
        <circle cx="270" cy="58" r="7" fill="none" stroke={S.line} strokeWidth="1" />
        <circle cx="80" cy="90" r="7" fill="none" stroke={S.hair} strokeWidth="1" />
        <circle cx="180" cy="90" r="7" fill="none" stroke={S.hair} strokeWidth="1" />
        <circle cx="220" cy="90" r="7" fill="none" stroke={S.hair} strokeWidth="1" />
        <circle cx="320" cy="90" r="7" fill="none" stroke={S.hair} strokeWidth="1" />
        <line x1="200" y1="29" x2="130" y2="51" stroke={S.hair} strokeWidth="0.9" />
        <line x1="200" y1="29" x2="270" y2="51" stroke={S.hair} strokeWidth="0.9" />
        <line x1="130" y1="65" x2="80" y2="83" stroke={S.hair} strokeWidth="0.9" />
        <line x1="130" y1="65" x2="180" y2="83" stroke={S.hair} strokeWidth="0.9" />
        <line x1="270" y1="65" x2="220" y2="83" stroke={S.hair} strokeWidth="0.9" />
        <line x1="270" y1="65" x2="320" y2="83" stroke={S.hair} strokeWidth="0.9" />
        <circle cx="200" cy="22" r="7" fill={S.accent} />
      </svg>
    );
  } else if (project.id === 'dbms') {
    content = (
      <svg viewBox="0 0 400 110" style={{ width: '100%', height: '100%' }}>
        <rect x="70" y="22" width="40" height="22" rx="3" fill="none" stroke={S.line} strokeWidth="1" />
        <rect x="180" y="22" width="40" height="22" rx="3" fill="none" stroke={S.accent} strokeWidth="1" />
        <rect x="290" y="22" width="40" height="22" rx="3" fill="none" stroke={S.line} strokeWidth="1" />
        <line x1="110" y1="33" x2="180" y2="33" stroke={S.hair} strokeWidth="1" />
        <line x1="220" y1="33" x2="290" y2="33" stroke={S.hair} strokeWidth="1" />
        <text x="90" y="37" fill={S.ink3} fontFamily={S.mono} fontSize="6" textAnchor="middle">users</text>
        <text x="200" y="37" fill={S.ink3} fontFamily={S.mono} fontSize="6" textAnchor="middle">orders</text>
        <text x="310" y="37" fill={S.ink3} fontFamily={S.mono} fontSize="6" textAnchor="middle">items</text>
      </svg>
    );
  } else if (project.id === 'os') {
    content = (
      <svg viewBox="0 0 400 110" style={{ width: '100%', height: '100%' }}>
        <circle cx="80" cy="52" r="21" fill="none" stroke={S.line} strokeWidth="1.2" />
        <circle cx="200" cy="52" r="21" fill="none" stroke={S.sage} strokeWidth="1.2" />
        <circle cx="320" cy="52" r="21" fill="none" stroke={S.line} strokeWidth="1.2" />
        <text x="80" y="56" fill={S.ink3} fontFamily={S.mono} fontSize="8" textAnchor="middle">Ready</text>
        <text x="200" y="56" fill={S.ink3} fontFamily={S.mono} fontSize="8" textAnchor="middle">Run</text>
        <text x="320" y="56" fill={S.ink3} fontFamily={S.mono} fontSize="8" textAnchor="middle">Wait</text>
        <line x1="101" y1="52" x2="178" y2="52" stroke={S.hair} strokeWidth="0.9" markerEnd="url(#arr)" />
        <line x1="222" y1="52" x2="298" y2="52" stroke={S.hair} strokeWidth="0.9" markerEnd="url(#arr)" />
        <line x1="320" y1="74" x2="80" y2="74" stroke={S.hair} strokeWidth="0.9" strokeDasharray="4 2" markerEnd="url(#arr)" />
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M0,0 L10,5 L0,10 Z" fill={S.ink3} />
          </marker>
        </defs>
      </svg>
    );
  } else if (project.id === 'btech-cse' || project.visual === 'degree') {
    content = (
      <div className="vb-centered">
        <span className="vb-mark">SRMIST</span>
        <span className="vb-rule" />
        <span className="vb-sub">Comp. Tech. · CSE</span>
      </div>
    );
  } else if (project.id === 'compiler-design') {
    content = (
      <svg viewBox="0 0 400 110" style={{ width: '100%', height: '100%' }}>
        <rect x="40" y="44" width="62" height="18" rx="3" fill="none" stroke={S.line} strokeWidth="1" />
        <text x="56" y="56" fill={S.ink3} fontFamily={S.mono} fontSize="7">TOKEN</text>
        <text x="110" y="57" fill={S.accent} fontFamily={S.mono} fontSize="11">→</text>
        <rect x="170" y="44" width="62" height="18" rx="3" fill="none" stroke={S.line} strokeWidth="1" />
        <text x="178" y="56" fill={S.ink3} fontFamily={S.mono} fontSize="7">PARSER</text>
        <text x="240" y="57" fill={S.accent} fontFamily={S.mono} fontSize="11">→</text>
        <rect x="300" y="44" width="62" height="18" rx="3" fill="none" stroke={S.line} strokeWidth="1" />
        <text x="316" y="56" fill={S.ink3} fontFamily={S.mono} fontSize="7">AST</text>
      </svg>
    );
  } else if (project.id === 'data-science') {
    const dots = [[30, 32], [90, 22], [60, 57], [150, 37], [200, 17], [120, 67], [250, 47], [310, 27], [280, 62], [350, 37], [180, 82], [330, 72]];
    content = (
      <svg viewBox="0 0 400 110" style={{ width: '100%', height: '100%' }}>
        {[0, 25, 50, 75, 100].map((y) => (<line key={y} x1="0" y1={y} x2="400" y2={y} stroke={S.hair} strokeWidth="0.5" />))}
        {[0, 100, 200, 300, 400].map((x) => (<line key={x} x1={x} y1="0" x2={x} y2="110" stroke={S.hair} strokeWidth="0.5" />))}
        {dots.map((d, i) => (<circle key={i} cx={d[0]} cy={d[1]} r="3.4" fill={i % 3 === 0 ? S.clay : S.accent} opacity="0.75" />))}
      </svg>
    );
  } else if (project.id === 'devops') {
    content = (
      <div className="vb-centered vb-stack">
        <div className="vb-tier vb-tier-1">app</div>
        <div className="vb-tier vb-tier-2">runtime</div>
        <div className="vb-tier vb-tier-3">kernel</div>
      </div>
    );
  } else if (project.id === 'software-engineering') {
    content = (
      <svg viewBox="0 0 400 110" style={{ width: '100%', height: '100%' }}>
        <rect x="135" y="24" width="130" height="58" rx="3" fill="none" stroke={S.accent} strokeWidth="1" />
        <text x="166" y="42" fill={S.ink} fontFamily={S.disp} fontSize="9" fontWeight="500">ProjectManager</text>
        <line x1="135" y1="47" x2="265" y2="47" stroke={S.hair} strokeWidth="1" />
        <text x="143" y="60" fill={S.ink3} fontFamily={S.mono} fontSize="7">+ sprints: Sprint[]</text>
        <text x="143" y="73" fill={S.ink3} fontFamily={S.mono} fontSize="7">+ team: Developer[]</text>
      </svg>
    );
  } else if (project.id === 'research-papers') {
    content = (
      <svg viewBox="0 0 400 110" style={{ width: '100%', height: '100%' }}>
        <path d="M180 36 L180 68 L200 57 L220 68 L220 36 Z" fill="none" stroke={S.accent} strokeWidth="1.2" />
        <path d="M174 30 L174 62 L195 51 L216 62 L216 30 Z" fill="none" stroke={S.accent} strokeWidth="1.2" opacity="0.45" />
        <text x="200" y="86" fill={S.accent} fontFamily={S.disp} fontSize="12" fontWeight="500" textAnchor="middle">IEEE</text>
      </svg>
    );
  } else if (project.id === 'github-activity') {
    content = <GitHubChart />;
  }

  return (
    <div className="card-visual" style={{ height: h }}>
      {content}
    </div>
  );
}
