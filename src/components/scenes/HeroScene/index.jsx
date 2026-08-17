{/* ════════════════════════════════════════════════════════════
    HeroScene
    Renders: page 1 — the sticky base scene (panel--base, white bg):
    the full-bleed hero photos + white veil layers and the large
    centered logo.

    Used-by (breadcrumb up): App (src/App.jsx) — rendered inside the
    .cover-stack div as the FIRST cover child (hero → intro → trust).

    Contains (breadcrumb down): <section id="hero" class="scene panel
    panel--base" data-bg="#FFFFFF" data-ink="dark"> > HeroBackground
    (src/components/scenes/HeroScene/background/index.jsx) +
    LargeLogo (src/components/scenes/HeroScene/LargeLogo/index.jsx).
    ════════════════════════════════════════════════════════════ */}

import HeroBackground from './background';
import LargeLogo from './LargeLogo';

export default function HeroScene() {
  return (
    /* HERO (page 1 — sticky base: logo only, centered) */
    <section className="scene panel panel--base" data-bg="#FFFFFF" data-ink="dark" id="hero">
      <HeroBackground />
      <LargeLogo />
    </section>
  );
}
