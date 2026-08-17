{/* ════════════════════════════════════════════════════════════
    FooterColumns
    Renders: the footer link columns (.foot-grid) — currently one
    Treatments column (Massage & recovery / Yoga & mobility) as an
    h4 heading + a .grouped list of chevron links.

    Used-by (breadcrumb up): Footer (src/components/Footer/index.jsx)
    — second child of .wrap, after the brand block.

    Contains (breadcrumb down): <div.foot-grid> > div (h4 +
    div.grouped > a + svg.chev).
    ════════════════════════════════════════════════════════════ */}

export default function FooterColumns() {
  return (
    <div className="foot-grid">
      <div>
        <h4>Treatments</h4>
        <div className="grouped">
          <a href="#treatments">Massage & recovery<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
          <a href="#movement">Yoga & mobility<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
        </div>
      </div>
    </div>
  );
}
