{/* ════════════════════════════════════════════════════════════
    HeroScene
    Renders: page 1 — the sticky base scene (panel--base, white bg):
    two full-bleed hero photos (one preload-priority, one "alt"
    crossfade), the white veil layers (#heroVeil, #heroVeilW — the
    white layer is owned by ONE scrubbed timeline, see CLAUDE.md)
    and the large centered logo.

    Used-by (breadcrumb up): App (src/App.jsx) — rendered inside the
    .cover-stack div as the FIRST cover child (hero → intro → trust).

    Contains (breadcrumb down): <section id="hero" class="scene panel
    panel--base" data-bg="#FFFFFF" data-ink="dark"> > .hero-bg (two
    imgs + #heroVeil + #heroVeilW) + a.logo.logo-lg.
    ════════════════════════════════════════════════════════════ */}

export default function HeroScene() {
  return (
    /* HERO (page 1 — sticky base: logo only, centered) */
    <section className="scene panel panel--base" data-bg="#FFFFFF" data-ink="dark" id="hero">
      <div className="hero-bg">
        <img className="shot" src="https://images.unsplash.com/photo-1741522509438-a120c0bb5e88?fm=jpg&q=76&w=1800&auto=format&fit=crop" alt="" aria-hidden="true" fetchPriority="high" decoding="sync" referrerpolicy="no-referrer" />
        <img className="shot alt" src="https://images.unsplash.com/photo-1745327883508-b6cd32e5dde5?fm=jpg&q=76&w=1800&auto=format&fit=crop" alt="" aria-hidden="true" decoding="sync" referrerpolicy="no-referrer" />
        <span className="veil" id="heroVeil"></span>
        <span className="veil-w" id="heroVeilW"></span>
      </div>
      <a className="logo logo-lg" href="#top" aria-label="InTension home">
        <svg className="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><use href="#mark"/></svg>
        <span className="logo-type"><i className="lg-in">In</i><i className="lg-ten">Tension</i></span>
      </a>
    </section>
  );
}
