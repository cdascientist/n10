# HeroObject

The pinned hero object (Mechanic 4) — the IN/TENSION mark in two
variants (filled `#mark` and ink `#mark-ink`) stacked in `#obj-inner`;
effects.js scrubs one variant against the other as the cover pages
slide. `aria-hidden` — pure decoration.

**Used by:** App (src/App.jsx) — rendered inside
`<main class="deck scene-run" id="top">` as the FIRST child, before
the `.cover-stack`.

**Contains:** `#hero-object` > `.obj-inner` > two `.variant` svgs
(`use#mark` / `use#mark-ink`).

## Modify
- Change the mark variants → `index.jsx` (keep `#hero-object`).
- The scrub is a Mechanic-4 timeline in effects.js.
