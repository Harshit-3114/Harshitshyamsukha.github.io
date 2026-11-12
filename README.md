# harshitshyamsukha.github.io

Personal portfolio for **Harshit Shyamsukha** — Software Engineer working across AI/ML and
full-stack engineering.

> Live: **harshit-shyamsukhas-portfolio.vercel.app**
> GitHub: **github.com/Harshit-3114**

## What it is

A single-page React app with a tabbed work index, an in-page AI assistant, a project detail
modal, a shell you can actually type into, and a small set of easter eggs. Every tab is
deep-linkable (`/#ai`, `/#credentials`, `/#experience`, …) and the selected tab persists in
`localStorage`.

The headline feature is **the transformer**: press <kbd>Shift</kbd>+<kbd>T</kbd> and the site
restyles itself from a style intent you describe in plain English.

## Stack

| Layer | Choice |
|---|---|
| Build | Vite 8 |
| UI | React 19 |
| Styling | Tailwind CSS 4 (as the Vite plugin) + a hand-written token layer in `src/styles/` |
| Icons | Inline SVG set, 1.15px stroke (`src/components/Icon.jsx`) |
| Motion | CSS only — custom cubic-beziers, `IntersectionObserver` scroll reveals |
| In-browser ML | `@huggingface/transformers` — MiniLM sentence encoder via ONNX Runtime Web |
| Forms | EmailJS |
| Analytics | Plausible |
| GitHub data | GitHub REST API (stats, events, contribution graph) |
| Hosting | Vercel (static, `dist/`) |

## The transformer

A transformer does not set a class on `<body>`. It reads a sequence of tokens, attends over them
with a query, and writes a new representation back out. This one applies that to a layout.

- **Five axes** — `density`, `emphasis`, `temp`, `gravity`, `flow`. Every meaningful element on
  the page is a token carrying an embedding that says how strongly it responds to each axis.
- **Scaled dot-product attention** between your intent (the *query*) and each token's own keys.
  The elements that match receive the most of it; the ones that do not, do not. A "loud"
  transform hits a section title hard and a caption barely.
- **Eleven hand-authored presets** — `dense`, `airy`, `loud`, `quiet`, `cold`, `warm`, `tall`,
  `editorial`, `technical`, `wonk`, `reset`.
- **A real encoder, on demand.** `all-MiniLM-L6-v2` (384 dimensions, q8) runs through ONNX
  Runtime Web in the browser. It is downloaded *only* when the visitor asks for it, and nothing
  the visitor types ever leaves the machine. Until then, a keyword matcher handles the presets —
  and the site is no heavier than it was.
- **The output is CSS.** The transform writes custom properties onto `<html>` (`--tf-density`,
  `--tf-emphasis`, `--tf-temp`, `--tf-gravity`, `--tf-flow`) and React re-renders nothing, which
  is why dragging the focus slider stays at 60fps.
- **A focus dial.** `focus` is a *concentration* dial: 1 sharpens the softmax onto the few
  elements that match, 0 spreads it across the whole page. (The attention function takes a
  temperature, which runs the other way, so the dial is inverted at the call site — and never
  reaches zero, because a zero temperature makes the max term `NaN`.)
- **Attention map.** Toggle it to see which elements the intent actually landed on.

The transform is **off until the visitor asks for it**. A site that transforms itself unprompted
is a site nobody can read.

## The shell

