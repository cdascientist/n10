/* =====================================================================
   Scene.jsx — the WebGL canvas + engine host
   ---------------------------------------------------------------------
   Renders the full-screen <canvas> the engine draws into, then boots
   the engine on mount. All heavy lifting lives in engine/engine.js;
   this component is deliberately tiny — it is the boundary between the
   React tree and the imperative three.js layer.

   The engine is initialised in a useEffect (after refs are attached),
   and torn down on unmount.
   ===================================================================== */

import { useEffect } from 'react';

import { setRef } from '../engine/registry.js';
import { initEngine, disposeEngine } from '../engine/engine.js';

export default function Scene() {
  /* ── 01 ── boot the engine exactly once ──────────────────────────── */
  useEffect(() => {
    initEngine();
    return () => disposeEngine();
  }, []);

  /* ── 02 ── the canvas itself ─────────────────────────────────────── */
  /* tabIndex lets the canvas take keyboard focus so keydown arrives
     reliably even inside an iframe; ref registration happens at commit,
     before this effect runs, so the engine already has the node. */
  return (
    <canvas
      id="scene"
      tabIndex={0}
      ref={setRef('canvas')}
      aria-label="InTension 3D wireframe walkthrough"
    />
  );
}
