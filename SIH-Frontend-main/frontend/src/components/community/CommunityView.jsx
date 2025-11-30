import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { useAuth } from '@context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
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
  Calendar, 
  MessageCircle, 
  Send,
  UserPlus,
  UserCheck,
  ArrowLeft,
  Shield,
  Crown,
  RefreshCw,
  Mic
} from 'lucide-react';
// Ephemeral community/chat logic (no persistence) until backend exists.
import { mockCommunityChats } from '@mock/mockData';
const fakeApiDelay = (ms = 150) => new Promise(res => setTimeout(res, ms));

let ephemeralCommunities = mockCommunityChats.map(c => ({
  id: c.id,
  title: c.name,
  description: c.description,
  member_count: c.members,
  created_at: c.lastActive || new Date().toISOString(),
  assigned_counsellor: 'Dr. Sarah Johnson' // Default counsellor for all communities
}));

// Ephemeral message storage per community
let ephemeralMessages = {};

// Demo counsellor names
const counsellorNames = ['Dr. Sarah Johnson', 'Dr. Priya Sharma', 'Dr. Amit Patel', 'Dr. Emma Wilson'];

// Generate demo messages for a community
const generateDemoMessages = (communityId) => {
  if (!ephemeralMessages[communityId]) {
    const messages = [];
    const now = new Date();
    const demoUsers = ['Raj Kumar', 'Neha Singh', 'Arjun Verma', currentUser?.username || 'Student123'];
    const counsellor = counsellorNames[parseInt(communityId) % counsellorNames.length];
    
    // Add welcome message from counsellor as first message
    messages.push({
      id: `msg_${communityId}_welcome`,
      user_name: counsellor,
      user_role: 'counsellor',
      content: `👋 Welcome everybody! I'm ${counsellor}, your counsellor for this group. I'm here to support your mental health journey and facilitate meaningful discussions. Feel free to share your thoughts and experiences in a safe, non-judgmental space. Let's support each other and grow together!`,
      timestamp: new Date(now.getTime() - 10 * 60000).toISOString()
    });
    
    // Generate 5 demo messages
    for (let i = 5; i >= 1; i--) {
      const timestamp = new Date(now.getTime() - i * 5 * 60000); // 5 mins apart
      const isFromCounsellor = Math.random() > 0.7;
      messages.push({
        id: `msg_${communityId}_${i}`,
        user_name: isFromCounsellor ? counsellor : demoUsers[i % demoUsers.length],
        user_role: isFromCounsellor ? 'counsellor' : 'student',
        content: isFromCounsellor 
          ? `That's a great point! Let's discuss this further in our next session.`
          : `Hi everyone, I've been feeling better with the techniques we discussed.`,
        timestamp: timestamp.toISOString()
      });
    }
    ephemeralMessages[communityId] = messages;
  }
  return ephemeralMessages[communityId];
};

const apiGet = async (path) => {
  await fakeApiDelay();
  if (path === '/communities') return [...ephemeralCommunities];
  if (path.startsWith('/users/')) return []; // membership not tracked
  if (path.endsWith('/messages')) {
    const match = path.match(/\/communities\/(.+)\/messages/);
    if (match) {
      const communityId = match[1];
      return generateDemoMessages(communityId);
    }
  }
  return null;
};

const apiPost = async (path, body) => {
  await fakeApiDelay();
  if (path.endsWith('/join')) return { success: true }; // no-op
  if (path.endsWith('/messages')) {
    const match = path.match(/\/communities\/(.+)\/messages/);
    if (match) {
      const communityId = match[1];
      const newMsg = {
        id: `msg_${Date.now()}`,
        user_name: body.user_name,
        user_role: body.user_role,
        content: body.content,
        timestamp: new Date().toISOString()
      };
      if (!ephemeralMessages[communityId]) {
        ephemeralMessages[communityId] = [];
      }
      ephemeralMessages[communityId].push(newMsg);
    }
    return { success: true };
  }
  return null;
};

