{/* ════════════════════════════════════════════════════════════
    TrustScene
    Renders: page 3 — the purple cover page (panel--cover, 70%
    transparent, slides over the first pages): four trust facts
    (licensed therapists, 190° infrared, 42° plunge, 6a–10p daily).

    Used-by (breadcrumb up): App (src/App.jsx) — rendered inside the
    .cover-stack div as the THIRD cover child (hero → intro → trust).

    Contains (breadcrumb down): <section id="trust" class="scene panel
    panel--cover" data-bg="#8B2BFF" data-ink="light" data-cover="true">
    > .wrap.scene-in > .trust (4 x div: i-shield / i-heat / i-cold /
    i-clock).
    ════════════════════════════════════════════════════════════ */}

export default function TrustScene() {
  return (
    /* TRUST (page 3 — the purple page, 70% transparent, slides over the first pages) */
    <section className="scene panel panel--cover" data-bg="#8B2BFF" data-ink="light" data-cover="true" id="trust">
      <div className="wrap scene-in">
        <div className="trust">
          <div><svg viewBox="0 0 24 24"><use href="#i-shield"/></svg><b>Licensed</b> therapists</div>
          <div><svg viewBox="0 0 24 24"><use href="#i-heat"/></svg><b>190°</b> infrared</div>
          <div><svg viewBox="0 0 24 24"><use href="#i-cold"/></svg><b>42°</b> plunge</div>
          <div><svg viewBox="0 0 24 24"><use href="#i-clock"/></svg><b>6a–10p</b> daily</div>
        </div>
      </div>
    </section>
  );
}
