import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getMe } from '@services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try fetching current user from backend session cookies
    (async () => {
      try {
        const me = await getMe();
        if (me) {
          const normalized = { ...me, role: (me?.role || '').toLowerCase() };
          setUser(normalized);

          try {
            // store full user (existing behaviour)
            localStorage.setItem('user', JSON.stringify(normalized));
            // ⭐ NEW: store ID + role for AI backend
            if (normalized.id) {
              localStorage.setItem('sensee_user_id', normalized.id);
            }
            if (normalized.role) {
              localStorage.setItem('sensee_role', normalized.role);
            }
          } catch {}
        }
      } catch (e) {
        // Not logged in or endpoint unavailable; fall back to localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          const normalized = { ...parsed, role: (parsed?.role || '').toLowerCase() };
          setUser(normalized);

          // ⭐ Ensure AI keys are also present when restoring from localStorage
          try {
            if (normalized.id) {
              localStorage.setItem('sensee_user_id', normalized.id);
            }
            if (normalized.role) {
              localStorage.setItem('sensee_role', normalized.role);
            }
          } catch {}
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    try {
      const loggedInUser = await apiLogin(email, password);
      console.log('🔐 [AuthContext] Login response:', loggedInUser);
      const normalized = { ...loggedInUser, role: (loggedInUser?.role || '').toLowerCase() };
      console.log('🔐 [AuthContext] Normalized user:', normalized);
      setUser(normalized);

      try {
        // existing behaviour
        localStorage.setItem('user', JSON.stringify(normalized));
        // ⭐ NEW: AI keys
        if (normalized.id) {
          localStorage.setItem('sensee_user_id', normalized.id);
        }
        if (normalized.role) {
          localStorage.setItem('sensee_role', normalized.role);
        }
      } catch {}

      return { success: true, user: normalized };
    } catch (error) {
      const message = error?.data?.message || error?.message || 'Login failed';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try { await apiLogout(); } catch {}
    setUser(null);
    localStorage.removeItem('user');

    // ⭐ NEW: clear AI-related keys on logout
    localStorage.removeItem('sensee_user_id');
    localStorage.removeItem('sensee_role');
  };

  const updateUserProfile = async (updatedUser) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll update localStorage and state
      const normalized = { ...updatedUser, role: (updatedUser?.role || '').toLowerCase() };
      setUser(normalized);
      localStorage.setItem('user', JSON.stringify(normalized));

      // ⭐ Keep AI role key in sync if role changes
      try {
        if (normalized.role) {
          localStorage.setItem('sensee_role', normalized.role);
        }
        // id shouldn't change, but if it's present, ensure it's set
        if (normalized.id) {
          localStorage.setItem('sensee_user_id', normalized.id);
        }
      } catch {}

      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: error.message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!user) return { success: false, error: 'No user logged in' };
    if (user.password !== currentPassword) {
      return { success: false, error: 'Current password is incorrect' };
    }
    // TODO: Replace with backend password update call.
    const updatedUser = { ...user, password: newPassword };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser)); // retain minimal session persistence
    return { success: true, message: 'Password changed (local only, no backend)' };
  };

  const value = {
    user,
    login,
    logout,
    loading,
    updateUserProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
