import React, { useState } from 'react';
import { useTheme } from '@context/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CompactSessionCalendar = () => {
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock sessions data
  const sessions = [
    {
      id: 'session-1',
      studentName: 'Alex Johnson',
      date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2),
      time: '10:00 AM',
      status: 'scheduled'
    },
    {
      id: 'session-2',
      studentName: 'Emma Davis',
      date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2),
      time: '11:30 AM',
      status: 'scheduled'
    },
    {
      id: 'session-3',
      studentName: 'John Smith',
      date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5),
      time: '2:00 PM',
      status: 'pending'
    },
    {
      id: 'session-4',
      studentName: 'Sarah Wilson',
      date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1),
      time: '3:00 PM',
      status: 'completed'
    },
    {
      id: 'session-5',
      studentName: 'Michael Brown',
      date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
      time: '4:00 PM',
      status: 'completed'
    },
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

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

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const today = new Date();
  const isToday = (day) => {
    return (
      day &&
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <Card className={`${theme.colors.card} border-0 shadow-lg h-fit sticky top-4`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={previousMonth}
            className={`p-1 rounded hover:${theme.colors.hover}`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className={`text-sm font-semibold ${theme.colors.text} flex-1 text-center`}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={nextMonth}
            className={`p-1 rounded hover:${theme.colors.hover}`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className={`text-center text-xs font-semibold ${theme.colors.muted}`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dayHasSessions = day && getSessionsForDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day)).length > 0;

            return (
              <div
                key={index}
                className={`
                  aspect-square rounded text-xs flex items-center justify-center font-semibold transition-all
                  ${!day
                    ? 'cursor-default'
                    : isToday(day)
                      ? 'bg-blue-500 text-white'
                      : dayHasSessions
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-300'
                        : `${theme.colors.secondary} ${theme.colors.text} hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer`
                  }
                `}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span className={theme.colors.muted}>Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
            <span className={theme.colors.muted}>Sessions</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactSessionCalendar;
