import React, { useState, useEffect } from 'react';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
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
  DialogTrigger,
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
  Calendar, 
  Settings, 
  Trash2, 
  Edit, 
  MessageCircle,
  UserCheck,
  Crown,
  Shield,
  ArrowLeft,
  RefreshCw,
  Send
} from 'lucide-react';
// Backend integration placeholders removed localStorage fallback.
// TODO: Replace with real API calls when backend is available.
import { mockCommunityChats } from '@mock/mockData';

const fakeApiDelay = (ms = 200) => new Promise(res => setTimeout(res, ms));

// Ephemeral in-memory store (module scope) to mimic CRUD without persistence
let ephemeralCommunities = mockCommunityChats.map(c => ({
  id: c.id,
  title: c.name,
  description: c.description,
  assigned_counsellor: 'Dr. Sarah Johnson',
  created_at: c.lastActive || new Date().toISOString(),
  member_count: c.members || 0
}));

// Ephemeral message storage per community
let ephemeralMessages = {};

// Demo counsellor names
const counsellorNames = ['Dr. Sarah Johnson', 'Dr. Priya Sharma', 'Dr. Amit Patel', 'Dr. Emma Wilson'];

// Generate demo messages for a community
const generateDemoMessages = (communityId, currentUserName = 'Admin') => {
  if (!ephemeralMessages[communityId]) {
    const messages = [];
    const now = new Date();
    const demoUsers = ['Raj Kumar', 'Neha Singh', 'Arjun Verma', currentUserName];
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
  if (path.startsWith('/users/')) return []; // membership not tracked locally
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
  if (path === '/communities') {
    const newC = {
      id: `c_${Date.now()}`,
      title: body.title,
      description: body.description,
      assigned_counsellor: body.assigned_counsellor || null,
      created_at: new Date().toISOString(),
      member_count: 0
    };
    ephemeralCommunities.push(newC);
    return newC;
  }
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
    return { success: true }; // no-op
  }
  return null;
};

const apiPut = async (path, body) => {
  await fakeApiDelay();
  const match = path.match(/\/communities\/(.+)/);
  if (match) {
    const id = match[1];
    const idx = ephemeralCommunities.findIndex(c => c.id === id);
    if (idx !== -1) {
      ephemeralCommunities[idx] = { ...ephemeralCommunities[idx], ...body };
      return ephemeralCommunities[idx];
    }
  }
  return null;
};

const apiDelete = async (path) => {
  await fakeApiDelay();
  const match = path.match(/\/communities\/(.+)/);
  if (match) {
    const id = match[1];
    ephemeralCommunities = ephemeralCommunities.filter(c => c.id !== id);
    return { success: true };
  }
  return null;
};

