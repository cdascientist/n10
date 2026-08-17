# TrustPills

The `.trust` row of four trust-fact pills on the purple cover page
(licensed therapists / 190° infrared / 42° plunge / 6a–10p daily).

**Used by:** TrustScene (src/components/scenes/TrustScene/index.jsx) —
the only child of `.wrap.scene-in` on page 3.

**Contains:** `div.trust` > 4 × `TrustPill` (`TrustPill.jsx`).

## Modify
- Change a fact → edit a `TrustPill` line in `index.jsx` (icon id,
  bold term, trailing text).
- Add a fifth fact → add a `TrustPill` here and, if needed, adjust the
  `.trust` grid layout in index.css.
