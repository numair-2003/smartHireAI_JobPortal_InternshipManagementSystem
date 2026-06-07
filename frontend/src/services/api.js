import axios from 'axios';

const AZURE_API_URL = 'https://smarthire-ai-backend-numairfahad-fcacdxh4b2guehgc.uaenorth-01.azurewebsites.net';
const isVercelHost = typeof window !== 'undefined' && window.location.hostname.endsWith('.vercel.app');
const API_URL = process.env.REACT_APP_API_URL || (isVercelHost ? AZURE_API_URL : 'http://localhost:5000');

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    localStorage.removeItem('user');
  }

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
