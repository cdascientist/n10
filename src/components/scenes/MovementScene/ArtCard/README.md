# ArtCard (Movement)

The tilted art card of the MOVEMENT scene — studio photo + textured
base64 plate + "Breathe" pulse. The base64 data URI is byte-identical
to the original scene line — do not reformat.

**Used by:** MovementScene (src/components/scenes/MovementScene/index.jsx)
— first child of `.wrap.scene-in`.

**Contains:** `div.art.tilt` > `.duo` (shot + tone + tex + lift),
`.veil`, `.breath` (`<b>Breathe</b>`), `.tag` (Studio B / Max 14 mats).

## Modify
- Swap the photo or tag copy → `index.jsx`.
- The tilt / pulse are effects.js animations on the `.art.tilt` classes.
