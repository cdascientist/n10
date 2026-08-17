# MenuPane

One `.pane` menu panel — the `.mrow` rows (icon chip `.mi`, name `.nm`,
ingredients `.ing`, price `.pr`) driven by a `rows` prop. Hidden panes
carry the `hidden` attribute (effects.js toggles the active pane on tab
click). Rows render as a keyed array, so the pane holds adjacent
`.mrow` divs — byte-identical to the inline original.

**Used by:** BoardScene (src/components/scenes/BoardScene/index.jsx) —
four of these inside `.screen`, after SegTabs (Performance / Recovery /
Organic / Hydration).

**Contains:** `div.pane[data-pane][hidden?]` > n × `div.mrow`
(`mi` + `mt`{`nm`,`ing`} + `pr`).

## Modify
- Change the pane structure → this `index.jsx`.
- Change the menu items → the row arrays in the parent BoardScene.
