import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@components/layout/DashboardLayout';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { 
  MessageCircle, 
  ChevronDown,
  Plus,
  Users, 
  Calendar,
  PenTool,
  Bell,
  FileText,
  Brain,
  Heart,
  Smile,
  Activity,
  Sparkles,
  Send,
  Loader
} from 'lucide-react';
import { Mic } from 'lucide-react';
import { mockAnnouncements, mockCommunityChats, mockAppointments } from '@mock/mockData';
import { useAnnouncements } from '@context/AnnouncementContext';
import { generateHistoryTitle } from '@lib/utils';
import WellnessTools from '@components/wellness/WellnessTools';
import AdvancedJournalingView from '@components/wellness/AdvancedJournalingView';
import StudentAppointments from '@components/appointments/StudentAppointments';
import CommunityView from '@components/community/CommunityView';
import AudioSection from '@components/wellness/AudioSection';
import AssessmentDashboard from '@components/assessment/AssessmentDashboard';
import DirectMessages from '@components/community/DirectMessages';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { getRecentAnnouncements, incrementViews } = useAnnouncements();

  // Chatbot state
  // Start with no initial bot message on mobile; only add greeting for md+ screens
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Persist active tab so refresh keeps the same section
  useEffect(() => {
    try {
      const saved = localStorage.getItem('student_active_tab');
      if (saved) setActiveTab(saved);
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('student_active_tab', activeTab);
    } catch (e) {}
  }, [activeTab]);

  // Load chat history for student chatbot
  useEffect(() => {
    try {
      const raw = localStorage.getItem('student_ai_history_v1');
      if (raw) setChatHistory(JSON.parse(raw));
    } catch (e) {
      console.warn('Failed to load student chat history', e);
    }
  }, []);

  useEffect(() => {
    // Add initial bot greeting only for tablet/desktop (md+)
    const greeting = {
      id: 1,
      text: "Hello! I'm your SensEase AI wellness companion. How are you feeling today? I'm here to listen and support you on your wellness journey. 💙",
      isBot: true,
      timestamp: new Date()
    };

    try {
      if (window?.innerWidth >= 1024 && messages.length === 0) {
        setMessages([greeting]);
      }
    } catch (e) {
      // fallback: ensure greeting is present if code runs in unknown env
      if (messages.length === 0) setMessages([greeting]);
    }
  }, []);

  const persistHistory = (history) => {
    try {
      localStorage.setItem('student_ai_history_v1', JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save student chat history', e);
    }
  };

  const handleNewStudentChat = () => {
    // Save current conversation to history if non-empty
    if (messages && messages.length > 0) {
      const entry = {
        id: `s${Date.now()}`,
        title: generateHistoryTitle(messages, 3),
        messages: messages
      };
      const next = [entry, ...chatHistory].slice(0, 50);
      setChatHistory(next);
      persistHistory(next);
    }
    // Clear current messages and input
    setMessages([]);
    setInput('');
    setShowHistoryPanel(false);
  };

  const handleLoadHistory = (entry) => {
    setMessages(entry.messages || []);
    setShowHistoryPanel(false);
  };

  const handleDeleteHistory = (id) => {
    const next = chatHistory.filter(h => h.id !== id);
    setChatHistory(next);
    persistHistory(next);
  };

  // Free AI API call using Groq
  const callGroqAPI = async (userMessage) => {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with your actual key
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a supportive and empathetic mental health companion for students. Provide caring, helpful responses that are encouraging but not overly clinical. Keep responses conversational, warm, and under 100 words. Focus on emotional support and practical wellness tips.'
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || getWellnessResponse(userMessage);
  } catch (error) {
    console.error('Groq API Error:', error);
    return getWellnessResponse(userMessage);
  }
};

  // Fallback wellness-focused responses (works without API)
  const getWellnessResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    const wellnessResponses = {
      anxiety: [
        "I understand anxiety can feel overwhelming. Let's try a simple breathing exercise: breathe in for 4 counts, hold for 4, and breathe out for 6. Would you like to tell me more about what's making you feel anxious?",
        "Anxiety is very common, and you're not alone in feeling this way. Sometimes it helps to ground yourself - can you name 5 things you can see, 4 things you can touch, 3 things you can hear?",
        "I hear that you're feeling anxious. Remember that these feelings are temporary. What usually helps you feel more calm and centered?"
      ],
      stress: [
        "Stress can really weigh on us. Have you tried any stress management techniques lately? Sometimes even a 5-minute walk or some gentle stretching can help reset our mood.",
        "I can sense you're dealing with stress right now. What's been the biggest source of stress for you lately? Sometimes talking through it can help lighten the load.",
        "Stress affects us all differently. Are you getting enough rest and taking care of your basic needs? Sometimes stress feels worse when we're tired or haven't eaten properly."
      ],
      sad: [
        "I'm sorry you're feeling sad. Your feelings are valid, and it's okay to have difficult days. What's been on your mind lately?",
        "Sadness is a natural human emotion, though I know it doesn't feel good right now. Is there something specific that's been troubling you?",
        "Thank you for sharing that with me. When you're feeling sad, what are some small things that usually bring you a bit of comfort?"
      ],
      happy: [
        "I'm so glad to hear you're feeling good today! What's been going well for you lately?",
        "That's wonderful! It's great when we can appreciate the positive moments. What's bringing you joy right now?",
        "Your positive energy is lovely to hear about! Sometimes sharing our good feelings can help them grow even stronger."
      ],
      tired: [
        "Feeling tired can really affect our whole outlook. Have you been getting quality sleep lately, or is this more of an emotional tiredness?",
        "I understand that exhaustion. Sometimes when we're tired, everything feels harder to handle. Are you able to rest?",
        "Being tired can make everything feel more challenging. What does rest and recovery look like for you?"
      ]
    };

    // Simple keyword matching
    for (const [emotion, responses] of Object.entries(wellnessResponses)) {
      if (message.includes(emotion) || 
          (emotion === 'sad' && (message.includes('down') || message.includes('depressed') || message.includes('low'))) ||
          (emotion === 'happy' && (message.includes('good') || message.includes('great') || message.includes('amazing'))) ||
          (emotion === 'tired' && (message.includes('exhausted') || message.includes('drained')))) {
        
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }

    // General supportive responses
    const generalResponses = [
      "Thank you for sharing that with me. I'm here to listen. Can you tell me more about how you're feeling?",
      "I appreciate you opening up. Your mental health journey is important. What would be most helpful for you right now?",
      "It sounds like you have a lot on your mind. Sometimes it helps just to have someone listen. What's been the most challenging part of your day?",
      "I'm glad you're taking time to check in with yourself. Self-awareness is a big step in wellness. How can I best support you today?",
      "Every feeling you have is valid. What's one small thing that might help you feel a bit better right now?",
      "I hear you. Sometimes the first step is just acknowledging how we feel. What kind of support would be most meaningful to you today?"
    ];

    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    const newUserMessage = {
      id: Date.now(),
      text: userMessage,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Get AI response (tries API first, falls back to local)
      const botResponse = await callGroqAPI(userMessage);
      
      // Add bot response
      const newBotMessage = {
        id: Date.now() + 1,
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting right now, but I'm still here for you. Please try again in a moment. In the meantime, remember that you're not alone in this. 💙",
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setIsLoading(false);
  };

  // Voice recording (student)
  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Audio recording is not supported in this browser.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Select a supported mimeType for MediaRecorder when possible
      let options = {};
      try {
        if (window.MediaRecorder && MediaRecorder.isTypeSupported) {
          if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) options.mimeType = 'audio/webm;codecs=opus';
          else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) options.mimeType = 'audio/ogg;codecs=opus';
          else if (MediaRecorder.isTypeSupported('audio/webm')) options.mimeType = 'audio/webm';
        }
      } catch (e) {
        // ignore mime detection failures
      }

      const mr = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mr;
      const chunks = [];

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      mr.onerror = (err) => {
        console.error('MediaRecorder error', err);
      };

      mr.onstop = () => {
        try {
          const mime = options.mimeType || 'audio/webm';
          const blob = new Blob(chunks, { type: mime });
          const url = URL.createObjectURL(blob);
          const audioMsg = { id: Date.now(), isBot: false, audioUrl: url, timestamp: new Date() };
          setMessages(prev => [...prev, audioMsg]);
        } catch (e) {
          console.error('Failed to create audio blob', e);
        } finally {
          // stop tracks
          try {
            stream.getTracks().forEach(t => t.stop());
          } catch (ee) {}
          streamRef.current = null;
          mediaRecorderRef.current = null;
          setIsRecording(false);
        }
      };

      mr.start();
      setIsRecording(true);
    } catch (e) {
      console.error('Recording failed', e);
      setIsRecording(false);
      try { if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop()); } catch (er) {}
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // quickResponses removed to avoid pre-filled messages on mobile

  const sidebarContent = (
    <nav className="space-y-2">
      {[
        { key: 'overview', icon: Activity, label: t('overview') },
        { key: 'chatbot', icon: MessageCircle, label: t('aiCompanion') },
        { key: 'community', icon: Users, label: t('community') },
        { key: 'appointments', icon: Calendar, label: t('appointments') },
        { key: 'messages', icon: MessageCircle, label: t('messagesLabel') },
        { key: 'journaling', icon: PenTool, label: t('journaling') },
        { key: 'assessments', icon: FileText, label: t('assessments') },
        { key: 'audios' , icon: Activity , label: t('audios')} ,
        { key: 'resources', icon: Brain, label: t('wellnessTools') }
      ].map(({ key, icon: Icon, label }) => (
        <Button
          key={key}
          variant={activeTab === key ? 'default' : 'ghost'}
          className={`w-full justify-start transition-all duration-200 hover:scale-105 ${
            activeTab === key 
              ? `bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg font-semibold` 
              : `hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 ${theme.colors.text} hover:text-cyan-700`
          }`}
          onClick={() => setActiveTab(key)}
        >
          <Icon className="w-4 h-4 mr-2" />
          {label}
        </Button>
      ))}
    </nav>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-4xl font-bold ${theme.colors.text} flex items-center`}>
            {t('sensEase')}
            <Sparkles className="w-8 h-8 ml-2 text-yellow-500 animate-spin" style={{ animationDuration: '3s' }} />
          </h2>
          {/* hide tagline / "mental health & support" lines on mobile */}
          <p className={`${theme.colors.muted} mt-2 text-lg hidden md:block`}>{t('tagline')} - {t('howFeeling')}</p>
        </div>
        {/* quick chat button removed per request */}
      </div>

      {/* Enhanced Quick Mood Check */}
      {/* <Card className={`${theme.colors.card} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]`}>
        <CardHeader>
          <CardTitle className={`flex items-center ${theme.colors.text}`}>
            <Smile className="w-6 h-6 mr-2 text-yellow-500" />
            Quick Mood Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center space-x-4">
            {['😢', '😕', '😊', '😄', '🤗'].map((emoji, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-3xl w-16 h-16 hover:scale-125 transition-all duration-300 hover:shadow-lg border-2 hover:border-cyan-300"
                onClick={() => {
                  setActiveTab('chatbot');
                  // Auto-populate mood message
                  const moodMessages = [
                    "I'm feeling really sad today",
                    "I'm feeling a bit down",
                    "I'm feeling okay today",
                    "I'm feeling great today!",
                    "I'm feeling amazing and grateful!"
                  ];
                  setTimeout(() => setInput(moodMessages[index]), 500);
                }}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card> */}

      {/* Enhanced Quick Actions
          - Mobile: horizontally scrollable small boxes (swipe sideways)
          - md+: grid layout (2x2 or 4 columns as screen grows)
      */}
      {/* Tools: keep static 2x2 boxes on mobile (no horizontal scroll) and larger grid on md+ */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key: 'chatbot', icon: MessageCircle, color: 'text-cyan-500', label: t('aiCompanion'), desc: t('chatWithWellnessCompanion') },
          { key: 'resources', icon: Brain, color: 'text-purple-500', label: t('wellnessTools'), desc: t('accessWellnessResources') },
          { key: 'journaling', icon: PenTool, color: 'text-green-500', label: t('journaling'), desc: t('trackThoughts') },
          { key: 'appointments', icon: Calendar, color: 'text-orange-500', label: t('bookSession'), desc: t('scheduleCounselling') }
        ].map(({ key, icon: Icon, color, label, desc }) => (
          <Card 
            key={key}
            className={`${theme.colors.card} hover:shadow-2xl transition-all duration-200 cursor-pointer hover:scale-105 border-0 group py-4`}
            onClick={() => setActiveTab(key)}
          >
            <CardContent className="p-4 text-center">
              <Icon className={`w-8 h-8 mx-auto mb-2 ${color}`} />
              <h3 className={`font-semibold text-sm ${theme.colors.text} truncate`}>{label}</h3>
              <p className={`text-sm ${theme.colors.muted} mt-1 hidden md:block`}>{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Recent Announcements: mobile shows compact chat-list rows, desktop keeps original card layout */}
      <Card className={`${theme.colors.card} border-0 shadow-xl`}>
        <CardHeader>
          <CardTitle className={`flex items-center ${theme.colors.text}`}>
            <Bell className="w-6 h-6 mr-2 text-orange-500 animate-pulse" />
            {t('recentUpdates')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mobile / Tablet compact list */}
          <div className="md:hidden">
            {getRecentAnnouncements(10).length === 0 ? (
              <div className="text-center py-6">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className={`${theme.colors.muted} text-sm`}>
                  No recent announcements.
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {getRecentAnnouncements(10).map((announcement) => (
                  <div
                    key={announcement.id}
                    className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                    onClick={() => incrementViews(announcement.id)}
                  >
                    <div className="flex items-start space-x-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-gray-700">
                        {announcement.title?.split(' ').map(s=>s[0]).slice(0,2).join('')}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-semibold truncate ${theme.colors.text}`}>{announcement.title}</h4>
                          <span className={`text-xs ${theme.colors.muted} ml-2 whitespace-nowrap`}>{announcement.date}</span>
                        </div>
                        <p className={`text-sm ${theme.colors.muted} truncate mt-1`}>{announcement.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Desktop: keep original rich layout */}
          <div className="hidden md:block">
            <div className="space-y-4">
              {getRecentAnnouncements(3).length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className={`${theme.colors.muted} text-lg`}>
                    No recent announcements. Check back later!
                  </p>
                </div>
              ) : (
                getRecentAnnouncements(3).map((announcement) => (
                  <div 
                    key={announcement.id} 
                    className={`flex items-start space-x-4 p-4 bg-gradient-to-r ${theme.colors.secondary} rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
                    onClick={() => incrementViews(announcement.id)}
                  >
                    <div className="flex-1">
                      <h4 className={`font-semibold ${theme.colors.text}`}>{announcement.title}</h4>
                      <p className={`text-sm ${theme.colors.muted} mt-1`}>{announcement.content}</p>
                      <p className={`text-xs ${theme.colors.muted} mt-2`}>{announcement.date}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                        New
                      </Badge>
                      <span className={`text-xs ${theme.colors.muted}`}>
                        {announcement.views} views
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ENHANCED CHATBOT RENDER FUNCTION
  const renderChatbot = () => (
    <Card className={`h-[700px] flex flex-col ${theme.colors.card} border-0 shadow-2xl`}>
      <CardHeader>
        <div className="w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <MessageCircle className="w-6 h-6 mr-2 text-cyan-500" />
              <CardTitle className={`${theme.colors.text} mb-0`}>{t('aiCompanion')}</CardTitle>
              <Sparkles className="w-5 h-5 ml-2 text-yellow-500 animate-pulse" />
            </div>

            <div className="flex items-center space-x-2">
              <button aria-label="New chat" title={t('newChat') || 'New Chat'} onClick={handleNewStudentChat} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <Plus className="w-5 h-5" />
              </button>

              <div className="relative">
                <button aria-label="Show history" title={t('showHistory') || 'History'} onClick={() => setShowHistoryPanel(s => !s)} className="p-2 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800">
                  <ChevronDown className="w-5 h-5" />
                </button>

                {showHistoryPanel && (
                  <div className="absolute right-0 mt-2 w-80 max-h-72 overflow-auto bg-white dark:bg-gray-800 border rounded-md p-2 z-40">
                    {chatHistory.length === 0 ? (
                      <div className="p-2 text-sm text-gray-500">{t('noConversationsFound') || 'No conversations found'}</div>
                    ) : (
                      chatHistory.map(h => (
                        <div key={h.id} className="flex items-center justify-between p-1 rounded">
                          <button onClick={() => handleLoadHistory(h)} className="flex-1 text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="text-sm font-medium truncate" title={h.title}>{h.title}</div>
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteHistory(h.id); }} aria-label="Delete history" className="ml-2 p-1 rounded hover:bg-red-50 text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <CardDescription className={theme.colors.muted}>
            {t('aiCompanionDesc')}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className={`flex-1 border rounded-xl p-4 bg-gradient-to-br ${theme.colors.secondary} mb-4 overflow-y-auto`}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-md ${message.isBot ? 'text-left' : 'text-right'}`}>
                  <div className={`inline-block p-3 rounded-2xl shadow-lg ${message.isBot ? theme.colors.card : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'}`}>
                    {message.audioUrl ? (
                      <audio controls className="w-56 sm:w-96">
                        <source src={message.audioUrl} />
                        Your browser does not support the audio element.
                      </audio>
                    ) : (
                      <p className={`text-sm ${message.isBot ? theme.colors.text : 'text-white'}`}>{message.text}</p>
                    )}
                  </div>
                  <div className={`text-xs ${theme.colors.muted} mt-1 ${message.isBot ? 'text-left' : 'text-right'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start justify-start">
                <div className={`${theme.colors.card} p-4 rounded-xl shadow-lg`}>
                  <Loader className="w-5 h-5 animate-spin text-cyan-500" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick response buttons removed to prevent pre-filled messages */}

        {/* Input Area */}
        <div className="flex space-x-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('typeYourMessageHere')}
            className={`flex-1 px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 ${theme.colors.card} resize-none`}
            rows="2"
            disabled={isLoading}
          />
          <button
            aria-label={isRecording ? 'Stop recording' : 'Voice message'}
            onClick={() => { isRecording ? stopRecording() : startRecording(); }}
            className={`px-3 rounded-lg ${isRecording ? 'bg-red-100' : 'bg-gray-100 dark:bg-gray-800'}`}
          >
            <Mic className={`w-5 h-5 ${isRecording ? 'text-red-600' : 'text-blue-600'}`} />
          </button>

          <Button 
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg px-6 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        {/* Wellness Tips Footer */}
        <div className={`text-center mt-3 text-xs ${theme.colors.muted}`}>
          {t('wellnessTip')}
        </div>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'chatbot':
        return renderChatbot();
      case 'community':
        return <CommunityView userRole="student" />;
      case 'journaling':
        return <AdvancedJournalingView onBack={() => setActiveTab('overview')} />;
      case 'resources':
        return <WellnessTools />;
      case 'audios' :
        return <AudioSection /> ;
      case 'appointments':
        return <StudentAppointments />;
      case 'assessments':
        return <AssessmentDashboard userRole="student" />;
      case 'messages':
        return <DirectMessages userRole="student" />;
      default:
        return renderOverview();
    }
  };

  return (
    <DashboardLayout sidebarContent={sidebarContent}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default StudentDashboard;