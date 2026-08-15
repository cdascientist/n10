/* =====================================================================
   App.jsx — composition root
   ---------------------------------------------------------------------
   Renders every layer of the experience in stacking order:

     <Scene/>          full-screen WebGL canvas (bottom)
     <Hud/>            FPS/location/minimap overlay
     <TouchControls/>  joystick + RUN (touch devices)
     <Boot/>           preloader + ENTER gate (top, until entered)
     <OverlayDeck/>    the React control deck (bottom-left, above all)

   App also owns the "entered" state — the single source of truth for
   whether the walkthrough has begun — and the engine's enter callback
   (reg.onEnter), which the engine fires on boot completion, on the 20s
   escape timer, and on unhandled rejections so the visitor is never
   stranded on the loader.
   ===================================================================== */

import { useCallback, useEffect, useState } from 'react';

/* engine + shared DOM registry */
import { reg } from './engine/registry.js';
import { initEngine, disposeEngine, enter } from './engine/engine.js';

/* layer components */
import Scene from './components/Scene.jsx';
import Hud from './components/Hud.jsx';
import TouchControls from './components/TouchControls.jsx';
import Boot from './components/Boot.jsx';
import OverlayDeck from './components/OverlayDeck.jsx';
import Sticker from './components/Sticker.jsx';

/* global design tokens + base styles (scene canvas, root, variables) */
import './styles/global.css';

export default function App() {
  /* ── 01 ── entered: false → boot visible; true → HUD visible ─────── */
  const [entered, setEntered] = useState(false);

  /* ── 02 ── one handler for every path into the walkthrough ───────── */
  const handleEnter = useCallback(() => {
    enter();                 // imperative engine steps (idempotent)
    setEntered(true);        // declarative UI flip (idempotent)
  }, []);

  /* ── 03 ── boot the engine once all refs are registered ──────────── */
  useEffect(() => {
    reg.onEnter = handleEnter;
    /* escape hatch: even if every stage fails, enter after 20s */
    const escape = setTimeout(() => handleEnter(), 20000);
    initEngine();            // wires scene, controls, loop + staged boot
    return () => {
      clearTimeout(escape);
      reg.onEnter = null;
      disposeEngine();
    };
  }, [handleEnter]);

  /* ── 04 ── the layers, bottom → top ──────────────────────────────── */
  return (
    <>
      <Scene />
      <Hud entered={entered} />
      <TouchControls />
      <Boot entered={entered} onEnter={handleEnter} />
      <OverlayDeck />
      <Sticker entered={entered} />   {/* promotional sticker — top-most; enters its walkthrough pose when entered */}
    </>
  );
}
