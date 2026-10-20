import React from 'react';
import { useReveal } from './useReveal.js';

/* ============================================================
   WORD REVEAL — words fade up one at a time on entry
   ============================================================ */
export function WordReveal({ text, className = '' }) {
  const [ref, visible] = useReveal({ threshold: 0.2 });
  const words = (text || '').split(' ');
  return (
    <span ref={ref} className={`word-reveal-wrap ${className}`}>
      {words.map((w, i) => (
        <span
          key={i}
          className={`wr-word${visible ? ' vis' : ''}`}
          style={{ transitionDelay: `${i * 26}ms` }}
        >
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}
