# Marquee

The empty gallery marquee track (`.gal-track` > `#galRun`). effects.js
clones the marquee tiles into `#galRun` and scrubs them against the
scroll — the component only provides the container.

**Used by:** GalleryScene (src/components/scenes/GalleryScene/index.jsx)
— second child of `section#gallery`, after the `.wrap.scene-in`.

**Contains:** `div.gal-track` > `div.gal-run#galRun` (populated at
runtime by effects.js).

## Modify
- The tile markup / speed / scrub all live in effects.js — this file
  only owns the empty container (keep `id="galRun"`).
