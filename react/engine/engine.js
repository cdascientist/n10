/* =====================================================================
   engine.js — the walkthrough engine (scene, build pipeline, loop)
   ---------------------------------------------------------------------
   The heart of the experience. initEngine(reg) wires everything:

     §01-05  scene + renderer + camera, wall/fixture builders
     §06-07  context-loss strategy + staged build pipeline (the boot
             progress bar is real: each stage does actual work)
     §08-10  controls wiring, adaptive quality (hold 70 fps)
     §11     the main animation loop
     §12     enter/dispose lifecycle

   The original was one flat <script>; this module is the same logic
   extracted verbatim, with the DOM access routed through the registry
   (registry.js) and UI class-toggles delegated to React where sensible.
   ===================================================================== */

import { C, wx, wz, SHELL, WALL_H, SHELL_H, ROOMS, ZONES } from './palette.js';
import { rgb, mixc, LineBuilder, PanelBuilder } from './geometry.js';
import { Pool } from './pool.js';
import { logoTexture, glowTexture } from './textures.js';
import { buildLoaderScene, loader, clearLoader } from './loader.js';
import { buildMinimap, drawMinimap, locate } from './minimap.js';
import { isTouch, grabFocus, collide, initControls } from './controls.js';
import { reg } from './registry.js';

/* ── 01 ── module-scope state (pure JS, safe to create at import) ──── */
const L = new LineBuilder();      // all wires in the building
const P = new PanelBuilder();     // translucent wall films
const pool = new Pool();          // parallel worker fleet
const perf = { fps: 70, scale: 1.0, samples: 0, lastAdjust: 0, target: 70, ceiling: 82 };
const DEG = Math.PI / 180;
const EYE = 1.65, RADIUS = 0.42;

/* shared mutable state bag — created here, filled by initEngine */
const S_ = {
  renderer: null,
  ctxLost: false,
  scene: null,
  camera: null,
  walls: [],
  signs: null,
  glowPts: { pos: [], col: [] },
  logoFull: null,
  logoMark: null,
  planeGeo: null,
  structureMesh: null,
  reflectionMesh: null,
  panelMesh: null,
  veinMesh: null,
  particles: null,
  particlePos: null,
  particleGeo: null,
  PARTICLES: 6000,
  PARTICLE_CEILING: 9000,
  BOUNDS: null,
  mapBase: null,
  /* input + loop */
  key: {},
  yaw: 0, pitch: 0, sprint: false,
  vel: null,
  move: { x: 0, y: 0 },
  bob: 0,
  prev: 0, clock: 0,
  running: false,
  entered: false,
  disposed: false,
  onTouchUI: null,
};

/* ── 02 ── main renderer, created lazily (see §06 for why) ─────────── */
function ensureMainRenderer() {
  if (S_.renderer) return S_.renderer;
  try {
    S_.renderer = new THREE.WebGLRenderer({
      canvas: reg.canvas,
      antialias: false,
      powerPreference: 'high-performance',
      precision: 'highp',          // explicit — iOS ANGLE is strict about fragment precision
    });
    S_.renderer.setClearColor(0x04010b, 1);
    console.log('[webgl] main renderer created');
  } catch (err) {
    /* iOS can fail context creation silently (context limits, GPU teardown).
       Never let that take the rest of the page down — the DOM HUD survives. */
    console.error('[webgl] main renderer creation failed:', err && err.message || err);
    S_.renderer = null;
  }
  return S_.renderer;
}

/* ── 03 ── viewport sizing + resize (Hor+ framing) ─────────────────── */
function viewportSize() {
  const vv = window.visualViewport;
  let w = vv ? vv.width : innerWidth;
  let h = vv ? vv.height : innerHeight;
  /* mid-orientation-change the visual viewport can report 0 — fall back
     to the layout viewport so the canvas stays pinned */
  if (!(w > 0) || !(h > 0)) { w = innerWidth; h = innerHeight; }
  /* ceil so a fractional visual viewport never leaves a 1px seam */
  return { w: Math.ceil(w), h: Math.ceil(h) };
}

function resize() {
  if (!S_.renderer) return;        // GL not up yet — nothing to size
  const { w, h } = viewportSize();
  if (w < 2 || h < 2) return;
  const aspect = w / h;
  /* Hor+ framing: hold the horizontal field steady so a portrait phone
     doesn't end up staring down a drinking straw */
  S_.camera.aspect = aspect;
  S_.camera.fov = Math.max(62, Math.min(96, 2 * Math.atan(Math.tan(50 * DEG) / aspect) / DEG));
  S_.camera.updateProjectionMatrix();
  /* setSize's own style update is skipped; the CSS box is pinned
     explicitly, so lowering the pixel ratio never visibly shrinks it */
  const cap = isTouch ? 1.6 : 2;
  S_.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, cap) * perf.scale);
  S_.renderer.setSize(w, h, false);
  if (reg.canvas) { reg.canvas.style.width = w + 'px'; reg.canvas.style.height = h + 'px'; }
}

function wireResizeEvents() {
  addEventListener('resize', resize);
  addEventListener('orientationchange', () => {
    /* orientation transitions resize in stages and the URL bar / home
       indicator settle well after the first event — re-measure a few times */
    setTimeout(resize, 150); setTimeout(resize, 450); setTimeout(resize, 900);
  });
  addEventListener('pageshow', () => setTimeout(resize, 200));   // bfcache restores at a stale viewport
  if (window.visualViewport) {
    visualViewport.addEventListener('resize', resize);
    visualViewport.addEventListener('scroll', resize);
  }
}

/* ── 04 ── wall + fixture builders (all feed L, P, S_.walls, glowPts) ─ */
function wallRun(x1, z1, x2, z2, h, col, solid = true) {
  const len = Math.hypot(x2 - x1, z2 - z1);
  if (len < 0.01) return;
  /* light pools at floor level and falls off toward the ceiling */
  const base = rgb(col);
  const bot = mixc(base, [1, 0.92, 1], 0.55);
  const top = mixc(base, [0.07, 0.02, 0.16], 0.74);
  const mid = mixc(bot, top, 0.62);
  L.segG(x1, 0, z1, x2, 0, z2, bot, bot);
  L.segG(x1, h, z1, x2, h, z2, top, top);
  L.segG(x1, h * 0.55, z1, x2, h * 0.55, z2, mid, mid);
  const n = Math.max(1, Math.round(len / 1.6));
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = x1 + (x2 - x1) * t, z = z1 + (z2 - z1) * t;
    L.segG(x, 0, z, x, h, z, bot, top);
  }
  if (solid) {
    S_.walls.push({ x1, z1, x2, z2 });
    /* faint film across the same span, dimmed so overlaps don't stack out */
    P.quad(x1, z1, x2, z2, h, mixc(bot, [0, 0, 0], 0.62), mixc(top, [0, 0, 0], 0.82));
  }
}

