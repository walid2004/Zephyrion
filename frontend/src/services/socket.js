import io from 'socket.io-client';
const backendUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:4000' : '');
const socket = io(backendUrl, {
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});
export default socket;
