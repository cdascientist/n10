{/* ════════════════════════════════════════════════════════════
    LargeLogo
    Renders: the large centered logo link (a.logo.logo-lg) on page 1
    — the filled #mark brand mark plus the In/Tension wordmark. Click
    jumps to #top.

    Used-by (breadcrumb up): HeroScene (src/components/scenes/
    HeroScene/index.jsx) — second child of section#hero, after the
    .hero-bg block.

    Contains (breadcrumb down): <a.logo.logo-lg> > svg.logo-mark
    (<use href="#mark"/>) + span.logo-type (i.lg-in + i.lg-ten).
    ════════════════════════════════════════════════════════════ */}

export default function LargeLogo() {
  return (
    <a className="logo logo-lg" href="#top" aria-label="InTension home">
      <svg className="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><use href="#mark"/></svg>
      <span className="logo-type"><i className="lg-in">In</i><i className="lg-ten">Tension</i></span>
    </a>
  );
}