/* room perimeter with door openings cut out (jambs + lintel + glow) */
function roomWalls(x1, z1, x2, z2, h, doors, col) {
  const sides = { N: [x1, z1, x2, z1], S: [x1, z2, x2, z2], W: [x1, z1, x1, z2], E: [x2, z1, x2, z2] };
  for (const s in sides) {
    const [ax, az, bx, bz] = sides[s];
    const len = Math.hypot(bx - ax, bz - az);
    const gaps = (doors || []).filter(d => d.s === s)
      .map(d => [Math.max(0, d.t * len - d.w / 2), Math.min(len, d.t * len + d.w / 2)])
      .sort((a, b) => a[0] - b[0]);
    const Pt = t => [ax + (bx - ax) * (t / len), az + (bz - az) * (t / len)];
    let cur = 0;
    for (const [g0, g1] of gaps) {
      if (g0 > cur) { const a = Pt(cur), b = Pt(g0); wallRun(a[0], a[1], b[0], b[1], h, col); }
      const a = Pt(g0), b = Pt(g1);
      /* door head + jambs */
      L.seg(a[0], 2.15, a[1], b[0], 2.15, b[1], C.trim);
      L.seg(a[0], h, a[1], b[0], h, b[1], col);
      L.seg(a[0], 2.15, a[1], a[0], h, a[1], C.trim);
      L.seg(b[0], 2.15, b[1], b[0], h, b[1], C.trim);
      S_.glowPts.pos.push((a[0] + b[0]) / 2, 2.15, (a[1] + b[1]) / 2);
      S_.glowPts.col.push(0.78, 0.42, 1);
      cur = g1;
    }
    if (cur < len) { const a = Pt(cur), b = Pt(len); wallRun(a[0], a[1], b[0], b[1], h, col); }
  }
}

/* --- fixtures (tables, lockers, rigs, mats, lights…) ------------------ */
function table(x, z, w, d, h, ry, col) {
  L.box(x, h, z, w, 0.08, d, col, ry);
  const hw = w / 2 - 0.09, hd = d / 2 - 0.09, co = Math.cos(ry), si = Math.sin(ry);
  [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]].forEach(([a, b]) => {
    const px = x + a * co - b * si, pz = z + a * si + b * co;
    L.seg(px, 0, pz, px, h, pz, col);
  });
}
function massageTable(x, z, ry, col) {
  L.box(x, 0.68, z, 0.86, 0.16, 2.1, col, ry);
  const co = Math.cos(ry), si = Math.sin(ry);
  [[-0.33, -0.9], [0.33, -0.9], [0.33, 0.9], [-0.33, 0.9]].forEach(([a, b]) => {
    const px = x + a * co - b * si, pz = z + a * si + b * co;
    L.seg(px, 0, pz, px, 0.6, pz, col);
  });
  const hx = x - Math.sin(ry) * 1.18, hz = z + Math.cos(ry) * 1.18;
  L.ring(hx, 0.78, hz, 0.2, 0.2, C.trim, 12);
  S_.glowPts.pos.push(x, 0.9, z); S_.glowPts.col.push(0.7, 0.45, 1);
}
function chair(x, z, ry, col) {
  L.box(x, 0.45, z, 0.46, 0.06, 0.46, col, ry);
  L.box(x - Math.sin(ry) * 0.2, 0.72, z + Math.cos(ry) * 0.2, 0.46, 0.5, 0.05, col, ry);
  const co = Math.cos(ry), si = Math.sin(ry);
  [[-0.18, -0.18], [0.18, -0.18], [0.18, 0.18], [-0.18, 0.18]].forEach(([a, b]) => {
    L.seg(x + a * co - b * si, 0, z + a * si + b * co, x + a * co - b * si, 0.42, z + a * si + b * co, col);
  });
}
function plant(x, z, scale = 1) {
  L.ring(x, 0.24, z, 0.26 * scale, 0.26 * scale, C.fixture, 10);
  L.ring(x, 0.0, z, 0.3 * scale, 0.3 * scale, C.fixture, 10);
  L.seg(x, 0.24, z, x, 0.3 * scale, z, C.fixture);
  for (let i = 0; i < 7; i++) {
    const a = i / 7 * Math.PI * 2;
    L.seg(x, 0.3 * scale, z,
      x + Math.cos(a) * 0.5 * scale, 0.95 * scale + ((i % 2) * 0.2), z + Math.sin(a) * 0.5 * scale, C.mat);
  }
  S_.glowPts.pos.push(x, 0.35 * scale, z); S_.glowPts.col.push(0.4, 0.9, 0.6);
}
function shelfUnit(x, z, w, d, ry) {
  L.box(x, 1.05, z, w, 2.1, d, C.fixture, ry);
  for (let i = 1; i <= 3; i++) {
    const y = i * 0.5;
    const co = Math.cos(ry), si = Math.sin(ry), hw = w / 2, hd = d / 2;
    const Pc = [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]].map(([a, b]) => [x + a * co - b * si, z + a * si + b * co]);
    for (let k = 0; k < 4; k++) {
      const A = Pc[k], B = Pc[(k + 1) % 4];
      L.seg(A[0], y, A[1], B[0], y, B[1], C.trim);
    }
    for (let j = 0; j < 3; j++) {
      const t = (j + 0.5) / 3;
      const px = x + (-w / 2 + w * t) * co, pz = z + (-w / 2 + w * t) * si;
      L.box(px, y + 0.14, pz, 0.12, 0.26, 0.12, C.hot, ry);
      S_.glowPts.pos.push(px, y + 0.16, pz); S_.glowPts.col.push(0.9, 0.7, 1);
    }
  }
}
function ceilingFixture(x, z, w, d, y) {
  L.rect(x - w / 2, z - d / 2, x + w / 2, z + d / 2, y, C.trim);
  S_.glowPts.pos.push(x, y - 0.05, z); S_.glowPts.col.push(0.85, 0.6, 1);
}
function matPad(x, z, ry) {
  L.box(x, 0.03, z, 0.66, 0.05, 1.75, C.mat, ry);
  L.rect(x - 0.33, z - 0.87, x + 0.33, z + 0.87, 0.06, C.vein);
}

