/* =====================================================================
   Sticker.jsx — promotional sticker (top-centre of the first page)
   ---------------------------------------------------------------------
   A small always-visible promo badge pinned to the top edge of the
   page. It sits ABOVE every layer (z-index 300 > boot 100, deck 200)
   so it is the very first thing a visitor sees — on the preloader
   screen and once the walkthrough starts.

   • pill shape, slight tilt — reads as a sticker, not a panel
   • neon-violet border + glow from the global design tokens
   • pointer-events: none — it is pure signage, never blocks clicks
   • copy is driven by the two constants below so it is trivial to
     repoint the promotion (text / sub-text) without touching markup

   Styles live in styles/sticker.css (the #sticker rules).
   ===================================================================== */

import '../styles/sticker.css';

/* ── 01 ── the promotion (edit here to change the campaign) ────────── */
const PROMO = 'NEW';            // the loud word
const PROMO_SUB = 'React Overlay'; // the supporting line

export default function Sticker() {
  return (
    <div id="sticker" aria-label={`${PROMO} · ${PROMO_SUB}`}>
      <span className="sticker-dot" aria-hidden="true" />
      <span className="sticker-promo">{PROMO}</span>
      <span className="sticker-sub">{PROMO_SUB}</span>
    </div>
  );
}
