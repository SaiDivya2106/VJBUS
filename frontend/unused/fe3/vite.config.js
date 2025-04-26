import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server:{
    host: '0.0.0.0',
    port:3000,
    allowedHosts: [
      '127.0.0.1', // or 'localhost' - Important for dev server access
      'bus.vnrzone.site', // Add your other domains here as well
      'campus.vnrzone.site',  // Add this line!
      '103.248.208.119' 
      
    ],
  }
})
