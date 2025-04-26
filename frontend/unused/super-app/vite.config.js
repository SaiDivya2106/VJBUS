import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Super App Config
export default defineConfig({
  plugins: [react()],
  server:{
    host: '0.0.0.0',
    port:3102,
    allowedHosts: [
      '127.0.0.1', // or 'localhost' - Important for dev server access
      '103.248.208.119', 
      'superapp.vnrzone.site',
    ],
  }
})
