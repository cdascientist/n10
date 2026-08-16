{/* ════════════════════════════════════════════════════════════
    HeroObject
    Renders: the pinned hero object (Mechanic 4) — the IN/TENSION
    mark in two variants (filled #mark and ink #mark-ink) stacked in
    #obj-inner; effects.js scrubs one variant against the other as
    the cover pages slide. aria-hidden — pure decoration.

    Used-by (breadcrumb up): App (src/App.jsx) — rendered inside
    <main className="deck scene-run" id="top"> as the FIRST child,
    before the .cover-stack.

    Contains (breadcrumb down): #hero-object > .obj-inner > two
    .variant svgs (<use href="#mark"> / <use href="#mark-ink">).
    ════════════════════════════════════════════════════════════ */}

export default function HeroObject() {
  return (
    /* pinned hero object (Mechanic 4) — the IN/TENSION mark, two variants */
    <div id="hero-object" aria-hidden="true">
      <div className="obj-inner">
        <svg className="variant" viewBox="0 0 64 64"><use href="#mark"/></svg>
        <svg className="variant" viewBox="0 0 64 64"><use href="#mark-ink"/></svg>
      </div>
    </div>
  );
}
