# HeroBackground

The `.hero-bg` block of page 1 — two full-bleed hero photos (one
preload-priority `fetchpriority="high"`, one "alt" crossfade) plus the
white veil layers `#heroVeil` and `#heroVeilW`.

**Used by:** HeroScene (src/components/scenes/HeroScene/index.jsx) —
first child of `section#hero`, before `LargeLogo`.

**Contains:** `div.hero-bg` > `img.shot` + `img.shot.alt` +
`span.veil#heroVeil` + `span.veil-w#heroVeilW`.

## Modify
- Swap the hero imagery or add a layer → `index.jsx` (keep the ids).
- The veil scrub + photo crossfade are driven by effects.js.
