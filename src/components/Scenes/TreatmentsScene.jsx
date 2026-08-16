{/* ════════════════════════════════════════════════════════════
    TreatmentsScene (Sports Recovery)
    Renders: the massage treatments menu — SPORTS RECOVERY headline
    ("Recover Hard. Come Back Strong.") plus five modality cards
    (Deep Tissue / Swedish / Trigger Point Therapy / Prenatal /
    Travel), each with a tagline + description. Client copy v18.8.

    Used-by (breadcrumb up): App (src/App.jsx) — inside <main
    class="deck scene-run">, immediately after TrustScene (the purple
    cover), before GalleryScene.

    Contains (breadcrumb down): <section#treatments class="scene"
    data-bg="#FFFFFF" data-ink="dark"> > .wrap.scene-in (eyebrow,
    ticker SPORTS/RECOVERY, lead para) + .treat-grid (5 x .treat
    cards: .ico + h3 + .tag tagline + p description).
    ════════════════════════════════════════════════════════════ */}

export default function TreatmentsScene() {
  return (
    <section className="scene" data-bg="#FFFFFF" data-ink="dark" id="treatments">
      <div className="wrap scene-in">
        {/* eyebrow — treatments menu label */}
        <p className="eyebrow"><svg viewBox="0 0 24 24"><use href="#i-hands"/></svg>Treatments</p>

        {/* ticker headline — SPORTS RECOVERY (masked reveal, Mechanic 3) */}
        <h2 className="ticker">
          <span className="sr-only">Sports recovery</span>
          <span className="line"><span className="word">SPORTS</span></span>
          <span className="line"><span className="word">RECOVERY</span></span>
        </h2>

        {/* lead — the section tagline + summary copy */}
        <p><b>Recover Hard. Come Back Strong.</b> Performance-focused massage for active bodies, helping reduce muscle tension, improve mobility, and support recovery.</p>

        {/* modality cards — five treatments, tagline + description each */}
        <div className="treat-grid">
          <div className="treat">
            <span className="ico"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-bolt"/></svg></span>
            <h3>Deep Tissue</h3>
            <p className="tag">Go Deeper. Move Better.</p>
            <p>Deeper, focused pressure targets stubborn muscle tension, tightness, and restricted areas.</p>
          </div>

          <div className="treat">
            <span className="ico"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-hands"/></svg></span>
            <h3>Swedish</h3>
            <p className="tag">Relax. Reset. Recharge.</p>
            <p>Smooth, flowing massage designed to reduce stress, ease tension, and promote full-body relaxation.</p>
          </div>

          <div className="treat">
            <span className="ico"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-spark"/></svg></span>
            <h3>Trigger Point Therapy</h3>
            <p className="tag">Target the Tension.</p>
            <p>Focused pressure targets tight, sensitive areas that may contribute to pain, tension, and restricted movement.</p>
          </div>

          <div className="treat">
            <span className="ico"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-leaf"/></svg></span>
            <h3>Prenatal</h3>
            <p className="tag">Comfort for a Changing Body.</p>
            <p>Supportive massage designed to ease pregnancy-related tension, promote relaxation, and improve overall comfort.</p>
          </div>

          <div className="treat">
            <span className="ico"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-arrow"/></svg></span>
            <h3>Travel</h3>
            <p className="tag">InTension Comes to You.</p>
            <p>Mobile massage for private sessions, athletic events, wellness events, competitions, and special gatherings.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
