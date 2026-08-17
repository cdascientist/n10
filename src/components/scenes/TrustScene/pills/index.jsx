{/* ════════════════════════════════════════════════════════════
    TrustPills
    Renders: the .trust row of four trust-fact pills on the purple
    cover page (licensed therapists / 190° infrared / 42° plunge /
    6a–10p daily).

    Used-by (breadcrumb up): TrustScene
    (src/components/scenes/TrustScene/index.jsx) — the only child of
    .wrap.scene-in on page 3.

    Contains (breadcrumb down): <div.trust> > 4 x TrustPill
    (src/components/scenes/TrustScene/pills/TrustPill.jsx).
    ════════════════════════════════════════════════════════════ */}

import TrustPill from './TrustPill';

export default function TrustPills() {
  return (
    <div className="trust">
      {/* <TrustPill icon="#i-shield" bold="Licensed" rest=" therapists" />
      <TrustPill icon="#i-heat" bold="190°" rest=" infrared" />
      <TrustPill icon="#i-cold" bold="42°" rest=" plunge" />
      <TrustPill icon="#i-clock" bold="6a–10p" rest=" daily" /> */}
    </div>
  );
}
