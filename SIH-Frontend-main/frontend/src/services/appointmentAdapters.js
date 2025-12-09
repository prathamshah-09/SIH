import { convertTo12Hour } from './appointmentService';

/**
 * Appointment Data Adapters
 * Transforms API responses to match the UI component's expected data structure
 */

// ==================== HELPER FUNCTIONS ====================

/**
 * Generate placeholder image URL with initials
 * @param {string} firstName 
 * @param {string} lastName 
 * @returns {string} Placeholder image URL
 */
const generatePlaceholderImage = (firstName = '', lastName = '') => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  return `https://placehold.co/100x100/E2E8F0/4A5568?text=${initials}`;
};

/**
 * Parse date string to JavaScript Date object
 * @param {string} dateString - ISO date string or YYYY-MM-DD
 * @returns {Date} JavaScript Date object
 */
const parseDate = (dateString) => {
  if (!dateString) return new Date();
  return new Date(dateString);
};

/**
 * Map backend appointment status to frontend status
 * @param {string} backendStatus - Backend status: 'pending', 'confirmed', 'completed', 'cancelled'
 * @returns {string} Frontend status
 */
const mapAppointmentStatus = (backendStatus) => {
  const statusMap = {
    'pending': 'upcoming',      // Pending appointments are "upcoming" from student perspective
    'confirmed': 'upcoming',
    'completed': 'completed',
    'cancelled': 'cancelled'
  };
  return statusMap[backendStatus] || backendStatus;
};

// ==================== STUDENT ADAPTERS ====================

/**
 * Transform API counsellor data to UI format
 * API Response Structure (from college-counsellors endpoint):
 * {
 *   id: string,
 *   name: string,
 *   email: string,
 *   avatar_url: string,
 *   bio: string,
 *   phone: string,
 *   specialization: string,
 *   date: string,
 *   available_slots: [{ availability_id, start_time }]
 * }
 * 
 * UI Expected Format:
 * {
 *   id: string,
 *   name: string,
 *   specialty: string,
 *   imageUrl: string,
 *   availableSlots: ['09:00 AM', '10:00 AM', ...]
 * }
 */
export const transformCounsellorData = (apiCounsellor) => {
  if (!apiCounsellor) return null;
  
  const {
    id,
    name = '',
    email = '',
    avatar_url,
    bio = '',
    phone = '',
    specialization = 'General Counseling',
    date,
    available_slots = []
  } = apiCounsellor;

  // Extract available time slots from available_slots array
  const availableSlots = available_slots.map(slot => {
    if (slot.start_time) {
      // Convert 24-hour format to 12-hour format
      return {
        time: convertTo12Hour(slot.start_time),
        mode: slot.mode || 'online' // default to online when missing
      };
    }
    return null;
  }).filter(Boolean);

  // Extract first and last name from full name for placeholder
  const nameParts = name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts[nameParts.length - 1] || '';

  return {
    id: id,
    userId: id,
    name: name || email.split('@')[0],
    firstName: firstName,
    lastName: lastName,
    specialty: specialization,
    specialization: specialization,
    bio: bio,
    phone: phone,
    imageUrl: avatar_url || generatePlaceholderImage(firstName, lastName),
    availableSlots: availableSlots.map(s => s.time),
    available_slots: availableSlots, // Keep detailed info including mode
    date: date,
    email: email
  };
};

/**
 * Transform list of counsellors from API to UI format
 */
export const transformCounsellorsListData = (apiResponse) => {
  if (!apiResponse?.data) return [];
  
  const counsellors = Array.isArray(apiResponse.data) ? apiResponse.data : [];
  return counsellors.map(transformCounsellorData).filter(Boolean);
};

