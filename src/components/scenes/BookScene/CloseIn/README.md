# CloseIn

The `.close-in` crop block of the booking page — the full-bleed photo
with a `.veil` scrim and the `.inner` copy stack (eyebrow, COME /
LEAVE ticker, booking copy, CTA row).

**Used by:** BookScene (src/components/scenes/BookScene/index.jsx) —
the only child of `.wrap.scene-in`.

**Contains:** `div.close-in` > `img` + `div.veil` + `div.inner`
(`p.eyebrow`, `h2.ticker`, `p`, `div.cta-row`).

## Modify
- Swap the photo or edit the booking copy / CTAs → `index.jsx`.
- The close-in crop animation lives in effects.js.
