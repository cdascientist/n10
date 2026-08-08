/* =====================================================================
   geometry.js — wire & panel builders
   ---------------------------------------------------------------------
   Every wire in the building is pushed into ONE shared buffer and drawn
   as a single LineSegments mesh (vertex colours interpolate along each
   segment, so gradients are free). Translucent wall films are gathered
   in a parallel PanelBuilder and drawn as one additive mesh.

   Both builders are pure geometry collectors: they only touch THREE at
   build() time, so importing this module is safe in any environment.

   § numbering continues into palette.js.
   ===================================================================== */

/* ── 01 ── helpers ─────────────────────────────────────────────────── */
/* hex → [r,g,b] unit components */
export const rgb = (hex) => [
  (hex >> 16 & 255) / 255,
  (hex >> 8 & 255) / 255,
  (hex & 255) / 255,
];

/* linear interpolation between two rgb tuples */
export const mixc = (a, b, t) => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/* ── 02 ── PanelBuilder — faint gradient films over wall spans ─────── */
/* Two triangles per quad; each corner carries its own colour (base at
   the floor, top tint toward the ceiling) so the film reads as a soft
   vertical gradient without any per-fragment work. */
export class PanelBuilder {
  constructor() { this.v = []; this.c = []; }

  /* one vertical quad from (x1,z1) to (x2,z2), height h, bottom/top colours */
  quad(x1, z1, x2, z2, h, B, T) {
    this.v.push(x1, 0, z1, x2, 0, z2, x2, h, z2);
    this.c.push(B[0], B[1], B[2], B[0], B[1], B[2], T[0], T[1], T[2]);
    this.v.push(x1, 0, z1, x2, h, z2, x1, h, z1);
    this.c.push(B[0], B[1], B[2], T[0], T[1], T[2], T[0], T[1], T[2]);
  }

  /* freeze the collected quads into a vertex-coloured BufferGeometry */
  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.v, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.c, 3));
    return g;
  }

  get count() { return this.v.length / 9; }
}

/* ── 03 ── LineBuilder — every wireframe primitive in the building ─── */
export class LineBuilder {
  constructor() { this.v = []; this.c = []; }

  /* a straight segment with one colour for both endpoints */
  seg(x1, y1, z1, x2, y2, z2, col) {
    const r = (col >> 16 & 255) / 255, g = (col >> 8 & 255) / 255, b = (col & 255) / 255;
    this.v.push(x1, y1, z1, x2, y2, z2);
    this.c.push(r, g, b, r, g, b);
  }

  /* same segment, but each endpoint carries its own colour tuple so the
     GPU interpolates a gradient along the wire */
  segG(x1, y1, z1, x2, y2, z2, cA, cB) {
    this.v.push(x1, y1, z1, x2, y2, z2);
    this.c.push(cA[0], cA[1], cA[2], cB[0], cB[1], cB[2]);
  }

  /* four-segment rectangle in the XZ plane at height y */
  rect(x1, z1, x2, z2, y, col) {
    this.seg(x1, y, z1, x2, y, z1, col);
    this.seg(x2, y, z1, x2, y, z2, col);
    this.seg(x2, y, z2, x1, y, z2, col);
    this.seg(x1, y, z2, x1, y, z1, col);
  }

  /* axis-aligned box rotated around Y (all 12 edges) */
  box(cx, cy, cz, w, h, d, col, ry = 0) {
    const hw = w / 2, hh = h / 2, hd = d / 2, co = Math.cos(ry), si = Math.sin(ry);
    const P = [[-hw, -hh, -hd], [hw, -hh, -hd], [hw, -hh, hd], [-hw, -hh, hd],
               [-hw, hh, -hd], [hw, hh, -hd], [hw, hh, hd], [-hw, hh, hd]]
      .map(p => [cx + p[0] * co - p[2] * si, cy + p[1], cz + p[0] * si + p[2] * co]);
    const E = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
    for (const [a, b] of E) this.seg(P[a][0], P[a][1], P[a][2], P[b][0], P[b][1], P[b][2], col);
  }

  /* ellipse ring: plane 'y' = horizontal circle, else vertical circle */
  ring(cx, cy, cz, rx, rz, col, seg = 24, plane = 'y') {
    for (let i = 0; i < seg; i++) {
      const a = i / seg * Math.PI * 2, b = (i + 1) / seg * Math.PI * 2;
      if (plane === 'y') this.seg(cx + Math.cos(a) * rx, cy, cz + Math.sin(a) * rz, cx + Math.cos(b) * rx, cy, cz + Math.sin(b) * rz, col);
      else this.seg(cx + Math.cos(a) * rx, cy + Math.sin(a) * rz, cz, cx + Math.cos(b) * rx, cy + Math.sin(b) * rz, cz, col);
    }
  }

  /* uniform grid of wires across an XZ rect at height y */
  grid(x1, z1, x2, z2, y, step, col) {
    for (let x = Math.ceil(x1 / step) * step; x <= x2; x += step) this.seg(x, y, z1, x, y, z2, col);
    for (let z = Math.ceil(z1 / step) * step; z <= z2; z += step) this.seg(x1, y, z, x2, y, z, col);
  }

  /* freeze the collected wires into a vertex-coloured BufferGeometry */
  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.v, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.c, 3));
    return g;
  }

  get count() { return this.v.length / 6; }
}
