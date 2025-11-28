// import React, { useState } from 'react';
// import { useTheme } from '../../context/ThemeContext';
// import { useLanguage } from '../../context/LanguageContext';
// import { Card, CardContent } from '../ui/card';
// import { Button } from '../ui/button';
// import { Badge } from '../ui/badge';
// import { Play, Pause, Volume2, Clock } from 'lucide-react';

// const AudioSection = ({ audios = [] }) => {
//   const { theme } = useTheme();
//   const { t } = useLanguage();
//   const [playingAudio, setPlayingAudio] = useState(null);

//   const handlePlayAudio = (audioId) => {
//     if (playingAudio === audioId) {
//       setPlayingAudio(null);
//     } else {
//       setPlayingAudio(audioId);
//       // In a real implementation, you would integrate with an audio player
//       setTimeout(() => setPlayingAudio(null), 3000); // Auto stop for demo
//     }
//   };

//   const getLanguageFlag = (lang) => {
//     switch (lang) {
//       case 'hi': return '🇮🇳';
//       case 'ur': return '🇵🇰';
//       case 'en': return '🇺🇸';
//       default: return '🌐';
//     }
//   };

//   const getLanguageName = (lang) => {
//     switch (lang) {
//       case 'hi': return 'Hindi';
//       case 'ur': return 'Urdu';
//       case 'en': return 'English';
//       default: return 'Universal';
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h3 className={`text-2xl font-bold ${theme.colors.text} flex items-center`}>
//           <Volume2 className="w-7 h-7 mr-3 text-green-500" />
//           {t('audios')}
//         </h3>
//         <Badge className={`${theme.colors.primary} text-white`}>
//           {audios.length} tracks
//         </Badge>
//       </div>

//       <div className="grid gap-6">
//         {audios.map((audio) => (
//           <Card key={audio.id} className={`${theme.colors.card} hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-0 group`}>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center space-x-3 mb-2">
//                     <h4 className={`font-bold text-lg ${theme.colors.text} group-hover:text-green-600 transition-colors`}>
//                       {audio.title}
//                     </h4>
//                     <span className="text-2xl">{getLanguageFlag(audio.language)}</span>
//                     <Badge variant="outline" className="text-xs">
//                       {getLanguageName(audio.language)}
//                     </Badge>
//                   </div>
                  
//                   <p className={`${theme.colors.muted} text-sm mb-3 max-w-2xl`}>
//                     {audio.description}
//                   </p>
                  
//                   <div className="flex items-center space-x-4">
//                     <div className={`flex items-center ${theme.colors.muted} text-sm`}>
//                       <Clock className="w-4 h-4 mr-1" />
//                       {audio.duration}
//                     </div>
                    
//                     {playingAudio === audio.id && (
//                       <div className="flex items-center space-x-2">
//                         <div className="flex space-x-1">
//                           <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
//                           <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//                           <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                         </div>
//                         <span className="text-green-600 text-sm font-medium">Now Playing</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-3">
//                   <Button
//                     onClick={() => handlePlayAudio(audio.id)}
//                     className={`${
//                       playingAudio === audio.id 
//                         ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
//                         : `bg-gradient-to-r ${theme.colors.primary}`
//                     } hover:shadow-xl text-white px-6 py-3 transition-all duration-300 hover:scale-105 group-hover:shadow-2xl`}
//                   >
//                     {playingAudio === audio.id ? (
//                       <>
//                         <Pause className="w-5 h-5 mr-2" />
//                         Stop
//                       </>
//                     ) : (
//                       <>
//                         <Play className="w-5 h-5 mr-2" />
//                         {t('playAudio')}
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </div>
              
//               {/* Progress bar when playing */}
//               {playingAudio === audio.id && (
//                 <div className="mt-4">
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full animate-pulse" style={{ width: '45%' }}></div>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {audios.length === 0 && (
//         <Card className={`${theme.colors.card} border-2 border-dashed border-gray-300`}>
//           <CardContent className="p-12 text-center">
//             <Volume2 className={`w-16 h-16 ${theme.colors.muted} mx-auto mb-4 opacity-50`} />
//             <p className={`${theme.colors.muted} text-lg`}>
//               No audio content available yet. Check back soon for relaxing audio tracks!
//             </p>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default AudioSection;

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Infinity,
  Waves,
  Flame,
  CloudRain,
  Trees,
  Wind,
  Zap,
  Music,
  Sun,
  Feather,
  Save,
  Edit3
} from 'lucide-react';

