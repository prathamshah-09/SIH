import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { useAuth } from '@context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Input } from '@components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import { 
  Users, 
  MessageCircle, 
  Send,
  UserPlus,
  ArrowLeft,
  RefreshCw,
  Mic,
  Loader2
} from 'lucide-react';

// API Services
import {
  getStudentAllCommunities,
  getStudentJoinedCommunities,
  getStudentAvailableCommunities,
  studentJoinCommunity,
  studentLeaveCommunity,
  getStudentCommunityMessages,
  getCounsellorAllCommunities,
  getCounsellorJoinedCommunities,
  getCounsellorAvailableCommunities,
  counsellorJoinCommunity,
  counsellorLeaveCommunity,
  getCounsellorCommunityMessages,
} from '@services/communityService';

// Socket Service
import {
  initiateCommunitySocket,
  joinCommunityRoom,
  leaveCommunityRoom,
  sendCommunityMessage,
  emitCommunityTyping,
  emitCommunityStopTyping,
  requestCommunityMessageHistory,
  onNewCommunityMessage,
  onCommunityJoined,
  onCommunityUserTyping,
  removeCommunityListener,
} from '@services/socketService';

const CommunityView = ({ userRole = 'student' }) => {
  const [allCommunities, setAllCommunities] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [communityToJoin, setCommunityToJoin] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [socketConnected, setSocketConnected] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { theme, currentTheme } = useTheme();
  const isDark = currentTheme === 'midnight';
  const { t } = useLanguage();
  const { user } = useAuth();

  const getApiFunction = (functionName) => {
    if (userRole === 'counsellor') {
      switch (functionName) {
        case 'getAllCommunities': return getCounsellorAllCommunities;
        case 'getJoinedCommunities': return getCounsellorJoinedCommunities;
        case 'getAvailableCommunities': return getCounsellorAvailableCommunities;
        case 'joinCommunity': return counsellorJoinCommunity;
        case 'leaveCommunity': return counsellorLeaveCommunity;
        case 'getMessages': return getCounsellorCommunityMessages;
        default: return null;
      }
    }
    switch (functionName) {
      case 'getAllCommunities': return getStudentAllCommunities;
      case 'getJoinedCommunities': return getStudentJoinedCommunities;
      case 'getAvailableCommunities': return getStudentAvailableCommunities;
      case 'joinCommunity': return studentJoinCommunity;
      case 'leaveCommunity': return studentLeaveCommunity;
      case 'getMessages': return getStudentCommunityMessages;
      default: return null;
    }
  };

  useEffect(() => {
    if (user && user.id && user.role && user.college_id) {
      initiateCommunitySocket(user)
        .then(() => setSocketConnected(true))
        .catch(err => {
          console.error('Failed to connect socket:', err);
          setSocketConnected(false);
        });
    }
  }, [user]);

  const fetchAllCommunities = async () => {
    try {
      setLoading(true);
      const getAll = getApiFunction('getAllCommunities');
      const data = await getAll();
      setAllCommunities(data || []);
    } catch (error) {
      console.error('Error fetching all communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinedCommunities = async () => {
    try {
      const getJoined = getApiFunction('getJoinedCommunities');
      const data = await getJoined();
      setJoinedCommunities(data || []);
    } catch (error) {
      console.error('Error fetching joined communities:', error);
    }
  };

  const fetchMessages = async (communityId) => {
    try {
      setMessagesLoading(true);
      const getMessages = getApiFunction('getMessages');
      const data = await getMessages(communityId);
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleJoinCommunity = async (community) => {
    if (!community) return;
    try {
      const join = getApiFunction('joinCommunity');
      await join(community.id);
      await Promise.all([fetchAllCommunities(), fetchJoinedCommunities()]);
      setIsJoinDialogOpen(false);
      setCommunityToJoin(null);
    } catch (error) {
      console.error('Error joining community:', error);
      if (error?.status === 409) {
        alert('You are already a member of this community!');
      } else {
        alert('Failed to join community');
      }
    }
  };

  const handleLeaveCommunity = async (communityId) => {
    try {
      const leave = getApiFunction('leaveCommunity');
      await leave(communityId);
      await Promise.all([fetchAllCommunities(), fetchJoinedCommunities()]);
      setSelectedCommunity(null);
      setMessages([]);
    } catch (error) {
      console.error('Error leaving community:', error);
      alert('Failed to leave community');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedCommunity) return;
    try {
      setSendingMessage(true);
      if (socketConnected) {
        sendCommunityMessage(selectedCommunity.id, newMessage.trim());
      } else {
        await fetchMessages(selectedCommunity.id);
      }
      setNewMessage('');
      emitCommunityStopTyping(selectedCommunity.id);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      const chunks = [];
      mr.ondataavailable = e => chunks.push(e.data);
      mr.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        stream.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        mediaRecorderRef.current = null;
        setIsRecording(false);
      };
      mr.start();
      setIsRecording(true);
    } catch (e) {
      console.error('Recording failed', e);
      alert('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleTyping = () => {
    if (selectedCommunity && socketConnected) {
      emitCommunityTyping(selectedCommunity.id);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => emitCommunityStopTyping(selectedCommunity.id), 3000);
    }
  };

  useEffect(() => {
    fetchAllCommunities();
    fetchJoinedCommunities();
  }, [userRole, user]);

  useEffect(() => {
    if (selectedCommunity && socketConnected) {
      joinCommunityRoom(selectedCommunity.id);
      fetchMessages(selectedCommunity.id);
      const handleNewMessage = (message) => setMessages(prev => [...prev, message]);
      const handleUserTyping = (data) => setTypingUsers(prev => new Set([...prev, data.userId]));
      onNewCommunityMessage(handleNewMessage);
      onCommunityUserTyping(handleUserTyping);
      return () => {
        leaveCommunityRoom(selectedCommunity.id);
        removeCommunityListener('new-message');
        removeCommunityListener('user-typing');
      };
    }
  }, [selectedCommunity, socketConnected]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (timestamp) => new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (timestamp) => new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
          <p className={theme.colors.muted}>Loading communities...</p>
        </div>
      </div>
    );
  }

  if (selectedCommunity) {
    return (
      <div className={`chat-shell ${theme.colors.background}`}>
        <div className={`flex-shrink-0 p-4 sm:p-6 border-b ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-gradient-to-r from-blue-50 to-cyan-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCommunity(null)}
                className="hover:scale-105 transition-transform"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="min-w-0">
                <h2 className={`text-xl font-bold ${theme.colors.text} flex items-center truncate`}>
                  <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="truncate">{selectedCommunity.title}</span>
                </h2>
                <p className={`text-xs ${theme.colors.muted} flex items-center space-x-1 mt-1`}>
                  <Users className="w-3 h-3" />
                  <span>{selectedCommunity.total_members || 0} members</span>
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchMessages(selectedCommunity.id)}
              className="hover:scale-105 transition-transform"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div ref={messagesContainerRef} className={`chat-messages ${isDark ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800' : 'bg-gradient-to-b from-cyan-50 to-blue-50'}`}>
          <div className="space-y-4 w-full pb-4 px-2 sm:px-4">
            {messagesLoading ? (
              <div className="flex items-center justify-center h-full min-h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-64 text-center">
                <div>
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                  <p className={`${theme.colors.muted} text-sm`}>
                    {t('noMessagesYet') || 'No messages yet. Start the conversation!'}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => {
                  const isStudent = message.sender_role === 'student';
                  const isCurrentUser = message.sender_id === user?.id;
                  const displayName = isStudent ? message.anonymous_username : message.username;
                  const msgTime = formatTime(message.created_at);

                  return (
                    <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3 animate-fadeIn`}>
                      <div className="flex flex-col max-w-xs lg:max-w-md">
                        {!isCurrentUser && (
                          <p className={`text-xs font-semibold px-3 mb-1 truncate ${theme.colors.text}`}>
                            {displayName}
                            {message.sender_role !== 'student' && (
                              <span className="ml-2 inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                                 {message.sender_role}
                              </span>
                            )}
                          </p>
                        )}
                        {isCurrentUser && (
                          <p className={`text-xs font-semibold px-3 mb-1 text-right truncate ${theme.colors.text}`}>
                            {displayName}
                            {message.sender_role !== 'student' && (
                              <span className="ml-2 inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                                 {message.sender_role}
                              </span>
                            )}
                          </p>
                        )}
                        <div className={`px-4 py-2.5 rounded-lg chat-bubble shadow-md hover:shadow-lg transition-shadow ${isCurrentUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-600'}`}>
                          <p className="text-sm leading-relaxed">{message.message_text}</p>
                        </div>
                        <p className={`text-xs ${theme.colors.muted} mt-1 px-3 ${isCurrentUser ? 'text-right' : ''}`}>
                          {msgTime}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {typingUsers.size > 0 && (
                    <div className={`flex items-center space-x-2 text-sm ${theme.colors.muted}`}>
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100" />
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200" />
                    <span className="ml-2">Someone is typing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        <div className={`flex-shrink-0 sticky bottom-0 left-0 right-0 w-full p-2 sm:p-3 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] sm:pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] z-20 ${isDark ? 'bg-slate-900 border-t border-slate-800' : 'bg-gradient-to-r from-white to-gray-50'}`}>
          <div className="max-w-[72rem] mx-auto flex items-end gap-2 sm:gap-3 w-full">
            <div className={`flex-1 flex items-center rounded-xl border transition-all px-3 sm:px-4 ${isDark ? 'bg-slate-800 border-slate-700 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-900' : 'bg-white border-gray-300 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200'}`}>
              <Input
                placeholder={t('typeMessagePlaceholder') || 'Type your message...'}
                value={newMessage}
                onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
                className={`flex-1 !border-0 bg-transparent !ring-0 focus-visible:!ring-0 focus:outline-none placeholder-gray-400 py-2 sm:py-3 text-sm sm:text-base h-10 ${isDark ? 'text-slate-100 placeholder-slate-400' : ''}`}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
              />
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sendingMessage}
                className="icon-tap rounded-full bg-blue-600 text-white w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center hover:bg-blue-700 hover:shadow-lg disabled:bg-gray-300 disabled:shadow-none transition-all"
                title="Send message"
              >
                {sendingMessage ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Send className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <button
                aria-label={isRecording ? 'Stop recording' : 'Voice message'}
                onClick={() => { isRecording ? stopRecording() : startRecording(); }}
                className={`icon-tap rounded-full w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-blue-600 shadow-sm hover:shadow-md'}`}
                title={isRecording ? 'Stop recording' : 'Voice message'}
              >
                <Mic className={`w-4 h-4 sm:w-5 sm:h-5 ${isRecording ? 'animate-pulse' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-[22px] font-semibold ${theme.colors.text}`}>
          {t('communitySupportGroups') || 'Community Support Groups'}
        </h2>
      </div>
      <p className={`${theme.colors.muted} mt-1 text-sm md:text-base`}>
        {t('connectWithOthersDesc') || 'Connect with others and share your experiences'}
      </p>

      {joinedCommunities.length > 0 && (
        <div className="space-y-4">
          <h3 className={`text-2xl font-bold ${theme.colors.text} flex items-center pt-2`}>
            <Users className="w-6 h-6 mr-3 text-blue-500" />
            <span>Joined Communities</span>
            <span className="ml-2 text-lg font-semibold text-blue-500">({joinedCommunities.length})</span>
          </h3>
          <div className="hidden md:grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {joinedCommunities.map(community => (
              <Card key={community.id} className={`${theme.colors.card} border-0 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 border-l-4 border-l-blue-500 group cursor-pointer`}>
                <CardHeader className="pb-2">
                  <CardTitle className={`text-sm font-semibold ${theme.colors.text} flex items-center line-clamp-2`}>
                    <MessageCircle className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                    {community.title}
                  </CardTitle>
                  <CardDescription className={`text-xs ${theme.colors.muted} line-clamp-2`}>
                    {community.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs py-1 px-2.5">
                      <Users className="w-3 h-3 mr-1" />
                      {community.total_members || 0}
                    </Badge>
                  </div>
                  <Button className="w-full text-sm py-2.5 font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all hover:scale-105 active:scale-95" onClick={() => { setSelectedCommunity(community); fetchMessages(community.id); }}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    OPEN
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="md:hidden space-y-3">
            {joinedCommunities.map(community => (
              <div key={community.id} className={`w-full flex items-center justify-between p-4 rounded-lg ${theme.colors.card} shadow-sm border border-l-4 border-l-blue-500`}>
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{community.title}</div>
                  <div className="text-[11px] text-gray-500">{community.total_members || 0} members</div>
                </div>
                <Button className="px-4 py-1.5 text-sm ml-2 flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all hover:shadow-md" onClick={() => { setSelectedCommunity(community); fetchMessages(community.id); }}>
                  {t('chat') || 'Chat'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {joinedCommunities.length > 0 && <div className="border-t border-gray-200 pt-8"></div>}

      <div className="space-y-4">
        <h3 className={`text-2xl font-bold ${theme.colors.text} flex items-center pt-2`}>
          <Users className="w-6 h-6 mr-3 text-blue-500" />
          <span>{t('allCommunities') || 'All Communities'}</span>
          <span className="ml-2 text-lg font-semibold text-blue-500">({allCommunities.length})</span>
        </h3>
        {allCommunities.length === 0 ? (
          <Card className={`${theme.colors.card} border-2 border-dashed border-gray-300 p-8`}>
            <div className="text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className={`text-xl font-semibold mb-2 ${theme.colors.text}`}>{t('noCommunitiesAvailable') || 'No communities available'}</h3>
            </div>
          </Card>
        ) : (
          <>
            <div className="hidden md:grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {allCommunities.map(community => {
                const isJoined = joinedCommunities.some(c => c.id === community.id);
                return (
                  <Card key={community.id} className={`${theme.colors.card} border-0 shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500`}>
                    <CardHeader className="pb-2">
                      <CardTitle className={`text-sm font-medium line-clamp-2 ${theme.colors.text}`}>{community.title}</CardTitle>
                      <CardDescription className={`text-xs line-clamp-2 ${theme.colors.muted}`}>
                        {community.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs w-fit py-1 px-2.5">
                        <Users className="w-3 h-3 mr-1" />
                        {community.total_members || 0}
                      </Badge>
                      {isJoined ? (
                        <Button className="w-full text-sm py-2.5 font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all hover:scale-105 active:scale-95" onClick={() => { setSelectedCommunity(community); fetchMessages(community.id); }}>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          OPEN
                        </Button>
                      ) : (
                        <Button className="w-full text-sm py-2.5 font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all hover:scale-105 active:scale-95" onClick={() => { setCommunityToJoin(community); setIsJoinDialogOpen(true); }}>
                          <UserPlus className="w-4 h-4 mr-2" />
                          {t('joinCommunity') || 'Join'}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="md:hidden space-y-3">
              {allCommunities.map(community => {
                const isJoined = joinedCommunities.some(c => c.id === community.id);
                return (
                  <div key={community.id} className={`w-full flex items-start justify-between p-4 rounded-lg ${theme.colors.card} shadow-sm border border-l-4 border-l-blue-500`}>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{community.title}</div>
                      <div className="text-[11px] text-gray-500">{community.total_members || 0} members</div>
                    </div>
                    {isJoined ? (
                      <Button className="px-4 py-1.5 text-sm ml-2 flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all" onClick={() => { setSelectedCommunity(community); fetchMessages(community.id); }}>
                        {t('chat') || 'Chat'}
                      </Button>
                    ) : (
                      <Button className="px-4 py-1.5 text-sm ml-2 flex-shrink-0 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all" onClick={() => { setCommunityToJoin(community); setIsJoinDialogOpen(true); }}>
                        {t('join') || 'Join'}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-lg sm:text-xl">
              <UserPlus className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
              {t('joinCommunity') || 'Join Community'}
            </DialogTitle>
            <DialogDescription asChild>
              {communityToJoin ? (
                <div className="space-y-3 mt-4">
                  <div className="font-semibold text-base sm:text-lg break-words">{communityToJoin.title}</div>
                  <div className={`text-sm break-words line-clamp-3 ${theme.colors.muted}`}>{communityToJoin.description}</div>
                  <div className="text-xs sm:text-sm text-gray-400 break-words">
                    <Users className="w-3 h-3 inline mr-1" />
                    {communityToJoin.total_members || 0} members
                  </div>
                </div>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsJoinDialogOpen(false)} className="flex-1 sm:flex-none">
              {t('cancel') || 'Cancel'}
            </Button>
            <Button variant="animated" onClick={() => communityToJoin && handleJoinCommunity(communityToJoin)} className="flex-1 sm:flex-none">
              {t('joinCommunity') || 'Join'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunityView;