const CommunityManagement = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, communityId: "", communityTitle: "" });
  const [editingCommunity, setEditingCommunity] = useState(null);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    title: "",
    description: ""
  });

  const { theme } = useTheme();
  const { t } = useLanguage();

  // Fetch communities
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

  useEffect(() => {
    fetchCommunities();
  }, []);

  // Fetch messages for a community
  const fetchMessages = async (communityId) => {
    try {
      setMessagesLoading(true);
      generateDemoMessages(communityId, 'Admin');
      const data = await apiGet(`/communities/${communityId}/messages`);
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Send a message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedCommunity) return;

    try {
      await apiPost(`/communities/${selectedCommunity.id}/messages`, {
        community_id: selectedCommunity.id,
        user_id: 'admin_001',
        user_name: 'Admin',
        user_role: 'admin',
        content: newMessage.trim()
      });

      setNewMessage('');
      // Refresh messages
      fetchMessages(selectedCommunity.id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Create community
  const handleCreateCommunity = async () => {
    if (newCommunity.title && newCommunity.description) {
      try {
        const created = await apiPost('/communities', {
          title: newCommunity.title,
          description: newCommunity.description
        });
        setCommunities([...communities, created]);
        setNewCommunity({ title: "", description: "" });
        setIsCreateDialogOpen(false);
      } catch (error) {
        console.error('Error creating community:', error);
      }
    }
  };

  // Update community
  const handleUpdateCommunity = async () => {
    if (editingCommunity && editingCommunity.title && editingCommunity.description) {
      try {
        const updated = await apiPut(`/communities/${editingCommunity.id}`, {
          title: editingCommunity.title,
          description: editingCommunity.description
        });
        setCommunities(communities.map(c => 
          c.id === editingCommunity.id ? updated : c
        ));
        setEditingCommunity(null);
        setIsEditDialogOpen(false);
      } catch (error) {
        console.error('Error updating community:', error);
      }
    }
  };

  // Delete community
  const handleDeleteCommunity = async (communityId) => {
    try {
      await apiDelete(`/communities/${communityId}`);
      setCommunities(communities.filter(c => c.id !== communityId));
      setDeleteDialog({ open: false, communityId: "", communityTitle: "" });
    } catch (error) {
      console.error('Error deleting community:', error);
    }
  };

  // Open edit dialog
  const openEditDialog = (community) => {
    setEditingCommunity({ ...community });
    setIsEditDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Community Chat View (for admins)
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
                <MessageCircle className="w-8 h-8 mr-3 text-orange-500" />
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
                <Users className="w-5 h-5 mr-2 text-orange-500" />
                {t('communityChat')}
              </CardTitle>
              <Badge className="bg-orange-100 text-orange-800">
                {selectedCommunity.member_count} members
              </Badge>
            </div>
          </CardHeader>
          
          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messagesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
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
                        {message.user_role === 'admin' && (
                          <Badge className="bg-red-100 text-red-800 text-xs">
                            <Crown className="w-3 h-3 mr-1" />
                            Admin
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
            <div className="flex space-x-3">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={t('typeMessagePlaceholder')}
                className="flex-1 min-h-[60px] resize-none focus:ring-2 focus:ring-orange-500"
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
                className="bg-orange-500 hover:bg-orange-600 self-end"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${theme.colors.text} flex items-center`}>
          {t('communityManagement')}
          <Shield className="w-6 h-6 ml-3 text-orange-500 animate-pulse" />
        </h2>

        {/* Create Community Button */}
        <div className="mt-4 lg:mt-0">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className={`bg-gradient-to-r ${theme.colors.primary} hover:shadow-xl text-white transition-all duration-300 hover:scale-105 text-sm`}>
                <Plus className="w-4 h-4 mr-2" />
                {t('createCommunity')}
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Crown className="w-5 h-5 mr-2 text-orange-500" />
                {t('createNewCommunityTitle')}
              </DialogTitle>
              <DialogDescription>
                {t('createNewCommunityDesc')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">{t('communityTitleLabel')}</Label>
                <Input
                  id="title"
                  value={newCommunity.title}
                  onChange={(e) => setNewCommunity({ ...newCommunity, title: e.target.value })}
                  placeholder={t('communityTitlePlaceholder')}
                  className="focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">{t('communityDescriptionLabel')}</Label>
                <Textarea
                  id="description"
                  value={newCommunity.description}
                  onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                  placeholder={t('communityDescriptionPlaceholder')}
                  rows={3}
                  className="focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={handleCreateCommunity} className="bg-orange-500 hover:bg-orange-600">
                {t('createCommunity')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
        <Card className={`${theme.colors.card} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div>
              <p className={`text-xs sm:text-sm font-semibold ${theme.colors.muted} mb-1 sm:mb-2`}>{t('totalCommunities')}</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600">{communities.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className={`${theme.colors.card} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div>
              <p className={`text-xs sm:text-sm font-semibold ${theme.colors.muted} mb-1 sm:mb-2`}>{t('totalMembers')}</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">
                {communities.reduce((sum, community) => sum + community.member_count, 0)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className={`${theme.colors.card} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div>
              <p className={`text-xs sm:text-sm font-semibold ${theme.colors.muted} mb-1 sm:mb-2`}>{t('avgMembers')}</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">
                {communities.length > 0 
                  ? Math.round(communities.reduce((sum, community) => sum + community.member_count, 0) / communities.length)
                  : 0
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Communities Mobile List */}
      <div className="md:hidden space-y-3">
        {communities.map((community) => (
          <div key={community.id} className={`w-full box-border flex items-start justify-between p-3 rounded-lg ${theme.colors.card} shadow-sm border`}>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{community.title}</div>
              <div className="text-[11px] text-gray-500 hidden md:block">{community.description}</div>
              <div className="text-[11px] text-gray-600 mt-1">{community.member_count} members</div>
            </div>
            <div className="flex items-start ml-3 space-x-1">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCommunity(community);
                  fetchMessages(community.id);
                }}
              >
                <MessageCircle className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                <Edit className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" className="text-xs text-red-500">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Communities Grid */}
      <div className="hidden md:grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {communities.map((community) => (
          <Card key={community.id} className={`${theme.colors.card} border-0 shadow-sm transition-all duration-200 border-l-4 border-l-orange-500`}>
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
                <Badge className="bg-orange-100 text-orange-800 text-xs w-fit">
                  <Users className="w-3 h-3 mr-1" />
                  {community.member_count} members
                </Badge>
              </div>
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm py-2"
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

      {/* Edit Community Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Edit className="w-5 h-5 mr-2 text-orange-500" />
              {t('editCommunityTitle')}
            </DialogTitle>
            <DialogDescription>
              {t('editCommunityDesc')}
            </DialogDescription>
          </DialogHeader>
          {editingCommunity && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Community Title</Label>
                <Input
                  id="edit-title"
                  value={editingCommunity.title}
                  onChange={(e) => setEditingCommunity({ ...editingCommunity, title: e.target.value })}
                  className="focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingCommunity.description}
                  onChange={(e) => setEditingCommunity({ ...editingCommunity, description: e.target.value })}
                  rows={3}
                  className="focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleUpdateCommunity} className="bg-orange-500 hover:bg-orange-600">
              {t('updateCommunity')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-600">
              <Trash2 className="w-5 h-5 mr-2" />
              {t('deleteCommunityTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteCommunityDesc', { title: deleteDialog.communityTitle })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialog({ open: false, communityId: "", communityTitle: "" })}>
              {t('cancel')}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleDeleteCommunity(deleteDialog.communityId)}
              className="bg-red-500 hover:bg-red-600"
            >
              {t('deleteCommunity')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Empty State */}
      {communities.length === 0 && (
        <Card className={`${theme.colors.card} border-2 border-dashed border-gray-300 p-8`}>
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">{t('noCommunitiesYetTitle')}</h3>
            <p className="text-gray-500 mb-4">{t('noCommunitiesYetDesc')}</p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('createFirstCommunity')}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CommunityManagement;