{/* ════════════════════════════════════════════════════════════
    NavLogo
    Renders: the header logo link (a.logo) — the #mark-bp brand mark
    (black→purple gradient, v19.0) plus the In/Tension wordmark. Click
    jumps to #top; aria-label reads as "InTension home".

    Used-by (breadcrumb up): Nav (src/components/chrome/Nav/index.jsx)
    — first child of .wrap.nav-in, before the menu.

    Contains (breadcrumb down): <a.logo> > svg.logo-mark (<use
    href="#mark-bp"/>) + span.logo-type (i.lg-in + i.lg-ten).
    ════════════════════════════════════════════════════════════ */}

export default function NavLogo() {
  return (
    <a className="logo" href="#top" aria-label="InTension home">
      <svg className="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><use href="#mark-bp"/></svg>
      <span className="logo-type"><i className="lg-in">In</i><i className="lg-ten">Tension</i></span>
    </a>
  );
}
