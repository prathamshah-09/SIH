import React, { useState, useMemo, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

// --- SVG Icons ---
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

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);

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

const UserCircleIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SparklesIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m1-12a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 6h9m-9 6h9m-9-6a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6" />
    </svg>
);

const TrashIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const PencilIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const CheckCircleIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// --- Mock Data ---
const counsellors = [
    { id: 1, name: 'Dr. Anya Sharma', specialty: 'Cognitive Behavioral Therapy', imageUrl: 'https://placehold.co/100x100/E2E8F0/4A5568?text=AS', availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM'] },
    { id: 2, name: 'Mr. Rohan Verma', specialty: 'Stress & Anxiety Management', imageUrl: 'https://placehold.co/100x100/E2E8F0/4A5568?text=RV', availableSlots: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM'] },
    { id: 3, name: 'Ms. Priya Singh', specialty: 'Mindfulness & Meditation', imageUrl: 'https://placehold.co/100x100/E2E8F0/4A5568?text=PS', availableSlots: ['09:00 AM', '03:00 PM', '04:00 PM', '05:00 PM'] },
];

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

const initialAppointments = [
    {
        id: 'upcoming-1',
        counsellor: counsellors[0],
        date: getFutureDate(3),
        time: '10:00 AM',
        status: 'upcoming',
        sessionNotes: 'Looking forward to discussing stress management techniques.',
        actionItems: []
    },
    {
        id: 'completed-1',
        counsellor: counsellors[1],
        date: getPastDate(7),
        time: '03:00 PM',
        status: 'completed',
        sessionNotes: 'We talked about my pre-exam anxiety and strategies to stay calm. Breathing exercises seem promising.',
        actionItems: [
            { id: 1, text: 'Practice 5 minutes of deep breathing daily.', completed: true },
            { id: 2, text: 'Create a study schedule for the upcoming week.', completed: true },
            { id: 3, text: 'Try the 5-4-3-2-1 grounding technique when feeling overwhelmed.', completed: false },
        ]
    },
    {
        id: 'completed-2',
        counsellor: counsellors[2],
        date: getPastDate(14),
        time: '09:00 AM',
        status: 'completed',
        sessionNotes: 'Focused on mindfulness and being present. It was helpful to disconnect from distracting thoughts.',
        actionItems: [
            { id: 1, text: 'Go for a 15-minute walk without my phone each day.', completed: true },
            { id: 2, text: 'Listen to a guided meditation before bed.', completed: false },
        ]
    }
];

// --- Confirmation Modal Component ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, theme }) => {
    const { t } = useLanguage();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className={`${theme.colors.card} max-w-sm w-full mx-4 border-0 shadow-2xl`}>
                <CardContent className="p-8">
                    <h2 className={`text-2xl font-bold ${theme.colors.text} mb-4`}>{title}</h2>
                    <p className={`${theme.colors.muted} mb-6`}>{message}</p>
                    <div className="flex justify-end space-x-4">
                        <Button onClick={onClose} variant="outline" className="hover:bg-gray-50">{t('cancel')}</Button>
                        <Button onClick={onConfirm} className="bg-gradient-to-r from-red-500 to-red-600 hover:bg-red-600 text-white">{t('confirm')}</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// --- Main Component ---
const StudentAppointments = () => {
    const { theme } = useTheme();
    const { t } = useLanguage();
    
    const [view, setView] = useState('schedule');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedCounsellor, setSelectedCounsellor] = useState(counsellors[0]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [step, setStep] = useState(1);
    const [notes, setNotes] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [preparationGuide, setPreparationGuide] = useState('');
    const [isGuideGenerating, setIsGuideGenerating] = useState(false);
    const [bookedAppointments, setBookedAppointments] = useState(initialAppointments);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState(null);
    const [goalInput, setGoalInput] = useState({});
    // removed isBreakingDownGoal - 'Break It Down' feature removed
    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [mobileShowTimeSelection, setMobileShowTimeSelection] = useState(false);
    const [expandedAppointments, setExpandedAppointments] = useState({});

    // Persist view state so refresh keeps the same section
    useEffect(() => {
        try {
            const saved = localStorage.getItem('student_appointments_view');
            if (saved) setView(saved);
        } catch (e) {}
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('student_appointments_view', view);
        } catch (e) {}
    }, [view]);

    useEffect(() => {
        const now = new Date();
        const updatedAppointments = bookedAppointments.map(app => {
            if (app.status === 'upcoming' && app.date < now) {
                return { ...app, status: 'completed' };
            }
            return app;
        });
        setBookedAppointments(updatedAppointments);
    }, []);

    const firstDayOfMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), [currentDate]);
    const daysInMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(), [currentDate]);

    const callEmergentAPI = async (prompt) => {
        const apiKey = "sk-emergent-1C7AcEfAeFeCa44AaE";
        const apiUrl = "https://api.emergentmind.com/v1/chat/completions";
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 500
                }),
            });

            if (response.ok) {
                const result = await response.json();
                return result.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response right now.";
            }
        } catch (error) {
            console.error("Emergent API call error:", error);
        }
        return "Sorry, there was an issue connecting to the AI service.";
    };

    const handleGenerateNotes = async () => {
        setIsGenerating(true);
        const prompt = "Act as a helpful assistant for a student scheduling a counseling session. Generate 3-4 bullet points for session notes related to common student challenges like academic stress, feeling overwhelmed, or managing relationships. The tone should be encouraging. Start with 'Here are a few ideas to get you started:'";
        const generatedNotes = await callEmergentAPI(prompt);
        setNotes(generatedNotes);
        setIsGenerating(false);
    };

    const handleGeneratePrepGuide = async () => {
        setIsGuideGenerating(true);
        setPreparationGuide('');
        const prompt = `Act as a caring counselor. A student booked a session on "${selectedCounsellor.specialty}". Their notes are: "${notes || 'No notes provided'}". Generate a short, encouraging preparation guide with 2-3 gentle reflection questions. The tone should be warm and reassuring.`;
        const generatedGuide = await callEmergentAPI(prompt);
        setPreparationGuide(generatedGuide);
        setIsGuideGenerating(false);
    };

    const handleBookAppointment = () => {
        const newAppointment = {
            id: `appointment-${Date.now()}`,
            counsellor: selectedCounsellor,
            date: selectedDate,
            time: selectedTime,
            status: 'upcoming',
            sessionNotes: notes,
            actionItems: []
        };
        
        setBookedAppointments([...bookedAppointments, newAppointment]);
        
        // Reset form
        setStep(1);
        setNotes('');
        setSelectedTime(null);
        setPreparationGuide('');
        
        // Switch to appointments view
        setView('appointments');
    };

    // 'Break It Down' handler removed per design change

    const toggleActionItem = (appointmentId, itemId) => {
        const updatedAppointments = bookedAppointments.map(app =>
            app.id === appointmentId
                ? {
                    ...app,
                    actionItems: app.actionItems.map(item =>
                        item.id === itemId ? { ...item, completed: !item.completed } : item
                    )
                }
                : app
        );
        setBookedAppointments(updatedAppointments);
    };

    const handleDateClick = (day) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        if (newDate >= new Date(new Date().setDate(new Date().getDate() - 1))) {
            setSelectedDate(newDate);
            setSelectedTime(null);
        }
    };

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const renderCalendar = () => {
        const calendarDays = [];
        const today = new Date();
        const startDay = firstDayOfMonth.getDay();
        
        for (let i = 0; i < startDay; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="p-2"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const isPast = date < new Date(today.setHours(0, 0, 0, 0));

            calendarDays.push(
                <div
                    key={day}
                    className={`text-center p-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 ${
                        isPast
                            ? 'text-gray-400 cursor-not-allowed'
                            : isSelected
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg'
                                : isToday
                                    ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 font-semibold'
                                    : 'hover:bg-cyan-100'
                    }`}
                    onClick={() => !isPast && handleDateClick(day)}
                >
                    {day}
                </div>
            );
        }
        return calendarDays;
    };

    const upcomingAppointments = bookedAppointments.filter(app => app.status === 'upcoming');
    const completedAppointments = bookedAppointments.filter(app => app.status === 'completed');

    // Navigation Tabs with uniform SensEase colors
    const renderTabs = () => (
        <div className="flex justify-center mb-8">
            <div className="flex space-x-2 bg-gray-200 p-1 rounded-full">
                <Button 
                    onClick={() => setView('schedule')} 
                    className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                        view === 'schedule' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : `${theme.colors.muted} hover:bg-cyan-50`
                    }`}
                >
                    {t('bookAppointment')}
                </Button>
                <Button 
                    onClick={() => setView('appointments')} 
                    className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                        view === 'appointments' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : `${theme.colors.muted} hover:bg-cyan-50`
                    }`}
                >
                    {t('myAppointments')}
                </Button>
                <Button 
                    onClick={() => setView('goals')} 
                    className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                        view === 'goals' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' : `${theme.colors.muted} hover:bg-cyan-50`
                    }`}
                >
                    {t('sessionGoals')}
                </Button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <Card className={`${theme.colors.card} border-0 shadow-2xl`}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className={`${theme.colors.text} text-xl sm:text-2xl`}>
                            {t('appointmentManagement')}
                        </CardTitle>
                        {/* Calendar dropdown for mobile and tablet only */}
                        <div className="relative lg:hidden">
                            <button 
                                onClick={() => setShowCalendarModal(!showCalendarModal)}
                                className="p-2 rounded-lg bg-cyan-100 hover:bg-cyan-200 transition-colors"
                                title="Pick a date"
                            >
                                <CalendarIcon className="w-5 h-5 text-cyan-600" />
                            </button>
                            
                            {showCalendarModal && (
                                <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg border rounded-lg p-4 z-40 w-80">
                                    <div className="flex items-center justify-between mb-4">
                                        <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                            <ChevronLeftIcon className="w-5 h-5" />
                                        </button>
                                        <h4 className={`font-bold ${theme.colors.text}`}>
                                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        </h4>
                                        <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                            <ChevronRightIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-7 gap-2 text-center font-medium text-gray-500 mb-2 text-xs">
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                            <div key={day}>{day}</div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Mobile quick actions: three tappable options */}
                    <div className="lg:hidden mb-4">
                        <div className="grid grid-cols-3 gap-3">
                            <button onClick={() => setView('schedule')} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-3 rounded-lg text-xs text-center">
                                {t('bookAppointment')}
                            </button>
                            <button onClick={() => setView('appointments')} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-3 rounded-lg text-xs text-center">
                                {t('myAppointments')}
                            </button>
                            <button onClick={() => setView('goals')} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-3 rounded-lg text-xs text-center">
                                {t('sessionGoals')}
                            </button>
                        </div>
                    </div>

                    <div className="hidden lg:block">{renderTabs()}</div>

                    {view === 'schedule' && step === 1 && (
                        <div className="space-y-8">

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Counselor Selection */}
                                <div className="space-y-6">
                                    <h3 className={`text-xl font-semibold ${theme.colors.text}`}>1. {t('chooseYourCounselor')}</h3>
                                    {/* Counselor selection cards */}
                                    <div className="space-y-4">
                                        {counsellors.map((counsellor) => (
                                            <div
                                                key={counsellor.id}
                                                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                                                    selectedCounsellor.id === counsellor.id
                                                        ? 'border-cyan-500 bg-cyan-50'
                                                        : 'border-gray-200 hover:border-cyan-300'
                                                }`}
                                                onClick={() => {
                                                    setSelectedCounsellor(counsellor);
                                                    // On mobile, after selecting a counsellor, reveal time + notes selector
                                                    try {
                                                        if (window?.innerWidth && window.innerWidth < 1024) {
                                                            setMobileShowTimeSelection(true);
                                                            setSelectedTime(null);
                                                        }
                                                    } catch (e) {
                                                        // fallback: do nothing
                                                    }
                                                }}
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <img src={counsellor.imageUrl} alt={counsellor.name} className="w-16 h-16 rounded-full" />
                                                    <div className="flex-1">
                                                        <h4 className={`font-bold ${theme.colors.text}`}>{counsellor.name}</h4>
                                                        <p className={`${theme.colors.muted} text-sm`}>{counsellor.specialty}</p>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {counsellor.availableSlots.slice(0, 3).map((slot, index) => (
                                                                <Badge key={index} variant="outline" className="text-xs border-cyan-300 text-cyan-700">
                                                                    {slot}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Calendar and Time Selection (desktop only) */}
                                <div className="space-y-6 hidden lg:block">
                                    <h3 className={`text-xl font-semibold ${theme.colors.text}`}>2. {t('selectDateTime')}</h3>
                                    
                                    {/* Calendar */}
                                    <Card className={`${theme.colors.card} shadow-lg`}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <Button onClick={handlePrevMonth} variant="outline" size="sm" className="hover:bg-cyan-50">
                                                    <ChevronLeftIcon />
                                                </Button>
                                                <h4 className={`font-bold text-lg ${theme.colors.text}`}>
                                                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                                </h4>
                                                <Button onClick={handleNextMonth} variant="outline" size="sm" className="hover:bg-cyan-50">
                                                    <ChevronRightIcon />
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-7 gap-2 text-center font-medium text-gray-500 mb-2 text-sm">
                                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                                    <div key={day}>{day}</div>
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
                                        </CardContent>
                                    </Card>

                                    {/* Time Selection */}
                                    <div>
                                        <h4 className={`font-semibold ${theme.colors.text} mb-3`}>{t('availableTimes')}</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {selectedCounsellor.availableSlots.map((time) => (
                                                <Button
                                                    key={time}
                                                    onClick={() => { setSelectedTime(time); if (!selectedCounsellor) setSelectedCounsellor(counsellors[0]); }}
                                                    className={`p-3 transition-all duration-200 ${
                                                        selectedTime === time
                                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-cyan-100 hover:text-cyan-700'
                                                    }`}
                                                >
                                                    {time}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile: show time selection & notes after counsellor tap */}
                                <div className="md:hidden">
                                    {mobileShowTimeSelection && (
                                        <div className="space-y-4 p-3 bg-white rounded-lg border border-gray-200">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <button onClick={() => setShowCalendarModal(true)} className="p-2 rounded-md bg-gray-100 mr-2">
                                                        <CalendarIcon className="w-6 h-6 text-cyan-600" />
                                                    </button>
                                                    <img src={selectedCounsellor.imageUrl} alt={selectedCounsellor.name} className="w-12 h-12 rounded-full" />
                                                    <div>
                                                        <div className={`font-semibold ${theme.colors.text}`}>{selectedCounsellor.name}</div>
                                                        <div className={`${theme.colors.muted} text-sm`}>{selectedCounsellor.specialty}</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <button onClick={() => setMobileShowTimeSelection(false)} className="text-sm text-gray-500">{t('back')}</button>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="mb-2">
                                                    <div className="text-xs text-gray-400 mb-1">{t('selectAvailableTime')}</div>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {selectedCounsellor.availableSlots.map((time) => (
                                                            <button
                                                                key={time}
                                                                onClick={() => { setSelectedTime(time); if (!selectedCounsellor) setSelectedCounsellor(counsellors[0]); }}
                                                                className={`text-sm p-3 rounded-lg border transition-colors ${
                                                                    selectedTime === time
                                                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent'
                                                                        : 'bg-gray-100 text-gray-700 border-gray-200'
                                                                }`}
                                                            >
                                                                {time}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {selectedTime && (
                                                    <div className="flex items-center justify-between mt-2">
                                                        <div className="text-sm text-gray-700">{t('selectedTime')}: <span className="font-medium">{selectedTime}</span></div>
                                                        <div className="text-xs text-gray-400">{selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                                                    </div>
                                                )}

                                                <div className="mt-3">
                                                    <textarea
                                                        value={notes}
                                                        onChange={(e) => setNotes(e.target.value)}
                                                        rows={3}
                                                        placeholder={t('sessionNotesPlaceholder')}
                                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                                                    />
                                                </div>

                                                {/* Proceed button removed from mobile panel — use the single Proceed at the end of the form */}
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>

                            {/* Your Intent - Desktop Only - Full Width */}
                            <div className="space-y-6 hidden lg:block">
                                <h3 className={`text-xl font-semibold ${theme.colors.text}`}>3. {t('yourIntent')}</h3>
                                <Card className={`${theme.colors.card} shadow-lg`}>
                                    <CardContent className="p-4">
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder={t('sessionNotesPlaceholder')}
                                            rows={5}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                        />
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="flex justify-end pt-6 border-t">
                                <Button
                                    onClick={() => setStep(2)}
                                    disabled={!selectedTime}
                                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                                >
                                    {t('proceedToConfirmation')}
                                </Button>
                            </div>
                        </div>
                    )}

                    {view === 'schedule' && step === 2 && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className={`text-3xl font-bold ${theme.colors.text} mb-2`}>{t('confirmYourAppointment')}</h2>
                                <p className={`${theme.colors.muted} text-lg`}>{t('reviewBookingDetails')}</p>
                            </div>

                            <Card className={`${theme.colors.card} shadow-xl border border-cyan-200`}>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <img src={selectedCounsellor.imageUrl} alt={selectedCounsellor.name} className="w-16 h-16 rounded-full" />
                                            <div>
                                                <h3 className={`font-bold text-xl ${theme.colors.text}`}>{selectedCounsellor.name}</h3>
                                                <p className={`${theme.colors.muted}`}>{selectedCounsellor.specialty}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 py-4 border-t">
                                            <div className="flex items-center space-x-2">
                                                <CalendarIcon className="w-5 h-5 text-cyan-500" />
                                                <span className={theme.colors.text}>
                                                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <ClockIcon className="w-5 h-5 text-cyan-500" />
                                                <span className={theme.colors.text}>{selectedTime}</span>
                                            </div>
                                        </div>

                                        {notes && (
                                            <div className="pt-4 border-t">
                                                <h4 className={`font-semibold ${theme.colors.text} mb-2`}>Your Notes:</h4>
                                                <p className={`${theme.colors.muted} bg-gray-50 p-3 rounded-lg`}>{notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-between pt-6 border-t">
                                <Button
                                    onClick={() => setStep(1)}
                                    variant="outline"
                                    className="hover:bg-gray-50"
                                >
                                    {t('backToEdit')}
                                </Button>
                                <Button
                                    onClick={handleBookAppointment}
                                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                >
                                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                                    {t('confirmBooking')}
                                </Button>
                            </div>
                        </div>
                    )}

                    {view === 'appointments' && (
                        <div className="space-y-8">

                            {/* Upcoming Appointments */}
                            <div>
                                <h3 className={`text-2xl font-bold ${theme.colors.text} mb-6 flex items-center`}>
                                    <ClockIcon className="w-6 h-6 mr-2 text-cyan-500" />
                                    {t('sessions') || t('upcomingSessions')}
                                </h3>
                                <div className="space-y-4">
                                    {upcomingAppointments.length > 0 ? upcomingAppointments.map(app => (
                                        <Card key={app.id} className={`${theme.colors.card} shadow-md border-0`}>
                                            <CardContent className="p-4">
                                                <div>
                                                    <button className="w-full text-left" onClick={() => setExpandedAppointments(prev => ({ ...prev, [app.id]: !prev[app.id] }))}>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-3">
                                                                <img src={app.counsellor.imageUrl} alt={app.counsellor.name} className="w-12 h-12 rounded-full" />
                                                                <div>
                                                                    <div className={`font-semibold ${theme.colors.text}`}>{app.counsellor.name}</div>
                                                                    <div className={`text-sm ${theme.colors.muted}`}>{app.time}</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-xs text-gray-400">{app.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                                                        </div>
                                                    </button>

                                                    {expandedAppointments[app.id] && (
                                                        <div className="mt-3">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <Badge className="bg-cyan-100 text-cyan-700">{t('confirmed')}</Badge>
                                                                <div className="flex items-center space-x-2">
                                                                    <Button
                                                                        onClick={() => { setAppointmentToCancel(app.id); setShowCancelModal(true); }}
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="text-red-600 hover:bg-red-50 hover:border-red-300"
                                                                    >
                                                                        <TrashIcon className="w-4 h-4 mr-1" />
                                                                        {t('cancel')}
                                                                    </Button>
                                                                </div>
                                                            </div>

                                                            {app.sessionNotes && (
                                                                <div className="mt-2 p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                                                                    <p className="text-sm text-gray-700">{app.sessionNotes}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )) : (
                                        <div className={`text-center py-12 bg-gradient-to-r ${theme.colors.secondary} rounded-2xl`}>
                                            <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <p className={`${theme.colors.muted} text-lg`}>{t('noUpcomingAppointments')}</p>
                                            <Button
                                                onClick={() => setView('schedule')}
                                                className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                                            >
                                                {t('bookYourFirstSession')}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Past Appointments */}
                            <div>
                                <h3 className={`text-2xl font-bold ${theme.colors.text} mb-6 flex items-center`}>
                                    <CheckCircleIcon className="w-6 h-6 mr-2 text-green-500" />
                                    {t('pastSessions')}
                                </h3>
                                <div className="space-y-4">
                                    {completedAppointments.length > 0 ? completedAppointments.map(app => (
                                        <Card key={app.id} className={`${theme.colors.card} shadow-md border-0`}>
                                            <CardContent className="p-4">
                                                <div>
                                                    <button className="w-full text-left" onClick={() => setExpandedAppointments(prev => ({ ...prev, [app.id]: !prev[app.id] }))}>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-3">
                                                                <img src={app.counsellor.imageUrl} alt={app.counsellor.name} className="w-12 h-12 rounded-full" />
                                                                <div>
                                                                    <div className={`font-semibold ${theme.colors.text}`}>Session with {app.counsellor.name}</div>
                                                                    <div className={`text-sm ${theme.colors.muted}`}>{app.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} • {app.time}</div>
                                                                </div>
                                                            </div>
                                                            <Badge className="bg-green-100 text-green-800">{t('completed')}</Badge>
                                                        </div>
                                                    </button>

                                                    {expandedAppointments[app.id] && (
                                                        <div className="mt-3">
                                                            {app.sessionNotes && (
                                                                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                                                    <h5 className="font-semibold text-green-800 mb-2">Session Notes:</h5>
                                                                    <p className="text-sm text-green-700">{app.sessionNotes}</p>
                                                                </div>
                                                            )}

                                                            {/* action items intentionally removed for past sessions */}
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )) : (
                                        <div className={`text-center py-12 bg-gradient-to-r ${theme.colors.secondary} rounded-2xl`}>
                                            <CheckCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <p className={`${theme.colors.muted} text-lg`}>{t('noPastSessionsYet')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {view === 'goals' && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h2 className={`text-2xl sm:text-3xl font-bold ${theme.colors.text} mb-2`}>{t('sessionGoals')}</h2>
                                <p className={`${theme.colors.muted} text-sm sm:text-base`}>Track tasks assigned by your counselor and mark them as complete</p>
                            </div>

                            {completedAppointments.length > 0 ? (
                                <div className="space-y-6">
                                    {completedAppointments.map(app => (
                                        app.actionItems.length > 0 && (
                                            <Card key={app.id} className={`${theme.colors.card} shadow-lg border-0`}>
                                                <CardHeader>
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h4 className={`font-bold text-lg sm:text-xl ${theme.colors.text}`}>
                                                                {app.counsellor.name}
                                                            </h4>
                                                            <p className={`${theme.colors.muted} text-xs sm:text-sm`}>
                                                                {app.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {app.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-3">
                                                        <h5 className={`font-semibold ${theme.colors.text} text-sm sm:text-base`}>Action Items:</h5>
                                                        {app.actionItems.map(item => (
                                                            <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={item.completed}
                                                                    onChange={() => toggleActionItem(app.id, item.id)}
                                                                    className="w-5 h-5 text-cyan-600 bg-white border-gray-300 rounded focus:ring-cyan-500 cursor-pointer"
                                                                />
                                                                <span className={`flex-1 text-sm sm:text-base ${item.completed ? `line-through ${theme.colors.muted}` : theme.colors.text}`}>
                                                                    {item.text}
                                                                </span>
                                                                {item.completed && (
                                                                    <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )
                                    ))}
                                </div>
                            ) : (
                                <div className={`text-center py-12 bg-gradient-to-r ${theme.colors.secondary} rounded-2xl`}>
                                    <CheckCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className={`${theme.colors.muted} text-lg`}>No completed sessions with action items yet</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <ConfirmationModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={() => {
                    if (appointmentToCancel) {
                        setBookedAppointments(bookedAppointments.filter(app => app.id !== appointmentToCancel));
                        setAppointmentToCancel(null);
                    }
                    setShowCancelModal(false);
                }}
                title="Cancel Appointment"
                message="Are you sure you want to cancel this appointment?"
                theme={theme}
            />
            {/* Calendar Modal (full calendar) */}
            {showCalendarModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowCalendarModal(false)} />
                    <div className={`relative bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full z-60`}> 
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`font-bold ${theme.colors.text}`}>{t('bookAppointment')}</h3>
                            <button onClick={() => setShowCalendarModal(false)} className="p-2">Close</button>
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-center">{renderCalendar()}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentAppointments;