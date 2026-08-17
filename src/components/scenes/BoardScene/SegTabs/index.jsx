{/* ════════════════════════════════════════════════════════════
    SegTabs
    Renders: the segmented tab row — #segbar (the sliding indicator
    animated by effects.js) plus the four Fuel Lab tab buttons
    (role=tablist; aria-selected and data-tab toggling wired by
    effects.js).

    Used-by (breadcrumb up): BoardScene (src/components/scenes/
    BoardScene/index.jsx) — first child of .screen, before the panes.

    Contains (breadcrumb down): <div.seg-wrap> > <div.seg
    role=tablist> > i#segbar + 4 x button[role=tab][data-tab].
    ════════════════════════════════════════════════════════════ */}

export default function SegTabs() {
  return (
    <div className="seg-wrap">
      <div className="seg" role="tablist" aria-label="Fuel Lab menu">
        <i id="segbar"></i>
        <button role="tab" aria-selected="true" data-tab="0">Performance</button>
        <button role="tab" aria-selected="false" data-tab="1">Recovery</button>
        <button role="tab" aria-selected="false" data-tab="2">Organic</button>
        <button role="tab" aria-selected="false" data-tab="3">Hydration</button>
      </div>
    </div>
  );
}
