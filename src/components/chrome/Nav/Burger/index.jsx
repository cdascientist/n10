{/* ════════════════════════════════════════════════════════════
    Burger
    Renders: the mobile menu burger (button#burger) — three empty
    <span> bars. effects.js toggles aria-expanded and slides the
    #sheet in/out on click.

    Used-by (breadcrumb up): Nav (src/components/chrome/Nav/index.jsx)
    — last child of .nav-end, after the Gallery / Book buttons.

    Contains (breadcrumb down): <button.burger#burger> > 3 x <span>.
    ════════════════════════════════════════════════════════════ */}

export default function Burger() {
  return (
    <button className="burger" id="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
  );
}
