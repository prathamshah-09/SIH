import React, { useState, useEffect } from 'react';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { useAnnouncements } from '@context/AnnouncementContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { Badge } from '@components/ui/badge';
import { Separator } from '@components/ui/separator';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@components/ui/sheet';
import { useToast } from '../../hooks/use-toast';
import { 
  Megaphone, 
  Send, 
  Calendar, 
  Eye, 
  Trash2, 
  Clock, 
  AlertCircle,
  BarChart2
} from 'lucide-react';

const AnnouncementManagement = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [durationDays, setDurationDays] = useState(7);
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
      visible: true,
      durationDays: parseInt(durationDays)
    });

    toast({
      title: t('announcementPublished'),
      description: t('announcementLiveMessage'),
      className: 'animate-celebration'
    });

    // Reset form
    setTitle('');
    setContent('');
    setDurationDays(7);
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
    <div className="w-full flex justify-center">
      <div className="w-full lg:w-[95%] space-y-6 lg:space-y-8 px-2 sm:px-3 md:px-4 lg:px-0">
      {/* Create New Announcement (all devices) */}
      <Card className={`${theme.colors.card} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]`}>
        <CardHeader className={`bg-gradient-to-r ${theme.colors.primary} rounded-t-lg py-4 sm:py-5 lg:py-6 px-4 sm:px-5 lg:px-6`}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className={`w-12 h-12 sm:w-13 sm:h-13 lg:w-14 lg:h-14 bg-gradient-to-r ${theme.colors.accent} rounded-full flex items-center justify-center shadow-lg flex-shrink-0`}>
              <Megaphone className="w-6 h-6 sm:w-6.5 sm:h-6.5 lg:w-7 lg:h-7 text-white animate-pulse" />
            </div>
            <div className="flex-1">
              <CardTitle className={`text-lg sm:text-xl lg:text-2xl font-bold ${theme.colors.cardText}`}>
                {t('createNewAnnouncement')}
              </CardTitle>
              <p className={`text-xs sm:text-sm ${theme.colors.muted} mt-1`}>Share important updates with students</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 lg:p-8 space-y-5 lg:space-y-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
            <div className="space-y-2">
              <label className={`text-sm sm:text-base font-semibold ${theme.colors.text}`}>
                {t('announcementTitle')}
              </label>
              <Input
                placeholder={t('announcementTitlePlaceholder')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                className={`text-sm sm:text-base py-2.5 sm:py-3 px-3 sm:px-4 border-2 border-gray-200 hover:border-cyan-300 focus:border-cyan-500 transition-all duration-200 rounded-lg ${theme.colors.card}`}
              />
              <p className={`text-xs sm:text-sm ${theme.colors.muted}`}>{title.length}/100 characters</p>
            </div>

            <div className="space-y-2">
              <label className={`text-sm sm:text-base font-semibold ${theme.colors.text} flex items-center`}>
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-cyan-500" />
                {t('duration')} (days)
              </label>
              <Input
                type="number"
                placeholder="7"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                min="1"
                max="365"
                className={`text-sm sm:text-base py-2.5 sm:py-3 px-3 sm:px-4 border-2 border-gray-200 hover:border-cyan-300 focus:border-cyan-500 transition-all duration-200 rounded-lg ${theme.colors.card}`}
              />
              <p className={`text-xs sm:text-sm ${theme.colors.muted}`}>How long should this be visible?</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className={`text-sm sm:text-base font-semibold ${theme.colors.text}`}>
              {t('content')}
            </label>
            <Textarea
              placeholder={t('contentPlaceholder')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={500}
              rows={4}
              className={`text-sm sm:text-base py-2.5 sm:py-3 px-3 sm:px-4 border-2 border-gray-200 hover:border-cyan-300 focus:border-cyan-500 transition-all duration-200 resize-none rounded-lg ${theme.colors.card}`}
            />
            <p className={`text-xs sm:text-sm ${theme.colors.muted}`}>{content.length}/500 characters</p>
          </div>

          <div className="flex items-center justify-end gap-2 sm:gap-3 pt-2 sm:pt-4">
            <Button 
              onClick={handlePublish}
              className={`bg-gradient-to-r ${theme.colors.primary} text-white hover:shadow-lg font-semibold px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base hover:scale-105 transition-all duration-200 rounded-lg`}
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              {t('publishInspire')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Previous Announcements - Full Width */}
      <div className="w-full">
        <Card className={`${theme.colors.card} border-0 shadow-xl w-full`}>
          <CardHeader className={`bg-gradient-to-r ${theme.colors.secondary} rounded-t-lg py-6 px-4 sm:px-6 lg:px-8`}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <CardTitle className={`text-xl sm:text-2xl font-bold ${theme.colors.cardText}`}>
                  {t('previousAnnouncements')}
                </CardTitle>
                <p className={`text-sm ${theme.colors.muted} mt-1`}>View all announcements sent to students</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 lg:p-8">
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
                  <div className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6 rounded-lg border border-gray-200 hover:border-cyan-300 hover:shadow-md transition-all duration-300 ${theme.colors.card}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className={`font-semibold text-sm sm:text-base ${theme.colors.text} truncate`}>
                          {announcement.title}
                        </h3>
                        {announcement.visible ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            {t('live')}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-800 text-xs">
                            {t('draft')}
                          </Badge>
                        )}
                      </div>
                      <p className={`${theme.colors.muted} text-xs sm:text-sm mb-3 line-clamp-2`}>
                        {announcement.content}
                      </p>
                      <div className={`flex flex-wrap items-center gap-3 sm:gap-4 text-xs ${theme.colors.muted}`}>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1.5" />
                          {announcement.date}
                        </span>
                        <span className="flex items-center">
                          <BarChart2 className="w-3 h-3 mr-1.5" />
                          {announcement.views} {t('views')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 ml-0 sm:ml-4 flex-shrink-0">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title="Toggle visibility"
                        className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                        onClick={() => toggleVisibility(announcement.id, announcement.visible)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title="Delete announcement"
                        className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-red-50 hover:text-red-600 transition-colors"
                        onClick={() => handleDelete(announcement.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {index < announcements.length - 1 && <Separator className="my-2 sm:my-3" />}
                </div>
              ))
            )}
          </div>
        </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default AnnouncementManagement;