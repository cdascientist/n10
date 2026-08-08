/* =====================================================================
   minimap.js — floor-plan minimap + "you are here" readout
   ---------------------------------------------------------------------
   The minimap is a 2D canvas: a static base layer (floor plan outlines)
   is painted ONCE, then every HUD update stamps the base and draws the
   player's heading arrow on top. The location readout is pure geometry —
   a point-in-rect test against the room/zone inventory.
   ===================================================================== */

import { SHELL, ROOMS, ZONES, S, OX, OZ } from './palette.js';

/* ── 01 ── buildMinimap: paint the static base layer once ──────────── */
export function buildMinimap(reg) {
  const mapCv = reg.mapCv;
  if (!mapCv) return null;
  const w = mapCv.width, h = mapCv.height;
  const sx = w / (SHELL[2] - SHELL[0]), sy = h / (SHELL[3] - SHELL[1]);
  const px = x => (x - SHELL[0]) * sx, py = y => (y - SHELL[1]) * sy;

  const base = document.createElement('canvas');
  base.width = w; base.height = h;
  const b = base.getContext('2d');

  /* backdrop + shell outline */
  b.fillStyle = 'rgba(8,3,20,.9)'; b.fillRect(0, 0, w, h);
  b.strokeStyle = 'rgba(150,90,255,.7)'; b.lineWidth = 2;
  b.strokeRect(px(SHELL[0]) + 1, py(SHELL[1]) + 1, w - 2, h - 2);

  /* rooms: solid outlines */
  b.lineWidth = 1.5; b.strokeStyle = 'rgba(190,130,255,.55)';
  ROOMS.forEach(r => b.strokeRect(px(r.r[0]), py(r.r[1]), (r.r[2] - r.r[0]) * sx, (r.r[3] - r.r[1]) * sy));

  /* open zones: dashed outlines */
  b.strokeStyle = 'rgba(120,70,220,.5)'; b.setLineDash([4, 4]);
  ZONES.forEach(z => b.strokeRect(px(z.r[0]), py(z.r[1]), (z.r[2] - z.r[0]) * sx, (z.r[3] - z.r[1]) * sy));
  b.setLineDash([]);

  return base;   // engine keeps this; drawMinimap stamps it each frame
}

/* ── 02 ── drawMinimap: stamp base + heading arrow at the player ───── */
export function drawMinimap(reg, base, camera, yaw) {
  const mapCv = reg.mapCv;
  if (!base || !mapCv) return;
  const w = mapCv.width, h = mapCv.height;
  const mctx = mapCv.getContext('2d');
  mctx.clearRect(0, 0, w, h);
  mctx.drawImage(base, 0, 0);

  /* player position in canvas space (world → pixel-space floor plan) */
  const gx = (camera.position.x / S + OX - SHELL[0]) * (w / (SHELL[2] - SHELL[0]));
  const gy = (camera.position.z / S + OZ - SHELL[1]) * (h / (SHELL[3] - SHELL[1]));

  /* heading arrow, rotated by yaw so it always points the way you look */
  mctx.save();
  mctx.translate(gx, gy);
  mctx.rotate(-yaw);
  mctx.fillStyle = '#f0e2ff'; mctx.shadowColor = '#c07bff'; mctx.shadowBlur = 12;
  mctx.beginPath(); mctx.moveTo(0, -11); mctx.lineTo(7, 9); mctx.lineTo(0, 4); mctx.lineTo(-7, 9);
  mctx.closePath(); mctx.fill();
  mctx.restore();
}

/* ── 03 ── locate: which room/zone is the camera inside? ───────────── */
export function locate(camera) {
  const gx = camera.position.x / S + OX, gy = camera.position.z / S + OZ;
  for (const r of ROOMS) if (gx > r.r[0] && gx < r.r[2] && gy > r.r[1] && gy < r.r[3]) return r.n;
  for (const z of ZONES) if (gx > z.r[0] && gx < z.r[2] && gy > z.r[1] && gy < z.r[3]) return z.n;
  const inside = gx > SHELL[0] && gx < SHELL[2] && gy > SHELL[1] && gy < SHELL[3];
  return inside ? 'MAIN FLOOR' : 'EXTERIOR — ONE SPACE. EVERY SOLUTION.';
}
