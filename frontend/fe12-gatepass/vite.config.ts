import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        host: 'localhost',
        port: 3112,
        strictPort: true,
        open: true,
        cors: true, // ✅ Enable CORS
	hmr: {
            protocol: 'ws',
            host: 'dev-gatepass.vjstartup.com',
            port: 3112  // Changed from 3136 to match server port
        },
        allowedHosts: [
            'gatepass.vjstartup.com', // ✅ Allow this subdomain
            'dev-gatepass.vjstartup.com', // ✅ Allow this subdomain
        ],
    },
    define: {
        global: 'window',
    },
});

