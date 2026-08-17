{/* ════════════════════════════════════════════════════════════
    TrustPill
    Renders: one trust fact pill — a small 24px icon + a bold stat
    + trailing label. The icon id, bold term and remainder come from
    props so all four facts share one markup shape.

    Used-by (breadcrumb up): TrustScene/pills
    (src/components/scenes/TrustScene/pills/index.jsx) — one instance
    per trust fact, direct children of the .trust row.

    Contains (breadcrumb down): <div> > svg (use#i-*) + b + text.
    ════════════════════════════════════════════════════════════ */}

export default function TrustPill({ icon, bold, rest }) {
  return (
    <div><svg viewBox="0 0 24 24"><use href={icon}/></svg><b>{bold}</b>{rest}</div>
  );
}
