# SegTabs

The segmented tab row — `#segbar` (the sliding indicator animated by
effects.js) plus the four Fuel Lab tab buttons (`role=tablist`;
`aria-selected` and `data-tab` toggling wired by effects.js).

**Used by:** BoardScene (src/components/scenes/BoardScene/index.jsx) —
first child of `.screen`, before the panes.

**Contains:** `div.seg-wrap` > `div.seg[role=tablist]` > `i#segbar` +
4 × `button[role=tab][data-tab]`.

## Modify
- Rename / reorder the tabs → `index.jsx` (keep `data-tab` indices in
  sync with the MenuPane `data-pane` values).
- The slide + aria behaviour lives in effects.js.