/**
 * Transform API appointment data to UI format
 * API Response Structure:
 * {
 *   id: string,
 *   student_id: string,
 *   counsellor_id: string,
 *   date: string (YYYY-MM-DD or ISO),
 *   time: string (HH:MM),
 *   type: string,
 *   notes: string,
 *   status: string,
 *   counsellor: { first_name, last_name, specialization },
 *   student: { first_name, last_name, ... }
 * }
 * 
 * UI Expected Format:
 * {
 *   id: string,
 *   counsellor: { id, name, specialty, imageUrl },
 *   date: Date,
 *   time: string (12-hour format),
 *   status: string,
 *   sessionNotes: string,
 *   actionItems: []
 * }
 */
export const transformAppointmentData = (apiAppointment) => {
  if (!apiAppointment) return null;
  
  const {
    id,
    student_id,
    counsellor_id,
    date,
    time,
    start_time,
    type = 'individual',
    notes = '',
    purpose = '',
    status = 'pending',
    counsellor = {},
    student = {},
    session_notes = '',
    session_goals = []
  } = apiAppointment;

  // Use time or start_time (backend might return either)
  const appointmentTime = time || start_time;

  // Transform counsellor info - handle both formats
  let counsellorInfo = null;
  if (counsellor && counsellor.name) {
    // Format 1: { id, name, email, specialization }
    const nameParts = counsellor.name.split(' ');
    counsellorInfo = {
      id: counsellor.id || counsellor_id,
      name: counsellor.name,
      specialty: counsellor.specialization || 'General Counseling',
      imageUrl: generatePlaceholderImage(nameParts[0], nameParts[nameParts.length - 1])
    };
  } else if (counsellor && counsellor.first_name) {
    // Format 2: { first_name, last_name, specialization }
    counsellorInfo = {
      id: counsellor_id,
      name: `${counsellor.first_name || ''} ${counsellor.last_name || ''}`.trim(),
      specialty: counsellor.specialization || 'General Counseling',
      imageUrl: generatePlaceholderImage(counsellor.first_name, counsellor.last_name)
    };
  }

  // Transform student info (for counsellor view) - handle multiple formats
  let studentInfo = null;
  if (student && student.name) {
    const nameParts = student.name.split(' ');
    studentInfo = {
      id: student.id || student_id,
      name: student.name,
      rollNumber: student.roll_number || '',
      department: student.department || '',
      imageUrl: generatePlaceholderImage(nameParts[0], nameParts[nameParts.length - 1])
    };
  } else if (student && student.first_name) {
    studentInfo = {
      id: student_id,
      name: `${student.first_name || ''} ${student.last_name || ''}`.trim(),
      rollNumber: student.roll_number || '',
      department: student.department || '',
      imageUrl: generatePlaceholderImage(student.first_name, student.last_name)
    };
  }

  // Transform session goals to action items
  const actionItems = Array.isArray(session_goals) ? session_goals.map((goal, index) => ({
    id: goal.id || index + 1,
    text: goal.goal || goal.text || '',
    completed: goal.completed || false,
    notes: goal.notes || ''
  })) : [];

  return {
    id: id,
    studentId: student_id,
    counsellorId: counsellor?.id || counsellor_id,
    counsellor: counsellorInfo,
    student: studentInfo,
    studentName: studentInfo?.name,
    date: parseDate(date),
    time: appointmentTime ? convertTo12Hour(appointmentTime) : '',
    type: type,
    status: mapAppointmentStatus(status),
    originalStatus: status, // Keep original for API calls
    sessionNotes: notes || purpose || '',
    preSessionNotes: notes || purpose || '',
    postSessionNotes: session_notes || '',
    actionItems: actionItems,
    notes: notes || purpose || ''
  };
};

/**
 * Transform list of appointments from API to UI format
 */
export const transformAppointmentsListData = (apiResponse) => {
  if (!apiResponse?.data) return [];
  
  const appointments = Array.isArray(apiResponse.data) ? apiResponse.data : [];
  return appointments.map(transformAppointmentData).filter(Boolean);
};

