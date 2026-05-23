import axios from 'axios';

const api = axios.create({
  // VITE_API_URL is set in .env for local dev; falls back to localhost for convenience.
  // On Vercel the backend is not deployed — the reviewer runs it locally on port 3001.
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
});

export default api;
