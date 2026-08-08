/* =====================================================================
   OverlayDeck.jsx — the React control deck (transparent overlay)
   ---------------------------------------------------------------------
   The original overlay panel: a labelled section pinned bottom-left,
   hovering ABOVE the whole page (z-index 200). It is a small, fully
   self-contained React app in its own right:

     • live status row (pulsing CONNECTED dot)
     • mode / anchor / uptime / build rows
     • Expand ⇄ Collapse toggle revealing a live event log
     • Ping button that appends an entry to the log
     • Minimise button — collapses the deck COMPLETELY down to the
       bare ⚛️ REACT chip (just the label strip); clicking the chip
       restores the full deck

   Styles live in styles/overlay.css (the .deck-* classes); only the
   dynamic bits (hover states) stay inline.
   ===================================================================== */

import { useEffect, useRef, useState } from 'react';
import '../styles/overlay.css';

/* ── 01 ── status dot: glowing pulse via CSS animation ─────────────── */
function StatusDot({ ok }) {
  return (
    <span
      className={`deck-dot ${ok ? 'ok' : 'warn'} ${ok ? 'pulse' : ''}`}
      aria-hidden="true"
    />
  );
}

/* ── 02 ── one key/value row of the deck ───────────────────────────── */
function Row({ k, v, children }) {
  return (
    <div className="deck-row">
      <span className="deck-key">{k}</span>
      {children || <span className="deck-val">{v}</span>}
    </div>
  );
}

/* ── 03 ── uptime formatter: seconds → HH:MM:SS ───────────────────── */
function fmtUptime(s) {
  const h = String(Math.floor(s / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  return `${h}:${m}:${sec}`;
}

/* ── 04 ── the deck component ──────────────────────────────────────── */
export default function OverlayDeck() {
  const [open, setOpen] = useState(false);
  const [minimised, setMinimised] = useState(false);
  const [uptime, setUptime] = useState(0);
  const [log, setLog] = useState([]);
  const logRef = useRef(null);

  /* append a timestamped line, keeping the last 30 */
  const push = (msg) => setLog((l) => [...l.slice(-29), `${new Date().toLocaleTimeString()}  ${msg}`]);

  /* ── 05 ── mount: seed the log + start the uptime ticker ─────────── */
  useEffect(() => {
    push('react deck mounted');
    const t1 = setTimeout(() => push('overlay attached · bottom-left'), 500);
    const t2 = setTimeout(() => push('listening to scene canvas'), 1100);
    const tick = setInterval(() => setUptime((u) => u + 1), 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(tick); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── 06 ── auto-scroll the log to the newest line ────────────────── */
  useEffect(() => {
    if (open && logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log, open]);

  /* ── 07 ── render ────────────────────────────────────────────────── */
  /* When minimised, ONLY the label strip survives — the entire deck
     body (rows, buttons, log) is unmounted. The section gets the .min
     class so CSS can shrink it to a chip; the label becomes the
     restore affordance. */
  return (
    <section
      id="react-root"
      className={minimised ? 'min' : ''}
      aria-label="React overlay"
    >
      <div
        id="react-label"
        role={minimised ? 'button' : undefined}
        tabIndex={minimised ? 0 : undefined}
        aria-expanded={minimised ? false : undefined}
        onClick={() => { if (minimised) setMinimised(false); }}
        onKeyDown={minimised ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setMinimised(false); }
        } : undefined}
      >
        ⚛️ REACT
      </div>

      {!minimised && (
        <div id="react-app">
          <Row k="Status">
            <span className="deck-val"><StatusDot ok />CONNECTED</span>
          </Row>
          <Row k="Mode">Transparent overlay</Row>
          <Row k="Anchor">Bottom-left · z 200</Row>
          <Row k="Uptime">{fmtUptime(uptime)}</Row>
          <Row k="Build">0.3.0 · react 18</Row>

          <div className="deck-btns">
            <button
              className="deck-btn"
              onMouseEnter={(e) => e.currentTarget.classList.add('hover')}
              onMouseLeave={(e) => e.currentTarget.classList.remove('hover')}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? 'Collapse' : 'Expand'}
            </button>
            <button
              className="deck-btn"
              onMouseEnter={(e) => e.currentTarget.classList.add('hover')}
              onMouseLeave={(e) => e.currentTarget.classList.remove('hover')}
              onClick={() => push('ping · scene alive')}
            >
              Ping
            </button>
            <button
              className="deck-btn"
              onMouseEnter={(e) => e.currentTarget.classList.add('hover')}
              onMouseLeave={(e) => e.currentTarget.classList.remove('hover')}
              onClick={() => setMinimised(true)}
            >
              Minimise
            </button>
          </div>

          {open && (
            <div ref={logRef} className="deck-log">
              {log.map((line, i) => <div key={i}>{line}</div>)}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
