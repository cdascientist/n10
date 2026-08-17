# NavLogo

The header logo link (`a.logo`) — the `#mark-bp` brand mark (black→
purple gradient, v19.0) plus the In/Tension wordmark. Click jumps to
`#top`; `aria-label` reads as "InTension home".

**Used by:** Nav (src/components/chrome/Nav/index.jsx) — first child
of `.wrap.nav-in`, before the menu.

**Contains:** `a.logo` > `svg.logo-mark` (`use#mark-bp`) +
`span.logo-type` (`i.lg-in` + `i.lg-ten`).

## Modify
- Swap the mark gradient → edit the `#markGbp` gradient in
  chrome/IconDefs (do not duplicate it here).
- Change the wordmark → `index.jsx`.
