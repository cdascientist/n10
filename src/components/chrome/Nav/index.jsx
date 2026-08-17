{/* ════════════════════════════════════════════════════════════
    Nav
    Renders: the fixed site header (#nav) — logo, the "Treatments"
    and "Fuel Lab" dropdown menus (with #d1 / #d2 drop panels and
    aria-expanded toggling owned by effects.js), the Gallery / Book
    buttons and the #burger button (also wired in effects.js).

    Used-by (breadcrumb up): App (src/App.jsx) — seventh top-level
    sibling in the outer fragment, after IconDefs, before MobileSheet.

    Contains (breadcrumb down): <header#nav> > .wrap.nav-in > NavLogo
    (src/components/chrome/Nav/Logo/index.jsx) + nav.menu (2 x
    NavDropdown (src/components/chrome/Nav/Dropdown/index.jsx) with
    .drop#d1/#d2 + plain Membership link) + .nav-end (Gallery / Book /
    Burger (src/components/chrome/Nav/Burger/index.jsx)).
    ════════════════════════════════════════════════════════════ */}

import NavLogo from './Logo';
import NavDropdown from './Dropdown';
import Burger from './Burger';

export default function Nav() {
  return (
    <header className="nav" id="nav">
      <div className="wrap nav-in">
        <NavLogo />

        <nav className="menu" aria-label="Main">
          <NavDropdown id="d1" label="Treatments">
            <a href="#treatments"><span className="gi"><svg viewBox="0 0 24 24"><use href="#i-hands"/></svg></span><span><b>Massage & recovery</b><span>Sports, deep tissue, prenatal, travel</span></span></a>
            <a href="#heat"><span className="gi"><svg viewBox="0 0 24 24"><use href="#i-heat"/></svg></span><span><b>Sauna & cold plunge</b><span>Contrast therapy by the hour</span></span></a>
            <a href="#movement"><span className="gi"><svg viewBox="0 0 24 24"><use href="#i-move"/></svg></span><span><b>Yoga & mobility</b><span>Slow flow, restore, mobility</span></span></a>
          </NavDropdown>
          <NavDropdown id="d2" label="Fuel Lab">
            <a href="#fuel-menu"><span className="gi"><svg viewBox="0 0 24 24"><use href="#i-leaf"/></svg></span><span><b>The board</b><span>Full menu and pricing</span></span></a>
          </NavDropdown>
          <div className="menu-item"><a href="#membership">Membership</a></div>
        </nav>

        <div className="nav-end">
          <a className="btn btn-plain" href="#gallery">Gallery</a>
          <a className="btn btn-fill" href="#book">Book</a>
          <Burger />
        </div>
      </div>
    </header>
  );
}
