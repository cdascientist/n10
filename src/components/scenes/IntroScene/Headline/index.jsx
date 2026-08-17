{/* ════════════════════════════════════════════════════════════
    Headline
    Renders: the page-2 headline — "Tension in. / Tension out." as
    two masked .ln lines (the <em> carries the italic accent). The
    line reveal is a Mechanic-3 style scrub owned by effects.js.

    Used-by (breadcrumb up): IntroScene (src/components/scenes/
    IntroScene/index.jsx) — first child of .wrap.scene-in.

    Contains (breadcrumb down): <h1> > 2 x span.ln (i / i>em).
    ════════════════════════════════════════════════════════════ */}

export default function Headline() {
  return (
    <h1>
      <span className="ln"><i>Tension in.</i></span>
      <span className="ln"><i><em>Tension out.</em></i></span>
    </h1>
  );
}
