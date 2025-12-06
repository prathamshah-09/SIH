import apiClient from './api';

/**
 * Submit an assessment form
 * @param {string} formType - The type of assessment form (e.g., 'PHQ-9', 'GAD-7')
 * @param {object} responses - The user's responses to the form questions
 * @returns {Promise<{id, formType, score, severityLevel, guidance, recommendedActions, createdAt}>}
 */
export const submitAssessment = async (formType, responses) => {
  const response = await apiClient.post('/student/assessments', {
    formType,
    responses
  });
  // Backend returns { success, message, data: {...} }
  return response.data.data;
};

/**
 * Get assessment history for the current student
 * @param {object} filters - Optional filters (e.g., { formType, startDate, endDate })
 * @returns {Promise<{assessments: Array, count: number}>}
 */
export const getAssessmentHistory = async (filters = {}) => {
  const response = await apiClient.get('/student/assessments', {
    params: filters
  });
  // Backend returns { success, message, data: {...} }
  return response.data.data;
};

/**
 * Get a single assessment by ID
 * @param {string} assessmentId - The assessment ID
 * @returns {Promise<object>}
 */
export const getAssessmentById = async (assessmentId) => {
  const response = await apiClient.get(`/student/assessments/${assessmentId}`);
  // Backend returns { success, message, data: {...} }
  return response.data.data;
};
