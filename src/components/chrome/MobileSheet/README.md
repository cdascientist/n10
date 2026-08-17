# MobileSheet

The mobile slide-in menu sheet (`#sheet`) — the grouped link lists
(Treatments / Fuel Lab / Club) plus the Book CTA. effects.js slides it
in from the `#burger` and closes it on link tap.

**Used by:** App (src/App.jsx) — eighth top-level sibling, after Nav,
before `<main>`.

**Contains:** `#sheet` > `.wrap` (paddingInline:0) with three `h4.grouped`
blocks (`i-heat`/`i-move`, `i-leaf`, `i-key`/`i-drop`) + a
`a.btn.btn-fill` Book link.

## Modify
- Change the mobile menu links → `index.jsx`.
- The slide animation lives in effects.js.
