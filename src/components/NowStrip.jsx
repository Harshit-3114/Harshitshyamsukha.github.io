import React, { useEffect, useState } from 'react';

/**
 * THE NOW STRIP
 *
 * A portfolio says what you have done. It rarely says what you are
 * doing right now, which is the thing a hiring manager actually
 * wants to know.
 *
 * This reads /public/now.json — a plain file in the repository. Edit
 * it, push, and the site changes. No rebuild step, no CMS, no
 * database. The newest entry is dated, so it is honest about how
 * fresh it is.
 */
export default function NowStrip() {
  const [data, setData] = useState(null);
  const [i, setI] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/now.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();
        if (alive) setData(json);
      } catch {
        if (alive) setFailed(true);
      }
    })();
    return () => { alive = false; };
  }, []);

  const items = data?.currently ?? [];
  const current = items.length ? items[i % items.length] : null;

  useEffect(() => {
    if (items.length < 2) return undefined;
    const id = setInterval(() => setI((n) => (n + 1) % items.length), 5200);
    return () => clearInterval(id);
  }, [items.length]);

  if (failed) return null;

  return (
    <div className="now-strip" aria-live="polite">
      <span className="now-label">
        <span className="now-dot" />
        Currently
      </span>
      <span className="now-body">{current || 'Loading what I am up to…'}</span>
      {items.length > 1 && (
        <span className="now-count">{String((i % items.length) + 1).padStart(2, '0')}/{String(items.length).padStart(2, '0')}</span>
      )}
      {data?.updated && <span className="now-date">updated {data.updated}</span>}
    </div>
  );
}
