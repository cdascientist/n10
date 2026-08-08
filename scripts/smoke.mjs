import { JSDOM, VirtualConsole } from 'jsdom';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/* =====================================================================
   smoke.mjs — headless verification of the single-file page
   ---------------------------------------------------------------------
   Loads the BUILT index.html in jsdom and asserts the full component
   stack renders and behaves:

     phase 1 (≈900ms)  every layer mounted: scene canvas, boot, hud,
                       and the React overlay deck (label + status rows)
     phase 2 (≈2.6s)   the boot pipeline's stages fail fast in jsdom
                       (no WebGL/THREE), are skipped gracefully, and the
                       auto-enter path fires: boot fades, HUD turns on
     phase 3           expand interaction on the deck works

   NOTE: three.js never loads in jsdom (CDN scripts aren't fetched), so
   the 3D layer is expected to be absent — the guards in the engine keep
   the rest of the UI alive, which is exactly what we assert.
   ===================================================================== */

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const html = readFileSync(path.join(root, 'index.html'), 'utf8');

/* keep the (expected) jsdom console noise out of the output */
const vc = new VirtualConsole();
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,   // gives requestAnimationFrame + timers
  url: 'http://localhost/',
  virtualConsole: vc,
});
const win = dom.window;

const results = {};
const record = (k, v) => { results[k] = v; console.log(`${v ? '✓' : '✗'} ${k}`); };
const allOk = () => Object.values(results).every(Boolean);

/* ── phase 1: every layer mounted ──────────────────────────────────── */
setTimeout(() => {
  const app = win.document.getElementById('react-app');
  const txt = app ? app.innerHTML : '';
  const label = win.document.getElementById('react-label');
  record('scene canvas present', !!win.document.getElementById('scene'));
  record('boot overlay present', !!win.document.getElementById('boot'));
  record('hud layer present', !!win.document.getElementById('hud'));
  record('overlay label present', !!(label && label.textContent.includes('REACT')));
  record('react mounted into #react-app', !!(app && app.children.length > 0));
  record('renders CONNECTED status', txt.includes('CONNECTED'));
  record('renders Uptime row', txt.includes('Uptime'));

  /* ── phase 3: expand + minimise interactions ────────────────────── */
  const btn = [...(app ? app.querySelectorAll('button') : [])].find((b) => b.textContent.includes('Expand'));
  if (!btn) { record('expand button present', false); }
  else {
    btn.click();
    setTimeout(() => {
      record('expand button present', true);
      record('expand shows live log', app.textContent.includes('react deck mounted'));

      /* minimise the deck completely → only the chip remains */
      const minBtn = [...app.querySelectorAll('button')].find((b) => b.textContent.includes('Minimise'));
      if (!minBtn) { record('minimise button present', false); }
      else {
        minBtn.click();
        setTimeout(() => {
          const rootEl = win.document.getElementById('react-root');
          record('minimise button present', true);
          record('deck minimises to chip (.min)', !!(rootEl && rootEl.classList.contains('min')));
          record('deck body unmounted when minimised', !win.document.getElementById('react-app'));

          /* click the chip to restore */
          const label = win.document.getElementById('react-label');
          if (label) label.click();
          setTimeout(() => {
            record('chip click restores deck',
              !!win.document.getElementById('react-app') &&
              !win.document.getElementById('react-root').classList.contains('min'));

            /* ── phase 2: auto-enter flow (stages skipped → enter fires) ─── */
            setTimeout(() => {
              const boot = win.document.getElementById('boot');
              const hud = win.document.getElementById('hud');
              record('boot fades after auto-enter', !!(boot && boot.classList.contains('gone')));
              record('hud turns on after auto-enter', !!(hud && hud.classList.contains('on')));
              record('overlay survives enter flow', !!win.document.getElementById('react-app')?.children.length);
              win.close();
              process.exit(allOk() ? 0 : 1);
            }, 1500);
          }, 150);
        }, 150);
      }
    }, 200);
  }
}, 900);
