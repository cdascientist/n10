/* =====================================================================
   Keys.jsx — control legend
   ---------------------------------------------------------------------
   The desktop control cheat-sheet (top-right). On touch devices the
   touch layer hides it (the engine sets display:none when the joystick
   engages) — the React component itself stays mounted and untouched.
   ===================================================================== */

import { setRef } from '../engine/registry.js';

export default function Keys() {
  return (
    <div className="panel" id="keys" ref={setRef('keys')}>
      W A S D / ARROWS &nbsp;move<br />
      MOUSE&nbsp;look &nbsp;·&nbsp; SHIFT&nbsp;run<br />
      ESC&nbsp;release cursor
    </div>
  );
}
