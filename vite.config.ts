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
    // Explicitly allow ngrok hosts
    hmr: {
      clientPort: 443
    },
    allowedHosts : true,
    // This will allow any host to access the dev server
    // For security in production, you would want to be more restrictive
    cors: true,
  },
})
