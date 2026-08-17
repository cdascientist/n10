# NavDropdown

One `.menu-item` dropdown — the disclosure button (`aria-expanded` /
`aria-controls` owned by effects.js) and its `.drop#d1` / `#d2` panel
holding the link children. The label + id come from props; the drop
links are passed through verbatim so the rendered DOM stays
byte-identical to the inline original.

**Used by:** Nav (src/components/chrome/Nav/index.jsx) — two of these
(Treatments `#d1`, Fuel Lab `#d2`) inside `nav.menu`, before the plain
Membership link.

**Contains:** `div.menu-item` > button (label + chevron `#i-chevd`) +
`div.drop#id` > `{children}` (the drop links).

## Modify
- Change the links of a dropdown → edit the `Dropdown` children in
  Nav/index.jsx.
- Change the disclosure button behaviour → effects.js.
