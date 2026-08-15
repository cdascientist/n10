import { JSDOM, VirtualConsole } from 'jsdom';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/* =====================================================================
   preloader-test.mjs — headless verification of the full-load preloader
   ---------------------------------------------------------------------
   Loads the built index.html in jsdom and asserts the gate behaves:

     phase 1   the preloader paints immediately (visible, not faded)
     phase 2   after window load + the minimum display window it gains
               .gone and the hero entrance starts
     phase 3   the overlay is fully removed from layout (display:none)
               and the rest of the page is intact

   NOTE: jsdom has no IntersectionObserver and no real media queries,
   so both are stubbed — the page script tolerates that by design.
   ===================================================================== */

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const html = readFileSync(path.join(root, 'index.html'), 'utf8');

const vc = new VirtualConsole();
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'http://localhost/',
  virtualConsole: vc,
  beforeParse(win) {
    if (!win.IntersectionObserver) {
      win.IntersectionObserver = class {
        constructor() {}
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() { return []; }
      };
    }
    if (!win.matchMedia) {
      win.matchMedia = () => ({
        matches: false, media: '', onchange: null,
        addEventListener() {}, removeEventListener() {},
        addListener() {}, removeListener() {},
        dispatchEvent() { return false; },
      });
    }
  },
});
const win = dom.window;

const results = {};
const record = (k, v) => { results[k] = v; console.log(`${v ? '✓' : '✗'} ${k}`); };
const allOk = () => Object.values(results).every(Boolean);

/* ── phase 1: preloader paints immediately ───────────────────────── */
setTimeout(() => {
  const pl = win.document.getElementById('preloader');
  record('preloader element present', !!pl);
  record('preloader visible at first paint', !!(pl && !pl.classList.contains('gone') && pl.style.display !== 'none'));
  record('preloader carries the brand mark', !!pl && !!pl.querySelector('.pl-mark use[href="#mark"]'));
  record('preloader shows wordmark', !!(pl && pl.querySelector('.pl-type') && pl.querySelector('.pl-type').textContent.includes('Tension')));
  record('progress bar present', !!pl && !!pl.querySelector('.pl-bar'));
  record('status label present', !!(pl && pl.querySelector('.pl-txt') && pl.querySelector('.pl-txt').textContent.trim().length));

  /* ── promo sticker (present + copy, hidden before reveal) ───────── */
  const sticker = win.document.getElementById('sticker');
  record('promo sticker present', !!sticker);
  record('sticker carries the promo word', !!(sticker && sticker.textContent.includes('NEW')));
  record('sticker carries the sub-line', !!(sticker && sticker.textContent.includes('FOUNDING MEMBERS')));
  record('sticker hidden before reveal', !!(sticker && !sticker.classList.contains('in')));

  /* ── phase 2: after load + min window, gate fades, hero enters ──── */
  setTimeout(() => {
    const pl = win.document.getElementById('preloader');
    const hero = win.document.getElementById('hero');
    record('preloader fades after full load (.gone)', !!(pl && pl.classList.contains('gone')));
    record('hero entrance starts with the fade', !!(hero && hero.classList.contains('go')));
    record('sticker springs in after reveal (.in)', !!(sticker && sticker.classList.contains('in')));

    /* ── phase 3: fully removed, page intact ──────────────────────── */
    setTimeout(() => {
      const pl = win.document.getElementById('preloader');
      record('preloader removed from layout (display:none)', !!(pl && pl.style.display === 'none'));
      const doc = win.document;
      record('nav intact', !!doc.querySelector('header.nav .logo'));
      record('menu intact', doc.querySelectorAll('header.nav .menu .menu-item').length >= 3);
      record('hero content intact', !!(doc.getElementById('hero') && doc.querySelector('#hero h1')));
      record('footer intact', !!doc.querySelector('footer'));
      win.close();
      process.exit(allOk() ? 0 : 1);
    }, 1000);
  }, 800);
}, 150);
