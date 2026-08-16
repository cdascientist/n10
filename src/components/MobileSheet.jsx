{/* ════════════════════════════════════════════════════════════
    MobileSheet
    Renders: the mobile slide-in menu sheet (#sheet) — the grouped
    link lists (Treatments / Fuel Lab / Club) plus the Book CTA.
    effects.js slides it in from the #burger and closes it on link tap.

    Used-by (breadcrumb up): App (src/App.jsx) — ninth top-level
    sibling in the outer fragment, after Nav, before <main>.

    Contains (breadcrumb down): #sheet > .wrap (paddingInline:0) with
    three h4.grouped blocks (i-heat/i-move, i-leaf, i-key/i-drop) +
    a .btn.btn-fill Book link.
    ════════════════════════════════════════════════════════════ */}

export default function MobileSheet() {
  return (
    <div className="sheet" id="sheet">
      <div className="wrap" style={{paddingInline:0}}>
        <h4>Treatments</h4>
        <div className="grouped">
          <a href="#heat"><span className="gi"><svg viewBox="0 0 24 24"><use href="#i-heat"/></svg></span>Sauna & cold plunge<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
          <a href="#movement"><span className="gi"><svg viewBox="0 0 24 24"><use href="#i-move"/></svg></span>Yoga & mobility<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
        </div>
        <h4>Fuel Lab</h4>
        <div className="grouped">
          <a href="#fuel-menu"><span className="gi"><svg viewBox="0 0 24 24"><use href="#i-leaf"/></svg></span>The board<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
        </div>
        <h4>Club</h4>
        <div className="grouped">
          <a href="#membership"><span className="gi"><svg viewBox="0 0 24 24"><use href="#i-key"/></svg></span>Membership<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
          <a href="#gallery"><span className="gi"><svg viewBox="0 0 24 24"><use href="#i-drop"/></svg></span>Gallery<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
        </div>
        <a className="btn btn-fill" href="#book">Book a session</a>
      </div>
    </div>
  );
}
