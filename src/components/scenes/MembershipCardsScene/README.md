# MembershipCardsScene

The membership card grid (no id header — it is the continuation of
`#membership`): five tilted cards mixing photo cards (`.wide.rv` with
`.bg` img + tone + fade) and metric cards (`.rv.d-1..d-4` with `.metric`
`data-count` counters animated by effects.js).

**Used by:** App (src/App.jsx) — rendered inside
`<main class="deck scene-run" id="top">` after MembershipScene, before
FuelMenuScene (7th plain scene; DOM order stays).

**Contains:** `section#membership-cards.scene[data-bg=#FFFFFF]
[data-ink=dark]` > `.wrap.scene-in` > `.grid` (5 × `MembershipCard`).

## Modify
- Change a card's copy / photo → a `MembershipCard` prop in `index.jsx`.
- The card structure → `MembershipCard/`.
- Counter targets (data-count / data-suffix) are consumed by effects.js.
