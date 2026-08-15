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

   TWEEN WIRING — this component is the motion driver; the CSS owns the
   easing. The stylist's sticker.css defines three state poses on
   #sticker:
     · default (no class) = hidden pre-entrance pose
     · .in                = visible resting pose (entrance target)
     · .in.entered        = post-walkthrough evolution (additive)
   Two effects toggle those classes at the right moments:
     · mount entrance: request `.in` on the first animation frame so the
       browser paints the hidden pose first, then the CSS transition
       tweens the sticker into place.
     · entered flip: when the `entered` prop becomes true, add `.entered`
       on top of `.in` (kept) so the sticker tweens to its entered pose.
   prefers-reduced-motion skips the rAF deferral and applies `.in`
   synchronously — the CSS reduced-motion block snaps it visible, so
   there is no dead pre-entrance state.

   Styles live in styles/sticker.css (the #sticker rules).
   ===================================================================== */

import { useEffect, useRef } from 'react';
import '../styles/sticker.css';

/* ── 01 ── the promotion (edit here to change the campaign) ────────── */
const PROMO = 'NEW';            // the loud word
const PROMO_SUB = 'React Overlay'; // the supporting line

export default function Sticker({ entered = false }) {
  /* root ref so the two tween effects can flip classes imperatively —
     no DOM queries, no re-render, no setState */
  const rootRef = useRef(null);

  /* ── 02 ── mount entrance: hidden pose → `.in` on the first frame ── */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    // Reduced-motion guard. jsdom/older engines may lack matchMedia, so
    // only read it when available — absent ⇒ treat as motion-ok.
    const mq = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    const reducedMotion = !!(mq && mq.matches);

    if (reducedMotion) {
      // Snap straight to the resting pose — the CSS reduced-motion block
      // already forces it visible, so there is no tween to defer for.
      el.classList.add('in');
      return;
    }

    // Normal path: paint the hidden pre-entrance pose first, then flip
    // `.in` on the next frame so the CSS transition drives the tween.
    const raf = window.requestAnimationFrame(() => el.classList.add('in'));
    return () => window.cancelAnimationFrame(raf);   // no dangling rAF
  }, []);

  /* ── 03 ── entered flip: `.in.entered` once the walkthrough starts ── */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    // Additive on `.in` — toggle keeps the pair in sync both directions.
    el.classList.toggle('entered', !!entered);
  }, [entered]);

  return (
    <div id="sticker" ref={rootRef} aria-label={`${PROMO} · ${PROMO_SUB}`}>
      <span className="sticker-dot" aria-hidden="true" />
      <span className="sticker-promo">{PROMO}</span>
      <span className="sticker-sub">{PROMO_SUB}</span>
    </div>
  );
}
