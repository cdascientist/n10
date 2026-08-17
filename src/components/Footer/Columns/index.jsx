{/* ════════════════════════════════════════════════════════════
    FooterColumns
    Renders: the three footer link columns (.foot-grid) — Treatments /
    Fuel Lab / Club, each an h4 heading + a .grouped list of chevron
    links.

    Used-by (breadcrumb up): Footer (src/components/Footer/index.jsx)
    — second child of .wrap, after the brand block.

    Contains (breadcrumb down): <div.foot-grid> > 3 x div (h4 +
    div.grouped > a + svg.chev).
    ════════════════════════════════════════════════════════════ */}

export default function FooterColumns() {
  return (
    <div className="foot-grid">
      <div>
        <h4>Treatments</h4>
        <div className="grouped">
          <a href="#treatments">Massage & recovery<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
          <a href="#heat">Sauna & plunge<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
          <a href="#movement">Yoga & mobility<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
        </div>
      </div>
      <div>
        <h4>Fuel Lab</h4>
        <div className="grouped">
          <a href="#fuel-menu">Performance<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
          <a href="#fuel-menu">Recovery<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
          <a href="#fuel-menu">Hydration<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
        </div>
      </div>
      <div>
        <h4>Club</h4>
        <div className="grouped">
          <a href="#membership">Membership<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
          <a href="#book">Contact<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
        </div>
      </div>
    </div>
  );
}
