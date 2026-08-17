{/* ════════════════════════════════════════════════════════════
    HeroBackground
    Renders: the .hero-bg block of page 1 — two full-bleed hero
    photos (one preload-priority, one "alt" crossfade) plus the white
    veil layers #heroVeil and #heroVeilW. The white layer (#heroVeilW)
    is owned by ONE scrubbed GSAP timeline (v18.2 fix — see CLAUDE.md).

    Used-by (breadcrumb up): HeroScene (src/components/scenes/
    HeroScene/index.jsx) — first child of section#hero, before
    LargeLogo.

    Contains (breadcrumb down): <div.hero-bg> > img.shot +
    img.shot.alt + span.veil#heroVeil + span.veil-w#heroVeilW.
    ════════════════════════════════════════════════════════════ */}

export default function HeroBackground() {
  return (
    <div className="hero-bg">
      <img className="shot" src="https://images.unsplash.com/photo-1741522509438-a120c0bb5e88?fm=jpg&q=76&w=1800&auto=format&fit=crop" alt="" aria-hidden="true" fetchpriority="high" decoding="sync" referrerPolicy="no-referrer" />
      <img className="shot alt" src="https://images.unsplash.com/photo-1745327883508-b6cd32e5dde5?fm=jpg&q=76&w=1800&auto=format&fit=crop" alt="" aria-hidden="true" decoding="sync" referrerPolicy="no-referrer" />
      <span className="veil" id="heroVeil"></span>
      <span className="veil-w" id="heroVeilW"></span>
    </div>
  );
}
