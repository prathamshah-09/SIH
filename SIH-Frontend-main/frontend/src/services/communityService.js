import api from './api';

// ==================== STUDENT ENDPOINTS ====================

/**
 * Get all communities (joined + available) for student
 * @returns {Promise<Array>} Array of communities with is_joined flag
 */
export const getStudentAllCommunities = async () => {
  try {
    const response = await api.get('/student/communities/all');
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching all communities:', error);
    throw error;
  }
};

/**
 * Get joined communities for student
 * @returns {Promise<Array>} Array of joined communities
 */
export const getStudentJoinedCommunities = async () => {
  try {
    const response = await api.get('/student/communities/joined');
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching joined communities:', error);
    throw error;
  }
};

/**
 * Get available communities (not joined yet) for student
 * @returns {Promise<Array>} Array of available communities
 */
export const getStudentAvailableCommunities = async () => {
  try {
    const response = await api.get('/student/communities/available');
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching available communities:', error);
    throw error;
  }
};

/**
 * Join a community as student
 * @param {string} communityId - UUID of the community
 * @returns {Promise<Object>} Membership data
 */
export const studentJoinCommunity = async (communityId) => {
  try {
    const response = await api.post(`/student/communities/${communityId}/join`);
    return response.data?.data || {};
  } catch (error) {
    console.error('Error joining community:', error);
    throw error;
  }
};

/**
 * Leave a community as student
 * @param {string} communityId - UUID of the community
 * @returns {Promise<Object>} Success message
 */
export const studentLeaveCommunity = async (communityId) => {
  try {
    const response = await api.delete(`/student/communities/${communityId}/leave`);
    return response.data || {};
  } catch (error) {
    console.error('Error leaving community:', error);
    throw error;
  }
};

/**
 * Get messages for a community as student
 * @param {string} communityId - UUID of the community
 * @param {number} limit - Number of messages to fetch (default 50)
 * @param {string} before - Message ID for pagination (optional)
 * @returns {Promise<Array>} Array of messages
 */
export const getStudentCommunityMessages = async (communityId, limit = 50, before = null) => {
  try {
    let url = `/student/communities/${communityId}/messages?limit=${limit}`;
    if (before) {
      url += `&before=${before}`;
    }
    const response = await api.get(url);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching community messages:', error);
    throw error;
  }
};

// ==================== COUNSELLOR ENDPOINTS ====================

/**
 * Get all communities (joined + available) for counsellor
 * @returns {Promise<Array>} Array of communities with is_joined flag
 */
export const getCounsellorAllCommunities = async () => {
  try {
    const response = await api.get('/counsellor/communities/all');
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching all communities:', error);
    throw error;
  }
};

/**
 * Get joined communities for counsellor
 * @returns {Promise<Array>} Array of joined communities
 */
export const getCounsellorJoinedCommunities = async () => {
  try {
    const response = await api.get('/counsellor/communities/joined');
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching joined communities:', error);
    throw error;
  }
};

/**
 * Get available communities (not joined yet) for counsellor
 * @returns {Promise<Array>} Array of available communities
 */
export const getCounsellorAvailableCommunities = async () => {
  try {
    const response = await api.get('/counsellor/communities/available');
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching available communities:', error);
    throw error;
  }
};

/**
 * Join a community as counsellor
 * @param {string} communityId - UUID of the community
 * @returns {Promise<Object>} Membership data
 */
export const counsellorJoinCommunity = async (communityId) => {
  try {
    const response = await api.post(`/counsellor/communities/${communityId}/join`);
    return response.data?.data || {};
  } catch (error) {
    console.error('Error joining community:', error);
    throw error;
  }
};

/**
 * Leave a community as counsellor
 * @param {string} communityId - UUID of the community
 * @returns {Promise<Object>} Success message
 */
export const counsellorLeaveCommunity = async (communityId) => {
  try {
    const response = await api.delete(`/counsellor/communities/${communityId}/leave`);
    return response.data || {};
  } catch (error) {
    console.error('Error leaving community:', error);
    throw error;
  }
};

/**
 * Get messages for a community as counsellor
 * @param {string} communityId - UUID of the community
 * @param {number} limit - Number of messages to fetch (default 50)
 * @param {string} before - Message ID for pagination (optional)
 * @returns {Promise<Array>} Array of messages
 */
export const getCounsellorCommunityMessages = async (communityId, limit = 50, before = null) => {
  try {
    let url = `/counsellor/communities/${communityId}/messages?limit=${limit}`;
    if (before) {
      url += `&before=${before}`;
    }
    const response = await api.get(url);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching community messages:', error);
    throw error;
  }
};

// ==================== ADMIN ENDPOINTS ====================

/**
 * Get statistics for admin
 * @returns {Promise<Object>} Statistics object
 */
export const getAdminCommunityStatistics = async () => {
  try {
    const response = await api.get('/admin/communities/statistics');
    return response.data?.data || {};
  } catch (error) {
    console.error('Error fetching community statistics:', error);
    throw error;
  }
};

/**
 * Get all communities for admin
 * @returns {Promise<Array>} Array of communities
 */
export const getAdminAllCommunities = async () => {
  try {
    const response = await api.get('/admin/communities');
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching communities:', error);
    throw error;
  }
};

/**
 * Get community details for admin
 * @param {string} communityId - UUID of the community
 * @returns {Promise<Object>} Community details
 */
export const getAdminCommunityDetails = async (communityId) => {
  try {
    const response = await api.get(`/admin/communities/${communityId}`);
    return response.data?.data || {};
  } catch (error) {
    console.error('Error fetching community details:', error);
    throw error;
  }
};

/**
 * Create a new community as admin
 * @param {string} title - Community title
 * @param {string} description - Community description
 * @returns {Promise<Object>} Created community
 */
export const createCommunity = async (title, description) => {
  try {
    const response = await api.post('/admin/communities', {
      title,
      description
    });
    return response.data?.data || {};
  } catch (error) {
    console.error('Error creating community:', error);
    throw error;
  }
};

/**
 * Update a community as admin
 * @param {string} communityId - UUID of the community
 * @param {Object} updates - { title?, description? }
 * @returns {Promise<Object>} Updated community
 */
export const updateCommunity = async (communityId, updates) => {
  try {
    const response = await api.put(`/admin/communities/${communityId}`, updates);
    return response.data?.data || {};
  } catch (error) {
    console.error('Error updating community:', error);
    throw error;
  }
};

/**
 * Delete a community as admin
 * @param {string} communityId - UUID of the community
 * @returns {Promise<Object>} Success message
 */
export const deleteCommunity = async (communityId) => {
  try {
    const response = await api.delete(`/admin/communities/${communityId}`);
    return response.data || {};
  } catch (error) {
    console.error('Error deleting community:', error);
    throw error;
  }
};

/**
 * Get messages for a community as admin
 * @param {string} communityId - UUID of the community
 * @param {number} limit - Number of messages to fetch (default 100)
 * @returns {Promise<Array>} Array of messages
 */
export const getAdminCommunityMessages = async (communityId, limit = 100) => {
  try {
    const response = await api.get(`/admin/communities/${communityId}/messages?limit=${limit}`);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching community messages:', error);
    throw error;
  }
};
