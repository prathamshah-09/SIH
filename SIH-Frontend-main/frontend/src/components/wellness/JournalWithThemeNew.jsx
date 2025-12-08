import React, { useState, useMemo, useEffect } from 'react';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { mockJournalEntries } from '@mock/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'; // Still used in sidebar tips section at line 506
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
import { Slider } from '@components/ui/slider';
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
import { toast } from '@hooks/use-toast';
import {
  saveDailyCheckin,
  saveWeeklyCheckin,
  createWorryEntry,
  updateWorryEntry,
  generateAIReframe,
  getJournalByDate
} from '@services/journalingService';

const JournalWithTheme = () => {
  const { theme, currentTheme } = useTheme();
  const isDarkTheme = (currentTheme || '').toLowerCase().includes('midnight');
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
  const [isEditingDaily, setIsEditingDaily] = useState(false);
  const [isEditingWeekly, setIsEditingWeekly] = useState(false);
  const [savingDaily, setSavingDaily] = useState(false);
  const [savingWeekly, setSavingWeekly] = useState(false);
  const [savingWorry, setSavingWorry] = useState(false);
  const [loadingDate, setLoadingDate] = useState(false);
  const [currentWorryId, setCurrentWorryId] = useState(null);

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
      // Streak counts only Daily Check-in and Worries (not Weekly)
      const hasEntry = entries[`${dateKey}_daily`] || entries[`${dateKey}_worry`];
      
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

  // Compute week range (Mon-Sun) for a given date
  const getWeekRange = (dateObj) => {
    const d = new Date(dateObj);
    const day = d.getDay(); // Sun=0, Mon=1, ...
    const diffToMonday = (day + 6) % 7; // 0 for Mon, 6 for Sun
    const start = new Date(d);
    start.setDate(d.getDate() - diffToMonday);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  };

  // Populate the same weekly entry across the entire week range in local state
  const propagateWeeklyToWeek = (dateObj, weeklyDataNormalized) => {
    const { start } = getWeekRange(dateObj);
    setEntries((prev) => {
      const updated = { ...prev };
      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const key = `${formatDateKey(d)}_weekly`;
        updated[key] = { ...weeklyDataNormalized };
      }
      return updated;
    });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const loadEntriesForDate = async (date) => {
    setLoadingDate(true);
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const data = await getJournalByDate(formattedDate);

      const dateKey = formatDateKey(date);

      setEntries((prev) => {
        const newEntries = { ...prev };

        if (data.daily_checkin) {
          newEntries[`${dateKey}_daily`] = {
            type: 'daily',
            liked: data.daily_checkin.positive_moments?.join('\n') || '',
            disliked: data.daily_checkin.challenges_faced?.join('\n') || '',
            reflection: data.daily_checkin.todays_reflection || '',
            goals: data.daily_checkin.intentions_tomorrow?.join('\n') || '',
            mood: data.daily_checkin.feelings_space || '',
            timestamp: data.daily_checkin.created_at
          };
        }

        if (data.weekly_checkin) {
          const normalizedWeekly = {
            type: 'weekly',
            review: data.weekly_checkin.week_reflection || '',
            nextGoals: data.weekly_checkin.next_week_intentions?.join('\n') || '',
            selfCareScore: data.weekly_checkin.self_care_score || 0,
            selfCareReflection: data.weekly_checkin.self_care_reflection || '',
            timestamp: data.weekly_checkin.created_at
          };
          newEntries[`${dateKey}_weekly`] = normalizedWeekly;
          // Propagate to the entire week so dots and preview reflect consistently
          propagateWeeklyToWeek(date, normalizedWeekly);
        }

        if (data.worries && data.worries.length > 0) {
          const latestWorry = data.worries[0];
          newEntries[`${dateKey}_worry`] = {
            type: 'worry',
            negativeThought: latestWorry.whats_on_mind || '',
            positiveReframe: latestWorry.positive_reframe || '',
            geminiReframe: latestWorry.positive_reframe && latestWorry.is_ai_generated ? latestWorry.positive_reframe : '',
            timestamp: latestWorry.created_at
          };
          setCurrentWorryId(latestWorry.id);
        }

        return newEntries;
      });
    } catch (error) {
      console.error('Error loading journal entries:', error);
      if (error.response?.status !== 404) {
        toast({ title: 'Error', description: 'Failed to load journal entries. Please try again.', variant: 'destructive' });
      }
    } finally {
      setLoadingDate(false);
    }
  };

  const handleDateClick = async (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
    await loadEntriesForDate(newDate);
    setShowMobileCalendar(false);
  };

  useEffect(() => {
    // Load entries for the current date when entering journaling
    loadEntriesForDate(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      // Only show a dot for Daily or Worry entries (not Weekly)
      const hasEntry = Boolean(
        entries[`${dateKey}_daily`] ||
        entries[`${dateKey}_worry`]
      );
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const isTodayDate = isToday(date);
      const isFuture = isFutureDate(date);

      calendarDays.push(
        <div
          key={day}
          className={`
            text-center p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-300 relative text-sm
            ${isSelected
            ? 'bg-purple-600 text-white font-bold shadow-lg'
            : isTodayDate
              ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 font-semibold hover:shadow-md'
              : isFuture
                ? `${isDarkTheme ? 'text-white' : 'text-slate-700'} hover:shadow-md`
                : 'text-slate-400 hover:shadow-md'
            }
            ${hasEntry && !isSelected ? 'border-2 border-purple-300' : ''}
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

  // Call Backend AI Reframe API
  const callBackendAIReframe = async () => {
    setLoadingGemini(true);
    try {
      const negativeThought = tempEntries.worry_negative?.trim();
      
      if (!negativeThought) {
        toast({ title: 'Add a thought', description: 'Please write a negative thought first' });
        setLoadingGemini(false);
        return;
      }

      // Generate AI reframe with optional save
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const options = {
        date: formattedDate,
        save: true,  // Save the worry with AI reframe
        id: currentWorryId || undefined  // Update existing if we have ID
      };
      
      const aiResponse = await generateAIReframe(negativeThought, options);
      
      // If saved, store the worry ID for future updates
      if (aiResponse.id) {
        setCurrentWorryId(aiResponse.id);
      }
      
      // Display the AI-generated reframe
      setTempEntries({ 
        ...tempEntries, 
        worry_ai: aiResponse.positive_reframe,
        worry_negative: negativeThought  // Keep the negative thought
      });
    } catch (error) {
      console.error('Error in callBackendAIReframe:', error);
      toast({ title: 'AI Error', description: (error.response?.data?.message || 'Failed to generate AI perspective. Please try again.'), variant: 'destructive' });
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
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 px-3 md:px-4 py-2 rounded-lg">
            <span className="text-xl md:text-2xl">🔥</span>
            <p className="text-base md:text-lg font-bold text-blue-600">{calculateStreak}</p>
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
                className={`border text-sm px-3 ${isDarkTheme ? 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700' : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'}`}
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
                className={`border text-sm px-3 ${isDarkTheme ? 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700' : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'}`}
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
                className={`hover:scale-105 transition-transform border text-sm px-3 ${isDarkTheme ? 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700' : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'}`}
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
                className={`hover:scale-105 transition-transform border text-sm px-3 ${isDarkTheme ? 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700' : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'}`}
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
                <strong>No entries found</strong> for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}. Start journaling today!
              </p>
            </div>
          )}
          
          {/* Daily Check-In */}
          <div className={`${currentTheme === 'midnight' ? 'bg-slate-800' : 'bg-blue-50'} border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl`}>
            <div
              className={`pb-4 cursor-pointer ${currentTheme === 'midnight' ? 'hover:bg-slate-700' : 'hover:bg-gray-50'} transition-colors p-6 flex flex-col space-y-1.5`}
              onClick={() => setExpandedJournal(expandedJournal === 'daily' ? null : 'daily')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-100 to-orange-100">
                    <Sun className="w-6 h-6 text-gray-700" />
                  </div> */}
                  <div>
                    <h3 className={`text-lg font-bold ${currentTheme === 'midnight' ? 'text-white' : ''}`}>Daily Check-In</h3>
                    <p className={`text-sm ${currentTheme === 'midnight' ? 'text-slate-300' : 'text-gray-600'} mt-1`}>{isPastDate() ? 'Past Entry' : 'Today\'s Reflection'}</p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-6 h-6 transition-transform ${currentTheme === 'midnight' ? 'text-white' : ''} ${expandedJournal === 'daily' ? 'rotate-180' : ''}`}
                />
              </div>
            </div>

            {expandedJournal === 'daily' && (
              <div className="space-y-4 border-t pt-5 p-6">
                {isPastDate() && !getEntry('daily').liked && !getEntry('daily').disliked && !getEntry('daily').reflection && !getEntry('daily').goals && !getEntry('daily').mood ? (
                  <div className={`p-4 ${currentTheme === 'midnight' ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg text-center`}>
                    <p className={currentTheme === 'midnight' ? 'text-slate-300' : 'text-gray-600'}>No daily entries recorded for this date</p>
                  </div>
                ) : isPastDate() ? (
                  // Read-only view for past dates
                  <>
                    {getEntry('daily').liked && (
                      <div className="space-y-2">
                        <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                          <Heart className={`w-5 h-5 mr-2 text-pink-500 ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-pink-500'}`} />
                          Positive Moments of Today
                        </label>
                        <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                          <p className={`text-base ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} whitespace-pre-wrap`}>{getEntry('daily').liked}</p>
                        </div>
                      </div>
                    )}
                    {getEntry('daily').disliked && (
                      <div className="space-y-2">
                        <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                          <Frown className="w-5 h-5 mr-2 text-orange-500" />
                          Challenges I Faced Today
                        </label>
                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <p className={`text-base ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} whitespace-pre-wrap`}>{getEntry('daily').disliked}</p>
                        </div>
                      </div>
                    )}
                    {getEntry('daily').reflection && (
                      <div className="space-y-2">
                        <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                          <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                          Reflection
                        </label>
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <p className={`text-base ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} whitespace-pre-wrap`}>{getEntry('daily').reflection}</p>
                        </div>
                      </div>
                    )}
                    {getEntry('daily').goals && (
                      <div className="space-y-2">
                        <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                          <Plus className="w-5 h-5 mr-2 text-blue-500" />
                          Intentions for Tomorrow
                        </label>
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className={`text-base ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} whitespace-pre-wrap`}>{getEntry('daily').goals}</p>
                        </div>
                      </div>
                    )}
                    {getEntry('daily').mood && (
                      <div className="space-y-2">
                        <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                          <Frown className="w-5 h-5 mr-2 text-red-500" />
                          Feelings Space
                        </label>
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <p className={`text-base ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} whitespace-pre-wrap`}>{getEntry('daily').mood}</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : !isEditingDaily && (getEntry('daily').liked || getEntry('daily').disliked || getEntry('daily').reflection || getEntry('daily').goals || getEntry('daily').mood) ? (
                  // View mode for today with saved entries and Edit button - show ALL fields
                  <>
                    <div className={`space-y-2 ${currentTheme === 'midnight' ? 'bg-slate-700' : ''}`}>
                      <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                        <Heart className="w-5 h-5 mr-2 text-pink-500" />
                        Positive Moments of Today
                      </label>
                      <div className="p-3 bg-pink-50 rounded-lg border border-pink-200 min-h-[60px]">
                        <p className={`text-base ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} whitespace-pre-wrap`}>{getEntry('daily').liked || '(empty)'}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                        <Frown className="w-5 h-5 mr-2 text-orange-500" />
                        Challenges I Faced Today
                      </label>
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 min-h-[60px]">
                        <p className={`text-base ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} whitespace-pre-wrap`}>{getEntry('daily').disliked || '(empty)'}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                        <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                        Today's Reflection
                      </label>
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 min-h-[60px]">
                        <p className={`text-base ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} whitespace-pre-wrap`}>{getEntry('daily').reflection || '(empty)'}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                        <Plus className="w-5 h-5 mr-2 text-blue-500" />
                        Intentions for Tomorrow
                      </label>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 min-h-[60px]">
                        <p className={`text-base ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} whitespace-pre-wrap`}>{getEntry('daily').goals || '(empty)'}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                        <Frown className="w-5 h-5 mr-2 text-red-500" />
                        Feelings Space
                      </label>
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200 min-h-[60px]">
                        <p className={`text-base ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} whitespace-pre-wrap`}>{getEntry('daily').mood || '(empty)'}</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        setIsEditingDaily(true);
                        // Load saved data into edit fields
                        const entry = getEntry('daily');
                        setDailyBullets({
                          liked: entry.liked ? entry.liked.split('\n').filter(x => x) : [''],
                          disliked: entry.disliked ? entry.disliked.split('\n').filter(x => x) : [''],
                          reflection: [''],
                          goals: entry.goals ? entry.goals.split('\n').filter(x => x) : [''],
                          mood: ['']
                        });
                        setTempEntries({
                          daily_reflection: entry.reflection || '',
                          daily_mood: entry.mood || ''
                        });
                      }}
                      variant="animated"
                      className="w-full text-base py-3"
                    >
                      Edit
                    </Button>
                  </>
                ) : (
                  // Edit mode for today
                  <>
                    {/* Positive Moments of Today */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                          {/* <Heart className="w-5 h-5 mr-2 text-pink-500" /> */}
                          Positive Moments of Today
                        </label>
                        <button
                          onClick={() => addDailyBullet('liked')}
                          className="text-blue-500 hover:text-blue-700 text-xl font-bold hover:scale-125 transition-transform"
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
                              className={`flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-base ${currentTheme === 'midnight' ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Challenges I Faced Today */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                          {/* <Frown className="w-5 h-5 mr-2 text-orange-500" /> */}
                          Challenges I Faced Today
                        </label>
                        <button
                          onClick={() => addDailyBullet('disliked')}
                          className="text-blue-500 hover:text-blue-700 text-xl font-bold hover:scale-125 transition-transform"
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
                              className={`flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-base ${currentTheme === 'midnight' ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Today's Reflection */}
                    <div className="space-y-3">
                      <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                        {/* <Sparkles className="w-5 h-5 mr-2 text-purple-500" /> */}
                        Today's Reflection
                      </label>
                      <Textarea
                        value={tempEntries.daily_reflection || dailyBullets.reflection.join('\n') || ''}
                        onChange={(e) => setTempEntries({ ...tempEntries, daily_reflection: e.target.value })}
                        placeholder="Write your reflections about today..."
                        className={`w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base ${currentTheme === 'midnight' ? 'text-white bg-slate-700' : 'text-gray-900'}`}
                      />
                    </div>

                    {/* Intentions for Tomorrow */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                          {/* <Plus className="w-5 h-5 mr-2 text-blue-500" /> */}
                          Intentions for Tomorrow
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
                              className={`flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-base ${currentTheme === 'midnight' ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-gray-900 border-gray-300'}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Feelings Space */}
                    <div className="space-y-3">
                      <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                        {/* <Frown className="w-5 h-5 mr-2 text-red-500" /> */}
                        Feelings Space
                      </label>
                      <Textarea
                        value={tempEntries.daily_mood || dailyBullets.mood.join('\n') || ''}
                        onChange={(e) => setTempEntries({ ...tempEntries, daily_mood: e.target.value })}
                        placeholder="Share your feelings and emotions..."
                        className={`w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base ${currentTheme === 'midnight' ? 'text-white bg-slate-700' : 'text-gray-900'}`}
                      />
                    </div>

                    {/* Single Save Button */}
                    <div className="border-t pt-5 mt-5">
                      <Button
                        onClick={async () => {
                          setSavingDaily(true);
                          try {
                            const formattedDate = selectedDate.toISOString().split('T')[0];
                            
                            // Map frontend fields to backend format
                            const dailyData = {
                              positive_moments: dailyBullets.liked.filter(item => item.trim()),
                              challenges_faced: dailyBullets.disliked.filter(item => item.trim()),
                              todays_reflection: tempEntries.daily_reflection || dailyBullets.reflection.filter(item => item.trim()).join('\n') || '',
                              intentions_tomorrow: dailyBullets.goals.filter(item => item.trim()),
                              feelings_space: tempEntries.daily_mood || dailyBullets.mood.filter(item => item.trim()).join('\n') || ''
                            };
                            
                            const result = await saveDailyCheckin(formattedDate, dailyData);
                            
                            // Update local state with saved data
                            handleSaveEntry('daily', 'liked', dailyBullets.liked.join('\n'));
                            handleSaveEntry('daily', 'disliked', dailyBullets.disliked.join('\n'));
                            handleSaveEntry('daily', 'reflection', dailyData.todays_reflection);
                            handleSaveEntry('daily', 'goals', dailyBullets.goals.join('\n'));
                            handleSaveEntry('daily', 'mood', dailyData.feelings_space);
                            
                            setTempEntries({});
                            setDailyBullets({ liked: [''], disliked: [''], reflection: [''], goals: [''], mood: [''] });
                            setIsEditingDaily(false);
                            
                            toast({ title: 'Saved', description: 'Daily check-in saved' });
                          } catch (error) {
                            console.error('Error saving daily check-in:', error);
                            toast({ title: 'Save failed', description: (error.response?.data?.message || 'Failed to save daily check-in. Please try again.'), variant: 'destructive' });
                          } finally {
                            setSavingDaily(false);
                          }
                        }}
                        disabled={savingDaily}
                        variant="animated"
                        className="w-full text-base py-3"
                      >
                        {savingDaily ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Save
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Weekly Check-In */}
          <div className={`${currentTheme === 'midnight' ? 'bg-slate-800' : 'bg-blue-50'} border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl`}>
            <div
              className={`pb-4 cursor-pointer p-6 flex flex-col space-y-1.5 ${currentTheme === 'midnight' ? 'hover:bg-slate-700' : 'hover:bg-gray-50'} transition-colors`}
              onClick={() => setExpandedJournal(expandedJournal === 'weekly' ? null : 'weekly')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* <div className="p-3 rounded-lg bg-gradient-to-br from-green-100 to-teal-100">
                    <Calendar className="w-6 h-6 text-gray-700" />
                  </div> */}
                  <div>
                    <h3 className={`text-lg font-bold ${currentTheme === 'midnight' ? 'text-white' : ''}`}>Weekly Check-In</h3>
                    <p className={`text-sm ${currentTheme === 'midnight' ? 'text-slate-300' : 'text-gray-600'} mt-1`}>Week's Growth</p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-6 h-6 transition-transform ${currentTheme === 'midnight' ? 'text-white' : ''} ${expandedJournal === 'weekly' ? 'rotate-180' : ''}`}
                />
              </div>
            </div>

            {expandedJournal === 'weekly' && (
              <div className="space-y-4 border-t pt-5 p-6">
                {isPastDate() && !getEntry('weekly').review && !getEntry('weekly').nextGoals && !getEntry('weekly').selfCareScore && !getEntry('weekly').selfCareReflection ? (
                  <div className={`p-4 ${currentTheme === 'midnight' ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg text-center`}>
                    <p className={currentTheme === 'midnight' ? 'text-slate-300' : 'text-gray-600'}>No weekly entries recorded for this date</p>
                  </div>
                ) : isPastDate() ? (
                  // Read-only view for past dates
                  <>
                    {getEntry('weekly').review && (
                      <div className="space-y-2">
                        <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                          How was your week?
                        </label>
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className={`text-base ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} whitespace-pre-wrap`}>{getEntry('weekly').review}</p>
                        </div>
                      </div>
                    )}
                    {getEntry('weekly').nextGoals && (
                      <div className="space-y-2">
                        <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                          Next Week Goals
                        </label>
                        <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                          <p className={`text-base ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} whitespace-pre-wrap`}>{getEntry('weekly').nextGoals}</p>
                        </div>
                      </div>
                    )}
                    {getEntry('weekly').selfCareScore !== undefined && (
                      <div className="space-y-2">
                        <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                          Self-Care Score
                        </label>
                        <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                          <p className={`text-lg font-bold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'}`}>{getEntry('weekly').selfCareScore}/10</p>
                        </div>
                      </div>
                    )}
                    {getEntry('weekly').selfCareReflection && (
                      <div className="space-y-2">
                        <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                          Self-Care Reflection
                        </label>
                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className={`text-base ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} whitespace-pre-wrap`}>{getEntry('weekly').selfCareReflection}</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : !isEditingWeekly && (getEntry('weekly').review || getEntry('weekly').nextGoals || getEntry('weekly').selfCareScore !== undefined || getEntry('weekly').selfCareReflection) ? (
                  // View mode for today with saved entries and Edit button - show ALL fields
                  <>
                    <div className="space-y-2">
                      <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                        {/* <Calendar className="w-5 h-5 mr-2 text-green-500" /> */}
                        How was your week?
                      </label>
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200 min-h-[80px]">
                        <p className={`text-base ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} whitespace-pre-wrap`}>{getEntry('weekly').review || '(empty)'}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                        {/* <Plus className="w-5 h-5 mr-2 text-teal-500" /> */}
                        Next Week Goals
                      </label>
                      <div className="p-3 bg-teal-50 rounded-lg border border-teal-200 min-h-[80px]">
                        <p className={`text-base ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} whitespace-pre-wrap`}>{getEntry('weekly').nextGoals || '(empty)'}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                        {/* <Heart className="w-5 h-5 mr-2 text-pink-500" /> */}
                        Self-Care Score
                      </label>
                      <div className="p-3 bg-pink-50 rounded-lg border border-pink-200 min-h-[60px] flex items-center">
                        <p className={`text-lg font-bold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'}`}>{getEntry('weekly').selfCareScore !== undefined ? getEntry('weekly').selfCareScore + '/10' : '(empty)'}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                        {/* <Sparkles className="w-5 h-5 mr-2 text-yellow-500" /> */}
                        Self-Care Reflection
                      </label>
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 min-h-[80px]">
                        <p className={`text-base ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} whitespace-pre-wrap`}>{getEntry('weekly').selfCareReflection || '(empty)'}</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        setIsEditingWeekly(true);
                        // Load saved data into edit fields
                        const entry = getEntry('weekly');
                        setWeeklyBullets({
                          nextGoals: entry.nextGoals ? entry.nextGoals.split('\n').filter(x => x) : ['']
                        });
                        setTempEntries({
                          weekly_review: entry.review || '',
                          weekly_selfCareScore: entry.selfCareScore !== undefined ? entry.selfCareScore : 0,
                          weekly_selfCareReflection: entry.selfCareReflection || ''
                        });
                      }}
                      variant="animated"
                      className="w-full text-base py-3 mt-4"
                    >
                      Edit
                    </Button>
                  </>
                ) : (
                  // Edit mode for today
                  <>
                    {/* How was your week */}
                    <div className="space-y-3">
                      <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                        How was your week?
                      </label>
                      <Textarea
                        value={tempEntries.weekly_review || getEntry('weekly').review || ''}
                        onChange={(e) => setTempEntries({ ...tempEntries, weekly_review: e.target.value })}
                        placeholder="Summarize your week. What went well? What was challenging?"
                        className={`w-full min-h-[150px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base ${currentTheme === 'midnight' ? 'text-white bg-slate-700' : 'bg-blue-50 text-gray-900'}`}
                      />
                    </div>

                    {/* Next Week Goals */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                          Next Week Goals
                        </label>
                        <button
                          onClick={() => addWeeklyBullet('nextGoals')}
                          className="text-blue-500 hover:text-blue-700 text-xl font-bold hover:scale-125 transition-transform"
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
                              className={`flex-1 p-2 border ${currentTheme === 'midnight' ? 'bg-slate-700 text-white border-slate-600 focus:ring-slate-400' : 'bg-white text-base border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Self-Care Score */}
                    <div className="space-y-3">
                      <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                        Self-Care Score: {tempEntries.weekly_selfCareScore !== undefined ? tempEntries.weekly_selfCareScore : (getEntry('weekly').selfCareScore || 0)}/10
                      </label>
                      <Slider
                        value={[tempEntries.weekly_selfCareScore !== undefined ? tempEntries.weekly_selfCareScore : (getEntry('weekly').selfCareScore || 0)]}
                        onValueChange={(value) => setTempEntries({ ...tempEntries, weekly_selfCareScore: value[0] })}
                        min={0}
                        max={10}
                        step={1}
                        className={`w-full ${currentTheme === 'midnight' ? '[&_[role=slider]]:bg-white [&_[role=slider]]:border-white' : ''}`}
                      />
                      <div className={`text-sm ${currentTheme === 'midnight' ? 'text-slate-300' : 'text-gray-600'} text-center`}>
                        Rate how well you took care of yourself this week
                      </div>
                    </div>

                    {/* Self-Care Reflection */}
                    <div className="space-y-3">
                      <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                        Self-Care Reflection
                      </label>
                      <Textarea
                        value={tempEntries.weekly_selfCareReflection || getEntry('weekly').selfCareReflection || ''}
                        onChange={(e) => setTempEntries({ ...tempEntries, weekly_selfCareReflection: e.target.value })}
                        placeholder="What self-care activities did you do? How did they make you feel?"
                        className={`w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base ${currentTheme === 'midnight' ? 'text-white bg-slate-700' : 'bg-blue-50 text-gray-900'}`}
                      />
                    </div>

                    {/* Single Save Button */}
                    <div className="border-t pt-5">
                      <Button
                        onClick={async () => {
                          setSavingWeekly(true);
                          try {
                            const formattedDate = selectedDate.toISOString().split('T')[0];
                            
                            // Map frontend fields to backend format
                            const weeklyData = {
                              week_reflection: tempEntries.weekly_review || '',
                              next_week_intentions: weeklyBullets.nextGoals.filter(item => item.trim()),
                              self_care_score: tempEntries.weekly_selfCareScore !== undefined ? tempEntries.weekly_selfCareScore : 0,
                              self_care_reflection: tempEntries.weekly_selfCareReflection || ''
                            };
                            
                            const result = await saveWeeklyCheckin(formattedDate, weeklyData);
                            
                            // Update local state with saved data
                            handleSaveEntry('weekly', 'review', weeklyData.week_reflection);
                            handleSaveEntry('weekly', 'nextGoals', weeklyBullets.nextGoals.join('\n'));
                            handleSaveEntry('weekly', 'selfCareScore', weeklyData.self_care_score);
                            handleSaveEntry('weekly', 'selfCareReflection', weeklyData.self_care_reflection);

                            // Also reflect the weekly entry across the entire week locally for a consistent UX
                            const normalizedWeekly = {
                              type: 'weekly',
                              review: weeklyData.week_reflection || '',
                              nextGoals: (weeklyData.next_week_intentions || []).join('\n'),
                              selfCareScore: weeklyData.self_care_score || 0,
                              selfCareReflection: weeklyData.self_care_reflection || '',
                              timestamp: new Date().toISOString(),
                            };
                            propagateWeeklyToWeek(selectedDate, normalizedWeekly);
                            
                            setTempEntries({});
                            setWeeklyBullets({ nextGoals: [''] });
                            setIsEditingWeekly(false);
                            
                            toast({ title: 'Saved', description: 'Weekly check-in saved' });
                          } catch (error) {
                            console.error('Error saving weekly check-in:', error);
                            toast({ title: 'Save failed', description: (error.response?.data?.message || 'Failed to save weekly check-in. Please try again.'), variant: 'destructive' });
                          } finally {
                            setSavingWeekly(false);
                          }
                        }}
                        disabled={savingWeekly}
                        variant="animated"
                        className="w-full text-base py-3"
                      >
                        {savingWeekly ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Save
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Worries & Negative Feelings */}
          <div className={`${currentTheme === 'midnight' ? 'bg-slate-800' : 'bg-blue-50'} border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl`}>
            <div
              className={`pb-4 cursor-pointer p-6 flex flex-col space-y-1.5 ${currentTheme === 'midnight' ? 'hover:bg-slate-700' : 'hover:bg-gray-50'} transition-colors`}
              onClick={() => setExpandedJournal(expandedJournal === 'worry' ? null : 'worry')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* <div className="p-3 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100">
                    <Frown className="w-6 h-6 text-gray-700" />
                  </div> */}
                  <div>
                    <h3 className={`text-lg font-bold ${currentTheme === 'midnight' ? 'text-white' : ''}`}>Worries & Negative Feelings</h3>
                    <p className={`text-sm ${currentTheme === 'midnight' ? 'text-slate-300' : 'text-gray-600'} mt-1`}>Safe Space</p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-6 h-6 transition-transform ${currentTheme === 'midnight' ? 'text-white' : ''} ${expandedJournal === 'worry' ? 'rotate-180' : ''}`}
                />
              </div>
            </div>

            {expandedJournal === 'worry' && (
              <div className="space-y-4 border-t pt-5 p-6">
                {isPastDate() && !getEntry('worry').negativeThought && !getEntry('worry').positiveReframe && !getEntry('worry').geminiReframe ? (
                  <div className={`p-4 ${currentTheme === 'midnight' ? 'bg-slate-700' : 'bg-gray-50'} rounded-lg text-center`}>
                    <p className={currentTheme === 'midnight' ? 'text-slate-300' : 'text-gray-600'}>No worry entries recorded for this date</p>
                  </div>
                ) : isPastDate() ? (
                  // Read-only view for past dates
                  <>
                    {getEntry('worry').negativeThought && (
                      <div className="space-y-2">
                        <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                          {/* <Frown className="w-5 h-5 mr-2 text-red-500" /> */}
                          Negative Thought
                        </label>
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <p className={`text-base ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} whitespace-pre-wrap`}>{getEntry('worry').negativeThought}</p>
                        </div>
                      </div>
                    )}
                    {getEntry('worry').positiveReframe && (
                      <div className="space-y-2">
                        <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                          {/* <Heart className="w-5 h-5 mr-2 text-green-500" /> */}
                          Your Positive Reframe
                        </label>
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className={`text-base ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} whitespace-pre-wrap`}>{getEntry('worry').positiveReframe}</p>
                        </div>
                      </div>
                    )}
                    {getEntry('worry').geminiReframe && (
                      <div className="space-y-2">
                        <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                          {/* <Sparkles className="w-5 h-5 mr-2 text-blue-500" /> */}
                          AI's Positive Perspective
                        </label>
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className={`text-base ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} whitespace-pre-wrap`}>{getEntry('worry').geminiReframe}</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // Edit mode for today
                  <>
                    {/* Negative Thought Field */}
                    <div className="space-y-3">
                      <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                        {/* <Frown className="w-5 h-5 mr-2 text-red-500" /> */}
                        Negative Thought
                      </label>
                      <Textarea
                        value={tempEntries.worry_negative || getEntry('worry').negativeThought || ''}
                        onChange={(e) => setTempEntries({ ...tempEntries, worry_negative: e.target.value })}
                        placeholder="Write your worry or negative thought..."
                        className={`w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-base ${currentTheme === 'midnight' ? 'text-white bg-slate-700' : 'text-gray-900'}`}
                      />
                    </div>

                    {/* Your Positive Reframe Field */}
                    <div className="space-y-3">
                      <label className={`text-base font-semibold ${currentTheme === 'midnight' ? 'text-slate-100' : 'text-gray-800'} flex items-center`}>
                        {/* <Heart className="w-5 h-5 mr-2 text-green-500" /> */}
                        Your Positive Reframe
                      </label>
                      <Textarea
                        value={tempEntries.worry_reframe || getEntry('worry').positiveReframe || ''}
                        onChange={(e) => setTempEntries({ ...tempEntries, worry_reframe: e.target.value })}
                        placeholder="Reframe this thought in a positive way..."
                        className={`w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-base ${currentTheme === 'midnight' ? 'text-white bg-slate-700' : 'text-gray-900'}`}
                      />
                    </div>

                    {/* Get AI Perspective Button */}
                    <div className="space-y-3 border-t pt-5">
                      <Button
                        onClick={callBackendAIReframe}
                        disabled={loadingGemini || !tempEntries.worry_negative?.trim()}
                        variant="animated"
                        className="w-full text-base py-3"
                      >
                        {loadingGemini ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Getting AI Perspective...
                          </>
                        ) : (
                          <>
                            {/* <Sparkles className="w-5 h-5 mr-2" /> */}
                            Get AI Perspective
                          </>
                        )}
                      </Button>
                      {tempEntries.worry_ai && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs font-bold text-blue-900 mb-2">AI's Positive Perspective:</p>
                          <p className="text-base text-gray-800">{tempEntries.worry_ai}</p>
                        </div>
                      )}
                    </div>

                    {/* Single Save Button */}
                    <div className="border-t pt-5">
                      <Button
                        onClick={async () => {
                          setSavingWorry(true);
                          try {
                            const formattedDate = selectedDate.toISOString().split('T')[0];
                            
                            // Map frontend fields to backend format
                            const worryData = {
                              whats_on_mind: tempEntries.worry_negative || '',
                              positive_reframe: tempEntries.worry_reframe || tempEntries.worry_ai || ''
                            };
                            
                            // Validate required field
                            if (!worryData.whats_on_mind.trim()) {
                              toast({ title: 'Add a thought', description: 'Please write a negative thought before saving' });
                              setSavingWorry(false);
                              return;
                            }
                            
                            // If we already have a worry ID (from AI reframe or previous save), update it
                            let result;
                            if (currentWorryId) {
                              result = await updateWorryEntry(currentWorryId, worryData);
                            } else {
                              result = await createWorryEntry(formattedDate, worryData);
                              setCurrentWorryId(result.id);
                            }
                            
                            // Update local state with saved data
                            handleSaveEntry('worry', 'negativeThought', worryData.whats_on_mind);
                            handleSaveEntry('worry', 'positiveReframe', worryData.positive_reframe);
                            if (tempEntries.worry_ai) {
                              handleSaveEntry('worry', 'geminiReframe', tempEntries.worry_ai);
                            }
                            
                            setTempEntries({});
                            
                            toast({ title: 'Saved', description: 'Worry entry saved' });
                          } catch (error) {
                            console.error('Error saving worry entry:', error);
                            toast({ title: 'Save failed', description: (error.response?.data?.message || 'Failed to save worry entry. Please try again.'), variant: 'destructive' });
                          } finally {
                            setSavingWorry(false);
                          }
                        }}
                        disabled={savingWorry}
                        variant="animated"
                        className="w-full text-base py-3"
                      >
                        {savingWorry ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Save
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default JournalWithTheme;
