/**
 * AMBIENCE — the site reads its surroundings and dresses accordingly.
 *
 * A portfolio is a room. A room has light, temperature, and weather.
 * So does this one:
 *
 *   TIME OF DAY  -> the light source: where it comes from, how hard
 *                  the shadows are, how warm the paper is.
 *   WEATHER      -> the air: a clear hard day, a flat overcast
 *                  noon, a warm dusk, a cold rain.
 *
 * The chromatic identity of the site never changes — the discipline
 * colours are the site's voice and belong to the author, not to the
 * forecast. What the ambience controls is the LIGHT: the paper's
 * temperature, the shadow's colour and hardness, the sky field, and
 * the grain.
 *
 * Each pairing gets a name, because a room with a mood should be
 * able to say what it is. The names borrow from television's sense
 * of drama rather than from meteorological jargon.
 */

export const TIME_BANDS = [
  { id: 'dawn', label: 'First Light', from: 5, to: 8 },
  { id: 'morning', label: 'Morning', from: 8, to: 12 },
  { id: 'afternoon', label: 'Afternoon', from: 12, to: 16 },
  { id: 'evening', label: 'Golden Hour', from: 16, to: 19 },
  { id: 'dusk', label: 'Dusk', from: 19, to: 21 },
  { id: 'night', label: 'Late Night', from: 21, to: 5 },
];

export const WEATHER_BANDS = {
  clear: { id: 'clear', label: 'Clear' },
  cloud: { id: 'cloud', label: 'Overcast' },
  fog: { id: 'fog', label: 'Fog' },
  drizzle: { id: 'drizzle', label: 'Drizzle' },
  rain: { id: 'rain', label: 'Rain' },
  snow: { id: 'snow', label: 'Snow' },
  storm: { id: 'storm', label: 'Storm' },
  wind: { id: 'wind', label: 'Wind' },
};

/** WMO weather interpretation codes -> our bands. */
export function decodeWeather(code) {
  const c = Number(code);
  if (Number.isNaN(c)) return 'clear';
  if (c === 0) return 'clear';
  if (c === 1 || c === 2) return 'cloud';
  if (c === 3) return 'cloud';
  if (c === 45 || c === 48) return 'fog';
  if (c >= 51 && c <= 57) return 'drizzle';
  if (c >= 61 && c <= 67) return 'rain';
  if (c >= 71 && c <= 77) return 'snow';
  if (c >= 80 && c <= 82) return 'rain';
  if (c >= 85 && c <= 86) return 'snow';
  if (c >= 95) return 'storm';
  return 'cloud';
}

export function timeBand(hour) {
  const h = ((hour % 24) + 24) % 24;
  for (const b of TIME_BANDS) {
    if (b.from < b.to) {
      if (h >= b.from && h < b.to) return b;
    } else if (h >= b.from || h < b.to) {
      return b;
    }
  }
  return TIME_BANDS[0];
}

/**
 * The whole ambience system in one table.
 *
 * `paper`   ground colour of the page
 * `field`   the three sky colours that bleed in behind the content
 * `shade`   shadow tint — shadows are never pure black, they take
 *            the colour of the light that cast them
 * `hard`    0 = no shadow at all (flat overcast), 1 = razor sharp
 *            (direct noon sun). Interpolated between these.
 * `grain`   film grain opacity
 * `name`    what the room calls itself
 */
