# TreatCard

One `.treat` modality card — an icon chip (`.ico`), the treatment name
(`h3`), a tagline (`p.tag`) and the description (`p`). Icon id + copy
come from props so the five SPORTS RECOVERY cards share one markup
shape.

**Used by:** TreatmentsScene
(src/components/scenes/TreatmentsScene/index.jsx) — one instance per
modality, direct children of the `.treat-grid`.

**Contains:** `div.treat` > `span.ico` (svg `use#i-*`) + `h3` +
`p.tag` + `p`.

## Modify
- Change the card structure → this `index.jsx`.
- Change card copy → the `TreatCard` props in the parent scene.
