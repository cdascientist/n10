#!/usr/bin/env node
/* ensure-deps.mjs — make `npm run dev` self-sufficient on a fresh checkout.
   ---------------------------------------------------------------------------
   Why: a fresh clone has no node_modules (gitignored), so `vite` is "not
   recognized" when npm runs the dev script — the browser then shows nothing
   (or a stale server's screen) at :3000. This script, wired into the npm
   `predev` hook, fixes it in one step:

     1. If vite (or node_modules) is missing → run `npm install` once.
     2. If esbuild's platform binary is missing (npm's allowScripts gate can
        skip its postinstall) → run its install.js — the exact workaround the
        deploy pipeline uses (/root/deploy-n10.sh).

   Safe to run any time: it is a no-op when everything is already present.
   --------------------------------------------------------------------------- */
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const has = (p) => existsSync(join(HERE, p));

/* ── 1. npm install when deps are missing ───────────────────────────────── */
if (!has('node_modules/vite') || !has('node_modules/.bin/vite')) {
  console.log('node_modules missing — running npm install (one-time, may take a minute)…');
  const r = spawnSync('npm', ['install', '--no-audit', '--no-fund'], { cwd: HERE, stdio: 'inherit', shell: process.platform === 'win32' });
  if (r.status !== 0) {
    console.error('npm install failed — please run `npm install` manually and retry.');
    process.exit(1);
  }
}

/* ── 2. esbuild platform binary (vite's dependency) ─────────────────────── */
/* npm's allowScripts gate can skip esbuild's postinstall, leaving vite
   unable to start (deploy pipeline hits this too — same workaround).
   esbuild nests under vite (node_modules/vite/node_modules/esbuild) but can
   also be hoisted — check BOTH possible binary locations before repairing. */
const esbuildPkg = `${process.platform}-${process.arch}`;      // e.g. win32-x64
const esbuildBin = process.platform === 'win32' ? 'esbuild.exe' : 'esbuild';
/* unix packages keep the binary at bin/esbuild; win32 at the package root */
const binaryCandidates = [
  `node_modules/vite/node_modules/@esbuild/${esbuildPkg}/bin/${esbuildBin}`,
  `node_modules/vite/node_modules/@esbuild/${esbuildPkg}/${esbuildBin}`,
  `node_modules/@esbuild/${esbuildPkg}/bin/${esbuildBin}`,
  `node_modules/@esbuild/${esbuildPkg}/${esbuildBin}`
];
if (!binaryCandidates.some(has)) {
  const installers = [
    'node_modules/vite/node_modules/esbuild/install.js',
    'node_modules/esbuild/install.js'
  ];
  const inst = installers.find(has);
  if (inst) {
    console.log(`esbuild binary missing (${esbuildPkg}) — running its installer…`);
    const r = spawnSync(process.execPath, [join(HERE, inst)], { cwd: HERE, stdio: 'inherit' });
    if (r.status !== 0 || !binaryCandidates.some(has))
      console.error('esbuild still missing — run `npm install` manually if vite won\'t start.');
  } else {
    console.warn('esbuild binary missing and no install.js found — run `npm install` manually.');
  }
}

console.log('dependencies OK');
