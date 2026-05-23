import axios from 'axios';

const api = axios.create({
  // Production: VITE_API_URL is set in Vercel env vars (points to Render backend).
  // Local dev: falls back to localhost:3001.
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
});

export default api;
