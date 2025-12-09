import React, { useEffect } from 'react';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { useAnnouncements } from '@context/AnnouncementContext';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { 
  Megaphone, 
  Calendar, 
  Eye,
  Clock,
  AlertCircle,
  Info,
  AlertTriangle
} from 'lucide-react';

const AnnouncementList = ({ compact = false, limit = null }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { announcements, loading, error, incrementViews } = useAnnouncements();

  const getTypeIcon = (type) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="w-4 h-4" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4" />;
      case 'event':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'event':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      default:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    }
  };

  const handleAnnouncementClick = (announcement) => {
    if (!announcement.hasSeen) {
      incrementViews(announcement.id);
    }
  };

  const displayedAnnouncements = limit 
    ? announcements.slice(0, limit)
    : announcements;

  if (loading && announcements.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${theme.colors.muted}`}>
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
        <p>{error}</p>
      </div>
    );
  }

  if (displayedAnnouncements.length === 0) {
    return (
      <div className="text-center py-8">
        <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className={`${theme.colors.muted} text-lg`}>
          No announcements at this time.
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-3">
        {displayedAnnouncements.map((announcement) => (
          <div
            key={announcement.id}
            onClick={() => handleAnnouncementClick(announcement)}
            className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
              announcement.hasSeen 
                ? 'border-gray-200 hover:border-gray-300 opacity-80' 
                : 'border-cyan-200 hover:border-cyan-400 bg-cyan-50/30'
            } ${theme.colors.card}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              getTypeBadgeColor(announcement.type)
            }`}>
              {getTypeIcon(announcement.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`font-semibold text-sm truncate ${theme.colors.text}`}>
                  {announcement.title}
                </h4>
                {!announcement.hasSeen && (
                  <div className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />
                )}
              </div>
              <p className={`text-xs ${theme.colors.muted} line-clamp-2`}>
                {announcement.content}
              </p>
              <div className={`flex items-center gap-3 mt-2 text-xs ${theme.colors.muted}`}>
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {announcement.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayedAnnouncements.map((announcement) => (
        <Card 
          key={announcement.id}
          onClick={() => handleAnnouncementClick(announcement)}
          className={`${theme.colors.card} border-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer ${
            !announcement.hasSeen ? 'ring-2 ring-cyan-300' : ''
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  getTypeBadgeColor(announcement.type)
                }`}>
                  {getTypeIcon(announcement.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className={`text-lg font-bold ${theme.colors.text}`}>
                      {announcement.title}
                    </CardTitle>
                    {!announcement.hasSeen && (
                      <Badge className="bg-cyan-500 text-white text-xs">New</Badge>
                    )}
                  </div>
                  <div className={`flex flex-wrap items-center gap-3 text-sm ${theme.colors.muted}`}>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      {announcement.date}
                    </span>
                    <Badge className={getTypeBadgeColor(announcement.type)}>
                      {announcement.type}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className={`${theme.colors.text} text-sm leading-relaxed whitespace-pre-wrap`}>
              {announcement.content}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AnnouncementList;
