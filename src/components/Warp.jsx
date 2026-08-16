{/* ════════════════════════════════════════════════════════════
    Warp
    Renders: the full-viewport warp/vignette overlay — five empty
    <i> tiles that effects.js animates as the decorative grid-warp
    behind the scenes.

    Used-by (breadcrumb up): App (src/App.jsx) — fifth top-level
    sibling in the outer fragment, after PromoSticker.

    Contains (breadcrumb down): #warp with five empty <i> elements.
    ════════════════════════════════════════════════════════════ */}

export default function Warp() {
  return (
    <div id="warp"><i></i><i></i><i></i><i></i><i></i></div>
  );
}
