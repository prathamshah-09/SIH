import api from './api';

export async function login(email, password) {
  const res = await api.post('/auth/login', { email, password });
  const userData = res.data?.data || res.data;
  
  // Store JWT token if provided by backend
  if (userData?.token) {
    try {
      localStorage.setItem('authToken', userData.token);
    } catch (e) {
      console.warn('Failed to store authToken', e);
    }
  }
  
  return userData;
}

export async function logout() {
  await api.post('/auth/logout');
  // Clear JWT token on logout
  try {
    localStorage.removeItem('authToken');
  } catch (e) {
    console.warn('Failed to remove authToken', e);
  }
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
