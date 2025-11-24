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
  member_count: c.members,
  created_at: c.lastActive || new Date().toISOString(),
  assigned_counsellor: null
}));

const apiGet = async (path) => {
  await fakeApiDelay();
  if (path === '/communities') return [...ephemeralCommunities];
  if (path.startsWith('/users/')) return []; // membership not tracked
  if (path.endsWith('/messages')) return []; // messages ephemeral empty
  return null;
};

const apiPost = async (path, body) => {
  await fakeApiDelay();
  if (path.endsWith('/join')) return { success: true }; // no-op
  if (path.endsWith('/messages')) return { success: true }; // no-op
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
              messages.map((message) => (
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
                      <Badge 
                        className={`text-xs ${
                          message.user_role === 'admin' ? 'bg-red-100 text-red-800' :
                          message.user_role === 'counsellor' ? 'bg-green-100 text-green-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {message.user_role === 'admin' && <Crown className="w-3 h-3 mr-1" />}
                        {message.user_role === 'counsellor' && <Shield className="w-3 h-3 mr-1" />}
                        {message.user_role.charAt(0).toUpperCase() + message.user_role.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{message.content}</p>
                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(message.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
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

      {/* My Communities */}
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
                  <Button onClick={() => { setSelectedCommunity(community); fetchMessages(community.id); }} className="bg-blue-500 text-white px-3 py-1 text-sm">
                    {t('openChat')}
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
                    <CardTitle className="text-sm font-medium text-gray-800 flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
                      {community.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-600">
                      {community.description}
                    </CardDescription>
                  </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      {community.member_count} members
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {t('joined')}
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2"
                    onClick={() => {
                      setSelectedCommunity(community);
                      fetchMessages(community.id);
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {t('openChat')}
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
                  <div className="text-[11px] text-gray-600 mt-1">{community.member_count} members</div>
                  {/* keep description hidden on mobile to keep compact view */}
                </div>
                <div className="flex items-start ml-3">
                  {isUserMember ? (
                    <Button onClick={() => { setSelectedCommunity(community); fetchMessages(community.id); }} className="bg-blue-500 text-white px-3 py-1 text-sm">{t('openChat')}</Button>
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
              <Card key={community.id} className={`${theme.colors.card} border-0 shadow-sm transition-all duration-200 ${isUserMember ? 'opacity-80' : ''}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-800 flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2 text-blue-500" />
                    {community.title}
                    {isUserMember && <UserCheck className="w-4 h-4 ml-2 text-green-500" />}
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-600">
                    {community.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      {community.member_count} members
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(community.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {community.assigned_counsellor && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Counsellor: {community.assigned_counsellor}
                    </Badge>
                  )}

                  <div className="flex gap-2">
                    {isUserMember ? (
                      <Button 
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2"
                        onClick={() => {
                          setSelectedCommunity(community);
                          fetchMessages(community.id);
                        }}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm">{t('openChat')}</span>
                      </Button>
                    ) : (
                      <Button 
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-2"
                        onClick={() => {
                          setCommunityToJoin(community);
                          setIsJoinDialogOpen(true);
                        }}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        <span className="text-sm">{t('joinCommunity')}</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Join Confirmation Dialog */}
      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <UserPlus className="w-5 h-5 mr-2 text-green-500" />
              {t('joinCommunity')}
            </DialogTitle>
            <DialogDescription>
              {communityToJoin && (
                <div className="space-y-2">
                  <div className="font-semibold text-md">{communityToJoin.title}</div>
                  {communityToJoin.description ? (
                    <div className="text-sm text-gray-600">{communityToJoin.description}</div>
                  ) : (
                    <div className="text-sm text-gray-500">{t('noCommunitiesAvailable')}</div>
                  )}
                  <div className="text-xs text-gray-400">{communityToJoin.member_count} members • {new Date(communityToJoin.created_at).toLocaleDateString()}</div>
                  <div className="text-sm text-gray-700 mt-2">{t('joinCommunityConfirmDesc', { title: communityToJoin.title })}</div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsJoinDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button 
              onClick={() => communityToJoin && handleJoinCommunity(communityToJoin)}
              className="bg-green-500 hover:bg-green-600"
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