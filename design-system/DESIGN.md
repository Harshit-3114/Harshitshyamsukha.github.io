---
name: Chromatic Alabaster
colors:
  canvas: '#f2ece0'
  surface: '#fdfbf6'
  surface-2: '#e9e2d4'
  surface-3: '#ddd4c2'
  shell: '#e2d9c6'
  ink: '#16130f'
  ink-2: '#4c453b'
  ink-3: '#83796b'
  line: 'rgba(22, 19, 15, 0.14)'
  violet: '#5b3fd6'
  blue: '#1f5fd6'
  cyan: '#0091b8'
  teal: '#0d7f92'
  jade: '#0a8f5f'
  lime: '#6ea800'
  amber: '#c97a00'
  coral: '#d93a1e'
  steel: '#4a5568'
typography:
  display:
    fontFamily: Fraunces
    fontSize: 96px
    fontWeight: 300
    lineHeight: 0.86
    letterSpacing: -0.045em
  headline:
    fontFamily: Fraunces
    fontSize: 44px
    fontWeight: 300
    lineHeight: 1
    letterSpacing: -0.035em
  body:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: 500
    letterSpacing: 0.2em
    textTransform: uppercase
spacing:
  unit: 4px
  gutter: 24px
  margin: 32px
  container: 1280px
  section: 96px
radius:
  shell: 24px
  core: 16px
  sm: 6px
  md: 10px
  pill: 999px
motion:
  ease-out: 'cubic-bezier(0.16, 1, 0.3, 1)'
  ease-spring: 'cubic-bezier(0.32, 0.72, 0, 1)'
  ease-soft: 'cubic-bezier(0.4, 0, 0.2, 1)'
  dur-1: 180ms
  dur-2: 380ms
  dur-3: 700ms
  dur-4: 1000ms
---

## Brand & Style

**Chromatic Alabaster** is a high-energy, high-contrast light theme. It reads as a *technical
editorial* — the discipline of a Swiss poster or a printed engineering datasheet — with saturated
colour used as structure rather than decoration.

The paper is warm and slightly toothy. The ink is near-black, never pure `#000`. Every accent is a
solid, flat block of high-chroma colour: it appears as a top bar on a card, a pill, a rule, a
shadow offset. Nothing glows, nothing gradients, nothing blurs into haze.

This is not "minimalist and tasteful". It is loud on purpose, and every loud decision is deliberate.

## Colors

The ground is warm paper `#f2ece0`. Surfaces step up toward `#fdfbf6`; card shells step down to
`#e2d9c6` so the nesting reads as physical depth.

Contrast comes from **ink on paper**, not from greys. The accent palette is a chromatic spectrum
with one tone per discipline — and each tone is used as a *solid fill* on that discipline's cards,
badges and icon chips, so the work grid reads as a colour-coded index at a glance.

| Token | Hex | Discipline |
|---|---|---|
| `--c-violet` | `#5b3fd6` | AI / Research |
| `--c-jade` | `#0a8f5f` | Full-Stack |
| `--c-coral` | `#d93a1e` | Client Work |
| `--c-amber` | `#c97a00` | Certification |
| `--c-blue` | `#1f5fd6` | Academic |
| `--c-teal` | `#0d7f92` | Experience |
| `--c-steel` | `#4a5568` | Activity |

**Midnight Folio** (the `◆ Void` easter egg) is the deep-ink monochrome variant: every accent
collapses to a single neutral graphite, the canvas drops to `#0a0908`, and the whole UI reads as
lights-out. It is deliberately colourless — a blackout, not a second colour scheme.

## Typography

**Fraunces** carries the display voice. Its `opsz` axis is pushed to 72–144 for the big headings,
producing a high-contrast, sharp-edged serif. The italic gets `WONK: 1` for a distinctive,
slightly eccentric terminal.

**Plus Jakarta Sans** handles body copy and UI. **JetBrains Mono** handles every micro-label,
badge, category tag and stat — always uppercase with wide tracking.

Three voices, no overlap. Fraunces never sets body copy; JetBrains Mono never sets a sentence.

## Layout & Spacing

A 12-column grid, max width 1280px, centred. Spacing is a 4px base unit, but the *macro* rhythm
is generous: sections are separated by 96px (or 128px on desktop) so the page breathes.

The hero is an **editorial split** — a 1.05/0.95 two-column grid with the display type on the left
and stacked fact panels on the right. The work grid is an **asymmetrical bento** on the same 12
columns, cycling through 7/5, 4/8 and 6/6 spans so the rhythm never repeats.

Below 768px everything collapses to a single column, the tab bar becomes a floating burger, and
the type scale steps down through `clamp()`.

## Elevation & Depth

Depth is **structural, not atmospheric**. Cards sit in a visible shell (a 1.5px ink border plus a
hard 4px offset shadow in the card's own accent colour). On hover, the card translates up-left and
the offset grows to 7px in a different accent — the same "click" motion as a physical key press.

There are no blurred shadows anywhere in the light theme. The only soft shadow in the system is
the 4px drop under the floating nav pill, which needs to detach from the page.

## Shapes

Two radii only: **24px** for the outer shell and **16px** for the inner core, so nested
enclosures stay concentric. Chips and pills are fully rounded. Avatars are circles. There is no
middle ground — no 6px, no 12px.

## Components

- **Nav:** a floating glass pill detached from the top edge, centred, with a hard offset shadow.
  Active tab is a solid ink pill; the `◆ Void` tab is clay-coloured.
- **Cards:** double-bezel — an outer shell with a 1.5px ink border and a hard offset shadow, and
  an inner core in surface white. A 4–5px solid accent bar sits along the top edge.
- **Buttons:** fully rounded pills with a nested circular icon island on the trailing edge. The
  primary is ink with a magenta offset shadow; on hover the shadow turns cyan and the button
  shifts up-left.
- **Chips:** solid accent fill with the matching "on" colour as text. Never outlined.
- **Eyebrows:** mono, uppercase, 0.2em tracking, in a bordered pill with a small square accent
  dot.
- **Section titles:** Fraunces with a solid 5px accent bar on the leading edge — one colour per
  section, matching that section's discipline.
