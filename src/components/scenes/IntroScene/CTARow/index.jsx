{/* ════════════════════════════════════════════════════════════
    CTARow
    Renders: the page-2 booking CTA row — the magnified .btn.mag
    "Book a session" link with its arrow icon (#i-arrow).

    Used-by (breadcrumb up): IntroScene (src/components/scenes/
    IntroScene/index.jsx) — second child of .wrap.scene-in, after
    the headline, before the hero sub-copy.

    Contains (breadcrumb down): <div.cta-row> > a.btn.mag (text +
    svg.arw > use#i-arrow).
    ════════════════════════════════════════════════════════════ */}

export default function CTARow() {
  return (
    <div className="cta-row">
      <a className="btn mag" href="#book">Book a session <svg className="arw" viewBox="0 0 24 24"><use href="#i-arrow"/></svg></a>
    </div>
  );
}