/* sign: a plane with the additive logo texture */
function sign(x, y, z, ry, w, tagline = true, tilt = 0, op = null) {
  const m = new THREE.Mesh(S_.planeGeo, tagline ? S_.logoFull : S_.logoMark);
  const t = tagline ? S_.logoFull.map : S_.logoMark.map;
  m.scale.set(w, w * (t.image.height / t.image.width), 1);
  m.position.set(x, y, z); m.rotation.set(tilt, ry, 0);
  if (op !== null) { m.material = m.material.clone(); m.material.opacity = op; }
  S_.signs.add(m);
  return m;
}

/* room dressing: one switch per room kind */
function dressRoom(room) {
  const [px1, pz1, px2, pz2] = room.r;
  const x1 = wx(px1), z1 = wz(pz1), x2 = wx(px2), z2 = wz(pz2);
  const cx = (x1 + x2) / 2, cz = (z1 + z2) / 2, w = x2 - x1, d = z2 - z1;

  L.rect(x1 + 0.15, z1 + 0.15, x2 - 0.15, z2 - 0.15, 0.015, C.floor);
  L.rect(x1, z1, x2, z2, WALL_H, C.floor);

  switch (room.f) {
    case 'massage': {
      massageTable(cx, cz + 0.1, 0, C.fixture);
      table(cx - w / 2 + 0.75, cz - d / 2 + 0.8, 0.6, 0.6, 0.75, 0, C.fixture);
      L.box(x2 - 0.5, 0.9, cz + d / 2 - 1.2, 0.4, 1.8, 1.0, C.fixture);
      plant(x1 + 0.7, z2 - 0.8, 0.9); plant(x2 - 0.7, z1 + 0.8, 0.9);
      ceilingFixture(cx, cz, w * 0.5, d * 0.32, WALL_H - 0.1);
      sign(cx, 2.5, z1 + 0.06, 0, 2.4);
      sign(cx, 0.03, cz + d / 2 - 0.9, 0, 1.8, false, -Math.PI / 2, 0.28);
      break;
    }
    case 'therapy': {
      massageTable(cx, cz, Math.PI / 2, C.fixture);
      shelfUnit(cx, z1 + 0.5, Math.min(2.4, w - 1.2), 0.5, 0);
      plant(x2 - 0.7, z2 - 0.7, 0.9);
      ceilingFixture(cx, cz, w * 0.45, d * 0.35, WALL_H - 0.1);
      sign(cx, 2.5, z1 + 0.06, 0, 2.2);
      break;
    }
    case 'locker': {
      for (let bank = 0; bank < 2; bank++) {
        const zz = z1 + 1.0 + bank * 1.9;
        for (let i = 0; i < Math.floor((w - 1.2) / 0.5); i++) {
          const xx = x1 + 0.7 + i * 0.5;
          L.box(xx, 0.95, zz, 0.46, 1.9, 0.5, C.fixture);
          L.seg(xx - 0.2, 0.95, zz + 0.26, xx + 0.2, 0.95, zz + 0.26, C.trim);
          if (i % 3 === 0) { S_.glowPts.pos.push(xx, 1.9, zz); S_.glowPts.col.push(0.7, 0.4, 1); }
        }
        L.box(cx, 0.24, zz + 1.0, w - 1.6, 0.1, 0.4, C.trim);
      }
      const cy = z2 - 0.9;
      L.box(cx, 0.85, cy, w - 1.4, 0.12, 0.6, C.trim);
      for (let i = -1; i <= 1; i++) {
        L.ring(cx + i * 1.1, 0.86, cy, 0.22, 0.16, C.hot, 14);
        L.seg(cx + i * 1.1, 0.86, cy - 0.18, cx + i * 1.1, 1.25, cy - 0.18, C.hot);
        S_.glowPts.pos.push(cx + i * 1.1, 1.3, cy - 0.18); S_.glowPts.col.push(1, 0.85, 1);
      }
      ceilingFixture(cx, cz, w * 0.6, 0.3, WALL_H - 0.1);
      sign(cx, 2.55, z1 + 0.06, 0, 2.6);
      break;
    }
    case 'steam': {
      L.box(cx, 0.5, z1 + 0.5, w - 0.4, 0.16, 0.5, C.trim);
      L.box(x1 + 0.35, 0.5, cz, 0.5, 0.16, d - 1.4, C.trim);
      for (let i = 0; i < 5; i++) {
        const yy = 0.6 + i * 0.55;
        L.ring(cx, yy, cz + 0.4, 0.35 + i * 0.12, 0.35 + i * 0.12, C.vein, 14);
      }
      S_.glowPts.pos.push(cx, 1.2, cz); S_.glowPts.col.push(0.6, 0.5, 1);
      sign(cx, 2.5, z1 + 0.06, 0, 1.5, false);
      break;
    }
    case 'sauna': {
      L.box(cx, 0.45, z1 + 0.6, w - 0.4, 0.14, 0.55, C.trim);
      L.box(cx, 0.95, z1 + 1.15, w - 0.4, 0.14, 0.55, C.trim);
      L.box(x2 - 0.5, 0.6, cz + 0.6, 0.55, 1.2, 0.55, C.fixture);
      for (let i = 0; i < 6; i++) L.ring(x2 - 0.5, 1.25 + i * 0.08, cz + 0.6, 0.18, 0.18, C.hot, 10);
      S_.glowPts.pos.push(x2 - 0.5, 1.3, cz + 0.6); S_.glowPts.col.push(1, 0.6, 0.8);
      sign(cx, 2.5, z1 + 0.06, 0, 1.5, false);
      break;
    }
    case 'gym': {
      const rx1 = x1 + 0.9, rx2 = x1 + 5.6, rz = z1 + 0.9;
      for (const xx of [rx1, rx1 + 2.35, rx2]) L.seg(xx, 0, rz, xx, 3.0, rz, C.fixture);
      L.seg(rx1, 3.0, rz, rx2, 3.0, rz, C.fixture);
      L.seg(rx1, 2.3, rz, rx2, 2.3, rz, C.trim);
      for (let i = 0; i < 4; i++) {
        const xx = rx1 + 0.6 + i * 1.2;
        L.seg(xx, 3.0, rz, xx, 2.1, rz + 0.5, C.trim);
        L.ring(xx, 2.0, rz + 0.5, 0.14, 0.14, C.hot, 8, 'x');
      }
      for (let i = 0; i < 2; i++) {
        const px = x1 + 1.6 + i * 2.6, pz = z1 + 2.6;
        L.box(px, 0.06, pz, 2.2, 0.12, 2.2, C.mat);
        L.rect(px - 1.1, pz - 1.1, px + 1.1, pz + 1.1, 0.14, C.vein);
      }
      for (let r = 0; r < 2; r++) {
        const rzz = z2 - 1.2 - r * 1.3;
        L.box(cx + 1.2, 0.5, rzz, 4.2, 0.9, 0.5, C.fixture);
        for (let i = 0; i < 8; i++) {
          const dx = cx - 0.7 + i * 0.52;
          L.ring(dx, 0.95, rzz, 0.13, 0.13, C.hot, 8, 'x');
          L.seg(dx - 0.13, 0.95, rzz, dx + 0.13, 0.95, rzz, C.hot);
        }
      }
      for (let i = 0; i < 3; i++) {
        const bz = z1 + 5.0 + i * 1.1;
        L.box(x2 - 1.4, 0.55, bz, 0.5, 1.1, 1.6, C.fixture);
        L.ring(x2 - 1.4, 0.55, bz - 0.6, 0.34, 0.34, C.trim, 12, 'x');
      }
      L.box(x1 + 0.6, 0.02, cz + 2.0, 1.4, 0.04, d * 0.5, C.vein);
      plant(x2 - 0.8, z1 + 0.8, 1.1); plant(x1 + 0.8, z2 - 0.8, 1.1);
      ceilingFixture(cx, cz, w * 0.6, d * 0.5, WALL_H - 0.1);
      sign(cx + 1.0, 2.6, z1 + 0.06, 0, 4.2);
      sign(x1 + 0.06, 2.2, cz, Math.PI / 2, 3.2, false, 0, 0.55);
      sign(cx, 0.03, cz + 1.0, 0, 3.4, false, -Math.PI / 2, 0.22);
      break;
    }
    case 'yoga': {
      for (let r = 0; r < 2; r++) for (let i = 0; i < 5; i++) matPad(x1 + 1.6 + i * 2.2, cz - 2.0 + r * 3.4, 0);
      /* mirror wall */
      L.rect(x1 + 0.1, z1 + 0.2, x1 + 0.1, z2 - 0.2, 0, C.trim);
      for (let i = 0; i < 10; i++) {
        const zz = z1 + 0.4 + i * ((d - 0.8) / 9);
        L.seg(x2 - 0.08, 0.1, zz, x2 - 0.08, 2.6, zz, C.floor);
      }
      L.seg(x2 - 0.08, 2.6, z1 + 0.3, x2 - 0.08, 2.6, z2 - 0.3, C.trim);
      /* lotus motif */
      for (let i = 0; i < 8; i++) {
        const a = i / 8 * Math.PI * 2;
        L.seg(cx, 2.9, z1 + 0.3, cx + Math.cos(a) * 0.9, 2.9 + Math.sin(a) * 0.5, z1 + 0.3, C.vein);
      }
      plant(x1 + 0.9, z1 + 0.9, 1.2); plant(x1 + 0.9, z2 - 0.9, 1.2);
      plant(x2 - 0.9, z1 + 0.9, 1.2); plant(x2 - 0.9, z2 - 0.9, 1.2);
      ceilingFixture(cx, cz, w * 0.7, d * 0.6, WALL_H - 0.1);
      sign(cx, 2.7, z1 + 0.06, 0, 5.0);
      sign(cx, 0.03, cz, 0, 5.0, false, -Math.PI / 2, 0.2);
      break;
    }
    case 'meeting': {
      table(cx, cz + 0.2, w * 0.42, d * 0.5, 0.74, 0, C.fixture);
      const n = 4;
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n;
        chair(cx - w * 0.3, cz - d * 0.28 + d * 0.55 * t, Math.PI / 2, C.fixture);
        chair(cx + w * 0.3, cz - d * 0.28 + d * 0.55 * t, -Math.PI / 2, C.fixture);
      }
      L.box(cx, 1.75, z2 - 0.12, w * 0.5, 1.1, 0.06, C.trim);
      sign(cx, 1.75, z2 - 0.2, Math.PI, w * 0.46);
      ceilingFixture(cx, cz, w * 0.5, d * 0.4, WALL_H - 0.1);
      plant(x1 + 0.7, z2 - 0.8, 0.9);
      sign(cx, 2.55, z1 + 0.06, 0, 2.6, false);
      break;
    }
  }
}

