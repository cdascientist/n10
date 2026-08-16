import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Build output lands in dist/ — nginx serves /var/n10/dist.
// Dev server: npm run dev (also VS Code F5) → http://localhost:3000.
// Port 3000 is pinned (strictPort) so a busy port fails loudly instead of
// silently moving to 3001 — the README, .vscode/launch.json and the client's
// test flow all expect localhost:3000 exactly.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
