{/* ════════════════════════════════════════════════════════════
    HeatScene
    Renders: the HEAT scroll scene (190° / DON'T) — the tilted art
    card (ArtCard), the eyebrow / 190° DON'T ticker, description,
    chips and reserve link. The base64 texture lives in ArtCard
    (byte-identical to the original App.jsx line — do not reformat).

    Used-by (breadcrumb up): App (src/App.jsx) — rendered inside
    <main className="deck scene-run" id="top"> after MovementScene,
    before MembershipScene (5th plain scene; DOM order must stay put).

    Contains (breadcrumb down): <section id="heat" class="scene"
    data-bg="#FFFFFF" data-ink="dark"> > .wrap.scene-in > ArtCard
    (src/components/scenes/HeatScene/ArtCard/index.jsx) + .eyebrow +
    h2.ticker 190°/DON'T + p + .chips + a.tlink.
    ════════════════════════════════════════════════════════════ */}

import ArtCard from './ArtCard';

export default function HeatScene() {
  return (
    /* HEAT */
    <section className="scene" data-bg="#FFFFFF" data-ink="dark" id="heat">
      <div className="wrap scene-in">
        <ArtCard />
        <p className="eyebrow"><svg viewBox="0 0 24 24"><use href="#i-heat"/></svg>Heat & cold</p>
        <h2 className="ticker">
          <span className="sr-only">Sit at 190°. Then don't.</span>
          <span className="line"><span className="word">190°</span></span>
          <span className="line"><span className="word">DON'T</span></span>
        </h2>
        <p>Full-spectrum infrared cabins next to a 42° plunge, so you can run real contrast cycles instead of guessing. Towels, robes and cold eucalyptus cloths are already in the room.</p>
        <div className="chips"><span className="chip">Infrared cabin</span><span className="chip">42° plunge</span><span className="chip">Contrast cycles</span></div>
        <a className="tlink" href="#book">Reserve heat time <svg viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
      </div>
    </section>
  );
}
