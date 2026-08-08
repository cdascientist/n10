/* =====================================================================
   loader.js — the 3D preloader scene (chrome wordmark in the dark)
   ---------------------------------------------------------------------
   buildLoaderScene(reg) paints the boot screen's animated centrepiece:
   a floating extruded chrome wordmark with a bloom halo and drifting
   glow orbs. It is the FIRST WebGL context created on the page, which
   matters on iOS (see engine.js §06 for the context-eviction strategy).

   Every failure mode — context creation throwing, context loss, a render
   exception — degrades to the static `.mark` wordmark so the boot screen
   never hangs on a black box.
   ===================================================================== */

import { TEXT } from './palette.js';
import { glowTexture, chromeTexture, bloomCanvas } from './textures.js';

/* module singleton — the loader is transient; only one can exist at a time */
export let loader = null;

/* loader lifecycle helpers — imports are read-only, so mutation goes
   through these setters */
export function setLoader(instance) { loader = instance; }
export function clearLoader(dispose = false) {
  if (dispose && loader) { try { loader.dispose(); } catch (e) {} }
  loader = null;
}

export function buildLoaderScene(reg) {
  const cv = reg.logo3d;
  const mark = reg.mark;
  let R = null, alive = true;

  /* ── 01 ── single escape path for every failure mode ──────────────── */
  const degrade = () => {
    if (!alive) return;                  // already gone / disposed deliberately
    alive = false;
    mark.classList.add('on');            // reveal the static wordmark
    cv.style.display = 'none';
    try { if (R) R.forceContextLoss(); } catch (e) {}
    try { if (R) R.dispose(); } catch (e) {}
    loader = null;                       // drop the module singleton
  };

  /* ── 02 ── context creation (the throw/catch is the first guard) ──── */
  try {
    R = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
  } catch (e) {
    console.error('[loader] WebGL context creation failed:', e && e.message || e);
    degrade();
    return null;
  }
  cv.addEventListener('webglcontextlost', ev => {
    ev.preventDefault();
    console.warn('[webgl] loader context LOST');
    degrade();
  }, false);

  const sc = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(29, 1.6, 0.1, 60);
  cam.position.set(0, 0.05, 9.6);

  /* ── 03 ── responsive sizing ──────────────────────────────────────── */
  /* Size the plate against its container, then clamp so it never exceeds
     the visible viewport height — on short landscape phones 90vw alone
     would push the wordmark/bar/stage off the bottom of the screen. */
  const fit = () => {
    const wrap = cv.parentElement;
    const availW = (wrap && wrap.clientWidth) || cv.clientWidth || 720;
    const availH = (window.visualViewport && visualViewport.height) || innerHeight || 600;
    const w = Math.min(availW, Math.max(120, (availH - 90) / 0.625));
    const h = Math.round(w * 0.625);
    cv.style.width = w + 'px';
    cv.style.height = h + 'px';
    R.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    R.setSize(w, h, false);
    cam.aspect = w / h; cam.updateProjectionMatrix();
  };

  /* ── 04 ── build the wordmark group ───────────────────────────────── */
  const grp = new THREE.Group(); sc.add(grp);

  /* glowing lights behind the mark */
  const glowTex = glowTexture();
  const softGlow = (w, h, color, op, z) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ map: glowTex, color, transparent: true,
        blending: THREE.AdditiveBlending, depthWrite: false, opacity: op }));
    m.position.z = z;
    grp.add(m);
    return m;
  };
  const wash = softGlow(11.5, 6.6, 0x6d28d9, 0.42, -1.6);   // broad field
  const core = softGlow(6.4, 3.2, 0xa855f7, 0.5, -0.9);     // tight behind the letters
  const orbs = [
    { m: softGlow(3.0, 3.0, 0x7c3aed, 0.42, -1.25), r: 2.5, s: 0.31, p: 0.0 },
    { m: softGlow(2.4, 2.4, 0xc084fc, 0.34, -1.35), r: 3.1, s: -0.24, p: 2.1 },
    { m: softGlow(2.0, 2.0, 0xe9d5ff, 0.26, -1.45), r: 1.7, s: 0.43, p: 4.4 },
  ];

  /* extruded chrome wordmark: a stack of cutout layers + a soft front face */
  const chrome = chromeTexture();
  const TW = TEXT.W, TH = TEXT.H;
  const tGeo = new THREE.PlaneGeometry(TW, TH);
  const LAYERS = 14, DEPTH = 0.19;
  const wordmark = new THREE.Group();
  for (let i = LAYERS - 1; i >= 1; i--) {
    const k = i / (LAYERS - 1);
    const mat = new THREE.MeshBasicMaterial({
      map: chrome, alphaTest: 0.5, transparent: false, side: THREE.DoubleSide,
      color: new THREE.Color(0x2b1152).lerp(new THREE.Color(0x9a6ae0), (1 - k) * 0.55),
    });
    const m = new THREE.Mesh(tGeo, mat);
    m.position.z = -i * (DEPTH / (LAYERS - 1));
    wordmark.add(m);
  }
  /* front face: soft alpha keeps glyph edges antialiased over the stack */
  const faceMat = new THREE.MeshBasicMaterial({
    map: chrome, transparent: true, depthWrite: false, alphaTest: 0.02, side: THREE.DoubleSide,
  });
  const faceMesh = new THREE.Mesh(tGeo, faceMat);
  faceMesh.renderOrder = 6;
  wordmark.add(faceMesh);

  /* the mark's own halo, letterforms knocked out, just behind the metal */
  const bloomTex = new THREE.CanvasTexture(bloomCanvas());
  const bloom = new THREE.Mesh(new THREE.PlaneGeometry(TW * 1.16, TH * 1.16),
    new THREE.MeshBasicMaterial({ map: bloomTex, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.95 }));
  bloom.position.z = -DEPTH - 0.02;
  wordmark.add(bloom);
  wordmark.position.z = DEPTH / 2;
  grp.add(wordmark);

  fit();
  addEventListener('resize', fit);

  /* ── 05 ── tick + dispose ─────────────────────────────────────────── */
  const api = {
    tick(t) {
      if (!alive) return;
      grp.rotation.y = Math.sin(t * 0.34) * 0.32;
      grp.rotation.x = Math.sin(t * 0.23) * 0.11;
      grp.position.y = Math.sin(t * 0.50) * 0.07;
      bloom.material.opacity = 0.8 + Math.sin(t * 1.6) * 0.18;
      core.material.opacity = 0.42 + Math.sin(t * 1.1) * 0.14;
      wash.material.opacity = 0.36 + Math.sin(t * 0.7) * 0.1;
      orbs.forEach(o => {
        o.m.position.x = Math.cos(t * o.s + o.p) * o.r;
        o.m.position.y = Math.sin(t * o.s * 1.4 + o.p) * o.r * 0.42;
      });
      /* a render exception in the transient loader must degrade it, not
         propagate into the main loop (a throw would skip the main render) */
      try { R.render(sc, cam); }
      catch (err) { console.error('[loader] render failed:', err); degrade(); }
    },
    dispose() {
      alive = false;
      removeEventListener('resize', fit);
      sc.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          const ms = Array.isArray(o.material) ? o.material : [o.material];
          ms.forEach(m => { for (const k in m) if (m[k] && m[k].isTexture) m[k].dispose(); m.dispose(); });
        }
      });
      try { R.forceContextLoss(); } catch (e) {}
      R.dispose();
      if (reg.logo3d) reg.logo3d.style.display = 'none';
    },
  };
  loader = api;   // register the live instance (degrade() nulls it)
  return api;
}