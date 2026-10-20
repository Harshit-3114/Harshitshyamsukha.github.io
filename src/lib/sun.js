/**
 * THE SUN
 *
 * A page has a light source. Right now this site pretends the light
 * comes from the same corner forever, which is the one thing that
 * makes a "living" design feel fake.
 *
 * So the site computes where the sun actually is — declination and
 * hour angle for the site's latitude — and uses it for two things:
 *
 *   the SHADOWS   their direction follows the hour; their length
 *                 follows how high the sun is. A 7am shadow lies
 *                 across the page, a noon shadow sits underneath it.
 *   the HOUR      the time of day is read off the sun, not off a
 *                 clock, so "golden hour" means what it says.
 *
 * The NOAA solar position equations, simplified to the numbers a
 * layout actually needs.
 */

const RAD = Math.PI / 180;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/** The sun's tilt through the year. */
export function declination(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date - start) / 86400000);
  return 23.45 * Math.sin((2 * Math.PI / 365) * (284 + dayOfYear));
}

/**
 * Where the sun is, for a given hour.
 *
 * The hour is read as LOCAL SOLAR TIME at the given latitude, which
 * is close enough to any clock and keeps the mood, the shadows and
 * the readout saying the same thing.
 */
export function sunState(hour, lat = 13.0827, date = new Date()) {
  const decl = declination(date);
  const latR = lat * RAD;
  const declR = decl * RAD;
  const ha = ((hour - 12) * 15) * RAD;

  const sinEl = Math.sin(latR) * Math.sin(declR)
    + Math.cos(latR) * Math.cos(declR) * Math.cos(ha);
  const elevation = Math.asin(clamp(sinEl, -1, 1)) / RAD;

  /* sunrise and sunset for today, from the hour angle */
  const cosH = -Math.tan(latR) * Math.tan(declR);
  const H0 = Math.acos(clamp(cosH, -1, 1)) / RAD;
  const sunrise = 12 - H0 / 15;
  const sunset = 12 + H0 / 15;

  const isDay = elevation > -0.833;

  /* the sun's place on the page: it rises on the left and sets on
     the right, which is the model everybody already has in their head */
  const dayT = isDay ? clamp((hour - sunrise) / (sunset - sunrise), 0, 1) : 0;
  const x = isDay ? (dayT * 2 - 1) : 0;
  const height = isDay ? Math.max(0.08, Math.sin(dayT * Math.PI)) : 0;

  /* shadows fall away from the sun, and lie flatter the lower it is */
  const shadowX = isDay ? -x * (0.35 + (1 - height) * 0.95) : 0;
  const shadowY = isDay ? 0.18 + height * 0.95 : 0.9;

  /* low sun = long shadow, high sun = short shadow */
  const length = isDay ? clamp(0.9 + (1 - height) * 2.3, 0.7, 3.2) : 0.7;

  /* the time of day, read off the sun rather than off a clock */
  let band;
  if (elevation < -6) band = 'night';
  else if (elevation < 9) band = hour < 12 ? 'dawn' : 'dusk';
  else if (hour < 12) band = 'morning';
  else if (hour < 17) band = 'afternoon';
  else band = 'evening';

  /* low sun = warm light */
  const warmth = isDay ? clamp(1 - elevation / 42, 0, 1) : 0.72;

  return {
    hour,
    isDay,
    x,
    height,
    shadowX,
    shadowY,
    length,
    warmth,
    elevation,
    band,
    sunrise,
    sunset,
    azimuth: (Math.atan2(Math.sin(ha), Math.cos(ha) * Math.sin(latR) - Math.tan(declR) * Math.cos(latR)) / RAD + 180) % 360,
  };
}

/** The human label for a time, as the console prints it. */
export function formatHour(hour) {
  const h = Math.floor(hour) % 24;
  const m = Math.floor((hour - Math.floor(hour)) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
