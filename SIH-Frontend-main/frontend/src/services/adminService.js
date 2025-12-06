import api from './api';

/**
 * Admin User Management Service
 * Handles all admin-related API calls for user management
 */

/**
 * Get user statistics for the admin's college
 * @returns {Promise<{totalUsers: number, totalStudents: number, totalCounsellors: number}>}
 */
export const getUserStats = async () => {
  try {
    const response = await api.get('/admin/users/stats');
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch user statistics:', error);
    throw error;
  }
};

/**
 * Get paginated list of users with optional filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 20)
 * @param {string} params.role - Filter by role: 'all', 'student', 'counsellor'
 * @param {string} params.search - Search by name or email
 * @returns {Promise<Object>} Paginated user list with metadata
 */
export const getUsers = async (params = {}) => {
  try {
    const { page = 1, limit = 20, role = 'all', search = '' } = params;
    const response = await api.get('/admin/users', {
      params: { page, limit, role, search }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

/**
 * Get details for a specific user
 * @param {string} userId - User UUID
 * @returns {Promise<Object>} User details
 */
export const getUserDetails = async (userId) => {
  try {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch user details:', error);
    throw error;
  }
};

/**
 * Create a new student
 * @param {Object} studentData - Student information
 * @param {string} studentData.name - Full name
 * @param {string} studentData.email - Email address
 * @param {string} studentData.password - Initial password
 * @param {string} studentData.phone - Phone number (optional)
 * @param {number} studentData.passing_year - Passing year (optional)
 * @param {string} studentData.roll_no - Roll number (optional)
 * @returns {Promise<Object>} Created student data
 */
export const createStudent = async (studentData) => {
  try {
    console.log('Creating student with data:', studentData);
    const response = await api.post('/admin/users/students', studentData);
    return response.data.data;
  } catch (error) {
    console.error('Failed to create student:', error);
    
    // The error structure is: error.data.error.details.validation
    const errorData = error.data?.error || error.response?.data || error.data || error;
    const errorMessage = errorData?.message || error.message || 'Failed to create student';
    const validationErrors = errorData?.details?.validation;
    
    console.error('Full error data:', errorData);
    console.error('Details:', errorData?.details);
    console.error('Validation errors:', validationErrors);
    
    if (validationErrors && Array.isArray(validationErrors)) {
      const fieldErrors = validationErrors.map(e => `${e.field}: ${e.message}`).join(', ');
      throw new Error(`${errorMessage}: ${fieldErrors}`);
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Create a new counsellor
 * @param {Object} counsellorData - Counsellor information
 * @param {string} counsellorData.name - Full name
 * @param {string} counsellorData.email - Email address
 * @param {string} counsellorData.password - Initial password
 * @param {string} counsellorData.phone - Phone number (optional)
 * @param {string} counsellorData.specialization - Specialization (optional)
 * @returns {Promise<Object>} Created counsellor data
 */
export const createCounsellor = async (counsellorData) => {
  try {
    const response = await api.post('/admin/users/counsellors', counsellorData);
    return response.data.data;
  } catch (error) {
    console.error('Failed to create counsellor:', error);
    throw error;
  }
};

/**
 * Delete a user
 * @param {string} userId - User UUID to delete
 * @returns {Promise<void>}
 */
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw error;
  }
};

/**
 * Change user password
 * @param {string} userId - User UUID
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
export const changeUserPassword = async (userId, newPassword) => {
  try {
    const response = await api.put(`/admin/users/${userId}/password`, {
      new_password: newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Failed to change user password:', error);
    throw error;
  }
};
