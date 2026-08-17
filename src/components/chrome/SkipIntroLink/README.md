# SkipIntroLink

The intro skip link (Mechanic 6) — a visually-hidden anchor shown
while the intro timeline runs; clicking it bails out of the intro
scrub.

**Used by:** App (src/App.jsx) — second top-level sibling, after
BackgroundCanvas.

**Contains:** the single `<a class="skip-intro" id="skipIntro">`
anchor. Nothing else.

## Modify
- Edit the link copy or target → `index.jsx` (keep `id="skipIntro"`).
- The reveal/hide timing lives in effects.js.
