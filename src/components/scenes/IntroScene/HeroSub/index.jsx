{/* ════════════════════════════════════════════════════════════
    HeroSub
    Renders: the page-2 hero sub-copy paragraph (p.hero-sub) — the
    one-line pitch for what the building holds.

    Used-by (breadcrumb up): IntroScene (src/components/scenes/
    IntroScene/index.jsx) — third child of .wrap.scene-in, after the
    CTA row.

    Contains (breadcrumb down): <p.hero-sub> — the intro copy text.
    ════════════════════════════════════════════════════════════ */}

export default function HeroSub() {
  return (
    <p className="hero-sub">Swedish massage, infrared heat, cold water, movement and a fuel bar — all in one bright, quiet building. Ninety minutes here undoes a whole week out there.</p>
  );
}
