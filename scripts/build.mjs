import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/* =====================================================================
   InTension build pipeline
   ---------------------------------------------------------------------
   1. Bundle the React app (react/main.jsx) to a single minified IIFE.
      CSS imported by the components is emitted automatically to
      react/dist/app.css by esbuild.
   2. Inline BOTH artifacts into index.template.html, producing the
      final single-file index.html that nginx and app.js serve.
   3. Verify the result before writing (no raw </script> / </style>
      inside the bundles, exactly one inline of each, output sane).
   ===================================================================== */

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

/* ── 01 ── bundle the React app (JS + CSS) ─────────────────────────── */
await build({
  entryPoints: [path.join(root, 'react/main.jsx')],
  bundle: true,
  minify: true,
  format: 'iife',          // one self-contained script, no imports/exports
  jsx: 'automatic',        // automatic runtime: no global React dependency
  target: 'es2019',
  outfile: path.join(root, 'react/dist/app.js'),
});

/* ── 02 ── read the two build artifacts ────────────────────────────── */
const js = readFileSync(path.join(root, 'react/dist/app.js'), 'utf8');
const css = readFileSync(path.join(root, 'react/dist/app.css'), 'utf8');

/* Escape closing tags inside the bundles. A literal `</script>` inside
   the JS would terminate the inline <script> early in the browser; the
   backslash form is identical to the browser (it is inside a string in
   the minified code) but invisible to the HTML parser. Same for CSS. */
const jsSafe = js.replace(/<\/script/gi, '<\\/script');
const cssSafe = css.replace(/<\/style/gi, '<\\/style');

/* ── 03 ── inline into the template ────────────────────────────────── */
const tpl = readFileSync(path.join(root, 'index.template.html'), 'utf8');
if (!tpl.includes('/*__JS__*/') || !tpl.includes('/*__CSS__*/')) {
  throw new Error('template markers missing from index.template.html');
}
const out = tpl
  .replace('/*__JS__*/', () => jsSafe)   // function form: never treat $ as special
  .replace('/*__CSS__*/', () => cssSafe);

/* ── 04b ── clobber guard: never silently overwrite the marketing page ──
   index.html is ALSO the hand-maintained informational page that nginx
   serves (IN/TENSION bodywork/sauna/movement — see TOOLS.md). Running
   this build regenerates it from the 3D template, which would destroy
   the marketing page. Refuse unless FORCE_BUILD=1 is set. */
const existing = readFileSync(path.join(root, 'index.html'), 'utf8');
const MARKETING_MARKERS = [
  'Ninety minutes to reset a whole week',
  'Swedish bodywork, infrared sauna',
];
if (!process.env.FORCE_BUILD && MARKETING_MARKERS.some((m) => existing.includes(m))) {
  throw new Error('index.html is the hand-maintained marketing page — refusing to clobber. ' +
    'Set FORCE_BUILD=1 to overwrite it with the 3D build (you almost certainly do not want this).');
}

/* ── 04 ── verification ────────────────────────────────────────────── */
if (out.includes('<\\/script') !== out.includes('<\\\\/script')) { /* noop guard */ }
const strayScript = (out.match(/<\/script>/g) || []).length;
const strayStyle = (out.match(/<\/style>/g) || []).length;
// expected: exactly 1 </script> (the inline bundle close) + 1 for the CDN
// three.js tag = 2 total; exactly 1 </style> (the inline CSS close).
if (strayScript !== 2) throw new Error(`expected 2 </script> closings, found ${strayScript}`);
if (strayStyle !== 1) throw new Error(`expected 1 </style> closing, found ${strayStyle}`);
if (!out.includes('id="root"')) throw new Error('output missing #root mount point');
if (out.length < js.length + css.length) throw new Error('output suspiciously small');

writeFileSync(path.join(root, 'index.html'), out);
const kb = (out.length / 1024).toFixed(1);
console.log(`✓ single-file index.html built (${kb} KB: ${(js.length / 1024).toFixed(1)} KB JS + ${(css.length / 1024).toFixed(1)} KB CSS inlined)`);
