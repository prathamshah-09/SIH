import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { BookOpen, ArrowLeft, Calendar, ChevronLeft, ChevronRight, Save, Plus, X } from 'lucide-react';

const EnhancedJournalingView = ({ onBack }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [journalEntries, setJournalEntries] = useState({});
  const [currentEntry, setCurrentEntry] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);

  // TODO: Persist entries to backend when available. Currently session-only.

  // Load current entry when selected date changes
  useEffect(() => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    setCurrentEntry(journalEntries[dateKey] || '');
    setIsEditing(false);
  }, [selectedDate, journalEntries]);

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

  const handleDateClick = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
  };

  const saveEntry = () => {
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
    const today = new Date();
    const startDay = firstDayOfMonth.getDay();

    // Empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateKey = formatDateKey(date);
      const hasEntry = journalEntries[dateKey];
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const isTodayDate = isToday(date);
      const isFuture = isFutureDate(date);

      calendarDays.push(
        <div
          key={day}
          className={`
            text-center p-3 rounded-lg cursor-pointer transition-all duration-300 relative
            ${isSelected 
              ? 'bg-purple-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105' 
              : isTodayDate
                ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 font-semibold hover:shadow-md'
                : isFuture
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'hover:bg-blue-100 hover:shadow-md'
            }
            ${hasEntry && !isSelected ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300' : ''}
          `}
          onClick={() => !isFuture && handleDateClick(day)}
        >
          {day}
          {hasEntry && (
            <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${
              isSelected ? 'bg-white' : 'bg-purple-500'
            }`}></div>
          )}
          {isTodayDate && !isSelected && (
            <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
          )}
        </div>
      );
    }

    return calendarDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        {/* <h2 className={`text-3xl font-bold ${theme.colors.text} flex items-center`}>
          <BookOpen className="w-8 h-8 mr-3 text-blue-500" />
          {t('journaling')}
        </h2> */}
        <div className="relative">
          <button
            onClick={() => setShowCalendarPopup(!showCalendarPopup)}
            className={`p-2 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:scale-110`}
          >
            <Calendar className="w-6 h-6" />
          </button>

          {/* Calendar Popup Modal */}
          {showCalendarPopup && (
            <>
              {/* Overlay Backdrop */}
              <div
                className="fixed inset-0 z-40 bg-black bg-opacity-50"
                onClick={() => setShowCalendarPopup(false)}
              />
              {/* Popup */}
              <div className={`fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 ${theme.colors.card} border-0 shadow-2xl rounded-2xl p-6 z-50`}>
              <div className="flex items-center justify-between mb-4">
                <Button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
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
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
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
                  <div key={day} className="p-2">{day}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowCalendarPopup(false)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-all"
                  title="Close calendar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section - Desktop only */}
        <Card className={`hidden lg:block lg:col-span-1 ${theme.colors.card} border-0 shadow-xl`}>
          <CardHeader>
            <CardTitle className={`${theme.colors.text} flex items-center justify-between`}>
              <span className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                {t('journalCalendarTitle')}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
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
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                variant="outline"
                size="sm"
                className="hover:scale-105 transition-transform"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center font-medium text-gray-500 mb-2 text-xs sm:text-sm">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2">{day}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>

            {/* Legend */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 rounded"></div>
                <span className={theme.colors.muted}>Has entry</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-green-100 to-green-200 rounded"></div>
                <span className={theme.colors.muted}>{t('todayLabel')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-200 rounded"></div>
                <span className={theme.colors.muted}>Future (view only)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Journal Entry Section */}
        <Card className={`lg:col-span-2 ${theme.colors.card} border-0 shadow-xl`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className={`${theme.colors.text} text-xl`}>
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardTitle>
              
              <div className="flex items-center space-x-2">
                {canEditDate(selectedDate) && (
                  <>
                    {!isEditing ? (
                      <Button
                          variant="animated"
                          onClick={() => setIsEditing(true)}
                          size="sm"
                          className="px-3 py-2"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        {currentEntry ? t('edit') : t('addEntry')}
                      </Button>
                    ) : (
                      <Button
                          variant="animated"
                          onClick={saveEntry}
                          size="sm"
                          className="px-3 py-2"
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
              // Editing Mode
              <div className="space-y-4">
                <textarea
                  value={currentEntry}
                  onChange={(e) => setCurrentEntry(e.target.value)}
                  placeholder={t('journalEntryPlaceholder')}
                  className={`w-full h-64 sm:h-96 p-3 sm:p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${theme.colors.card}`}
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
                      className="px-3 py-2"
                    >
                      {t('cancel')}
                    </Button>
                    <Button
                      onClick={saveEntry}
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-2"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      {t('save')}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // Viewing Mode
              <div className="space-y-4">
                {currentEntry ? (
                  <div className={`p-6 bg-gradient-to-br ${theme.colors.secondary} rounded-lg border min-h-[16rem] sm:min-h-96`}>
                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                      {currentEntry}
                    </div>
                  </div>
                ) : (
                  <div className={`p-8 sm:p-12 bg-gradient-to-br ${theme.colors.secondary} rounded-lg border text-center min-h-[14rem] sm:min-h-96 flex items-center justify-center`}>
                    <div>
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className={`${theme.colors.muted} text-lg`}>
                        {isFutureDate(selectedDate) 
                          ? t('futureEntriesWillAppear')
                          : canEditDate(selectedDate)
                            ? t('noEntryForToday')
                            : t('noEntryRecorded')
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mobile sticky save/cancel bar when editing */}
      {isEditing && canEditDate(selectedDate) && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t p-3 flex justify-between items-center z-40">
          <Button
            variant="outline"
            onClick={() => {
              setCurrentEntry(journalEntries[formatDateKey(selectedDate)] || '');
              setIsEditing(false);
            }}
            className="w-1/2 mr-2"
          >
            {t('cancel')}
          </Button>
          <Button onClick={saveEntry} className="w-1/2">
            {t('save')}
          </Button>
        </div>
      )}

      {/* Benefits Section */}
      <Card className={`${theme.colors.card} border-0 shadow-xl`}>
        <CardContent className="p-6">
          <h4 className={`font-semibold ${theme.colors.text} mb-4 text-lg`}>
            Benefits of Daily Journaling:
          </h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '🧠', title: 'Mental Clarity', desc: 'Organize thoughts and reduce mental clutter' },
              { icon: '😌', title: 'Stress Relief', desc: 'Release emotional tension through writing' },
              { icon: '📈', title: 'Track Progress', desc: 'Monitor your mental health journey over time' },
              { icon: '💡', title: 'Self-Awareness', desc: 'Understand patterns in your thoughts and feelings' },
              { icon: '🎯', title: 'Goal Setting', desc: 'Clarify your objectives and track achievements' },
              { icon: '🌱', title: 'Personal Growth', desc: 'Reflect on experiences and learn from them' }
            ].map((benefit, index) => (
              <div key={index} className={`p-4 bg-gradient-to-br ${theme.colors.secondary} rounded-lg hover:shadow-md transition-shadow`}>
                <div className="text-2xl mb-2">{benefit.icon}</div>
                <h5 className={`font-semibold ${theme.colors.text} mb-1`}>{benefit.title}</h5>
                <p className={`text-sm ${theme.colors.muted}`}>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedJournalingView;