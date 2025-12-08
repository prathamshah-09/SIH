import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { useAuth } from '@context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@components/ui/alert-dialog';
import { 
  Plus, 
  Users, 
  Settings, 
  Trash2, 
  Edit, 
  MessageCircle,
  ArrowLeft,
  RefreshCw,
  Send,
  BarChart3,
  Loader2
} from 'lucide-react';

// API Services
import {
  getAdminAllCommunities,
  getAdminCommunityStatistics,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  getAdminCommunityMessages,
} from '@services/communityService';

// Socket Service
import {
  initiateCommunitySocket,
  joinCommunityRoom,
  leaveCommunityRoom,
  sendCommunityMessage,
  emitCommunityTyping,
  emitCommunityStopTyping,
  onNewCommunityMessage,
  onCommunityUserTyping,
  removeCommunityListener,
} from '@services/socketService';

const CommunityManagement = () => {
  const [communities, setCommunities] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, communityId: '', communityTitle: '' });
  const [editingCommunity, setEditingCommunity] = useState(null);
  const [newCommunityForm, setNewCommunityForm] = useState({ title: '', description: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { theme } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();

  // Theme detection: detect Midnight Calm / dark-like themes for stronger contrast
  const [isDarkLike, setIsDarkLike] = useState(false);
  useEffect(() => {
    try {
      const themeName = (theme?.name || theme?.id || '').toString().toLowerCase();
      const docTheme = typeof document !== 'undefined' ? (document.documentElement.getAttribute('data-theme') || '').toLowerCase() : '';
      const docClassList = typeof document !== 'undefined' ? Array.from(document.documentElement.classList) : [];

      const combined = [themeName, docTheme, ...docClassList].join(' ').toLowerCase();
      const midnightMatch = /midnight|midnight-calm|dark/.test(combined);
      setIsDarkLike(Boolean(midnightMatch));
    } catch (e) {
      setIsDarkLike(Boolean(theme?.currentTheme === 'dark'));
    }
  }, [theme]);

  // Initialize Socket.IO
  useEffect(() => {
    if (user && user.id && user.role && user.college_id) {
      initiateCommunitySocket(user).then(() => {
        setSocketConnected(true);
      }).catch(err => {
        console.error('Failed to connect socket:', err);
        setSocketConnected(false);
      });
    } else {
      setSocketConnected(false);
    }
  }, [user]);

  // Fetch all communities and statistics
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [communitiesData, statsData] = await Promise.all([
        getAdminAllCommunities(),
        getAdminCommunityStatistics()
      ]);
      setCommunities(communitiesData || []);
      setStatistics(statsData || {});
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected community
  const fetchMessages = async (communityId) => {
    try {
      setMessagesLoading(true);
      const data = await getAdminCommunityMessages(communityId);
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Create community
  const handleCreateCommunity = async () => {
    if (!newCommunityForm.title.trim() || !newCommunityForm.description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setIsCreating(true);
      const newCommunity = await createCommunity(
        newCommunityForm.title,
        newCommunityForm.description
      );
      setCommunities([...communities, newCommunity]);
      setNewCommunityForm({ title: '', description: '' });
      setIsCreateDialogOpen(false);
      const statsData = await getAdminCommunityStatistics();
      setStatistics(statsData);
    } catch (error) {
      console.error('Error creating community:', error);
      alert('Failed to create community');
    } finally {
      setIsCreating(false);
    }
  };

  // Update community
  const handleUpdateCommunity = async () => {
    if (!editingCommunity || !editingCommunity.title.trim() || !editingCommunity.description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setIsUpdating(true);
      const updated = await updateCommunity(editingCommunity.id, {
        title: editingCommunity.title,
        description: editingCommunity.description
      });
      setCommunities(communities.map(c => c.id === editingCommunity.id ? updated : c));
      if (selectedCommunity?.id === editingCommunity.id) {
        setSelectedCommunity(updated);
      }
      setEditingCommunity(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating community:', error);
      alert('Failed to update community');
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete community
  const handleDeleteCommunity = async (communityId) => {
    try {
      setIsDeleting(true);
      await deleteCommunity(communityId);
      setCommunities(communities.filter(c => c.id !== communityId));
      if (selectedCommunity?.id === communityId) {
        setSelectedCommunity(null);
        setMessages([]);
      }
      setDeleteDialog({ open: false, communityId: '', communityTitle: '' });
      const statsData = await getAdminCommunityStatistics();
      setStatistics(statsData);
    } catch (error) {
      console.error('Error deleting community:', error);
      alert('Failed to delete community');
    } finally {
      setIsDeleting(false);
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedCommunity) return;

    try {
      setSendingMessage(true);
      if (socketConnected) {
        sendCommunityMessage(selectedCommunity.id, newMessage.trim());
      } else {
        console.warn('Socket not connected');
        fetchMessages(selectedCommunity.id);
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

  // Typing indicator
  const handleTyping = () => {
    if (selectedCommunity && socketConnected) {
      emitCommunityTyping(selectedCommunity.id);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        emitCommunityStopTyping(selectedCommunity.id);
      }, 3000);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAllData();
  }, [user]);

  // Set up socket listeners when community is selected
  useEffect(() => {
    if (selectedCommunity && socketConnected) {
      joinCommunityRoom(selectedCommunity.id);
      fetchMessages(selectedCommunity.id);

      const handleNewMessage = (message) => {
        setMessages(prev => [...prev, message]);
      };

      const handleUserTyping = (data) => {
        setTypingUsers(prev => new Set([...prev, data.userId]));
      };

      onNewCommunityMessage(handleNewMessage);
      onCommunityUserTyping(handleUserTyping);

      return () => {
        leaveCommunityRoom(selectedCommunity.id);
        removeCommunityListener('new-message');
        removeCommunityListener('user-typing');
      };
    }
  }, [selectedCommunity, socketConnected]);

  // Auto-scroll
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Format time
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper classes for dark-like vs light themes
  const titleTextClass = isDarkLike ? 'text-white' : theme.colors.text || 'text-gray-900';
  const mutedTextClass = isDarkLike ? 'text-gray-300' : 'text-gray-600';
  const cardHeaderTitleClass = isDarkLike ? 'text-white' : 'text-gray-800';
  const cardDescClass = isDarkLike ? 'text-gray-300' : 'text-gray-600';
  const statNumberClass = isDarkLike ? 'text-white' : '';
  const communityCardBg = isDarkLike ? 'bg-slate-800' : theme.colors.card;
  const communityCardBorder = isDarkLike ? 'border border-white/5' : '';

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
          <p className="text-gray-500">Loading community management...</p>
        </div>
      </div>
    );
  }

  // Chat View
  if (selectedCommunity) {
    return (
      <div className={`flex flex-col w-full overflow-hidden ${theme.colors.background}`} style={{ height: 'calc(100vh - 110px)' }}>
        {/* Header */}
        <div className={`flex-shrink-0 p-4 sm:p-6 border-b ${isDarkLike ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-blue-50 to-cyan-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCommunity(null)}
                className="hover:scale-105 transition-transform"
              >
                <ArrowLeft className={`w-5 h-5 ${isDarkLike ? 'text-white' : ''}`} />
              </Button>
              <div>
                <h2 className={`text-xl font-bold ${titleTextClass} flex items-center`}>
                  <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
                  {selectedCommunity.title}
                </h2>
                <p className={`text-xs ${mutedTextClass} flex items-center space-x-1 mt-1`}>
                  <Users className={`w-3 h-3 ${isDarkLike ? 'text-white/60' : ''}`} />
                  <span>{selectedCommunity.total_members} {t('members') || 'members'}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingCommunity({ ...selectedCommunity });
                  setIsEditDialogOpen(true);
                }}
              >
                <Edit className={`w-4 h-4 mr-2 ${isDarkLike ? 'text-white' : ''}`} />
                {t('edit') || 'Edit'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchMessages(selectedCommunity.id)}
              >
                <RefreshCw className={`w-4 h-4 ${isDarkLike ? 'text-white' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className={`flex-1 w-full overflow-y-auto ${isDarkLike ? 'bg-slate-900' : 'bg-gradient-to-b from-cyan-50 to-blue-50'} p-4 sm:p-6`}
        >
          <div className="space-y-4 w-full pb-4 px-2 sm:px-4">
            {messagesLoading ? (
              <div className="flex items-center justify-center h-full min-h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-64 text-center">
                <div>
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                  <p className={`${mutedTextClass} text-sm`}>
                    {t('noMessagesYet') || 'No messages yet'}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => {
                  const isStudent = message.sender_role === 'student';
                  const isAdmin = message.sender_role === 'admin';
                  const isCounsellor = message.sender_role === 'counsellor';
                  const isCurrentUser = message.sender_id === user?.id;
                  const displayName = isStudent ? message.anonymous_username : message.username;
                  const msgTime = formatTime(message.created_at);

                  // bubble classes for readability in dark
                  const incomingBubbleClass = isDarkLike
                    ? 'bg-slate-800 text-white border border-gray-700'
                    : 'bg-white text-gray-900 border border-gray-200';
                  const outgoingBubbleClass = 'bg-blue-600 text-white';

                  return (
                    <div 
                      key={message.id} 
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3 animate-fadeIn`}
                    >
                      <div className="flex flex-col max-w-xs lg:max-w-md">
                        <p className={`${isDarkLike ? 'text-gray-200 font-semibold text-xs px-3 mb-1 truncate' : 'text-gray-600 font-semibold text-xs px-3 mb-1 truncate'} ${isCurrentUser ? 'text-right' : ''}`}>
                          {displayName}
                          {!isStudent && (
                            <span className={`ml-2 inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                              isAdmin 
                                ? (isDarkLike ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800')
                                : (isDarkLike ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800')
                            }`}>
                              {isAdmin ? '👑 Admin' : '👨‍⚕️ Counsellor'}
                            </span>
                          )}
                          {isStudent && (
                            <span className={`ml-2 inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold ${isDarkLike ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                              👤 Student
                            </span>
                          )}
                        </p>

                        <div className={`px-4 py-4 rounded-2xl break-words shadow-md hover:shadow-lg transition-shadow ${isCurrentUser ? outgoingBubbleClass + ' rounded-br-none' : incomingBubbleClass + ' rounded-bl-none'}`}>
                          <p className="text-base leading-relaxed">{message.message_text}</p>
                        </div>

                        <p className={`${isDarkLike ? 'text-gray-300 text-xs mt-1 px-3' : 'text-gray-500 text-xs mt-1 px-3'} ${isCurrentUser ? 'text-right' : ''}`}>
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

        {/* Input */}
        <div className={`flex-shrink-0 w-full p-4 sm:p-5 border-t z-10 ${isDarkLike ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-white to-gray-50'}`}>
          <div className="max-w-3xl mx-auto flex items-end space-x-3 sm:space-x-4 w-full px-0">
            <div className={`flex-1 flex items-center ${isDarkLike ? 'bg-slate-800' : 'bg-white'} rounded-2xl border ${isDarkLike ? 'border-gray-700' : 'border-gray-300'} hover:border-blue-400 dark:hover:border-blue-500 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 dark:focus-within:ring-blue-900 transition-all px-4`}>
              <Input
                placeholder={t('typeMessagePlaceholder') || 'Type your message...'}
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                className={`flex-1 !border-0 bg-transparent !ring-0 focus-visible:!ring-0 focus:outline-none placeholder-gray-400 py-3 sm:py-4 text-base ${isDarkLike ? 'text-white' : ''}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sendingMessage}
              className="icon-tap rounded-full bg-blue-600 text-white p-3 h-12 w-12 flex items-center justify-center hover:bg-blue-700 hover:shadow-lg disabled:bg-gray-300 disabled:shadow-none transition-all"
            >
              {sendingMessage ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Management View
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-[22px] font-semibold ${titleTextClass}`}>
          {t('communityManagement') || 'Community Management'}
        </h2>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('addCommunity') || 'Add Community'}
        </Button>
      </div>

      {/* Statistics Section */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className={`${communityCardBg} ${communityCardBorder} border-0 shadow-sm`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm font-medium ${cardDescClass}`}>
                {t('totalCommunities') || 'Total Communities'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${statNumberClass}`}>{statistics.total_communities || 0}</div>
            </CardContent>
          </Card>

          <Card className={`${communityCardBg} ${communityCardBorder} border-0 shadow-sm`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm font-medium ${cardDescClass}`}>
                {t('totalMembers') || 'Total Members'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${statNumberClass}`}>{statistics.total_members || 0}</div>
            </CardContent>
          </Card>

          <Card className={`${communityCardBg} ${communityCardBorder} border-0 shadow-sm`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm font-medium ${cardDescClass}`}>
                {t('avgMembers') || 'Avg Members'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${statNumberClass}`}>
                {statistics.avg_members_per_community?.toFixed(1) || 0}
              </div>
            </CardContent>
          </Card>

          <Card className={`${communityCardBg} ${communityCardBorder} border-0 shadow-sm`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm font-medium ${cardDescClass}`}>
                {t('mostActive') || 'Most Active'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-sm font-bold ${statNumberClass} line-clamp-2`}>
                {statistics.most_active_community?.title || 'N/A'}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Communities List */}
      <div className="space-y-4">
        <h3 className={`text-lg font-semibold ${titleTextClass}`}>
          {t('allCommunities') || 'All Communities'} ({communities.length})
        </h3>

        {communities.length === 0 ? (
          <Card className={`${communityCardBg} ${communityCardBorder} border-2 border-dashed border-gray-300 p-8`}>
            <div className="text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className={`${isDarkLike ? 'text-white' : 'text-gray-600'} text-xl font-semibold mb-2`}>
                {t('noCommunitiesCreated') || 'No communities created yet'}
              </h3>
              <p className={`${isDarkLike ? 'text-gray-300' : 'text-gray-500'} mb-4`}>
                {t('createFirstCommunity') || 'Create your first community using the button above'}
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                {t('createCommunity') || 'Create Community'}
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {communities.map(community => (
              <Card key={community.id} className={`${communityCardBg} ${communityCardBorder} border-0 shadow-sm hover:shadow-md transition-all duration-200`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-sm font-semibold ${isDarkLike ? 'text-white' : 'text-gray-800'} line-clamp-2 flex items-start justify-between`}>
                    <span>{community.title}</span>
                  </CardTitle>
                  <CardDescription className={`${isDarkLike ? 'text-gray-300' : 'text-xs text-gray-600'} line-clamp-2`}>
                    {community.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className={`${isDarkLike ? 'text-gray-300' : 'text-gray-500'}`}>Members</p>
                      <p className={`${isDarkLike ? 'text-white font-bold' : 'font-bold text-gray-900'}`}>{community.total_members}</p>
                    </div>
                    <div>
                      <p className={`${isDarkLike ? 'text-gray-300' : 'text-gray-500'}`}>Messages</p>
                      <p className={`${isDarkLike ? 'text-white font-bold' : 'font-bold text-gray-900'}`}>{community.total_messages || 0}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1"
                      onClick={() => {
                        setSelectedCommunity(community);
                        fetchMessages(community.id);
                      }}
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {t('chat') || 'Chat'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs py-1"
                      onClick={() => {
                        setEditingCommunity({ ...community });
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      {t('edit') || 'Edit'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="text-xs py-1"
                      onClick={() => setDeleteDialog({
                        open: true,
                        communityId: community.id,
                        communityTitle: community.title
                      })}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Community Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2 text-blue-600" />
              {t('createCommunity') || 'Create Community'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">{t('title') || 'Title'}</Label>
              <Input
                id="title"
                placeholder="Enter community title"
                value={newCommunityForm.title}
                onChange={(e) => setNewCommunityForm({ ...newCommunityForm, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">{t('description') || 'Description'}</Label>
              <Textarea
                id="description"
                placeholder="Enter community description"
                value={newCommunityForm.description}
                onChange={(e) => setNewCommunityForm({ ...newCommunityForm, description: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
              {t('cancel') || 'Cancel'}
            </Button>
            <Button 
              onClick={handleCreateCommunity}
              disabled={isCreating}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {t('create') || 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Community Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Edit className="w-5 h-5 mr-2 text-blue-600" />
              {t('editCommunity') || 'Edit Community'}
            </DialogTitle>
          </DialogHeader>
          {editingCommunity && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">{t('title') || 'Title'}</Label>
                <Input
                  id="edit-title"
                  value={editingCommunity.title}
                  onChange={(e) => setEditingCommunity({ ...editingCommunity, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">{t('description') || 'Description'}</Label>
                <Textarea
                  id="edit-description"
                  value={editingCommunity.description}
                  onChange={(e) => setEditingCommunity({ ...editingCommunity, description: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
              {t('cancel') || 'Cancel'}
            </Button>
            <Button 
              onClick={handleUpdateCommunity}
              disabled={isUpdating}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {t('update') || 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => {
        if (!open) setDeleteDialog({ open: false, communityId: '', communityTitle: '' });
      }}>
        <AlertDialogContent className="w-[95vw] sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteCommunity') || 'Delete Community'}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteConfirmMsg') || 'Are you sure you want to delete'} <strong>{deleteDialog.communityTitle}</strong>? 
              {t('thisActionCannotBeUndone') || ' This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel') || 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteCommunity(deleteDialog.communityId)}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {t('delete') || 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CommunityManagement;
