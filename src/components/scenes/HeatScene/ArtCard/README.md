# ArtCard (Heat)

The tilted art card of the HEAT scene — sauna photo + textured base64
plate + drifting ember dots. The base64 data URI is byte-identical to
the original scene line — do not reformat.

**Used by:** HeatScene (src/components/scenes/HeatScene/index.jsx) —
first child of `.wrap.scene-in`.

**Contains:** `div.art.tilt` > `.duo` (shot + tone + tex + lift),
`.veil`, `.drift` (`<i>` × 3), `.tag` (190° / 42° · Cycle 3×).

## Modify
- Swap the photo or tag copy → `index.jsx`.
- The tilt / ember drift are effects.js animations on the `.art.tilt`
  classes.
