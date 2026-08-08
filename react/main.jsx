/* =====================================================================
   main.jsx — React entry point
   ---------------------------------------------------------------------
   Mounts <App/> into the #root element that index.template.html provides.
   The rest of the page is rendered by React; the engine runs alongside
   as an imperative layer (see engine/engine.js).
   ===================================================================== */

/* ── 01 ── React 18 createRoot (concurrent rendering) ──────────────── */
import { createRoot } from 'react-dom/client';

/* ── 02 ── the composition root ────────────────────────────────────── */
import App from './App.jsx';

/* ── 03 ── mount ───────────────────────────────────────────────────── */
const el = document.getElementById('root');
if (el) {
  createRoot(el).render(<App />);
}
