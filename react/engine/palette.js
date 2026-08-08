/* =====================================================================
   palette.js — design tokens + floor-plan data
   ---------------------------------------------------------------------
   Pure data, no THREE, no DOM. Everything the scene builders need to
   know about the building: the colour language, the pixel→metre mapping
   of the source floor plan, the shell rectangle, and the room/zone
   inventory (names, rects, door openings, dressing style).

   § numbers continue the sequence started in geometry.js.
   ===================================================================== */

/* ── 01 ── colour palette (hex, matching the site's design tokens) ──── */
export const C = {
  shell:   0x6a28c8,  // outer structure
  wall:    0x8a3dff,  // interior partitions
  trim:    0xc98bff,  // door frames, ribs
  fixture: 0x9d5cff,  // furniture
  hot:     0xe6d2ff,  // highlights / filament
  floor:   0x2e1155,  // floor grid
  vein:    0x7a3cff,  // energy cracks
  mat:     0x5a2be0,  // yoga mats, pads
};

/* ── 02 ── floor plan: source image pixel space → metres ───────────── */
/* The plan was authored as pixel rectangles; S scales pixels to metres
   and (OX, OZ) is the origin of the building in image space. */
export const S = 0.04;
export const OX = 760;
export const OZ = 490;
export const wx = (p) => (p - OX) * S;   // pixel x → world x
export const wz = (p) => (p - OZ) * S;   // pixel y → world z

/* shell (outer walls) and heights */
export const SHELL = [20, 85, 1520, 900];
export const WALL_H = 3.2;
export const SHELL_H = 4.3;

/* ── 03 ── rooms: rect [x1,y1,x2,y2], doors on a side, dressing fn ─── */
export const ROOMS = [
  { n: "MEN'S LOCKER ROOM",       r:[30,95,240,272],    d:[{s:'S',t:.72,w:2.0}], f:'locker'  },
  { n: "STEAM ROOM",              r:[248,95,316,272],   d:[{s:'S',t:.5,w:1.3}],  f:'steam'   },
  { n: "SAUNA",                   r:[324,95,420,272],   d:[{s:'S',t:.5,w:1.3}],  f:'sauna'   },
  { n: "SWEDISH MASSAGE",         r:[480,95,652,310],   d:[{s:'S',t:.5,w:1.6}],  f:'massage' },
  { n: "DEEP TISSUE MASSAGE",     r:[662,95,834,310],   d:[{s:'S',t:.5,w:1.6}],  f:'massage' },
  { n: "TRIGGER POINT THERAPY",   r:[844,95,1016,310],  d:[{s:'S',t:.5,w:1.6}],  f:'massage' },
  { n: "WOMEN'S LOCKER ROOM",     r:[1105,95,1292,300], d:[{s:'S',t:.28,w:2.0}], f:'locker'  },
  { n: "STEAM ROOM",              r:[1298,95,1368,300], d:[{s:'S',t:.5,w:1.3}],  f:'steam'   },
  { n: "SAUNA",                   r:[1374,95,1482,300], d:[{s:'S',t:.5,w:1.3}],  f:'sauna'   },
  { n: "MINI GYM / CROSSFIT ZONE",r:[30,345,300,662],   d:[{s:'E',t:.55,w:2.6}], f:'gym'     },
  { n: "YOGA STUDIO",             r:[1150,345,1500,700],d:[{s:'W',t:.5,w:2.6}],  f:'yoga'    },
  { n: "SPORTS MASSAGE",          r:[30,700,252,866],   d:[{s:'E',t:.4,w:1.6}],  f:'therapy' },
  { n: "MEETING ROOM 1",          r:[356,712,590,872],  d:[{s:'N',t:.5,w:1.8}],  f:'meeting' },
  { n: "MEETING ROOM 2",          r:[930,712,1162,872], d:[{s:'N',t:.5,w:1.8}],  f:'meeting' },
  { n: "PRENATAL MASSAGE",        r:[1268,700,1490,866],d:[{s:'W',t:.5,w:1.6}],  f:'therapy' },
];

/* ── 04 ── open (unwalled) zones — for the readout + minimap tint ──── */
export const ZONES = [
  { n:"HALLWAY",              r:[180,272,430,320]  },
  { n:"HALLWAY",              r:[1100,300,1490,342]},
  { n:"JUICE BAR",            r:[380,415,552,700]  },
  { n:"LOUNGE",               r:[606,388,902,644]  },
  { n:"GIFT SHOP",            r:[956,398,1122,644] },
  { n:"FRONT DESK CONCIERGE", r:[622,644,890,714]  },
];

/* ── 05 ── loader wordmark plate size (shared by extrusion + halo) ─── */
export const TEXT = { W: 5.05, H: 5.05 * 400 / 1400, Y: -0.06 };
