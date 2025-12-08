import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { useAuth } from '@context/AuthContext';
import { Card, CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog';
import {
  Send,
  MessageCircle,
  Plus,
  Search,
  User,
  ArrowLeft,
  CheckCheck,
  Check,
  Circle,
  Loader2,
} from 'lucide-react';

// API Services
import {
  getStudentConversations,
  getStudentCounsellorsForMessaging,
  getCounsellorConversations,
  startConversation,
  getStudentConversationMessages,
  getCounsellorConversationMessages,
  markStudentMessagesAsRead,
  markCounsellorMessagesAsRead,
} from '@services/messagingService';

// Socket.IO Service
import {
  connectSocket,
  disconnectSocket,
  joinConversation,
  leaveConversation,
  sendMessageViaSocket,
  emitTyping,
  emitStopTyping,
  markAsReadViaSocket,
  checkOnlineStatus,
  onNewMessage,
  onUserTyping,
  onUserStoppedTyping,
  onUserOnlineStatus,
  onMessagesRead,
  onUnreadCountUpdate,
  getSocket,
  removeListener,
} from '@services/socketService';

const DirectMessages = ({ userRole = 'student' }) => {
  const { theme, currentTheme } = useTheme();
  const isDark = currentTheme === 'midnight';
  const { t } = useLanguage();
  const { user } = useAuth();

  // State management
  const [conversations, setConversations] = useState([]);
  const [availableCounsellors, setAvailableCounsellors] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [counsellorLoading, setCounsellorLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Real-time state
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [unreadCounts, setUnreadCounts] = useState({});
  const [socketId, setSocketId] = useState(null);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Debug: Log user on mount
  useEffect(() => {
    console.log('DirectMessages - User:', user);
    console.log('DirectMessages - User Role:', userRole);
  }, [user, userRole]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations on mount
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user, userRole]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      // Clear old messages first
      setMessages([]);
      setMessagesLoading(true);
      
      loadMessages(selectedConversation.id);
      joinConversation(selectedConversation.id);
      
      // Check online status of other user
      const otherUserId = userRole === 'student' 
        ? selectedConversation.counsellor_id 
        : selectedConversation.student_id;
      checkOnlineStatus(otherUserId);

      // Mark messages as read
      markMessagesAsRead(selectedConversation.id);

      return () => {
        if (selectedConversation) {
          leaveConversation(selectedConversation.id);
        }
      };
    } else {
      // Clear messages when no conversation selected
      setMessages([]);
    }
  }, [selectedConversation]);

  // ==================== API CALLS ====================

  const loadConversations = async () => {
    try {
      setLoading(true);
      let data;
      if (userRole === 'student') {
        data = await getStudentConversations();
      } else {
        data = await getCounsellorConversations();
      }
      setConversations(data || []);
      
      // Calculate unread counts
      const counts = {};
      (data || []).forEach(conv => {
        counts[conv.id] = conv.unread_count || 0;
      });
      setUnreadCounts(counts);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      console.log('Loading messages for conversation:', conversationId);
      setMessagesLoading(true);
      let data;
      if (userRole === 'student') {
        data = await getStudentConversationMessages(conversationId, { limit: 100 });
      } else {
        data = await getCounsellorConversationMessages(conversationId, { limit: 100 });
      }
      console.log('Messages loaded:', data.messages?.length || 0);
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  const markMessagesAsRead = async (conversationId) => {
    try {
      if (userRole === 'student') {
        await markStudentMessagesAsRead(conversationId);
      } else {
        await markCounsellorMessagesAsRead(conversationId);
      }
      markAsReadViaSocket(conversationId);
      
      // Update local unread count
      setUnreadCounts(prev => ({ ...prev, [conversationId]: 0 }));
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  };

  // ==================== SOCKET EVENT HANDLERS ====================

  const handleNewMessage = useCallback((data) => {
    const { conversation_id, message } = data;

    // Update conversations list
    setConversations(prev => {
      return prev.map(conv => {
        if (conv.id === conversation_id) {
          return {
            ...conv,
            last_message: message.message_text,
            last_message_at: message.created_at,
            last_message_time: message.created_at,
            last_message_sender: message.sender_id,
            last_message_is_read: false, // New messages are always unread initially
            updated_at: message.created_at,
          };
        }
        return conv;
      }).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    });

    // If message is for current conversation, add to messages
    if (selectedConversation?.id === conversation_id) {
      setMessages(prev => {
        // Remove temp message if this is from current user
        const filtered = message.sender_id === user.id 
          ? prev.filter(m => !m.id.toString().startsWith('temp-'))
          : prev;
        
        // Check if message already exists
        const exists = filtered.some(m => m.id === message.id);
        if (exists) return filtered;
        
        return [...filtered, message];
      });
      
      // Mark as read if conversation is open
      if (message.sender_id !== user.id) {
        setTimeout(() => markMessagesAsRead(conversation_id), 500);
      }
    } else if (message.sender_id !== user.id) {
      // Update unread count for other conversations
      setUnreadCounts(prev => ({
        ...prev,
        [conversation_id]: (prev[conversation_id] || 0) + 1
      }));
    }
  }, [selectedConversation, user, userRole]);

  const handleUserTyping = useCallback((data) => {
    const { conversation_id, user_id } = data;
    if (selectedConversation?.id === conversation_id && user_id !== user.id) {
      setTypingUsers(prev => new Set(prev).add(user_id));
    }
  }, [selectedConversation, user]);

  const handleUserStoppedTyping = useCallback((data) => {
    const { conversation_id, user_id } = data;
    if (selectedConversation?.id === conversation_id) {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(user_id);
        return newSet;
      });
    }
  }, [selectedConversation]);

  const handleUserOnlineStatus = useCallback((data) => {
    const { user_id, online } = data;
    console.log(`[Socket] User ${user_id} is now ${online ? 'ONLINE' : 'OFFLINE'}`);
    setOnlineUsers(prev => {
      const newSet = new Set(prev);
      if (online) {
        newSet.add(user_id);
      } else {
        newSet.delete(user_id);
      }
      return newSet;
    });
  }, []);

  const handleMessagesRead = useCallback((data) => {
    const { conversation_id, reader_id } = data;
    console.log(`[Socket] Messages read in conversation ${conversation_id} by ${reader_id}`);
    
    // Update messages read status - reader_id is who READ the messages, so update messages sent by current user
    if (selectedConversation?.id === conversation_id && reader_id !== user.id) {
      console.log(`[Socket] Updating read status for messages sent by ${user.id}`);
      setMessages(prev => prev.map(msg => {
        if (msg.sender_id === user.id && !msg.is_read) {
          console.log(`[Socket] Marking message ${msg.id} as read`);
          return { ...msg, is_read: true, read_at: new Date().toISOString() };
        }
        return msg;
      }));
    }

    // Update conversation list last message read flag if the last message was mine
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversation_id && conv.last_message_sender === user?.id) {
        return { ...conv, last_message_is_read: true };
      }
      return conv;
    }));
  }, [selectedConversation, user]);

  // Handle unread count updates from server (covers cases where conversation list is open)
  const handleUnreadCountUpdated = useCallback((data) => {
    console.log('[Socket] Unread count updated event received:', data);
    const { conversation_id, unread_count, last_message, last_message_at, last_message_sender } = data;

    // Update unread count map
    setUnreadCounts(prev => {
      const updated = {
        ...prev,
        [conversation_id]: unread_count || 0,
      };
      console.log('[Socket] Updated unread counts:', updated);
      return updated;
    });

    // Also refresh conversation preview (last message + timestamp) so list stays current
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversation_id) {
        return {
          ...conv,
          last_message: last_message ?? conv.last_message,
          last_message_at: last_message_at ?? conv.last_message_at,
          last_message_time: last_message_at ?? conv.last_message_time ?? conv.last_message_at,
          last_message_sender: last_message_sender ?? conv.last_message_sender,
          last_message_is_read: false, // New message is always unread initially
          updated_at: last_message_at ?? conv.updated_at,
        };
      }
      return conv;
    }).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)));
  }, []);

  // ==================== USER ACTIONS ====================

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || !user) return;

    try {
      setSendingMessage(true);

      const receiverId = userRole === 'student' 
        ? selectedConversation.counsellor_id 
        : selectedConversation.student_id;

      // Optimistic update - add message to UI immediately
      const tempMessage = {
        id: `temp-${Date.now()}`,
        conversation_id: selectedConversation.id,
        sender_id: user.id,
        receiver_id: receiverId,
        message_text: messageText.trim(),
        is_read: false,
        created_at: new Date().toISOString(),
        sender_name: user.name,
        sender_avatar: user.avatar_url,
        sending: true // Mark as sending
      };

      setMessages(prev => [...prev, tempMessage]);
      const textToSend = messageText.trim();
      setMessageText('');
      emitStopTyping(selectedConversation.id);

      // Send via socket
      sendMessageViaSocket({
        conversation_id: selectedConversation.id,
        receiver_id: receiverId,
        message_text: textToSend,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleTyping = () => {
    if (!selectedConversation) return;

    emitTyping(selectedConversation.id);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 1.5 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping(selectedConversation.id);
    }, 1500);
  };

  const handleOpenNewChat = async () => {
    if (userRole === 'student') {
      try {
        console.log('User object:', user);
        if (!user || !user.id) {
          alert('User not authenticated. Please login again.');
          return;
        }
        
        setCounsellorLoading(true);
        console.log('Fetching counsellors...');
        const data = await getStudentCounsellorsForMessaging();
        console.log('Counsellors fetched:', data);
        setAvailableCounsellors(data || []);
      } catch (error) {
        console.error('Failed to load counsellors:', error);
        alert(`Failed to load counsellors: ${error.message || 'Unknown error'}`);
        setAvailableCounsellors([]);
      } finally {
        setCounsellorLoading(false);
      }
    }
    setIsNewChatOpen(true);
  };

  const handleStartConversation = async (counsellor) => {
    try {
      console.log('Starting conversation with counsellor:', counsellor.id);
      const newConversation = await startConversation({
        counsellor_id: counsellor.id,
      });

      console.log('Conversation created:', newConversation);
      
      // Check if conversation object exists and has required fields
      if (!newConversation || !newConversation.id) {
        console.error('Invalid conversation response:', newConversation);
        alert('Received invalid conversation data. Please try again.');
        return;
      }

      setConversations(prev => {
        const exists = prev.find(c => c.id === newConversation.id);
        if (exists) return prev;
        return [newConversation, ...prev];
      });

      setSelectedConversation(newConversation);
      setIsNewChatOpen(false);
    } catch (error) {
      console.error('Failed to start conversation - Full error:', error);
      console.error('Error message:', error.message);
      console.error('Error status:', error.status);
      const errorMsg = error.message || 'Failed to start conversation. Please try again.';
      alert(`Failed to start conversation: ${errorMsg}`);
    }
  };

  const handleSelectConversation = (conv) => {
    console.log('Selecting conversation:', conv.id);
    // Clear previous conversation state
    setMessages([]);
    setTypingUsers(new Set());
    // Set new conversation
    setSelectedConversation(conv);
  };

  // Initialize Socket.IO connection once (must be after all callbacks are defined)
  useEffect(() => {
    if (user) {
      const initSocket = async () => {
        try {
          await connectSocket(user);

          const socket = getSocket();
          if (socket?.id) {
            setSocketId(socket.id);
          }

          // Keep socketId updated on reconnects
          socket?.on('connect', () => setSocketId(socket.id));
          socket?.on('disconnect', () => setSocketId(null));
        } catch (error) {
          console.error('Failed to initialize socket:', error);
        }
      };

      initSocket();

      return () => {
        disconnectSocket();
        setSocketId(null);
      };
    }
  }, [user]);

  // Update socket event listeners when callbacks change (without reconnecting)
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !socket.connected) {
      return; // wait until socket connects
    }

    // Remove old listeners
    removeListener('new_message');
    removeListener('user_typing');
    removeListener('user_stopped_typing');
    removeListener('user_online_status');
    removeListener('messages_read');
    removeListener('unread_count_updated');
    
    // Setup new listeners with updated callbacks
    onNewMessage(handleNewMessage);
    onUserTyping(handleUserTyping);
    onUserStoppedTyping(handleUserStoppedTyping);
    onUserOnlineStatus(handleUserOnlineStatus);
    onMessagesRead(handleMessagesRead);
    onUnreadCountUpdate(handleUnreadCountUpdated);
  }, [socketId, handleNewMessage, handleUserTyping, handleUserStoppedTyping, handleUserOnlineStatus, handleMessagesRead, handleUnreadCountUpdated]);

  const handleBackToList = () => {
    console.log('Going back to conversation list');
    // Clear conversation state
    setSelectedConversation(null);
    setMessages([]);
    setTypingUsers(new Set());
    setMessageText('');
  };

  // ==================== HELPER FUNCTIONS ====================

  const getOtherPartyInfo = () => {
    if (!selectedConversation) return null;

    if (userRole === 'student') {
      return {
        id: selectedConversation.counsellor_id,
        name: selectedConversation.counsellor_name || 'Counsellor',
        specialization: selectedConversation.counsellor_specialization,
        avatar_url: selectedConversation.counsellor_avatar_url,
      };
    } else {
      return {
        id: selectedConversation.student_id,
        name: selectedConversation.student_name || 'Student',
        avatar_url: selectedConversation.student_avatar_url,
      };
    }
  };

  const otherPartyInfo = getOtherPartyInfo();
  const isOtherUserOnline = otherPartyInfo ? onlineUsers.has(otherPartyInfo.id) : false;
  const isOtherUserTyping = typingUsers.size > 0;

  // Filter conversations by search
  const filteredConversations = conversations.filter(conv => {
    const name = userRole === 'student' 
      ? conv.counsellor_name 
      : conv.student_name;
    return name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // ==================== RENDER ====================

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Chat view
  if (selectedConversation) {
    return (
      <div className="chat-shell">
        {/* Header */}
        <Card className={`${theme.colors.card} border-0 shadow-lg flex-shrink-0`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 min-w-0">
                <button
                  onClick={handleBackToList}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
                  title={t('back')}
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {otherPartyInfo?.name?.charAt(0) || '?'}
                    </div>
                    {isOtherUserOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className={`font-semibold truncate ${theme.colors.text}`}>
                      {otherPartyInfo?.name}
                    </h3>
                    {otherPartyInfo?.specialization && (
                      <p className="text-xs text-gray-500 truncate">{otherPartyInfo.specialization}</p>
                    )}
                    <div className="flex items-center space-x-1">
                      <Circle className={`w-2 h-2 ${isOtherUserOnline ? 'fill-green-500 text-green-500' : 'text-gray-400'}`} />
                      <span className={`text-xs ${isOtherUserOnline ? 'text-green-600' : 'text-gray-500'}`}>
                        {isOtherUserOnline ? t('online') || 'Online' : t('offline') || 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages Area */}
        <Card className={`${theme.colors.card} border-0 shadow-lg flex-1 flex flex-col overflow-hidden min-h-0`}>
          <CardContent className="chat-panel p-0">
            <div className={`chat-messages ${isDark ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800' : 'bg-gradient-to-b from-cyan-50 to-blue-50'}`}>
              {messagesLoading ? (
                <div className="flex items-center justify-center h-full min-h-60">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-60">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className={theme.colors.muted}>{t('noMessagesYet') || 'No messages yet'}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isMine = msg.sender_id === user.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs sm:max-w-md p-3 rounded-lg ${
                            isMine
                              ? 'bg-blue-500 text-white'
                              : `${theme.colors.secondary} ${theme.colors.text}`
                          }`}
                        >
                          <p className="chat-bubble text-sm leading-relaxed">{msg.message_text}</p>
                          <div className="flex items-center justify-end space-x-1 mt-1 text-xs opacity-75">
                            <span>
                              {new Date(msg.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {isMine && (
                              msg.is_read ? (
                                <CheckCheck className="w-3 h-3" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Typing indicator */}
              {isOtherUserTyping && (
                <div className="flex justify-start">
                  <div className={`${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-gray-200'} rounded-lg px-3 py-2`}>
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className={`chat-input-bar ${isDark ? 'bg-slate-900 border-t border-slate-800' : 'bg-white'}`}>
              <div className="chat-input-inner">
                <Textarea
                  value={messageText}
                  onChange={(e) => {
                    setMessageText(e.target.value);
                    handleTyping();
                  }}
                  placeholder={t('typeMessagePlaceholder') || 'Type your message...'}
                  className={`flex-1 min-h-[40px] max-h-[120px] resize-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base py-2 sm:py-3 ${isDark ? 'bg-slate-800 text-slate-100 placeholder-slate-400 border border-slate-700' : ''}`}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={sendingMessage}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() || sendingMessage}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 hover:shadow-lg transition-all"
                  title="Send message"
                >
                  {sendingMessage ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Conversations List view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-semibold ${theme.colors.text} flex items-center gap-3`}>
            <MessageCircle className="w-7 h-7 text-blue-500" />
            <span>{t('directMessages') || 'Direct Messages'}</span>
          </h2>
          <p className={`${theme.colors.muted} mt-2 text-base`}>
            {userRole === 'counsellor'
              ? t('directMessagesCounsellorDesc') || 'Chat with your students'
              : t('directMessagesDesc') || 'Chat with your counsellors'}
          </p>
        </div>

        {userRole === 'student' && (
          <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={handleOpenNewChat}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-xl text-white transition-all duration-300 hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('new') || 'New'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-500" />
                  {t('selectCounsellor') || 'Select a Counsellor'}
                </DialogTitle>
                <DialogDescription>
                  {t('selectCounsellorDesc') || 'Choose a counsellor to start a conversation.'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {counsellorLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                ) : availableCounsellors.length === 0 ? (
                  <div className="text-center p-4 text-gray-500">
                    <p>{t('noCounsellorsAvailable') || 'No counsellors available'}</p>
                  </div>
                ) : (
                  availableCounsellors.map((counsellor) => (
                    <button
                      key={counsellor.id}
                      onClick={() => handleStartConversation(counsellor)}
                      className={`w-full p-4 rounded-lg border-2 transition-all duration-200 hover:border-blue-300 ${theme.colors.card} border-gray-200`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {counsellor.name?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className={`font-semibold ${theme.colors.text}`}>
                            {counsellor.name}
                          </h4>
                          <p className={`text-sm ${theme.colors.muted}`}>
                            {counsellor.specialization || 'Counsellor'}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder={t('searchConversationsPlaceholder') || 'Search conversations...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Conversations List */}
      {filteredConversations.length === 0 ? (
        <Card className={`${theme.colors.card} text-center shadow-lg`}>
          <CardContent className="p-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className={`text-xl font-semibold mb-2 ${theme.colors.text}`}>
              {searchQuery
                ? t('noConversationsFound') || 'No conversations found'
                : t('noDirectMessages') || 'No conversations yet'}
            </h3>
            <p className={`${theme.colors.muted} mb-6`}>
              {userRole === 'student'
                ? t('startConversationCounsellor') || 'Start a conversation with a counsellor'
                : t('noIncomingMessagesYet') || 'No incoming messages yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredConversations.map((conv) => {
            const name = userRole === 'student' ? conv.counsellor_name : conv.student_name;
            const unreadCount = unreadCounts[conv.id] || 0;
            const lastMessageTime = conv.last_message_time || conv.last_message_at;
            const isLastFromMe = conv.last_message_sender === user?.id;
            const isLastRead = conv.last_message_is_read === true;

            const formattedTime = lastMessageTime
              ? new Date(lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '';

            return (
              <Card
                key={conv.id}
                className={`${theme.colors.card} cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-102 border-0 shadow-md`}
                onClick={() => handleSelectConversation(conv)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {name?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold ${theme.colors.text}`}>{name}</h4>
                        <div className="flex items-center space-x-1">
                          {isLastFromMe && (
                            isLastRead ? (
                              <CheckCheck className="w-3 h-3 text-blue-500 flex-shrink-0" />
                            ) : (
                              <Check className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            )
                          )}
                          <p className={`text-sm ${theme.colors.muted} truncate`}>
                            {conv.last_message || (t('noMessagesYet') || 'No messages yet')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1 text-right">
                      <span className={`text-xs ${theme.colors.muted}`}>
                        {formattedTime}
                      </span>
                      {unreadCount > 0 && (
                        <Badge className="bg-blue-500 text-white text-xs">
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DirectMessages;
