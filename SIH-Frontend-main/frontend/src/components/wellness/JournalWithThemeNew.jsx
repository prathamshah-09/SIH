import React, { useState, useMemo, useEffect } from 'react';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { mockJournalEntries } from '@mock/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
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
  Sun,
  Calendar,
  Frown,
  Heart,
  Sparkles,
  Send,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';

const JournalWithTheme = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  // State management
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expandedJournal, setExpandedJournal] = useState(null);
  const [entries, setEntries] = useState({});
  const [tempEntries, setTempEntries] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [loadingGemini, setLoadingGemini] = useState(false);
  const [showMobileCalendar, setShowMobileCalendar] = useState(false);
  const [dailyBullets, setDailyBullets] = useState({ liked: [''], disliked: [''], reflection: [''], goals: [''], mood: [''] });
  const [weeklyBullets, setWeeklyBullets] = useState({ nextGoals: [''] });

  // Load mock data on component mount
  useEffect(() => {
    const mockEntries = {};
    mockJournalEntries.forEach((entry) => {
      if (entry.dateKey) {
        mockEntries[entry.dateKey] = {
          type: entry.type,
          liked: entry.liked,
          disliked: entry.disliked,
          reflection: entry.reflection,
          goals: entry.goals,
          mood: entry.mood,
          review: entry.review,
          nextGoals: entry.nextGoals,
          negativeThought: entry.negativeThought,
          positiveReframe: entry.positiveReframe,
          geminiReframe: entry.geminiReframe,
          timestamp: entry.timestamp
        };
      }
    });
    setEntries(mockEntries);
  }, []);

  // Calculate journaling streak
  const calculateStreak = useMemo(() => {
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    while (true) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const hasEntry = entries[`${dateKey}_daily`] || entries[`${dateKey}_weekly`] || entries[`${dateKey}_worry`];
      
      if (hasEntry) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }, [entries]);

  // Calendar calculations
  const firstDayOfMonth = useMemo(
    () => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
    [currentMonth]
  );

  const daysInMonth = useMemo(
    () => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate(),
    [currentMonth]
  );

  const formatDateKey = (date) => date.toISOString().split('T')[0];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isFutureDate = (date) => {
    const today = new Date();
    return date > today;
  };

  // Render calendar
  const renderCalendar = () => {
    const calendarDays = [];
    const today = new Date();
    const startDay = firstDayOfMonth.getDay();

    for (let i = 0; i < startDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateKey = formatDateKey(date);
      const hasEntry = entries[dateKey];
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const isTodayDate = isToday(date);
      const isFuture = isFutureDate(date);

      calendarDays.push(
        <div
          key={day}
          className={`
            text-center p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-300 relative text-sm
            ${isSelected
            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold shadow-lg'
            : isTodayDate
              ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 font-semibold hover:shadow-md'
              : isFuture
                ? 'text-gray-400 cursor-not-allowed'
                : 'hover:bg-blue-100 hover:shadow-md'
            }
            ${hasEntry && !isSelected ? 'bg-purple-100 border-2 border-purple-300' : ''}
          `}
          onClick={() => !isFuture && handleDateClick(day)}
        >
          {day}
          {hasEntry && (
            <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
              isSelected ? 'bg-white' : 'bg-purple-500'
            }`}></div>
          )}
        </div>
      );
    }

    return calendarDays;
  };

  // Save entry
  const handleSaveEntry = (journalType, fieldName, value) => {
    const dateKey = formatDateKey(selectedDate);
    const key = `${dateKey}_${journalType}`;

    setEntries(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [fieldName]: value,
        timestamp: new Date().toISOString(),
        type: journalType
      }
    }));

    setEditingField(null);
  };

  // Get entry
  const getEntry = (journalType) => {
    const dateKey = formatDateKey(selectedDate);
    const key = `${dateKey}_${journalType}`;
    return entries[key] || {};
  };

  // Check if date is past date (before today)
  const isPastDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    return selected < today;
  };

  // Get all entries for selected date
  const getEntriesForDate = () => {
    const dateKey = formatDateKey(selectedDate);
    return {
      daily: entries[`${dateKey}_daily`] || null,
      weekly: entries[`${dateKey}_weekly`] || null,
      worry: entries[`${dateKey}_worry`] || null
    };
  };

  // Handle bullet point changes for daily
  const handleDailyBulletChange = (field, index, value) => {
    const newBullets = [...dailyBullets[field]];
    newBullets[index] = value;
    setDailyBullets({ ...dailyBullets, [field]: newBullets });
  };

  // Add new bullet point for daily
  const addDailyBullet = (field) => {
    setDailyBullets({ ...dailyBullets, [field]: [...dailyBullets[field], ''] });
  };

  // Remove bullet point for daily
  const removeDailyBullet = (field, index) => {
    const newBullets = dailyBullets[field].filter((_, i) => i !== index);
    setDailyBullets({ ...dailyBullets, [field]: newBullets.length > 0 ? newBullets : [''] });
  };

  // Handle bullet point changes for weekly
  const handleWeeklyBulletChange = (field, index, value) => {
    const newBullets = [...weeklyBullets[field]];
    newBullets[index] = value;
    setWeeklyBullets({ ...weeklyBullets, [field]: newBullets });
  };

  // Add new bullet point for weekly
  const addWeeklyBullet = (field) => {
    setWeeklyBullets({ ...weeklyBullets, [field]: [...weeklyBullets[field], ''] });
  };

  // Remove bullet point for weekly
  const removeWeeklyBullet = (field, index) => {
    const newBullets = weeklyBullets[field].filter((_, i) => i !== index);
    setWeeklyBullets({ ...weeklyBullets, [field]: newBullets.length > 0 ? newBullets : [''] });
  };

  // Call Gemini API
  const callGeminiAPI = async (fieldType) => {
    setLoadingGemini(true);
    try {
      await new Promise(res => setTimeout(res, 1500));

      // For AI Perspective, generate based on negative thought
      if (fieldType === 'aiPerspective') {
        const mockReframes = [
          'This challenge is an opportunity for growth. Every difficulty teaches us something valuable.',
          'While this feels difficult now, remember your past resilience. You have overcome challenges before.',
          'This situation is temporary. Focus on what you can control and let go of what you cannot.',
          'Your feelings are valid, but they don\'t define your reality. Look for the silver lining.',
          'This is a chance to practice self-compassion. Treat yourself as you would a dear friend.',
        ];
        
        const randomReframe = mockReframes[Math.floor(Math.random() * mockReframes.length)];
        setTempEntries({ ...tempEntries, worry_ai: randomReframe });
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
    } finally {
      setLoadingGemini(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header with Streak and Calendar Icon */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-2xl md:text-4xl font-bold ${theme.colors.text}`}>
            Journal
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Calendar Icon for Mobile/iPad - Opens Popup */}
          <button 
            onClick={() => setShowMobileCalendar(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Open Calendar"
          >
            <Calendar className="w-6 h-6 text-blue-500" />
          </button>
          
          {/* Streak Badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 px-3 md:px-4 py-2 rounded-lg">
            <span className="text-xl md:text-2xl">🔥</span>
            <p className="text-base md:text-lg font-bold text-orange-600">{calculateStreak}</p>
          </div>
        </div>
      </div>

      {/* Calendar Popup for Mobile/iPad */}
      <Dialog open={showMobileCalendar} onOpenChange={setShowMobileCalendar}>
        <DialogContent className="max-w-sm md:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Date</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between">
              <Button
                onClick={handlePrevMonth}
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <h3 className={`font-bold text-lg ${theme.colors.text}`}>
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h3>

              <Button
                onClick={handleNextMonth}
                variant="outline"
                size="sm"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center font-medium text-gray-500 mb-2 text-xs">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-1">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs border-t pt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className={theme.colors.muted}>Selected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className={theme.colors.muted}>Today</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span className={theme.colors.muted}>Has Entry</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Grid: Calendar (Left) + Journals (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: Calendar - Visible only on lg+ screens */}
        <Card className={`hidden lg:block lg:col-span-1 ${theme.colors.card} border-0 shadow-xl h-fit`}>
          <CardHeader>
            <CardTitle className={`${theme.colors.text} flex items-center`}>
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              {t('journalCalendarTitle') || 'Journal Calendar'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button
                onClick={handlePrevMonth}
                variant="outline"
                size="sm"
                className="hover:scale-105 transition-transform"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <h3 className={`font-bold text-lg ${theme.colors.text}`}>
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h3>

              <Button
                onClick={handleNextMonth}
                variant="outline"
                size="sm"
                className="hover:scale-105 transition-transform"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center font-medium text-gray-500 mb-2 text-xs">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-1">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>

            {/* Legend */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className={theme.colors.muted}>Selected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className={theme.colors.muted}>Today</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span className={theme.colors.muted}>Has Entry</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT: Journal Cards */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Past Date Message */}
          {isPastDate() && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-l-blue-500">
              <p className="text-sm text-gray-700">
                <strong>📖 Viewing past entry:</strong> You can see what you journaled on {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>
          )}

          {/* No Entry Message for Past Dates */}
          {isPastDate() && !getEntriesForDate().daily && !getEntriesForDate().weekly && !getEntriesForDate().worry && (
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-l-4 border-l-gray-400">
              <p className="text-sm text-gray-600">
                <strong>✨ No entries found</strong> for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}. Start journaling today!
              </p>
            </div>
          )}
          
          {/* Daily Check-In */}
          <Card className={`${theme.colors.card} border-l-4 border-l-yellow-500 shadow-lg hover:shadow-xl transition-all duration-300`}>
            <CardHeader
              className="pb-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedJournal(expandedJournal === 'daily' ? null : 'daily')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-100 to-orange-100">
                    <Sun className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Daily Check-In</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{isPastDate() ? 'Past Entry' : 'Today\'s Reflection'}</p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-6 h-6 transition-transform ${expandedJournal === 'daily' ? 'rotate-180' : ''}`}
                />
              </div>
            </CardHeader>

            {expandedJournal === 'daily' && (
              <CardContent className="space-y-4 border-t pt-5">
                {isPastDate() && !getEntry('daily').liked && !getEntry('daily').disliked && !getEntry('daily').reflection && !getEntry('daily').goals && !getEntry('daily').mood ? (
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-gray-600">No daily entries recorded for this date</p>
                  </div>
                ) : isPastDate() ? (
                  // Read-only view for past dates
                  <>
                    {getEntry('daily').liked && (
                      <div className="space-y-2">
                        <label className="text-base font-semibold text-gray-800 flex items-center">
                          <Heart className="w-5 h-5 mr-2 text-pink-500" />
                          Things I Liked
                        </label>
                        <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                          <p className="text-base text-gray-800 whitespace-pre-wrap">{getEntry('daily').liked}</p>
                        </div>
                      </div>
                    )}
                    {getEntry('daily').disliked && (
                      <div className="space-y-2">
                        <label className="text-base font-semibold text-gray-800 flex items-center">
                          <Frown className="w-5 h-5 mr-2 text-orange-500" />
                          Things I Didn't Like
                        </label>
                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <p className="text-base text-gray-800 whitespace-pre-wrap">{getEntry('daily').disliked}</p>
                        </div>
                      </div>
                    )}
                    {getEntry('daily').reflection && (
                      <div className="space-y-2">
                        <label className="text-base font-semibold text-gray-800 flex items-center">
                          <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                          Reflection
                        </label>
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="text-base text-gray-800 whitespace-pre-wrap">{getEntry('daily').reflection}</p>
                        </div>
                      </div>
                    )}
                    {getEntry('daily').goals && (
                      <div className="space-y-2">
                        <label className="text-base font-semibold text-gray-800 flex items-center">
                          <Plus className="w-5 h-5 mr-2 text-blue-500" />
                          Tomorrow's Goals
                        </label>
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-base text-gray-800 whitespace-pre-wrap">{getEntry('daily').goals}</p>
                        </div>
                      </div>
                    )}
                    {getEntry('daily').mood && (
                      <div className="space-y-2">
                        <label className="text-base font-semibold text-gray-800 flex items-center">
                          <Frown className="w-5 h-5 mr-2 text-red-500" />
                          Mood Dump Zone
                        </label>
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <p className="text-base text-gray-800 whitespace-pre-wrap">{getEntry('daily').mood}</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // Edit mode for today
                  <>
                    {/* Things I Liked Today */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-base font-semibold text-gray-800 flex items-center">
                          <Heart className="w-5 h-5 mr-2 text-pink-500" />
                          Things I Liked Today
                        </label>
                        <button
                          onClick={() => addDailyBullet('liked')}
                          className="text-pink-500 hover:text-pink-700 text-xl font-bold hover:scale-125 transition-transform"
                          title="Add item"
                        >
                          +
                        </button>
                      </div>
                      <div className="space-y-2">
                        {dailyBullets.liked.map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => handleDailyBulletChange('liked', index, e.target.value)}
                              placeholder="Write one thing..."
                              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-base"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Things I Didn't Like Today */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-base font-semibold text-gray-800 flex items-center">
                          <Frown className="w-5 h-5 mr-2 text-orange-500" />
                          Things I Didn't Like Today
                        </label>
                        <button
                          onClick={() => addDailyBullet('disliked')}
                          className="text-orange-500 hover:text-orange-700 text-xl font-bold hover:scale-125 transition-transform"
                          title="Add item"
                        >
                          +
                        </button>
                      </div>
                      <div className="space-y-2">
                        {dailyBullets.disliked.map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => handleDailyBulletChange('disliked', index, e.target.value)}
                              placeholder="Write one thing..."
                              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-base"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Today's Reflection */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-base font-semibold text-gray-800 flex items-center">
                          <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                          Today's Reflection
                        </label>
                        <button
                          onClick={() => addDailyBullet('reflection')}
                          className="text-purple-500 hover:text-purple-700 text-xl font-bold hover:scale-125 transition-transform"
                          title="Add item"
                        >
                          +
                        </button>
                      </div>
                      <div className="space-y-2">
                        {dailyBullets.reflection.map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => handleDailyBulletChange('reflection', index, e.target.value)}
                              placeholder="Write one reflection..."
                              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-base"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tomorrow's Goals */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-base font-semibold text-gray-800 flex items-center">
                          <Plus className="w-5 h-5 mr-2 text-blue-500" />
                          Tomorrow's Goals
                        </label>
                        <button
                          onClick={() => addDailyBullet('goals')}
                          className="text-blue-500 hover:text-blue-700 text-xl font-bold hover:scale-125 transition-transform"
                          title="Add item"
                        >
                          +
                        </button>
                      </div>
                      <div className="space-y-2">
                        {dailyBullets.goals.map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => handleDailyBulletChange('goals', index, e.target.value)}
                              placeholder="Write one goal..."
                              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mood Dump Zone */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-base font-semibold text-gray-800 flex items-center">
                          <Frown className="w-5 h-5 mr-2 text-red-500" />
                          Mood Dump Zone
                        </label>
                        <button
                          onClick={() => addDailyBullet('mood')}
                          className="text-red-500 hover:text-red-700 text-xl font-bold hover:scale-125 transition-transform"
                          title="Add item"
                        >
                          +
                        </button>
                      </div>
                      <div className="space-y-2">
                        {dailyBullets.mood.map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => handleDailyBulletChange('mood', index, e.target.value)}
                              placeholder="Share your feelings..."
                              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-base"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Single Save Button */}
                    <div className="border-t pt-5 mt-5">
                      <Button
                        onClick={() => {
                          handleSaveEntry('daily', 'liked', dailyBullets.liked.join('\n'));
                          handleSaveEntry('daily', 'disliked', dailyBullets.disliked.join('\n'));
                          handleSaveEntry('daily', 'reflection', dailyBullets.reflection.join('\n'));
                          handleSaveEntry('daily', 'goals', dailyBullets.goals.join('\n'));
                          handleSaveEntry('daily', 'mood', dailyBullets.mood.join('\n'));
                          setTempEntries({});
                          setDailyBullets({ liked: [''], disliked: [''], reflection: [''], goals: [''], mood: [''] });
                        }}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-base py-3"
                      >
                        <Send className="w-5 h-5 mr-2" />
                        Save All
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            )}
          </Card>

          {/* Weekly Check-In */}
          <Card className={`${theme.colors.card} border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-all duration-300`}>
            <CardHeader
              className="pb-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedJournal(expandedJournal === 'weekly' ? null : 'weekly')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-green-100 to-teal-100">
                    <Calendar className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Weekly Check-In</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Week's Growth</p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-6 h-6 transition-transform ${expandedJournal === 'weekly' ? 'rotate-180' : ''}`}
                />
              </div>
            </CardHeader>

            {expandedJournal === 'weekly' && (
              <CardContent className="space-y-4 border-t pt-5">
                {isPastDate() && !getEntry('weekly').review && !getEntry('weekly').nextGoals ? (
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-gray-600">No weekly entries recorded for this date</p>
                  </div>
                ) : isPastDate() ? (
                  // Read-only view for past dates
                  <>
                    {getEntry('weekly').review && (
                      <div className="space-y-2">
                        <label className="text-base font-semibold text-gray-800 flex items-center">
                          <Calendar className="w-5 h-5 mr-2 text-green-500" />
                          How was your week?
                        </label>
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-base text-gray-800 whitespace-pre-wrap">{getEntry('weekly').review}</p>
                        </div>
                      </div>
                    )}
                    {getEntry('weekly').nextGoals && (
                      <div className="space-y-2">
                        <label className="text-base font-semibold text-gray-800 flex items-center">
                          <Plus className="w-5 h-5 mr-2 text-teal-500" />
                          Next Week Goals
                        </label>
                        <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                          <p className="text-base text-gray-800 whitespace-pre-wrap">{getEntry('weekly').nextGoals}</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // Edit mode for today
                  <>
                    {/* How was your week */}
                    <div className="space-y-3">
                      <label className="text-base font-semibold text-gray-800 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-green-500" />
                        How was your week?
                      </label>
                      <Textarea
                        value={tempEntries.weekly_review || getEntry('weekly').review || ''}
                        onChange={(e) => setTempEntries({ ...tempEntries, weekly_review: e.target.value })}
                        placeholder="Summarize your week. What went well? What was challenging?"
                        className="w-full min-h-[150px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-base"
                      />
                    </div>

                    {/* Next Week Goals */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-base font-semibold text-gray-800 flex items-center">
                          <Plus className="w-5 h-5 mr-2 text-teal-500" />
                          Next Week Goals
                        </label>
                        <button
                          onClick={() => addWeeklyBullet('nextGoals')}
                          className="text-teal-500 hover:text-teal-700 text-xl font-bold hover:scale-125 transition-transform"
                          title="Add item"
                        >
                          +
                        </button>
                      </div>
                      <div className="space-y-2">
                        {weeklyBullets.nextGoals.map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => handleWeeklyBulletChange('nextGoals', index, e.target.value)}
                              placeholder="Write one goal..."
                              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-base"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Single Save Button */}
                    <div className="border-t pt-5">
                      <Button
                        onClick={() => {
                          handleSaveEntry('weekly', 'review', tempEntries.weekly_review);
                          handleSaveEntry('weekly', 'nextGoals', weeklyBullets.nextGoals.join('\n'));
                          setTempEntries({});
                          setWeeklyBullets({ nextGoals: [''] });
                        }}
                        className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-base py-3"
                      >
                        <Send className="w-5 h-5 mr-2" />
                        Save All
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            )}
          </Card>

          {/* Worries & Negative Feelings */}
          <Card className={`${theme.colors.card} border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-all duration-300`}>
            <CardHeader
              className="pb-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedJournal(expandedJournal === 'worry' ? null : 'worry')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100">
                    <Frown className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Worries & Negative Feelings</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Safe Space</p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-6 h-6 transition-transform ${expandedJournal === 'worry' ? 'rotate-180' : ''}`}
                />
              </div>
            </CardHeader>

            {expandedJournal === 'worry' && (
              <CardContent className="space-y-4 border-t pt-5">
                {isPastDate() && !currentEntry.negativeThought && !currentEntry.positiveReframe && !currentEntry.geminiReframe ? (
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-gray-600">No worry entries recorded for this date</p>
                  </div>
                ) : isPastDate() ? (
                  // Read-only view for past dates
                  <>
                    {currentEntry.negativeThought && (
                      <div className="space-y-2">
                        <label className="text-base font-semibold text-gray-800 flex items-center">
                          <Frown className="w-5 h-5 mr-2 text-red-500" />
                          Negative Thought
                        </label>
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <p className="text-base text-gray-800 whitespace-pre-wrap">{currentEntry.negativeThought}</p>
                        </div>
                      </div>
                    )}
                    {currentEntry.positiveReframe && (
                      <div className="space-y-2">
                        <label className="text-base font-semibold text-gray-800 flex items-center">
                          <Heart className="w-5 h-5 mr-2 text-green-500" />
                          Your Positive Reframe
                        </label>
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-base text-gray-800 whitespace-pre-wrap">{currentEntry.positiveReframe}</p>
                        </div>
                      </div>
                    )}
                    {currentEntry.geminiReframe && (
                      <div className="space-y-2">
                        <label className="text-base font-semibold text-gray-800 flex items-center">
                          <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
                          AI's Positive Perspective
                        </label>
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-base text-gray-800 whitespace-pre-wrap">{currentEntry.geminiReframe}</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // Edit mode for today
                  <>
                    {/* Negative Thought Field */}
                    <div className="space-y-3">
                      <label className="text-base font-semibold text-gray-800 flex items-center">
                        <Frown className="w-5 h-5 mr-2 text-red-500" />
                        Negative Thought
                      </label>
                      <Textarea
                        value={tempEntries.worry_negative || currentEntry.negativeThought || ''}
                        onChange={(e) => setTempEntries({ ...tempEntries, worry_negative: e.target.value })}
                        placeholder="Write your worry or negative thought..."
                        className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-base"
                      />
                    </div>

                    {/* Your Positive Reframe Field */}
                    <div className="space-y-3">
                      <label className="text-base font-semibold text-gray-800 flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-green-500" />
                        Your Positive Reframe
                      </label>
                      <Textarea
                        value={tempEntries.worry_reframe || currentEntry.positiveReframe || ''}
                        onChange={(e) => setTempEntries({ ...tempEntries, worry_reframe: e.target.value })}
                        placeholder="Reframe this thought in a positive way..."
                        className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-base"
                      />
                    </div>

                    {/* Get AI Perspective Button */}
                    <div className="space-y-3 border-t pt-5">
                      <Button
                        onClick={() => callGeminiAPI('aiPerspective')}
                        disabled={loadingGemini || !tempEntries.worry_negative?.trim()}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-base py-3"
                      >
                        {loadingGemini ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Getting AI Perspective...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Get AI Perspective
                          </>
                        )}
                      </Button>
                      {tempEntries.worry_ai && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs font-bold text-blue-900 mb-2">✨ AI's Positive Perspective:</p>
                          <p className="text-base text-gray-800">{tempEntries.worry_ai}</p>
                        </div>
                      )}
                    </div>

                    {/* Single Save Button */}
                    <div className="border-t pt-5">
                      <Button
                        onClick={() => {
                          handleSaveEntry('worry', 'negativeThought', tempEntries.worry_negative);
                          handleSaveEntry('worry', 'positiveReframe', tempEntries.worry_reframe);
                          if (tempEntries.worry_ai) {
                            handleSaveEntry('worry', 'geminiReframe', tempEntries.worry_ai);
                          }
                          setTempEntries({});
                        }}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-base py-3"
                      >
                        <Send className="w-5 h-5 mr-2" />
                        Save All
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            )}
          </Card>

        </div>
      </div>
    </div>
  );
};

export default JournalWithTheme;
