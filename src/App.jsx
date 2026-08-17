{/* ════════════════════════════════════════════════════════════
    App — composition root
    Renders: the entire IN/TENSION scroll-scene page as one static
    React tree, importing every component and composing them in the
    exact DOM order required by the DOM CONTRACT (see CLAUDE.md).
    All scroll / interaction behaviour stays in effects.js, wired
    imperatively from main.jsx after this render.

    Used-by (breadcrumb up): main (src/main.jsx) — <App/> is the root
    element mounted under #root.

    Contains (breadcrumb down): chrome (BackgroundCanvas,
    SkipIntroLink, Preloader, PromoSticker, Warp, IconDefs, Nav,
    MobileSheet — each src/components/chrome/<Name>/index.jsx) →
    <main class="deck scene-run" id="top"> (HeroObject,
    cover-stack {HeroScene, IntroScene, TrustScene}, TreatmentsScene,
    GalleryScene, MovementScene, MembershipCardsScene — each
    src/components/scenes/<Scene>/index.jsx) → Footer
    (src/components/Footer/index.jsx).
    ════════════════════════════════════════════════════════════ */}

import BackgroundCanvas from './components/chrome/BackgroundCanvas';
import SkipIntroLink from './components/chrome/SkipIntroLink';
import Preloader from './components/chrome/Preloader';
import PromoSticker from './components/chrome/PromoSticker';
import Warp from './components/chrome/Warp';
import IconDefs from './components/chrome/IconDefs';
import Nav from './components/chrome/Nav';
import MobileSheet from './components/chrome/MobileSheet';
import HeroObject from './components/chrome/HeroObject';
import HeroScene from './components/scenes/HeroScene';
import IntroScene from './components/scenes/IntroScene';
import TrustScene from './components/scenes/TrustScene';
import TreatmentsScene from './components/scenes/TreatmentsScene';
import GalleryScene from './components/scenes/GalleryScene';
import MovementScene from './components/scenes/MovementScene';
import MembershipCardsScene from './components/scenes/MembershipCardsScene';
import Footer from './components/Footer';

export default function App() {
  return (
    <>

      {/* #bg-canvas — full-viewport background layer (src/components/chrome/BackgroundCanvas/index.jsx) */}
      <BackgroundCanvas />

      {/* #skipIntro — intro skip link (src/components/chrome/SkipIntroLink/index.jsx) */}
      <SkipIntroLink />

      {/* #preloader — boot preloader (src/components/chrome/Preloader/index.jsx) */}
      <Preloader />

      {/* #sticker — promo badge (src/components/chrome/PromoSticker/index.jsx) */}
      <PromoSticker />

      {/* #warp — vignette warp overlay (src/components/chrome/Warp/index.jsx) */}
      <Warp />

      {/* hidden SVG defs — the #i-* icons plus #mark, #mark-ink, #markG, #markGbp symbols (src/components/chrome/IconDefs/index.jsx) */}
      <IconDefs />

      {/* #nav — site header (src/components/chrome/Nav/index.jsx) */}
      <Nav />

      {/* #sheet — mobile menu sheet (src/components/chrome/MobileSheet/index.jsx) */}
      <MobileSheet />

      {/* <main class="deck scene-run" id="top"> — the scroll-scene stage */}
      <main className="deck scene-run" id="top">

        {/* #hero-object — pinned mark, first child of main (src/components/chrome/HeroObject/index.jsx) */}
        <HeroObject />

        {/* cover-stack — hero → intro → trust (the 3 cover pages) */}
        <div className="cover-stack">
          {/* #hero — page 1 (src/components/scenes/HeroScene/index.jsx) */}
          <HeroScene />
          {/* #intro — page 2 (src/components/scenes/IntroScene/index.jsx) */}
          <IntroScene />
          {/* #trust — page 3, purple cover (src/components/scenes/TrustScene/index.jsx) */}
          <TrustScene />
        </div>{/* /cover-stack */}

        {/* #treatments — sports recovery menu (src/components/scenes/TreatmentsScene/index.jsx) */}
        <TreatmentsScene />

        {/* #gallery — marquee scene (src/components/scenes/GalleryScene/index.jsx) */}
        <GalleryScene />

        {/* #movement — restore movement (src/components/scenes/MovementScene/index.jsx) */}
        <MovementScene />

        {/* #membership-cards — card grid (src/components/scenes/MembershipCardsScene/index.jsx) */}
        <MembershipCardsScene />

      </main>

      {/* footer — .foot (src/components/Footer/index.jsx) */}
      <Footer />
    </>
  );
}
