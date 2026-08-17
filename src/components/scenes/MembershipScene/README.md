# MembershipScene

The MEMBERSHIP scroll scene — the eyebrow / KEY ROOM ticker and the
"one key, every room" intro copy that leads into the card grid
(MembershipCardsScene, which immediately follows).

**Used by:** App (src/App.jsx) — rendered inside
`<main class="deck scene-run" id="top">` after HeatScene, before
MembershipCardsScene (6th plain scene; DOM order stays).

**Contains:** `section#membership.scene[data-bg=#FFFFFF][data-ink=dark]`
> `.wrap.scene-in` > `.eyebrow` + `h2.ticker` KEY/ROOM + p.

## Modify
- Change the heading / copy → `index.jsx`.
- The membership card grid that follows lives in
  `../MembershipCardsScene/`.
