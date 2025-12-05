import api from './api';

// ==================== STUDENT MESSAGING APIs ====================

/**
 * Get all conversations for a student
 * @returns {Promise<Array>} List of conversations with counsellors
 */
export const getStudentConversations = async () => {
  try {
    const response = await api.get('/student/conversations');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Failed to fetch student conversations:', error);
    throw error;
  }
};

/**
 * Get all available counsellors for messaging
 * @returns {Promise<Array>} List of counsellors
 */
export const getStudentCounsellorsForMessaging = async () => {
  try {
    const response = await api.get('/student/counsellors-for-messaging');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Failed to fetch counsellors:', error);
    throw error;
  }
};

/**
 * Create or get conversation with a counsellor
 * @param {Object} data - { counsellor_id: string }
 * @returns {Promise<Object>} Conversation object
 */
export const startConversation = async (data) => {
  try {
    console.log('Starting conversation with data:', data);
    const response = await api.post('/student/conversations', data);
    console.log('Conversation response:', response.data);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Failed to start conversation:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    // Throw a more detailed error
    const message = error.response?.data?.message || error.message || 'Unknown error';
    throw new Error(message);
  }
};

/**
 * Get a specific conversation by ID
 * @param {string} conversationId - UUID of the conversation
 * @returns {Promise<Object>} Conversation details
 */
export const getStudentConversationById = async (conversationId) => {
  try {
    const response = await api.get(`/student/conversations/${conversationId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Failed to fetch conversation:', error);
    throw error;
  }
};

/**
 * Get messages in a conversation
 * @param {string} conversationId - UUID of the conversation
 * @param {Object} params - { page?: number, limit?: number }
 * @returns {Promise<Object>} { messages: Array, pagination: Object }
 */
export const getStudentConversationMessages = async (conversationId, params = {}) => {
  try {
    const response = await api.get(`/student/conversations/${conversationId}/messages`, { params });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    throw error;
  }
};

/**
 * Mark messages in a conversation as read
 * @param {string} conversationId - UUID of the conversation
 * @returns {Promise<Object>} Success response
 */
export const markStudentMessagesAsRead = async (conversationId) => {
  try {
    const response = await api.put(`/student/conversations/${conversationId}/read`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Failed to mark messages as read:', error);
    throw error;
  }
};

/**
 * Get total unread message count for student
 * @returns {Promise<number>} Unread count
 */
export const getStudentUnreadCount = async () => {
  try {
    const response = await api.get('/student/messages/unread-count');
    return response.data.data?.count || response.data.count || 0;
  } catch (error) {
    console.error('Failed to fetch unread count:', error);
    return 0;
  }
};

/**
 * Delete a conversation
 * @param {string} conversationId - UUID of the conversation
 * @returns {Promise<Object>} Success response
 */
export const deleteStudentConversation = async (conversationId) => {
  try {
    const response = await api.delete(`/student/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete conversation:', error);
    throw error;
  }
};

// ==================== COUNSELLOR MESSAGING APIs ====================

/**
 * Get all conversations for a counsellor
 * @returns {Promise<Array>} List of conversations with students
 */
export const getCounsellorConversations = async () => {
  try {
    const response = await api.get('/counsellor/conversations');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Failed to fetch counsellor conversations:', error);
    throw error;
  }
};

/**
 * Create or get conversation with a student (counsellor-initiated)
 * @param {Object} data - { student_id: string }
 * @returns {Promise<Object>} Conversation object
 */
export const startConversationWithStudent = async (data) => {
  try {
    const response = await api.post('/counsellor/conversations', data);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Failed to start conversation with student:', error);
    throw error;
  }
};

/**
 * Get a specific conversation by ID (counsellor)
 * @param {string} conversationId - UUID of the conversation
 * @returns {Promise<Object>} Conversation details
 */
export const getCounsellorConversationById = async (conversationId) => {
  try {
    const response = await api.get(`/counsellor/conversations/${conversationId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Failed to fetch conversation:', error);
    throw error;
  }
};

/**
 * Get messages in a conversation (counsellor)
 * @param {string} conversationId - UUID of the conversation
 * @param {Object} params - { page?: number, limit?: number }
 * @returns {Promise<Object>} { messages: Array, pagination: Object }
 */
export const getCounsellorConversationMessages = async (conversationId, params = {}) => {
  try {
    const response = await api.get(`/counsellor/conversations/${conversationId}/messages`, { params });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    throw error;
  }
};

/**
 * Mark messages in a conversation as read (counsellor)
 * @param {string} conversationId - UUID of the conversation
 * @returns {Promise<Object>} Success response
 */
export const markCounsellorMessagesAsRead = async (conversationId) => {
  try {
    const response = await api.put(`/counsellor/conversations/${conversationId}/read`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Failed to mark messages as read:', error);
    throw error;
  }
};

/**
 * Get total unread message count for counsellor
 * @returns {Promise<number>} Unread count
 */
export const getCounsellorUnreadCount = async () => {
  try {
    const response = await api.get('/counsellor/messages/unread-count');
    return response.data.data?.count || response.data.count || 0;
  } catch (error) {
    console.error('Failed to fetch unread count:', error);
    return 0;
  }
};

/**
 * Delete a conversation (counsellor)
 * @param {string} conversationId - UUID of the conversation
 * @returns {Promise<Object>} Success response
 */
export const deleteCounsellorConversation = async (conversationId) => {
  try {
    const response = await api.delete(`/counsellor/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete conversation:', error);
    throw error;
  }
};

// ==================== LEGACY / DEPRECATED (kept for compatibility) ====================

/**
 * @deprecated Use getStudentConversationMessages or getCounsellorConversationMessages instead
 */
export const sendMessage = async (messageData) => {
  console.warn('sendMessage via REST is deprecated. Use Socket.IO for real-time messaging.');
  // This function is kept for backwards compatibility but should not be used
  // Real-time messaging should use Socket.IO events
  throw new Error('Use Socket.IO for sending messages');
};
