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
    > .grid (5 x MembershipCard —
    src/components/scenes/MembershipCardsScene/MembershipCard/index.jsx).
    ════════════════════════════════════════════════════════════ */}

import MembershipCard from './MembershipCard';

export default function MembershipCardsScene() {
  return (
    <section className="scene" data-bg="#FFFFFF" data-ink="dark" id="membership-cards">
      <div className="wrap scene-in">
        <div className="grid">
          <MembershipCard className="card wide rv tilt" bgSrc="https://images.unsplash.com/photo-1696841212541-449ca29397cc?fm=jpg&q=76&w=1200&auto=format&fit=crop" icon="#i-hands" kicker="Same hands, every time" title="Your therapist is assigned, not rotated" text="They keep notes on your shoulders, your hips, and the pressure you actually like — so session four starts where session three ended." />

          <MembershipCard className="card rv d-1 tilt" icon="#i-spark" kicker="Credits per month" metric="6" text="Spend them on any table, cabin, class or pour. Unused credits roll one month." style={{marginTop:10}} />

          <MembershipCard className="card rv d-2 tilt" icon="#i-clock" kicker="Quiet hours" metric="14" suffix="/wk" text="Members-only blocks each week with half the floor and no walk-ins." style={{marginTop:10}} />

          <MembershipCard className="card rv d-3 tilt" bgSrc="https://images.unsplash.com/photo-1730207375825-d734728f877e?fm=jpg&q=76&w=1200&auto=format&fit=crop" icon="#i-lock" kicker="Phone policy" title="Screens stay in the locker" text="It is how the floor stays quiet. Lockers are on the way in, and the desk will hold anything you are waiting on." />

          <MembershipCard className="card wide rv d-4 tilt" icon="#i-shield" kicker="Included, not upsold" title="Robes, towels, sandals, eucalyptus, showers" text="Everything you need is already in the room and already in the price. There is no retail cart at the end of your massage." />
        </div>
      </div>
    </section>
  );
}
