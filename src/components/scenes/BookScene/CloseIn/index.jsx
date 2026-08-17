{/* ════════════════════════════════════════════════════════════
    CloseIn
    Renders: the .close-in crop block of the booking page — the
    full-bleed photo with a .veil scrim and the .inner copy stack
    (eyebrow, COME / LEAVE ticker, booking copy, CTA row).

    Used-by (breadcrumb up): BookScene (src/components/scenes/
    BookScene/index.jsx) — the only child of .wrap.scene-in.

    Contains (breadcrumb down): <div.close-in> > img + div.veil +
    div.inner (p.eyebrow, h2.ticker, p, div.cta-row).
    ════════════════════════════════════════════════════════════ */}

export default function CloseIn() {
  return (
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
  );
}
