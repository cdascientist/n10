import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

/* 1. bundle the react app to a single iife file */
await build({
  entryPoints: [path.join(root, 'react/main.jsx')],
  bundle: true,
  minify: true,
  format: 'iife',
  target: 'es2019',
  jsx: 'automatic',
  outfile: path.join(root, 'react/dist/app.js'),
});

/* 2. inline the bundle into index.html between the markers */
const htmlPath = path.join(root, 'index.html');
const html = readFileSync(htmlPath, 'utf8');
const bundle = readFileSync(path.join(root, 'react/dist/app.js'), 'utf8')
  .replace(/<\/script/gi, '<\\/script');

const START = '<!--__REACT_APP_START__-->';
const END = '<!--__REACT_APP_END__-->';
const block = `${START}<script>${bundle}</script>${END}`;

/* NOTE: use a FUNCTION replacement — a string replacement would expand
   `$&` / `$'` / `$`` / `$1`.. patterns found inside the minified bundle. */
const re = new RegExp(`${START}[\\s\\S]*?${END}`);
const out = re.test(html) ? html.replace(re, () => block) : html.replace('</body>', `${block}\n</body>`);

/* 3. verify before writing: exactly one marker pair, and the inlined
   bundle is byte-identical to the escaped build output */
const inlineRe = new RegExp(`${START}<script>([\\s\\S]*?)</script>${END}`);
const m = out.match(inlineRe);
if (!m) throw new Error('marker block not found in output');
if (m[1] !== bundle) throw new Error('inlined bundle does not match build output — aborting');
if ((out.match(new RegExp(START, 'g')) || []).length !== 1) throw new Error('expected exactly one START marker');
if ((out.match(new RegExp(END, 'g')) || []).length !== 1) throw new Error('expected exactly one END marker');

writeFileSync(htmlPath, out);
const kb = (out.length / 1024).toFixed(1);
console.log(`✓ react bundle inlined (${m[1].length} bytes, verified byte-identical) → index.html (${kb} KB total)`);
