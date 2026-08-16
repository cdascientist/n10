{/* ════════════════════════════════════════════════════════════
    IconDefs
    Renders: the document-wide hidden SVG <defs> block — the full
    original 24px icon set (1.75 stroke, round caps), the brand
    linearGradient (#markG), the filled brand mark (#mark) and the
    ink outline mark (#mark-ink). Every <use href="#i-*"> / <use
    href="#mark"> in the app references a symbol defined here.

    Used-by (breadcrumb up): App (src/App.jsx) — sixth top-level
    sibling in the outer fragment, after Warp, before Nav.

    Contains (breadcrumb down): hidden <svg style={{display:"none"}}>
    > <defs> (#markG) + <g id="i-hands|heat|cold|move|cup|key|clock|
    lock|shield|spark|leaf|drop|bolt|check|arrow|chev|chevd|close">
    + <symbol id="mark"> + <symbol id="mark-ink">.
    ════════════════════════════════════════════════════════════ */}

export default function IconDefs() {
  return (
    /* ═══ ORIGINAL ICON SET — 24px grid, 1.75 stroke, round caps ═══ */
    <svg style={{display:"none"}} aria-hidden="true">
      <defs>
        <linearGradient id="markG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#C77DFF"/><stop offset=".5" stopColor="#8B2BFF"/><stop offset="1" stopColor="#6E1FD1"/>
        </linearGradient>
        {/* black→purple gradient — used by the #mark-bp header logo mark (Nav.jsx) */}
        <linearGradient id="markGbp" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#000000"/><stop offset=".55" stopColor="#4A0D8F"/><stop offset="1" stopColor="#8B2BFF"/>
        </linearGradient>
      </defs>
      <g id="i-hands" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 15c3-4.5 6.4-6.8 9-6.8s6 2.3 9 6.8"/><path d="M12 8.2V3.4"/><circle cx="12" cy="18.6" r="1.6"/>
      </g>
      <g id="i-heat" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21c3.6 0 6.2-2.6 6.2-6 0-4.3-4-6.1-4.6-11-2 1.6-3.3 3.7-3.3 5.8 0 1.6-1 2.3-1.8 1.5-.6-.6-.8-1.6-.8-2.4C6 10.6 5.8 12.6 5.8 15c0 3.4 2.6 6 6.2 6z"/>
      </g>
      <g id="i-cold" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9"/>
        <path d="M9.6 4.6 12 6.9l2.4-2.3M9.6 19.4 12 17.1l2.4 2.3"/>
      </g>
      <g id="i-move" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="4.6" r="2"/><path d="M12 7.4v6M12 13.4 8 20M12 13.4 16 20M7 10h10"/>
      </g>
      <g id="i-cup" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.4 7h11.2l-1.1 12.1a2 2 0 0 1-2 1.9H9.5a2 2 0 0 1-2-1.9z"/><path d="M5 7h14"/><path d="M9.5 4c.9-1 2.2-1.2 3-.4.9.8 2.1.6 3-.4"/>
      </g>
      <g id="i-key" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="4"/><path d="M10.9 10.9 20 20M17 17l2.4-2.4M14.2 14.2l2 2"/>
      </g>
      <g id="i-clock" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/><path d="M12 6.6V12l3.6 2.2"/>
      </g>
      <g id="i-lock" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4.5" y="10" width="15" height="10.5" rx="3"/><path d="M8.2 10V7.2a3.8 3.8 0 0 1 7.6 0V10"/>
      </g>
      <g id="i-shield" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.6 20 5.9v5.6c0 5-3.4 8.7-8 9.9-4.6-1.2-8-4.9-8-9.9V5.9z"/><path d="M8.6 11.9 11 14.3l4.6-4.7"/>
      </g>
      <g id="i-spark" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.8 13.9 8 19 9.9 13.9 11.8 12 17l-1.9-5.2L5 9.9 10.1 8z"/><path d="M18.4 16.4 19 18l1.6.6-1.6.6-.6 1.6-.6-1.6L16.2 18l1.6-.6z"/>
      </g>
      <g id="i-leaf" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.6 19.4C3 15 4.4 9.2 8.5 6.4c3-2 7-2.2 11-1.6.5 4-.3 8-2.6 10.7-3 3.5-8.4 4.3-12.3 3.9z"/><path d="M5.8 18.2c2.7-3.3 6.2-6 10-7.8"/>
      </g>
      <g id="i-drop" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3.2c3.4 4 6.2 7 6.2 10.4A6.2 6.2 0 0 1 12 20.4a6.2 6.2 0 0 1-6.2-6.8C5.8 10.2 8.6 7.2 12 3.2z"/>
      </g>
      <g id="i-bolt" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13.4 2.6 5.6 13.4h5.2l-.6 8 7.8-10.8h-5.2z"/>
      </g>
      <g id="i-check" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 12.6 9.6 17.7 19.5 6.9"/>
      </g>
      <g id="i-arrow" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12h15M13.2 5.6 19.6 12l-6.4 6.4"/>
      </g>
      <g id="i-chev" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5.2 15.8 12 9 18.8"/>
      </g>
      <g id="i-chevd" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.2 9 12 15.8 18.8 9"/>
      </g>
      <g id="i-close" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round">
        <path d="M5.5 5.5l13 13M18.5 5.5l-13 13"/>
      </g>
      <symbol id="mark" viewBox="0 0 64 64">
        <rect width="64" height="64" rx="15" fill="url(#markG)"/>
        <path d="M17 20v24" stroke="#fff" strokeWidth="5.4" strokeLinecap="round"/>
        <path d="M39 18 25 46" stroke="#fff" strokeWidth="5.4" strokeLinecap="round" opacity=".92"/>
        <path d="M47 20v24" stroke="#fff" strokeWidth="5.4" strokeLinecap="round"/>
      </symbol>
      {/* header variant — same slashes on the black→purple gradient (Nav.jsx logo) */}
      <symbol id="mark-bp" viewBox="0 0 64 64">
        <rect width="64" height="64" rx="15" fill="url(#markGbp)"/>
        <path d="M17 20v24" stroke="#fff" strokeWidth="5.4" strokeLinecap="round"/>
        <path d="M39 18 25 46" stroke="#fff" strokeWidth="5.4" strokeLinecap="round" opacity=".92"/>
        <path d="M47 20v24" stroke="#fff" strokeWidth="5.4" strokeLinecap="round"/>
      </symbol>
      <symbol id="mark-ink" viewBox="0 0 64 64">
        <rect x="2.7" y="2.7" width="58.6" height="58.6" rx="13.5" fill="none" stroke="currentColor" strokeWidth="5.4"/>
        <path d="M17 20v24" stroke="currentColor" strokeWidth="5.4" strokeLinecap="round" fill="none"/>
        <path d="M39 18 25 46" stroke="currentColor" strokeWidth="5.4" strokeLinecap="round" fill="none" opacity=".92"/>
        <path d="M47 20v24" stroke="currentColor" strokeWidth="5.4" strokeLinecap="round" fill="none"/>
      </symbol>
    </svg>
  );
}
