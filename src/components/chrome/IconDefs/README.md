# IconDefs

The document-wide hidden SVG `<defs>` block — the full original 24px
icon set (1.75 stroke, round caps), the brand `linearGradient`
(`#markG`), the black→purple header gradient (`#markGbp`), the filled
brand mark (`#mark`), the `#mark-bp` header variant and the ink
outline mark (`#mark-ink`). Every `<use href="#i-*">` / `<use
href="#mark*">` in the app references a symbol defined here.

**Used by:** App (src/App.jsx) — sixth top-level sibling, after Warp,
before Nav.

**Contains:** hidden `<svg style={{display:"none"}}>` > `<defs>`
(`#markG`, `#markGbp`) + `<g id="i-hands|heat|cold|move|cup|key|clock|
lock|shield|spark|leaf|drop|bolt|check|arrow|chev|chevd|close">` +
`<symbol id="mark">` + `<symbol id="mark-bp">` + `<symbol id="mark-ink">`.

## Modify
**Keep this ONE component** — all `<symbol>`s must stay in a single
hidden SVG for `<use href>` to work. To add an icon, add a `<g>` here
and reference it from anywhere with `<use href="#i-…">`.
