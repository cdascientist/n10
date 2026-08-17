# BoardScene

The FUEL LAB menu screen — the segmented tab row and four `.pane`
panels (Performance / Recovery / Organic / Hydration), each holding
the `.mrow` menu rows (icon + name + ingredients + price). The row
data lives in `index.jsx` and is handed to each MenuPane.

**Used by:** App (src/App.jsx) — rendered inside
`<main class="deck scene-run" id="top">` after FuelMenuScene, before
BookScene (9th plain scene).

**Contains:** `section#board.scene[data-bg=#FFFFFF][data-ink=dark]` >
`.wrap.scene-in` > `.screen` > `SegTabs` (`#segbar` + 4 tab buttons) +
4 × `MenuPane[data-pane]`.

## Modify
- Change a menu item's copy / price → the `PERFORMANCE` / `RECOVERY` /
  `ORGANIC` / `HYDRATION` arrays at the top of `index.jsx`.
- The tab row → `SegTabs/`; the pane structure → `MenuPane/`.
- Tab switching (aria-selected / data-tab / #segbar) is wired in effects.js.
