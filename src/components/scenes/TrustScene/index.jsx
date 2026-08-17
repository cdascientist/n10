{/* ════════════════════════════════════════════════════════════
    TrustScene
    Renders: page 3 — the purple cover page (panel--cover, 70%
    transparent, slides over the first pages): four trust facts
    (licensed therapists, 190° infrared, 42° plunge, 6a–10p daily).

    Used-by (breadcrumb up): App (src/App.jsx) — rendered inside the
    .cover-stack div as the THIRD cover child (hero → intro → trust).

    Contains (breadcrumb down): <section id="trust" class="scene panel
    panel--cover" data-bg="#8B2BFF" data-ink="light" data-cover="true">
    > .wrap.scene-in > TrustPills
    (src/components/scenes/TrustScene/pills/index.jsx).
    ════════════════════════════════════════════════════════════ */}

import TrustPills from './pills';

export default function TrustScene() {
  return (
    /* TRUST (page 3 — the purple page, 70% transparent, slides over the first pages) */
    <section className="scene panel panel--cover" data-bg="#8B2BFF" data-ink="light" data-cover="true" id="trust">
      <div className="wrap scene-in">
        <TrustPills />
      </div>
    </section>
  );
}
