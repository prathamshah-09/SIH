import api from './api';

/**
 * Appointment Service
 * Handles all appointment-related API calls for both students and counsellors
 */

// ==================== STUDENT ENDPOINTS ====================

/**
 * Get all counsellors from the student's college with their availability
 * @param {string} date - Optional date in YYYY-MM-DD format to filter availability
 * @returns {Promise} List of counsellors with availability data
 */
export const getCollegeCounsellors = async (date = null) => {
  try {
    const params = date ? { date } : {};
    const response = await api.get('/student/college-counsellors', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching college counsellors:', error);
    throw error;
  }
};

/**
 * Book a new appointment with a counsellor
 * @param {Object} appointmentData - Appointment details
 * @param {string} appointmentData.counsellor_id - UUID of the counsellor
 * @param {string} appointmentData.date - Date in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
 * @param {string} appointmentData.time - Time in HH:MM format (24-hour)
 * @param {string} appointmentData.type - Type: 'individual', 'group', or 'emergency'
 * @param {string} appointmentData.notes - Student's notes/reason for appointment
 * @returns {Promise} Created appointment data
 */
export const bookAppointment = async (appointmentData) => {
  try {
    const response = await api.post('/student/appointments', appointmentData);
    return response.data;
  } catch (error) {
    console.error('Error booking appointment:', error);
    throw error;
  }
};

/**
 * Get all appointments for the logged-in student
 * @returns {Promise} List of all student appointments (upcoming and past)
 */
export const getMyAppointments = async () => {
  try {
    const response = await api.get('/student/my-appointments');
    return response.data;
  } catch (error) {
    console.error('Error fetching my appointments:', error);
    throw error;
  }
};

/**
 * Get completed sessions summary with notes and goals
 * @returns {Promise} Summary of completed sessions with action items
 */
export const getSessionsSummary = async () => {
  try {
    const response = await api.get('/student/sessions-summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching sessions summary:', error);
    throw error;
  }
};

/**
 * Cancel an appointment
 * @param {string} appointmentId - UUID of the appointment to cancel
 * @returns {Promise} Success response
 */
export const cancelAppointment = async (appointmentId) => {
  try {
    const response = await api.delete(`/student/appointments/${appointmentId}`);
    return response.data;
  } catch (error) {
    console.error('Error canceling appointment:', error);
    throw error;
  }
};

// ==================== COUNSELLOR ENDPOINTS ====================

/**
 * Get all pending appointment requests for the counsellor
 * @returns {Promise} List of pending appointment requests
 */
export const getAppointmentRequests = async () => {
  try {
    const response = await api.get('/counsellor/appointment-requests');
    return response.data;
  } catch (error) {
    console.error('Error fetching appointment requests:', error);
    throw error;
  }
};

/**
 * Accept a pending appointment request
 * @param {string} appointmentId - UUID of the appointment to accept
 * @returns {Promise} Updated appointment data
 */
export const acceptAppointmentRequest = async (appointmentId) => {
  try {
    const response = await api.put(`/counsellor/appointment-requests/${appointmentId}/accept`);
    return response.data;
  } catch (error) {
    console.error('Error accepting appointment request:', error);
    throw error;
  }
};

/**
 * Decline a pending appointment request
 * @param {string} appointmentId - UUID of the appointment to decline
 * @returns {Promise} Updated appointment data
 */
export const declineAppointmentRequest = async (appointmentId) => {
  try {
    const response = await api.put(`/counsellor/appointment-requests/${appointmentId}/decline`);
    return response.data;
  } catch (error) {
    console.error('Error declining appointment request:', error);
    throw error;
  }
};

/**
 * Get all sessions (appointments) for the counsellor
 * @returns {Promise} List of all counsellor appointments (upcoming and past)
 */
export const getCounsellorSessions = async () => {
  try {
    const response = await api.get('/counsellor/sessions');
    return response.data;
  } catch (error) {
    console.error('Error fetching counsellor sessions:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    throw error;
  }
};

/**
 * Get sessions summary with notes and goals for completed sessions
 * @returns {Promise} Summary of completed sessions
 */
export const getCounsellorSessionsSummary = async () => {
  try {
    const response = await api.get('/counsellor/sessions-summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching counsellor sessions summary:', error);
    throw error;
  }
};

/**
 * Update session notes and goals for a completed appointment
 * @param {string} appointmentId - UUID of the appointment
 * @param {Object} sessionData - Session notes and goals
 * @param {string} sessionData.notes - Session notes (max 2000 chars)
 * @param {Array} sessionData.session_goals - Array of goal objects
 * @param {string} sessionData.session_goals[].goal - Goal description (max 200 chars)
 * @param {boolean} sessionData.session_goals[].completed - Completion status
 * @param {string} sessionData.session_goals[].notes - Goal notes
 * @returns {Promise} Updated session data
 */
export const updateSessionNotesAndGoals = async (appointmentId, sessionData) => {
  try {
    const response = await api.put(`/counsellor/sessions-summary/${appointmentId}`, sessionData);
    return response.data;
  } catch (error) {
    console.error('Error updating session notes and goals:', error);
    throw error;
  }
};

/**
 * Add availability slot for the counsellor
 * @param {Object} availabilityData - Availability details
 * @param {string} availabilityData.date - Date in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
 * @param {string} availabilityData.start_time - Start time in HH:MM format (24-hour)
 * @returns {Promise} Created availability data
 */
export const addAvailability = async (availabilityData) => {
  try {
    const response = await api.post('/counsellor/manage-availability', availabilityData);
    return response.data;
  } catch (error) {
    console.error('Error adding availability:', error);
    throw error;
  }
};

/**
 * Get availability slots for the counsellor
 * @param {string} date - Optional date filter (YYYY-MM-DD)
 * @returns {Promise} List of availability slots
 */
export const getAvailability = async (date = null) => {
  try {
    const params = date ? { date } : {};
    const response = await api.get('/counsellor/manage-availability', { params });
    return response.data;
  } catch (error) {
    console.error('Error getting availability:', error);
    throw error;
  }
};

/**
 * Delete an availability slot
 * @param {string} availabilityId - UUID of the availability slot
 * @returns {Promise} Deleted availability data
 */
export const deleteAvailability = async (availabilityId) => {
  try {
    const response = await api.delete(`/counsellor/manage-availability/${availabilityId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting availability:', error);
    throw error;
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format date to YYYY-MM-DD string (using local date, not UTC)
 * @param {Date} date - JavaScript Date object
 * @returns {string} Formatted date string
 */
export const formatDateToYYYYMMDD = (date) => {
  if (!date) return '';
  
  // Use local date values to avoid timezone offset issues
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format date to ISO string for API
 * @param {Date} date - JavaScript Date object
 * @returns {string} ISO formatted date string
 */
export const formatDateToISO = (date) => {
  if (!date) return '';
  return new Date(date).toISOString();
};

/**
 * Convert 12-hour time format to 24-hour format
 * @param {string} time12h - Time in 12-hour format (e.g., "02:00 PM")
 * @returns {string} Time in 24-hour format (e.g., "14:00")
 */
export const convertTo24Hour = (time12h) => {
  if (!time12h) return '';
  
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (hours === '12') {
    hours = '00';
  }
  
  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }
  
  return `${String(hours).padStart(2, '0')}:${minutes}`;
};

/**
 * Convert 24-hour time format to 12-hour format
 * @param {string} time24h - Time in 24-hour format (e.g., "14:00")
 * @returns {string} Time in 12-hour format (e.g., "02:00 PM")
 */
export const convertTo12Hour = (time24h) => {
  if (!time24h) return '';
  
  const [hours, minutes] = time24h.split(':');
  const hour = parseInt(hours, 10);
  
  if (hour === 0) {
    return `12:${minutes} AM`;
  } else if (hour === 12) {
    return `12:${minutes} PM`;
  } else if (hour > 12) {
    return `${String(hour - 12).padStart(2, '0')}:${minutes} PM`;
  } else {
    return `${String(hour).padStart(2, '0')}:${minutes} AM`;
  }
};

export default {
  // Student functions
  getCollegeCounsellors,
  bookAppointment,
  getMyAppointments,
  getSessionsSummary,
  cancelAppointment,
  
  // Counsellor functions
  getAppointmentRequests,
  acceptAppointmentRequest,
  declineAppointmentRequest,
  getCounsellorSessions,
  getCounsellorSessionsSummary,
  updateSessionNotesAndGoals,
  addAvailability,
  getAvailability,
  deleteAvailability,
  
  // Utility functions
  formatDateToYYYYMMDD,
  formatDateToISO,
  convertTo24Hour,
  convertTo12Hour
};
