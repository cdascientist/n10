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

No build step. Serve the folder with any static server:

```bash
# with nginx — copy to a web root, e.g. /var/www/intension
cp index.html /var/www/intension/index.html

# or just serve the directory:
python3 -m http.server 8080
```

Then open `http://<your-host>:8080`.

---

## 📁 Structure

```
n10/
├── index.html   # the entire experience (scene, HUD, boot, styling)
└── README.md
```

---

<div align="center">

<sub>Styled after the void — `#05020c` · `#7b2dff` · `#e4ccff`</sub>

</div>
