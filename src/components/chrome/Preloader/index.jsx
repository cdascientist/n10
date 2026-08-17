{/* ════════════════════════════════════════════════════════════
    Preloader
    Renders: the full-page purple preloader that waits for the load
    event, then fades into the page. No-JS-safe — it is hidden by
    GSAP at runtime (effects.js), never by CSS.

    Used-by (breadcrumb up): App (src/App.jsx) — third top-level
    sibling in the outer fragment, after SkipIntroLink.

    Contains (breadcrumb down): #preloader with .pl-mark svg
    (#mark symbol), .pl-type wordmark, .pl-bar progress bar, .pl-txt.
    ════════════════════════════════════════════════════════════ */}

export default function Preloader() {
  return (
    /* ═══ PRELOADER — waits for the full load, then fades into the page ═══ */
    <div id="preloader" role="status" aria-label="Loading IN/TENSION">
      <svg className="pl-mark" viewBox="0 0 64 64" aria-hidden="true"><use href="#mark"/></svg>
      <span className="pl-type"><i className="lg-in">In</i><i className="lg-ten">Tension</i></span>
      <div className="pl-bar" aria-hidden="true"><i></i></div>
      <p className="pl-txt">Preparing your visit</p>
    </div>
  );
}
