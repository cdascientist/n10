{/* ════════════════════════════════════════════════════════════
    GalleryScene
    Renders: the GALLERY scroll scene — eyebrow, the NINETY / MINUTES
    ticker headline and intro copy, plus the marquee track whose tiles
    (#galRun) are populated and scrubbed by effects.js.

    Used-by (breadcrumb up): App (src/App.jsx) — rendered inside
    <main className="deck scene-run" id="top"> after the .cover-stack,
    before MovementScene (first of the 8 plain scenes).

    Contains (breadcrumb down): <section id="gallery" class="scene"
    data-bg="#FFFFFF" data-ink="dark"> > .wrap.scene-in (.eyebrow,
    h2.ticker NINETY/MINUTES, p) + Marquee
    (src/components/scenes/GalleryScene/Marquee/index.jsx).
    ════════════════════════════════════════════════════════════ */}

import Marquee from './Marquee';

export default function GalleryScene() {
  return (
    /* GALLERY */
    <section className="scene" data-bg="#FFFFFF" data-ink="dark" id="gallery">
      <div className="wrap scene-in">
        <p className="eyebrow"><svg viewBox="0 0 24 24"><use href="#i-spark"/></svg>Inside a session</p>
        <h2 className="ticker">
          <span className="sr-only">What ninety minutes looks like</span>
          <span className="line"><span className="word">NINETY</span></span>
          <span className="line"><span className="word">MINUTES</span></span>
        </h2>
        <p>Hover or tap any frame and the violet lifts away, so you see the room in full colour.</p>
      </div>
      <Marquee />
    </section>
  );
}
