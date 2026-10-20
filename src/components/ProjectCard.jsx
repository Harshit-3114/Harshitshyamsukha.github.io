import React from 'react';
import Icon from './Icon.jsx';
import { PIN_ICONS, PIN_TONES, getPinCategory } from '../data/portfolio.js';

export default function ProjectCard({ pin, index, onOpen, onMouseEnter, onMouseMove, onMouseLeave, onResetTilt, onGearClick, gearSpun }) {
  const tone = PIN_TONES[pin.category] || 'brass';
  const icon = PIN_ICONS[pin.category] || 'default';
  const isGear = pin.category === 'ai';

  return (
    /* The handlers live on .pin-cell, which NEVER transforms. If they
       sat on the tilting element, the lift would move the card out
       from under the pointer, firing leave, which resets the tilt,
       which moves it back — a feedback loop that freezes the card
       at rest. The cell's hit area is stable, so leave only fires
       when the pointer genuinely leaves. */
    <div
      className="pin-cell"
      data-pin-id={pin.id}
      onPointerEnter={() => onMouseEnter(pin)}
      onPointerMove={(e) => onMouseMove(pin, e, e.currentTarget)}
      onPointerLeave={(e) => { onMouseLeave(); onResetTilt(e.currentTarget); }}
    >
      <div className="pin-wrap">
        <article
          className="pin-card reveal"
          style={{ '--card-index': index % 6 }}
          onClick={() => onOpen(pin)}
        >
          <div className="pin-card-inner">
            <div className={`pin-icon tone-${tone}`}>
              <Icon
                name={icon}
                size={19}
                className={isGear ? `gear-icon${gearSpun ? ' gear-spun' : ''}` : ''}
                onClick={isGear ? (e) => { e.stopPropagation(); onGearClick?.(); } : undefined}
              />
            </div>
            <h3 className="pin-title">{pin.title}</h3>
            {pin.company && (
              <span className="pin-org">
                {pin.company}
                {pin.product && <em> · {pin.product}</em>}
              </span>
            )}
            <p className="pin-desc">{pin.desc}</p>
            <div className="pin-meta">
              <span className={`pin-category tone-${tone}`}>{getPinCategory(pin.category)}</span>
              {pin.status && (
                <span
                  className={`pin-status ${pin.status}`}
                  title={pin.status === 'live' ? 'Live / Complete' : 'In Progress'}
                />
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
