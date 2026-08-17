# BookScene

The BOOK scroll scene (purple page) — full-bleed photo with `.close-in`
crop, veil, the COME / LEAVE ticker, booking copy and the Book / Join
the club CTA row.

**Used by:** App (src/App.jsx) — rendered inside
`<main class="deck scene-run" id="top">` after BoardScene, directly
before `</main>` (10th plain scene, last).

**Contains:** `section#book.scene[data-bg=#8B2BFF][data-ink=light]` >
`.wrap.scene-in` > `CloseIn` (the `.close-in` crop block).

## Modify
- Change the photo / copy / CTAs → `CloseIn/`.
- The purple close (book arc) is the final Mechanic scrub in effects.js.
