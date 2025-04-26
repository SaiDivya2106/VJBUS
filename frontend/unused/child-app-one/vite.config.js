import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 3106,
        strictPort: true,
        open: true,
        cors: true, // ✅ Enable CORS
        hmr: {
            clientPort: 3106, // Fix HMR issues if running behind a proxy
        },
        allowedHosts: [
            'localhost',
            'app1.vnrzone.site' // ✅ Allow this subdomain
        ],
    },
    preview: {
        port: 4173,
    },
    build: {
        outDir: 'dist',
    }
});