/* open (unwalled) zones: juice bar, lounge, gift shop, front desk… */
function buildOpenZones() {
  /* juice bar (oval counter) */
  const jb = ZONES[2].r;
  const jx = (wx(jb[0]) + wx(jb[2])) / 2, jz = (wz(jb[1]) + wz(jb[3])) / 2;
  const jrx = (wx(jb[2]) - wx(jb[0])) / 2 - 0.2, jrz = (wz(jb[3]) - wz(jb[1])) / 2 - 0.2;
  L.ring(jx, 0, jz, jrx, jrz, C.trim, 44);
  L.ring(jx, 1.12, jz, jrx, jrz, C.trim, 44);
  L.ring(jx, 0.55, jz, jrx * 0.99, jrz * 0.99, C.floor, 44);
  for (let i = 0; i < 44; i += 2) {
    const a = i / 44 * Math.PI * 2;
    L.seg(jx + Math.cos(a) * jrx, 0, jz + Math.sin(a) * jrz, jx + Math.cos(a) * jrx, 1.12, jz + Math.sin(a) * jrz, C.fixture);
  }
  L.ring(jx, 1.14, jz, jrx * 0.62, jrz * 0.86, C.vein, 32);
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * Math.PI * 2;
    L.box(jx + Math.cos(a) * jrx * 0.55, 1.32, jz + Math.sin(a) * jrz * 0.78, 0.16, 0.36, 0.16, C.hot);
    S_.glowPts.pos.push(jx + Math.cos(a) * jrx * 0.55, 1.36, jz + Math.sin(a) * jrz * 0.78);
    S_.glowPts.col.push(1, 0.75, 0.55);
  }
  for (let i = 0; i < 10; i++) {
    const a = i / 10 * Math.PI * 2;
    const sx = jx + Math.cos(a) * (jrx + 0.85), sz = jz + Math.sin(a) * (jrz + 0.85);
    L.ring(sx, 0.72, sz, 0.24, 0.24, C.fixture, 10);
    L.seg(sx, 0, sz, sx, 0.72, sz, C.fixture);
    L.ring(sx, 0.02, sz, 0.28, 0.28, C.floor, 10);
  }
  sign(jx, 2.4, jz, 0, 3.6, false, 0, 0.75);
  sign(jx, 0.03, jz + jrz + 1.9, 0, 2.6, false, -Math.PI / 2, 0.2);

  /* lounge */
  const lo = ZONES[3].r;
  const lx1 = wx(lo[0]), lz1 = wz(lo[1]), lx2 = wx(lo[2]), lz2 = wz(lo[3]);
  const lcx = (lx1 + lx2) / 2, lcz = (lz1 + lz2) / 2;
  L.rect(lx1, lz1, lx2, lz2, 0.02, C.floor);
  for (const side of [-1, 1]) {
    const sx = lcx + side * (lx2 - lx1) * 0.34;
    L.box(sx, 0.4, lcz, 1.1, 0.5, (lz2 - lz1) * 0.8, C.fixture);
    L.box(sx + side * 0.5, 0.85, lcz, 0.12, 0.9, (lz2 - lz1) * 0.8, C.fixture);
    for (let i = 0; i < 5; i++) {
      const cz2 = lcz - (lz2 - lz1) * 0.32 + i * ((lz2 - lz1) * 0.16);
      L.box(sx, 0.78, cz2, 0.5, 0.18, 0.5, C.trim, 0.7);
    }
  }
  L.box(lcx, 0.4, lcz, 1.0, 0.14, (lz2 - lz1) * 0.55, C.trim);
  for (let i = 0; i < 7; i++) {
    const zz = lcz - (lz2 - lz1) * 0.22 + i * ((lz2 - lz1) * 0.073);
    L.ring(lcx, 0.5, zz, 0.16, 0.16, C.hot, 8);
    S_.glowPts.pos.push(lcx, 0.55, zz); S_.glowPts.col.push(1, 0.8, 0.6);
  }
  [[lx1 + 0.6, lz1 + 0.6], [lx2 - 0.6, lz1 + 0.6], [lx1 + 0.6, lz2 - 0.6], [lx2 - 0.6, lz2 - 0.6]].forEach(([a, b]) => plant(a, b, 1.1));
  const hover = sign(lcx, 3.15, lcz, 0, 6.2);
  hover.userData.spin = true;

  /* gift shop */
  const gs = ZONES[4].r;
  const gx1 = wx(gs[0]), gz1 = wz(gs[1]), gx2 = wx(gs[2]), gz2 = wz(gs[3]);
  const gcx = (gx1 + gx2) / 2;
  for (let i = 0; i < 3; i++) {
    shelfUnit(gcx, gz1 + 0.6 + i * ((gz2 - gz1 - 1.2) / 2), (gx2 - gx1) - 1.0, 0.55, 0);
  }
  shelfUnit(gx1 + 0.4, (gz1 + gz2) / 2, 0.5, (gz2 - gz1) * 0.6, Math.PI / 2);
  plant(gx2 - 0.5, gz1 + 0.4, 0.9); plant(gx2 - 0.5, gz2 - 0.4, 0.9);
  sign(gcx, 2.7, gz1 - 0.4, 0, 3.2, false, 0, 0.8);

  /* front desk */
  const fd = ZONES[5].r;
  const fx = (wx(fd[0]) + wx(fd[2])) / 2, fz = (wz(fd[1]) + wz(fd[3])) / 2;
  const frx = (wx(fd[2]) - wx(fd[0])) / 2, frz = (wz(fd[3]) - wz(fd[1])) / 2;
  L.ring(fx, 0, fz, frx, frz, C.trim, 40);
  L.ring(fx, 1.18, fz, frx, frz, C.trim, 40);
  L.ring(fx, 1.2, fz, frx * 0.8, frz * 0.6, C.floor, 32);
  for (let i = 0; i < 40; i += 2) {
    const a = i / 40 * Math.PI * 2;
    L.seg(fx + Math.cos(a) * frx, 0, fz + Math.sin(a) * frz, fx + Math.cos(a) * frx, 1.18, fz + Math.sin(a) * frz, C.fixture);
  }
  for (let i = -1; i <= 1; i += 2) {
    L.box(fx + i * 1.5, 1.45, fz - frz * 0.3, 0.6, 0.4, 0.05, C.hot, 0.2 * i);
    S_.glowPts.pos.push(fx + i * 1.5, 1.45, fz - frz * 0.3); S_.glowPts.col.push(0.8, 0.9, 1);
  }
  sign(fx, 0.7, fz + frz + 0.02, 0, 3.4);
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * Math.PI * 2;
    plant(fx + Math.cos(a) * (frx - 0.5), fz + Math.sin(a) * (frz + 0.05), 0.5);
  }

  /* hallway wayfinding strips */
  ZONES.slice(0, 2).forEach(z => {
    const a = wx(z.r[0]), b = wz(z.r[1]), c = wx(z.r[2]), e = wz(z.r[3]);
    L.rect(a, b, c, e, 0.02, C.vein);
    const mz = (b + e) / 2;
    for (let x = a + 1; x < c; x += 2.2) {
      L.seg(x, 0.03, mz - 0.1, x + 1.2, 0.03, mz - 0.1, C.trim);
      S_.glowPts.pos.push(x + 0.6, 0.06, mz); S_.glowPts.col.push(0.75, 0.45, 1);
    }
    sign((a + c) / 2, 0.04, mz + 0.6, 0, 2.4, false, -Math.PI / 2, 0.24);
  });
}

