import { ConversationSession } from '../engine/conversationManager.js';
const sessions = new Map();
export function registerChatHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`[Socket] User connected (id: ${socket.id})`);
    const session = new ConversationSession(socket.id);
    sessions.set(socket.id, session);
    socket.on('chat', async (msg = {}) => {
      try {
        console.log('[Socket] Incoming chat payload:', msg);
        const text = (msg.message || '').toString();
        if (msg.finaaal && typeof msg.finaaal === 'object') {
          Object.assign(session.criteria, msg.finaaal);
        }
        const result = await session.processMessage(text);
        socket.emit('response', {
          l: result.message,
          phasechange: 0,
          toparse: result.criteria,
          isFinished: result.isFinished,
          criteriaCount: Object.keys(result.criteria).length
        });
      } catch (err) {
        console.error('[Socket] Error processing chat event:', err);
        socket.emit('response', {
          l: 'Something went wrong while processing your request. Type "restart" to try again.',
          phasechange: 0,
          toparse: session.criteria,
          isFinished: false
        });
      }
    });
    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected (id: ${socket.id})`);
      sessions.delete(socket.id);
    });
  });
}
