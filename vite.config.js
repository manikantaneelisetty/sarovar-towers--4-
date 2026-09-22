import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true
  },
  build: {
    // Don't try to remove/empty the existing `dist` folder.
    // This avoids failures on filesystems without ACL support or when
    // specific subfolders are locked by other processes.
    emptyOutDir: false
  }
})
