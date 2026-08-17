{/* ════════════════════════════════════════════════════════════
    Nav
    Renders: the fixed site header (#nav) — logo (black-purple
    #mark-bp), the "Treatments" dropdown menu (#d1, with aria-expanded
    toggling owned by effects.js), the Gallery button and the #burger
    button (also wired in effects.js).

    Used-by (breadcrumb up): App (src/App.jsx) — seventh top-level
    sibling in the outer fragment, after IconDefs, before MobileSheet.

    Contains (breadcrumb down): <header#nav> > .wrap.nav-in > NavLogo
    (src/components/chrome/Nav/Logo/index.jsx) + nav.menu (one
    NavDropdown#d1 — src/components/chrome/Nav/Dropdown/index.jsx) +
    .nav-end (Gallery / Burger —
    src/components/chrome/Nav/Burger/index.jsx).
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
            <a href="#movement"><span className="gi"><svg viewBox="0 0 24 24"><use href="#i-move"/></svg></span><span><b>Yoga & mobility</b><span>Slow flow, restore, mobility</span></span></a>
          </NavDropdown>
        </nav>

        <div className="nav-end">
          <a className="btn btn-plain" href="#gallery">Gallery</a>
          <Burger />
        </div>
      </div>
    </header>
  );
}