export const AMBIENCES = {
  'clear:morning': {
    name: 'Morning Glass', paper: '#f4efe4', field: ['#e8dcc4', '#dfe7e0', '#f2e9d8'],
    shade: '#6a5b46', hard: 0.9, grain: 0.3,
  },
  'clear:afternoon': {
    name: 'Hard Noon', paper: '#f6f1e6', field: ['#f0e2c4', '#e4e9dd', '#f6ecda'],
    shade: '#7a6440', hard: 1, grain: 0.26,
  },
  'clear:evening': {
    name: 'Golden Hour', paper: '#f2e7d6', field: ['#eec79a', '#e2b2a4', '#f0dcc0'],
    shade: '#8a5a3c', hard: 0.8, grain: 0.3,
  },
  'clear:dusk': {
    name: 'Duskfall', paper: '#e8ded2', field: ['#c9a3b0', '#8fa0c4', '#e0c4b0'],
    shade: '#4a3a52', hard: 0.5, grain: 0.36,
  },
  'clear:night': {
    name: 'Night Shift', paper: '#dfe0e6', field: ['#b3bcd8', '#8f9ec4', '#c4cbe0'],
    shade: '#2e3352', hard: 0.45, grain: 0.4,
  },
  'clear:dawn': {
    name: 'First Light', paper: '#f2ece2', field: ['#e8d6c6', '#d4d8e2', '#f0e2d4'],
    shade: '#6b5f68', hard: 0.55, grain: 0.32,
  },
  'cloud:morning': {
    name: 'Soft Focus', paper: '#eceae4', field: ['#dcdcd6', '#d2d6d2', '#e6e4de'],
    shade: '#6e6d68', hard: 0.12, grain: 0.42,
  },
  'cloud:afternoon': {
    name: 'Flat Light', paper: '#eeece6', field: ['#dedcd6', '#d4d8d2', '#e8e6e0'],
    shade: '#72726c', hard: 0.08, grain: 0.45,
  },
  'cloud:evening': {
    name: 'Muted Gold', paper: '#eae4da', field: ['#ded2c0', '#d2d4cc', '#e6dccc'],
    shade: '#6f6558', hard: 0.18, grain: 0.4,
  },
  'cloud:dusk': {
    name: 'Blue Hour', paper: '#e0dce0', field: ['#b8bcd0', '#9aa2bc', '#ccc8d0'],
    shade: '#3d415c', hard: 0.15, grain: 0.42,
  },
  'cloud:night': {
    name: 'Dead Channel', paper: '#d8d8de', field: ['#a8aec4', '#8a90a8', '#b8bcc8'],
    shade: '#262a42', hard: 0.12, grain: 0.46,
  },
  'cloud:dawn': {
    name: 'Milk Light', paper: '#eeebe4', field: ['#dedad2', '#d2d6d2', '#e8e4dc'],
    shade: '#6a6a68', hard: 0.14, grain: 0.44,
  },
  'rain:morning': {
    name: 'Cold Rain', paper: '#e2e2de', field: ['#c6cbc8', '#b4bcc0', '#d4d6d2'],
    shade: '#4a5458', hard: 0.1, grain: 0.5,
  },
  'rain:afternoon': {
    name: 'Downpour', paper: '#dedeDC', field: ['#c0c6c4', '#aeb6bc', '#ccd0da'],
    shade: '#454e54', hard: 0.08, grain: 0.52,
  },
  'rain:evening': {
    name: 'Wet Asphalt', paper: '#e0dcda', field: ['#c4bcbe', '#aeb2be', '#d2ccd2'],
    shade: '#423a48', hard: 0.12, grain: 0.5,
  },
  'rain:dusk': {
    name: 'Long Dusk', paper: '#d4d2d8', field: ['#a8aec4', '#8e96ae', '#bcbcc8'],
    shade: '#33384e', hard: 0.1, grain: 0.54,
  },
  'rain:night': {
    name: 'Night Shift', paper: '#cfd0d8', field: ['#9aa2bc', '#7c86a4', '#aeb4c8'],
    shade: '#22263c', hard: 0.08, grain: 0.56,
  },
  'rain:dawn': {
    name: 'Before Light', paper: '#e4e4e0', field: ['#c8ccce', '#b6bec6', '#d8d8da'],
    shade: '#4e565c', hard: 0.12, grain: 0.5,
  },
  'drizzle:morning': {
    name: 'Silver Rain', paper: '#e8e6e2', field: ['#d2d4d2', '#c2c6c8', '#dcdcdc'],
    shade: '#5c6062', hard: 0.14, grain: 0.46,
  },
  'drizzle:afternoon': {
    name: 'Fine Drizzle', paper: '#e6e4e0', field: ['#ced2d0', '#bec2c6', '#d8d8da'],
    shade: '#565c60', hard: 0.12, grain: 0.48,
  },
  'drizzle:evening': {
    name: 'Damp Evening', paper: '#e4dedc', field: ['#cec4c6', '#bebac6', '#d6ccce'],
    shade: '#4e4450', hard: 0.16, grain: 0.46,
  },
  'drizzle:dusk': {
    name: 'Violet Dusk', paper: '#d8d4dc', field: ['#aeaac4', '#949cb6', '#bcbccc'],
    shade: '#3a3a54', hard: 0.14, grain: 0.5,
  },
  'drizzle:night': {
    name: 'Night Shift', paper: '#d2d2da', field: ['#a0a6c0', '#848ca8', '#b2b8cc'],
    shade: '#282c44', hard: 0.1, grain: 0.54,
  },
  'drizzle:dawn': {
    name: 'Misted Dawn', paper: '#e6e4e0', field: ['#ced0d0', '#bec2c6', '#dadaDa'],
    shade: '#585e60', hard: 0.16, grain: 0.46,
  },
  'fog:morning': {
    name: 'Whiteout', paper: '#e9e8e4', field: ['#d8d8d2', '#d0d2ce', '#e2e2dc'],
    shade: '#6c6c68', hard: 0.04, grain: 0.5,
  },
  'fog:afternoon': {
    name: 'Total Fog', paper: '#ebebe6', field: ['#dadad4', '#d2d4ce', '#e4e4de'],
    shade: '#70706c', hard: 0.03, grain: 0.52,
  },
  'fog:evening': {
    name: 'Lamplight', paper: '#e7e0d8', field: ['#d8cfc4', '#ced0c8', '#e0d8cc'],
    shade: '#6e6458', hard: 0.08, grain: 0.48,
  },
  'fog:dusk': {
    name: 'Veiled Dusk', paper: '#dcd8dc', field: ['#c0c0ce', '#a8aec0', '#c8c4ce'],
    shade: '#3e3e54', hard: 0.05, grain: 0.5,
  },
  'fog:night': {
    name: 'Night Shift', paper: '#d4d4dc', field: ['#acb2c6', '#909ab0', '#bcbecd'],
    shade: '#2a2e44', hard: 0.04, grain: 0.54,
  },
  'fog:dawn': {
    name: 'Pearl Light', paper: '#ebe9e4', field: ['#d8dad6', '#d0d4d0', '#e4e4de'],
    shade: '#6e6e6a', hard: 0.06, grain: 0.5,
  },
  'snow:morning': {
    name: 'First Snow', paper: '#eeeeec', field: ['#dce2e6', '#d2dade', '#e8eced'],
    shade: '#5a6670', hard: 0.2, grain: 0.44,
  },
  'snow:afternoon': {
    name: 'Deep Snow', paper: '#f0f0ee', field: ['#dde4e8', '#d4dee4', '#e9eeee'],
    shade: '#55626c', hard: 0.24, grain: 0.42,
  },
  'snow:evening': {
    name: 'Blue Hour Snow', paper: '#e6e8ec', field: ['#ced6e0', '#c0cad8', '#dce2e8'],
    shade: '#414c60', hard: 0.2, grain: 0.46,
  },
  'snow:dusk': {
    name: 'Violet Snow', paper: '#dcdce6', field: ['#c0c4d8', '#aeb4cc', '#d2d6e2'],
    shade: '#353a56', hard: 0.18, grain: 0.5,
  },
  'snow:night': {
    name: 'Night Shift', paper: '#d4d8e2', field: ['#aeb6cc', '#98a2be', '#c4cad8'],
    shade: '#242a42', hard: 0.16, grain: 0.52,
  },
  'snow:dawn': {
    name: 'Snowlight', paper: '#ecedee', field: ['#d8dee4', '#ccd6de', '#e4eaec'],
    shade: '#586470', hard: 0.22, grain: 0.44,
  },
  'storm:morning': {
    name: 'Low Pressure', paper: '#dedede', field: ['#c0c2c2', '#aeb2b6', '#ced0d4'],
    shade: '#43484c', hard: 0.1, grain: 0.56,
  },
  'storm:afternoon': {
    name: 'Breaking Weather', paper: '#dcdcdc', field: ['#bcbec0', '#a8acb2', '#c8cace'],
    shade: '#3e4348', hard: 0.08, grain: 0.58,
  },
  'storm:evening': {
    name: 'Stormlight', paper: '#dad4d4', field: ['#beb6bc', '#a8aeb8', '#ccc6cc'],
    shade: '#3c3446', hard: 0.1, grain: 0.56,
  },
  'storm:dusk': {
    name: 'Thunderhead', paper: '#d0ccd4', field: ['#a8a4bc', '#8e96ac', '#bcb8c8'],
    shade: '#2e3048', hard: 0.08, grain: 0.6,
  },
  'storm:night': {
    name: 'Night Shift', paper: '#caccc8', field: ['#a0a6bc', '#868ea8', '#b8bccc'],
    shade: '#202438', hard: 0.06, grain: 0.6,
  },
  'storm:dawn': {
    name: 'After Lightning', paper: '#e0e0de', field: ['#c4c6c6', '#b6bcc2', '#d4d6d8'],
    shade: '#4a5054', hard: 0.12, grain: 0.54,
  },
  'wind:morning': {
    name: 'Moving Air', paper: '#efeee8', field: ['#dcded4', '#d2d8ce', '#e6e4da'],
    shade: '#6a6c60', hard: 0.3, grain: 0.42,
  },
  'wind:afternoon': {
    name: 'High Wind', paper: '#f0eee8', field: ['#dcded2', '#d0d8cc', '#e4e2d8'],
    shade: '#686c5e', hard: 0.34, grain: 0.4,
  },
  'wind:evening': {
    name: 'Dust in Air', paper: '#eee6d8', field: ['#e0d2bc', '#d4d6c6', '#e8dcc8'],
    shade: '#726450', hard: 0.3, grain: 0.44,
  },
  'wind:dusk': {
    name: 'Wind at Dusk', paper: '#e2dcd8', field: ['#c8c0bc', '#b8bcc4', '#d2ccca'],
    shade: '#464254', hard: 0.26, grain: 0.48,
  },
  'wind:night': {
    name: 'Night Shift', paper: '#d6d6da', field: ['#aeb2c4', '#929ab0', '#c0c4d0'],
    shade: '#2c3044', hard: 0.24, grain: 0.52,
  },
  'wind:dawn': {
    name: 'Windy Dawn', paper: '#edeae2', field: ['#d8dad2', '#ced4cc', '#e4e2da'],
    shade: '#6c6e64', hard: 0.3, grain: 0.44,
  },
};

