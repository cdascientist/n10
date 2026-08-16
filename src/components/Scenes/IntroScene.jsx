{/* ════════════════════════════════════════════════════════════
    IntroScene
    Renders: page 2 — the half-hold glass panel (panel--hold):
    #holdTint glass layer, .hero-halo glow, the "Tension in. /
    Tension out." headline, the Book CTA row and the hero sub-copy.

    Used-by (breadcrumb up): App (src/App.jsx) — rendered inside the
    .cover-stack div as the SECOND cover child (hero → intro → trust).

    Contains (breadcrumb down): <section id="intro" class="scene panel
    panel--hold" data-bg="#FFFFFF" data-ink="dark"> > #holdTint +
    .hero-halo + .wrap.scene-in (h1 > .ln spans, .cta-row > a.btn.mag,
    p.hero-sub).
    ════════════════════════════════════════════════════════════ */}

export default function IntroScene() {
  return (
    /* INTRO (page 2 — half-hold glass: headline, then the selection row, then the note) */
    <section className="scene panel panel--hold" data-bg="#FFFFFF" data-ink="dark" id="intro">
      <span className="hold-tint" id="holdTint"></span>
      <div className="hero-halo"></div>
      <div className="wrap scene-in">
        <h1>
          <span className="ln"><i>Tension in.</i></span>
          <span className="ln"><i><em>Tension out.</em></i></span>
        </h1>
        <div className="cta-row">
          <a className="btn mag" href="#book">Book a session <svg className="arw" viewBox="0 0 24 24"><use href="#i-arrow"/></svg></a>
        </div>
        <p className="hero-sub">Swedish massage, infrared heat, cold water, movement and a fuel bar — all in one bright, quiet building. Ninety minutes here undoes a whole week out there.</p>
      </div>
    </section>
  );
}
