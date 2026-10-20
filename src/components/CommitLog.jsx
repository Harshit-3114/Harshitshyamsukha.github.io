import React, { useEffect, useState } from 'react';
import Icon from './Icon.jsx';

/**
 * THE COMMIT HISTORY
 *
 * Every portfolio is a finished thing. This is the thing being
 * finished — the real commit history of this repository, pulled from
 * the GitHub API, laid out as a timeline.
 *
 * It is the most honest thing a portfolio can show: the actual
 * sequence of decisions, not a curated highlight reel.
 */
export default function CommitLog({ repo = 'Harshit-3114/Harshitshyamsukha.github.io' }) {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=24`);
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();
        if (!alive) return;
        if (Array.isArray(json)) {
          setCommits(json.map((c) => ({
            sha: c.sha.slice(0, 7),
            message: String(c.commit?.message || '').split('\n')[0],
            date: c.commit?.author?.date || '',
            url: c.html_url,
            author: c.commit?.author?.name || '',
          })));
        }
      } catch {
        if (alive) setFailed(true);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [repo]);

  return (
    <section className="commit-log" aria-label="Commit history">
      <div className="commit-head">
        <span className="commit-icon"><Icon name="terminal" size={14} /></span>
        <div>
          <h3 className="commit-title">The commit history</h3>
          <p className="commit-sub">
            {loading
              ? 'reading the log…'
              : failed
                ? 'the log is out of reach right now'
                : `${commits.length} commits, live from the GitHub API`}
          </p>
        </div>
      </div>

      {commits.length > 0 && (
        <ol className="commit-list">
          {commits.map((c, i) => (
            <li key={c.sha} className="commit-row" style={{ '--i': i }}>
              <span className="commit-node" />
              <span className="commit-sha">{c.sha}</span>
              <span className="commit-msg">{c.message}</span>
              <span className="commit-date">{String(c.date).slice(0, 10)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
