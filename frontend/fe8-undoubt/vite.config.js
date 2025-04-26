import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // Allow connections from the local network
    port: 3108, // Specify the port (default is 5173)
    // cors: true, // ✅ Enable CORS
  
    allowedHosts: [
      'localhost',
      'questions.vnrzone.site',
      'undoubt.vnrzone.site' // ✅ Allow this subdomain
    ],
  },
  
})


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import tailwindcss from '@tailwindcss/vite';

// // Load environment variables
// const SOCKET_SERVER_URL = process.env.VITE_SOCKET_SERVER_URL || "https://undoubt.vnrzone.site";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     host: '0.0.0.0', // Allow connections from the local network
//     port: 3108, // Change this if needed
//     cors: true,
//     allowedHosts: [
//       'localhost',
//       'undoubt.vnrzone.site' // ✅ Allow this subdomain
//     ],
//     hmr: {
//       protocol: 'wss',
//       host: 'undoubt.vnrzone.site',
//       port: 3108  // Changed from 3136 to match server port
//     },
//     proxy: {
//       '/socket.io': {
//         target: SOCKET_SERVER_URL, // ✅ Use environment variable for WebSockets
//         ws: true, // Enable WebSockets
//         changeOrigin: true,
//         secure: true,
//       }
//     }
//   },
// });