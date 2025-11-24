import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../mock/mockData';

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
    // Check if user is logged in (simulate checking localStorage/sessionStorage)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login logic
    const foundUser = Object.values(mockUsers).find(
      u => u.email === email && u.password === password
    );
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return { success: true, user: foundUser };
    } else {
      return { success: false, error: 'Invalid email or password' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUserProfile = async (updatedUser) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll update localStorage and state
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
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