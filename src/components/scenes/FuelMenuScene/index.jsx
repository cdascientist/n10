{/* ════════════════════════════════════════════════════════════
    FuelMenuScene
    Renders: the FUEL LAB board head scene — the eyebrow / THE BOARD
    ticker and the placeholder-pricing note that introduces the
    interactive menu tabs (BoardScene, which immediately follows).

    Used-by (breadcrumb up): App (src/App.jsx) — rendered inside
    <main className="deck scene-run" id="top"> after
    MembershipCardsScene, before BoardScene (8th plain scene).

    Contains (breadcrumb down): <section id="fuel-menu" class="scene"
    data-bg="#FFFFFF" data-ink="dark"> > .wrap.scene-in > .eyebrow +
    h2.ticker THE/BOARD + p.
    ════════════════════════════════════════════════════════════ */}

export default function FuelMenuScene() {
  return (
    /* BOARD */
    <section className="scene" data-bg="#FFFFFF" data-ink="dark" id="fuel-menu">
      <div className="wrap scene-in">
          <p className="eyebrow"><svg viewBox="0 0 24 24"><use href="#i-leaf"/></svg>Fuel Lab</p>
          <h2 className="ticker">
            <span className="sr-only">The board</span>
            <span className="line"><span className="word">THE</span></span>
            <span className="line"><span className="word">BOARD</span></span>
          </h2>
          <p>Prices are placeholders until your POS is wired in.</p>
      </div>
    </section>
  );
}
