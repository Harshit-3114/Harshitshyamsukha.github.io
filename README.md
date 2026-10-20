# harshitshyamsukha.github.io

Personal portfolio for **Harshit Shyamsukha** — Software Engineer working across AI/ML and
full-stack engineering.

> Live: **harshit-shyamsukhas-portfolio.vercel.app**
> GitHub: **github.com/Harshit-3114**

## What it is

A single-page React app with a tabbed work index, an in-page AI assistant, a project detail
modal, and a small set of easter eggs. Every tab is deep-linkable (`/#ai`, `/#credentials`,
`/#experience`, …) and the selected tab persists in `localStorage`.

## Stack

| Layer | Choice |
|---|---|
| Build | Vite 8 |
| UI | React 19 |
| Styling | Tailwind CSS 4 (as the PostCSS pipeline) + a hand-written token layer in `src/styles/` |
| Icons | Inline SVG set, 1.15px stroke (`src/components/Icon.jsx`) |
| Motion | CSS only — custom cubic-beziers, `IntersectionObserver` scroll reveals |
| Forms | EmailJS |
| Analytics | Plausible |
| GitHub data | GitHub REST API (stats, events, contribution graph) |
| Hosting | Vercel (static, `dist/`) |

## Design system

**Chromatic Alabaster** — a high-contrast editorial theme on warm paper, with saturated colour
used as *structure* rather than decoration.

- **Ground** `#f2ece0` warm paper · **Ink** `#16130f` near-black
- **Display** Fraunces (variable serif, `opsz` 72–144) · **Body** Plus Jakarta Sans ·
  **Labels** JetBrains Mono
- **One accent per discipline** — violet = AI, jade = full-stack, coral = client,
  amber = certification, blue = academic, teal = experience, steel = activity
- **Depth is structural** — a 1.5px ink border and a hard 4px offset shadow in the card's own
  accent colour, never a blurred drop shadow
- **Midnight Folio** — the `◆ Void` easter egg re-casts every accent to a neutral graphite, so
  the whole UI reads as a single lights-out monochrome

Full rationale and token table: [`design-system/DESIGN.md`](design-system/DESIGN.md).

### Layout

- **Editorial split** hero — display type on one half, staged fact panels on the other
- **Asymmetric bento** work grid — 12 columns cycling 7/5, 4/8 and 6/6 spans
- **Fluid island nav** — a floating glass pill detached from the top edge; on mobile it collapses
  to a burger that morphs into an X and opens a full-screen overlay with a staggered mask reveal

### Mobile-native

- Every `:hover` rule is gated behind `@media (hover: hover) and (pointer: fine)` — touch
  devices fake `:hover` and leave it stuck after a tap
- `:active` press feedback on all controls, since the browser tap highlight is suppressed
- Inputs are 16px so iOS never zooms the page on focus
- `viewport-fit=cover` plus `env(safe-area-inset-*)` on the nav, chat, modal and content
- `prefers-reduced-motion` disables all non-essential animation

## Project layout

```
src/
  App.jsx                 app shell, easter eggs, chat, forms
  index.css               CSS entry — Tailwind + style layer imports
  styles/
    tokens.css            colour, type, space, motion tokens; light + Void themes
    base.css              reset, paper ground, grain, type primitives
    nav.css               fluid island nav, burger morph, overlay
    layout.css            hero split, bento grid, section rhythm
    components.css        cards, buttons, modal, forms, chat
    motion.css            keyframes, scroll reveals, easter eggs
  components/
    About.jsx             hero + capability cards
    Nav.jsx               island nav and mobile overlay
    ProjectCard.jsx       work card (double bezel)
    ProjectModal.jsx      detail modal
    VisualBlock.jsx       inline technical engravings
    GitHub.jsx            stats, activity feed, contribution graph
    Icon.jsx              hairline icon set
  data/portfolio.js       all project / certification / experience records
  hooks/                  useReveal, WordReveal, useRevealObserver
  tabs/TabContent.jsx     per-tab content

design-system/DESIGN.md    design system reference
docs/                     project docs — DSFS, InsightX, email template, design audit
```

## Commands

```bash
npm install
npm run dev        # dev server
npm run build      # production build -> dist/
npm run preview    # serve the built output
npm run lint       # eslint, zero warnings allowed
npm run deploy     # vercel --prod
```

## Deployment

The repo is connected to a Vercel project. Build settings live in `vercel.json`:

- framework `vite`, build `npm run build`, output `dist/`
- hashed assets under `/assets/` are served with a one-year immutable cache
- `cleanUrls` on, trailing slashes off

`vercel.json` deliberately does **not** declare the domain — for a Git-connected project the
domain is assigned in the Vercel project settings, not in the repo.

## Easter eggs

| Trigger | What happens |
|---|---|
| `◆ Void` tab | Midnight Folio — deep-ink monochrome theme |
| `↑↑↓↓←→←→` | Page tilt, 404 screen, reboot |
| `Ctrl+Alt+R` | Rainbow mode |
| `Ctrl+Alt+K` | Credits |
| `Ctrl+Alt+L` | Fake loading bar |
| type `duck` | Debug duck |
| click the footer 5× | Footer message |
| click the AI gear | Spin |
| `Shift`+click `◆` | Void Mode+ (overload) |

Find them all via the egg counter in the nav.
