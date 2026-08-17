{/* ════════════════════════════════════════════════════════════
    NavDropdown
    Renders: one .menu-item dropdown — the disclosure button
    (aria-expanded / aria-controls owned by effects.js) and its
    .drop#d1 / #d2 panel holding the link children. The label + id
    come from props; the drop links are passed through verbatim so
    the rendered DOM stays byte-identical to the inline original.

    Used-by (breadcrumb up): Nav (src/components/chrome/Nav/index.jsx)
    — two of these (Treatments #d1, Fuel Lab #d2) inside nav.menu,
    before the plain Membership link.

    Contains (breadcrumb down): <div.menu-item> > button (label +
    chevron svg #i-chevd) + <div.drop id> > {children} (the drop links).
    ════════════════════════════════════════════════════════════ */}

export default function NavDropdown({ id, label, children }) {
  return (
    <div className="menu-item">
      <button aria-expanded="false" aria-controls={id}>{label + ' '}<svg viewBox="0 0 24 24"><use href="#i-chevd"/></svg></button>
      <div className="drop" id={id}>{children}</div>
    </div>
  );
}
