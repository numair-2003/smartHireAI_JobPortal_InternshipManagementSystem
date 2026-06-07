import { io } from 'socket.io-client';

const AZURE_SOCKET_URL = 'https://smarthire-ai-backend-numairfahad-fcacdxh4b2guehgc.uaenorth-01.azurewebsites.net';
const isVercelHost = typeof window !== 'undefined' && window.location.hostname.endsWith('.vercel.app');
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || (isVercelHost ? AZURE_SOCKET_URL : 'http://localhost:5000');

let socket = null;

export const connectSocket = (userId) => {
  if (!userId) return null;
  if (!socket) {
    socket = io(SOCKET_URL);
  }
  socket.emit('join', userId);
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
