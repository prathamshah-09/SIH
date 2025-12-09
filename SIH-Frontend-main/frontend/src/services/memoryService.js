import api from './api';

/**
 * Memory Wall Service
 * Handles all API calls for the Memory Wall feature
 * Backend: /api/student/memory-wall
 */

const memoryService = {
  /**
   * Get all memories for the logged-in student
   * @param {Object} filters - Optional filters
   * @param {string} filters.search - Search by title or description
   * @param {string} filters.startDate - Filter from date (YYYY-MM-DD)
   * @param {string} filters.endDate - Filter to date (YYYY-MM-DD)
   * @returns {Promise<Array>} List of memories
   */
  getAllMemories: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const queryString = params.toString();
      const url = `/student/memory-wall${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('[memoryService] Get all memories error:', error);
      throw error;
    }
  },

  /**
   * Get a single memory by ID
   * @param {string} memoryId - Memory UUID
   * @returns {Promise<Object>} Memory object
   */
  getMemoryById: async (memoryId) => {
    try {
      const response = await api.get(`/student/memory-wall/${memoryId}`);
      return response.data;
    } catch (error) {
      console.error('[memoryService] Get memory by ID error:', error);
      throw error;
    }
  },

  /**
   * Create a new memory with photo upload
   * @param {Object} memoryData - Memory data
   * @param {File} memoryData.photo - Image file (required, max 10MB)
   * @param {string} memoryData.title - Memory title (required, max 200 chars)
   * @param {string} memoryData.date - Memory date (required, YYYY-MM-DD, cannot be future)
   * @param {string} memoryData.description - Memory description (optional)
   * @returns {Promise<Object>} Created memory object
   */
  createMemory: async (memoryData) => {
    try {
      const formData = new FormData();
      formData.append('photo', memoryData.photo);
      formData.append('title', memoryData.title);
      formData.append('date', memoryData.date);
      if (memoryData.description) {
        formData.append('description', memoryData.description);
      }

      const response = await api.post('/student/memory-wall', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('[memoryService] Create memory error:', error);
      throw error;
    }
  },

  /**
   * Update a memory (title, date, description only - photo cannot be changed)
   * @param {string} memoryId - Memory UUID
   * @param {Object} updates - Fields to update
   * @param {string} updates.title - New title (optional)
   * @param {string} updates.date - New date (optional, YYYY-MM-DD)
   * @param {string} updates.description - New description (optional)
   * @returns {Promise<Object>} Updated memory object
   */
  updateMemory: async (memoryId, updates) => {
    try {
      const response = await api.put(`/student/memory-wall/${memoryId}`, updates);
      return response.data;
    } catch (error) {
      console.error('[memoryService] Update memory error:', error);
      throw error;
    }
  },

  /**
   * Delete a memory and its photo
   * @param {string} memoryId - Memory UUID
   * @returns {Promise<Object>} Deleted memory object
   */
  deleteMemory: async (memoryId) => {
    try {
      const response = await api.delete(`/student/memory-wall/${memoryId}`);
      return response.data;
    } catch (error) {
      console.error('[memoryService] Delete memory error:', error);
      throw error;
    }
  },

  /**
   * Get memory statistics for the logged-in student
   * @returns {Promise<Object>} Statistics (totalCount, recentCount, oldestMemoryDate, newestMemoryDate)
   */
  getMemoryStats: async () => {
    try {
      const response = await api.get('/student/memory-wall/stats');
      return response.data;
    } catch (error) {
      console.error('[memoryService] Get memory stats error:', error);
      throw error;
    }
  }
};

export default memoryService;
