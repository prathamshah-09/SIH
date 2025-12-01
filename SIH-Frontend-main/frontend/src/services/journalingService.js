import apiClient from './api';

/**
 * Journaling Service
 * Handles all journal-related API calls (daily, weekly, worries)
 */

// ==================== DAILY CHECK-IN ====================

/**
 * Create or update daily check-in
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {object} data - Daily check-in data
 * @param {string[]} data.positive_moments - Array of positive moments
 * @param {string[]} data.challenges_faced - Array of challenges
 * @param {string} data.todays_reflection - Today's reflection text
 * @param {string[]} data.intentions_tomorrow - Array of tomorrow's intentions
 * @param {string} data.feelings_space - Feelings space text
 * @returns {Promise<object>} Saved daily check-in
 */
export const saveDailyCheckin = async (date, data) => {
  const response = await apiClient.post('/student/journal/daily', {
    date,
    ...data
  });
  return response.data.data;
};

/**
 * Get daily check-in for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<object|null>} Daily check-in or null
 */
export const getDailyCheckin = async (date) => {
  const response = await apiClient.get(`/student/journal/daily/${date}`);
  return response.data.data;
};

/**
 * Delete daily check-in
 * @param {string} id - Check-in ID
 * @returns {Promise<void>}
 */
export const deleteDailyCheckin = async (id) => {
  const response = await apiClient.delete(`/student/journal/daily/${id}`);
  return response.data.data;
};

// ==================== WEEKLY CHECK-IN ====================

/**
 * Create or update weekly check-in
 * @param {string} date - Any date in the week (YYYY-MM-DD format)
 * @param {object} data - Weekly check-in data
 * @param {string} data.week_reflection - Week reflection text
 * @param {string[]} data.next_week_intentions - Array of next week intentions
 * @param {number} data.self_care_score - Self-care score (0-10)
 * @param {string} data.self_care_reflection - Self-care reflection text
 * @returns {Promise<object>} Saved weekly check-in
 */
export const saveWeeklyCheckin = async (date, data) => {
  const response = await apiClient.post('/student/journal/weekly', {
    date,
    ...data
  });
  return response.data.data;
};

/**
 * Get weekly check-in for a specific week
 * @param {string} date - Any date in the week (YYYY-MM-DD format)
 * @returns {Promise<object|null>} Weekly check-in or null
 */
export const getWeeklyCheckin = async (date) => {
  const response = await apiClient.get(`/student/journal/weekly/${date}`);
  return response.data.data;
};

/**
 * Delete weekly check-in
 * @param {string} id - Check-in ID
 * @returns {Promise<void>}
 */
export const deleteWeeklyCheckin = async (id) => {
  const response = await apiClient.delete(`/student/journal/weekly/${id}`);
  return response.data.data;
};

// ==================== WORRIES JOURNAL ====================

/**
 * Create a new worry entry
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {object} data - Worry data
 * @param {string} data.negative_thought - The worry or negative thought (required)
 * @param {string} [data.positive_reframe] - Manual positive reframe (optional)
 * @returns {Promise<object>} Created worry entry with ID
 */
export const createWorryEntry = async (date, data) => {
  const response = await apiClient.post('/student/journal/worries', {
    date,
    ...data
  });
  return response.data.data;
};

/**
 * Update an existing worry entry
 * @param {string} id - Worry entry ID
 * @param {object} data - Updated worry data
 * @param {string} [data.negative_thought] - Updated worry text
 * @param {string} [data.positive_reframe] - Updated positive reframe
 * @returns {Promise<object>} Updated worry entry
 */
export const updateWorryEntry = async (id, data) => {
  const response = await apiClient.put(`/student/journal/worries/${id}`, data);
  return response.data.data;
};

/**
 * Generate AI-powered positive reframe for a worry
 * @param {string} whatsOnMind - The worry/negative thought text
 * @param {object} options - { date, save, id } - optional parameters for saving
 * @returns {Promise<object>} Response with positive_reframe
 */
export const generateAIReframe = async (whatsOnMind, options = {}) => {
  const response = await apiClient.post('/student/journal/worries/reframe', {
    whats_on_mind: whatsOnMind,
    ...options
  });
  return response.data.data;
};

/**
 * Get all worry entries for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<object[]>} Array of worry entries
 */
export const getWorryEntries = async (date) => {
  const response = await apiClient.get(`/student/journal/worries/${date}`);
  return response.data.data;
};

/**
 * Delete a worry entry
 * @param {string} id - Worry entry ID
 * @returns {Promise<void>}
 */
export const deleteWorryEntry = async (id) => {
  const response = await apiClient.delete(`/student/journal/worries/${id}`);
  return response.data.data;
};

// ==================== CALENDAR / COMBINED ====================

/**
 * Get all journal entries for a specific date (main calendar endpoint)
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<object>} Object with daily_checkin, weekly_checkin, and worries array
 */
export const getJournalByDate = async (date) => {
  const response = await apiClient.get(`/student/journal/date/${date}`);
  return response.data.data;
};

/**
 * Get journal entries for a date range
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<object[]>} Array of journal entries
 */
export const getJournalByDateRange = async (startDate, endDate) => {
  const response = await apiClient.get(`/student/journal/range`, {
    params: { start_date: startDate, end_date: endDate }
  });
  return response.data.data;
};

/**
 * Get journaling statistics
 * @returns {Promise<object>} Statistics with total counts
 */
export const getJournalingStats = async () => {
  const response = await apiClient.get('/student/journal/stats');
  return response.data.data;
};
