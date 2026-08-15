# Design Audit — Scroll-scene conversion (IN/TENSION)

Prepared per brief §0 (discovery) before any markup is touched.
Repo root: `/root/n10` (live nginx root `/var/n10` — currently identical to repo head `5fac4f2`, verified by checksum).
Date: 2026-08-15.

---

## 1. Entry file

**`/root/n10/index.html`** — a single hand-maintained file (~250 KB, 1620 lines) with one inline `<style>` block and one inline `<script>` IIFE at end of body. This is the live marketing page (served by nginx from `/var/n10`, zero build step).

Not the entry file: `index.template.html` + `react/` are the separate three.js wireframe walkthrough. `npm run build` regenerates `index.html` from that template and **clobbers the marketing page** — `scripts/build.mjs` now guards against it (refuses unless `FORCE_BUILD=1`). This conversion must not run `npm run build` (deploy flow: edit repo → commit/push → `git pull --ff-only` in `/var/n10`).

## 2. Section list (DOM order, headings + CTAs)

| # | Section | Heading (exact copy) | CTA (exact copy) | Density → scene plan |
|---|---------|----------------------|------------------|----------------------|
| 1 | `#hero` | "Tension in. / Tension out." | "Book a session" + "Tour the space" | **Dense** (logo-lg, h1, sub, 2 CTAs, 4 trust pills, protocol card) → **split into 3 scenes** |
| — | `.ticker` marquee | (service names, duplicated from nav) | — | divider band → **proposed removal (chrome)** — flag for confirmation |
| 2 | `#bodywork` | "Long strokes. Real pressure. No upsell." | "Book bodywork" | 1 scene (art photo card = visual) |
| 3 | `#heat` | "Sit at 190°. Then don't." | "Reserve heat time" | 1 scene |
| 4 | `#movement` | "Yoga that respects your Tuesday." | "See the schedule" | 1 scene |
| 5 | `#fuel` | "Everything you drink here has a job." | "Read the board" | 1 scene |
| 6 | `#gallery` | "What ninety minutes looks like" | (none — marquee visual) | 1 scene |
| 7 | `#space` | "One room, two moods." | (none — stats) | 1 scene (+ full-bleed photo, see §9) |
| 8 | `#membership` | "One key. Every room." | (none — card grid) | **Dense** (head + 5-card grid) → **split into 2 scenes** |
| 9 | `#fuel-menu` | "The board" | (none — tabbed menu) | **Dense** (head + menu screen) → **split into 2 scenes** |
| 10 | `#book` | "Come in wound up. Leave unrecognisable." | "Book a session" + "Join the club" | 1 scene |
| — | `footer` | — | — | non-scene, stays after the run |

**Proposed scene count: 14 scenes** (11 sections, 3 sections split, 1 divider removed). All links/destinations preserved: `#bodywork #heat #movement #fuel #gallery #space #membership #fuel-menu #book #top` stay on the same targets.

## 3. Palette (every color in use — nothing else may be animated)

CSS custom properties (`:root`):

| Token | Hex | Token | Hex |
|---|---|---|---|
| `--bg` | `#FFFFFF` | `--purple` (systemPurple) | `#AF52DE` |
| `--bg-2` | `#F2F2F7` | `--indigo` (systemIndigo) | `#5856D6` |
| `--bg-3` | `#E5E5EA` | `--brand` (IN/TENSION violet) | `#8B2BFF` |
| `--card` | `#FFFFFF` | `--brand-2` | `#6E1FD1` |
| `--tint-wash` | `#F7F2FF` | `--brand-soft` | `#EFE3FF` |
| `--label` | `#1C1C1E` | `--mint` | `#34C759` |
| `--sep-solid` | `#D1D1D6` | — | — |
| `--label-2` | `rgba(60,60,67,.62)` | `--label-3` | `rgba(60,60,67,.34)` |

Hardcoded (also in use): `#C77DFF` (markG gradient stop), `#1F7A38` (verdict text), `#FBF7FF` (preloader radial), `#E4D2FF` (btn-tint hover), white at various alphas (`rgba(255,255,255,.82/.7/…)` — space section text).

Ink tokens will be mapped to **existing** values, not the brief's literal `#101010`/`rgba(16,16,16,.66)` (palette rule): dark ink = `--label #1C1C1E` + `--label-2 rgba(60,60,67,.62)`; light ink = `#FFFFFF` + `rgba(255,255,255,.82)` (existing value from `.space p`).

## 4. Hero object

**Repeating object: the IN/TENSION mark** — SVG `<symbol id="mark">` (64×64, violet gradient rounded square + white slash). Appears in: preloader (76 px), nav logo (32 px), hero logo-lg (64 px), footer (32 px). It is the **only** element that repeats across sections.

