# scenes — one directory per scroll scene

Each scene is a full-viewport step of the scroll-story stage. They are
rendered by `App` (src/App.jsx) in the exact DOM order below — do not
reorder. The first three sit inside the `.cover-stack`; the rest are
plain `.scene` children of `<main class="deck scene-run" id="top">`.

| # | Scene | id | bg / ink | Sub-parts |
|---|---|---|---|---|
| 1 | `HeroScene` | `hero` | `#FFFFFF` / dark | `background`, `LargeLogo` |
| 2 | `IntroScene` | `intro` | `#FFFFFF` / dark | `Headline`, `CTARow`, `HeroSub` |
| 3 | `TrustScene` | `trust` | `#8B2BFF` / light (cover) | `pills` |
| 4 | `TreatmentsScene` | `treatments` | `#FFFFFF` / dark | `TreatCard` |
| 5 | `GalleryScene` | `gallery` | `#FFFFFF` / dark | `Marquee` |
| 6 | `MovementScene` | `movement` | `#FFFFFF` / dark | `ArtCard` |
| 7 | `HeatScene` | `heat` | `#FFFFFF` / dark | `ArtCard` |
| 8 | `MembershipScene` | `membership` | `#FFFFFF` / dark | — |
| 9 | `MembershipCardsScene` | `membership-cards` | `#FFFFFF` / dark | `MembershipCard` |
| 10 | `FuelMenuScene` | `fuel-menu` | `#FFFFFF` / dark | — |
| 11 | `BoardScene` | `board` | `#FFFFFF` / dark | `SegTabs`, `MenuPane` |
| 12 | `BookScene` | `book` | `#8B2BFF` / light | `CloseIn` |

## Modify a scene
Open `scenes/<Scene>/` and its `README.md`. Every scene carries
`data-bg` + `data-ink` (effects.js tints the background canvas and
flips ink). Keep ids/classes/`data-*` untouched.