const FALLBACK = AMBIENCES['clear:afternoon'];

/** The hour that best represents each time band. */
export const BAND_HOUR = {
  dawn: 6,
  morning: 10,
  afternoon: 14,
  evening: 18,
  dusk: 20,
  night: 23,
};

/**
 * Resolve the full ambience.
 *
 * `weather` accepts either a WMO weather code (number) or one of our
 * own bands ('clear', 'cloud', 'fog', 'drizzle', 'rain', 'snow',
 * 'storm', 'wind'). The band form matters because 'wind' is not a
 * WMO condition — it is a state the site can be put into by hand.
 *
 * `bandId` is the time of day. It defaults to the clock, but the sun
 * engine overrides it, so "golden hour" means what it says.
 */
export function resolveAmbience(hour, weather, bandId) {
  const band = bandId
    ? (TIME_BANDS.find((b) => b.id === bandId) || timeBand(hour))
    : timeBand(hour);
  const w = typeof weather === 'string' ? weather : decodeWeather(weather);
  const key = `${w}:${band.id}`;
  const preset = AMBIENCES[key] || AMBIENCES[`${w}:afternoon`] || FALLBACK;
  return {
    key,
    timeBand: band,
    weather: WEATHER_BANDS[w] || WEATHER_BANDS.clear,
    weatherCode: w,
    ...preset,
  };
}

/** Interpolate two hex colours in sRGB. */
export function mix(a, b, t) {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  const f = (i) => Math.round(pa[i] + (pb[i] - pa[i]) * t);
  return `rgb(${f(0)}, ${f(1)}, ${f(2)})`;
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
