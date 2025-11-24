import React, { createContext, useContext, useState } from 'react';

const AnnouncementContext = createContext();

export const useAnnouncements = () => {
  const context = useContext(AnnouncementContext);
  if (!context) {
    throw new Error('useAnnouncements must be used within an AnnouncementProvider');
  }
  return context;
};

export const AnnouncementProvider = ({ children }) => {
  // TODO: Replace sample data with backend-fetched announcements/forms.
  const sampleAnnouncements = [
    {
      id: 1,
      title: "Welcome to New Semester",
      content: "We're excited to welcome you all back for another semester of growth and learning. Remember, your mental health is just as important as your academic success.",
      date: new Date().toISOString().split('T')[0],
      visible: true,
      views: 234,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: "Mental Health Awareness Week",
      content: "Join us for a special week dedicated to mental health awareness and support. Various workshops and group sessions will be available.",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      visible: true,
      views: 456,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
  const [announcements, setAnnouncements] = useState(sampleAnnouncements);
  const [forms, setForms] = useState([]);

  const addAnnouncement = (announcement) => {
    const newAnnouncement = {
      ...announcement,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      views: 0,
      createdAt: new Date().toISOString()
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
  };

  const updateAnnouncement = (id, updates) => {
    setAnnouncements(prev => 
      prev.map(announcement => 
        announcement.id === id 
          ? { ...announcement, ...updates }
          : announcement
      )
    );
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
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
    return announcements.filter(announcement => announcement.visible);
  };

  const getRecentAnnouncements = (limit = 3) => {
    return getVisibleAnnouncements()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  };

  const incrementViews = (id) => {
    const target = announcements.find(a => a.id === id);
    if (!target) return;
    updateAnnouncement(id, { views: (target.views || 0) + 1 });
  };

  const value = {
    announcements,
    forms,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    addForm,
    getVisibleAnnouncements,
    getRecentAnnouncements,
    incrementViews
  };

  return (
    <AnnouncementContext.Provider value={value}>
      {children}
    </AnnouncementContext.Provider>
  );
};