{/* ════════════════════════════════════════════════════════════
    BookScene
    Renders: the BOOK scroll scene (purple page) — full-bleed photo
    with .close-in crop, veil, the COME / LEAVE ticker, booking copy
    and the Book / Join the club CTA row.

    Used-by (breadcrumb up): App (src/App.jsx) — rendered inside
    <main className="deck scene-run" id="top"> after BoardScene,
    directly before </main> (10th plain scene, last).

    Contains (breadcrumb down): <section id="book" class="scene"
    data-bg="#8B2BFF" data-ink="light"> > .wrap.scene-in > CloseIn
    (src/components/scenes/BookScene/CloseIn/index.jsx).
    ════════════════════════════════════════════════════════════ */}

import CloseIn from './CloseIn';

export default function BookScene() {
  return (
    /* BOOK */
    <section className="scene" data-bg="#8B2BFF" data-ink="light" id="book">
      <div className="wrap scene-in">
        <CloseIn />
      </div>
    </section>
  );
}
