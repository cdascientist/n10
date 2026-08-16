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
    SkipIntroLink, Preloader, PromoSticker, Warp, IconDefs, PromoBar,
    Nav, MobileSheet) → <main class="deck scene-run" id="top">
    (HeroObject, cover-stack {HeroScene, IntroScene, TrustScene},
    GalleryScene, MovementScene, HeatScene, MembershipScene,
    MembershipCardsScene, FuelMenuScene, BoardScene, BookScene) →
    Footer.
    ════════════════════════════════════════════════════════════ */}

import BackgroundCanvas from './components/BackgroundCanvas.jsx';
import SkipIntroLink from './components/SkipIntroLink.jsx';
import Preloader from './components/Preloader.jsx';
import PromoSticker from './components/PromoSticker.jsx';
import Warp from './components/Warp.jsx';
import IconDefs from './components/IconDefs.jsx';
import PromoBar from './components/PromoBar.jsx';
import Nav from './components/Nav.jsx';
import MobileSheet from './components/MobileSheet.jsx';
import HeroObject from './components/HeroObject.jsx';
import HeroScene from './components/Scenes/HeroScene.jsx';
import IntroScene from './components/Scenes/IntroScene.jsx';
import TrustScene from './components/Scenes/TrustScene.jsx';
import TreatmentsScene from './components/Scenes/TreatmentsScene.jsx';
import GalleryScene from './components/Scenes/GalleryScene.jsx';
import MovementScene from './components/Scenes/MovementScene.jsx';
import HeatScene from './components/Scenes/HeatScene.jsx';
import MembershipScene from './components/Scenes/MembershipScene.jsx';
import MembershipCardsScene from './components/Scenes/MembershipCardsScene.jsx';
import FuelMenuScene from './components/Scenes/FuelMenuScene.jsx';
import BoardScene from './components/Scenes/BoardScene.jsx';
import BookScene from './components/Scenes/BookScene.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>

      {/* #bg-canvas — full-viewport background layer (src/components/BackgroundCanvas.jsx) */}
      <BackgroundCanvas />

      {/* #skipIntro — intro skip link (src/components/SkipIntroLink.jsx) */}
      <SkipIntroLink />

      {/* #preloader — boot preloader (src/components/Preloader.jsx) */}
      <Preloader />

      {/* #sticker — promo badge (src/components/PromoSticker.jsx) */}
      <PromoSticker />

      {/* #warp — vignette warp overlay (src/components/Warp.jsx) */}
      <Warp />

      {/* hidden SVG defs — the #i-* icons plus #mark, #mark-ink, and #markG symbols (src/components/IconDefs.jsx) */}
      <IconDefs />

      {/* #bar — dismissible promo banner (src/components/PromoBar.jsx) */}
      <PromoBar />

      {/* #nav — site header (src/components/Nav.jsx) */}
      <Nav />

      {/* #sheet — mobile menu sheet (src/components/MobileSheet.jsx) */}
      <MobileSheet />

      {/* <main class="deck scene-run" id="top"> — the scroll-scene stage */}
      <main className="deck scene-run" id="top">

        {/* #hero-object — pinned mark, first child of main (src/components/HeroObject.jsx) */}
        <HeroObject />

        {/* cover-stack — hero → intro → trust (the 3 cover pages) */}
        <div className="cover-stack">
          {/* #hero — page 1 (src/components/Scenes/HeroScene.jsx) */}
          <HeroScene />
          {/* #intro — page 2 (src/components/Scenes/IntroScene.jsx) */}
          <IntroScene />
          {/* #trust — page 3, purple cover (src/components/Scenes/TrustScene.jsx) */}
          <TrustScene />
        </div>{/* /cover-stack */}

        {/* #treatments — sports recovery menu (src/components/Scenes/TreatmentsScene.jsx) */}
        <TreatmentsScene />

        {/* #gallery — marquee scene (src/components/Scenes/GalleryScene.jsx) */}
        <GalleryScene />

        {/* #movement — yoga tuesday (src/components/Scenes/MovementScene.jsx) */}
        <MovementScene />

        {/* #heat — 190° / DON'T (src/components/Scenes/HeatScene.jsx) */}
        <HeatScene />

        {/* #membership — key/room intro (src/components/Scenes/MembershipScene.jsx) */}
        <MembershipScene />

        {/* #membership-cards — card grid (src/components/Scenes/MembershipCardsScene.jsx) */}
        <MembershipCardsScene />

        {/* #fuel-menu — fuel lab head (src/components/Scenes/FuelMenuScene.jsx) */}
        <FuelMenuScene />

        {/* #board — fuel board tabs (src/components/Scenes/BoardScene.jsx) */}
        <BoardScene />

        {/* #book — booking, purple (src/components/Scenes/BookScene.jsx) */}
        <BookScene />

      </main>

      {/* footer — .foot (src/components/Footer.jsx) */}
      <Footer />
    </>
  );
}