/**
 * Transform sessions summary data from API to UI format
 * Used for displaying completed sessions with goals
 */
export const transformSessionsSummaryData = (apiResponse) => {
  if (!apiResponse?.data) return [];
  
  const sessions = Array.isArray(apiResponse.data) ? apiResponse.data : [];
  return sessions.map(session => {
    const transformed = transformAppointmentData(session);
    if (transformed) {
      // Ensure action items are properly formatted
      transformed.actionItems = Array.isArray(session.session_goals) 
        ? session.session_goals.map((goal, index) => ({
            id: goal.id || index + 1,
            text: goal.goal || goal.text || '',
            completed: goal.completed || false,
            notes: goal.notes || ''
          }))
        : [];
    }
    return transformed;
  }).filter(Boolean);
};

// ==================== COUNSELLOR ADAPTERS ====================

/**
 * Transform appointment request data for counsellor view
 */
export const transformAppointmentRequestData = (apiRequest) => {
  if (!apiRequest) return null;
  
  console.log('[transformAppointmentRequestData] Input:', apiRequest);
  const transformed = transformAppointmentData(apiRequest);
  console.log('[transformAppointmentRequestData] After transformAppointmentData:', transformed);
  
  if (transformed) {
    // For appointment requests, ALWAYS set status to 'pending' (override any base mapping)
    transformed.status = 'pending';
    
    const studentObj = apiRequest.student;
    const studentName = studentObj?.name 
      || `${studentObj?.first_name || ''} ${studentObj?.last_name || ''}`.trim()
      || apiRequest.student_name
      || 'Student';

    transformed.studentName = studentName;
    transformed.studentId = studentObj?.id || studentObj?.roll_number || apiRequest.student_id;
    transformed.requestedDate = apiRequest.created_at ? parseDate(apiRequest.created_at) : new Date();
    console.log('[transformAppointmentRequestData] Added student info:', {
      studentName: transformed.studentName,
      studentId: transformed.studentId,
      requestedDate: transformed.requestedDate
    });
  }
  
  console.log('[transformAppointmentRequestData] Final output:', transformed);
  return transformed;
};

/**
 * Transform list of appointment requests
 */
export const transformAppointmentRequestsListData = (apiResponse) => {
  // Handle both {data: [...]} and direct array formats from backend
  let requests = [];
  if (Array.isArray(apiResponse)) {
    requests = apiResponse;
  } else if (apiResponse?.data) {
    requests = Array.isArray(apiResponse.data) ? apiResponse.data : [];
  }
  
  const transformed = requests.map(transformAppointmentRequestData).filter(Boolean);
  console.log('[CounsellorAppointments] Transformed requests:', transformed);
  return transformed;
};

/**
 * Transform counsellor sessions data
 */
export const transformCounsellorSessionsData = (apiResponse) => {
  // Handle both {data: [...]} and direct array formats from backend
  let sessions = [];
  if (Array.isArray(apiResponse)) {
    sessions = apiResponse;
  } else if (apiResponse?.data) {
    sessions = Array.isArray(apiResponse.data) ? apiResponse.data : [];
  }
  
  console.log('[transformCounsellorSessionsData] Processing sessions:', sessions);
  
  const transformed = sessions.map(session => {
    const baseTransform = transformAppointmentData(session);
    
    if (baseTransform && session.student) {
      // Add student info for counsellor view
      const studentName = session.student.name 
        || `${session.student.first_name || ''} ${session.student.last_name || ''}`.trim()
        || 'Student';
      
      baseTransform.studentName = studentName;
      baseTransform.studentId = session.student.roll_number || session.student.id || session.student_id;
    }
    
    return baseTransform;
  }).filter(Boolean);
  
  console.log('[transformCounsellorSessionsData] Transformed:', transformed);
  return transformed;
};

// ==================== REQUEST PAYLOAD TRANSFORMERS ====================

