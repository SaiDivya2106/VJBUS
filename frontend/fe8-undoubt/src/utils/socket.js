import { io } from "socket.io-client";

// Use `wss://` for secure WebSocket connection
const SOCKET_SERVER_URL = "wss://103.248.208.119:6108";  // Correct URL

const socket = io(SOCKET_SERVER_URL, {
  path: "/socket.io/",  // Ensure correct path for WebSocket
  transports: ["websocket"],  // Force WebSocket (polling should be avoided if Cloudflare proxies requests)
  withCredentials: true, // Cloudflare may block cross-origin credentials, so set to `false`
  reconnection: true, // Auto-reconnect on failure
  reconnectionAttempts: 5, // Number of retry attempts
  reconnectionDelay: 2000, // Delay between reconnection attempts (in ms)
  timeout: 5000, // Set a connection timeout
});

export default socket;
