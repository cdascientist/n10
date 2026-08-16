#!/usr/bin/env node
/* free-port.mjs — free a port (default 3000) so the dev server can bind it.
   ---------------------------------------------------------------------------
   Why: a stale dev server (e.g. an old `node app.js` started before a pull)
   can keep squatting on :3000. Vite's strictPort then refuses to start and
   the browser keeps hitting the OLD server — which may serve raw JSX (the
   Vite template) that no browser can parse, leaving a purple screen at
   localhost:3000. This script kills node/npm/vite processes listening on
   the port, so `npm run dev` / `npm start` always win the port.

   Cross-platform: probes lsof (mac/linux), ss + fuser (linux), netstat
   (windows/linux). Kills only node-ish listeners; anything else is left
   alone with a warning (strictPort will then fail loudly, as designed).
   ---------------------------------------------------------------------------
   Usage: node scripts/free-port.mjs [port]      (default 3000)
   Wired as the npm `predev` / `prestart` hook. */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const PORT = Number(process.argv[2] || process.env.PORT || 3000);
const PIDS = new Set();
const add = (s) => { for (const m of String(s).matchAll(/(\d+)/g)) PIDS.add(Number(m[1])); };

/* ── probe every tool we have ─────────────────────────────────────────── */
try {
  const r = spawnSync('lsof', ['-ti', `tcp:${PORT}`], { encoding: 'utf8' });        // mac/linux
  if (r.status === 0 && r.stdout.trim()) add(r.stdout);
} catch {}
try {
  const r = spawnSync('ss', ['-tlnp'], { encoding: 'utf8' });                        // linux
  if (r.status === 0) for (const l of r.stdout.split('\n'))
    if (l.includes(`:${PORT} `)) { const m = l.match(/pid=(\d+)/); if (m) add(m[1]); }
} catch {}
try {
  const r = spawnSync('fuser', [`${PORT}/tcp`], { encoding: 'utf8' });               // linux
  if (r.status === 0) add(r.stdout);
} catch {}
try {
  const r = spawnSync('netstat', ['-ano'], { encoding: 'utf8' });                    // windows
  if (r.status === 0) for (const l of r.stdout.split('\n'))
    if (l.includes(`:${PORT}`) && /LISTENING/i.test(l)) {
      const p = l.trim().split(/\s+/); add(p[p.length - 1]);
    }
} catch {}

/* ── kill node-ish listeners only ─────────────────────────────────────── */
function nodeish(pid) {
  try {
    let name = '';
    if (process.platform === 'win32')
      name = spawnSync('tasklist', ['/FI', `PID eq ${pid}`], { encoding: 'utf8' }).stdout || '';
    else if (process.platform === 'darwin') {
      name = spawnSync('ps', ['-p', String(pid), '-o', 'comm='], { encoding: 'utf8' }).stdout || '';
      name += ' ' + (spawnSync('ps', ['-p', String(pid), '-o', 'command='], { encoding: 'utf8' }).stdout || '');
    }
    else {
      try { name = readFileSync(`/proc/${pid}/comm`, 'utf8'); } catch { name = ''; }
      // comm alone is unreliable (some Node builds report "MainThread") —
      // also read the full cmdline, which always contains node/npm/vite.
      try { name += ' ' + readFileSync(`/proc/${pid}/cmdline`, 'utf8').replace(/\0/g, ' '); } catch {}
    }
    return /node|npm|vite|electron|MainThread/i.test(name);
  } catch { return true; } // can't tell — treat as dev server for a dev port
}

let freed = 0;
for (const pid of PIDS) {
  if (pid === process.pid) continue;
  if (nodeish(pid)) {
    try { process.kill(pid, 'SIGTERM'); console.log(`freed :${PORT} — killed pid ${pid}`); freed++; }
    catch { console.warn(`:${PORT} pid ${pid} not killable`); }
  } else {
    console.warn(`:${PORT} is held by non-node pid ${pid} — not killed; vite strictPort will fail loudly`);
  }
}
if (!freed && PIDS.size) console.log(`:${PORT} listeners: ${[...PIDS].join(', ')} (left alone)`);
if (!PIDS.size) console.log(`:${PORT} free`);
