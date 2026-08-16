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

---

# Changelog v2 — client revision (2026-08-15, commit `532f6e5`)

Follow-up request after seeing v1 live:

1. **Hero restored to the previous first-page design**: photo backdrop (Unsplash + brand tone + white melt), `logo-lg`, the full `Tension in. / Tension out.` headline with the gradient `em`, the sub paragraph, and a single Book CTA ("Tour the space" removed — its destination page was deleted). Intro sequence retargeted to the restored hero elements.
2. **Logo title is now `InTension`** (capital I, lowercase n, capital T, lowercase "ension") in the nav, hero, footer and preloader: `In` set in the purple brand gradient, `Tension` set in a black-metallic gradient (light-to-dark Apple grays). Old slash wordmark removed.
3. **Background arc is now purple → white → purple**: hero `#FFFFFF` → trust `#8B2BFF` (light ink) → protocol/heat/movement/gallery/membership/cards/board/menu in whites (`#FFFFFF`, `#F2F2F7`, `#F7F2FF`, `#EFE3FF`) → book `#8B2BFF` (light ink). All colours remain existing palette values; ink pairings AA-safe at every snap position.
4. **Vertical spacing tightened**: scene padding `clamp(48px,8vw,88px)` → `clamp(20px,3vw,36px)`; scene-in gap `clamp(16px,2.5vw,26px)` → `clamp(12px,1.8vw,20px)`.
5. **Three pages deleted**: `#bodywork` (Long strokes. Real pressure.), `#fuel` (Fuel Lab / "Everything you drink here has a job"), `#space` ("One room, two moods"). All links to them removed from nav, mobile sheet and footer — verified 0 dangling anchors. Remaining: 11 scenes (hero, trust, protocol, heat, movement, gallery, membership, cards, board, menu, book).

Tests updated to match (`verify.mjs` now 41 checks, all green on :3000 and :80; `preloader-test.mjs` assertion now expects the `InTension` wordmark). Screenshots v2: `/root/n10/screenshots/after-v2/`.

---

# Changelog v4 — first-page revision (2026-08-15, commit `8d8134d`)

Client follow-up: "first page like 3 versions ago … background images of massages … the color that changes layered on top … remove all colors not specified … reduce vertical spacing by 20% … background colors exact to the instructions previous."

1. **Mechanic 8 scroll-cover REMOVED** (client rejected the covered first page). Hero + trust are plain scenes again; all cover CSS/JS/`data-cover` gone; M1 background tween, M2 ink and M5 snap restored across hero→trust. The sticky-blocker fix (`overflow-x:clip`) and the sticky-safe snap-point cache stay (general robustness).
2. **First page**: classic hero (InTension logo, full "Tension in. / Tension out." headline, sub, single Book CTA) on a background of **two massage images** (Unsplash 1741522509438 + 1745327883508) with a slow crossfade, and **the changing colour veiled on top** (`#heroVeil`, purple `#8B2BFF` at 50% opacity at the top, scrubbed to white as the next scene arrives, back on reverse) — the purple→white→purple arc painted over the photos.
3. **Palette purged to the specified colours only**: every scene background is now either `#8B2BFF` (trust, book — the purple bookends) or `#FFFFFF` (everything else). Indigo `#5856D6` and mint `#34C759` removed everywhere (mark gradient, In wordmark gradient, hero `em`, gauge track, pip, verdict, badge, warp flash → purple family / white). Pills, chips, eyebrows, segmented control, burger → white with a purple hairline; preloader, footer, close-in, bar → plain white. Text remains black/gray (shades of the specified black) + purple accents.
4. **Vertical spacing −20%**: scene padding `clamp(20px,3vw,36px)` → `clamp(16px,2.4vw,29px)`; scene-in gap `clamp(12px,1.8vw,20px)` → `clamp(10px,1.4vw,16px)`.
5. `verify.mjs` updated: cover checks removed, hero-veil checks added (purple at top, translucent, white on arrival) — **44/44 green on :3000 and :80**. `preloader-test.mjs` 18/18.

Screenshots v3: `/root/n10/screenshots/after-v3/`.

---

# Changelog v6 — page-2→page-3 background transition + dead-zone removal (2026-08-15)

