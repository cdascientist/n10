# MovementScene

The MOVEMENT scroll scene (yoga tuesday) — the tilted art card
(ArtCard), the eyebrow / YOGA TUESDAY ticker, description, chips and
schedule link. The base64 texture lives in ArtCard (byte-identical to
the original App.jsx line — do not reformat).

**Used by:** App (src/App.jsx) — rendered inside
`<main class="deck scene-run" id="top">` after GalleryScene, before
HeatScene (4th plain scene; DOM order must stay put).

**Contains:** `section#movement.scene[data-bg=#FFFFFF][data-ink=dark]`
> `.wrap.scene-in` > `ArtCard` + `.eyebrow` + `h2.ticker` YOGA/TUESDAY
+ p + `.chips` + `a.tlink`.

## Modify
- Change the art card → `ArtCard/` (keep the base64 verbatim).
- Change the section copy / chips / link → `index.jsx`.
