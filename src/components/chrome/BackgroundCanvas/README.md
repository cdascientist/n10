# BackgroundCanvas

The fixed full-viewport background colour layer behind the whole
scroll scene (Mechanic 1). No paint comes from CSS — effects.js drives
the `#bgPurple` span to tint the canvas when a purple-bg scene
(trust / book) scrolls into view.

**Used by:** App (src/App.jsx) — first top-level sibling, before
SkipIntroLink.

**Contains:** `#bg-canvas` > `#bgPurple` span. Nothing else.

## Modify
- Change the canvas markup → edit `index.jsx` (keep the two ids).
- Change how the tint behaves → `effects.js` (never split), not here.