Per-scene `.art` photo cards (bodywork/heat/movement/fuel) are **not** repeating (different photos each) — they stay as each scene's "one visual".

**Mechanic 4 proposal:** pin the mark as the persistent object, rendered at `clamp(120px, 22vw, 220px)`, pinned across the whole scene run (`main.deck` as `.scene-run`, `pinSpacing: false`). Two variants (both from the existing symbol — zero new art): full-color gradient mark ↔ ink-following monochrome mark (stroke `currentColor`). Per transition: crossfade + `y ≈ −24px` + 1–3° rotation, alternating left/right per scene so the headline gets the opposite side. All variants preloaded (single SVG def — nothing to load). No fallback needed (object exists).

## 5. Typography

- **Display face:** Apple system stack — `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Helvetica Neue, Segoe UI, Roboto, system-ui, sans-serif` (`--f`). **Body face:** same stack. **No webfonts** (SF isn't licensed for self-hosting; comment in file confirms this is deliberate).
- **Largest heading in use:** `h1` `clamp(38px, 7.4vw, 76px)`, weight 700, `-0.032em`. `h2` is `clamp(28px, 4.8vw, 48px)`.
- Scene headline treatment (Mechanic 3): uppercase, same display face, tightest weight-appropriate tracking, `line-height: 0.9`, `clamp(3rem, 11vw, 11rem)`.

## 6. Stack

**Vanilla HTML/CSS/JS, no bundler** for the live page. Per brief §2: `gsap ^3.12` (core + ScrollTrigger) and `lenis ^1.1` via **CDN builds** (jsdelivr, pinned), plus one new `<script defer src="scroll-scenes.js">` at end of body. The new script is guarded (`if (window.gsap && window.ScrollTrigger && window.Lenis)`) so it no-ops harmlessly where libs can't load (jsdom test harness — `preloader-test.mjs` loads the page without external resources). Lenis wired into `gsap.ticker` exactly as the brief specifies; `gsap.registerPlugin(ScrollTrigger)`.

## 7. Scene → color mapping (proposed, for confirmation)

Every `data-bg` is an existing audit color. `data-ink` computed (WCAG AA, large+body): 

| # | Scene | `data-bg` | `data-ink` | Contrast (resting) |
|---|-------|-----------|------------|--------------------|
| 1 | Hero (Tension in/out) | `#FFFFFF` | dark | ~16:1 |
| 2 | Trust pills (Licensed/190°/42°/6a–10p) | `#F7F2FF` | dark | ~14:1 |
| 3 | Protocol card (RESET · 90) | `#EFE3FF` | dark | ~11:1 |
| 4 | Bodywork | `#F2F2F7` | dark | ~13:1 |
| 5 | Heat | `#8B2BFF` | light | 5.4:1 |
| 6 | Movement | `#5856D6` | light | 5.7:1 |
| 7 | Fuel | `#34C759` | dark | 7.8:1 |
| 8 | Gallery | `#F2F2F7` | dark | ~13:1 |
| 9 | Space | `#1C1C1E` | light | ~17:1 |
| 10 | Membership head | `#6E1FD1` | light | 7.6:1 |
| 11 | Membership cards grid | `#8B2BFF` | light | 5.4:1 |
| 12 | Board head | `#FFFFFF` | dark | ~16:1 |
| 13 | Menu screen | `#E5E5EA` | dark | ~12:1 |
| 14 | Book | `#1C1C1E` | light | ~17:1 |

Adjacent scenes are grouped by luminance so the continuous background interpolation passes through real intermediate hues (white → soft lavenders → violet → indigo → mint → light → near-black → violet → white → near-black) and never strands text on a mid-luminance mix at any **snap position** (snap rests exactly on scene frames where the canvas = the scene's own `data-bg`). `#AF52DE` is deliberately not used as a background — it fails AA with both inks (4.1:1 white, 4.2:1 dark).

## 8. Proposed headline chain (Mechanic 3)

Checked every headline pair for the reference's word-chaining (`WORD B → WORD B`): **the existing copy does not chain naturally** — no second word equals any next headline's first word (`OUT→STROKES→190°→YOGA→DRINK→NINETY→ROOM→KEY→THE→COME` — no overlaps). Per the brief, fall back to a **straight masked reveal** using each scene's own most load-bearing words, no invented words:

| Scene | Headline words (ticker display) | Source |
|-------|--------------------------------|--------|
| 1 Hero | IN / OUT | "Tension **in**. Tension **out**." |
| 4 Bodywork | STROKES / PRESSURE | "Long **strokes**. Real **pressure**." |
| 5 Heat | 190° / DON'T | "Sit at **190°**. Then **don't**." |
| 6 Movement | YOGA / TUESDAY | "**Yoga** that respects your **Tuesday**." |
| 7 Fuel | DRINK / JOB | "Everything you **drink** here has a **job**." |
| 8 Gallery | NINETY / MINUTES | "What **ninety minutes** looks like" |
| 9 Space | ROOM / MOODS | "One **room**, two **moods**." |
| 10 Membership | KEY / ROOM | "One **key**. Every **room**." |
| 12 Board | THE / BOARD | "**The board**" |
| 14 Book | COME / LEAVE | "**Come** in wound up. **Leave** unrecognisable." |

Scenes 2, 3, 11, 13 have no headline of their own — no ticker, content only (allowed; the chain mechanic applies to scenes that have headlines). Full original headlines remain in the copy as the masked-reveal source text (see §9 note — the two-word ticker is the display treatment; the full headline copy stays present in the DOM).

## 9. Decisions & interpretations (please confirm)

1. **Marquee band** (`.ticker` between hero and bodywork): propose **removing** it — it is a divider band whose content (service names) is duplicated verbatim in the nav menus and section eyebrows. Keeping it would break snap spacing (uneven scroll targets). Content is not lost.
2. **Decorative layers removed from scenes** (Mechanic 7): `#progress` scroll bar (explicitly banned), `.stage-bg` photo/`tone`/`beam`/`melt` overlays, hero `.bloom` orbs, the old rAF parallax/3D-stage loop (Lenis owns scroll now). Photos themselves remain where they are content: `.art` cards, gallery tiles, `.card .bg`, `.close-in > img`.
3. **`#space` full-bleed photo**: propose removing the full-bleed background image (decorative atmosphere — the rooms are shown in the gallery). The scene keeps headline + para + stats. Flagging because it is the one photo that could be considered "content."
4. **CTA rows** ("Book a session"+"Tour the space", "Book a session"+"Join the club") are kept intact as each scene's **one CTA block**, restyled from filled buttons to outline/text-link weight using existing colors (`currentColor` border, `--brand` text) so the headline stays dominant.
5. **Ink tokens** use existing palette values (§3), not the brief's literal hexes — same behavior, palette rule respected.
6. **Scenes**: `min-height: 100svh` with `100vh` fallback (exact-height `100svh`; dense scenes — cards grid, menu screen — may grow on short viewports rather than clip; snap is off <768px so growth is safe there).
7. **No-JS floor**: the current page actually violates it (` .rv`, `.fade-up`, `.ln i` are CSS-hidden until JS adds `.in`/`.go`). The rebuild fixes this properly: **no CSS rule hides content by default**; every hidden pose is applied by GSAP at runtime only. JS-off → full content, all links, nothing at `opacity: 0`.
8. **Intro (Mechanic 6)** plays after the existing full-load preloader fades; `sessionStorage` flag (`inTENSION-intro-seen`) skips on return visits; "Skip animation" link bottom-left, small, low contrast, keyboard-focusable, jumps `tl.progress(1)`; body `overflow: hidden` during intro only. Reduced-motion: no intro, no snap, no pin, no scrubbed transforms — background switches via the plain 450 ms CSS transition on scene enter.
9. **Nav → fixed, transparent, no plate/shadow**, ink-colored; `.stuck` background state removed. Promo banner (`#bar`), sticker (`#sticker`), eyebrows, chips, and art-card tags stay (content, not chrome).
10. **preloader-test.mjs stays green**: it asserts the preloader, sticker copy/hidden pose, and `.go` on hero — all preserved (`#progress` is not asserted; it checks `.pl-bar`).

## 10. Files to be touched (changelog preview)

| File | Change |
|------|--------|
| `index.html` | Restage sections into 14 scenes (`data-bg`/`data-ink`, ticker headline markup, pinned object element, skip link); ink CSS variables + transitions; minimal chrome (nav, CTA outline restyle); remove `#progress` + decorative layers + old reveal/parallax CSS; keep all copy, links, IDs, components (cards, art, menu, gauge, gallery, footer). |
| `scroll-scenes.js` (new) | GSAP + ScrollTrigger + Lenis wiring (shared ticker), Mechanics 1–7, intro w/ skip + sessionStorage, reduced-motion pass, `ScrollTrigger.refresh()` on load/resize (debounced 200 ms). Guarded no-op without libs. |
| `design-audit.md` (this file) | Step-0 inventory + proposals. |

Not touched: `package.json`, `app.js`, `react/`, `scripts/*` (no build; `preloader-test.mjs` re-run as regression).

## 11. Verification tooling

Playwright (browsers already installed at `/root/.cache/ms-playwright`, package at `/opt/pwtest/node_modules/playwright`) is available for the acceptance pass: JS-on/off, reduced-motion, 375 px, keyboard-only tab order, and before/after screenshots at 1440 px and 375 px. `preloader-test.mjs` re-run headless. Local smoke via `node app.js` (port 3000).