Press <kbd>`</kbd> for a terminal. It is a real shell over a virtual filesystem built from
`src/data/portfolio.js`, so `cat projects/argus.md` can never drift from the card that says
"ARGUS".

```
ls  cd  pwd  cat  tree  open  whoami  about  contact  resume
projects  repos  git  weather  sun  theme  sound  status
history  receipt  clear  help  transform
```

`transform` is the same control surface as the panel — `transform dense` applies the dense
preset; `transform "a 1980s mainframe"` reads a sentence as a style intent.

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
  App.jsx                 app shell, easter eggs, chat, forms, keyboard shortcuts
  index.css               CSS entry — Tailwind + style layer imports
  components/
    About.jsx             hero + capability cards
    Nav.jsx               island nav and mobile overlay
    ProjectCard.jsx       work card (double bezel)
    ProjectModal.jsx      detail modal
    VisualBlock.jsx       inline technical engravings
    GitHub.jsx            stats, activity feed, contribution graph
    Icon.jsx              hairline icon set
    Console.jsx           the terminal emulator
    CommandPalette.jsx    ⌘K command palette
    TransformPanel.jsx    transformer controls
    WeatherField.jsx      ambient weather
    Constellation.jsx     the node constellation
    StatusBar.jsx         bottom status bar
    PrintCV.jsx           print stylesheet for the CV
  data/portfolio.js       all project / certification / experience records
  hooks/
    useTransformer.js     transformer state — intent, attention, DOM output
    useAmbience.js        light / void / sun position
    useSound.js           interface sound
    useGitHubStatus.js    GitHub API status
    useReveal.js, useRevealObserver.js, useTilt.js, WordReveal.jsx
  lib/
    transform.js          the axes, the presets, attention, the keyword matcher
    neural.js             MiniLM encoder loader + zero-shot classifier
    shell.js              every console command
    vfs.js                the virtual filesystem, generated from portfolio.js
    ambience.js, sun.js, weather-commands.js
  styles/
    tokens.css            colour, type, space, motion tokens; light + Void themes
    base.css              reset, paper ground, grain, type primitives
    nav.css               fluid island nav, burger morph, overlay
    layout.css            hero split, bento grid, section rhythm
    components.css        cards, buttons, modal, forms, chat
    motion.css            keyframes, scroll reveals, easter eggs
    transform.css         the transformer's CSS custom-property contract
    ambience.css, print.css
  tabs/TabContent.jsx     per-tab content
  reticle-dev.ts          dev-only verification registration

scripts/embed-bench.mjs  encoder benchmark (npm run bench:embed)
design-system/DESIGN.md   design system reference
docs/                     project docs — DSFS, InsightX, email template, design audit
```

## Commands

```bash
npm install
npm run dev        # dev server
npm run build      # production build -> dist/
npm run preview    # serve the built output
npm run lint       # eslint, zero warnings allowed
npm run bench:embed # prove the in-browser encoder separates the axes
npm run deploy     # vercel --prod
```

`npm run bench:embed` loads the same encoder the browser loads and asserts the thing that
actually matters: that *"make it colder and quieter"* sits closer to *"colder"* than to
*"louder"*. If the embedding stops meaning anything, the benchmark says so.

## Deployment

The repo is connected to a Vercel project. Build settings live in `vercel.json`:

- framework `vite`, build `npm run build`, output `dist/`
- hashed assets under `/assets/` are served with a one-year immutable cache
- `cleanUrls` on, trailing slashes off

`vercel.json` deliberately does **not** declare the domain — for a Git-connected project the
domain is assigned in the Vercel project settings, not in the repo.

### Bundle shape

The ONNX runtime and the transformers library are **lazy chunks**. The main bundle stays small
because the encoder is only fetched when a visitor asks for it:

```
index-*.js          main bundle
neural-*.js         the encoder loader (lazy)
transformers.web-*.js  the transformers library (lazy)
ort-wasm-*.wasm     ONNX Runtime Web (lazy, fetched on demand)
```

## Verification

The app is instrumented with [Reticle](https://docs.reticle.sh), an in-app verification layer
that drives the real browser and returns a pass/fail verdict against a declared consequence —
not a screenshot. The saved flows cover the transformer journey: opening the panel with
<kbd>Shift</kbd>+<kbd>T</kbd>, applying a preset, and driving the same transform from the
shell.

```bash
npx @reticlehq/server gate     # replay the saved flows against the changed files
```

## Easter eggs

| Trigger | What happens |
|---|---|
| `◆ Void` tab | Midnight Folio — deep-ink monochrome theme |
| `↑↑↓↓←→←→` | Page tilt, 404 screen, reboot |
| `Ctrl+Alt+R` | Rainbow mode |
| `Ctrl+Alt+K` | Credits |
| `Ctrl+Alt+L` | Fake loading bar |
| `Shift`+`T` | **The transformer** |
| `` ` `` | **The shell** |
| type `duck` | Debug duck |
| click the footer 5× | Footer message |
| click the AI gear | Spin |
| `Shift`+click `◆` | Void Mode+ (overload) |

Find them all via the egg counter in the nav.

## Licence

MIT — see [LICENSE](LICENSE).

Copyright (c) 2026 Harshit Shyamsukha.
