# FuelMenuScene

The FUEL LAB board head scene — the eyebrow / THE BOARD ticker and the
placeholder-pricing note that introduces the interactive menu tabs
(BoardScene, which immediately follows).

**Used by:** App (src/App.jsx) — rendered inside
`<main class="deck scene-run" id="top">` after MembershipCardsScene,
before BoardScene (8th plain scene).

**Contains:** `section#fuel-menu.scene[data-bg=#FFFFFF][data-ink=dark]`
> `.wrap.scene-in` > `.eyebrow` + `h2.ticker` THE/BOARD + p.

## Modify
- Change the heading / note → `index.jsx`.
- The interactive tabs that follow live in `../BoardScene/`.
