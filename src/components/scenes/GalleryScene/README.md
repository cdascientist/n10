# GalleryScene

The GALLERY scroll scene — eyebrow, the NINETY / MINUTES ticker
headline and intro copy, plus the marquee track whose tiles (`#galRun`)
are populated and scrubbed by effects.js.

**Used by:** App (src/App.jsx) — rendered inside
`<main class="deck scene-run" id="top">` after the `.cover-stack`,
before MovementScene (first of the 8 plain scenes).

**Contains:** `section#gallery.scene[data-bg=#FFFFFF][data-ink=dark]`
> `.wrap.scene-in` (eyebrow, `h2.ticker` NINETY/MINUTES, p) + `Marquee`
(`.gal-track` > `.gal-run#galRun`).

## Modify
- Change the section copy / ticker → `index.jsx`.
- The marquee container → `Marquee/`.
- The tile build + scrub live in effects.js.
