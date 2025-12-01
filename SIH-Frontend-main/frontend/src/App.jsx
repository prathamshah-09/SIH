import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@context/AuthContext";
import { ThemeProvider } from "@context/ThemeContext";
import { LanguageProvider } from "@context/LanguageContext";
import { AnnouncementProvider } from "@context/AnnouncementContext";
import { Toaster } from "@components/ui/toaster";
import Login from "@components/auth/Login";
import StudentDashboard from "@components/dashboard/StudentDashboard";
import CounsellorDashboard from "@components/dashboard/CounsellorDashboard";
import AdminDashboard from "@components/dashboard/AdminDashboard";
import AICompanion from '@components/ai/AICompanion';
import JournalingPage from '@components/wellness/JournalingPage';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Component that persists the current pathname and restores it after refresh
const RoutePathPersistence = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Save path on change
  useEffect(() => {
    try { localStorage.setItem('last_path', location.pathname + location.search); } catch (e) {}
  }, [location.pathname, location.search]);

  // On mount, if user is logged in and there's a saved path different from current, navigate there
  useEffect(() => {
    try {
      const last = localStorage.getItem('last_path');
      // Only restore saved path when the app is at the root/login on mount.
      // This prevents forcing navigation away when the user refreshes a specific page.
      if (last && user) {
        const isAtAuthEntry = location.pathname === '/' || location.pathname.startsWith('/login');
        if (isAtAuthEntry && last !== location.pathname && !last.startsWith('/login')) {
          navigate(last, { replace: true });
        }
      }
    } catch (e) {}
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return null;
};
 
// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full animate-pulse mx-auto mb-6 flex items-center justify-center shadow-2xl">
              <div className="w-10 h-10 bg-white rounded-full animate-ping"></div>
            </div>
            <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-spin mx-auto opacity-30"></div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">SensEase</h3>
          <p className="text-gray-600 text-lg">Loading your wellness space...</p>
          <div className="mt-4 flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles) {
    const allowed = allowedRoles.map(r => r.toLowerCase());
    const role = (user?.role || '').toLowerCase();
    if (!allowed.includes(role)) {
      return <Navigate to="/login" replace />;
    }
  }
  
  return children;
};

// Main App Component
function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AnnouncementProvider>
          <AuthProvider>
            <div className="App">
            <BrowserRouter>
              <RoutePathPersistence />
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected Routes */}
                <Route 
                  path="/student-dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/counsellor-dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['counsellor']}>
                      <CounsellorDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/admin-dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />

                {/* AI Companion - available to all authenticated users */}
                <Route
                  path="/ai-companion"
                  element={
                    <ProtectedRoute>
                      <AICompanion />
                    </ProtectedRoute>
                  }
                />

                {/* Journaling pages (current/past/daily/weekly) */}
                <Route
                  path="/journaling/:mode"
                  element={
                    <ProtectedRoute>
                      <JournalingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/journaling"
                  element={
                    <ProtectedRoute>
                      <JournalingPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Default Route */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </BrowserRouter>
            
            {/* Toast notifications */}
            <Toaster />
            </div>
          </AuthProvider>
        </AnnouncementProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;