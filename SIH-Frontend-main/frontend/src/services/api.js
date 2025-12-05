import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const API_BASE = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for unified error shape
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network or timeout errors
    if (!error.response) {
      const code = error.code;
      const isTimeout = code === 'ECONNABORTED';
      const message = isTimeout
        ? 'Request timed out. Please try again.'
        : 'Cannot connect to backend. Is the server running?';
      return Promise.reject({ status: 0, message, data: null });
    }
    const status = error.response.status;
    // Prefer standardized backend error shape
    const serverPayload = error.response.data;
    const message = serverPayload?.error?.message || serverPayload?.message || error.message || 'Request failed';
    return Promise.reject({ status, message, data: serverPayload });
  }
);

export default api;
