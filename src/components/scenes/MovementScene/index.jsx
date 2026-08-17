{/* ════════════════════════════════════════════════════════════
    MovementScene
    Renders: the MOVEMENT scroll scene (yoga tuesday) — the tilted
    art card (ArtCard), the eyebrow / YOGA TUESDAY ticker, description,
    chips and schedule link. The base64 texture lives in ArtCard
    (byte-identical to the original App.jsx line — do not reformat).

    Used-by (breadcrumb up): App (src/App.jsx) — rendered inside
    <main className="deck scene-run" id="top"> after GalleryScene,
    before HeatScene (4th plain scene; DOM order must stay put).

    Contains (breadcrumb down): <section id="movement" class="scene"
    data-bg="#FFFFFF" data-ink="dark"> > .wrap.scene-in > ArtCard
    (src/components/scenes/MovementScene/ArtCard/index.jsx) + .eyebrow
    + h2.ticker YOGA/TUESDAY + p + .chips + a.tlink.
    ════════════════════════════════════════════════════════════ */}

import ArtCard from './ArtCard';

export default function MovementScene() {
  return (
    /* MOVEMENT */
    <section className="scene" data-bg="#FFFFFF" data-ink="dark" id="movement">
      <div className="wrap scene-in">
        <ArtCard />
        <p className="eyebrow"><svg viewBox="0 0 24 24"><use href="#i-move"/></svg>Movement</p>
        <h2 className="ticker">
          <span className="sr-only">Yoga that respects your Tuesday.</span>
          <span className="line"><span className="word">Restore</span></span>
          <span className="line"><span className="word">Movement!</span></span>
        </h2>
        <p>Slow flow, restorative and mobility labs in a calm, bright room. No mirrors, no leaderboard, no one calling out your name. Mats and props are stocked; just bring yourself.</p>
        <div className="chips"><span className="chip">Slow flow</span><span className="chip">Restore</span><span className="chip">Mobility lab</span><span className="chip">Breathwork</span></div>
        <a className="tlink" href="#book">See the schedule <svg viewBox="0 0 24 24"><use href="#i-chev"/></svg></a>
      </div>
    </section>
  );
}
