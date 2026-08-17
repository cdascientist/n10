{/* ════════════════════════════════════════════════════════════
    Marquee
    Renders: the empty gallery marquee track (.gal-track > #galRun).
    effects.js clones the marquee tiles into #galRun and scrubs them
    against the scroll — the component only provides the container.

    Used-by (breadcrumb up): GalleryScene
    (src/components/scenes/GalleryScene/index.jsx) — second child of
    section#gallery, after the .wrap.scene-in.

    Contains (breadcrumb down): <div.gal-track> > <div.gal-run#galRun>
    (populated at runtime by effects.js).
    ════════════════════════════════════════════════════════════ */}

export default function Marquee() {
  return (
    <div className="gal-track"><div className="gal-run" id="galRun"></div></div>
  );
}
