{/* ════════════════════════════════════════════════════════════
    FooterLegal
    Renders: the legal row (.legal) — the four placeholder policy
    links plus the © 2026 note.

    Used-by (breadcrumb up): Footer (src/components/Footer/index.jsx)
    — fourth child of .wrap, after the hours row.

    Contains (breadcrumb down): <div.legal> > 4 x a + span.note.
    ════════════════════════════════════════════════════════════ */}

export default function FooterLegal() {
  return (
    <div className="legal">
      <a href="#top">Privacy</a><a href="#top">Terms</a><a href="#top">Accessibility</a><a href="#top">Cancellation</a>
      <span className="note">© 2026 IN/TENSION. Placeholder pricing and hours for layout purposes.</span>
    </div>
  );
}
