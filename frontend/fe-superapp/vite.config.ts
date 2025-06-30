import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'   // https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port:3103,
    allowedHosts: [
	    '127.0.0.1',
	    '103.248.208.119',
	    'superapp.vjstartup.com',
	    'dev-superapp.vjstartup.com'
    ],
    hmr: {
      protocol: 'wss',
      host: 'dev-superapp.vjstartup.com',
      port: 3103,
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
