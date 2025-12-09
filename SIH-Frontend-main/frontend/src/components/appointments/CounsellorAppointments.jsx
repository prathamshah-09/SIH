import React, { useState, useMemo, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

// --- SVG Icons ---
const CalendarIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const ClockIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const UserIcon = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const SparklesIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m1-12a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 6h9m-9 6h9m-9-6a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6" />
    </svg>
);

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const CheckIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const TrashIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const XIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const RefreshIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

// --- Mock Data for Counsellor View ---
const getPastDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
};

const getFutureDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};

const formatDateToKey = (date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

const initialCounsellorAppointments = [
    // Appointment Requests (Pending)
    {
        id: 'request-1',
        studentId: 'SID-9x2c-f4e8',
        studentName: 'Alex Johnson',
        date: getFutureDate(3),
        time: '10:00 AM',
        status: 'pending',
        requestedDate: new Date(),
        preSessionNotes: 'I\'ve been struggling with exam anxiety and would really appreciate some guidance on coping strategies.',
        postSessionNotes: '',
        actionItems: []
    },
    {
        id: 'request-2',
        studentId: 'SID-7k8m-p1q5',
        studentName: 'Emma Davis',
        date: getFutureDate(5),
        time: '02:00 PM',
        status: 'pending',
        requestedDate: new Date(),
        preSessionNotes: 'Feeling overwhelmed with work-life balance and need support managing stress levels.',
        postSessionNotes: '',
        actionItems: []
    },
    // Confirmed Upcoming Appointments
    {
        id: 'upcoming-1',
        studentId: 'SID-8a7b-e4c1',
        studentName: 'Jordan Smith',
        date: getFutureDate(2),
        time: '10:00 AM',
        status: 'upcoming',
        preSessionNotes: 'I\'m feeling really overwhelmed with the upcoming midterms and finding it hard to focus on studying.',
        postSessionNotes: '',
        actionItems: []
    },
    {
        id: 'upcoming-2',
        studentId: 'SID-f2d1-c5e9',
        studentName: 'Taylor Wilson',
        date: getFutureDate(4),
        time: '02:00 PM',
        status: 'upcoming',
        preSessionNotes: 'Just want to check in and talk about some new stressors that have come up at my part-time job.',
        postSessionNotes: '',
        actionItems: []
    },
    // Past Appointments
    {
        id: 'completed-1',
        studentId: 'SID-a9c3-b8d2',
        studentName: 'Morgan Lee',
        date: getPastDate(7),
        time: '03:00 PM',
        status: 'completed',
        preSessionNotes: 'Felt very anxious about a presentation. Needed some coping strategies.',
        postSessionNotes: 'Session focused on grounding techniques and cognitive reframing. We identified key triggers and practiced the 5-4-3-2-1 method. Student responded well to reframing negative self-talk into more neutral, objective statements.',
        actionItems: [
            { id: 1, text: 'Use the 5-4-3-2-1 grounding technique before the next presentation.', completed: false },
            { id: 2, text: 'Identify and write down one piece of negative self-talk to reframe each day.', completed: false },
        ]
    },
];

// --- Main Component ---
const CounsellorAppointments = () => {
    const { theme, currentTheme } = useTheme();
    const { t } = useLanguage();
    const isDark = currentTheme === 'midnight';
    
    const [view, setView] = useState('requests'); // 'requests', 'upcoming', 'past', 'availability'
    const [appointments, setAppointments] = useState(initialCounsellorAppointments);
    const [availability, setAvailability] = useState({
        [formatDateToKey(getFutureDate(2))]: ['09:00 AM', '10:00 AM', '11:00 AM'],
        [formatDateToKey(getFutureDate(4))]: ['02:00 PM', '03:00 PM'],
        [formatDateToKey(getFutureDate(5))]: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    });
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [selectedAvailabilityDate, setSelectedAvailabilityDate] = useState(new Date());
    const [newTimeSlot, setNewTimeSlot] = useState('');
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedHour, setSelectedHour] = useState('09');
    const [selectedMinute, setSelectedMinute] = useState('00');
    const [selectedPeriod, setSelectedPeriod] = useState('AM');
    const [expanded, setExpanded] = useState({});
    const [newActionText, setNewActionText] = useState({});
    const [editingActionItem, setEditingActionItem] = useState(null);
    const [editingActionText, setEditingActionText] = useState('');

    const toggleExpanded = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleEditActionItem = (appointmentId, item) => {
        setEditingActionItem({ appointmentId, itemId: item.id });
        setEditingActionText(item.text);
    };

    const handleSaveEditedActionItem = (appointmentId, itemId) => {
        if (!editingActionText.trim()) {
            alert('Action item cannot be empty');
            return;
        }
        setAppointments(prev => prev.map(a => 
            a.id === appointmentId 
                ? { 
                    ...a, 
                    actionItems: a.actionItems.map(item =>
                        item.id === itemId ? { ...item, text: editingActionText } : item
                    )
                } 
                : a
        ));
        setEditingActionItem(null);
        setEditingActionText('');
    };

    const handleDeleteActionItem = (appointmentId, itemId) => {
        if (confirm('Are you sure you want to delete this action item?')) {
            setAppointments(prev => prev.map(a => 
                a.id === appointmentId 
                    ? { ...a, actionItems: a.actionItems.filter(item => item.id !== itemId) } 
                    : a
            ));
        }
    };

    const handleAddActionItem = (appointmentId) => {
        const text = (newActionText[appointmentId] || '').trim();
        if (!text) return;
        const newItem = { id: crypto.randomUUID ? crypto.randomUUID() : Date.now() + Math.random(), text, completed: false };
        setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, actionItems: [...(a.actionItems || []), newItem] } : a));
        setNewActionText(prev => ({ ...prev, [appointmentId]: '' }));
    };
    
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const updatedAppointments = appointments.map(app => {
                const appDateTime = new Date(app.date);
                const [hours, minutes] = app.time.match(/\d+/g).map(Number);
                const isPM = /PM/i.test(app.time);
                appDateTime.setHours(isPM && hours !== 12 ? hours + 12 : hours, minutes);

                if (app.status === 'upcoming' && appDateTime < now) {
                    return { ...app, status: 'completed' };
                }
                return app;
            });
            setAppointments(updatedAppointments.sort((a, b) => a.date - b.date));
        }, 60000);
        return () => clearInterval(interval);
    }, [appointments]);

    const handleAppointmentAction = (appointmentId, action) => {
        const updatedAppointments = appointments.map(app => {
            if (app.id === appointmentId) {
                switch (action) {
                    case 'accept':
                        return { ...app, status: 'upcoming' };
                    case 'decline':
                        return { ...app, status: 'declined' };
                    case 'reschedule':
                        // In a real app, this would open a reschedule modal
                        return { ...app, status: 'rescheduling' };
                    default:
                        return app;
                }
            }
            return app;
        });
        setAppointments(updatedAppointments);
    };

    const updateAppointmentDetails = (id, newDetails) => {
        setAppointments(appointments.map(app => app.id === id ? { ...app, ...newDetails } : app));
    };

    // --- Availability Calendar Logic ---
    const firstDayOfMonth = useMemo(() => new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1), [calendarDate]);
    const daysInMonth = useMemo(() => new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate(), [calendarDate]);
    
    const handlePrevMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
    
    const handleSelectAvailabilityDate = (day) => {
        const newDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
        setSelectedAvailabilityDate(newDate);
    };

    const renderAvailabilityCalendar = () => {
        const calendarDays = [];
        const startDay = firstDayOfMonth.getDay();

        for (let i = 0; i < startDay; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="p-2"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
            const dateKey = formatDateToKey(date);
            const isSelected = date.toDateString() === selectedAvailabilityDate.toDateString();
            const hasSlots = availability[dateKey] && availability[dateKey].length > 0;

            calendarDays.push(
                <div
                    key={day}
                    role="button"
                    tabIndex={0}
                    className={`text-center p-2 rounded-full cursor-pointer transition-all duration-300 ease-in-out relative
                        ${isSelected ? 'bg-cyan-600 text-white font-bold shadow-lg' : 'hover:bg-cyan-100'}
                        ${!isSelected && hasSlots ? 'bg-cyan-50' : ''}`}
                    onClick={() => handleSelectAvailabilityDate(day)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSelectAvailabilityDate(day);
                        }
                    }}
                >
                    {day}
                    {hasSlots && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>}
                </div>
            );
        }
        return calendarDays;
    };

    const handleAddTimeSlot = () => {
        if (!newTimeSlot.trim() || !/^\d{1,2}:\d{2}\s(AM|PM)$/i.test(newTimeSlot.trim())) {
            alert("Please enter a valid time format (e.g., 09:00 AM).");
            return;
        }
        const dateKey = formatDateToKey(selectedAvailabilityDate);
        const existingSlots = availability[dateKey] || [];
        const updatedSlots = [...existingSlots, newTimeSlot.trim().toUpperCase()].sort();
        setAvailability({ ...availability, [dateKey]: updatedSlots });
        setNewTimeSlot('');
    };

    const handleAddTimeFromPicker = () => {
        const timeString = `${selectedHour}:${selectedMinute} ${selectedPeriod}`;
        const dateKey = formatDateToKey(selectedAvailabilityDate);
        const existingSlots = availability[dateKey] || [];
        
        // Check if slot already exists
        if (existingSlots.includes(timeString)) {
            alert("This time slot already exists!");
            return;
        }
        
        const updatedSlots = [...existingSlots, timeString].sort();
        setAvailability({ ...availability, [dateKey]: updatedSlots });
        setShowTimePicker(false);
    };

    const handleRemoveTimeSlot = (time) => {
        const dateKey = formatDateToKey(selectedAvailabilityDate);
        const updatedSlots = (availability[dateKey] || []).filter(slot => slot !== time);
        setAvailability({ ...availability, [dateKey]: updatedSlots });
    };

    const pendingRequests = appointments.filter(app => app.status === 'pending');
    const upcomingAppointments = appointments.filter(app => app.status === 'upcoming');
    const pastAppointments = appointments.filter(app => app.status === 'completed');

    // Navigation Tabs
    const renderTabs = () => (
        <div className="flex justify-center mb-8">
            <div className={`flex space-x-2 p-1 rounded-full ${isDark ? 'bg-slate-800 border border-slate-600 shadow-lg' : 'bg-gray-200'}`}>
                <Button 
                    onClick={() => setView('requests')} 
                    variant={view === 'requests' ? 'animated' : 'ghost'}
                    className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                        view === 'requests' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : `${theme.colors.muted} hover:bg-cyan-50`
                    }`}
                    >
                    {t('appointmentRequestsTitle')}
                </Button>
                <Button 
                    onClick={() => setView('sessions')} 
                    variant={view === 'sessions' ? 'animated' : 'ghost'}
                    className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                        view === 'sessions' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : `${theme.colors.muted} hover:bg-cyan-50`
                    }`}
                >
                    {t('sessions') || 'Sessions'}
                </Button>
                <Button 
                    onClick={() => setView('availability')} 
                    variant={view === 'availability' ? 'animated' : 'ghost'}
                    className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                        view === 'availability' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : `${theme.colors.muted} hover:bg-cyan-50`
                    }`}
                    >
                    {t('manageAvailability')}
                </Button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <Card className={`${theme.colors.card} border-0 shadow-2xl`}>
                <CardHeader>
                    <CardTitle className={`${theme.colors.text} text-xl sm:text-2xl`}>
                        {t('appointmentManagement')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Mobile quick actions: three tappable options (Requests / Sessions / Manage Availability) */}
                    <div className="lg:hidden mb-4">
                        <div className="grid grid-cols-3 gap-3">
                            <button onClick={() => setView('requests')} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-3 rounded-lg text-xs text-center">
                                {t('appointmentRequestsTitle')}
                            </button>
                            <button onClick={() => setView('sessions')} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-3 rounded-lg text-xs text-center">
                                {t('sessions') || t('upcomingSessions')}
                            </button>
                            <button onClick={() => setView('availability')} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-3 rounded-lg text-xs text-center">
                                {t('manageAvailability')}
                            </button>
                        </div>
                        {/* calendar button removed for manage availability on mobile */}
                    </div>

                    <div className="hidden lg:block">{renderTabs()}</div>

                    {view === 'requests' && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className={`text-3xl font-bold ${theme.colors.text} mb-2`}>{t('appointmentRequestsTitle')}</h2>
                                <p className={`${theme.colors.muted} text-lg`}>{t('reviewRequestsScheduleSessions')}</p>
                            </div>
                            
                            <div className="space-y-6">
                                {pendingRequests.length > 0 ? pendingRequests.map(app => (
                                    <Card key={app.id} className={`${theme.colors.card} shadow-lg border-0 hover:shadow-xl transition-shadow border-l-4 border-l-orange-400`}>
                                        <CardContent
                                            className="p-2 sm:p-5"
                                            role="button"
                                            tabIndex={0}
                                            aria-expanded={!!expanded[app.id]}
                                            onClick={(e) => { if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea')) return; toggleExpanded(app.id); }}
                                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleExpanded(app.id); }}
                                        >
                                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="text-left sm:text-left">
                                                                <h3 className={`font-bold text-sm sm:text-lg ${theme.colors.text}`}>{app.studentName}</h3>
                                                            </div>
                                                            <Badge className={`${isDark ? 'bg-slate-700 text-orange-400' : 'bg-orange-100 text-orange-700'} px-3 py-1`}>
                                                                {t('pending')}
                                                            </Badge>
                                                        </div>
                                                        {/* Actions moved into collapsible area so dropdown controls visibility on all sizes */}
                                                    </div>

                                                        {/* Details: shown on sm+ or when expanded on mobile (animated on mobile) */}
                                                            <div className={`${expanded[app.id] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden transition-all duration-300`}>
                                                        <p className={`${theme.colors.muted} text-sm sm:font-semibold`}>
                                                            {t('requestedLabel')} {app.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} {t('fromLabel')} {app.time}
                                                        </p>
                                                        <p className={`text-sm ${theme.colors.muted}`}>
                                                            {t('requestSubmitted')} {app.requestedDate.toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* chevron removed; name toggles details on mobile */}
                                            </div>

                                            {/* Details and actions duplicated for mobile inside collapsible area (desktop already shows above) */}
                                            <div className={`${expanded[app.id] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden transition-all duration-300`}>
                                                <div>
                                                    <h4 className={`font-semibold ${theme.colors.text} mb-2`}>{t('studentsNotes')}</h4>
                                                    <div className={`p-4 bg-gradient-to-r ${theme.colors.secondary} rounded-lg border`}>
                                                        <p className={`${theme.colors.text}`}>{app.preSessionNotes || t('noNotesProvided')}</p>
                                                    </div>
                                                </div>

                                                {/* Actions shown in collapsible area for all sizes */}
                                                <div className="mt-3 flex space-x-3">
                                                    <Button
                                                        onClick={() => handleAppointmentAction(app.id, 'accept')}
                                                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:scale-105 transition-all duration-200 text-white"
                                                        size="sm"
                                                    >
                                                        <CheckIcon className="w-4 h-4 mr-2" />
                                                        {t('accept')}
                                                    </Button>
                                                    {/* <Button
                                                        onClick={() => handleAppointmentAction(app.id, 'reschedule')}
                                                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:shadow-lg hover:scale-105 transition-all duration-200 text-white"
                                                        size="sm"
                                                    >
                                                        <RefreshIcon className="w-4 h-4 mr-2" />
                                                        {t('reschedule')}
                                                    </Button> */}
                                                    <Button
                                                        onClick={() => handleAppointmentAction(app.id, 'decline')}
                                                        className="bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg hover:scale-105 transition-all duration-200 text-white"
                                                        size="sm"
                                                    >
                                                        <XIcon className="w-4 h-4 mr-2" />
                                                        {t('decline')}
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )) : (
                                    <div className={`text-center py-12 bg-gradient-to-r ${theme.colors.secondary} rounded-2xl`}>
                                        <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <p className={`${theme.colors.muted} text-lg`}>{t('noPendingAppointmentRequests')}</p>
                                        <p className={`${theme.colors.muted} text-sm mt-2`}>{t('newRequestsWillAppear')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {view === 'sessions' && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className={`text-3xl font-bold ${theme.colors.text} mb-2`}>{t('sessions') || 'Sessions'}</h2>
                                <p className={`${theme.colors.muted} text-lg`}>{t('reviewStudentNotes')}</p>
                            </div>
                            
                            {/* Upcoming Appointments */}
                            <div>
                                <h3 className={`text-2xl font-bold ${theme.colors.text} mb-4`}>{t('upcomingSessions')}</h3>
                                <div className="space-y-6">
                                {upcomingAppointments.length > 0 ? upcomingAppointments.map(app => (
                                    <Card key={app.id} className={`${theme.colors.card} shadow-lg border-0 hover:shadow-xl transition-shadow border-l-4 border-l-cyan-400`}>
                                        <CardContent
                                            className="p-2 sm:p-5"
                                            role="button"
                                            tabIndex={0}
                                            aria-expanded={!!expanded[app.id]}
                                            onClick={(e) => { if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea')) return; toggleExpanded(app.id); }}
                                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleExpanded(app.id); }}
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                                <div>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="text-left">
                                                                <h3 className={`font-bold text-sm sm:text-lg ${theme.colors.text} mb-1`}>{app.studentName}</h3>
                                                            </div>
                                                            <p className={`font-semibold text-xs sm:text-sm ${theme.colors.text}`}>
                                                                {app.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                                            </p>
                                                            <p className={`${theme.colors.muted} text-xs`}>{app.time}</p>
                                                        </div>
                                                        {/* chevron removed; name toggles details on mobile */}
                                                    </div>
                                                </div>
                                                <Badge className="hidden sm:inline-flex bg-cyan-100 text-cyan-700 px-3 py-1 mt-2 sm:mt-0">
                                                    {t('studentIdLabel')} {app.studentId}
                                                </Badge>
                                            </div>

                                            <div className={`${expanded[app.id] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden transition-all duration-300`}>
                                                <h4 className={`font-semibold ${theme.colors.text}`}>{t('studentsPreSessionNotes')}</h4>
                                                <div className={`mt-2 p-4 bg-gradient-to-r ${theme.colors.secondary} rounded-lg border`}>
                                                    <p className={`${theme.colors.text}`}>{app.preSessionNotes || t('noNotesProvided')}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )) : (
                                    <div className={`text-center py-12 bg-gradient-to-r ${theme.colors.secondary} rounded-2xl`}>
                                        <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <p className={`${theme.colors.muted} text-lg`}>{t('noUpcomingAppointments')}</p>
                                    </div>
                                )}
                                </div>
                            </div>

                            {/* Past Appointments */}
                            <div>
                                <h3 className={`text-2xl font-bold ${theme.colors.text} mb-4`}>{t('pastSessions')}</h3>
                                <div className="space-y-8">
                                {pastAppointments.length > 0 ? pastAppointments.map(app => (
                                    <Card key={app.id} className={`${theme.colors.card} shadow-lg border-0 border-l-4 border-l-green-400`}>
                                        <CardContent
                                            className="p-2 sm:p-5"
                                            role="button"
                                            tabIndex={0}
                                            aria-expanded={!!expanded[app.id]}
                                            onClick={(e) => { if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea')) return; toggleExpanded(app.id); }}
                                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleExpanded(app.id); }}
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="text-left">
                                                                <h3 className={`font-bold text-xs sm:text-sm ${theme.colors.text} mb-1`}>Session with {app.studentName}</h3>
                                                            </div>
                                                            <p className={`font-semibold text-xs sm:text-sm ${theme.colors.text}`}>
                                                                {app.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                                            </p>
                                                            <div className="mt-1">
                                                                <Badge className="hidden sm:inline-flex bg-cyan-100 text-cyan-700 text-sm">
                                                                    {t('studentIdLabel')} {app.studentId}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        {/* chevron removed; name toggles details on mobile */}
                                                    </div>
                                                </div>
                                                <Badge className="bg-green-100 text-green-800">Completed</Badge>
                                            </div>

                                            <div className={`${expanded[app.id] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden transition-all duration-300`}> 
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div>
                                                        <label className={`font-semibold ${theme.colors.text}`}>{t('yourSessionNotesLabel')}</label>
                                                        <textarea 
                                                            rows="6" 
                                                            placeholder={t('yourSessionNotesPlaceholder')} 
                                                            value={app.postSessionNotes} 
                                                            onChange={(e) => updateAppointmentDetails(app.id, {postSessionNotes: e.target.value})} 
                                                            className={`mt-2 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 ${theme.colors.card}`}
                                                        />
                                                    </div>
                                                    
                                                    <div>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className={`font-semibold ${isDark ? 'text-white' : theme.colors.text}`}>{t('suggestedActionPlan')}</h4>
                                                        </div>
                                                        <div className={`space-y-2 p-3 rounded-lg border h-40 overflow-y-auto ${isDark ? 'bg-slate-800 border-slate-700' : `bg-gradient-to-r ${theme.colors.secondary}`}`}>
                                                            {app.actionItems.length > 0 ? app.actionItems.map(item => (
                                                                <div key={item.id} className={`flex items-start justify-between group p-2 rounded transition-all ${isDark ? 'hover:bg-slate-700' : 'hover:bg-opacity-80'}`}>
                                                                    <div className="flex items-start flex-1">
                                                                        <span className="text-cyan-500 mr-2 mt-0.5">•</span>
                                                                        {editingActionItem?.itemId === item.id && editingActionItem?.appointmentId === app.id ? (
                                                                            <input
                                                                                type="text"
                                                                                value={editingActionText}
                                                                                onChange={(e) => setEditingActionText(e.target.value)}
                                                                                className={`flex-1 p-1 rounded border border-cyan-400 focus:ring-2 focus:ring-cyan-500 ${isDark ? 'bg-slate-700 text-white' : theme.colors.card}`}
                                                                            />
                                                                        ) : (
                                                                            <p className={`text-sm flex-1 ${isDark ? 'text-white' : theme.colors.text}`}>{item.text}</p>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        {editingActionItem?.itemId === item.id && editingActionItem?.appointmentId === app.id ? (
                                                                            <>
                                                                                <button
                                                                                    onClick={() => handleSaveEditedActionItem(app.id, item.id)}
                                                                                    className="p-1 rounded hover:bg-green-200 text-green-600"
                                                                                    title="Save"
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                                    </svg>
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => { setEditingActionItem(null); setEditingActionText(''); }}
                                                                                    className="p-1 rounded hover:bg-red-200 text-red-600"
                                                                                    title="Cancel"
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                                    </svg>
                                                                                </button>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <button
                                                                                    onClick={() => handleEditActionItem(app.id, item)}
                                                                                    className="p-1 rounded hover:bg-blue-200 text-blue-600"
                                                                                    title="Edit"
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                                    </svg>
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleDeleteActionItem(app.id, item.id)}
                                                                                    className="p-1 rounded hover:bg-red-200 text-red-600"
                                                                                    title="Delete"
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                                    </svg>
                                                                                </button>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )) : (
                                                                <p className={`${theme.colors.muted} text-sm text-center pt-12`}>
                                                                    {t('noActionItemsYet')}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="mt-3 flex gap-2 items-center">
                                                            <input
                                                                type="text"
                                                                value={newActionText[app.id] || ''}
                                                                onChange={(e) => setNewActionText(prev => ({ ...prev, [app.id]: e.target.value }))}
                                                                className={`flex-grow p-2 rounded-lg border focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 ${isDark ? 'bg-slate-700 text-white border-slate-600' : `border-gray-300 ${theme.colors.card}`}`}
                                                                placeholder={isDark ? 'Add action item...' : ''}
                                                            />
                                                            <Button onClick={() => handleAddActionItem(app.id)} size="sm" className="bg-cyan-500 text-white">
                                                                {t('addButton') || 'Add'}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )) : (
                                    <div className={`text-center py-12 bg-gradient-to-r ${theme.colors.secondary} rounded-2xl`}>
                                        <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <p className={`${theme.colors.muted} text-lg`}>{t('noPastSessionsYet')}</p>
                                    </div>
                                )}
                                </div>
                            </div>
                        </div>
                    )}

                    {view === 'availability' && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className={`text-3xl font-bold ${theme.colors.text} mb-2`}>{t('manageAvailability')}</h2>
                                <p className={`${theme.colors.muted} text-lg`}>{t('manageAvailabilityDesc')}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <Card className={`${isDark ? 'bg-slate-800 border-slate-700' : theme.colors.card} shadow-lg ${isDark ? 'border' : 'border-0'}`}>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <Button onClick={handlePrevMonth} variant="outline" size="sm" className="hover:bg-cyan-50">
                                                <ChevronLeftIcon />
                                            </Button>
                                            <h3 className={`font-bold text-lg ${theme.colors.text}`}>
                                                {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                            </h3>
                                            <Button onClick={handleNextMonth} variant="outline" size="sm" className="hover:bg-cyan-50">
                                                <ChevronRightIcon />
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-7 gap-2 text-center font-medium text-gray-500 mb-2">
                                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                                <div key={day}>{day}</div>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-7 gap-2">{renderAvailabilityCalendar()}</div>
                                    </CardContent>
                                </Card>
                                
                                <Card className={`${isDark ? 'bg-slate-800 border-slate-700' : theme.colors.card} shadow-lg ${isDark ? 'border' : 'border-0'}`}>
                                    <CardContent className="p-6">
                                        <h3 className={`font-bold text-lg ${theme.colors.text} mb-4`}>
                                            {t('availableSlotsForDate', { date: selectedAvailabilityDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) })}
                                        </h3>
                                        
                                        {/* Time Picker Toggle Button */}
                                        <div className="mb-4">
                                            <Button 
                                                onClick={() => setShowTimePicker(!showTimePicker)}
                                                className={`w-full ${isDark ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'} text-white flex items-center justify-center gap-2`}
                                            >
                                                <ClockIcon className="w-5 h-5" />
                                                {showTimePicker ? 'Close Time Picker' : 'Select Time'}
                                            </Button>
                                        </div>

                                        {/* Time Picker Interface */}
                                        {showTimePicker && (
                                            <div className={`mb-4 p-4 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-blue-50 border-blue-200'}`}>
                                                <div className="flex items-center justify-center gap-2 mb-4">
                                                    <ClockIcon className={`w-6 h-6 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                                                    <h4 className={`font-semibold ${theme.colors.text}`}>Pick a Time</h4>
                                                </div>
                                                
                                                <div className="flex items-center justify-center gap-3 mb-4">
                                                    {/* Hour Selector */}
                                                    <div className="flex flex-col items-center">
                                                        <label className={`text-xs mb-2 ${theme.colors.muted}`}>Hour</label>
                                                        <select 
                                                            value={selectedHour}
                                                            onChange={(e) => setSelectedHour(e.target.value)}
                                                            className={`p-2 rounded-lg border text-center text-lg font-bold focus:ring-2 focus:ring-cyan-400 ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
                                                        >
                                                            {Array.from({ length: 12 }, (_, i) => {
                                                                const hour = (i + 1).toString().padStart(2, '0');
                                                                return <option key={hour} value={hour}>{hour}</option>;
                                                            })}
                                                        </select>
                                                    </div>

                                                    <span className={`text-2xl font-bold ${theme.colors.text} mt-6`}>:</span>

                                                    {/* Minute Selector */}
                                                    <div className="flex flex-col items-center">
                                                        <label className={`text-xs mb-2 ${theme.colors.muted}`}>Minute</label>
                                                        <select 
                                                            value={selectedMinute}
                                                            onChange={(e) => setSelectedMinute(e.target.value)}
                                                            className={`p-2 rounded-lg border text-center text-lg font-bold focus:ring-2 focus:ring-cyan-400 ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
                                                        >
                                                            {['00', '15', '30', '45'].map(min => (
                                                                <option key={min} value={min}>{min}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* AM/PM Selector */}
                                                    <div className="flex flex-col items-center">
                                                        <label className={`text-xs mb-2 ${theme.colors.muted}`}>Period</label>
                                                        <select 
                                                            value={selectedPeriod}
                                                            onChange={(e) => setSelectedPeriod(e.target.value)}
                                                            className={`p-2 rounded-lg border text-center text-lg font-bold focus:ring-2 focus:ring-cyan-400 ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
                                                        >
                                                            <option value="AM">AM</option>
                                                            <option value="PM">PM</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Preview */}
                                                <div className={`text-center mb-3 p-2 rounded ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                                                    <span className={`text-sm ${theme.colors.muted}`}>Selected Time: </span>
                                                    <span className={`text-lg font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                                                        {selectedHour}:{selectedMinute} {selectedPeriod}
                                                    </span>
                                                </div>

                                                {/* Add Button */}
                                                <Button 
                                                    onClick={handleAddTimeFromPicker}
                                                    className={`w-full ${isDark ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
                                                >
                                                    Add Time Slot
                                                </Button>
                                            </div>
                                        )}

                                        {/* Manual Input (Alternative) */}
                                        {!showTimePicker && (
                                            <div className="mb-4">
                                                <p className={`text-xs ${theme.colors.muted} mb-2`}>Or type manually:</p>
                                                <div className="flex gap-2">
                                                    <input 
                                                        type="text" 
                                                        value={newTimeSlot}
                                                        onChange={(e) => setNewTimeSlot(e.target.value)}
                                                        placeholder={t('timeExamplePlaceholder')}
                                                        className={`flex-grow p-2 rounded-lg border focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 ${isDark ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400' : 'bg-white border-gray-300'}`}
                                                    />
                                                    <Button onClick={handleAddTimeSlot} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-cyan-700">
                                                        {t('addButton')}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                        <div className="space-y-2 h-64 overflow-y-auto">
                                            {(availability[formatDateToKey(selectedAvailabilityDate)] || []).length > 0 ? (
                                                (availability[formatDateToKey(selectedAvailabilityDate)] || []).map(time => (
                                                    <div key={time} className={`flex items-center justify-between p-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-cyan-50 border-cyan-200'}`}>
                                                        <p className={`font-semibold ${theme.colors.text}`}>{time}</p>
                                                        <Button 
                                                            onClick={() => handleRemoveTimeSlot(time)} 
                                                            variant="ghost"
                                                            size="sm"
                                                            className={isDark ? 'text-red-400 hover:text-red-300 hover:bg-slate-600' : 'text-red-500 hover:text-red-700 hover:bg-red-50'}
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
                                                        </Button>
                                                    </div>
                                                ))
                                                ) : (
                                                <p className={`${theme.colors.muted} text-center pt-24`}>{t('noAvailableSlotsForDay')}</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CounsellorAppointments;