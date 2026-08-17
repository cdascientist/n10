# Nav

The fixed site header (`#nav`) — logo, the "Treatments" and "Fuel Lab"
dropdown menus (with `#d1` / `#d2` drop panels and `aria-expanded`
toggling owned by effects.js), the Gallery / Book buttons and the
`#burger` button (also wired in effects.js).

**Used by:** App (src/App.jsx) — seventh top-level sibling, after
IconDefs, before MobileSheet.

**Contains:** `<header.nav#nav>` > `.wrap.nav-in` > `Logo` +
`nav.menu` (2 × `Dropdown` with `.drop#d1/#d2` + plain Membership
link) + `.nav-end` (Gallery / Book / `Burger`).

## Modify
- Change a dropdown's links → the `Dropdown` children in `index.jsx`.
- Change the logo or the burger → `Logo/`, `Burger/`.
- The open/close + aria toggling lives in effects.js.
