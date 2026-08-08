import { JSDOM, VirtualConsole } from 'jsdom';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/* Headless smoke test: load the single-file page, confirm the React
   overlay mounts and renders. (three.js/WebGL won't run in jsdom —
   that's expected and irrelevant to the overlay.) */
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const html = readFileSync(path.join(root, 'index.html'), 'utf8');

const vc = new VirtualConsole(); // keep output clean
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'http://localhost/',
  virtualConsole: vc,
});
const win = dom.window;

setTimeout(() => {
  const app = win.document.getElementById('react-app');
  const txt = app ? app.innerHTML : '';
  const label = win.document.getElementById('react-label');
  const checks = {
    'overlay label present': !!(label && label.textContent.includes('REACT')),
    'react mounted into #react-app': !!(app && app.children.length > 0),
    'renders CONNECTED status': txt.includes('CONNECTED'),
    'renders Uptime row': txt.includes('Uptime'),
  };
  const btn = [...(app ? app.querySelectorAll('button') : [])].find((b) => b.textContent.includes('Expand'));
  if (!btn) { checks['expand button present'] = false; }
  else {
    btn.click();
    setTimeout(() => {
      checks['expand button present'] = true;
      checks['expand shows live log'] = app.textContent.includes('react deck mounted');
      finish(checks);
    }, 250);
  }
  if (btn) return;
  finish(checks);

  function finish(chk) {
    for (const [k, v] of Object.entries(chk)) console.log(`${v ? '✓' : '✗'} ${k}`);
    win.close();
    process.exit(Object.values(chk).every(Boolean) ? 0 : 1);
  }
}, 800);
