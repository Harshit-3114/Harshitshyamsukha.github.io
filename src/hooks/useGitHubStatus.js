import { useEffect, useState } from 'react';

/**
 * GitHub's own operational status, read live.
 *
 * It is a small, honest signal: the site that talks about GitHub all
 * day should be willing to say when GitHub is having a bad time. When
 * GitHub degrades, the repository constellation dims — the graph is
 * literally powered by the API, so it should look that way.
 */

const URL = 'https://www.githubstatus.com/api/v2/status.json';
const CACHE_KEY = 'gh-status-v1';
const TTL = 5 * 60 * 1000;

const LABELS = {
  none: 'operational',
  minor: 'degraded',
  major: 'partial outage',
  critical: 'major outage',
  maintenance: 'maintenance',
};

export default function useGitHubStatus() {
  const [status, setStatus] = useState({ indicator: 'none', label: 'operational', live: false });

  useEffect(() => {
    let cancelled = false;

    const cached = (() => {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const c = JSON.parse(raw);
        return Date.now() - c.at < TTL ? c : null;
      } catch { return null; }
    })();

    if (cached) {
      setStatus({ indicator: cached.indicator, label: LABELS[cached.indicator] || cached.indicator, live: true });
    }

    (async () => {
      try {
        const res = await fetch(URL, { cache: 'no-store' });
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();
        if (cancelled) return;
        const indicator = json.status?.indicator || 'none';
        setStatus({ indicator, label: LABELS[indicator] || indicator, live: true });
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), indicator }));
        } catch { /* storage may be unavailable */ }
      } catch {
        /* offline: keep whatever we already had */
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return status;
}
