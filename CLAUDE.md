# CLAUDE.md — IN/TENSION (n10)

React 18 + Vite marketing site: scroll-scene storytelling (GSAP ScrollTrigger + Lenis),
Swedish bodywork / infrared sauna / cold plunge / Fuel Lab. Plus a separate static
page `/frmm` (Front Range Mobile Mechanics) — **do not touch `public/frmm/`**.

## Layout of the codebase (hierarchical)
- `index.html` — static boot shell (brand-purple boot layer, hero image preloads, `#root`).
- `src/main.jsx` — entry: renders `<App/>` (flushSync) then calls `initEffects()` once.
- `src/App.jsx` — **composition root**: imports and renders every component in DOM order.
- `src/components/**` — hierarchical components (Chrome/, Scenes/, Icons/, Footer).
- `src/effects.js` — ONE imperative behavior file (mechanics + UI wiring). Never split.
- `src/index.css` — ONE stylesheet. Never split.
- `public/frmm/index.html` — FRMM page (separate product; leave alone).
- `app.js` — tiny static server for dev (:3000, serves `dist/` + `/frmm`).
- Live site = branch `main` → nginx `/var/n10` (auto-deploy from GitHub every 2 min).
  Working branch = `scroll-scenes`. Deploy: merge `scroll-scenes` → `main`, push.

## DOM CONTRACT (critical — never break)
`effects.js` and the acceptance suite (`/opt/pwtest/verify.mjs`, 57 checks) depend on:
- **11 scenes, exact order & ids:** `hero, intro, trust, gallery, movement, heat,
  membership, membership-cards, fuel-menu, board, book`. Every scene carries
  `data-bg` (`#FFFFFF` or `#8B2BFF`) and `data-ink` (`dark`/`light`).
- **IDs used by JS:** `bg-canvas`, `bgPurple`, `skipIntro`, `preloader`, `sticker`,
  `bar`, `barX`, `nav`, `burger`, `sheet`, `warp`, `hero-object`, `obj-inner`,
  `heroVeil`, `heroVeilW`, `holdTint`, `galRun`, `segbar`, `top`, `d1`, `d2`, `book`.
- **SVG symbols** (`#mark`, `#mark-ink`, `#i-*`, `#markG`) referenced via `<use href>`.
- `.scene` order inside `<main class="deck scene-run" id="top">`: `#hero-object` first,
  then `.cover-stack` (hero → intro → trust), then the 8 plain scenes, then footer.
- The protocol widget (`#proto`, `#tnum`, `#tbar`, `#stages`, `#verdict`, `#tot`) was
  REMOVED in v18.3 — do not re-add it; `effects.js` guards on its absence.
- Never rename/remove/reorder markup, classNames, or attributes. Copy JSX verbatim
  (incl. long base64 data URIs) when restructuring.

## Hard rules (from design-audit.md)
- Only `transform` / `opacity` / `background-color` are animated. No repaint-heavy layers.
- No CSS rule hides content by default — every hidden pose is applied by GSAP at
  runtime (page must be fully readable with JS disabled).
- Veil white layer (`#heroVeilW`) is owned by ONE scrubbed GSAP timeline (v18.2 fix —
  two competing tweens pinned it at opacity 1 and the hero rendered pure white at load).
- No scroll-snap (v16 removed it — it fought Lenis). Anchor jumps route through Lenis.

## Verify before declaring done
- `cd /root/n10 && npm run build` → must succeed.
- `cd /opt/pwtest && node verify.mjs http://localhost:3000/` (dev server: `node app.js`)
  → **57 passed, 0 failed**. Same against http://localhost:80 after deploy.
- Do not commit unless the orchestrator says so; report changes instead.

## Agents (subagents — `.claude/agents/`)
- `implementer-react` — React component extraction/refactor (DOM contract aware).
- `implementer-effects` — effects.js / index.css commenting (behavior preserving).
- `tester-build` — `npm run build` verification.
- `tester-suite` — Playwright 57-check acceptance suite.

## Comment conventions
- Every component file: header block (purpose · used-by breadcrumb up · contains breadcrumb down).
- Inline single-line breadcrumbs `{/* … */}` at block boundaries.
- Comment what and why, never restate the code.
