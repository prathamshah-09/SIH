import api from './api';

export async function login(email, password) {
  const res = await api.post('/auth/login', { email, password });
  // Backend sets cookies; return user payload
  return res.data?.data || res.data;
}

export async function logout() {
  await api.post('/auth/logout');
}

export async function getMe(roleHint) {
  // Try role-specific profile endpoints if needed later; for now use /auth/me if available
  try {
    const res = await api.get('/auth/me');
    return res.data?.data || res.data;
  } catch (e) {
    // Fallbacks could be role endpoints
    throw e;
  }
}
