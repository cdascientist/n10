/* =====================================================================
   Hud.jsx — the heads-up display container
   ---------------------------------------------------------------------
   A pointer-events:none overlay that holds every HUD panel. It is
   invisible (opacity 0) until the walkthrough starts, then fades in
   via the `.on` class driven by the `entered` prop.

   Children (each a tiny component of its own):
     <Stats/>  — FPS / parallelism / motes / resolution (engine-written)
     <Where/>  — "you are here" location readout (engine-written)
     <Keys/>   — control legend
     <Minimap/>— floor plan + player arrow + brand mark
   ===================================================================== */

import Stats from './Stats.jsx';
import Where from './Where.jsx';
import Keys from './Keys.jsx';
import Minimap from './Minimap.jsx';

import { setRef } from '../engine/registry.js';
import '../styles/hud.css';

export default function Hud({ entered }) {
  return (
    <div id="hud" className={entered ? 'on' : ''} ref={setRef('hud')}>
      <Stats />
      <Keys />
      <Where />
      <Minimap />
      {/* the pulsing centre brand dot */}
      <div className="brand" />
    </div>
  );
}
