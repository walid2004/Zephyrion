import io from 'socket.io-client';

function getBackendUrl() {
  if (typeof window !== 'undefined') {
    if (import.meta.env.VITE_BACKEND_URL) {
      return import.meta.env.VITE_BACKEND_URL;
    }
    if (import.meta.env.DEV) {
      return 'http://localhost:4000';
    }
    return window.location.origin;
  }
  return '';
}

const socket = io(getBackendUrl(), {
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000
});

export default socket;
