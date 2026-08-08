/* =====================================================================
   TouchControls.jsx — virtual joystick + RUN button
   ---------------------------------------------------------------------
   The touch layer sits above the HUD but below the boot screen. It is
   always mounted; the engine adds `.on` the first time a finger lands
   anywhere (enableTouchUI in engine/controls.js), which also hides the
   keys legend.
   ===================================================================== */

import { setRef } from '../engine/registry.js';
import '../styles/touch.css';

export default function TouchControls() {
  return (
    <div id="touch" ref={setRef('touch')}>
      <div id="stick" ref={setRef('stick')}>
        <div id="knob" ref={setRef('knob')} />
      </div>
      <div id="run" ref={setRef('runBtn')}>RUN</div>
    </div>
  );
}