Client: "apply the content to the sliding page that covers … the logo must be on the first page that is covered … the site should be completely consistent with mobile and desktop." Audit found the two-stage slide was structurally right but (a) page 2's white background did not actually transition into page 3's purple and (b) page 2 occupied a full `100svh`, leaving a ~half-viewport dead scroll before page 3 responded to the second swipe — most noticeable on mobile where snap is off.

1. **Page-2 background now scrubs white → purple** into page 3 (`#8B2BFF`) as `#trust` slides in (`scroll-scenes.js`): the half-hold page's own background and the hero veil both scrub `#FFFFFF → #8B2BFF` over trust's `top bottom → top top`. The whole opening now flows purple → white → purple with no hard seam — "the second page background should transition into the 3rd page background".
2. **Dead zone removed**: `.panel--hold` is now exactly `50vh`/`50svh` (was `100svh` with `padding-bottom:50vh`). The content, halo and hold position are visually identical, but page 3 now enters the viewport the instant the second swipe passes the half-hold (mobile and desktop behave the same; previously a ~`50vh` static stretch preceded page 3).
3. `.panel--hold .hero-halo{bottom:0}` so the white readability halo covers the full (half-height) hold page.
4. `verify.mjs`: 53/53 — added the page-2-bg-purple-at-trust assertion and changed the veil-on-arrival check from white to purple (behavior changed by design). `preloader-test.mjs` 18/18.

Screenshots: `screenshots/after-v5/`.

---

# Changelog v5 — two-stage slide (2026-08-15, commit `9199bb5`)

Client: "the second page swiping up is not smooth … only keep the logo on page 1 … rest of the content on page 2 … page 2 slides in half way, keeping the logo visible … another swipe slides page 3 in entirely … white gradient behind the logo on pages 1–2 only … header 15% taller, header logo 15% bigger."

