import api from './api';

/**
 * Resource Management Service
 * Handles all resource-related API calls for counsellors
 */

/**
 * Get all resources uploaded by the logged-in counsellor
 * @returns {Promise<Array>} List of resources
 */
export const getAllResources = async () => {
  try {
    const response = await api.get('/counsellor/resources');
    return response.data;
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
};

/**
 * Upload a new resource
 * @param {Object} resourceData - Contains resource_name, description, and file
 * @param {string} resourceData.resource_name - Name of the resource (required)
 * @param {string} resourceData.description - Description of the resource (optional)
 * @param {File} resourceData.file - File to upload (required)
 * @returns {Promise<Object>} Created resource object
 */
export const uploadResource = async (resourceData) => {
  try {
    const formData = new FormData();
    formData.append('resource_name', resourceData.resource_name);
    if (resourceData.description) {
      formData.append('description', resourceData.description);
    }
    formData.append('file', resourceData.file);

    const response = await api.post('/counsellor/resources', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading resource:', error);
    throw error;
  }
};

/**
 * Delete a resource by ID
 * @param {string} resourceId - UUID of the resource to delete
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteResource = async (resourceId) => {
  try {
    const response = await api.delete(`/counsellor/resources/${resourceId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting resource:', error);
    throw error;
  }
};

/**
 * Get download URL for a resource
 * @param {string} resourceId - UUID of the resource to download
 * @returns {Promise<Object>} Object containing signed download URL
 */
export const getResourceDownloadUrl = async (resourceId) => {
  try {
    const response = await api.get(`/counsellor/resources/${resourceId}/download`);
    return response.data;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error;
  }
};

/**
 * Get a single resource by ID
 * @param {string} resourceId - UUID of the resource
 * @returns {Promise<Object>} Resource object
 */
export const getResourceById = async (resourceId) => {
  try {
    const response = await api.get(`/counsellor/resources/${resourceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching resource:', error);
    throw error;
  }
};

/**
 * Update resource metadata (name and description)
 * @param {string} resourceId - UUID of the resource
 * @param {Object} updateData - Contains resource_name and/or description
 * @returns {Promise<Object>} Updated resource object
 */
export const updateResource = async (resourceId, updateData) => {
  try {
    const response = await api.put(`/counsellor/resources/${resourceId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating resource:', error);
    throw error;
  }
};

/**
 * Get resource statistics
 * @returns {Promise<Object>} Statistics about uploaded resources
 */
export const getResourceStats = async () => {
  try {
    const response = await api.get('/counsellor/resources/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching resource stats:', error);
    throw error;
  }
};
