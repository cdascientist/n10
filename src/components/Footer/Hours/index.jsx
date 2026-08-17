{/* ════════════════════════════════════════════════════════════
    FooterHours
    Renders: the opening-hours row (.hours) — four <b>day + span>
    entries (Mon–Thu / Fri / Sat–Sun / quiet hours).

    Used-by (breadcrumb up): Footer (src/components/Footer/index.jsx)
    — third child of .wrap, after the link columns.

    Contains (breadcrumb down): <div.hours> > 4 x div (b + text).
    ════════════════════════════════════════════════════════════ */}

export default function FooterHours() {
  return (
    <div className="hours">
      <div><b>Mon – Thu</b>6:00a — 10:00p</div>
      <div><b>Fri</b>6:00a — 11:00p</div>
      <div><b>Sat – Sun</b>7:00a — 9:00p</div>
      <div><b>Quiet hours</b>Members, 6–8a</div>
    </div>
  );
}
