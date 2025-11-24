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
  Shield
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
  assigned_counsellor: null,
  created_at: c.lastActive || new Date().toISOString(),
  member_count: c.members || 0
}));

const apiGet = async (path) => {
  await fakeApiDelay();
  if (path === '/communities') return [...ephemeralCommunities];
  if (path.startsWith('/users/')) return []; // membership not tracked locally
  if (path.endsWith('/messages')) return []; // messages not stored
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
  if (path.endsWith('/messages')) return { success: true }; // no-op
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
  const [newCommunity, setNewCommunity] = useState({
    title: "",
    description: "",
    assigned_counsellor: ""
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

  // Create community
  const handleCreateCommunity = async () => {
    if (newCommunity.title && newCommunity.description) {
      try {
        const created = await apiPost('/communities', {
          title: newCommunity.title,
          description: newCommunity.description,
          assigned_counsellor: newCommunity.assigned_counsellor || null
        });
        setCommunities([...communities, created]);
        setNewCommunity({ title: "", description: "", assigned_counsellor: "" });
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
          description: editingCommunity.description,
          assigned_counsellor: editingCommunity.assigned_counsellor || null
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-4xl font-bold ${theme.colors.text} flex items-center`}>
            {t('communityManagement')}
            <Shield className="w-8 h-8 ml-3 text-orange-500 animate-pulse" />
          </h2>
          <p className={`${theme.colors.muted} mt-2 text-lg`}>
            {t('createManageCommunities')}
          </p>
          <div className="flex items-center mt-2">
            <Badge className="bg-orange-100 text-orange-800 mr-2">{t('communityHub')}</Badge>
            <Badge className="bg-green-100 text-green-800">{t('mentalHealthSupport')}</Badge>
          </div>
        </div>

        {/* Create Community Button */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className={`bg-gradient-to-r ${theme.colors.primary} hover:shadow-xl text-white transition-all duration-300 hover:scale-105`}>
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
              <div className="grid gap-2">
                <Label htmlFor="counsellor">{t('assignedCounsellorLabel')}</Label>
                <Input
                  id="counsellor"
                  value={newCommunity.assigned_counsellor}
                  onChange={(e) => setNewCommunity({ ...newCommunity, assigned_counsellor: e.target.value })}
                  placeholder={t('assignedCounsellorPlaceholder')}
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`${theme.colors.card} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-semibold ${theme.colors.muted} mb-2`}>{t('totalCommunities')}</p>
                <p className="text-3xl font-bold text-orange-600">{communities.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${theme.colors.card} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-semibold ${theme.colors.muted} mb-2`}>{t('totalMembers')}</p>
                <p className="text-3xl font-bold text-blue-600">
                  {communities.reduce((sum, community) => sum + community.member_count, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${theme.colors.card} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-semibold ${theme.colors.muted} mb-2`}>{t('avgMembers')}</p>
                <p className="text-3xl font-bold text-green-600">
                  {communities.length > 0 
                    ? Math.round(communities.reduce((sum, community) => sum + community.member_count, 0) / communities.length)
                    : 0
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Communities Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {communities.map((community) => (
          <Card key={community.id} className={`${theme.colors.card} border-0 shadow-sm transition-all duration-200`}>            
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-800 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2 text-orange-500" />
                {community.title}
              </CardTitle>
              <CardDescription className="text-xs text-gray-600">
                {community.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  {t('members', { count: community.member_count })}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {new Date(community.created_at).toLocaleDateString()}
                </div>
              </div>
              
              {community.assigned_counsellor && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    <UserCheck className="w-3 h-3 mr-1" />
                    {t('counsellorLabelInline', { name: community.assigned_counsellor })}
                  </Badge>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => openEditDialog(community)}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  {t('edit')}
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  {t('chat')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteDialog({ 
                    open: true, 
                    communityId: community.id, 
                    communityTitle: community.title 
                  })}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
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
              <div className="grid gap-2">
                <Label htmlFor="edit-counsellor">Assigned Counsellor</Label>
                <Input
                  id="edit-counsellor"
                  value={editingCommunity.assigned_counsellor || ""}
                  onChange={(e) => setEditingCommunity({ ...editingCommunity, assigned_counsellor: e.target.value })}
                  placeholder="Counsellor ID or name"
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