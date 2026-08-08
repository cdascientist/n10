/* =====================================================================
   Boot.jsx — the preloader overlay
   ---------------------------------------------------------------------
   The ENTER gate. Layers, top to bottom:
     • #logo3d  — the animated 3D chrome wordmark (engine-owned canvas)
     • .mark    — static wordmark fallback (revealed if WebGL can't start)
     • .bar     — progress fill driven by the staged build pipeline
     • .stage   — the current build stage label
     • #enter   — "ENTER THE SPACE" button (appears once boot completes)

   When `entered` flips true the whole overlay fades out (the `.gone`
   class) and the HUD beneath takes over.
   ===================================================================== */

import { setRef } from '../engine/registry.js';
import '../styles/boot.css';

export default function Boot({ entered, onEnter }) {
  /* ── 01 ── markup (ids are the engine's contract with the DOM) ───── */
  return (
    <div id="boot" className={entered ? 'gone' : ''} ref={setRef('boot')}>
      <div className="bootwrap">
        <canvas id="logo3d" ref={setRef('logo3d')} />
        <div className="mark" ref={setRef('mark')}>
          In<span>T</span>ension
        </div>
        <div className="bar"><i id="fill" ref={setRef('fill')} /></div>
        <div className="stage" id="stage" ref={setRef('stage')}>STARTING RENDER CORE</div>
        {/* the button only appears once the engine adds .on — the engine
            keeps that class in its own hands because it appears exactly
            when the build pipeline finishes */}
        <button id="enter" ref={setRef('enter')} onClick={onEnter}>
          ENTER THE SPACE
        </button>
      </div>
    </div>
  );
}
