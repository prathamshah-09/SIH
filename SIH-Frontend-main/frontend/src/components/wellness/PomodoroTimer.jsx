import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Play, Pause, Square, RotateCcw, Timer } from 'lucide-react';

const PomodoroTimer = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState('work'); // work, shortBreak, longBreak
  const [sessionCount, setSessionCount] = useState(0);
  const intervalRef = useRef(null);

  const sessionTimes = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    
    if (currentSession === 'work') {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);
      
      if (newCount % 4 === 0) {
        setCurrentSession('longBreak');
        setTimeLeft(sessionTimes.longBreak);
      } else {
        setCurrentSession('shortBreak');
        setTimeLeft(sessionTimes.shortBreak);
      }
    } else {
      setCurrentSession('work');
      setTimeLeft(sessionTimes.work);
    }
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(sessionTimes[currentSession]);
  };

  const switchSession = (type) => {
    setIsRunning(false);
    setCurrentSession(type);
    setTimeLeft(sessionTimes[type]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionColor = () => {
    switch (currentSession) {
      case 'work': return 'text-red-500';
      case 'shortBreak': return 'text-green-500';
      case 'longBreak': return 'text-blue-500';
      default: return 'text-red-500';
    }
  };

  const getSessionName = () => {
    switch (currentSession) {
      case 'work': return t('workSession');
      case 'shortBreak': return t('shortBreak');
      case 'longBreak': return t('longBreak');
      default: return t('workSession');
    }
  };

  return (
    <Card className={`${theme.colors.card} border-0 shadow-2xl max-w-2xl mx-auto`}>
      <CardHeader className="text-center">
        <CardTitle className={`flex items-center justify-center ${theme.colors.text} text-xl sm:text-2xl`}>
          <Timer className="w-6 sm:w-8 h-6 sm:h-8 mr-2 sm:mr-3" />
          {t('pomodoroTimer')}
        </CardTitle>
        <p className={`${theme.colors.muted} mt-2 text-sm sm:text-base`}>
          {t('completed')}: {sessionCount} sessions
        </p>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Session Selector */}
        <div className="flex justify-center flex-wrap gap-2 sm:gap-3">
          {Object.keys(sessionTimes).map((type) => (
            <Button
              key={type}
              variant={currentSession === type ? 'animated' : 'outline'}
              onClick={() => switchSession(type)}
              className="px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base transition-all duration-200 whitespace-nowrap"
            >
              {type === 'work' && t('workSession')}
              {type === 'shortBreak' && t('shortBreak')}
              {type === 'longBreak' && t('longBreak')}
            </Button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="text-center">
          <div className={`text-6xl sm:text-8xl font-mono font-bold ${getSessionColor()} mb-4`}>
            {formatTime(timeLeft)}
          </div>
          <p className={`text-lg sm:text-xl ${theme.colors.text} mb-6`}>
            {getSessionName()}
          </p>
        </div>

        {/* Timer Controls */}
        <div className="flex justify-center flex-wrap gap-3 sm:gap-4">
          {!isRunning ? (
            <Button
              onClick={startTimer}
              variant="animated"
              size="lg"
              className="px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg"
            >
              <Play className="w-4 sm:w-6 h-4 sm:h-6 mr-2" />
              {t('startTimer')}
            </Button>
          ) : (
            <Button
              onClick={pauseTimer}
              variant="animated"
              size="lg"
              className="px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg"
            >
              <Pause className="w-4 sm:w-6 h-4 sm:h-6 mr-2" />
              {t('stopTimer')}
            </Button>
          )}
          
          <Button
            onClick={resetTimer}
            size="lg"
            variant="outline"
            className="px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg transition-all duration-300 hover:scale-105"
          >
            <RotateCcw className="w-4 sm:w-6 h-4 sm:h-6 mr-2" />
            {t('resetTimer')}
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`bg-gradient-to-r ${theme.colors.primary} h-3 rounded-full transition-all duration-1000`}
            style={{
              width: `${((sessionTimes[currentSession] - timeLeft) / sessionTimes[currentSession]) * 100}%`
            }}
          ></div>
        </div>

        {/* Instructions */}
        <div className={`${theme.colors.card} p-4 sm:p-6 rounded-xl border ${theme.colors.secondary}`}>
          <h4 className={`font-semibold ${theme.colors.text} mb-3 text-base sm:text-lg`}>How to use Pomodoro Technique:</h4>
          <ul className={`${theme.colors.muted} space-y-2 text-xs sm:text-sm`}>
            <li>• Work for 25 minutes with full focus</li>
            <li>• Take a 5-minute short break</li>
            <li>• After 4 work sessions, take a 15-minute long break</li>
            <li>• Repeat the cycle throughout your study/work time</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroTimer;