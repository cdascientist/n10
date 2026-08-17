{/* ════════════════════════════════════════════════════════════
    FooterBrand
    Renders: the footer brand block (.foot-brand) — the #mark logo
    link, the one-line tagline and the licensed-massage badge.

    Used-by (breadcrumb up): Footer (src/components/Footer/index.jsx)
    — first child of .wrap, before the link columns.

    Contains (breadcrumb down): <div.foot-brand> > a.logo (svg + span
    .logo-type) + p + span.badge (svg use#i-shield + text).
    ════════════════════════════════════════════════════════════ */}

export default function FooterBrand() {
  return (
    <div className="foot-brand">
      <a className="logo" href="#top">
        <svg className="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><use href="#mark"/></svg>
        <span className="logo-type"><i className="lg-in">In</i><i className="lg-ten">Tension</i></span>
      </a>
      <p>Bodywork, heat, movement and fuel — run by people who actually do the work.</p>
      <span className="badge"><svg viewBox="0 0 24 24"><use href="#i-shield"/></svg>Licensed massage establishment</span>
    </div>
  );
}
