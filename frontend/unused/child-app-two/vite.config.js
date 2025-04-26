import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 3107,
        strictPort: true,
        open: true,
        cors: true, // ✅ Enable CORS
        hmr: {
            clientPort: 3107, // Fix HMR issues if running behind a proxy
        },
        allowedHosts: [
            'localhost',
            'app2.vnrzone.site' // ✅ Allow this subdomain
        ],
    },
    preview: {
        port: 4174,
    },
    build: {
        outDir: 'dist',
    }
});