/* shell, ground, entrance */
function buildShell() {
  const x1 = wx(SHELL[0]), z1 = wz(SHELL[1]), x2 = wx(SHELL[2]), z2 = wz(SHELL[3]);
  const entryT = ((wx(760) - x1) / (x2 - x1));
  roomWalls(x1, z1, x2, z2, SHELL_H, [{ s: 'S', t: entryT, w: 5.6 }], C.shell);

  /* interior + exterior ground */
  L.grid(x1, z1, x2, z2, 0, 2.0, C.floor);
  L.grid(x1 - 16, z1 - 14, x2 + 16, z2 + 16, -0.02, 4.0, 0x1a0a33);
  L.rect(x1, z1, x2, z2, SHELL_H, C.shell);
  L.grid(x1, z1, x2, z2, SHELL_H, 6.0, 0x180a30);

  /* entrance porch + exterior monolith sign */
  const ez = z2, ex = wx(760);
  L.rect(ex - 3.2, ez, ex + 3.2, ez + 4.0, 0.02, C.vein);
  for (let i = 0; i < 5; i++) L.rect(ex - 3.2 + i * 0.1, ez, ex + 3.2 - i * 0.1, ez + 4.0 - i * 0.1, 0.03 + i * 0.002, C.floor);
  L.box(ex, 1.9, ez + 5.4, 7.2, 3.4, 0.35, C.shell);
  L.box(ex, 1.9, ez + 5.4, 6.8, 3.0, 0.5, C.trim);
  sign(ex, 2.1, ez + 5.15, Math.PI, 6.0);
  S_.glowPts.pos.push(ex, 0.4, ez + 5.2); S_.glowPts.col.push(0.6, 0.3, 1);
  for (let i = -1; i <= 1; i += 2) {
    L.seg(ex + i * 3.6, 0, ez + 5.4, ex + i * 3.6, 3.6, ez + 5.4, C.trim);
    S_.glowPts.pos.push(ex + i * 3.6, 3.6, ez + 5.4); S_.glowPts.col.push(0.85, 0.55, 1);
  }
  /* entry canopy */
  L.box(ex, 3.9, ez + 1.6, 7.0, 0.12, 3.4, C.trim);
  sign(ex, 0.04, ez + 2.0, 0, 4.6, true, -Math.PI / 2, 0.35);
}

