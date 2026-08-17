# TreatmentsScene (Sports Recovery)

The massage treatments menu — SPORTS RECOVERY headline ("Recover Hard.
Come Back Strong.") plus five modality cards (Deep Tissue / Swedish /
Trigger Point Therapy / Prenatal / Travel), each with a tagline +
description. Client copy v18.8.

**Used by:** App (src/App.jsx) — inside `<main class="deck scene-run">`,
immediately after TrustScene (the purple cover), before GalleryScene.

**Contains:** `section#treatments.scene[data-bg=#FFFFFF][data-ink=dark]`
> `.wrap.scene-in` (eyebrow, ticker SPORTS/RECOVERY, lead para) +
`.treat-grid` (5 × `TreatCard`).

## Modify
- Change a modality card's copy → a `TreatCard` prop in `index.jsx`.
- Add/remove a modality → add/remove a `TreatCard`.
- The card structure → `TreatCard/`.
