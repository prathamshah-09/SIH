import React, { useState, useEffect } from 'react';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { ChevronLeft, ChevronRight, Clock, User, AlertCircle, CheckCircle } from 'lucide-react';

const CounsellorSessionCalendar = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sessions, setSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateSessions, setSelectedDateSessions] = useState([]);

  // Initialize with mock sessions
  useEffect(() => {
    const mockSessions = [
      {
        id: 'session-1',
        studentName: 'Alex Johnson',
        studentId: 'SID-001',
        date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2),
        time: '10:00 AM',
        duration: 60,
        status: 'scheduled',
        type: 'regular'
      },
      {
        id: 'session-2',
        studentName: 'Emma Davis',
        studentId: 'SID-002',
        date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2),
        time: '11:30 AM',
        duration: 45,
        status: 'scheduled',
        type: 'regular'
      },
      {
        id: 'session-3',
        studentName: 'John Smith',
        studentId: 'SID-003',
        date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5),
        time: '2:00 PM',
        duration: 60,
        status: 'pending',
        type: 'follow-up'
      },
      {
        id: 'session-4',
        studentName: 'Sarah Wilson',
        studentId: 'SID-004',
        date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1),
        time: '3:00 PM',
        duration: 60,
        status: 'completed',
        type: 'regular'
      },
      {
        id: 'session-5',
        studentName: 'Michael Brown',
        studentId: 'SID-005',
        date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        time: '4:00 PM',
        duration: 45,
        status: 'completed',
        type: 'regular'
      },
    ];
    setSessions(mockSessions);
  }, []);

  // Get days in month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Check if date has sessions
  const getSessionsForDate = (date) => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return (
        sessionDate.getFullYear() === date.getFullYear() &&
        sessionDate.getMonth() === date.getMonth() &&
        sessionDate.getDate() === date.getDate()
      );
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'scheduled':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Navigate months
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Handle date click
  const handleDateClick = (day) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selected);
    setSelectedDateSessions(getSessionsForDate(selected));
  };

  // Render calendar grid
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const today = new Date();
  const isToday = (day) => {
    return (
      day &&
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    return (
      day &&
      selectedDate &&
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Get upcoming sessions count
  const upcomingSessions = sessions.filter(s => new Date(s.date) >= new Date()).length;
  const completedSessions = sessions.filter(s => s.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className={`${theme.colors.card} border-0 shadow-lg`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className={`text-xl ${theme.colors.text}`}>
                  Session Calendar
                </CardTitle>
                <div className="flex items-center gap-2">
                  <button
                    onClick={previousMonth}
                    className={`p-2 rounded-lg hover:${theme.colors.hover} transition-colors`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className={`text-lg font-semibold ${theme.colors.text} min-w-[200px] text-center`}>
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </span>
                  <button
                    onClick={nextMonth}
                    className={`p-2 rounded-lg hover:${theme.colors.hover} transition-colors`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className={`text-center font-semibold text-sm ${theme.colors.muted} py-2`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => {
                  const dayHasSessions = day && getSessionsForDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day)).length > 0;
                  const daySessionCount = day ? getSessionsForDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day)).length : 0;

                  return (
                    <div
                      key={index}
                      onClick={() => day && handleDateClick(day)}
                      className={`
                        aspect-square rounded-lg border-2 transition-all cursor-pointer
                        ${!day 
                          ? 'cursor-default' 
                          : isSelected(day)
                            ? 'border-cyan-500 bg-cyan-100 dark:bg-cyan-900'
                            : isToday(day)
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                              : dayHasSessions
                                ? 'border-green-400 bg-green-50 dark:bg-green-900 hover:border-green-500'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }
                        flex flex-col items-center justify-center p-1 relative group
                      `}
                    >
                      {day && (
                        <>
                          <span className={`text-sm font-medium ${
                            isSelected(day) 
                              ? 'text-cyan-900 dark:text-cyan-200' 
                              : isToday(day)
                                ? 'text-blue-900 dark:text-blue-200'
                                : theme.colors.text
                          }`}>
                            {day}
                          </span>
                          {daySessionCount > 0 && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                              daySessionCount === 1
                                ? 'bg-green-500 text-white'
                                : 'bg-orange-500 text-white'
                            }`}>
                              {daySessionCount}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${theme.colors.text}`}>{upcomingSessions}</div>
                  <div className={`text-sm ${theme.colors.muted}`}>Upcoming Sessions</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${theme.colors.text}`}>{completedSessions}</div>
                  <div className={`text-sm ${theme.colors.muted}`}>Completed Sessions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sessions List */}
        <div>
          <Card className={`${theme.colors.card} border-0 shadow-lg`}>
            <CardHeader>
              <CardTitle className={`text-lg ${theme.colors.text}`}>
                {selectedDate 
                  ? `${selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })} Sessions`
                  : 'Select a Date'
                }
              </CardTitle>
            </CardHeader>

            <CardContent>
              {selectedDate ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedDateSessions.length > 0 ? (
                    selectedDateSessions.map((session) => (
                      <div
                        key={session.id}
                        className={`p-3 rounded-lg border-l-4 ${
                          session.status === 'completed'
                            ? 'bg-green-50 dark:bg-green-900/20 border-l-green-500'
                            : session.status === 'pending'
                              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-yellow-500'
                              : 'bg-blue-50 dark:bg-blue-900/20 border-l-blue-500'
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <div className="flex-1">
                            <p className={`font-semibold text-sm ${theme.colors.text}`}>
                              {session.studentName}
                            </p>
                            <p className={`text-xs ${theme.colors.muted}`}>
                              {session.studentId}
                            </p>
                          </div>
                          <Badge className={`text-xs ${getStatusColor(session.status)}`}>
                            {getStatusIcon(session.status) && (
                              <span className="mr-1 flex items-center">
                                {getStatusIcon(session.status)}
                              </span>
                            )}
                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-xs mb-2">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-cyan-500" />
                            <span>{session.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={`text-xs px-2 py-1 rounded ${
                              session.type === 'follow-up'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-800'
                            }`}>
                              {session.type}
                            </span>
                          </div>
                        </div>

                        <div className={`text-xs ${theme.colors.muted}`}>
                          Duration: {session.duration} min
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className={`text-sm ${theme.colors.muted}`}>
                        No sessions scheduled for this date
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className={`text-sm ${theme.colors.muted}`}>
                    Click on a date to view sessions
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CounsellorSessionCalendar;
