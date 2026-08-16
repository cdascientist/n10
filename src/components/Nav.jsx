{/* ════════════════════════════════════════════════════════════
    Nav
    Renders: the fixed site header (#nav) — logo, the "Treatments"
    and "Fuel Lab" dropdown menus (with #d1 / #d2 drop panels and
    aria-expanded toggling owned by effects.js), the Gallery / Book
    buttons and the #burger button (also wired in effects.js).

    Used-by (breadcrumb up): App (src/App.jsx) — eighth top-level
    sibling in the outer fragment, after PromoBar, before MobileSheet.

    Contains (breadcrumb down): <header#nav> > .wrap.nav-in > a.logo
    + nav.menu (2 .menu-item with .drop#d1/#d2 + plain Membership
    link) + .nav-end (Gallery / Book / #burger).
    ════════════════════════════════════════════════════════════ */}

export default function Nav() {
  return (
    <header className="nav" id="nav">
      <div className="wrap nav-in">
        <a className="logo" href="#top" aria-label="InTension home">
          <svg className="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><use href="#mark"/></svg>
          <span className="logo-type"><i className="lg-in">In</i><i className="lg-ten">Tension</i></span>
        </a>

        <nav className="menu" aria-label="Main">
          <div className="menu-item">
            <button aria-expanded="false" aria-controls="d1">Treatments <svg viewBox="0 0 24 24"><use href="#i-chevd"/></svg></button>
            <div className="drop" id="d1">
              <a href="#heat"><span className="gi"><svg viewBox="0 0 24 24"><use href="#i-heat"/></svg></span><span><b>Sauna & cold plunge</b><span>Contrast therapy by the hour</span></span></a>
              <a href="#movement"><span className="gi"><svg viewBox="0 0 24 24"><use href="#i-move"/></svg></span><span><b>Yoga & mobility</b><span>Slow flow, restore, mobility</span></span></a>
            </div>
          </div>
          <div className="menu-item">
            <button aria-expanded="false" aria-controls="d2">Fuel Lab <svg viewBox="0 0 24 24"><use href="#i-chevd"/></svg></button>
            <div className="drop" id="d2">
              <a href="#fuel-menu"><span className="gi"><svg viewBox="0 0 24 24"><use href="#i-leaf"/></svg></span><span><b>The board</b><span>Full menu and pricing</span></span></a>
            </div>
          </div>
          <div className="menu-item"><a href="#membership">Membership</a></div>
        </nav>

        <div className="nav-end">
          <a className="btn btn-plain" href="#gallery">Gallery</a>
          <a className="btn btn-fill" href="#book">Book</a>
          <button className="burger" id="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
        </div>
      </div>
    </header>
  );
}
