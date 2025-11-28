import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { CheckCircle2 } from "lucide-react";
import { 
  BookOpen,
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Save,
  Plus,
  Heart,
  Activity,
  TrendingUp,
  Lightbulb,
  Star,
  Smile,
  Frown,
  Meh,
  CheckCircle,
  Target,
  RotateCcw,
  Sparkles
} from 'lucide-react';

const AdvancedJournalingView = ({ onBack }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  // Main journal state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [journalEntries, setJournalEntries] = useState({});
  const [dailyCheckins, setDailyCheckins] = useState({});
  const [weeklyCheckins, setWeeklyCheckins] = useState({});
  const [negativeToPositive, setNegativeToPositive] = useState({});
  const [currentEntry, setCurrentEntry] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('today');
  const [todayInnerTab, setTodayInnerTab] = useState('daily-checkin');
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [journalStreak, setJournalStreak] = useState(0);

  // Daily Check-in state
  const [dailyMood, setDailyMood] = useState('');
  const [dailyReflection, setDailyReflection] = useState('');
  const [gratitude, setGratitude] = useState(['', '', '']);

  // Weekly Check-in state
  const [weeklyGrowth, setWeeklyGrowth] = useState('');
  const [weeklyGoals, setWeeklyGoals] = useState(['', '', '']);
  const [weeklyAchievements, setWeeklyAchievements] = useState(['', '', '']);

  // Negative to Positive state
  const [negativeThought, setNegativeThought] = useState('');
  const [positiveReframe, setPositiveReframe] = useState('');

  const moodEmojis = {
    'happy': { emoji: '😊', label: 'Happy', color: 'text-yellow-500' },
    'calm': { emoji: '😌', label: 'Calm', color: 'text-blue-500' },
    'sad': { emoji: '😢', label: 'Sad', color: 'text-blue-600' },
    'stressed': { emoji: '😰', label: 'Stressed', color: 'text-orange-600' },
    'anxious': { emoji: '😟', label: 'Anxious', color: 'text-red-500' },
    'overwhelmed': { emoji: '😵', label: 'Overwhelmed', color: 'text-purple-600' },
    'exhausted': { emoji: '😴', label: 'Exhausted', color: 'text-gray-600' }
  };

  // Removed localStorage persistence; all journaling data is ephemeral.
  // TODO: Integrate with backend journaling API for permanent storage and analytics.
  useEffect(() => {
    calculateStreak();
  }, []);

  const calculateStreak = () => {
    const today = new Date();
    let streak = 0;
    let checkDate = new Date(today);
    let maxDays = 365; // Prevent infinite loop
    
    while (maxDays > 0) {
      const dateKey = formatDateKey(checkDate);
      if (journalEntries[dateKey] || dailyCheckins[dateKey]) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
        maxDays--;
      } else {
        break;
      }
    }
    
    setJournalStreak(streak);
  };

  useEffect(() => {
    calculateStreak();
  }, [journalEntries, dailyCheckins]);

  // Load current data when selected date changes
  useEffect(() => {
    const dateKey = formatDateKey(selectedDate);

    const dailyData = dailyCheckins[dateKey];
    if (dailyData) {
      setDailyMood(dailyData.mood || ''); // This will load existing mood if any
      setDailyReflection(dailyData.reflection || '');
      setGratitude(dailyData.gratitude || ['', '', '']);
    } else {
      setDailyMood(''); // only reset if no data exists
      setDailyReflection('');
      setGratitude(['', '', '']);
    }

    const negativeData = negativeToPositive[dateKey];
    if (negativeData) {
      setNegativeThought(negativeData.negative || '');
      setPositiveReframe(negativeData.positive || '');
    } else {
      setNegativeThought('');
      setPositiveReframe('');
    }

    setIsEditing(false);
  }, [selectedDate, dailyCheckins, negativeToPositive]);

  const formatDateKey = (date) => date.toISOString().split('T')[0];

  const firstDayOfMonth = useMemo(() => 
    new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1), 
    [currentMonth]
  );

  const daysInMonth = useMemo(() => 
    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate(), 
    [currentMonth]
  );

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (date) => {
    if (!date || !(date instanceof Date)) return;
    setSelectedDate(date);
    // close mobile calendar modal when a date is selected
    setShowCalendarModal(false);
  };

  const saveJournalEntry = () => {
    const dateKey = formatDateKey(selectedDate);
    const newEntries = { ...journalEntries };
    
    if (currentEntry.trim()) {
      newEntries[dateKey] = currentEntry.trim();
    } else {
      delete newEntries[dateKey];
    }
    
    setJournalEntries(newEntries);
    setIsEditing(false);
  };

  const saveDailyCheckin = () => {
    const dateKey = formatDateKey(selectedDate);
    const newCheckins = { ...dailyCheckins };
    
    newCheckins[dateKey] = {
      mood: dailyMood,
      reflection: dailyReflection,
      gratitude: gratitude.filter(item => item.trim() !== ''),
      timestamp: new Date().toISOString()
    };
    
    setDailyCheckins(newCheckins);
  };

  const saveWeeklyCheckin = () => {};

  const saveNegativeToPositive = () => {
    const dateKey = formatDateKey(selectedDate);
    const newData = { ...negativeToPositive };
    
    if (negativeThought.trim() || positiveReframe.trim()) {
      newData[dateKey] = {
        negative: negativeThought.trim(),
        positive: positiveReframe.trim(),
        timestamp: new Date().toISOString()
      };
    } else {
      delete newData[dateKey];
    }
    
    setNegativeToPositive(newData);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isFutureDate = (date) => {
    const today = new Date();
    return date > today;
  };

  const canEditDate = (date) => {
    return isToday(date);
  };

  const renderCalendar = () => {
    const calendarDays = [];
    const startDay = firstDayOfMonth.getDay();

    // Empty cells
    for (let i = 0; i < startDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateKey = formatDateKey(date);
      const hasJournalEntry = journalEntries[dateKey];
      const hasDailyCheckin = dailyCheckins[dateKey];
      const hasNegativePositive = negativeToPositive[dateKey];
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const isTodayDate = isToday(date);
      const isFuture = isFutureDate(date);
      const hasAnyEntry = hasJournalEntry || hasDailyCheckin || hasNegativePositive;

      calendarDays.push(
        <div
          key={day}
          className="flex flex-col items-center justify-start relative cursor-pointer transition-all duration-300 aspect-square"
          onClick={() => !isFuture && handleDateClick(date)}
        >
          {/* Number circle */}
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all
              ${isSelected
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold shadow-lg scale-105'
                : isTodayDate
                  ? 'bg-green-200 text-green-800 font-semibold hover:shadow-md'
                  : 'hover:bg-blue-100'
              }
              ${isFuture && !isSelected ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}
            `}
          >
            <span className="text-xs font-medium">{day}</span>
          </div>

          {/* Entry dots below the circle */}
          {hasAnyEntry && (
            <div className="flex space-x-0.5 mt-1">
              {hasJournalEntry && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-500'}`}></div>}
              {hasDailyCheckin && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300'}`}></div>}
              {hasNegativePositive && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-purple-500'}`}></div>}
            </div>
          )}

          {/* Today small dot */}
          {isTodayDate && !isSelected && (
            <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
          )}
        </div>
      );
    }

    return calendarDays;
  };

  const renderTodayJournal = () => (
    <div className="space-y-6">
      {/* Streak Badge */}
      <div className="text-center">
        <Badge className="text-lg px-6 py-2 bg-gradient-to-r text-black">
          {t('journalStreak', { count: journalStreak })}
        </Badge>
        <p className="text-sm text-gray-600 mt-2">{t('todaysStruggles')}</p>
      </div>

      <Tabs value={todayInnerTab} onValueChange={setTodayInnerTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="daily-checkin" className="text-sm">{t('dailyCheckIn')}</TabsTrigger>
          <TabsTrigger value="journal-entry" className="text-sm">{t('todaysReflection')}</TabsTrigger>
          <TabsTrigger value="weekly-checkin" className="text-sm">{t('weeklyCheckIn')}</TabsTrigger>
          <TabsTrigger value="negative-positive" className="text-sm">{t('worriesJournal')}</TabsTrigger>
        </TabsList>

        <TabsContent value="daily-checkin" className="space-y-6">
          <Card className={`${theme.colors.card} border-0 shadow-xl`}>
            <CardHeader>
                <CardTitle className={`${theme.colors.text} flex items-center`}>
                <Smile className="w-5 h-5 mr-2 text-yellow-500" />
                {t('dailyCheckIn')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
            {/* Mood Selection */}
            <div>
              <label className={`block text-sm font-medium ${theme.colors.text} mb-3`}>
                {t('howFeeling')}
              </label>
              <div className="flex justify-center space-x-4">
                {Object.entries(moodEmojis).map(([key, { emoji, label, color }]) => (
                  <Button
                    key={key}
                    variant={dailyMood === key ? 'default' : 'outline'}
                    className={`text-3xl w-16 h-16 hover:scale-110 transition-all duration-300 ${
                      dailyMood === key ? 'bg-blue-500 text-white shadow-lg' : ''
                    }`}
                    onClick={() =>
                      setDailyMood(prevMood => (prevMood === key ? '' : key)) // toggle
                    }
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
              {dailyMood && (
                <p className={`text-center mt-2 font-medium ${moodEmojis[dailyMood].color}`}>
                  You&apos;re feeling {moodEmojis[dailyMood].label} today
                </p>
              )}
            </div>

              {/* Gratitude */}
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-3`}>
                  {t('gratitudePrompt')}
                </label>
                <div className="space-y-3">
                  {gratitude.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newGratitude = [...gratitude];
                          newGratitude[index] = e.target.value;
                          setGratitude(newGratitude);
                        }}
                        placeholder={t(`gratitudePlaceholder${index + 1}`)}
                        className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${theme.colors.card}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Reflection */}
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-3`}>
                  {t('howWasYourDayPrompt')}
                </label>
                <textarea
                  value={dailyReflection}
                  onChange={(e) => setDailyReflection(e.target.value)}
                  rows="4"
                  placeholder={t('reflectOnYourDay')}
                  className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 ${theme.colors.card}`}
                />
              </div>
            </CardContent>
          </Card>
            <div className="flex justify-end mt-6">
            <Button 
              onClick={saveDailyCheckin}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-md transition-all duration-200"
            >
              <CheckCircle2 className="w-5 h-5" />
              {t('saveCheckin')}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="journal-entry" className="space-y-6">
          <Card className={`${theme.colors.card} border-0 shadow-xl`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={`${theme.colors.text} text-xl flex items-center`}>
                  <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                  {t('journalEntry')}
                </CardTitle>
                
                <div className="flex items-center space-x-2">
                  {canEditDate(selectedDate) && (
                    <>
                      {!isEditing ? (
                        <Button
                          onClick={() => setIsEditing(true)}
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg hover:scale-105 transition-all duration-200"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          {currentEntry ? t('edit') : t('addEntry')}
                        </Button>
                      ) : (
                        <Button
                          onClick={saveJournalEntry}
                          size="sm"
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg hover:scale-105 transition-all duration-200"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          {t('saveEntry')}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {isEditing && canEditDate(selectedDate) ? (
                <div className="space-y-4">
                  <textarea
                    value={currentEntry}
                    onChange={(e) => setCurrentEntry(e.target.value)}
                    placeholder={t('journalEntryPlaceholder')}
                    className={`w-full h-96 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${theme.colors.card}`}
                    style={{ fontFamily: 'inherit' }}
                  />
                  
                  <div className="flex justify-between items-center">
                    <p className={`text-sm ${theme.colors.muted}`}>
                      {t('charactersLabel', { count: currentEntry.length })}
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          setCurrentEntry(journalEntries[formatDateKey(selectedDate)] || '');
                          setIsEditing(false);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        {t('cancel')}
                      </Button>
                      <Button
                        onClick={saveJournalEntry}
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-emerald-500"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        {t('save')}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentEntry ? (
                    <div className={`p-6 bg-gradient-to-br ${theme.colors.secondary} rounded-lg border min-h-96`}>
                      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                        {currentEntry}
                      </div>
                    </div>
                  ) : (
                    <div className={`p-12 bg-gradient-to-br ${theme.colors.secondary} rounded-lg border text-center min-h-96 flex items-center justify-center`}>
                      <div>
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className={`${theme.colors.muted} text-lg`}>
                          {isFutureDate(selectedDate)
                            ? t('futureEntriesWillAppear')
                            : canEditDate(selectedDate)
                              ? t('noEntryForToday')
                              : t('noEntriesFoundForDate')
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly-checkin" className="space-y-6">
          <Card className={`${theme.colors.card} border-0 shadow-xl`}>
            <CardHeader>
              <CardTitle className={`${theme.colors.text} flex items-center`}>
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                {t('weeksGrowth')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-3`}>
                  {t('weeksGrowthPrompt')}
                </label>
                <textarea
                  value={weeklyGrowth}
                  onChange={(e) => setWeeklyGrowth(e.target.value)}
                  rows="4"
                  placeholder={t('reflectPersonalGrowth')}
                  className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 ${theme.colors.card}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-3`}>
                  {t('threeGoalsPrompt')}
                </label>
                <div className="space-y-3">
                  {weeklyGoals.map((goal, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-blue-500" />
                        <input
                        type="text"
                        value={goal}
                        onChange={(e) => {
                          const newGoals = [...weeklyGoals];
                          newGoals[index] = e.target.value;
                          setWeeklyGoals(newGoals);
                        }}
                        placeholder={t(`goalPlaceholder${index + 1}`)}
                        className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${theme.colors.card}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-3`}>
                  Three achievements from this week:
                </label>
                <div className="space-y-3">
                  {weeklyAchievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) => {
                          const newAchievements = [...weeklyAchievements];
                          newAchievements[index] = e.target.value;
                          setWeeklyAchievements(newAchievements);
                        }}
                        placeholder={t(`achievementPlaceholder${index + 1}`)}
                        className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${theme.colors.card}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
            <div className="flex justify-end mt-6">
            <Button 
              onClick={saveWeeklyCheckin}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-md transition-all duration-200"
            >
              <CheckCircle2 className="w-5 h-5" />
              {t('saveCheckin')}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="negative-positive" className="space-y-6">
          <Card className={`${theme.colors.card} border-0 shadow-xl`}>
            <CardHeader>
              <CardTitle className={`${theme.colors.text} flex items-center`}>
                <RotateCcw className="w-5 h-5 mr-2 text-purple-500" />
                {t('safeSpaceTransformTitle')}
              </CardTitle>
              <p className={`text-sm ${theme.colors.muted}`}>
                {t('safeSpaceTransformDesc')}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-3 flex items-center`}>
                  <Frown className="w-4 h-4 mr-2 text-red-500" />
                  {t('whatsWorryingPrompt')}
                </label>
                <textarea
                  value={negativeThought}
                  onChange={(e) => setNegativeThought(e.target.value)}
                  rows="4"
                  placeholder={t('expressWorriesPlaceholder')}
                  className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-red-300 border-red-200 ${theme.colors.card}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-3 flex items-center`}>
                  <Lightbulb className="w-4 h-4 mr-2 text-green-500" />
                  {t('howCanYouReframePrompt')}
                </label>
                <textarea
                  value={positiveReframe}
                  onChange={(e) => setPositiveReframe(e.target.value)}
                  rows="4"
                  placeholder={t('reframePlaceholder')}
                  className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-green-300 border-green-200 ${theme.colors.card}`}
                />
              </div>

              {negativeThought && positiveReframe && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border-2 border-green-200">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="font-medium text-green-700">{t('greatJobReframing')}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Remember: It&apos;s normal to have negative thoughts. What matters is how we choose to respond to them.
                  </p>
                </div>
              )}

            <div className="flex justify-end mt-2" style={{ marginTop: '9px' }}>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-200">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium text-purple-700">{t('transformAndReframe')}</span>
                <Sparkles className="w-5 h-5 text-purple-500" />
              </button>
            </div>

            </CardContent>
          </Card>
          <div className="flex justify-end mt-6">
            <Button 
              onClick={saveNegativeToPositive}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-md transition-all duration-200"
            >
              <CheckCircle2 className="w-5 h-5" />
              {t('saveCheckin')}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      {/* Mobile calendar modal */}
      <Dialog open={showCalendarModal} onOpenChange={setShowCalendarModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className={`${theme.colors.text} flex items-center`}>
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              {t('journalCalendarTitle')}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2">
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

            <div className="grid grid-cols-7 gap-1 text-center font-medium text-gray-500 mb-2 text-xs">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="p-2">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-3xl font-bold ${theme.colors.text} flex items-center`}>
          <BookOpen className="w-8 h-8 mr-3 text-blue-500" />
          {t('journal')}
        </h2>
        <div className="lg:hidden">
          <button onClick={() => setShowCalendarModal(true)} className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-110" title="Calendar">
            <Calendar className="w-6 h-6 text-cyan-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Mobile quick actions: show compact buttons on small phones and iPad mini */}
        <div className="lg:hidden mb-4">
              <div className="grid grid-cols-4 gap-3">
                <button onClick={() => { setActiveTab('today'); setTodayInnerTab('daily-checkin'); }} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-3 rounded-lg text-xs text-center">
                  {t('dailyCheckIn')}
                </button>
                <button onClick={() => { setActiveTab('today'); setTodayInnerTab('journal-entry'); }} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-3 rounded-lg text-xs text-center">
                  {t('todaysReflection')}
                </button>
                <button onClick={() => { setActiveTab('today'); setTodayInnerTab('weekly-checkin'); }} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-3 rounded-lg text-xs text-center">
                  {t('weeklyCheckIn')}
                </button>
                <button onClick={() => { setActiveTab('today'); setTodayInnerTab('negative-positive'); }} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-3 rounded-lg text-xs text-center">
                  {t('worriesJournal')}
                </button>
              </div>
            </div>
        {/* Calendar Section - Keep as requested */}
        <Card className={`lg:col-span-1 ${theme.colors.card} border-0 shadow-xl hidden lg:block`}>
          <CardHeader>
            <CardTitle className={`${theme.colors.text} flex items-center justify-between`}>
              <span className="flex items-center">
                <Calendar className="w-10 h-5 mr-2 text-blue-500" />
                {t('journalCalendarTitle')}
              </span>
            </CardTitle>
            <p className="text-sm text-gray-600">{t('clickDatesViewPastEntries')}</p>
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
            <div className="grid grid-cols-7 gap-2 text-center font-medium text-gray-500 mb-2 text-xs">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="p-1">{day}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {renderCalendar()}
            </div>

            {/* Legend */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 rounded"></div>
                <span className={theme.colors.muted}>{t('hasEntries')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-green-100 to-green-200 rounded"></div>
                <span className={theme.colors.muted}>{t('todayLabel')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Section */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="today" className="space-y-6">
              {renderTodayJournal()}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdvancedJournalingView;