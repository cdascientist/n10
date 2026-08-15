# Changelog — scroll-scene conversion (branch `scroll-scenes`)

Date: 2026-08-15 · Reference mechanics: shaker.fitness (see `design-audit.md`).

## Files touched

| File | Why |
|------|-----|
| `index.html` | Restaged into **14 scenes** (`<section class="scene" data-bg data-ink>`): hero split into Hero/Trust/Protocol, membership split into head/cards, board split into head/menu. Ticker headlines (Mechanic 3) with the full original headline preserved as `sr-only` text. Added `#bg-canvas` (Mechanic 1), `#hero-object` + `mark-ink` variant symbol (Mechanic 4), "Skip animation" link (Mechanic 6), ink CSS variables + transitions (Mechanic 2), transparent ink-driven nav + outline CTAs (Mechanic 7). Removed: `#progress` bar, decorative `.stage-bg`/bloom/beam/melt layers, the marquee divider band, the old `.rv`/`.fade-up`/`.ln` reveal system (default-hidden CSS that broke the no-JS floor), the space section's full-bleed photo. Added CDN script tags (gsap 3.12.5 + ScrollTrigger + lenis 1.1.18) and `scroll-scenes.js`. Inline script rewired: Lenis-driven anchor scrolling (falls back to the old tween when lenis is absent), old parallax/3D/scroll-progress loop removed, pointer magnet/tilt retained. |
| `scroll-scenes.js` (new) | All seven mechanics + intro + reduced-motion pass: M1 continuous bg interpolation (`ease:'none'`, `scrub:true`), M2 ink inversion via `data-ink`, M3 masked ticker reveals (scene 0 owned by the intro on first visit), M4 persistent hero object (fixed via CSS, variant crossfade + y/rotate per transition, side alternation), M5 snap to scene tops (desktop ≥768px, disabled under RM), M6 intro (~2s, sessionStorage `inTENSION-intro-seen`, skip link jumps `tl.progress(1)`, body overflow locked until done), M7 chrome handled in CSS. Lenis wired into `gsap.ticker` with `lagSmoothing(0)` per brief §2. `ScrollTrigger.refresh()` on load + debounced resize (200 ms). Guards: no-ops without libs (jsdom), `html.js` class gates the pinned object. |
| `scripts/preloader-test.mjs` | One assertion updated (`#hero h1` instead of `.hero h1`) — the hero section class changed to `.scene`. All 18 assertions otherwise unchanged and green. |
| `design-audit.md` (new) | Step-0 inventory, palette, scene→colour mapping, headline-chain report (no natural chain → masked reveal fallback), decisions. |

Not touched: `package.json`, `app.js`, `react/`, `scripts/build.mjs` (no build — the marketing page is hand-maintained; `npm run build` still refused for it).

## Intentional deviations from the brief (all verified)

1. **Mechanic 5 snap targets**: per-scene-top function instead of `1/(n-1)`. Dense scenes (bodywork/heat/movement/fuel carry a photo card + big headline) legitimately grow beyond `100svh` on shorter viewports, so even fractions would land off-scene. The function degenerates to the reference's even spacing on uniform pages and settles within 0.3 px of every scene top (wheel and programmatic, verified headless).
2. **Mechanic 4 pin**: CSS `position:fixed` instead of `ScrollTrigger pin:… pinSpacing:false`. The brief's exact pin code on an absolutely-positioned overlay element mutates scroll height mid-scroll (+826 px) and breaks scrolling under Lenis — reproduced and bisected headless. Fixed positioning is visually identical (object persistently in-viewport across the run) with zero layout impact; variants/side-swap/rotation unchanged.
3. **`snapTo` units**: ScrollTrigger passes progress (0–1) to a non-scrub snap's `snapTo` function, not pixels; the naive brief-style implementation therefore always snapped to the range end. Converted via the trigger's own `start`/`end` (defensive both units).
4. **Marquee band removed** (was between hero and bodywork): divider whose content (service names) is duplicated verbatim in the nav menus and section eyebrows; keeping it would break snap spacing. Content not lost.
5. **Hero `logo-lg` removed from scene 1**: duplicated the nav logo; the pinned mark (Mechanic 4) is the hero's brand object.
6. **Space full-bleed photo removed**: decorative atmosphere; the rooms are shown in the gallery. Stats + headline remain.
7. **Ink tokens** use existing palette values (`--label #1C1C1E`, `--label-2`, `#FFFFFF`, `rgba(255,255,255,.82)`) rather than the brief's `#101010` — palette rule honoured.
8. **CTA rows** kept whole as each scene's one CTA block, restyled to outline/text-link weight with `currentColor`; the book panel keeps its existing filled/tinted buttons (they sit on the white panel, not the scene background).
9. **`.art` photo captions** are now always visible (they were default-hidden until hover/`.in`) — required by the no-JS floor ("nothing at opacity: 0").
10. **No-JS floor fixed**: the previous page hid `.rv`/`.fade-up`/`.ln` content without JS; the rebuild has zero default-hidden content — every hidden pose is applied by GSAP at runtime.

## Verification (headless, Playwright)

- 39/39 acceptance checks green at 1440×900: libs load, 14 scenes, bg interpolation mid-transition (colour ≠ either endpoint), snap lands ≤0.3 px on scene tops, ink flips (light on `#8B2BFF`, dark on white), pinned object + variant alternation, nav transparent, intro/skip/sessionStorage, no horizontal overflow, zero page errors.
- JS-disabled pass: all 14 sections, all headlines visible at opacity 1, no hidden content, no overflow.
- Reduced-motion pass: no intro/snap/pin, bg follows scenes via plain 450 ms transition, everything readable.
- 375×812: no horizontal overflow, headline words fit, snap off.
- Keyboard pass: tab order walks bar→nav (Treatments, Fuel Lab, Membership, The space, Gallery, Book)→hero CTAs, each focused element scrolled into view.
- `scripts/preloader-test.mjs`: 18/18 green.

## Screenshots (deliverable 4)

`/root/n10/screenshots/before/` and `/root/n10/screenshots/after/` (1440×900, 375×812, JS-off and reduced-motion variants). Not committed (artifacts, ~3 MB total).
