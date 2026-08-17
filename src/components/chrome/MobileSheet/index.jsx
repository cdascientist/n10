{/* ════════════════════════════════════════════════════════════
    MobileSheet
    Renders: the mobile slide-in menu sheet (#sheet) — the grouped
    link lists (Treatments / Club) plus the Gallery link.
    effects.js slides it in from the #burger and closes it on link tap.

    Used-by (breadcrumb up): App (src/App.jsx) — eighth top-level
    sibling in the outer fragment, after Nav, before <main>.

    Contains (breadcrumb down): #sheet > .wrap (paddingInline:0) with
    two h4.grouped blocks (i-hands/i-move, i-drop).
    ════════════════════════════════════════════════════════════ */}

export default function MobileSheet() {
  return (
    <div className="sheet" id="sheet">
      <div className="wrap" style={{paddingInline:0}}>
        <h4>Treatments</h4>
        <div className="grouped">
          <a href="#treatments"><span className="gi"><svg viewBox="0 0 24 24"><use href="#i-hands"/></svg></span>Massage & recovery<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
          <a href="#movement"><span className="gi"><svg viewBox="0 0 24 24"><use href="#i-move"/></svg></span>Yoga & mobility<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
        </div>
        <h4>Club</h4>
        <div className="grouped">
          <a href="#gallery"><span className="gi"><svg viewBox="0 0 24 24"><use href="#i-drop"/></svg></span>Gallery<svg className="chev" viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
        </div>
      </div>
    </div>
  );
}
