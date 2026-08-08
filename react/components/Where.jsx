/* =====================================================================
   Where.jsx — "you are here" readout
   ---------------------------------------------------------------------
   A centred bottom panel showing which room/zone the visitor is in.
   Same contract as Stats: React renders the shell, the engine sets
   textContent as the player moves.
   ===================================================================== */

import { setRef } from '../engine/registry.js';

export default function Where() {
  return (
    <div className="panel" id="where" ref={setRef('where')}>
      FRONT DESK CONCIERGE
    </div>
  );
}
