/* =====================================================================
   Stats.jsx — live performance panel
   ---------------------------------------------------------------------
   Renders an EMPTY panel: the engine writes innerHTML into it ~5×/second
   (FPS, parallelism, mote count, resolution scale). React owns the shell,
   the engine owns the 60fps content — never the other way around.
   ===================================================================== */

import { setRef } from '../engine/registry.js';

export default function Stats() {
  return (
    <div className="panel" id="stats" ref={setRef('stats')} aria-live="off" />
  );
}
