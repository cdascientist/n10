# Burger

The mobile menu burger (`button#burger`) — three empty `<span>` bars.
effects.js toggles `aria-expanded` and slides the `#sheet` in/out on
click.

**Used by:** Nav (src/components/chrome/Nav/index.jsx) — last child of
`.nav-end`, after the Gallery / Book buttons.

**Contains:** `button.burger#burger` > 3 × `<span>`.

## Modify
- Change the bars / button markup → `index.jsx` (keep `id="burger"`).
- The slide-in/out + aria wiring lives in effects.js.
