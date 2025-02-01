import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import utf8Plugin from './src/plugins/vite-utf8-plugin';

export default defineConfig({
  plugins: [react(), utf8Plugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        inlineDynamicImports: false,
        strict: true,
        format: 'es'
      }
    },
    target: 'esnext',
    minify: 'esbuild'
  }
});
