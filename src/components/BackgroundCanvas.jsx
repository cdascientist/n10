{/* ════════════════════════════════════════════════════════════
    BackgroundCanvas
    Renders: the fixed full-viewport background colour layer behind
    the whole scroll scene (Mechanic 1). No paint comes from CSS —
    effects.js drives the #bgPurple span to tint the canvas when a
    purple-bg scene (trust / book) scrolls into view.

    Used-by (breadcrumb up): App (src/App.jsx) — first top-level
    sibling in the outer fragment, rendered before SkipIntroLink.

    Contains (breadcrumb down): #bg-canvas wrapper + #bgPurple span.
    ════════════════════════════════════════════════════════════ */}

export default function BackgroundCanvas() {
  return (
    /* scroll-scene background canvas (Mechanic 1) — colour is driven by JS */
    <div id="bg-canvas"><span id="bgPurple"></span></div>
  );
}
