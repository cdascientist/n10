/* InTension — local dev server (zero dependencies, Node 18+)
   Serves the repo root exactly like nginx does in production:
   - index.html for /
   - dotfiles (git, env) and dependency/build dirs → 403
   Run with:  node app.js   (or npm start)   — or press F5 in VS Code
*/
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(fileURLToPath(import.meta.url), '..');
// Serve the React build output (dist/) when present, else the repo root.
const BUILT = existsSync(resolve(REPO, 'dist/index.html'));
const ROOT = BUILT ? resolve(REPO, 'dist') : REPO;
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Fresh checkouts have no dist/ (it is gitignored). Serving the raw repo root
// would hand the browser the Vite template (<script src="/src/main.jsx">) —
// raw JSX that no browser can parse, i.e. a blank page at :3000 while the
// live site works. Fail loudly with the fix instead of silently serving that:
// print the guidance AND serve a styled hint page (so even a browser that
// never sees the terminal gets the answer).
const HINT_PAGE = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>IN/TENSION — build dist/ first</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#8B2BFF;color:#fff;font:16px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
.wrap{max-width:520px;padding:40px;text-align:center}h1{font-size:22px;margin:0 0 10px}p{opacity:.92;margin:6px 0}
code{background:rgba(255,255,255,.16);border-radius:6px;padding:2px 8px;font-size:14px}</style></head>
<body><div class="wrap"><h1>No built site found in this checkout</h1>
<p>dist/ is gitignored — a fresh clone has no build. The live site works because the
 deploy pipeline builds it.</p>
<p>Run <code>npm run dev</code> (vite dev server, HMR) and open
 <code>http://localhost:3000</code> — recommended, no build step. (VS Code: F5 uses it.)</p>
<p>Or build first: <code>npm run build && npm start</code></p>
</div></body></html>`;
if (!BUILT) {
  console.error('\n\u26a0  dist/index.html not found — this checkout has no built site.');
  console.error('    The live site works because the deploy pipeline builds dist/.');
  console.error('    Options:');
  console.error('      1) npm run dev     — vite dev server with HMR on http://localhost:3000 (recommended, no build)');
  console.error('      2) npm run build && npm start — build dist/ first, then serve it here\n');
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.woff2': 'font/woff2',
};

function denied(pathname) {
  return (
    /(^|\/)\.[^/]/.test(pathname) || // any dotfile segment (.git, .env, …)
    /^\/?(node_modules|react\/dist)(\/|$)/.test(pathname)
  );
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = decodeURIComponent(url.pathname);

    // No build present → every request gets the hint page instead of the raw
    // Vite template (which would render blank: the browser can't parse JSX).
    if (!BUILT) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(HINT_PAGE);
    }

    if (denied(pathname)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('403 Forbidden');
    }

    const rel = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const file = resolve(ROOT, rel);
    if (!file.startsWith(ROOT)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('403 Forbidden');
    }

    const info = await stat(file).catch(() => null);
    if (info && info.isDirectory()) {
      // serve the directory index (nginx does this natively — mirror it)
      const idx = resolve(file, 'index.html');
      if (idx.startsWith(ROOT) && (await stat(idx).catch(() => null))?.isFile()) {
        const body = await readFile(idx);
        res.writeHead(200, {
          'Content-Type': MIME['.html'],
          'Cache-Control': 'no-cache',
        });
        return res.end(body);
      }
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 Not Found');
    }
    if (!info) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 Not Found');
    }

    const body = await readFile(file);
    res.writeHead(200, {
      'Content-Type': MIME[extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(body);
    console.log(`${new Date().toISOString()}  ${req.method} ${pathname}  200`);
  } catch (err) {
    console.error('server error:', err.message);
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('500 Internal Server Error');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`⚡ InTension dev server → http://localhost:${PORT}  (root: ${ROOT})`);
});
