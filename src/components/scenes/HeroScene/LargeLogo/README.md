# LargeLogo

The large centered logo link (`a.logo.logo-lg`) on page 1 — the
filled `#mark` brand mark plus the In/Tension wordmark. Click jumps
to `#top`.

**Used by:** HeroScene (src/components/scenes/HeroScene/index.jsx) —
second child of `section#hero`, after the `.hero-bg` block.

**Contains:** `a.logo.logo-lg` > `svg.logo-mark` (`use#mark`) +
`span.logo-type` (`i.lg-in` + `i.lg-ten`).

## Modify
- Change the logo mark / wordmark → `index.jsx`.
- Its scale/float animation lives in effects.js (Mechanic 4 scrub).
