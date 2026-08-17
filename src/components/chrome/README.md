# chrome — site chrome

The fixed overlays, boot layer and header that wrap the scroll stage.
Every component here is rendered by `App` (src/App.jsx) as a top-level
sibling of `<main class="deck scene-run" id="top">`, in this order:

| Component | Renders | Sub-parts |
|---|---|---|
| `BackgroundCanvas` | `#bg-canvas` + `#bgPurple` (Mechanic 1) | — |
| `SkipIntroLink` | `#skipIntro` skip link | — |
| `Preloader` | `#preloader` load gate | — |
| `PromoSticker` | `#sticker` promo badge | — |
| `Warp` | `#warp` vignette overlay | — |
| `IconDefs` | hidden SVG defs (`#i-*`, `#mark`, `#mark-ink`, `#markG`, `#markGbp`) | — |
| `Nav` | `#nav` site header | `Nav/Logo`, `Nav/Dropdown`, `Nav/Burger` |
| `MobileSheet` | `#sheet` mobile menu | — |
| `HeroObject` | `#hero-object` pinned mark | — |

## Modify a section
Open the component's directory and read its `README.md`. Copy JSX
verbatim (the DOM is a contract — see CLAUDE.md).
