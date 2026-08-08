<div align="center">

# ⚡ InTension

### *Wireframe Walkthrough*

A single-file WebGL world — a first-person drift through a glowing wireframe cathedral,
built entirely with **three.js** and rendered in your browser. No frameworks, no build step,
no dependencies beyond one vendored library.

<br>

<div style="display:inline-block;background:#0d0618;border:1px solid rgba(155,90,255,.28);border-radius:999px;padding:6px 18px;color:#e4ccff;font-size:13px;">
⬡ three.js &nbsp;·&nbsp; ⬡ WebGL &nbsp;·&nbsp; ⬡ 100% client-side &nbsp;·&nbsp; ⬡ zero dependencies
</div>

<br>

<a href="#about">About</a> · <a href="#features">Features</a> · <a href="#controls">Controls</a> · <a href="#run-it">Run it</a> · <a href="#structure">Structure</a>

</div>

---

## 🌌 About

**InTension** drops you into a procedurally-lit wireframe space — a quiet, neon-violet void
filled with particle motes, ribbon-light geometry, and a minimap to keep your bearings.

It is a single `index.html` (~73 KB) that boots a full 3D scene: animated preloader,
first-person camera, live performance HUD, and a resolution scaler that keeps the frame
rate pinned to a 70 FPS target on weak hardware.

---

## ✨ Features

- **First-person wireframe world** — fly and walk through layered vector geometry
- **Particle motes** — thousands of drifting light points with adaptive parallelism
- **Live HUD** — real-time FPS, mote count, resolution scale, and parallelism readout
- **Minimap** — keeps you oriented inside the space
- **Adaptive renderer** — auto-scales resolution to hold 70 FPS
- **Boot sequence** — animated 3D preloader with graceful fallback wordmark
- **Zero setup** — one file, open it and go
- **⚛️ React overlay deck** — a transparent control panel (bottom-left) mounted
  on top of the scene, with live status, uptime, and an expandable log

---

## ⚛️ React Overlay & Component Architecture

The scene page is still a **single `index.html`**, but it is now built from a
real React component tree — the entire interface (boot, HUD, minimap, touch
controls, and the overlay deck) is split into individual, heavily-commented
components, each with its own stylesheet:

```
react/
├── App.jsx                    # composition root (layers + "entered" state)
├── main.jsx                   # React 18 mount point
├── engine/                    # imperative 3D layer (no React re-renders at 60fps)
│   ├── registry.js            # shared DOM ref bus between components & engine
│   ├── palette.js             # design tokens + floor-plan data
│   ├── geometry.js            # wire & panel builders
│   ├── pool.js                # parallel.js-style worker pool
│   ├── textures.js            # canvas-painted logo/glow/chrome textures
│   ├── loader.js              # 3D preloader scene (chrome wordmark)
│   ├── minimap.js             # minimap base + player arrow + locate()
│   ├── controls.js            # keyboard / pointer lock / touch / collision
│   └── engine.js              # scene, staged build pipeline, adaptive loop
├── components/                # one file per UI piece, numbered comments
│   ├── Scene.jsx              # full-screen WebGL canvas + engine host
│   ├── Boot.jsx               # preloader + ENTER gate
│   ├── Hud.jsx                # HUD container (fades in after enter)
│   ├── Stats.jsx              # FPS/parallelism/motes/res panel
│   ├── Where.jsx              # "you are here" readout
│   ├── Keys.jsx               # control legend
│   ├── Minimap.jsx            # floor-plan minimap + brand dot
│   ├── TouchControls.jsx      # joystick + RUN button
│   └── OverlayDeck.jsx        # the React control deck (bottom-left)
└── styles/                    # one stylesheet per component
    ├── global.css  boot.css  hud.css  touch.css  overlay.css
```

The overlay deck mounts into a labelled section that hovers above the entire
page in the bottom-left corner:

```
<section id="react-root" aria-label="React overlay">   ← fixed, bottom-left, z-index 200
  <div id="react-label">⚛️ REACT</div>
  <div id="react-app"></div>                            ← React root (transparent glass panel)
</section>
```

### Rebuilding the React bundle

```bash
npm install        # react, react-dom, esbuild (jsdom for the smoke test)
npm run build      # bundles react/ + styles/ → inlines into index.html (verified)
npm run smoke      # headless DOM test: every layer mounts, enter flow works
```

---

## 🎮 Controls

| Input | Action |
| --- | --- |
| `W A S D` / `Arrows` | Move |
| `Click` | Capture mouse |
| `Drag` | Look around |
| `Shift` | Run |
| `T` | Toggle wall surfaces |

*Works with touch devices too — tap to enter.*

---

## 🚀 Run it

### From VS Code (recommended)

1. Open the repo folder in VS Code
2. Press **F5** (Run → Start Debugging) — the included `.vscode/launch.json`
   runs `app.js`, a zero-dependency static server
3. Open **http://localhost:3000** — the scene + ⚛️ React overlay load exactly
   like production

Breakpoints in `app.js` work normally; `Ctrl+C` stops the server.

### Or from a terminal

```bash
npm start          # node app.js → http://localhost:3000
```

The dev server mirrors production nginx behavior: serves the repo root,
blocks dotfiles and `node_modules` (403), and refuses path traversal.

### No build step

```bash
# just serve the folder with any static server:
python3 -m http.server 8080
```

Then open `http://<your-host>:8080`.

---

## 📁 Structure

```
n10/
├── index.html          # BUILT single-file artifact (nginx + app.js serve this)
├── index.template.html # the shell the build inlines JS/CSS into
├── app.js              # zero-dep dev server (npm start / VS Code F5)
├── package.json        # start, build & smoke tooling (esbuild)
├── .vscode/
│   └── launch.json     # F5 → node app.js under the debugger
├── react/              # source of truth (components + engine + styles)
├── scripts/
│   ├── build.mjs       # bundle JS+CSS → inline into index.html (verified)
│   └── smoke.mjs       # jsdom headless test of the full component stack
└── README.md
```

> `index.html` is generated — edit `react/` + `index.template.html`, then
> `npm run build`. The live site and dev server both serve the built file.

---

<div align="center">

<sub>Styled after the void — `#05020c` · `#7b2dff` · `#e4ccff`</sub>

</div>
