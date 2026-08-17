{/* ════════════════════════════════════════════════════════════
    MenuPane
    Renders: one .pane menu panel — the .mrow rows (icon chip .mi,
    name .nm, ingredients .ing, price .pr) driven by a rows prop.
    Hidden panes carry the hidden attribute (effects.js toggles the
    active pane on tab click). Rows render as a keyed array, so the
    pane holds adjacent .mrow divs — byte-identical to the inline
    original.

    Used-by (breadcrumb up): BoardScene (src/components/scenes/
    BoardScene/index.jsx) — four of these inside .screen, after
    SegTabs (Performance / Recovery / Organic / Hydration).

    Contains (breadcrumb down): <div.pane[data-pane][hidden?]> > n x
    <div.mrow> (mi + mt{nr} + pr).
    ════════════════════════════════════════════════════════════ */}

export default function MenuPane({ dataPane, hidden, rows }) {
  return (
    <div className="pane" data-pane={dataPane} hidden={hidden}>
      {rows.map((r) => (
        <div className="mrow" key={r.name}>
          <span className="mi"><svg viewBox="0 0 24 24"><use href={r.icon}/></svg></span>
          <span className="mt"><span className="nm">{r.name}</span><span className="ing">{r.ing}</span></span>
          <span className="pr">{r.price}</span>
        </div>
      ))}
    </div>
  );
}