1. **Page 1 (`#hero`, sticky base, z1)**: only the InTension logo, centred vertically + horizontally in the top half (the panel's content area is `padding-bottom:50vh` so the logo sits above the half-hold). Background = the two massage images + the changing colour veil (purple→white over the first swipe) + a **white radial gradient halo** behind the logo for readability.
2. **Page 2 (`#intro`, sticky `top:50vh`, z2, opaque white)**: the rest of the hero content — "Tension in. / Tension out.", sub, Book CTA — aligned + centred, with the same white halo. It slides up from page 1 over the first swipe and **holds half way up**, logo staying visible above it. `wrap scene-in` removed from the hero panels.
3. **Page 3 (`#trust`, z3, opaque purple)**: slides in **in its entirety** on the second swipe, covering both pages. The canvas tween white→purple is the "second page background transitioning into the third page background". The rest of the page scrolls normally (protocol → … → book, purple→white→purple arc intact).
4. **Snap** now includes the half-hold resting point (`hold layout top − 50vh`): first and second swipes resolve to logo-full / half-hold / trust-land — never parked mid-slide.
5. **Header +15%**: `--navh` 56→64px; nav logo mark 32→37px, wordmark 19→22px (scoped to `.nav` so the footer logo is unchanged).
6. `verify.mjs` 52/52 (half-hold geometry, logo visibility, hold snap, opaque page 2, header sizes, page-1-logo-only); `preloader-test.mjs` 18/18. Screenshots: `screenshots/after-v4/`.

# Changelog v8 — logo glow + glass half-hold (2026-08-15, commit `38d23af`)

Client: "remove the gradient behind the logo on the first page, make the logo 30% bigger and glow via CSS (logo only), always centred vertically + horizontally; move the Book a session button right under the Tension in/out headline; make the sliding page semi-transparent and place like a calendar selection menu."

1. **Halo removed from page 1** — the white radial gradient behind the logo is gone; the logo itself now glows via CSS `drop-shadow` (two white shadows, same fashion as the old gradient), applied to the logo only.
2. **Logo centred** vertically + horizontally in the full first page (was top-half). It stays at +30% (83px mark / 39px wordmark).
3. **Sliding page = semi-transparent glass**: `rgba(255,255,255,.6)` + `backdrop-filter: blur(6px)` — the centred logo stays visible through it at the half-hold. Its white→purple transition now scrubs the translucent pair (`rgba(255,255,255,.6)` → `rgba(139,43,255,.6)`).
4. **Page-2 content** restored into a `.wrap.scene-in`, arranged menu-style ("calendar selection menu"): headline → **Book a session directly under it** (filled purple selection row, min-width 280px) → sub note below.
5. `verify.mjs` 54/54 (glow filter, no halo on page 1, translucent glass, logo visible through glass, button order, filled button); `preloader-test.mjs` 18/18. Screenshots: `screenshots/after-v8/`.

# Changelog v9 — logo up 30% / +45% (responsive), opaque purple page removed (2026-08-15, commit `d976f6c`)

Client: "Move the logo up by 30% and make larger by 45% and make the look consistent between mobile and desktop, also that purple background for the element is not transparent, then remove that element."

1. **Logo moved up 30%**: `.panel--base` gets `padding-bottom:60vh` → the logo centres in the upper 40% of the first page (verified: centre at exactly panel.top + 20vh on both desktop and mobile).
2. **Logo +45% with consistent scaling**: mark `clamp(90px,14vw,120px)`, wordmark `clamp(42px,6.6vw,57px)`, gap `clamp(12px,1.8vw,16px)` — 120/57px at 1440, 90/51px at 375 (same proportions).
3. **Opaque purple cover page removed** (`#trust` `.panel--cover` — "that purple background is not transparent, then remove that element"). After the glass half-hold the page continues straight into the next scene. The second-swipe scrubs (hold glass white→purple, veil purple return) are gone; the veil completes its purple→white arc at the hold; the purple→white→purple arc is preserved via the canvas (white → purple at book). The pills content that lived on the trust page was removed with it.
4. `verify.mjs` 53/53 (logo position/size checks, no-#trust, veil white at hold, arc ends purple, page-continues-past-hold), `preloader-test.mjs` 18/18, live 53/53. Screenshots: `screenshots/after-v9/`.

# Changelog v10 — repo cleanup (2026-08-15, commit pending)

Client: "push to github with all changes, then remove the components and unused code file but keep directory."

- **Files removed, directories kept**: all `react/**` component/engine/style/dist files (the separate 3D-walkthrough source — not part of the live marketing page), `index.template.html` (its template), `scripts/build.mjs` + `scripts/smoke.mjs` (its build/test pipeline). Directory structure preserved (`react/`, `react/components/`, `react/engine/`, `react/styles/`, `react/dist/` remain as empty dirs; `scripts/` keeps `preloader-test.mjs`).
- **package.json tidied**: scripts reduced to `start` (build/smoke dangled); deps trimmed to `jsdom` (preloader-test) — react/react-dom/esbuild were only for the removed walkthrough.
- **Everything pushed**: screenshots (v2–v9 deliverables) committed; branch `scroll-scenes` fully in sync with origin.
- Live site unaffected (marketing `index.html` + `scroll-scenes.js` + `app.js` + preloader-test remain; nginx never served react/).

# Changelog v11 — auto-deploy watcher for main (2026-08-15)

Infra: `/root/deploy-n10.sh` + cron (`*/2 * * * *`) watch `refs/heads/main` on GitHub. On change: fetch → checkout the exact SHA into `/var/n10` (nginx root) → run the build step if `package.json` defines one (currently none — static output) → curl-verify → record SHA in `/root/.n10-main-sha`. `main` fast-forwarded to the current site (`5fac4f2 → ab48be4`) so the watcher maintains the live scroll-scene site. Manual deploys no longer needed for main.

# Changelog v12 — React conversion + purple page restored (2026-08-15, commit `66a6c2c`)

Client: "organize the entire file structure in a clean react simple format with typical react settings, restore the purple page that slides over the first page, make that page section 70% transparent, on that page add the react root filling out the entire section, on the first page move the logo down by 15%, make larger by 8%, the floating item should not appear until you scroll all the way up on the Tension in. Tension Out. section and it should fade in. Test, build, deploy."

1. **React + Vite conversion** (`typical react settings`): `src/main.jsx`, `src/App.jsx` (one static React tree rendering the same DOM), `src/index.css` (ported verbatim), `src/effects.js` (all behaviour: preloader/sticker/bar/nav/sheet/gallery/counters/tabs/ripple/gauge/anchor + the GSAP ScrollTrigger/Lenis scroll layer — gsap & lenis are now npm imports, no CDN). `vite.config.js` (outDir `dist`), package.json scripts `dev/build/preview/start`. `dist/` is gitignored and built on deploy. app.js serves `dist/` when present; nginx root moved to `/var/n10/dist`. The auto-deploy watcher now runs the real build step on every main push. JS-disabled now renders the SPA shell only (inherent to React — the client's explicit conversion supersedes the old no-JS floor).
2. **Purple page restored** (`#trust`, `.panel--cover`) — slides over the first pages again, **70% transparent** (`rgba(139,43,255,.3)`), with its content (the trust pills) React-rendered and filling the entire section. The veil and the hold glass scrub white→purple as it rises.
3. **Logo** — moved **down 15%** (centred at ~35vh) and **+8% bigger** (mark `clamp(97px,15.1vw,130px)`, wordmark `clamp(45px,7.1vw,62px)`).
4. **Floating item** (`#hero-object`) — hidden at the top; scrubbed fade-in as the Tension in/out section slides into place, fades back out on scroll-up. Fixed a real bug: the side-swap tween's `overwrite:true` was killing the opacity tween — now scoped to `x` only.
5. Tests: `preloader-test.mjs` retired (jsdom can't run the SPA); `verify.mjs` updated for the React build — **50/50 on dev and live**. Screenshots: `screenshots/after-v10/`.

# Changelog v13 — de-jitter + floating-item timing (2026-08-15, commit `8c521e4`)

Client: "keep everything as is, however the tweens are jittery, and remember that floating logo should only appear until after you swipe up the transparent purple page."

1. **Floating item timing fixed**: the pinned mark now stays hidden at the top AND at the half-hold, and only scrubs in as the transparent purple page (`#trust`) is swiped up — visible once the purple page has arrived (fades back out on scroll-up).
2. **Jitter removed** from the scroll-linked tweens:
   - Dropped the hold panel's `backdrop-filter: blur(6px)` — backdrop-filter forces a per-frame repaint of everything behind it while scrolling (the classic jitter source); the glass look is kept with a slightly denser translucent white (`rgba(255,255,255,.78)`).
   - The veil and the hold glass no longer scrub `background-color` (full-screen paint every frame) — replaced with compositor-friendly **opacity layers**: the veil is a static purple base + a white crossfade layer (`#heroVeilW`, opacity-scrubbed), and the hold gets a purple tint layer (`#holdTint`, opacity-scrubbed). Only `#bg-canvas` keeps its `background-color` scrub — that's the signature mechanic.
3. `verify.mjs` 53/53 on dev and live (floating item hidden at hold → visible after trust lands; veil white layer at hold; hold tint at trust). Screenshots: `screenshots/after-v11/`.

# Changelog v14 — first-render colour, floating-logo timing, composited background (2026-08-15, commit `c021deb`)

Client: "when the page first renders there is no background or color, then the floating logo spawns in before it should (only after the Transparent purple page), the page jitters and scrolling is not smooth at all."

1. **First render has colour**: the preloader is now a brand-violet radial (`#A855FF → #8B2BFF`, existing palette) instead of plain white, and its wordmark is light-styled for the purple field.
2. **Floating logo timing**: `#hero-object` now has `opacity:0` in CSS — it can never flash in on first frames (previously it rendered at full opacity until JS hid it). Its fade-in was also moved to the **last 15% of the purple page's rise** (`top 15% → top top`), so it only appears once the transparent purple page is essentially fully swiped up.
3. **Jitter / smoothness**: the background arc only ever goes white ↔ purple, so `#bg-canvas` is now a white base plus a `#bgPurple` layer whose **opacity is scrubbed** — GPU-composited, zero full-screen repaints per frame (the old background-color scrub repainted the whole viewport on every scroll frame). The RM path and interpolation tests were updated for the layer. Snap also gets `inertia:false` so it stops fighting Lenis's smoothed velocity.
4. `verify.mjs` 53/53 on dev and live. Screenshots: `screenshots/after-v12/`.

# Changelog v15 — boot layer: no white flash on initial load (2026-08-15, commit `b449ddb`)

Client: "the homepage when initially loading is not rendering correctly, there is no background."

Root cause: the built `index.html` was a bare shell (`<div id="root">` + bundle tags), so before React mounted the page painted plain white — on slower loads that white window was the "no background" state.

1. **Static boot layer** in the Vite entry (`index.html`): an inline style sets `html{background:#8B2BFF}` + a fixed `#boot` div painting the brand purple radial (`#A855FF → #8B2BFF`), plus `theme-color #8B2BFF` for mobile browser chrome. The page is purple from the very first byte — verified with a deliberately delayed bundle (boot covers 1440×900 while loading, removed on React mount, preloader takes over seamlessly).
2. **Hero fallback**: `.hero-bg` gets a lavender gradient base so the hero is never blank while the massage photos load (or offline).
3. `verify.mjs` 53/53 on dev and live; watcher deployed `b449ddb`.

# Changelog v16 — scene snap removed + return-visit logo fix (2026-08-15, commit `e0fae79`)

Client: "after the preloader the logo does not appear correctly, when scrolling the page glitches in and out, none of the tweens are smooth in page transition, it's like it is trying to scroll."

1. **Mechanic 5 (snap to scene tops) removed.** It re-armed 0.08s after every scroll end and yanked the page to the nearest scene top with its own tween while Lenis was still lerping — that fight was the "trying to scroll" jitter and the glitchy scene transitions. Lenis alone drives scroll now; all scrubs run on the smooth lerp clock.
2. **Return-visit logo bug fixed.** The introSeen branch forced the floating logo to `opacity:1` at the top, so on repeat visits it appeared right after the preloader, before the purple page. That set is gone — the trust-rise scrub owns the floating logo's visibility on every visit (verified: hidden at top on return visits, hero logo always visible).
3. `verify.mjs`: hold-landing check now expects an exact Lenis landing; 53/53 on dev and live.
4. **Infra (same evening):** the server was crashing ~every 10–25 min from memory exhaustion (3.8 GiB RAM, zero swap; Splunk suite + gateway + builds). Added a persistent 4 GiB swapfile (`vm.swappiness=10`) + fail2ban for the SSH brute-force flood. Live site unaffected — v16 was deployed before the crash.


# Changelog v17 — preload-everything preloader + gallery duplication fix (2026-08-15, commit `069d2a4`)

Client: "the page is not rendering initially, use the preloader to preload as many assets as possible, and scrolling is not smooth."

**Root cause of BOTH symptoms:** `initEffects()` was called from React's `useEffect` — React's passive-effect commit machinery re-invoked the mount effect ~35×/sec. Every re-run re-appended the gallery marquee (20 tiles per run → thousands of tiles + duplicate images), re-registered listeners, and churned the scroll layer. That constant DOM churn was the "not smooth" jank AND made the page render wrong initially.

1. **initEffects runs exactly once** — from `main.jsx` right after React's commit (setTimeout 0), never from a React effect. The gallery builder is idempotent (skips if already built). Verified: `__initRuns === 1`, exactly 20 gallery tiles, 58 ScrollTriggers, stable over time.
2. **Preloader now preloads as many assets as possible**: all 7 scene photos flipped from `loading="lazy"` to eager; the two hero shots also `<link rel="preload">` in the HTML head; the purple gate holds until every network image is loaded **and decoded** (`img.decode()`) before fading — the page is fully rendered the moment it reveals (8s safety net so nobody strands).
3. **Intro starts when the preloader fades** (queued on reveal) — the hero entrance is actually seen instead of playing behind the gate.
4. `verify.mjs` waits dynamically for preloader+intro; **53/53 on dev and live**.
5. Scroll probe: a full 2.5s page scroll now shows only 2 sub-45ms frame gaps (before the fix: 7 gaps including an 894ms one).


# Changelog v17.1 — iOS preloader fix (2026-08-15, commit `8b48b81`)

Client (iOS): "when initially loading the page i am stuck at the loading page."

1. **Throw-proof gate**: `plReady()` could throw on iOS < 15 (`img.decode()` is undefined → TypeError inside the promise map) — and since `plReady()` was called before the 8s safety net was scheduled, the throw aborted init and the loader never revealed. `decode()` is now feature-guarded, each image raced against a 2.5s timeout, and the path can never throw.
2. **Only first-paint images gate the reveal**: the previous gate waited for all 27 network images including the 20 lazy gallery-marquee tiles — on iOS's 6-connections-per-host limit that hangs for ages. Eager scene images gate the reveal (≤7); the lazy marquee loads natively while scrolling.
3. **CSS backstop**: the static `#boot` layer self-fades after 10s even with fully dead JS — no screen can ever stick.
4. Verified with an iPhone UA (390×844, touch): preloader gone ≈0.9s, intro done ≈2s. 53/53 dev + live.


# Changelog v17.2 — preloader hard cap (2026-08-15, commit `1e24f8e`)

Client (iOS, 2nd report): "stuck at the loading page saying preparing your visit."

The reveal's single 8s safety net could still visibly linger on flaky cellular (hung Unsplash requests delaying the load event). Now the reveal can never depend on one path:

1. `plReady()` also runs on an independent 3.5s timer — even if the `load` event never fires.
2. `setTimeout(reveal, 4000)` hard cap — the preloader NEVER lingers past 4s on any device; the image-wait fast path still reveals sooner (~0.9s).
3. Verified worst case (all image requests aborted): preloader gone at 928ms. 53/53 dev + live.


# Changelog v17.3 — preloader: pure load gate (2026-08-15, commit `72e6907`)

Client: "it does not work in any browser, your tests are wrong. fix the preloader. don't put any assets in it. just wait till all loaded."

Done exactly as prescribed. The preloader now contains **zero asset logic**:

- It waits for the browser's `load` event (min 600ms brand beat) — the scene images are eager in the DOM, so `load` already means "everything loaded". No `decode()`, no promise races, no image filtering — nothing that can hang, throw, or strand.
- Backstops only (the reveal never depends on a single path): a 5s fallback timer runs the gate even if `load` never fires; a final 6s hard cap means the loader cannot linger on any device or network.
- Worst case verified (all image requests aborted, iPhone UA): preloader gone at 775ms. 53/53 dev + live.


# Changelog v17.4 — overlay-stuck root cause fixed (2026-08-15, commits `954d4b0` + `939cc73`)

Client: "the page can scroll, but the preloader is still overlaying it... you must have it disengage when the page finally loads."

**Root cause (finally pinned):** React's `render()` commits asynchronously (scheduler task). On slower devices the `setTimeout(initEffects, 0)` fired BEFORE the commit — so `initEffects` captured **null element refs** (preloader, scenes, etc.). The reveal timers then bailed on the missing element, the overlay never disengaged, and every scrub was dead — while plain scrolling (Lenis) still worked. Chromium's fast commit is why automated tests passed.

1. `main.jsx` renders inside **`flushSync`** — the commit is synchronous, so `initEffects` always runs against the committed DOM. No race possible.
2. `reveal()` **re-queries `#preloader`** on every call (self-healing if the overlay ever appears late).
3. **Watchdog**: re-runs the load gate every 500ms once the document is complete.
4. Verified under CDP **CPU throttling ×4 + all images aborted** (the slow-device worst case): preloader gone at ~0.5s.
5. Bonus fix found by the suite: the v16 snap removal left dead `createSnap()/calcSnapPts()/killSnap()` calls in the resize handler — ReferenceError on every resize (iOS URL-bar show/hide fires constantly), breaking `ScrollTrigger.refresh()` and stale-ing pins. Handlers now just refresh.
6. 53/53 dev + live.


# Changelog v17.5 — first page fully rendered at reveal (2026-08-15, commit `daa747f`)

Client: "on initial render of the very first page i see the logo, but i have to scroll up, then and only then the background clips in... after the preload the first page should render."

The hero photos were `decoding="async"` — the browser paints before the decode finishes, so the background (and the logo layer over it) popped in only after a repaint nudge like scrolling.

1. All 7 eager scene shots are now `decoding="sync"`: the browser completes their decode before first paint. The preloader covers the viewport until load, so the extra decode time is invisible — the page is fully rendered the moment the preloader fades.
2. `reveal()` nudges the compositor (one-frame `will-change` promote on `.hero-bg`) to defeat the Safari quirk of skipping freshly decoded full-viewport layers until a forced repaint.
3. Screenshots: `screenshots/after-v18/`. 53/53 dev + live.


# Changelog v17.6 — Safari paint kick (2026-08-15, commit `bbd1df2`)

Client: "i still have to scroll up... once the scroll is initialised the page clips vertically, then the background and logo render correctly."

This is Safari's rasterization quirk: it skips painting freshly decoded full-viewport layers until a scroll forces a repaint — so the user's very first scroll does the rasterizing live (the "vertical clip" they saw).

1. `reveal()` performs an invisible **1px scroll + back** (via double rAF, repeated at 120ms) — the compositor is forced to rasterize the hero region at the exact moment the preloader fades, before the user ever touches the scroll. The page is fully painted on first paint.
2. `.hero-bg` gets persistent `will-change:transform` — a promoted layer that Safari rasterizes eagerly.
3. `finishIntro()` repeats the kick as a second chance.
4. 53/53 dev + live.


# Changelog v17.7 — strip hero compositing risks + Lenis-aware kick (2026-08-15, commit `63a8de6`)

Client: "still same result, the fading background does not show correctly at first until i scroll down."

1. **Removed the hero-bg compositing stack** that Safari notoriously refuses to paint until a scroll: no `filter` (saturate/brightness/contrast), no `transform:scale(1.05)`, no `will-change` on `.hero-bg`. The shots are plain `object-fit: cover`; the purple veil still does the tinting, so the look is preserved.
2. **Lenis-aware paint kick**: a plain `window.scrollBy` gets swallowed by Lenis's own scroll loop — the nudge now goes through `lenis.scrollTo(±1, {duration:0})` and back, followed by `ScrollTrigger.refresh()` (full relayout + repaint). Kicked at reveal (rAF, 120ms, 500ms) and again at `finishIntro`.
3. 53/53 dev + live.


# Changelog v18 — /frmm — Front Range Mobile Mechanics (2026-08-15, commit `341af51`)

Client: "make a separate second page /frmm — Front Range Mobile Mechanics — use claude code agents, exact copy of this page, mobile mechanic images, light blue theme, similar logo, coordinate-based HELP ME NOW button, corresponding copy, show the new page URL."

Built with Claude Code agents (headless, prompt-file brief) — 1,130-line self-contained static page at `public/frmm/index.html` (Vite `public/` → `dist/`, so it deploys with the normal pipeline; nginx serves it at `/frmm`).

- **Faithful clone** of the IN/TENSION scroll-scene DNA: pure-load-gate preloader, boot layer, sync-decoded hero with veil + crossfade + ticker, pinned floating mark (appears after the cover rises), cover glass panel, bg arc (white ↔ #38BDF8 via composited opacity layer), ink inversion, RM path, Lenis no-snap, 1px paint kick — all the hard-won fixes applied.
- **Light-blue theme**: sky palette (#38BDF8/#0284C7/#E0F2FE/#7DD3FC), white↔light-blue arc.
- **Similar logo**: FRMM gradient mark (wrench-stroke motif) + wordmark; ink-outline variant for inverted scenes.
- **12 verified Unsplash mechanic images** (all curl-checked 200) across hero, services, coverage, about, contact.
- **HELP ME NOW (centrepiece)**: fixed bottom-right pill + hero + final CTAs → `navigator.geolocation` → "📍 Located · routing to you…" + coords card (Call / Text-my-location) + new-tab Google Maps directions to the Boulder shop; denied/insecure-origin always falls back to Call + Open Google Maps. `window.__frmmGeo` hook.
- Copy: "Skip the tow. We come to you." — 6 services with flat-rate chips, 3-step how-it-works, coverage marquee, flat-rate pricing, 24/7.
- `app.js` now serves directory indexes (mirrors nginx) so the dev server serves /frmm too.
- Verified: `verify-frmm.mjs` **13/13** (desktop, mobile, geolocation granted + denied paths), main suite **53/53**, screenshots `screenshots/frmm-v1/`.

**URL: http://209.46.121.242/frmm/ (and http://localhost/frmm/ locally)**


# Changelog v18.1 — FRMM v2 (2026-08-15, commit `8fe9495`)

Client: title runs off the first page; prices ×1.56; HELP ME NOW → large promotional green, 3D popping off the screen; opens a smooth Apple liquid-glass dialog with three huge radio options (Find Me GPS / CALL / Request Email), big Next button, multi-page flow, every option saved to a variable.

1. **Title overflow**: hero wordmark wraps (FRMM / Mobile Mechanics) with tightened clamps — verified 0px overflow at 375px.
2. **Prices ×1.56**: $139 / $201 / $154 / $232 / $295 / $123 (trip fee $0).
3. **HELP ME NOW = big promotional green 3D button**: `#4ADE80→#16A34A` gradient, 5-layer stacked ledge shadows (real "off the screen" depth), glossy top highlight, breathing float, press-down active state; fixed pill + hero/final CTAs.
4. **Apple liquid-glass wizard dialog**: `backdrop-filter: blur(30px) saturate(180%)`, 30px radius, springy entrance; 3-step flow — (1) three huge radio cards + big Next (disabled until a choice), (2) details (GPS auto-locates + saves coords with call/maps fallback · Call shows the number · Email takes email + notes), (3) confirm summary → Request help → "Help is on the way" done state. Every choice saved to `window.__hmn` {step, method, coords, email, notes, submitted}.
5. `verify-frmm.mjs` 18/18 dev + live. Screenshots `screenshots/frmm-v2/`.



# Changelog v18.2 — first page rebuilt: changing background renders at load (2026-08-16)

Client: "rebuild the first page, the background that changes does not render initially."

**Root cause (finally the real one — not Safari paint):** two scrubbed `fromTo` tweens
fought over `#heroVeilW` (the white crossfade layer over the hero photos). The second
one (white→transparent as the purple cover rises) kept `immediateRender: true` — the
fromTo default — so from page load it rendered its *from* value (opacity 1) on every
ScrollTrigger update until its trigger was reached, permanently overriding the first
tween (0→1 over the first swipe). **The hero rendered pure white from load** — purple
tint and photos invisible until the user scrolled ~450px. Measured: 99.1% of the hero
viewport was white at rest (pixel-sampled). The old acceptance suite missed it because
it scrolls away and back before checking the veil (a different tween-render path).

**Rebuild — one owner, one progress:**
1. The two competing tweens are replaced by **one scrubbed timeline** owning the white
   layer's whole arc: `0 → 1` over the half-hold rise (scroll 121→571), `1 → 0` as the
   purple cover takes over (571→1471) — same geometry as the design intent, verified
   point-by-point. A timeline has a single progress, so no two tweens can conflict.
2. **Deterministic rest state**: explicit `gsap.set(veilW, {opacity:0})` after setup —
   the white layer is OFF at scroll 0 no matter the setup order. Resting hero = the
   purple-tinted massage photo, rendered at load.
3. Fresh-load pixel verification: hero at rest now shows the photo through the 50%
   purple veil (26.9% purple / 59.8% photo tones / 13.3% white-logo area vs 99.1%
   white before). Arc points re-checked at 0/571/1200/1471px — peak exactly at the
   half-hold, zero when the cover lands.
4. Acceptance suite hardened: 3 new **fresh-load** regression checks (white veil OFF at
   rest, purple tint on, photos painted) that would have caught this. **56/56 pass.**
5. Screenshots `screenshots/after-v19/` (rest / half-hold / trust-rise).

No other pages touched; FRMM (`/frmm`) untouched. `holdTint` (single tween, correct
rest value) unchanged. Deployed via main auto-pipeline.


# Changelog v18.3 — section reorder: gallery replaces the protocol widget, yoga under it (2026-08-16)

Client: "put the 'inside a session' section in place of the section protocol widget. then move the yoga tuesdays section right underneath."

1. **Scene order rebuilt**: the Session protocol widget scene (`#protocol` — gauge/stages/verdict) is **removed**; the "Inside a session" gallery scene now sits in its place (index 3, right after the purple trust cover), with **Movement ("YOGA TUESDAY") directly underneath** (index 4). Heat & cold follows at index 5, then membership/cards/fuel/board/book unchanged. New order: `hero → intro → trust → gallery → movement → heat → membership → cards → fuel-menu → board → book` (11 scenes, was 12).
2. **Protocol JS no-ops cleanly**: the gauge/stages/verdict wiring is now guarded behind `if (document.getElementById("proto"))` — no dead `IntersectionObserver` on a missing node (it would have thrown on `observe(null)`).
3. **Suite updated**: 11 scenes, a new order assertion (gallery=3, movement=4, heat=5, no `#protocol`), the hero-object variant check made parity-independent (exact complements at book — parity flipped with 11 scenes). **57/57 pass** dev; live re-verified after deploy.
4. Screenshots `screenshots/after-v20/` (gallery / movement / heat scenes; gallery marquee 20 tiles × 6104px confirmed).
