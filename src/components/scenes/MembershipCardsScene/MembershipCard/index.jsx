{/* ════════════════════════════════════════════════════════════
    MembershipCard
    Renders: one .card in the membership grid. Two shapes share this
    component — photo cards (bgSrc → .bg img + tone + fade) and
    metric cards (.metric data-count counter, optional data-suffix,
    animated by effects.js). The bold h3 title appears on the photo /
    wide cards; the last <p> carries an inline marginTop on the metric
    cards. All copy + attributes come from props so the rendered DOM
    is byte-identical to the inline original.

    Used-by (breadcrumb up): MembershipCardsScene
    (src/components/scenes/MembershipCardsScene/index.jsx) — five
    instances, direct children of the .grid.

    Contains (breadcrumb down): <div.card> > ?(.bg), .ico (svg
    use#i-*), p.kicker, ?(h3), ?(.metric[data-count][data-suffix]),
    p.
    ════════════════════════════════════════════════════════════ */}

export default function MembershipCard({ className, bgSrc, icon, kicker, title, metric, suffix, text, style }) {
  return (
    <div className={className}>
      {bgSrc && (
        <div className="bg"><img className="shot" src={bgSrc} alt="" aria-hidden="true" decoding="sync" referrerPolicy="no-referrer" /><span className="tone"></span><span className="fade"></span></div>
      )}
      <div className="ico"><svg viewBox="0 0 24 24"><use href={icon}/></svg></div>
      <p className="kicker">{kicker}</p>
      {title && <h3>{title}</h3>}
      {metric && (
        <div className="metric" data-count={metric} data-suffix={suffix}>0</div>
      )}
      <p style={style}>{text}</p>
    </div>
  );
}