/* ── 05 ── particle field: split across the fleet, reassembled here ── */
function partitionParticles() {
  const n = pool.size, per = Math.floor(S_.PARTICLES / n);
  pool.each(i => ({
    job: 'init', id: i, offset: i * per,
    count: i === n - 1 ? S_.PARTICLES - per * (n - 1) : per,
    bounds: S_.BOUNDS, seed: 7919 + i * 104729,
  }));
  pool.busy = pool.busy.map(() => false);
}

function rebuildParticles() {
  S_.particlePos = new Float32Array(S_.PARTICLES * 3);
  if (S_.particleGeo) {
    S_.particleGeo.setAttribute('position', new THREE.BufferAttribute(S_.particlePos, 3));
  }
  partitionParticles();
}

/* worker replies land here and are copied into the shared GPU buffer */
function wireParticleStream() {
  pool.on('step', m => {
    if (!S_.particlePos) return;              // field not up yet (or failed)
    const f = new Float32Array(m.buf);
    /* a resize may have landed while this payload was in flight — drop stale chunks */
    if (m.offset * 3 + f.length > S_.particlePos.length) return;
    S_.particlePos.set(f, m.offset * 3);
    if (S_.particleGeo) S_.particleGeo.attributes.position.needsUpdate = true;
  });
}

/* ── 06 ── staged build pipeline (the progress bar means something) ── */
/* Each stage does real work before the bar advances. A failing stage is
   caught and skipped rather than stranding the visitor on the loader. */
const nextFrame = () => new Promise(r => requestAnimationFrame(() => setTimeout(r, 16)));

async function stage(pct, label, fn) {
  if (reg.stage) reg.stage.textContent = label;
  if (reg.fill) reg.fill.style.width = pct + '%';
  await nextFrame();
  try { await fn(); }
  catch (err) {
    console.error('stage failed:', label, err);
    if (reg.stage) reg.stage.textContent = label + ' — SKIPPED';
  }
  await nextFrame();
}

