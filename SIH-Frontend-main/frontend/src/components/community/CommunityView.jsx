import React, { useState, useEffect } from 'react';
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
  RefreshCw
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
      </div>
    );
                      {community.member_count} members
  }

  // Community Chat View
  if (selectedCommunity) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setSelectedCommunity(null)}
              className="hover:scale-105 transition-transform"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Communities
            </Button>
            <div>
              <h2 className={`text-3xl font-bold ${theme.colors.text} flex items-center`}>
                <MessageCircle className="w-8 h-8 mr-3 text-blue-500" />
                {selectedCommunity.title}
              </h2>
              <p className={`${theme.colors.muted} mt-1`}>{selectedCommunity.description}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => fetchMessages(selectedCommunity.id)}
            className="hover:scale-105 transition-transform"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('refresh')}
          </Button>
        </div>

        {/* Chat Area */}
        <Card className={`${theme.colors.card} border-0 shadow-xl h-[600px] flex flex-col`}>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-500" />
                {t('communityChat')}
              </CardTitle>
              <Badge className="bg-blue-100 text-blue-800">
                {selectedCommunity.member_count} members
              </Badge>
            </div>
          </CardHeader>
          
          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messagesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">{t('noMessagesYet')}</p>
              </div>
            ) : (
              messages.map((message) => {
                const msgTime = new Date(message.timestamp).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                });
                return (
                  <div key={message.id} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                      message.user_role === 'admin' ? 'bg-red-500' :
                      message.user_role === 'counsellor' ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      {message.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-800">{message.user_name}</span>
                        {message.user_role === 'counsellor' && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            Counsellor
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{message.content}</p>
                      <span className="text-xs text-gray-500 mt-1">
                        {msgTime}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>

          {/* Message Input */}
          <div className="border-t p-4">
            {isMember(selectedCommunity.id) ? (
              <div className="flex space-x-3">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t('typeMessagePlaceholder')}
                  className="flex-1 min-h-[60px] resize-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-500 hover:bg-blue-600 self-end"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-4">{t('needToJoinToSendMessages')}</p>
                <Button
                  onClick={() => handleJoinCommunity(selectedCommunity)}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {t('joinCommunity')}
                </Button>
              </div>
            )}
          </div>
        </Card>
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
          <Card className={`${theme.colors.card} border-0 shadow-md hover:shadow-lg transition-all duration-200`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-800 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
                Mental Health Awareness
              </CardTitle>
              <CardDescription className="text-xs text-gray-600">
                A supportive community for mental health awareness and peer support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-green-100 text-green-800 text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  245 members
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {t('joined')}
                </div>
              </div>
              <Button 
                className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {t('openChat') || 'Open Chat'}
              </Button>
            </CardContent>
          </Card>

          {/* Dummy Joined Community 2 */}
          <Card className={`${theme.colors.card} border-0 shadow-md hover:shadow-lg transition-all duration-200`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-800 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
                Stress Management Support
              </CardTitle>
              <CardDescription className="text-xs text-gray-600">
                Practical techniques and strategies for managing stress and building resilience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-green-100 text-green-800 text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  156 members
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {t('joined')}
                </div>
              </div>
              <Button 
                className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2"
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
              <Button className="bg-green-500 text-white px-3 py-1 text-sm">
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
              <Button className="bg-green-500 text-white px-3 py-1 text-sm">
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