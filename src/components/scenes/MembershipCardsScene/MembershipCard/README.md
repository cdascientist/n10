# MembershipCard

One `.card` in the membership grid. Two shapes share this component —
photo cards (`bgSrc` → `.bg` img + tone + fade) and metric cards
(`.metric` `data-count` counter, optional `data-suffix`, animated by
effects.js). The bold `h3` title appears on the photo / wide cards; the
last `<p>` carries an inline `marginTop` on the metric cards. All copy
+ attributes come from props so the rendered DOM is byte-identical to
the inline original.

**Used by:** MembershipCardsScene
(src/components/scenes/MembershipCardsScene/index.jsx) — five
instances, direct children of the `.grid`.

**Contains:** `div.card` > `?(.bg)`, `.ico` (svg `use#i-*`),
`p.kicker`, `?(h3)`, `?(.metric[data-count][data-suffix])`, `p`.

## Modify
- Change the card structure → this `index.jsx`.
- Change card content → the `MembershipCard` props in the parent scene.
