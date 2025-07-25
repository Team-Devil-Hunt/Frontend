import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // Allow all hosts including ngrok tunnels
    host: true,
    // Completely disable WebSocket and HMR
    hmr: false,
    ws: false,
    // Allow any host to access the dev server
    cors: true,
    strictPort: true,
    // Explicitly set allowed hosts to all (including ngrok tunnels)
    allowedHosts: true,
  },
})
