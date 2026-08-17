# FooterColumns

The three footer link columns (`.foot-grid`) — Treatments / Fuel Lab /
Club, each an `h4` heading + a `.grouped` list of chevron links.

**Used by:** Footer (src/components/Footer/index.jsx) — second child
of `.wrap`, after the brand block.

**Contains:** `div.foot-grid` > 3 × `div` (`h4` + `div.grouped` > `a` +
`svg.chev`).

## Modify
- Add/remove a column or edit a link → `index.jsx` (keep the `.grouped`
  anchor pattern).
