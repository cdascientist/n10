{/* ════════════════════════════════════════════════════════════
    Footer
    Renders: the site footer (.foot) — brand block (logo, tagline,
    licensed badge), the three link columns (Treatments / Fuel Lab /
    Club), opening hours and the legal row.

    Used-by (breadcrumb up): App (src/App.jsx) — last top-level
    sibling in the outer fragment, after </main>.

    Contains (breadcrumb down): <footer class="foot"> > .wrap >
    .foot-brand (logo + p + .badge) + .foot-grid (3 x div.grouped) +
    .hours (4 x div) + .legal (4 links + .note).
    ════════════════════════════════════════════════════════════ */}

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-brand">
          <a className="logo" href="#top">
            <svg className="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><use href="#mark"/></svg>
            <span className="logo-type"><i className="lg-in">In</i><i className="lg-ten">Tension</i></span>
          </a>
          <p>Bodywork, heat, movement and fuel — run by people who actually do the work.</p>
          <span className="badge"><svg viewBox="0 0 24 24"><use href="#i-shield"/></svg>Licensed massage establishment</span>
        </div>

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

        <div className="hours">
          <div><b>Mon – Thu</b>6:00a — 10:00p</div>
          <div><b>Fri</b>6:00a — 11:00p</div>
          <div><b>Sat – Sun</b>7:00a — 9:00p</div>
          <div><b>Quiet hours</b>Members, 6–8a</div>
        </div>

        <div className="legal">
          <a href="#top">Privacy</a><a href="#top">Terms</a><a href="#top">Accessibility</a><a href="#top">Cancellation</a>
          <span className="note">© 2026 IN/TENSION. Placeholder pricing and hours for layout purposes.</span>
        </div>
      </div>
    </footer>
  );
}
