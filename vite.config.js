import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Build output lands in dist/ — nginx serves /var/n10/dist.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
