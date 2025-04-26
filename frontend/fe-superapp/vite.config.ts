import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: [
	    '127.0.0.1',
	    '103.248.208.119',
	    'superapp.vnrzone.site'
    ],
    port: 3103, // Change the port number here
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
