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

## ⚛️ React Overlay

The scene page is still a **single `index.html`** — the React app is bundled
(esbuild) and *inlined* into the page, then mounts into a labeled, transparent
section that hovers above the 3D scene in the bottom-left corner:

```
<section id="react-root" aria-label="React overlay">   ← fixed, bottom-left, z-index 200
  <div id="react-label">⚛️ REACT</div>
  <div id="react-app"></div>                            ← React root (transparent glass panel)
</section>
```

The overlay is deliberately non-intrusive: it sits in its own corner box, so the
wireframe walkthrough (mouse capture, WASD) keeps working everywhere else.

### Rebuilding the React bundle

```bash
npm install        # react, react-dom, esbuild (jsdom for the smoke test)
npm run build      # bundles react/ → inlines into index.html (byte-verified)
npm run smoke      # headless DOM test: confirms the overlay mounts & renders
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
├── index.html          # the entire experience + inlined React overlay
├── app.js              # zero-dep dev server (npm start / VS Code F5)
├── package.json        # start, build & smoke tooling (esbuild)
├── .vscode/
│   └── launch.json     # F5 → node app.js under the debugger
├── react/              # React app source (main.jsx, App.jsx)
├── scripts/
│   ├── build.mjs       # bundle + inline into index.html (with verification)
│   └── smoke.mjs       # jsdom headless test of the overlay
└── README.md
```

---

<div align="center">

<sub>Styled after the void — `#05020c` · `#7b2dff` · `#e4ccff`</sub>

</div>
