import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PORT, FRONTEND_URL } from './src/config/index.js';
import { registerChatHandlers } from './src/sockets/chatHandler.js';
const app = express();
const httpServer = createServer(app);
const __dirname = dirname(fileURLToPath(import.meta.url));
const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});
app.use(express.static(join(__dirname, 'public')));
registerChatHandlers(io);
httpServer.listen(PORT, () => {
  console.log(`[Zephyrion Backend] Server running at http://localhost:${PORT}`);
});