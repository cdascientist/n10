/* =====================================================================
   Minimap.jsx — floor-plan minimap
   ---------------------------------------------------------------------
   The mapbox frame (bottom-right) with its 2D minimap canvas and the
   brand dot. The canvas's base layer is painted once by the engine
   (buildMinimap); every HUD tick the engine stamps the base and draws
   the player's heading arrow (drawMinimap).
   ===================================================================== */

import { setRef } from '../engine/registry.js';

export default function Minimap() {
  return (
    <div id="mapbox" ref={setRef('mapbox')}>
      <canvas id="map" width="424" height="236" ref={setRef('mapCv')} />
    </div>
  );
}
