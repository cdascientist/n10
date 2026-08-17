<div align="center">

# ⚡ IN/TENSION

### *Bodywork · Heat · Movement · Fuel*

A scroll-scene marketing site: Swedish massage, infrared sauna, cold plunge, movement
and the Fuel Lab in one bright, quiet building. Built with **React 18 + Vite**, with
**GSAP ScrollTrigger + Lenis** driving an Apple-style scroll-storytelling layer.

<br>

<div style="display:inline-block;background:#16082e;border:1px solid rgba(139,43,255,.35);border-radius:999px;padding:6px 18px;color:#e4ccff;font-size:13px;">
⚛️ React 18 · ⚡ Vite 5 · 🎞 GSAP ScrollTrigger + Lenis · 🔁 CI auto-deploy
</div>

<br>

<a href="#about">About</a> · <a href="#architecture">Architecture</a> · <a href="#structure">Structure</a> · <a href="#scene-flow">Scene flow</a> · <a href="#verification">Verification</a> · <a href="#run-it">Run it</a> · <a href="#deploy">Deploy</a> · <a href="#frmm">FRMM</a> · <a href="#claude-code">Claude Code</a>

</div>

---

## 🌌 About

**IN/TENSION** is the live marketing site (`https://<host>/`) for a bodywork studio.
The page is a sequence of full-viewport "scenes" that the user swipes through —
a full-page background colour that continuously interpolates white ↔ purple, ink
inversion for text legibility, masked ticker headlines, a persistent pinned
IN/TENSION mark, a purple veil arc over the hero photos, a load-gated preloader,
and a booking scene that closes the arc back to purple.

