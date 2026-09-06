import { defineConfig } from 'vite';

export default defineConfig({
  root: 'v2',
  base: './',
  server: { host: '0.0.0.0', port: 4173, strictPort: true, allowedHosts: ['terminal.local'] },
  build: { outDir: '../dist', emptyOutDir: true, target: 'es2022' },
});
