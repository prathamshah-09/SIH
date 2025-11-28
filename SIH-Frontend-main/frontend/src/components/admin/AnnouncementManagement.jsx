import React, { useState, useEffect } from 'react';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { useAnnouncements } from '@context/AnnouncementContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { Checkbox } from '@components/ui/checkbox';
import { Badge } from '@components/ui/badge';
import { Separator } from '@components/ui/separator';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@components/ui/sheet';
import { useToast } from '../../hooks/use-toast';
import { 
  Megaphone, 
  Send, 
  Calendar, 
  Eye, 
  Edit, 
  Trash2, 
  Clock, 
  Users 
} from 'lucide-react';

const AnnouncementManagement = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [makeVisible, setMakeVisible] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useAnnouncements();
  const { toast } = useToast();

  // Persist sheet state to localStorage
  useEffect(() => {
    try {
      const savedSheetState = localStorage.getItem('announcement_sheet_open');
      if (savedSheetState !== null) {
        setSheetOpen(JSON.parse(savedSheetState));
      }
    } catch (e) {
      console.warn('Failed to restore announcement sheet state', e);
    }
  }, []);

  // Save sheet state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('announcement_sheet_open', JSON.stringify(sheetOpen));
    } catch (e) {
      console.warn('Failed to save announcement sheet state', e);
    }
  }, [sheetOpen]);

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: t('missingInformation'),
        description: t('fillAllFields'),
        variant: 'destructive'
      });
      return;
    }

    addAnnouncement({
      title: title.trim(),
      content: content.trim(),
      visible: makeVisible
    });

    toast({
      title: t('announcementPublished'),
      description: t('announcementLiveMessage'),
      className: 'animate-celebration'
    });

    // Reset form
    setTitle('');
    setContent('');
    setMakeVisible(true);
    // close mobile sheet if open
    setSheetOpen(false);
  };

  const handleDelete = (id) => {
    deleteAnnouncement(id);
    toast({
      title: t('announcementDeletedTitle'),
      description: t('announcementDeletedDesc'),
    });
  };

  const toggleVisibility = (id, currentVisibility) => {
    updateAnnouncement(id, { visible: !currentVisibility });
  };

  return (
    <div className="space-y-6 sm:space-y-8 px-2 sm:px-4 md:px-0">
      {/* Mobile: New Announcement sheet trigger */}
      <div className="md:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button className={`fixed bottom-6 right-6 z-50 bg-gradient-to-r ${theme.colors.primary} text-white shadow-lg px-3 sm:px-4 py-2 sm:py-3 rounded-full text-sm sm:text-base`}> 
              <Megaphone className="w-4 h-4 mr-2" />
              {t('newAnnouncement')}
            </Button>
          </SheetTrigger>

          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle className={`${theme.colors.text} flex items-center text-lg sm:text-xl`}>
                <Megaphone className="w-5 h-5 mr-2 text-white" />
                {t('createAnnouncement')}
              </SheetTitle>
            </SheetHeader>

            <div className="p-3 sm:p-4 space-y-4">
              <div className="space-y-2">
                <label className={`text-xs sm:text-sm font-medium ${theme.colors.text}`}>
                  {t('announcementTitle')}
                </label>
                <Input
                  placeholder={t('announcementTitlePlaceholder')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`text-sm border-2 border-gray-200 hover:border-cyan-300 focus:border-cyan-500 transition-all duration-200 ${theme.colors.card}`}
                />
              </div>

              <div className="space-y-2">
                <label className={`text-xs sm:text-sm font-medium ${theme.colors.text}`}>
                  {t('content')}
                </label>
                <Textarea
                  placeholder={t('contentPlaceholder')}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className={`text-sm border-2 border-gray-200 hover:border-cyan-300 focus:border-cyan-500 transition-all duration-200 resize-none ${theme.colors.card}`}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="visible_mobile"
                    checked={makeVisible}
                    onCheckedChange={(checked) => setMakeVisible(checked)}
                  />
                  <label htmlFor="visible_mobile" className={`text-xs sm:text-sm font-medium ${theme.colors.text} flex items-center`}>
                    <Users className="w-4 h-4 mr-1 text-cyan-500" />
                    {t('makeVisibleToAll')}
                  </label>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button variant="ghost" onClick={() => setSheetOpen(false)} className="flex-1 sm:flex-none text-sm">
                    {t('cancel')}
                  </Button>
                  <Button 
                    onClick={handlePublish}
                    className={`flex-1 sm:flex-none bg-gradient-to-r ${theme.colors.primary} text-white hover:shadow-lg font-semibold px-3 sm:px-4 py-2 rounded-lg hover:scale-105 transition-all duration-200 text-sm`}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {t('publish')}
                  </Button>
                </div>
              </div>
            </div>

          </SheetContent>
        </Sheet>
      </div>

      {/* Create New Announcement (desktop/tablet) */}
      <Card className={`hidden md:block ${theme.colors.card} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]`}>
        <CardHeader className={`bg-gradient-to-r ${theme.colors.primary} rounded-t-lg`}>
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-r ${theme.colors.accent} rounded-full flex items-center justify-center shadow-lg`}>
              <Megaphone className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <CardTitle className={`text-lg ${theme.colors.cardText}`}>
                {t('createNewAnnouncement')}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <label className={`text-sm font-medium ${theme.colors.text}`}>
              {t('announcementTitle')}
            </label>
            <Input
              placeholder={t('announcementTitlePlaceholder')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`border-2 border-gray-200 hover:border-cyan-300 focus:border-cyan-500 transition-all duration-200 ${theme.colors.card}`}
            />
          </div>
          
          <div className="space-y-2">
            <label className={`text-sm font-medium ${theme.colors.text}`}>
              {t('content')}
            </label>
            <Textarea
              placeholder={t('contentPlaceholder')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className={`border-2 border-gray-200 hover:border-cyan-300 focus:border-cyan-500 transition-all duration-200 resize-none ${theme.colors.card}`}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="visible"
                checked={makeVisible}
                onCheckedChange={(checked) => setMakeVisible(checked)}
              />
              <label htmlFor="visible" className={`text-sm font-medium ${theme.colors.text} flex items-center`}>
                <Users className="w-4 h-4 mr-1 text-cyan-500" />
                {t('makeVisibleToAll')}
              </label>
            </div>
            
            <Button 
              onClick={handlePublish}
              className={`bg-gradient-to-r ${theme.colors.primary} text-white hover:shadow-lg font-semibold px-6 hover:scale-105 transition-all duration-200`}
            >
              <Send className="w-4 h-4 mr-2" />
              {t('publishInspire')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Previous Announcements - Full Width */}
      <div className="w-full">
        <Card className={`${theme.colors.card} border-0 shadow-xl w-full`}>
          <CardHeader className={`bg-gradient-to-r ${theme.colors.secondary} rounded-t-lg`}>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className={`text-lg ${theme.colors.cardText}`}>
                {t('previousAnnouncements')}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {announcements.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className={`${theme.colors.muted} text-lg`}>
                  {t('noAnnouncementsYet')}
                </p>
              </div>
            ) : (
              announcements.map((announcement, index) => (
                <div key={announcement.id}>
                  <div className={`flex items-start justify-between p-4 rounded-lg border border-gray-200 hover:border-cyan-300 hover:shadow-md transition-all duration-300 ${theme.colors.card}`}>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className={`font-semibold ${theme.colors.text}`}>
                          {announcement.title}
                        </h3>
                        {announcement.visible ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                            <Eye className="w-3 h-3 mr-1" />
                            {t('live')}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                            {t('draft')}
                          </Badge>
                        )}
                      </div>
                      <p className={`${theme.colors.muted} text-sm mb-2 line-clamp-2`}>
                        {announcement.content}
                      </p>
                      <div className={`flex items-center space-x-4 text-xs ${theme.colors.muted}`}>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {announcement.date}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {announcement.views} {t('views')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                        onClick={() => toggleVisibility(announcement.id, announcement.visible)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-red-50 hover:text-red-600 transition-colors"
                        onClick={() => handleDelete(announcement.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {index < announcements.length - 1 && <Separator className="my-2" />}
                </div>
              ))
            )}
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnnouncementManagement;