{/* ════════════════════════════════════════════════════════════
    IntroScene
    Renders: page 2 — the half-hold glass panel (panel--hold):
    #holdTint glass layer, .hero-halo glow, the "Tension in. /
    Tension out." headline, the Book CTA row and the hero sub-copy.

    Used-by (breadcrumb up): App (src/App.jsx) — rendered inside the
    .cover-stack div as the SECOND cover child (hero → intro → trust).

    Contains (breadcrumb down): <section id="intro" class="scene panel
    panel--hold" data-bg="#FFFFFF" data-ink="dark"> > #holdTint +
    .hero-halo + .wrap.scene-in (Headline, CTARow, HeroSub — each
    src/components/scenes/IntroScene/<Name>/index.jsx).
    ════════════════════════════════════════════════════════════ */}

import Headline from './Headline';
import CTARow from './CTARow';
import HeroSub from './HeroSub';

export default function IntroScene() {
  return (
    /* INTRO (page 2 — half-hold glass: headline, then the selection row, then the note) */
    <section className="scene panel panel--hold" data-bg="#FFFFFF" data-ink="dark" id="intro">
      <span className="hold-tint" id="holdTint"></span>
      <div className="hero-halo"></div>
      <div className="wrap scene-in">
        <Headline />
        <CTARow />
        <HeroSub />
      </div>
    </section>
  );
}
