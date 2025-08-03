import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3105,
    allowedHosts: [
      'be6e73b61a33.ngrok-free.app',
      'dev-wall.vjstartup.com'
    ]
  }
})
