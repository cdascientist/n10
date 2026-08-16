{/* ════════════════════════════════════════════════════════════
    PromoSticker
    Renders: the fixed bottom-right promo badge (#sticker). Copy is
    driven by the STICKER_COPY constants in the script block; the
    text below is the no-JS fallback. pointer-events:none — pure
    signage, never blocks clicks. Springs in when reveal() fires,
    then idles on a slow float.

    Used-by (breadcrumb up): App (src/App.jsx) — fourth top-level
    sibling in the outer fragment, after Preloader.

    Contains (breadcrumb down): #sticker > .st-in > .st-dot + .st-txt
    (NEW / FOUNDING MEMBERS).
    ════════════════════════════════════════════════════════════ */}

export default function PromoSticker() {
  return (
    /* ═══ PROMO STICKER — fixed bottom-right badge. Copy is driven by the
       STICKER_COPY constants in the script block; the text below is the
       no-JS fallback. It springs in when reveal() fires, then idles on a
       slow float. pointer-events:none — pure signage, never blocks clicks. ═══ */
    <div id="sticker" aria-label="NEW · FOUNDING MEMBERS">
      <span className="st-in">
        <span className="st-dot" aria-hidden="true"></span>
        <span className="st-txt">
          <span className="st-word">NEW</span>
          <span className="st-sub">FOUNDING MEMBERS</span>
        </span>
      </span>
    </div>
  );
}
