# Preloader

The full-page purple preloader that waits for the load event, then
fades into the page. No-JS-safe — it is hidden by GSAP at runtime
(effects.js), never by CSS.

**Used by:** App (src/App.jsx) — third top-level sibling, after
SkipIntroLink.

**Contains:** `#preloader` with `.pl-mark` svg (`#mark` symbol),
`.pl-type` wordmark, `.pl-bar` progress bar, `.pl-txt` caption.

## Modify
- Change the boot copy / layout → `index.jsx` (keep `id="preloader"`).
- The load gate + reveal are in effects.js.
