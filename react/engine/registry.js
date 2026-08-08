/* =====================================================================
   registry.js — shared DOM reference bus
   ---------------------------------------------------------------------
   The engine is imperative (it mutates canvases, writes HUD text and
   toggles classes every frame at 60fps — React re-rendering there would
   be wasteful). The UI components are declarative React. This tiny
   module is the bridge: each component registers its DOM node under a
   stable name, and the engine reads whatever it needs from `reg`.

   Registration happens automatically via ref callbacks (`setRef`),
   which React calls with the DOM node at commit time — before any
   useEffect runs — so the engine is guaranteed to find every node it
   needs when it boots.
   ===================================================================== */

export const reg = {
  /* scene / stage */
  canvas: null,     // main WebGL canvas (#scene)
  boot: null,       // preloader overlay (#boot)
  hud: null,        // HUD overlay (#hud)
  touch: null,      // touch-control layer (#touch)

  /* preloader internals */
  logo3d: null,     // loader WebGL canvas (#logo3d)
  mark: null,       // static wordmark fallback (.mark)
  fill: null,       // progress bar fill (#fill)
  stage: null,      // stage label line (#stage)
  enter: null,      // "ENTER THE SPACE" button (#enter)

  /* HUD internals */
  stats: null,      // FPS/parallelism/motes/res panel (#stats)
  where: null,      // "you are here" readout (#where)
  keys: null,       // control legend panel (#keys)
  mapCv: null,      // minimap canvas (#map)
  mapbox: null,     // minimap frame (#mapbox)

  /* touch controls */
  stick: null,      // virtual joystick base (#stick)
  knob: null,       // joystick knob (#knob)
  runBtn: null,     // RUN button (#run)

  /* callbacks */
  onEnter: null,    // set by App: fired when the walkthrough begins
};

/* React ref callback factory — `ref={setRef('canvas')}` registers the
   node (and un-registers it on unmount, when React passes null). */
export const setRef = (name) => (el) => {
  reg[name] = el;
};