// Persistent audio elements across mounts so playback continues and UI can sync
const persistentAudioElements = {};

const AudioSection = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  // Audio state management
  const [audioStates, setAudioStates] = useState({});
  const audioRefs = useRef({});
  const [isEditing, setIsEditing] = useState(false);
  const [audioUrls] = useState({
  'beach-waves': '/audios/beach-waves-and-birds.mp3',
  'fire': '/audios/fire.mp3',
  'rain': '/audios/rain.mp3',
  'forest': '/audios/forest.mp3',
  'river-stream': '/audios/river-stream.mp3',
  'thunderstorm': '/audios/thunderstorm.mp3',
  'bird-chirping': '/audios/bird-chirping.mp3',
  'wind': '/audios/wind.mp3',
  'summer-night': '/audios/summer-night.mp3'
});



  // Audio data with icons and descriptions
  const soothingAudios = [
    {
      id: 'beach-waves',
      icon: Waves,
      color: 'text-blue-500',
      bgColor: 'from-blue-50 to-cyan-50',
      image: 'https://images.unsplash.com/photo-1616006008140-725c421dd6fd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHx3YXRlciUyMHdhdmVzfGVufDB8fHx8MTc1ODM2NTYyOXww&ixlib=rb-4.1.0&q=85'
    },
    {
      id: 'fire',
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'from-orange-50 to-red-50',
      image: 'https://images.unsplash.com/photo-1574832754806-beedb85b8c46?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=85'
    },
    {
      id: 'rain',
      icon: CloudRain,
      color: 'text-blue-600',
      bgColor: 'from-blue-50 to-indigo-50',
      image: 'https://images.unsplash.com/photo-1512511708753-3150cd2ec8ee?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxyYWluJTIwZHJvcHN8ZW58MHx8fHwxNzU4MzY1NjQxfDA&ixlib=rb-4.1.0&q=85'
    },
    {
      id: 'forest',
      icon: Trees,
      color: 'text-green-600',
      bgColor: 'from-green-50 to-emerald-50',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjB0cmVlc3xlbnwwfHx8fDE3NTgzNjU2MzV8MA&ixlib=rb-4.1.0&q=85'
    },
    {
      id: 'river-stream',
      icon: Waves,
      color: 'text-teal-500',
      bgColor: 'from-teal-50 to-blue-50',
      image: 'https://images.unsplash.com/photo-1521057450496-388a9e558ccf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHw0fHx3YXRlciUyMHdhdmVzfGVufDB8fHx8MTc1ODM2NTYyOXww&ixlib=rb-4.1.0&q=85'
    },
    {
      id: 'thunderstorm',
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'from-purple-50 to-indigo-50',
      image: 'https://images.unsplash.com/photo-1602775638610-03b20b0b5ba9?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=85'
    },
    {
      id: 'bird-chirping',
      icon: Feather,
      color: 'text-yellow-600',
      bgColor: 'from-yellow-50 to-orange-50',
      image: 'https://images.unsplash.com/photo-1516158314695-14bedec722bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxiaXJkcyUyMHNpbmdpbmd8ZW58MHx8fHwxNzU4MzY1NjQ3fDA&ixlib=rb-4.1.0&q=85'
    },
    {
      id: 'wind',
      icon: Wind,
      color: 'text-gray-600',
      bgColor: 'from-gray-50 to-slate-50',
      image: 'https://images.unsplash.com/photo-1532527149069-18229e5aba6e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHx3aW5kJTIwbGVhdmVzfGVufDB8fHx8MTc1ODM2NTY1Mnww&ixlib=rb-4.1.0&q=85'
    },
    {
      id: 'summer-night',
      icon: Music,
      color: 'text-indigo-600',
      bgColor: 'from-indigo-50 to-purple-50',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=85'
    }
  ];

  // Initialize audio states (and reuse persistent elements if present)
  useEffect(() => {
    const states = {};

    soothingAudios.forEach(audio => {
      const existing = persistentAudioElements[audio.id];
      states[audio.id] = {
        isPlaying: existing ? !existing.paused : false,
        volume: existing ? Math.round((existing.volume || 0) * 100) : 50,
        currentTime: existing ? existing.currentTime : 0,
        duration: existing ? existing.duration || 0 : 0,
        isLooping: true
      };
      if (existing) audioRefs.current[audio.id] = existing;
    });

    setAudioStates(states);
  }, []);

  // Create audio elements dynamically and attach listeners. Reuse persistent elements.
  useEffect(() => {
    soothingAudios.forEach(audio => {
      if (!audioUrls[audio.id]) return;

      // Reuse existing persistent element if present
      let audioElement = persistentAudioElements[audio.id];
      if (!audioElement) {
        audioElement = new Audio(audioUrls[audio.id]);
        audioElement.loop = true;
        audioElement.preload = 'metadata';

        // store persistently
        persistentAudioElements[audio.id] = audioElement;
      }

      // keep a local ref mapping for easy access inside component
      audioRefs.current[audio.id] = audioElement;

      // If we created the element now, attach listeners once. If element already existed
      // from a previous mount we rely on its existing listeners and just sync state.
      if (!persistentAudioElements[audio.id]._listenersAttached) {
        const onLoaded = () => {
          setAudioStates(prev => ({
            ...prev,
            [audio.id]: { ...prev[audio.id], duration: audioElement.duration }
          }));
        };

        const onTime = () => {
          setAudioStates(prev => ({
            ...prev,
            [audio.id]: { ...prev[audio.id], currentTime: audioElement.currentTime }
          }));
        };

        const onPlay = () => {
          setAudioStates(prev => ({ ...prev, [audio.id]: { ...prev[audio.id], isPlaying: true } }));
        };

        const onPause = () => {
          setAudioStates(prev => ({ ...prev, [audio.id]: { ...prev[audio.id], isPlaying: false } }));
        };

        const onVolume = () => {
          setAudioStates(prev => ({ ...prev, [audio.id]: { ...prev[audio.id], volume: Math.round((audioElement.volume || 0) * 100) } }));
        };

        audioElement.addEventListener('loadedmetadata', onLoaded);
        audioElement.addEventListener('timeupdate', onTime);
        audioElement.addEventListener('play', onPlay);
        audioElement.addEventListener('pause', onPause);
        audioElement.addEventListener('volumechange', onVolume);

        // mark that listeners are attached so we don't add duplicates across mounts
        persistentAudioElements[audio.id]._listenersAttached = true;
      }

      // Immediately sync state from the actual audio element
      setAudioStates(prev => ({
        ...prev,
        [audio.id]: {
          ...prev[audio.id],
          isPlaying: !audioElement.paused,
          volume: Math.round((audioElement.volume || 0) * 100),
          currentTime: audioElement.currentTime,
          duration: audioElement.duration || prev[audio.id]?.duration || 0
        }
      }));
    });
  }, [audioUrls]);

  const togglePlay = (audioId) => {
    const audioElement = audioRefs.current[audioId];
    if (!audioElement || !audioUrls[audioId]) return;

    const currentState = audioStates[audioId];
    
    if (currentState?.isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play().catch(console.error);
    }

    // state will be updated by audio element event listeners (play/pause)
    setAudioStates(prev => ({
      ...prev,
      [audioId]: { ...prev[audioId], isPlaying: !currentState?.isPlaying }
    }));
  };

  const adjustVolume = (audioId, volume) => {
    const audioElement = audioRefs.current[audioId];
    if (audioElement) {
      audioElement.volume = volume / 100;
    }

    setAudioStates(prev => ({
      ...prev,
      [audioId]: {
        ...prev[audioId],
        volume
      }
    }));
  };

  const toggleMute = (audioId) => {
    const audioElement = audioRefs.current[audio.id] || audioRefs.current[audioId];
    const currentState = audioStates[audioId];
    
    if (audioElement) {
      if (currentState?.volume > 0) {
        audioElement.volume = 0;
        setAudioStates(prev => ({
          ...prev,
          [audioId]: { ...prev[audioId], previousVolume: prev[audioId].volume, volume: 0 }
        }));
      } else {
        const restoreVolume = currentState?.previousVolume || 50;
        audioElement.volume = restoreVolume / 100;
        setAudioStates(prev => ({
          ...prev,
          [audioId]: { ...prev[audioId], volume: restoreVolume }
        }));
      }
    }
  };

  const stopAll = () => {
    Object.keys(audioRefs.current).forEach(audioId => {
      const audioElement = audioRefs.current[audioId];
      if (audioElement && audioStates[audioId]?.isPlaying) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    });

    setAudioStates(prev => {
      const newStates = { ...prev };
      Object.keys(newStates).forEach(audioId => {
        newStates[audioId] = { ...newStates[audioId], isPlaying: false, currentTime: 0 };
      });
      return newStates;
    });
  };

  const saveAudioUrl = (audioId, url) => {
    // Audio URLs are now static, no need to update state
    console.log('Audio URL saved:', audioId, url);
  };

  const getPlayingCount = () => {
    return Object.values(audioStates).filter(state => state?.isPlaying).length;
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Header: single-line title, below it playing count + Stop All */}
      <div className="w-full">
        <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
          <h2 className={`text-2xl md:text-3xl font-bold ${theme.colors.text} inline-flex items-center space-x-3`}> 
            <Volume2 className="w-7 h-7 text-green-500" />
            <span className="truncate">{t('audios')}</span>
          </h2>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
              {`${getPlayingCount()} ${t('playing')}`}
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={stopAll}
              variant="outline"
              className="hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600"
              disabled={getPlayingCount() === 0}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t('stopAll')}
            </Button>
          </div>
        </div>
      </div>

      {/* Audio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {soothingAudios.map((audio) => {
          const Icon = audio.icon;
          const currentState = audioStates[audio.id] || {};
          const hasUrl = Boolean(audioUrls[audio.id]);
          
          return (
            <Card 
              key={audio.id} 
              className={`${theme.colors.card} hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-0 group overflow-hidden ${
                currentState.isPlaying ? 'ring-2 ring-green-400 shadow-green-100' : ''
              }`}
            >
              {/* Audio Image Background */}
              {/* <div 
                className="h-32 bg-cover bg-center relative overflow-hidden"
                style={{ backgroundImage: `url(${audio.image})` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-t ${audio.bgColor} opacity-80`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon className={`w-12 h-12 ${audio.color} filter drop-shadow-lg`} />
                </div>
                {currentState.isPlaying && (
                  <div className="absolute top-3 right-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                )}
              </div> */}

              <CardContent className="p-5">
                {/* Single horizontal row per audio: title | slider | tiny play/pause */}
                <div className="w-full flex items-center space-x-3">
                  <div className="flex-0 min-w-[40%]">
                    <h3 className={`font-semibold text-sm ${theme.colors.text} truncate`}>{t(`audio_${audio.id.replace(/-/g, '_')}_title`)}</h3>
                  </div>

                  <div className="flex-1 flex items-center space-x-3">
                    <span className={`text-xs ${theme.colors.muted} w-10 text-right`}>{currentState.volume || 0}%</span>
                    <div className="flex-1">
                      <Slider
                        value={[currentState.volume || 0]}
                        onValueChange={([value]) => adjustVolume(audio.id, value)}
                        max={100}
                        step={1}
                        className="w-full"
                        aria-label={`${t('audio_' + audio.id.replace(/-/g, '_') + '_title')} volume`}
                      />
                    </div>
                  </div>

                  <div className="flex-0 flex items-center space-x-2">
                    <button
                      onClick={() => toggleMute(audio.id)}
                      aria-label={currentState.volume > 0 ? 'Mute' : 'Unmute'}
                      className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
                      title={currentState.volume > 0 ? t('mute') || 'Mute' : t('unmute') || 'Unmute'}
                    >
                      {currentState.volume > 0 ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => togglePlay(audio.id)}
                      aria-label={currentState.isPlaying ? 'Pause' : 'Play'}
                      className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors focus:outline-none ${currentState.isPlaying ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}
                      title={currentState.isPlaying ? t('pause') || 'Pause' : t('play') || 'Play'}
                    >
                      {currentState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      
    </div>
  );
};

export default AudioSection;