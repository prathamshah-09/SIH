import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  createAnnouncement as apiCreateAnnouncement,
  getAdminAnnouncements as apiGetAdminAnnouncements,
  updateAnnouncement as apiUpdateAnnouncement,
  deleteAnnouncement as apiDeleteAnnouncement,
  getUserAnnouncements as apiGetUserAnnouncements,
  markAnnouncementSeen as apiMarkAnnouncementSeen,
  transformAnnouncementForFrontend,
  transformAnnouncementForBackend
} from '../services/announcementApi';

const AnnouncementContext = createContext();

export const useAnnouncements = () => {
  const context = useContext(AnnouncementContext);
  if (!context) {
    throw new Error('useAnnouncements must be used within an AnnouncementProvider');
  }
  return context;
};

export const AnnouncementProvider = ({ children }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Determine user role for appropriate API calls
  const userRole = typeof window !== 'undefined' 
    ? localStorage.getItem('sensee_role') || 'student'
    : 'student';

  // Fetch announcements on mount based on role
  useEffect(() => {
    fetchAnnouncements();
  }, [userRole]);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (userRole === 'admin') {
        // Admin: fetch all announcements with pagination
        response = await apiGetAdminAnnouncements({ limit: 100 });
        const transformedAnnouncements = (response.data || []).map(transformAnnouncementForFrontend);
        setAnnouncements(transformedAnnouncements);
      } else {
        // Student/Counsellor: fetch visible announcements for their role
        response = await apiGetUserAnnouncements();
        const transformedAnnouncements = (response.data || []).map(transformAnnouncementForFrontend);
        setAnnouncements(transformedAnnouncements);
      }
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
      setError(err.message || 'Failed to load announcements');
      // Keep empty array on error
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  const addAnnouncement = async (announcementData) => {
    try {
      setLoading(true);
      setError(null);
      
      const backendPayload = transformAnnouncementForBackend(announcementData);
      console.log('Sending to backend:', backendPayload);
      const response = await apiCreateAnnouncement(backendPayload);
      
      const newAnnouncement = transformAnnouncementForFrontend(response.data);
      setAnnouncements(prev => [newAnnouncement, ...prev]);
      
      return { success: true, data: newAnnouncement };
    } catch (err) {
      console.error('Full error object:', err);
      console.error('Error response data:', err.data);
      
      // Extract validation errors from response
      if (err.data?.error?.details?.validation) {
        const validationErrors = err.data.error.details.validation;
        console.error('Validation errors:', validationErrors);
        const errorMessages = validationErrors.map(e => `${e.field}: ${e.message}`).join(', ');
        setError(errorMessages);
        return { success: false, error: errorMessages };
      }
      
      setError(err.message || 'Failed to create announcement');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateAnnouncement = async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      
      // Transform updates to backend format if needed
      const backendUpdates = {};
      if (updates.title) backendUpdates.title = updates.title;
      if (updates.content) backendUpdates.content = updates.content;
      if (updates.durationDays) backendUpdates.duration_days = updates.durationDays;
      if (updates.visible !== undefined) backendUpdates.is_active = updates.visible;
      if (updates.type) backendUpdates.type = updates.type;
      if (updates.targetRole) backendUpdates.target_role = updates.targetRole;
      
      const response = await apiUpdateAnnouncement(id, backendUpdates);
      const updatedAnnouncement = transformAnnouncementForFrontend(response.data);
      
      setAnnouncements(prev => 
        prev.map(announcement => 
          announcement.id === id ? updatedAnnouncement : announcement
        )
      );
      
      return { success: true, data: updatedAnnouncement };
    } catch (err) {
      console.error('Failed to update announcement:', err);
      setError(err.message || 'Failed to update announcement');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await apiDeleteAnnouncement(id);
      setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
      
      return { success: true };
    } catch (err) {
      console.error('Failed to delete announcement:', err);
      setError(err.message || 'Failed to delete announcement');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async (id) => {
    try {
      // Optimistically update UI
      setAnnouncements(prev => 
        prev.map(announcement => 
          announcement.id === id 
            ? { ...announcement, views: (announcement.views || 0) + 1, hasSeen: true }
            : announcement
        )
      );
      
      // Call backend to mark as seen
      const response = await apiMarkAnnouncementSeen(id);
      
      // Update with actual backend count
      if (response.data) {
        setAnnouncements(prev => 
          prev.map(announcement => 
            announcement.id === id 
              ? { ...announcement, views: response.data.seen_count, hasSeen: true }
              : announcement
          )
        );
      }
    } catch (err) {
      console.error('Failed to mark announcement as seen:', err);
      // Revert optimistic update on error
      await fetchAnnouncements();
    }
  };

  const addForm = (form) => {
    const newForm = {
      ...form,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      responses: 0
    };
    setForms(prev => [newForm, ...prev]);
  };

  const getVisibleAnnouncements = () => {
    return announcements.filter(announcement => announcement.visible !== false);
  };

  const getRecentAnnouncements = (limit = 3) => {
    return getVisibleAnnouncements()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  };

  const refreshAnnouncements = () => {
    return fetchAnnouncements();
  };

  const value = {
    announcements,
    forms,
    loading,
    error,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    addForm,
    getVisibleAnnouncements,
    getRecentAnnouncements,
    incrementViews,
    refreshAnnouncements
  };

  return (
    <AnnouncementContext.Provider value={value}>
      {children}
    </AnnouncementContext.Provider>
  );
};