async function bootPipeline() {
  await stage(8, 'STARTING RENDER CORE', async () => {
    resize();
    buildLoaderScene(reg);           // first WebGL context on the page
  });

  await stage(20, 'SPAWNING PARALLEL WORKERS', async () => {
    const mode = await pool.probe();
    if (mode === 'inline') {
      /* no real threads (sandboxed frame / blocked blob URL) */
      pool.max = 2; pool.min = 1;
      S_.PARTICLES = 1400; S_.PARTICLE_CEILING = 2400;
      if (reg.stage) reg.stage.textContent = 'THREADS BLOCKED — RUNNING INLINE';
    }
    /* phones: cap the fleet BEFORE sizing it, or the pool spawns hw*1.5
       workers and the later pool.max cap can never shrink them back */
    if (isTouch) pool.max = Math.max(2, Math.min(pool.max, pool.hw));
    const n = mode === 'inline' ? 2 : Math.max(4, Math.min(pool.max, Math.round(pool.hw * 1.5)));
    pool.resize(n);
    if (isTouch) {
      /* phones: smaller field, start below full res and let the tuner climb */
      S_.PARTICLES = Math.min(S_.PARTICLES, 3000);
      S_.PARTICLE_CEILING = Math.min(S_.PARTICLE_CEILING, 5000);
      perf.scale = 0.8;
      resize();
    }
    const t = await Promise.all(pool.workers.map((_, i) =>
      pool.request(i, { job: 'bench', n: mode === 'inline' ? 20000 : 400000 }, 3000)));
    console.log('pool mode:', mode, '| warm-up ms:', t.map(x => x ? x.ms : 'timeout').join(', '));
  });

  await stage(36, 'RAISING STRUCTURE', async () => {
    buildShell();
    ROOMS.forEach(r => roomWalls(wx(r.r[0]), wz(r.r[1]), wx(r.r[2]), wz(r.r[3]), WALL_H, r.d, C.wall));
  });

  await stage(52, 'PLACING FIXTURES', async () => {
    ROOMS.forEach(dressRoom);
    buildOpenZones();
  });

  await stage(68, 'ETCHING ENERGY VEINS', async () => {
    /* genuinely parallel: each worker etches its own band of the floor */
    const n = pool.size, span = (S_.BOUNDS.x1 - S_.BOUNDS.x0) / n;
    const results = await Promise.all(pool.workers.map((_, i) => pool.request(i, {
      job: 'veins', seed: 1013 + i * 7919, seeds: 4,
      region: { x0: S_.BOUNDS.x0 + i * span, x1: S_.BOUNDS.x0 + (i + 1) * span, z0: S_.BOUNDS.z0, z1: S_.BOUNDS.z1 },
      bounds: S_.BOUNDS,
    }, 6000))).then(r => r.filter(Boolean));
    if (!results.length) return;
    let total = 0; results.forEach(r => total += r.buf.byteLength / 4);
    const arr = new Float32Array(total); let o = 0;
    results.forEach(r => { const f = new Float32Array(r.buf); arr.set(f, o); o += f.length; });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    S_.veinMesh = new THREE.LineSegments(g, new THREE.LineBasicMaterial({
      color: 0x8f45ff, transparent: true, opacity: 0.55,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    S_.scene.add(S_.veinMesh);
  });

  await stage(82, 'BRANDING THE ENVIRONMENT', async () => {
    const geo = L.build();
    const mat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.92,
      blending: THREE.AdditiveBlending, depthWrite: false });
    S_.structureMesh = new THREE.LineSegments(geo, mat);
    S_.scene.add(S_.structureMesh);

    /* mirrored reflection below the floor line */
    S_.reflectionMesh = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.13,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    S_.reflectionMesh.scale.y = -1; S_.reflectionMesh.position.y = -0.02;
    S_.scene.add(S_.reflectionMesh);

    S_.panelMesh = new THREE.Mesh(P.build(), new THREE.MeshBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.5, side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    S_.panelMesh.renderOrder = -1;
    S_.scene.add(S_.panelMesh);

    /* glowing accent points collected while dressing the building */
    const gg = new THREE.BufferGeometry();
    gg.setAttribute('position', new THREE.Float32BufferAttribute(S_.glowPts.pos, 3));
    gg.setAttribute('color', new THREE.Float32BufferAttribute(S_.glowPts.col, 3));
    S_.scene.add(new THREE.Points(gg, new THREE.PointsMaterial({
      size: 0.55, map: glowTexture(), vertexColors: true, transparent: true, opacity: 0.85,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    })));
  });

  await stage(94, 'CALIBRATING PARTICLE FIELD', async () => {
    S_.particlePos = new Float32Array(S_.PARTICLES * 3);
    S_.particleGeo = new THREE.BufferGeometry();
    S_.particleGeo.setAttribute('position', new THREE.BufferAttribute(S_.particlePos, 3));
    S_.particles = new THREE.Points(S_.particleGeo, new THREE.PointsMaterial({
      size: 0.11, map: glowTexture(), color: 0xb277ff, transparent: true, opacity: 0.7,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    }));
    S_.scene.add(S_.particles);
    partitionParticles();
    wireParticleStream();
    S_.mapBase = buildMinimap(reg);
  });

  if (reg.stage) {
    reg.stage.textContent = `${L.count.toLocaleString()} WIRES · ${pool.size}× PARALLEL · ENTERING`;
  }
  if (reg.fill) reg.fill.style.width = '100%';
  setTimeout(() => { if (reg.onEnter) reg.onEnter(); }, 1000);   // auto-enter
}

/* ── 07 ── enter: create the main context, start the walkthrough ──── */
/* The main context is created HERE — AFTER buildLoaderScene created the
   loader context during boot — so it is the newest context and any iOS
   eviction takes the transient loader instead of the main scene. It is
   also created before the first visible render and after resize(), so
   the drawing buffer is never 0×0. */
export function enter() {
  if (S_.entered) return;
  S_.entered = true;
  S_.running = true;
  S_.prev = performance.now();
  ensureMainRenderer();
  resize();
  grabFocus(reg);
  /* on touch devices the loader freezes (the loop stops ticking it once
     running) and its last frame fades out with the boot overlay; either
     way its context is torn down after the fade, leaving the main
     renderer as the only live WebGL context on the page. */
  setTimeout(() => clearLoader(true), 950);
}

/* ── 08 ── adaptive quality: hold 70 fps, spend any headroom ──────── */
function tune(now) {
  if (now - perf.lastAdjust < 900) return;
  perf.lastAdjust = now;
  if (perf.fps < perf.target) {
    /* 1) push more work off the main thread */
    if (pool.size < pool.max) {
      pool.resize(pool.size + 2); partitionParticles();
    }
    /* 2) then trim resolution */
    else if (perf.scale > 0.55) { perf.scale = Math.max(0.55, perf.scale - 0.1); resize(); }
    /* 3) then thin the particle field and drop the reflection */
    else if (S_.PARTICLES > 1200) {
      S_.PARTICLES = Math.max(1200, Math.floor(S_.PARTICLES * 0.7));
      rebuildParticles();
    } else if (S_.reflectionMesh && S_.reflectionMesh.visible) { S_.reflectionMesh.visible = false; }
  } else if (perf.fps > perf.ceiling) {
    if (perf.scale < 1.0) { perf.scale = Math.min(1.0, perf.scale + 0.05); resize(); }
    else if (S_.reflectionMesh && !S_.reflectionMesh.visible) { S_.reflectionMesh.visible = true; }
    else if (S_.PARTICLES < S_.PARTICLE_CEILING) {
      S_.PARTICLES = Math.min(S_.PARTICLE_CEILING, Math.floor(S_.PARTICLES * 1.15));
      rebuildParticles();
    }
  }
}

/* ── 09 ── the main loop ──────────────────────────────────────────── */
function frame(now) {
  if (S_.disposed) return;
  requestAnimationFrame(frame);
  const dt = Math.min((now - S_.prev) / 1000, 0.05); S_.prev = now; S_.clock += dt;
  const inst = 1 / Math.max(dt, 0.0001);
  perf.fps = perf.fps * 0.92 + inst * 0.08;

  /* On touch devices the loader freezes at enter (running === true): its
     last frame stays on screen through the boot fade while the main
     renderer is the only context drawing — two live renderers on the
     same frame is the mobile-Safari black-screen trigger this guards
     against. On desktop the loader keeps animating through the fade. */
  if (loader && (!S_.running || !isTouch)) {
    try { loader.tick(now / 1000); }
    catch (err) {
      console.error('[loader] tick failed:', err);
      clearLoader(true);
      if (reg.mark) reg.mark.classList.add('on');
    }
  }

  if (S_.running && S_.vel && S_.camera) {
    /* --- input: WASD + joystick, normalised --- */
    let mx = 0, mz = 0;
    if (held('KeyW', 'ArrowUp', 'w')) mz += 1;
    if (held('KeyS', 'ArrowDown', 's')) mz -= 1;
    if (held('KeyA', 'ArrowLeft', 'a')) mx -= 1;
    if (held('KeyD', 'ArrowRight', 'd')) mx += 1;
    mx += S_.move.x; mz += S_.move.y;
    const mag = Math.hypot(mx, mz);
    if (mag > 1) { mx /= mag; mz /= mag; }

    const fwd = S_.fwd, right = S_.right;
    fwd.set(-Math.sin(S_.yaw), 0, -Math.cos(S_.yaw));
    right.set(Math.cos(S_.yaw), 0, -Math.sin(S_.yaw));
    const speed = S_.sprint ? 7.4 : 3.3;
    S_.vel.x += (fwd.x * mz + right.x * mx) * speed * dt * 9;
    S_.vel.z += (fwd.z * mz + right.z * mx) * speed * dt * 9;
    S_.vel.multiplyScalar(Math.pow(0.0016, dt));

    S_.camera.position.x += S_.vel.x * dt; S_.camera.position.z += S_.vel.z * dt;
    collide(S_.camera.position, S_.walls);

    /* head bob while moving */
    const walking = Math.hypot(S_.vel.x, S_.vel.z);
    S_.bob += dt * walking * 1.5;
    S_.camera.position.y = EYE + Math.sin(S_.bob * 2) * 0.028 * Math.min(1, walking / 3);
    S_.camera.rotation.set(S_.pitch, S_.yaw, 0, 'YXZ');

    /* --- dispatch particle work across idle workers --- */
    for (let i = 0; i < pool.size; i++) {
      if (!pool.busy[i]) { pool.busy[i] = true; pool.workers[i].postMessage({ job: 'step', dt, t: S_.clock }); }
    }

    /* --- ambience --- */
    if (S_.veinMesh) S_.veinMesh.material.opacity = 0.4 + Math.sin(S_.clock * 1.6) * 0.18;
    S_.signs.children.forEach(s => { if (s.userData.spin) s.rotation.y = Math.sin(S_.clock * 0.35) * 0.6; });
    if (S_.structureMesh) S_.structureMesh.material.opacity = 0.88 + Math.sin(S_.clock * 2.4) * 0.05;

    tune(now);

    /* --- HUD refresh (~5×/s): stats panel, location, minimap --- */
    if (perf.samples++ % 12 === 0) {
      const cls = perf.fps >= 70 ? 'good' : 'warn';
      if (reg.stats) {
        reg.stats.innerHTML =
          `<b class="${cls}">${perf.fps.toFixed(0)} FPS</b> &nbsp;target 70<br>` +
          `PARALLELISM <b>${pool.size}×</b> / ${pool.max} max ${pool.mode === 'inline' ? '(inline)' : ''}<br>` +
          `MOTES <b>${S_.PARTICLES.toLocaleString()}</b><br>` +
          `RES <b>${(perf.scale * 100).toFixed(0)}%</b>`;
      }
      if (reg.where) reg.where.textContent = locate(S_.camera);
      drawMinimap(reg, S_.mapBase, S_.camera, S_.yaw);
    }
  }
  if (S_.renderer && !S_.ctxLost) S_.renderer.render(S_.scene, S_.camera);
}

/* small helper mirroring the original `held()` */
function held(...names) { return names.some(n => S_.key[n]); }

/* ── 10 ── initEngine: everything that needs a live DOM + THREE ───── */
export function initEngine() {
  if (S_.scene) return;               // already initialised

  /* The core is guarded: if THREE or WebGL is unavailable (headless test
     runners, ancient browsers), the React UI (boot/HUD/deck) still
     renders — only the 3D layer goes missing. The loop + pipeline run
     REGARDLESS: their stages guard themselves, and the auto-enter path
     keeps the UI honest even when GL never comes up. */
  try {
    initEngineCore();
  } catch (err) {
    console.error('[engine] init failed — running UI-only:', err && err.message || err);
  }

  requestAnimationFrame(frame);        // the loop runs forever from here
  bootPipeline();                      // staged build (see §06)
}

function initEngineCore() {
  S_.vel = new THREE.Vector3();
  S_.fwd = new THREE.Vector3();
  S_.right = new THREE.Vector3();
  S_.BOUNDS = { x0: wx(SHELL[0]) + 0.5, x1: wx(SHELL[2]) - 0.5, z0: wz(SHELL[1]) + 0.5, z1: wz(SHELL[3]) - 0.5 };

  /* renderer is created lazily — see ensureMainRenderer / §07 */
  if (reg.canvas) {
    reg.canvas.addEventListener('webglcontextlost', e => {
      e.preventDefault();              // keep the door open for a restore
      S_.ctxLost = true;
      console.warn('[webgl] main context LOST');
    }, false);
    reg.canvas.addEventListener('webglcontextrestored', () => {
      console.log('[webgl] main context RESTORED');
      S_.ctxLost = false;
      /* r128 binds programs/buffers to the dead context and cannot heal
         them; the only reliable recovery is a fresh renderer, which
         re-uploads every program, buffer and texture. */
      if (S_.renderer) { try { S_.renderer.dispose(); } catch (e) {} S_.renderer = null; }
      ensureMainRenderer();
      resize();
    }, false);
  }

  S_.scene = new THREE.Scene();
  S_.scene.fog = new THREE.FogExp2(0x0a0418, 0.026);

  S_.camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.05, 220);
  S_.camera.position.set(0, 1.65, 14.5);

  S_.signs = new THREE.Group(); S_.scene.add(S_.signs);
  S_.logoFull = new THREE.MeshBasicMaterial({ map: logoTexture(true), transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide, opacity: .95 });
  S_.logoMark = new THREE.MeshBasicMaterial({ map: logoTexture(false), transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide, opacity: .9 });
  S_.planeGeo = new THREE.PlaneGeometry(1, 1);

  S_.onTouchUI = resize;               // touch controls ask for a re-measure
  initControls(S_);                    // keyboard / pointer / touch / collision
  wireResizeEvents();

  addEventListener('error', e => console.error('runtime:', e.message));
  addEventListener('unhandledrejection', e => {
    console.error('unhandled:', e.reason);
    if (reg.onEnter) reg.onEnter();     // never strand the visitor on the loader
  });
}
export function disposeEngine() {
  S_.disposed = true;
  clearLoader(true);
  if (S_.renderer) { try { S_.renderer.dispose(); } catch (e) {} S_.renderer = null; }
}

