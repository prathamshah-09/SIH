import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Play, Clock, ExternalLink } from 'lucide-react';

const VideoSection = ({ videos = [] }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [selectedVideo, setSelectedVideo] = useState(null);

  const getLanguageFlag = (lang) => {
    switch (lang) {
      case 'hi': return '🇮🇳';
      case 'ur': return '🇵🇰';
      case 'en': return '🇺🇸';
      default: return '🌐';
    }
  };

  const getLanguageName = (lang) => {
    switch (lang) {
      case 'hi': return 'Hindi';
      case 'ur': return 'Urdu';
      case 'en': return 'English';
      default: return 'Universal';
    }
  };

  const handleWatchVideo = (video) => {
    setSelectedVideo(video);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={`text-2xl font-bold ${theme.colors.text} flex items-center`}>
          <Play className="w-7 h-7 mr-3 text-red-500" />
          {t('videos')}
        </h3>
        <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          {Math.min(videos.length, 6)} videos
        </Badge>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">{selectedVideo.title}</h3>
              <Button onClick={closeVideo} variant="outline" className="text-red-500 hover:bg-red-50">
                ✕ Close
              </Button>
            </div>
            
            <div className="aspect-video rounded-xl overflow-hidden mb-4">
              <iframe
                src={selectedVideo.url}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selectedVideo.title}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-100 text-blue-800">
                {getLanguageFlag(selectedVideo.language)} {getLanguageName(selectedVideo.language)}
              </Badge>
              <span className="text-gray-600 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {selectedVideo.duration}
              </span>
            </div>
            
            <p className="text-gray-600 mt-3">{selectedVideo.description}</p>
          </div>
        </div>
      )}

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.slice(0, 6).map((video) => (
          <Card key={video.id} className={`${theme.colors.card} hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 group overflow-hidden`}>
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
                <Play className="w-16 h-16 text-white group-hover:scale-125 transition-transform duration-300 drop-shadow-2xl" />
              </div>
              <div className="absolute top-3 right-3">
                <Badge className="bg-black bg-opacity-70 text-white text-xs">
                  {getLanguageFlag(video.language)}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className={`font-bold text-sm ${theme.colors.text} group-hover:text-red-600 transition-colors line-clamp-2`}>
                  {video.title}
                </h4>
              </div>
              
              <p className={`${theme.colors.muted} text-xs mb-3 line-clamp-2`}>
                {video.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="text-xs">
                    {getLanguageName(video.language)}
                  </Badge>
                  <span className={`${theme.colors.muted} text-xs flex items-center`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {video.duration}
                  </span>
                </div>
                
                <Button
                  onClick={() => handleWatchVideo(video)}
                  size="sm"
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1 text-xs transition-all duration-300 hover:scale-105"
                >
                  <Play className="w-3 h-3 mr-1" />
                  {t('watchVideo')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {videos.length === 0 && (
        <Card className={`${theme.colors.card} border-2 border-dashed border-gray-300`}>
          <CardContent className="p-12 text-center">
            <Play className={`w-16 h-16 ${theme.colors.muted} mx-auto mb-4 opacity-50`} />
            <p className={`${theme.colors.muted} text-lg`}>
              No video content available yet. Check back soon for helpful self-help videos!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VideoSection;