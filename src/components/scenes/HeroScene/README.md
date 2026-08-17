# HeroScene

Page 1 — the sticky base scene (`panel--base`, white bg): the
full-bleed hero photos + white veil layers and the large centered
logo. `#heroVeilW` (the white layer) is owned by ONE scrubbed GSAP
timeline (v18.2 fix — see CLAUDE.md).

**Used by:** App (src/App.jsx) — FIRST cover child inside the
`.cover-stack` (hero → intro → trust).

**Contains:** `section#hero.scene.panel--base[data-bg=#FFFFFF]
[data-ink=dark]` > `background` (`.hero-bg`: two shots + `#heroVeil`
+ `#heroVeilW`) + `LargeLogo` (`a.logo.logo-lg`).

## Modify
- Swap the hero photos / veils → `background/`.
- Change the big logo → `LargeLogo/`.
- The veil arc + base-scene scrub are Mechanic timelines in effects.js.
