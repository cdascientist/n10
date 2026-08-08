/* =====================================================================
   textures.js — canvas-painted textures for logos, glows, chrome
   ---------------------------------------------------------------------
   All textures are painted onto 2D canvases at runtime (no image files):
   the additive "InTension" sign material, a soft radial glow sprite,
   and the loader's chrome wordmark + bloom halo.

   Functions only touch THREE when called — safe to import anywhere.
   ===================================================================== */

/* ── 01 ── logo texture (additive sign material) ───────────────────── */
/* "In" + upright "T" + "ension", mirroring the wordmark's upright T.
   `withTagline` adds the brand line beneath (used on big wall signs). */
export function logoTexture(withTagline) {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = withTagline ? 320 : 240;
  const x = c.getContext('2d');
  x.clearRect(0, 0, c.width, c.height);

  const grad = x.createLinearGradient(0, 40, 0, 190);
  grad.addColorStop(0, '#ffffff'); grad.addColorStop(.36, '#dcc4ff');
  grad.addColorStop(.72, '#9a55ff'); grad.addColorStop(1, '#f4ebff');
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.shadowColor = '#a75cff'; x.shadowBlur = 34;
  x.fillStyle = grad;

  /* measure the three runs so the glyphs sit centred as one word */
  const f1 = 'italic 800 132px "Helvetica Neue",Arial,sans-serif';
  const f2 = '800 132px "Helvetica Neue",Arial,sans-serif';
  x.font = f1; const wIn = x.measureText('In').width;
  x.font = f2; const wT = x.measureText('T').width;
  x.font = f1; const wRest = x.measureText('ension').width;
  const total = wIn + wT + wRest, start = (c.width - total) / 2, y = 118;
  x.textAlign = 'left';
  x.font = f1; x.fillText('In', start, y);
  x.font = f2; x.fillText('T', start + wIn, y);
  x.font = f1; x.fillText('ension', start + wIn + wT, y);

  if (withTagline) {
    x.shadowBlur = 14; x.shadowColor = '#8b46e0';
    x.fillStyle = '#c8a6ff'; x.textAlign = 'center';
    x.font = '600 32px "Helvetica Neue",Arial,sans-serif';
    x.fillText('T R A I N .   R E C O V E R .   C O N N E C T .', c.width / 2, 232);
  }
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 4;
  return t;
}

/* ── 02 ── soft radial glow sprite (particles, lamp cores, orbs) ───── */
export function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,245,255,1)'); g.addColorStop(.25, 'rgba(196,140,255,.75)');
  g.addColorStop(1, 'rgba(120,50,220,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

/* ── 03 ── wordmark run metrics (shared by chrome + bloom painters) ── */
export function wordmarkRuns(ctx, size) {
  const italic = `italic 800 ${size}px "Helvetica Neue",Arial,sans-serif`;
  const upright = `800 ${size}px "Helvetica Neue",Arial,sans-serif`;
  ctx.font = italic; const a = ctx.measureText('In').width;
  ctx.font = upright; const b = ctx.measureText('T').width;
  ctx.font = italic; const c = ctx.measureText('ension').width;
  return { total: a + b + c, runs: [['In', italic, 0], ['T', upright, a], ['ension', italic, a + b]] };
}

/* ── 04 ── polished chrome wordmark with a horizon band + sweep ────── */
export function chromeTexture() {
  const c = document.createElement('canvas'); c.width = 1400; c.height = 400;
  const x = c.getContext('2d');
  x.textBaseline = 'middle';
  const { total, runs } = wordmarkRuns(x, 208);
  const sx = (1400 - total) / 2, sy = 200;

  /* metal gradient: bright top → dark waist → bright again */
  const g = x.createLinearGradient(0, 96, 0, 306);
  g.addColorStop(0.00, '#ffffff'); g.addColorStop(0.16, '#efe6ff');
  g.addColorStop(0.34, '#b9a4d6'); g.addColorStop(0.47, '#5b3a92');
  g.addColorStop(0.52, '#241046'); g.addColorStop(0.58, '#7c4bd8');
  g.addColorStop(0.76, '#d9c6ff'); g.addColorStop(0.92, '#ffffff');
  g.addColorStop(1.00, '#8f6ad0');
  x.fillStyle = g;
  for (const [txt, font, off] of runs) { x.font = font; x.fillText(txt, sx + off, sy); }

  /* specular sweep clipped to the glyphs */
  x.globalCompositeOperation = 'source-atop';
  const s = x.createLinearGradient(0, 108, 0, 178);
  s.addColorStop(0, 'rgba(255,255,255,0)'); s.addColorStop(.55, 'rgba(255,255,255,.6)');
  s.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = s; x.fillRect(0, 0, 1400, 400);
  x.globalCompositeOperation = 'source-over';

  /* crisp bevelled edge */
  x.strokeStyle = 'rgba(238,224,255,.9)'; x.lineWidth = 2.4;
  for (const [txt, font, off] of runs) { x.font = font; x.strokeText(txt, sx + off, sy); }

  const t = new THREE.CanvasTexture(c); t.anisotropy = 8; return t;
}

/* ── 05 ── bloom halo canvas: purple glow in the wordmark's shape ──── */
/* The letterforms are painted with heavy shadow blur, then knocked back
   out (destination-out) so only the light spilling around them remains. */
export function bloomCanvas() {
  const c = document.createElement('canvas'); c.width = 1400; c.height = 400;
  const x = c.getContext('2d');
  x.textBaseline = 'middle';
  const { total, runs } = wordmarkRuns(x, 208);
  const sx = (1400 - total) / 2;
  x.fillStyle = '#8b3dff'; x.shadowColor = '#a855f7';
  for (const blur of [70, 42, 22]) {
    x.shadowBlur = blur;
    for (const [txt, font, off] of runs) { x.font = font; x.fillText(txt, sx + off, 200); }
  }
  x.shadowBlur = 0;
  x.globalCompositeOperation = 'destination-out';   // clear the glyphs, keep the halo
  for (const [txt, font, off] of runs) { x.font = font; x.fillText(txt, sx + off, 200); }
  x.globalCompositeOperation = 'source-over';
  return c;
}