A second, fully separate static page — **FRMM** (Front Range Mobile Mechanics,
`/frmm/`) — ships in the same repo and deploys with the same pipeline. See
[FRMM](#frmm).

---

## 🏗 Architecture

The page is one static React tree; all scroll/interaction behaviour is wired
imperatively in a single behaviour file after render.

```
index.html ──► src/main.jsx ──► <App/> (composition root, src/App.jsx)
                    │                │
                    │                └─► components/ (one dir per component)
                    │                     chrome/ · scenes/ · Footer/
                    │
                    └─► initEffects() once ──► src/effects.js (GSAP + Lenis)
```

**Layers**

| Layer | File | Responsibility |
|---|---|---|
| Entry | `src/main.jsx` | Mounts `<App/>` inside `flushSync` (render commits synchronously — prevents null-ref races on slow devices), then calls `initEffects()` exactly once. No StrictMode (React's passive-effect machinery used to re-invoke the scroll layer). |
| Composition root | `src/App.jsx` | Imports and renders every component in the exact DOM order the DOM contract requires. ~121 lines. |
| Components | `src/components/**` | One directory per component (chrome/ + scenes/ + Footer/), each dir = `index.jsx` + `README.md`, sub-parts in subdirectories. Every file opens with a breadcrumb header (purpose · used-by ↑ · contains ↓) and carries inline single-line breadcrumbs. |
| Behaviour | `src/effects.js` | **The one imperative file** — GSAP ScrollTrigger + Lenis mechanics, preloader gate, sticker, nav/sheet, marquee, tabs, counters, ripples. Deliberately not split. |
| Styles | `src/index.css` | **The one stylesheet** — section banners map every block to its component. Deliberately not split. |

### The DOM contract (don't break it)

`effects.js` and the acceptance suite depend on exact ids, classNames, `data-*`
attributes and order. The contract is documented in `CLAUDE.md` and enforced by a
golden-DOM gate (see [Verification](#verification)):

- **11 scenes in fixed order:** `hero → intro → trust → gallery → movement → heat →
  membership → membership-cards → fuel-menu → board → book`, each with `data-bg`
  (`#FFFFFF` / `#8B2BFF`) and `data-ink` (`dark` / `light`).
- JS-lookup ids: `bg-canvas`, `bgPurple`, `skipIntro`, `preloader`, `sticker`,
  `bar`, `barX`, `nav`, `burger`, `sheet`, `warp`, `hero-object`, `obj-inner`,
  `heroVeil`, `heroVeilW`, `holdTint`, `galRun`, `segbar`, `top`, `d1`, `d2`, `book`.
- SVG `<symbol>`s (`#mark`, `#mark-ink`, `#i-*`, `#markG`) referenced via `<use href>`.
- Hard rules: only `transform` / `opacity` / `background-color` are animated; no CSS
  rule hides content by default (every hidden pose is applied by GSAP at runtime, so
  the page is fully readable with JS disabled).

### Scroll-scene mechanics (`src/effects.js`)

| # | Mechanic | How |
|---|---|---|
| 1 | Continuous background interpolation | Full-page `#bg-canvas` (white base) + `#bgPurple` layer whose **opacity is scrubbed** white↔purple — compositor-friendly, zero repaints. |
| 2 | Ink inversion | Each scene's `data-ink` flips `--ink`/`--paper` at the luminance midpoint. |
| 3 | Masked ticker headlines | Words slide up from a mask on scene enter (scene 0 owned by the intro timeline on first visit). |
| 4 | Persistent pinned hero object | One IN/TENSION mark, two SVG variants (gradient ↔ ink outline), CSS-fixed across the run; variants crossfade and the object alternates left/right; fades out over the footer. |
| 5 | Hero veil arc | Purple-tinted hero photos → white crossfade layer over the half-hold rise → purple returns as the trust cover lands. **One scrubbed timeline owns the white layer** (v18.2 — two competing tweens used to pin it white at load). |
| 6 | Intro sequence | ~1s logo reveal after the preloader; `sessionStorage` flag skips on return visits; "Skip animation" link; body scroll locked until done. |
| — | Preloader | Pure load-event gate (min 600ms brand beat) + hard backstops so it can never linger; Lenis-aware 1px paint kicks defeat Safari's no-paint-until-scroll quirk. |
| — | Protocol widget (v18.3) | Removed from the page; its JS is guarded behind `#proto` existence and no-ops cleanly. |

---

## 📁 Structure

```
n10/
├── index.html              # Vite HTML entry — boot shell (brand-purple #boot layer,
│                           #   hero-shot preloads, #root, entry script)
├── package.json            # start / dev / build / preview (vite)
├── vite.config.js
├── app.js                  # zero-dep static server (npm start → :3000, mirrors nginx)
├── CLAUDE.md               # project contract for Claude Code (DOM contract, gates, conventions)
├── .claude/
│   └── agents/             # Claude Code subagents (see § Claude Code)
├── src/
│   ├── main.jsx            # entry — flushSync render <App/> + initEffects() once
│   ├── App.jsx             # composition root (imports + renders 22 components in order)
│   ├── effects.js          # ONE imperative behaviour file (mechanics + wiring, commented)
│   ├── index.css           # ONE stylesheet (commented, section-bannered)
│   └── components/             # one directory per component (index.jsx + README.md + subdirs)
│       ├── README.md           # how to read a component dir
│       ├── chrome/             # site chrome — canvas, preloader, nav, sheet, icons, hero object
│       │   ├── README.md
│       │   ├── BackgroundCanvas/   # #bg-canvas + #bgPurple (Mechanic 1)
│       │   ├── SkipIntroLink/      # #skipIntro
│       │   ├── Preloader/          # #preloader
│       │   ├── PromoSticker/       # #sticker (founding-members badge)
│       │   ├── Warp/               # #warp vignette overlay
│       │   ├── IconDefs/           # hidden SVG defs: #i-* icons, #mark, #mark-ink, #markG
│       │   ├── Nav/                # <header id="nav"> dropdowns (#d1/#d2) + burger
│       │   │   └── (Logo / Dropdown / Burger)
│       │   ├── MobileSheet/        # #sheet mobile menu
│       │   └── HeroObject/         # #hero-object pinned mark (2 variants)
│       ├── scenes/             # one directory per scroll scene
│       │   ├── README.md       # scene-order table (hero → … → book)
│       │   ├── HeroScene/          # #hero      — page 1, logo on purple-tinted photo
│       │   ├── IntroScene/         # #intro     — half-hold glass, "Tension in/out"
│       │   ├── TrustScene/         # #trust     — 70% transparent purple cover + pills
│       │   ├── TreatmentsScene/    # #treatments — SPORTS RECOVERY menu
│       │   ├── GalleryScene/       # #gallery   — "Inside a session" marquee (#galRun)
│       │   ├── MovementScene/      # #movement  — YOGA TUESDAY (base64 texture)
│       │   ├── HeatScene/          # #heat      — 190° DON'T (base64 texture)
│       │   ├── MembershipScene/    # #membership — KEY ROOM
│       │   ├── MembershipCardsScene/ # #membership-cards — card grid
│       │   ├── FuelMenuScene/      # #fuel-menu — Fuel Lab head (THE BOARD)
│       │   ├── BoardScene/         # #board     — tabbed fuel menu (#segbar + panes)
│       │   └── BookScene/          # #book      — purple booking scene
│       └── Footer/             # <footer class="foot">
│           └── (Brand / Columns / Hours / Legal)
├── public/
│   └── frmm/index.html     # FRMM static page (separate product, see § FRMM)
├── dist/                    # vite build output — what nginx and app.js serve
├── screenshots/             # per-release verification screenshots (after-v19, after-v20, …)
├── changelog-scroll-scenes.md   # every change, client-quote + fix + verification
├── design-audit.md              # step-0 inventory, palette, scene→colour mapping, decisions
└── openclaw-scroll-scene-brief.md
```

---

## 🎬 Scene flow

```
hero ──► intro ──► trust ──► treatments ──► gallery ──► movement ──► heat
 (logo)   (half-hold) (purple   (sports      (inside a   (yoga      (190°
          glass,       cover)    recovery)    session)    tuesday)   don't)
 ──► membership ──► membership-cards ──► fuel-menu ──► board ──► book
     (key/room)      (card grid)          (THE BOARD)  (tabs)   (purple, booking)
```

The first three scenes form the opening "cover-stack": the hero is a sticky base,
the intro half-hold slides up to the viewport midpoint, and the 70%-transparent
purple trust cover slides over both. Background colour interpolates continuously
across every scene boundary (white ↔ purple) with no hard seams.

---

## ✅ Verification

The acceptance suite lives outside the repo (`/opt/pwtest/`) and is the source of
truth for "behaviour unchanged":

| Gate | Command | Pass condition |
|---|---|---|
| Build | `npm run build` | Vite build succeeds |
| Acceptance suite | `node /opt/pwtest/verify.mjs http://localhost:3000/` | **57 passed, 0 failed** (scenes, bg interpolation, veil arc, intro/skip/sessionStorage, pinned object, nav anchor, gallery, mobile 375px, keyboard, JS-off, reduced-motion, fresh-load veil checks) |
| Golden-DOM gate | `node /opt/pwtest/domcheck.mjs capture <url>` then `check <url>` | Rendered `#root` tree (inline styles stripped) byte-identical to the golden snapshot — catches ANY markup/attribute/base64 change |
| Pixel probes | `node /opt/pwtest/probe-hero.mjs` + `px-hero.mjs` | Hero veil renders at rest (purple-tinted photo, white layer off) |

Run the suite against **both** dev (:3000) and live (:80) after any change. Per-release
screenshots are kept in `screenshots/`.

---

## 🚀 Run it

**Recommended — VS Code / fresh checkout (no build step):**

```bash
npm run dev        # vite dev server with HMR → http://localhost:3000  (press F5 in VS Code)
```

`npm run dev` is **self-healing on a fresh clone**: its `predev` hook frees port 3000
from any stale server and, if `node_modules` is missing (it is gitignored), runs
`npm install` automatically (one-time, may take a minute — including vite's esbuild
binary). No manual setup needed. `npm run dev` (vite) transforms JSX on the fly and
serves `public/` too — unlike `app.js`, which serves the **built** `dist/` and shows a
hint page when `dist/` is absent. Port 3000 is pinned (`strictPort`) so a conflict
fails loudly instead of silently moving to 3001.

**Serve the built site (mirrors production nginx):**

```bash
npm run build      # production build → dist/
npm start          # node app.js → http://localhost:3000  (serves dist/ + /frmm)
```

If `dist/` is missing, `app.js` prints the fix instead of silently serving a broken
page. `app.js` mirrors production nginx: serves `dist/`, directory indexes
(`/frmm/`), blocks dotfiles and `node_modules` (403), refuses path traversal.

---

## 🔁 Deploy (automatic)

The **live site is branch `main`** — and `main` is the working branch: commit and
push straight to it, and the change goes live automatically within ~2 minutes via
a cron watcher (`/root/deploy-n10.sh`):

1. Polls GitHub `refs/heads/main` for a new SHA.
2. Checks the exact SHA out into `/var/n10` (nginx root).
3. Runs `npm install` (if needed) + `npm run build`.
4. curl-verifies, records the SHA.

```bash
git add -A && git commit -m "…" && git push origin main   # live in ~2 min
```

`scroll-scenes` is kept as a fast-forward mirror of `main` (no staging dance — the
client also pushes to `main` directly, so a separate working branch only causes
divergence). Verify after deploy: `curl -s localhost | grep -c 'id="root"'` and the
acceptance suite against `http://localhost:80/`.

---

## 🛠 FRMM — Front Range Mobile Mechanics (`/frmm/`)

A separate, self-contained static page at `public/frmm/index.html` (Vite copies
`public/` → `dist/`, so it deploys with the normal pipeline; nginx serves it at
`/frmm/`). Mobile-mechanic clone of the IN/TENSION DNA with its own theme:

- Light-blue palette (`#38BDF8`/`#0284C7`), white↔light-blue background arc.
- Same scroll-scene mechanics: load-gated preloader, sync-decoded hero, veil +
  crossfade, pinned floating mark, cover glass panel, ink inversion, RM path.
- **HELP ME NOW** — big promotional green 3D button opening an Apple liquid-glass
  wizard: Find Me GPS / CALL / Request Email flow, every choice saved to
  `window.__hmn`, geolocation with Call/Text fallback + Google Maps directions.
- Flat-rate pricing ($139–$295), 6 services, 3-step how-it-works, coverage marquee.
- Verified by `verify-frmm.mjs` (18 checks).

**Never modify `public/frmm/` when working on the main site** — it is a separate
product shipped from the same repo.

---

## 🤖 Claude Code

The repo carries a Claude Code setup for agentic work (DeepSeek backend):

- **`CLAUDE.md`** — the project contract: layout, DOM contract, hard rules,
  verification gates, comment conventions.
- **`.claude/agents/`** — four subagents:
  - `implementer-react` — component extraction/refactor (DOM-contract aware)
  - `implementer-effects` — effects.js / index.css commenting
  - `tester-build` — `npm run build` gate
  - `tester-suite` — Playwright 57-check acceptance suite

Headless drive from OpenClaw:

```bash
claude --print --agents implementer-react,implementer-effects,tester-build,tester-suite < prompt.txt
```

The full component hierarchy (v18.4) was produced by this team; the golden-DOM gate
and suite proved the rendered page byte-identical before and after.

---

<div align="center">

<sub>Brand purple `#8B2BFF` — styled after the light. Changelog: `changelog-scroll-scenes.md`.</sub>

</div>
