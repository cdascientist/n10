import { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/* palette shared with the page's design system                        */
/* ------------------------------------------------------------------ */
const C = {
  vein: '#7b2dff',
  veinHot: '#b06bff',
  filament: '#e4ccff',
  ash: '#6b5a86',
  ok: '#3dffa0',
  warn: '#ffd166',
  edge: 'rgba(155,90,255,.28)',
};

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '3px 0',
  borderBottom: '1px solid rgba(155,90,255,.10)',
};

const keyStyle = {
  color: C.ash,
  fontSize: 10,
  letterSpacing: '.14em',
  textTransform: 'uppercase',
};

const valStyle = {
  color: C.filament,
  fontSize: 12,
  fontVariantNumeric: 'tabular-nums',
};

const btnStyle = {
  flex: 1,
  padding: '6px 0',
  border: `1px solid ${C.edge}`,
  borderRadius: 8,
  background: 'rgba(123,45,255,.12)',
  color: C.filament,
  fontSize: 11,
  letterSpacing: '.08em',
  textTransform: 'uppercase',
  cursor: 'pointer',
};

const btnHover = { background: 'rgba(123,45,255,.30)', color: '#fff' };

function StatusDot({ ok }) {
  const color = ok ? C.ok : C.warn;
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 8px ${color}`,
        marginRight: 6,
        animation: ok ? 'reactPulse 1.6s ease-in-out infinite' : 'none',
      }}
    />
  );
}

function Row({ k, v, children }) {
  return (
    <div style={rowStyle}>
      <span style={keyStyle}>{k}</span>
      {children || <span style={valStyle}>{v}</span>}
    </div>
  );
}

function fmtUptime(s) {
  const h = String(Math.floor(s / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  return `${h}:${m}:${sec}`;
}

export default function App() {
  const [open, setOpen] = useState(false);
  const [uptime, setUptime] = useState(0);
  const [log, setLog] = useState([]);
  const logRef = useRef(null);

  const push = (msg) => setLog((l) => [...l.slice(-29), `${new Date().toLocaleTimeString()}  ${msg}`]);

  useEffect(() => {
    push('react deck mounted');
    const t1 = setTimeout(() => push('overlay attached · bottom-left'), 500);
    const t2 = setTimeout(() => push('listening to scene canvas'), 1100);
    const tick = setInterval(() => setUptime((u) => u + 1), 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(tick); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (open && logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log, open]);

  return (
    <div style={{ userSelect: 'text' }}>
      <Row k="Status">
        <span style={valStyle}><StatusDot ok />CONNECTED</span>
      </Row>
      <Row k="Mode">Transparent overlay</Row>
      <Row k="Anchor">Bottom-left · z 200</Row>
      <Row k="Uptime">{fmtUptime(uptime)}</Row>
      <Row k="Build">0.1.0 · react 18</Row>

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button
          style={btnStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, btnHover)}
          onMouseLeave={(e) => { e.currentTarget.style.background = btnStyle.background; e.currentTarget.style.color = btnStyle.color; }}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Collapse' : 'Expand'}
        </button>
        <button
          style={btnStyle}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, btnHover)}
          onMouseLeave={(e) => { e.currentTarget.style.background = btnStyle.background; e.currentTarget.style.color = btnStyle.color; }}
          onClick={() => push('ping · scene alive')}
        >
          Ping
        </button>
      </div>

      {open && (
        <div
          ref={logRef}
          style={{
            marginTop: 10,
            maxHeight: 140,
            overflowY: 'auto',
            fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
            fontSize: 10.5,
            lineHeight: 1.55,
            color: C.veinHot,
            background: 'rgba(0,0,0,.35)',
            border: `1px solid ${C.edge}`,
            borderRadius: 8,
            padding: '6px 8px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}
        >
          {log.map((line, i) => <div key={i}>{line}</div>)}
        </div>
      )}
    </div>
  );
}
