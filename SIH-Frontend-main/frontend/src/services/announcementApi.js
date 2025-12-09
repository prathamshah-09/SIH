import api from './api';

/**
 * Announcements API Service
 * Handles all announcement-related API calls for Admin, Student, and Counsellor roles
 */

// ============= ADMIN ENDPOINTS =============

/**
 * Create a new announcement (Admin only)
 * @param {Object} announcementData - { title, content, duration_days, type?, target_role? }
 * @returns {Promise<Object>} Created announcement with seen_count
 */
export const createAnnouncement = async (announcementData) => {
  const response = await api.post('/admin/announcements', announcementData);
  return response.data;
};

/**
 * Get all announcements with pagination (Admin only)
 * @param {Object} params - { page?, limit?, type?, is_active? }
 * @returns {Promise<Object>} Paginated list with seen_count for each
 */
export const getAdminAnnouncements = async (params = {}) => {
  const response = await api.get('/admin/announcements', { params });
  return response.data;
};

/**
 * Update an announcement (Admin only)
 * @param {string} announcementId - UUID of announcement
 * @param {Object} updates - Fields to update (title, content, duration_days, is_active, etc.)
 * @returns {Promise<Object>} Updated announcement
 */
export const updateAnnouncement = async (announcementId, updates) => {
  const response = await api.put(`/admin/announcements/${announcementId}`, updates);
  return response.data;
};

/**
 * Delete an announcement (Admin only)
 * @param {string} announcementId - UUID of announcement
 * @returns {Promise<Object>} Success response
 */
export const deleteAnnouncement = async (announcementId) => {
  const response = await api.delete(`/admin/announcements/${announcementId}`);
  return response.data;
};

// ============= STUDENT/COUNSELLOR ENDPOINTS =============

/**
 * Get announcements visible to current user (Student/Counsellor)
 * Filters by role automatically and returns only active, non-expired announcements
 * @returns {Promise<Object>} List of announcements with seen_count and has_seen flags
 */
export const getUserAnnouncements = async () => {
  // Determine role from localStorage or context
  const userRole = localStorage.getItem('sensee_user_role') || 'student';
  const endpoint = userRole === 'counsellor' ? '/counsellor/announcements' : '/student/announcements';
  
  const response = await api.get(endpoint);
  return response.data;
};

/**
 * Mark an announcement as seen (Student/Counsellor)
 * Increments the seen count for that announcement
 * @param {string} announcementId - UUID of announcement
 * @returns {Promise<Object>} Updated view stats
 */
export const markAnnouncementSeen = async (announcementId) => {
  // Determine role from localStorage or context
  const userRole = localStorage.getItem('sensee_user_role') || 'student';
  const endpoint = userRole === 'counsellor' 
    ? `/counsellor/announcements/${announcementId}/seen`
    : `/student/announcements/${announcementId}/seen`;
  
  const response = await api.post(endpoint);
  return response.data;
};

// ============= HELPER FUNCTIONS =============

/**
 * Transform backend announcement response to match frontend expectations
 * @param {Object} backendAnnouncement - Raw backend response
 * @returns {Object} Formatted announcement for frontend
 */
export const transformAnnouncementForFrontend = (backendAnnouncement) => {
  return {
    id: backendAnnouncement.id,
    title: backendAnnouncement.title,
    content: backendAnnouncement.content,
    type: backendAnnouncement.type || 'info',
    targetRole: backendAnnouncement.target_role || 'all',
    durationDays: backendAnnouncement.duration_days,
    expiresAt: backendAnnouncement.expires_at,
    isActive: backendAnnouncement.is_active,
    isPinned: backendAnnouncement.is_pinned || false,
    seenCount: backendAnnouncement.seen_count || 0,
    hasSeen: backendAnnouncement.has_seen || false,
    createdAt: backendAnnouncement.created_at,
    createdBy: backendAnnouncement.created_by,
    date: new Date(backendAnnouncement.created_at).toLocaleDateString(),
    visible: backendAnnouncement.is_active,
    views: backendAnnouncement.seen_count || 0
  };
};

/**
 * Transform frontend announcement data to backend format
 * @param {Object} frontendData - Form data from frontend
 * @returns {Object} Backend-compatible payload
 */
export const transformAnnouncementForBackend = (frontendData) => {
  // Ensure all required fields are present and correctly typed
  return {
    title: String(frontendData.title || ''),
    content: String(frontendData.content || ''),
    duration_days: Number(frontendData.durationDays ?? frontendData.duration_days ?? 7),
    type: String(frontendData.type || 'info'),
    target_role: String(frontendData.targetRole || frontendData.target_role || 'all')
  };
};

export default {
  createAnnouncement,
  getAdminAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  getUserAnnouncements,
  markAnnouncementSeen,
  transformAnnouncementForFrontend,
  transformAnnouncementForBackend
};
