# HeatScene

The HEAT scroll scene (190° / DON'T) — the tilted art card (ArtCard),
the eyebrow / 190° DON'T ticker, description, chips and reserve link.
The base64 texture lives in ArtCard (byte-identical to the original
App.jsx line — do not reformat).

**Used by:** App (src/App.jsx) — rendered inside
`<main class="deck scene-run" id="top">` after MovementScene, before
MembershipScene (5th plain scene; DOM order must stay put).

**Contains:** `section#heat.scene[data-bg=#FFFFFF][data-ink=dark]` >
`.wrap.scene-in` > `ArtCard` + `.eyebrow` + `h2.ticker` 190°/DON'T +
p + `.chips` + `a.tlink`.

## Modify
- Change the art card → `ArtCard/` (keep the base64 verbatim).
- Change the section copy / chips / link → `index.jsx`.
