{/* ════════════════════════════════════════════════════════════
    PromoBar
    Renders: the dismissible promo banner (#bar) pinned at the top
    — founding-members copy with a "See what's included" link plus
    the #barX dismiss button (wired by effects.js; #barX also feeds
    the "bar dismissed" flag used by the fixed nav offset).

    Used-by (breadcrumb up): App (src/App.jsx) — seventh top-level
    sibling in the outer fragment, after IconDefs, before Nav.

    Contains (breadcrumb down): #bar > .wrap.bar-in > p.bar-txt
    (+ #membership link) + button#barX with <use href="#i-close"/>.
    ════════════════════════════════════════════════════════════ */}

export default function PromoBar() {
  return (
    <div className="bar" id="bar">
      <div className="wrap bar-in">
        <p className="bar-txt">Founding memberships are open — every room on one key. <a href="#membership">See what's included</a></p>
        <button className="bar-x" id="barX" aria-label="Dismiss"><svg viewBox="0 0 24 24"><use href="#i-close"/></svg></button>
      </div>
    </div>
  );
}
