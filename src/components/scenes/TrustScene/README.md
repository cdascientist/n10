# TrustScene

Page 3 — the purple cover page (`panel--cover`, 70% transparent,
slides over the first pages): four trust facts (licensed therapists,
190° infrared, 42° plunge, 6a–10p daily).

**Used by:** App (src/App.jsx) — THIRD cover child inside the
`.cover-stack` (hero → intro → trust).

**Contains:** `section#trust.scene.panel--cover[data-bg=#8B2BFF]
[data-ink=light][data-cover=true]` > `.wrap.scene-in` > `pills`
(the `.trust` row).

## Modify
- Change the trust facts → `pills/` (add/remove a `TrustPill`).
- The cover slide (70% transparent) is a Mechanic scrub in effects.js.