/**
 * Transform UI booking form data to API request format
 * @param {Object} formData - UI form data
 * @returns {Object} API request payload
 */
export const transformBookingFormToAPI = (formData) => {
  const {
    counsellor,
    counsellorId,
    selectedDate,
    date,
    selectedTime,
    time,
    notes,
    type = 'individual'
  } = formData;

  // Extract counsellor_id
  const counsellor_id = counsellorId || counsellor?.id || counsellor?.userId;
  
  // Extract and format time (ensure 24-hour format HH:MM)
  let appointmentTime = selectedTime || time;
  if (appointmentTime && (appointmentTime.includes('AM') || appointmentTime.includes('PM'))) {
    // Convert from 12-hour to 24-hour format
    const [timeStr, modifier] = appointmentTime.split(' ');
    let [hours, minutes] = timeStr.split(':');
    hours = parseInt(hours, 10);
    
    if (modifier === 'PM' && hours !== 12) {
      hours = hours + 12;
    } else if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
    
    appointmentTime = `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  // Combine selected date + time into a precise ISO timestamp to satisfy Joi min("now")
  let appointmentDate = selectedDate || date;
  if (appointmentDate instanceof Date && appointmentTime) {
    const [h, m] = appointmentTime.split(':').map(Number);
    const combined = new Date(appointmentDate);
    combined.setHours(h, m, 0, 0);
    appointmentDate = combined.toISOString();
  } else if (appointmentDate instanceof Date) {
    appointmentDate = appointmentDate.toISOString();
  } else if (typeof appointmentDate === 'string' && appointmentTime) {
    const parsed = new Date(appointmentDate);
    const [h, m] = appointmentTime.split(':').map(Number);
    parsed.setHours(h, m, 0, 0);
    appointmentDate = parsed.toISOString();
  }

  const cleanedNotes = notes && notes.trim() ? notes.trim() : undefined;

  return {
    counsellor_id,
    date: appointmentDate,
    time: appointmentTime,  // Backend accepts 'time' or 'start_time'
    type: type || 'individual',
    // Joi disallows empty string; omit if blank
    ...(cleanedNotes ? { notes: cleanedNotes } : {})
  };
};

/**
 * Transform UI availability form data to API request format
 * @param {Object} formData - UI form data
 * @returns {Object} API request payload
 */
export const transformAvailabilityFormToAPI = (formData) => {
  const { selectedDate, date, startTime, start_time } = formData;

  let availabilityDate = selectedDate || date;
  if (availabilityDate instanceof Date) {
    availabilityDate = availabilityDate.toISOString();
  }

  let time = startTime || start_time;
  // Ensure 24-hour format
  if (time && (time.includes('AM') || time.includes('PM'))) {
    const [timeStr, modifier] = time.split(' ');
    let [hours, minutes] = timeStr.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
    time = `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  return {
    date: availabilityDate,
    start_time: time
  };
};

/**
 * Transform UI session notes/goals form to API request format
 * @param {Object} formData - UI form data
 * @returns {Object} API request payload
 */
export const transformSessionNotesFormToAPI = (formData) => {
  const { notes, postSessionNotes, actionItems, session_goals } = formData;

  const sessionGoals = (actionItems || session_goals || []).map(item => ({
    goal: item.text || item.goal,
    completed: item.completed || false,
    notes: item.notes || ''
  }));

  return {
    notes: notes || postSessionNotes || '',
    session_goals: sessionGoals
  };
};

export default {
  // Student transformers
  transformCounsellorData,
  transformCounsellorsListData,
  transformAppointmentData,
  transformAppointmentsListData,
  transformSessionsSummaryData,
  
  // Counsellor transformers
  transformAppointmentRequestData,
  transformAppointmentRequestsListData,
  transformCounsellorSessionsData,
  
  // Request payload transformers
  transformBookingFormToAPI,
  transformAvailabilityFormToAPI,
  transformSessionNotesFormToAPI
};
