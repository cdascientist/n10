{/* ════════════════════════════════════════════════════════════
    TreatCard
    Renders: one .treat modality card — an icon chip (.ico), the
    treatment name (h3), a tagline (p.tag) and the description (p).
    Icon id + copy come from props so the five SPORTS RECOVERY cards
    share one markup shape.

    Used-by (breadcrumb up): TreatmentsScene
    (src/components/scenes/TreatmentsScene/index.jsx) — one instance
    per modality, direct children of the .treat-grid.

    Contains (breadcrumb down): <div.treat> > span.ico (svg use#i-*)
    + h3 + p.tag + p.
    ════════════════════════════════════════════════════════════ */}

export default function TreatCard({ icon, title, tag, desc }) {
  return (
    <div className="treat">
      <span className="ico"><svg viewBox="0 0 24 24" aria-hidden="true"><use href={icon}/></svg></span>
      <h3>{title}</h3>
      <p className="tag">{tag}</p>
      <p>{desc}</p>
    </div>
  );
}
