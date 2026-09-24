import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer({})
      ],
    }
  },
  build: {
    // Increase browser compatibility for JavaScript
    target: ['es2015', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    // Don't try to remove/empty the existing `dist` folder.
    // This avoids failures on filesystems without ACL support or when
    // specific subfolders are locked by other processes.
    emptyOutDir: false
  }
})
