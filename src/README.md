# src — the React application

The whole IN/TENSION page lives here: a static React tree plus one
imperative behaviour layer. The rendered DOM is a contract (see
CLAUDE.md) — restructure with `npm run build` + the domcheck/suite
gates.

| Path | What it is |
|---|---|
| `main.jsx` | Entry — `flushSync` render of `<App/>`, then `initEffects()` once. |
| `App.jsx` | **Composition root** — imports every component and renders them in DOM order. |
| `effects.js` | **ONE imperative behaviour file** — GSAP / ScrollTrigger / Lenis, preloader, nav, marquee, tabs, counters. Never split. |
| `index.css` | **ONE stylesheet** — all layout/theme, section-bannered. Never split. |
| `components/` | One directory per component (see `components/README.md`). |

## How to find a section
To change anything on the page, open the matching component directory:
site chrome → `components/chrome/`, each scene → `components/scenes/<Scene>/`,
footer → `components/Footer/`. Every directory carries a `README.md`
that says what the files do, where they are used, what they contain,
and how to modify the section.
