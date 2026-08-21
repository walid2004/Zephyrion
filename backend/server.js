import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PORT } from './src/config/index.js';
import { registerChatHandlers } from './src/sockets/chatHandler.js';

const app = express();
const httpServer = createServer(app);
const __dirname = dirname(fileURLToPath(import.meta.url));

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(express.static(join(__dirname, 'public')));

registerChatHandlers(io);

app.use((req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`[Zephyrion Backend] Server running on 0.0.0.0:${PORT}`);
});