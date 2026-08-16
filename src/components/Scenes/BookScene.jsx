{/* ════════════════════════════════════════════════════════════
    BookScene
    Renders: the BOOK scroll scene (purple page) — full-bleed photo
    with .close-in crop, veil, the COME / LEAVE ticker, booking copy
    and the Book / Join the club CTA row.

    Used-by (breadcrumb up): App (src/App.jsx) — rendered inside
    <main className="deck scene-run" id="top"> after BoardScene,
    directly before </main> (10th plain scene, last).

    Contains (breadcrumb down): <section id="book" class="scene"
    data-bg="#8B2BFF" data-ink="light"> > .wrap.scene-in > .close-in
    (img + .veil + .inner: .eyebrow, h2.ticker COME/LEAVE, p, .cta-row).
    ════════════════════════════════════════════════════════════ */}

export default function BookScene() {
  return (
    /* BOOK */
    <section className="scene" data-bg="#8B2BFF" data-ink="light" id="book">
      <div className="wrap scene-in">
        <div className="close-in">
          <img src="https://images.unsplash.com/photo-1741552205317-817c8c9a4016?fm=jpg&q=76&w=1800&auto=format&fit=crop" alt="" aria-hidden="true" decoding="sync" referrerPolicy="no-referrer" />
          <div className="veil"></div>
          <div className="inner">
            <p className="eyebrow"><svg viewBox="0 0 24 24"><use href="#i-spark"/></svg>Book</p>
            <h2 className="ticker">
              <span className="sr-only">Come in wound up. Leave unrecognisable.</span>
              <span className="line"><span className="word">COME</span></span>
              <span className="line"><span className="word">LEAVE</span></span>
            </h2>
            <p>Pick a table, a cabin, a mat or all three. First-timers get a fifteen-minute intake so your therapist knows what they are working with.</p>
            <div className="cta-row">
              <a className="btn btn-fill mag" href="#book">Book a session <svg className="arw" viewBox="0 0 24 24"><use href="#i-arrow"/></svg></a>
              <a className="btn btn-tint mag" href="#membership">Join the club</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
