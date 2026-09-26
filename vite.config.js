import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    watch: {
      ignored: ['**/dist/**', '**/node_modules/**']
    }
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer({})
      ],
    }
  },
  build: {
    target: ['es2015', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    emptyOutDir: false,
    chunkSizeWarningLimit: 2000
  },
  resolve: {
    alias: {
      'lucide-react': path.resolve('./node_modules/lucide-react/dist/esm/lucide-react.mjs'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  }
});
