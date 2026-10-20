import React, { useEffect, useState } from 'react';
import Icon from './Icon.jsx';
import { PROFILE } from '../data/portfolio.js';

const GH = PROFILE.githubHandle;

/* ============================================================
   GITHUB SURFACE — live stats, activity feed, contribution graph
   ============================================================ */

export function GitHubStats({ username }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let alive = true;
    fetch(`https://api.github.com/users/${GH}`)
      .then((r) => r.json())
      .then((d) => { if (alive) setData(d); })
      .catch(() => { if (alive) setData(null); });
    return () => { alive = false; };
  }, [username]);

  if (!data) return null;
  return (
    <div className="gh-stats">
      {[
        { label: 'Repos', value: data.public_repos },
        { label: 'Followers', value: data.followers },
        { label: 'Following', value: data.following },
        { label: 'Gists', value: data.public_gists },
      ].map((s) => (
        <div key={s.label} className="gh-stat">
          <span className="gh-stat-value">{s.value}</span>
          <span className="gh-stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

const EVENT_META = {
  PushEvent: { label: 'pushed', icon: 'arrowUp' },
  PullRequestEvent: { label: 'PR', icon: 'layers' },
  IssuesEvent: { label: 'issue', icon: 'sparkle' },
  WatchEvent: { label: 'starred', icon: 'sparkle2' },
  StarEvent: { label: 'starred', icon: 'sparkle2' },
  ForkEvent: { label: 'forked', icon: 'grid' },
  CreateEvent: { label: 'created', icon: 'doc' },
};

export function GitHubActivityFeed({ username }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch(`https://api.github.com/users/${GH}/events?per_page=20`)
      .then((r) => r.json())
      .then((d) => { if (alive) { setEvents(Array.isArray(d) ? d : []); setLoading(false); } })
      .catch(() => { if (alive) { setEvents([]); setLoading(false); } });
    return () => { alive = false; };
  }, [username]);

  if (loading) return <div className="feed-empty">Loading activity…</div>;
  if (!events.length) return <div className="feed-empty">No recent activity</div>;

  const formatTime = (iso) => {
    const d = new Date(iso);
    const n = new Date();
    const diff = Math.floor((n - d) / 60000);
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  const eventText = (e) => {
    const repo = e.repo.name.replace(`${GH}/`, '');
    const meta = EVENT_META[e.type];
    const suffix = meta ? meta.label : e.type.replace('Event', '');
    if (e.type === 'PushEvent') return `pushed ${e.payload.commits?.length || 0} commit${(e.payload.commits?.length || 0) === 1 ? '' : 's'} to ${repo}`;
    if (e.type === 'PullRequestEvent') return `${e.payload.action} PR in ${repo}`;
    if (e.type === 'IssuesEvent') return `${e.payload.action} issue in ${repo}`;
    if (e.type === 'WatchEvent' || e.type === 'StarEvent') return `starred ${repo}`;
    if (e.type === 'ForkEvent') return `forked ${repo}`;
    if (e.type === 'CreateEvent') return `created ${e.payload.ref_type} in ${repo}`;
    return `${suffix} in ${repo}`;
  };

  return (
    <div className="activity-feed">
      {events.slice(0, 12).map((e, i) => (
        <a key={e.id || i} href={`https://github.com/${e.repo.name}`} target="_blank" rel="noopener noreferrer" className="feed-item">
          <span className="feed-icon"><Icon name={EVENT_META[e.type]?.icon || 'activity'} size={13} /></span>
          <span className="feed-text">{eventText(e)}</span>
          <span className="feed-time">{formatTime(e.created_at)}</span>
        </a>
      ))}
    </div>
  );
}

export function GitHubChart() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="gh-chart-fallback">
        <Icon name="activity" size={22} />
        <span>Contribution data unavailable</span>
        <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">Visit my GitHub ↗</a>
      </div>
    );
  }
  return (
    <img
      className="gh-chart"
      src={`https://ghchart.rshah.org/5b3fd6/${GH.toLowerCase()}`}
      loading="lazy"
      alt="GitHub contribution graph"
      onError={() => setFailed(true)}
    />
  );
}
