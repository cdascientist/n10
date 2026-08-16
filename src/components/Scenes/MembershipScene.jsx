{/* ════════════════════════════════════════════════════════════
    MembershipScene
    Renders: the MEMBERSHIP scroll scene — the eyebrow / KEY ROOM
    ticker and the "one key, every room" intro copy that leads into
    the card grid (MembershipCardsScene, which immediately follows).

    Used-by (breadcrumb up): App (src/App.jsx) — rendered inside
    <main className="deck scene-run" id="top"> after HeatScene,
    before MembershipCardsScene (6th plain scene; DOM order stays).

    Contains (breadcrumb down): <section id="membership" class="scene"
    data-bg="#FFFFFF" data-ink="dark"> > .wrap.scene-in > .eyebrow +
    h2.ticker KEY/ROOM + p.
    ════════════════════════════════════════════════════════════ */}

export default function MembershipScene() {
  return (
    /* MEMBERSHIP */
    <section className="scene" data-bg="#FFFFFF" data-ink="dark" id="membership">
      <div className="wrap scene-in">
          <p className="eyebrow"><svg viewBox="0 0 24 24"><use href="#i-key"/></svg>Membership</p>
          <h2 className="ticker">
            <span className="sr-only">One key. Every room.</span>
            <span className="line"><span className="word">KEY</span></span>
            <span className="line"><span className="word">ROOM</span></span>
          </h2>
          <p>Monthly credits that spend anywhere in the building — table, cabin, mat or bar — plus the quiet hours nobody else can book.</p>
      </div>
    </section>
  );
}
