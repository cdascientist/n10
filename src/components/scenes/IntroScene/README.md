# IntroScene

Page 2 — the half-hold glass panel (`panel--hold`): `#holdTint` glass
layer, `.hero-halo` glow, the "Tension in. / Tension out." headline,
the Book CTA row and the hero sub-copy.

**Used by:** App (src/App.jsx) — SECOND cover child inside the
`.cover-stack` (hero → intro → trust).

**Contains:** `section#intro.scene.panel--hold[data-bg=#FFFFFF]
[data-ink=dark]` > `#holdTint` + `.hero-halo` + `.wrap.scene-in`
(`Headline`, `CTARow`, `HeroSub`).

## Modify
- Edit the headline → `Headline/`.
- Edit the booking CTA → `CTARow/`.
- Edit the intro copy → `HeroSub/`.
- The glass hold + line reveal are Mechanic scrubs in effects.js.
