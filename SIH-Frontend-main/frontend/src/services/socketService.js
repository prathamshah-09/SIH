import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

let socket = null;
let isConnected = false;

/**
 * Get access token from backend endpoint
 * Since the token is in HTTP-only cookie, we make an API call to get it
 */
const getAccessToken = async () => {
  try {
    // BACKEND_URL already doesn't have /api, we add it here
    const tokenUrl = `${BACKEND_URL}/api/auth/token`;
    console.log('[Socket] Fetching token from:', tokenUrl);
    
    const response = await fetch(tokenUrl, {
      method: 'GET',
      credentials: 'include', // Send cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('[Socket] Got access token from backend');
      return data.data?.token || null;
    }
    
    console.log('[Socket] Failed to get token from backend:', response.status);
    return null;
  } catch (error) {
    console.error('[Socket] Error getting token:', error);
    return null;
  }
};

/**
 * Initialize Socket.IO connection for messaging
 * @param {Object} user - User object with id, role, college_id
 * @returns {Promise<Object>} Socket instance
 */
export const connectSocket = async (user) => {
  if (socket && isConnected) {
    console.log('Socket already connected');
    return socket;
  }

  try {
    // Get token from backend API
    const token = await getAccessToken();

    // Auth object - include what we can
    const authData = {
      userId: user?.id,
      userRole: user?.role,
      collegeId: user?.college_id
    };
    
    // Only add token if we have it
    if (token) {
      authData.token = token;
      console.log('[Socket] Connecting with explicit token');
    } else {
      console.log('[Socket] Connecting with withCredentials only');
    }

    console.log('Connecting socket with auth:', { ...authData, token: token ? '[PRESENT]' : '[MISSING]' });

    socket = io(BACKEND_URL, {
      auth: authData,
      transports: ['websocket', 'polling'],
      withCredentials: true, // Important: Send cookies with socket connection
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection events
    socket.on('connect', () => {
      console.log('Socket.IO connected:', socket.id);
      isConnected = true;
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
      isConnected = false;
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error.message);
      isConnected = false;
    });

    socket.on('error', (error) => {
      console.error('Socket.IO error:', error);
    });

    return socket;
  } catch (error) {
    console.error('Failed to connect socket:', error);
    return null;
  }
};

/**
 * Disconnect Socket.IO
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    isConnected = false;
    console.log('Socket disconnected');
  }
};

/**
 * Get current socket instance
 * @returns {Object|null} Socket instance or null
 */
export const getSocket = () => {
  return socket;
};

/**
 * Check if socket is connected
 * @returns {boolean}
 */
export const isSocketConnected = () => {
  return isConnected && socket?.connected;
};

// ==================== MESSAGING SOCKET EVENTS ====================

/**
 * Join a conversation room
 * @param {string} conversationId - UUID of conversation
 */
export const joinConversation = (conversationId) => {
  if (!socket) {
    console.error('Socket not connected');
    return;
  }
  socket.emit('join_conversation', { conversation_id: conversationId });
};

/**
 * Leave a conversation room
 * @param {string} conversationId - UUID of conversation
 */
export const leaveConversation = (conversationId) => {
  if (!socket) {
    console.error('Socket not connected');
    return;
  }
  socket.emit('leave_conversation', { conversation_id: conversationId });
};

/**
 * Send a message via Socket.IO
 * @param {Object} messageData - { conversation_id, receiver_id, message_text }
 */
export const sendMessageViaSocket = (messageData) => {
  if (!socket) {
    console.error('Socket not connected');
    return;
  }
  socket.emit('send_message', messageData);
};

/**
 * Emit typing indicator
 * @param {string} conversationId - UUID of conversation
 */
export const emitTyping = (conversationId) => {
  if (!socket) return;
  socket.emit('typing', { conversation_id: conversationId });
};

/**
 * Emit stop typing
 * @param {string} conversationId - UUID of conversation
 */
export const emitStopTyping = (conversationId) => {
  if (!socket) return;
  socket.emit('stop_typing', { conversation_id: conversationId });
};

/**
 * Mark messages as read via Socket.IO
 * @param {string} conversationId - UUID of conversation
 */
export const markAsReadViaSocket = (conversationId) => {
  if (!socket) return;
  socket.emit('mark_as_read', { conversation_id: conversationId });
};

/**
 * Check online status of a user
 * @param {string} userId - UUID of user
 */
export const checkOnlineStatus = (userId) => {
  if (!socket || !userId) {
    console.log('[Socket] Cannot check online status - socket not connected or no userId');
    return;
  }
  console.log('[Socket] Checking online status for user:', userId);
  socket.emit('check_online_status', { user_id: userId });
};

// ==================== SOCKET EVENT LISTENERS ====================

/**
 * Listen for new messages
 * @param {Function} callback - (data) => void
 */
export const onNewMessage = (callback) => {
  if (!socket) return;
  socket.on('new_message', callback);
};

/**
 * Listen for message notifications
 * @param {Function} callback - (data) => void
 */
export const onMessageNotification = (callback) => {
  if (!socket) return;
  socket.on('new_message_notification', callback);
};

/**
 * Listen for messages marked as read
 * @param {Function} callback - (data) => void
 */
export const onMessagesRead = (callback) => {
  if (!socket) return;
  socket.on('messages_read', callback);
};

/**
 * Listen for user typing
 * @param {Function} callback - (data) => void
 */
export const onUserTyping = (callback) => {
  if (!socket) return;
  socket.on('user_typing', callback);
};

/**
 * Listen for user stopped typing
 * @param {Function} callback - (data) => void
 */
export const onUserStoppedTyping = (callback) => {
  if (!socket) return;
  socket.on('user_stopped_typing', callback);
};

/**
 * Listen for user online status
 * @param {Function} callback - (data) => void
 */
export const onUserOnlineStatus = (callback) => {
  if (!socket) return;
  socket.on('user_online_status', callback);
};

/**
 * Listen for user going offline
 * @param {Function} callback - (data) => void
 */
export const onUserOffline = (callback) => {
  if (!socket) return;
  socket.on('user_offline', callback);
};

/**
 * Listen for unread count updates
 * @param {Function} callback - (data) => void
 */
export const onUnreadCountUpdate = (callback) => {
  if (!socket) return;
  socket.on('unread_count_updated', callback);
};

/**
 * Listen for conversation joined
 * @param {Function} callback - (data) => void
 */
export const onJoinedConversation = (callback) => {
  if (!socket) return;
  socket.on('joined_conversation', callback);
};

// ==================== CLEANUP ====================

/**
 * Remove all event listeners
 */
export const removeAllListeners = () => {
  if (!socket) return;
  socket.removeAllListeners();
};

/**
 * Remove specific event listener
 * @param {string} event - Event name
 */
export const removeListener = (event) => {
  if (!socket) return;
  socket.off(event);
};