const CommunityView = ({ userRole = 'student' }) => {
  const [communities, setCommunities] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [communityToJoin, setCommunityToJoin] = useState(null);
  const [expandedDesc, setExpandedDesc] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const { theme } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();

  // Mock user data if auth context doesn't provide it
  const currentUser = user || {
    id: 'user_123',
    name: 'John Doe',
    role: userRole
  };

  // Fetch all communities
  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const data = await apiGet('/communities');
      setCommunities(data || []);
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's communities
  const fetchUserCommunities = async () => {
    try {
      const data = await apiGet(`/users/${currentUser.id}/communities`);
      setUserCommunities(data || []);
    } catch (error) {
      console.error('Error fetching user communities:', error);
    }
  };

  // Fetch messages for a community
  const fetchMessages = async (communityId) => {
    try {
      setMessagesLoading(true);
      // Generate demo messages with current user's username
      const userDisplayName = currentUser.username || currentUser.name || 'Student';
      generateDemoMessages(communityId, userDisplayName);
      const data = await apiGet(`/communities/${communityId}/messages`);
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Join a community
  const handleJoinCommunity = async (community) => {
    try {
      // Use username if available, otherwise fallback to name
      const displayName = currentUser.username || currentUser.name;
      await apiPost(`/communities/${community.id}/join`, {
        community_id: community.id,
        user_id: currentUser.id,
        user_name: displayName,
        user_role: currentUser.role
      });
      
      // Refresh communities
      fetchCommunities();
      fetchUserCommunities();
      setIsJoinDialogOpen(false);
      setCommunityToJoin(null);
    } catch (error) {
      console.error('Error joining community:', error);
      if (error.response?.status === 400) {
        alert('You are already a member of this community!');
      }
    }
  };

  // Send a message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedCommunity) return;

    try {
      // Use username if available, otherwise fallback to name
      const displayName = currentUser.username || currentUser.name;
      
      await apiPost(`/communities/${selectedCommunity.id}/messages`, {
        community_id: selectedCommunity.id,
        user_id: currentUser.id,
        user_name: displayName,
        user_role: currentUser.role,
        content: newMessage.trim()
      });

      setNewMessage('');
      // Refresh messages
      fetchMessages(selectedCommunity.id);
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.response?.status === 403) {
        alert('You must be a member of this community to send messages!');
      }
    }
  };

  // Check if user is a member of a community
  const isMember = (communityId) => {
    return userCommunities.some(c => c.id === communityId);
  };

  // Voice recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      const chunks = [];
      mr.ondataavailable = e => chunks.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        handleSendAudioMessage(url);
        stream.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        mediaRecorderRef.current = null;
        setIsRecording(false);
      };
      mr.start();
      setIsRecording(true);
    } catch (e) {
      console.error('Recording failed', e);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleSendAudioMessage = async () => {
    if (!selectedCommunity) return;

    try {
      const displayName = currentUser.username || currentUser.name;
      
      await apiPost(`/communities/${selectedCommunity.id}/messages`, {
        community_id: selectedCommunity.id,
        user_id: currentUser.id,
        user_name: displayName,
        user_role: currentUser.role,
        content: t('audioMessage') || '🎙️ Voice message',
        type: 'audio'
      });

      fetchMessages(selectedCommunity.id);
    } catch (error) {
      console.error('Error sending audio message:', error);
    }
  };

  useEffect(() => {
    fetchCommunities();
    if (currentUser.id) {
      fetchUserCommunities();
    }
  }, [currentUser.id]);

  // Refresh messages every 10 seconds if viewing a community
  useEffect(() => {
    if (selectedCommunity) {
      const interval = setInterval(() => {
        fetchMessages(selectedCommunity.id);
      }, 10000); // Refresh every 10 seconds

      return () => clearInterval(interval);
    }
  }, [selectedCommunity]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) {
      requestAnimationFrame(() => {
        try {
          el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
        } catch (e) {
          el.scrollTop = el.scrollHeight;
        }
      });
      return;
    }

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, selectedCommunity]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
      </div>
    );
                      {community.member_count} members
  }

  // Community Chat View - WhatsApp Style with AI Companion Theme
  if (selectedCommunity) {
    return (
      <div className={`flex flex-col w-full h-screen overflow-hidden ${theme.colors.background}`}>
        {/* Header - Enhanced Styling with Gradient */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-b bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCommunity(null)}
                className="hover:scale-105 transition-transform hover:bg-blue-100 dark:hover:bg-gray-600"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h2 className={`text-xl font-bold ${theme.colors.text} flex items-center`}>
                  <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
                  {selectedCommunity.title}
                </h2>
                <p className={`text-xs ${theme.colors.muted} flex items-center space-x-1 mt-1`}>
                  <Users className="w-3 h-3" />
                  <span>{selectedCommunity.member_count} {t('members') || 'members'}</span>
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchMessages(selectedCommunity.id)}
              className="hover:scale-105 transition-transform hover:bg-blue-100 dark:hover:bg-gray-600"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages Container - AI Companion Style with Gradient */}
        <div ref={messagesContainerRef} className={`flex-1 w-full overflow-y-auto bg-gradient-to-b from-cyan-50 to-blue-50 dark:from-cyan-900 dark:to-blue-900 p-4 sm:p-6`}>
          <div className="space-y-4 max-w-3xl mx-auto w-full pb-4">
            {messagesLoading ? (
              <div className="flex items-center justify-center h-full min-h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
                  const msgTime = new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                  const isCurrentUser = message.user_name === (currentUser?.username || currentUser?.name);
                  
                  return (
                    <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3 animate-fadeIn`}>
                      <div className={`flex flex-col max-w-xs lg:max-w-md`}>
                        {/* Show sender name for non-current users */}
                        {!isCurrentUser && (
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 px-3 mb-1">
                            {message.user_name}
                            {message.user_role === 'counsellor' && (
                              <span className="ml-2 inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                                👨‍⚕️ Counsellor
                              </span>
                            )}
                          </p>
                        )}
                        {/* Message Bubble */}
                        <div
                          className={`px-4 py-2.5 rounded-lg break-words shadow-md hover:shadow-lg transition-shadow ${
                            isCurrentUser
                              ? 'bg-blue-600 text-white rounded-br-none'
                              : 'bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-600'
                          }`}
                        >
                          {message.type === 'audio' ? (
                            <div className="flex items-center space-x-2 py-1">
                              <Mic className={`w-4 h-4 ${isCurrentUser ? 'text-white' : 'text-blue-500'} animate-pulse`} />
                              <span className="text-sm font-semibold">{message.content}</span>
                            </div>
                          ) : (
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          )}
                        </div>
                        {/* Timestamp */}
                        <p className={`text-xs ${theme.colors.muted} mt-1 px-3`}>
                          {msgTime}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Input Area - Enhanced with better styling */}
        <div className="flex-shrink-0 w-full p-4 sm:p-5 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-t z-10" style={{paddingBottom: 'env(safe-area-inset-bottom)'}}>
          <div className="max-w-3xl mx-auto flex items-end space-x-3 sm:space-x-4 w-full px-0">
            <div className="flex-1 flex items-center bg-white dark:bg-gray-700 rounded-2xl border border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 dark:focus-within:ring-blue-900 transition-all px-4">
              <Input
                placeholder={t('typeMessagePlaceholder') || 'Type your message...'}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 !border-0 bg-transparent !ring-0 focus-visible:!ring-0 focus:outline-none placeholder-gray-400 py-3 sm:py-4 text-base"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="icon-tap rounded-full bg-blue-600 text-white p-3 h-12 w-12 flex items-center justify-center hover:bg-blue-700 hover:shadow-lg disabled:bg-gray-300 disabled:shadow-none transition-all"
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
              <button
                aria-label={isRecording ? 'Stop recording' : 'Voice message'}
                onClick={() => { isRecording ? stopRecording() : startRecording(); }}
                className={`icon-tap rounded-full p-3 h-12 w-12 flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-blue-600 shadow-sm hover:shadow-md'}`}
                title={isRecording ? 'Stop recording' : 'Voice message'}
              >
                <Mic className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
              </button>
            </div>
          </div>
        </div>
        
        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
        `}</style>
      </div>
    );
  }

  // Communities List View
  return (
    <div className="space-y-8">
      {/* Header (styled like AI Companion) */}
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-[22px] font-semibold ${theme.colors.text}`}>{t('communitySupportGroups')}</h2>
        {/* right-side intentionally left empty (matches AI Companion layout) */}
      </div>
      <p className={`${theme.colors.muted} mt-1 text-sm md:text-base overflow-hidden truncate max-w-xl whitespace-nowrap` }>
        {t('connectWithOthersDesc')}
      </p>

      {/* Joined Communities Section */}
      <div className="space-y-4">
        <h3 className={`text-xl font-semibold ${theme.colors.text} flex items-center`}>
          <Users className="w-5 h-5 mr-2 text-blue-500" />
          {t('joinedCommunities') || 'Joined Communities'}
        </h3>
        <div className="hidden md:grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Dummy Joined Community 1 */}
          <Card className={`${theme.colors.card} border-0 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-l-4 border-l-green-500 group`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2 text-green-500 group-hover:text-green-600 transition-colors" />
                Mental Health Awareness
              </CardTitle>
              <CardDescription className="text-xs text-gray-600 dark:text-gray-400">
                A supportive community for mental health awareness and peer support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  245 members
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3 h-3" />
                  {t('joined')}
                </div>
              </div>
              <Button 
                className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2 font-semibold shadow-md hover:shadow-lg transition-all"
                onClick={() => {
                  const dummyCommunity = {
                    id: 'mental-health-1',
                    title: 'Mental Health Awareness',
                    description: 'A supportive community for mental health awareness and peer support',
                    member_count: 245,
                    created_at: new Date().toISOString(),
                    assigned_counsellor: 'Dr. Sarah Johnson'
                  };
                  setSelectedCommunity(dummyCommunity);
                  fetchMessages(dummyCommunity.id);
                }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {t('openChat') || 'Open Chat'}
              </Button>
            </CardContent>
          </Card>

          {/* Dummy Joined Community 2 */}
          <Card className={`${theme.colors.card} border-0 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border-l-4 border-l-green-500 group`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2 text-green-500 group-hover:text-green-600 transition-colors" />
                Stress Management Support
              </CardTitle>
              <CardDescription className="text-xs text-gray-600 dark:text-gray-400">
                Practical techniques and strategies for managing stress and building resilience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  156 members
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3 h-3" />
                  {t('joined')}
                </div>
              </div>
              <Button 
                className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2 font-semibold shadow-md hover:shadow-lg transition-all"
                onClick={() => {
                  const dummyCommunity = {
                    id: 'stress-management-1',
                    title: 'Stress Management Support',
                    description: 'Practical techniques and strategies for managing stress and building resilience',
                    member_count: 156,
                    created_at: new Date().toISOString(),
                    assigned_counsellor: 'Dr. Priya Sharma'
                  };
                  setSelectedCommunity(dummyCommunity);
                  fetchMessages(dummyCommunity.id);
                }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {t('openChat') || 'Open Chat'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Mobile view for Joined Communities */}
        <div className="md:hidden space-y-3">
          <div className={`w-full box-border flex items-center justify-between p-3 rounded-lg ${theme.colors.card} shadow-sm border border-l-4 border-l-green-500`}>                
            <div className="min-w-0">
              <div className="font-medium text-sm truncate">Mental Health Awareness</div>
              <div className="text-[11px] text-gray-500 hidden md:block">A safe space for mental health discussions</div>
              <div className="text-[11px] text-gray-500">245 members</div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                className="bg-green-500 text-white px-3 py-1 text-sm"
                onClick={() => {
                  const dummyCommunity = {
                    id: 'mental-health-1',
                    title: 'Mental Health Awareness',
                    description: 'A supportive community for mental health awareness and peer support',
                    member_count: 245,
                    created_at: new Date().toISOString(),
                    assigned_counsellor: 'Dr. Sarah Johnson'
                  };
                  setSelectedCommunity(dummyCommunity);
                  fetchMessages(dummyCommunity.id);
                }}
              >
                {t('openChat') || 'Chat'}
              </Button>
            </div>
          </div>
          <div className={`w-full box-border flex items-center justify-between p-3 rounded-lg ${theme.colors.card} shadow-sm border border-l-4 border-l-green-500`}>                
            <div className="min-w-0">
              <div className="font-medium text-sm truncate">Stress Management Support</div>
              <div className="text-[11px] text-gray-500 hidden md:block">Practical tips for managing stress effectively</div>
              <div className="text-[11px] text-gray-500">156 members</div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                className="bg-green-500 text-white px-3 py-1 text-sm"
                onClick={() => {
                  const dummyCommunity = {
                    id: 'stress-management-1',
                    title: 'Stress Management Support',
                    description: 'Practical techniques and strategies for managing stress and building resilience',
                    member_count: 156,
                    created_at: new Date().toISOString(),
                    assigned_counsellor: 'Dr. Priya Sharma'
                  };
                  setSelectedCommunity(dummyCommunity);
                  fetchMessages(dummyCommunity.id);
                }}
              >
                {t('openChat') || 'Chat'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 pt-8"></div>

      {/* Communities Header */}
      {userCommunities.length > 0 && (
        <div className="space-y-4">
          <h3 className={`text-xl font-semibold ${theme.colors.text} flex items-center`}>
            <UserCheck className="w-5 h-5 mr-2 text-green-500" />
            {t('myCommunities')}
          </h3>
          {/* Mobile: compact horizontal rows (only on small phones) */}
          <div className="md:hidden space-y-3">
            {userCommunities.map((community) => (
              <div key={community.id} className={`w-full box-border flex items-center justify-between p-3 rounded-lg ${theme.colors.card} shadow-sm border`}>                
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{community.title}</div>
                  <div className="text-[11px] text-gray-500">{community.member_count} members</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button onClick={(e) => { e.preventDefault(); setSelectedCommunity(community); fetchMessages(community.id); }} className="bg-blue-500 text-white px-3 py-1 text-sm">
                    {t('open')}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop / tablet grid */}
          <div className="hidden md:grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userCommunities.map((community) => (
              <Card key={community.id} className={`${theme.colors.card} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-l-4 border-l-green-500`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-800">
                    {community.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-600 line-clamp-2">
                    {community.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <Badge className="bg-green-100 text-green-800 text-xs w-fit">
                      <Users className="w-3 h-3 mr-1" />
                      {community.member_count} members
                    </Badge>
                  </div>
                  <Button 
                    className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedCommunity(community);
                      fetchMessages(community.id);
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {t('open')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Communities */}
      <div className="space-y-4">
        <h3 className={`text-lg font-semibold ${theme.colors.text} flex items-center`}>
          {t('allCommunities')}
        </h3>
        {/* Mobile compact list (only on small phones) */}
        <div className="md:hidden space-y-3">
          {communities.map((community) => {
            const isUserMember = isMember(community.id);
            return (
              <div key={community.id} className={`w-full box-border flex items-start justify-between p-3 rounded-lg ${theme.colors.card} border`}> 
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm truncate">{community.title}</div>
                    <div className="text-[11px] text-gray-400">{new Date(community.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="text-[11px] text-gray-500 hidden md:block mt-1">{community.description}</div>
                  <div className="text-[11px] text-gray-600 mt-1">{community.member_count} members</div>
                </div>
                <div className="flex items-start ml-3">
                  {isUserMember ? (
                    <Button onClick={(e) => { e.preventDefault(); setSelectedCommunity(community); fetchMessages(community.id); }} className="bg-blue-500 text-white px-3 py-1 text-sm">{t('openChat')}</Button>
                  ) : (
                    <Button onClick={() => { setCommunityToJoin(community); setIsJoinDialogOpen(true); }} className="bg-green-500 text-white px-3 py-1 text-sm">{t('joinCommunity')}</Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden md:grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => {
            const isUserMember = isMember(community.id);
            return (
              <Card key={community.id} className={`${theme.colors.card} border-0 shadow-sm transition-all duration-200 border-l-4 ${isUserMember ? 'border-l-green-500' : 'border-l-blue-500'}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-800">
                    {community.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-600 line-clamp-2">
                    {community.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <Badge className={`text-xs w-fit ${isUserMember ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      <Users className="w-3 h-3 mr-1" />
                      {community.member_count} members
                    </Badge>
                  </div>
                  {isUserMember ? (
                    <Button 
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-2"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedCommunity(community);
                        fetchMessages(community.id);
                      }}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {t('open')}
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2"
                      onClick={() => {
                        setCommunityToJoin(community);
                        setIsJoinDialogOpen(true);
                      }}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      {t('joinCommunity')}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Join Confirmation Dialog */}
      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-lg sm:text-xl">
              <UserPlus className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
              {t('joinCommunity')}
            </DialogTitle>
            <DialogDescription>
              {communityToJoin && (
                <div className="space-y-3 mt-4">
                  <div className="font-semibold text-base sm:text-lg break-words">{communityToJoin.title}</div>
                  {communityToJoin.description ? (
                    <div className="text-sm text-gray-600 break-words line-clamp-3">{communityToJoin.description}</div>
                  ) : (
                    <div className="text-sm text-gray-500">{t('noCommunitiesAvailable')}</div>
                  )}
                  <div className="text-xs sm:text-sm text-gray-400 break-words">{communityToJoin.member_count} members • {new Date(communityToJoin.created_at).toLocaleDateString()}</div>
                  <div className="text-sm text-gray-700 mt-3 break-words">{t('joinCommunityConfirmDesc', { title: communityToJoin.title })}</div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsJoinDialogOpen(false)} className="flex-1 sm:flex-none">
              {t('cancel')}
            </Button>
            <Button 
              onClick={() => communityToJoin && handleJoinCommunity(communityToJoin)}
              className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600"
            >
              {t('joinCommunity')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {communities.length === 0 && (
        <Card className={`${theme.colors.card} border-2 border-dashed border-gray-300 p-8`}>
          <div className="text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">{t('noCommunitiesAvailable')}</h3>
            <p className="text-gray-500">{t('communitiesWillAppear')}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CommunityView;