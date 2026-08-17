{/* ════════════════════════════════════════════════════════════
    SkipIntroLink
    Renders: the intro skip link (Mechanic 6) — a visually-hidden
    anchor shown while the intro timeline runs; clicking it bails
    out of the intro scrub.

    Used-by (breadcrumb up): App (src/App.jsx) — second top-level
    sibling in the outer fragment, after BackgroundCanvas.

    Contains (breadcrumb down): the single <a className="skip-intro"
    id="skipIntro"> anchor. Nothing else.
    ════════════════════════════════════════════════════════════ */}

export default function SkipIntroLink() {
  return (
    /* intro skip link (Mechanic 6) — shown while the intro timeline runs */
    <a className="skip-intro" id="skipIntro" href="#skipIntro">Skip animation</a>
  );
}
