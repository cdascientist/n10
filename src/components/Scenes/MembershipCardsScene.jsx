{/* ════════════════════════════════════════════════════════════
    MembershipCardsScene
    Renders: the membership card grid (no id header — it is the
    continuation of #membership): five tilted cards mixing photo
    cards (.wide.rv with .bg img + tone + fade) and metric cards
    (.rv.d-1..d-4 with .metric data-count counters animated by
    effects.js).

    Used-by (breadcrumb up): App (src/App.jsx) — rendered inside
    <main className="deck scene-run" id="top"> after MembershipScene,
    before FuelMenuScene (7th plain scene; DOM order stays).

    Contains (breadcrumb down): <section id="membership-cards"
    class="scene" data-bg="#FFFFFF" data-ink="dark"> > .wrap.scene-in
    > .grid (5 x .card: wide.rv.tilt, rv.d-1.tilt, rv.d-2.tilt,
    rv.d-3.tilt, wide.rv.d-4.tilt).
    ════════════════════════════════════════════════════════════ */}

export default function MembershipCardsScene() {
  return (
    <section className="scene" data-bg="#FFFFFF" data-ink="dark" id="membership-cards">
      <div className="wrap scene-in">
        <div className="grid">
          <div className="card wide rv tilt">
            <div className="bg"><img className="shot" src="https://images.unsplash.com/photo-1696841212541-449ca29397cc?fm=jpg&q=76&w=1200&auto=format&fit=crop" alt="" aria-hidden="true" decoding="sync" referrerpolicy="no-referrer" /><span className="tone"></span><span className="fade"></span></div>
            <div className="ico"><svg viewBox="0 0 24 24"><use href="#i-hands"/></svg></div>
            <p className="kicker">Same hands, every time</p>
            <h3>Your therapist is assigned, not rotated</h3>
            <p>They keep notes on your shoulders, your hips, and the pressure you actually like — so session four starts where session three ended.</p>
          </div>

          <div className="card rv d-1 tilt">
            <div className="ico"><svg viewBox="0 0 24 24"><use href="#i-spark"/></svg></div>
            <p className="kicker">Credits per month</p>
            <div className="metric" data-count="6">0</div>
            <p style={{marginTop:10}}>Spend them on any table, cabin, class or pour. Unused credits roll one month.</p>
          </div>

          <div className="card rv d-2 tilt">
            <div className="ico"><svg viewBox="0 0 24 24"><use href="#i-clock"/></svg></div>
            <p className="kicker">Quiet hours</p>
            <div className="metric" data-count="14" data-suffix="/wk">0</div>
            <p style={{marginTop:10}}>Members-only blocks each week with half the floor and no walk-ins.</p>
          </div>

          <div className="card rv d-3 tilt">
            <div className="bg"><img className="shot" src="https://images.unsplash.com/photo-1730207375825-d734728f877e?fm=jpg&q=76&w=1200&auto=format&fit=crop" alt="" aria-hidden="true" decoding="sync" referrerpolicy="no-referrer" /><span className="tone"></span><span className="fade"></span></div>
            <div className="ico"><svg viewBox="0 0 24 24"><use href="#i-lock"/></svg></div>
            <p className="kicker">Phone policy</p>
            <h3>Screens stay in the locker</h3>
            <p>It is how the floor stays quiet. Lockers are on the way in, and the desk will hold anything you are waiting on.</p>
          </div>

          <div className="card wide rv d-4 tilt">
            <div className="ico"><svg viewBox="0 0 24 24"><use href="#i-shield"/></svg></div>
            <p className="kicker">Included, not upsold</p>
            <h3>Robes, towels, sandals, eucalyptus, showers</h3>
            <p>Everything you need is already in the room and already in the price. There is no retail cart at the end of your massage.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
