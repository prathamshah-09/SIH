import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Users, 
  BarChart3,
  Bell,
  Activity,
  Shield,
  TrendingUp,
  Globe,
  Cpu,
  HardDrive,
  Wifi,
  Zap,
  Crown,
  Target,
  Award,
  Loader,
  Clock,
  Send,
  Sparkles,
  ChevronDown,
  Plus,
  Mic,
  Trash2,
  FileText
} from 'lucide-react';

import DashboardLayout from '@components/layout/DashboardLayout';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { mockAnalytics } from '@data/mocks/analytics';
import AnnouncementManagement from '@components/admin/AnnouncementManagement';
import FormManagement from '@components/admin/FormManagement';
import CommunityManagement from '@components/community/CommunityManagement';
import UserManagement from '@components/admin/UserManagement';
import AnalyticsModule from '@components/admin/AnalyticsModule';
import ErrorBoundary from '@components/shared/ErrorBoundary';
import { generateHistoryTitle } from '@lib/utils';

const AdminDashboard = () => {

  const [messages, setMessages] = useState([]);
      const [input, setInput] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const messagesEndRef = useRef(null);
      const [showHistoryPanel, setShowHistoryPanel] = useState(false);
      const [chatHistory, setChatHistory] = useState([]);
      const [isRecording, setIsRecording] = useState(false);
      const mediaRecorderRef = useRef(null);
      const streamRef = useRef(null);
    
      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      };
    
      useEffect(() => {
        scrollToBottom();
      }, [messages]);

      // Add initial bot greeting only for tablet/desktop (md+), same behavior as StudentDashboard
      useEffect(() => {
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
          if (messages.length === 0) setMessages([greeting]);
        }
      }, []);

      // Load admin chat history
      useEffect(() => {
        try {
          const raw = localStorage.getItem('admin_ai_history_v1');
          if (raw) setChatHistory(JSON.parse(raw));
        } catch (e) {
          console.warn('Failed to load admin chat history', e);
        }
      }, []);

      const persistHistory = (history) => {
        try {
          localStorage.setItem('admin_ai_history_v1', JSON.stringify(history));
        } catch (e) {
          console.warn('Failed to save admin chat history', e);
        }
      };

      const handleNewAdminChat = () => {
        // Save current conversation to history if non-empty
        if (messages && messages.length > 0) {
          const entry = {
            id: `a${Date.now()}`,
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

      const formatTimestamp = (ts) => {
        try {
          const d = ts instanceof Date ? ts : new Date(ts);
          if (isNaN(d)) return '';
          return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
          return '';
        }
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
    
      const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      };
    
      const quickResponses = [
        "I'm feeling anxious today",
        "I'm having a good day",
        "I'm feeling stressed about school",
        "I need someone to talk to",
        "I'm feeling overwhelmed"
      ];

  const [activeTab, setActiveTab] = useState('overview');
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();

  // Persist active tab so refresh keeps the same section
  useEffect(() => {
    try {
      const saved = localStorage.getItem('admin_active_tab');
      if (saved) setActiveTab(saved);
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('admin_active_tab', activeTab);
    } catch (e) {}
  }, [activeTab]);

  const sidebarContent = (
    <nav className="space-y-2">
      {[
        { key: 'overview', icon: Activity, label: t('overview'), color: 'text-blue-500' },
        { key: 'chatbot', icon: MessageCircle, label: t('aiAssistant'), color: 'text-purple-500' },
        { key: 'analytics', icon: BarChart3, label: t('analytics'), color: 'text-green-500' },
        { key: 'users', icon: Users, label: t('userManagement'), color: 'text-indigo-500' },
        { key: 'community', icon: Shield, label: t('communityManagement'), color: 'text-orange-500' },
        { key: 'announcements', icon: Bell, label: t('announcements'), color: 'text-pink-500' },
        { key: 'forms', icon: FileText, label: 'Form Creation', color: 'text-cyan-500' },
      ].map(({ key, icon: Icon, label, color }) => (
        <Button
          key={key}
          variant={activeTab === key ? 'animated' : 'ghost'}
          className={`w-full justify-start transition-all duration-300 group ${
            activeTab === key 
              ? `` 
              : `hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 ${theme.colors.text}`
          }`}
          onClick={() => setActiveTab(key)}
        >
          <Icon className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'} ${activeTab === key ? 'text-white' : color} group-hover:scale-110 transition-transform`} />
          {label}
        </Button>
      ))}
    </nav>
  );

  const renderOverview = () => (
    <div className="space-y-8 overflow-x-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-4xl font-bold ${theme.colors.text} flex items-center`}>
            {t('adminDashboard')} 
            <Crown className="w-8 h-8 ml-3 text-yellow-500 animate-pulse" />
          </h2>
        </div>
        <div />
      </div>

      {/* Enhanced System Metrics (4 in laptop, 2x2 in mobile/tablet) */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        {[
          { 
            key: 'totalUsers', 
            value: mockAnalytics.totalUsers.toLocaleString(), 
            icon: Users, 
            color: 'from-blue-500 to-cyan-500', 
            bgColor: 'from-blue-50 to-cyan-50',
            change: '+12%',
            changeColor: 'text-green-600'
          },
          { 
            key: 'activeUsers', 
            value: mockAnalytics.activeUsers.toLocaleString(), 
            icon: Activity, 
            color: 'from-green-500 to-emerald-500', 
            bgColor: 'from-green-50 to-emerald-50',
            change: '71% engagement',
            changeColor: 'text-green-600'
          },
          { 
            key: 'totalSessions', 
            value: mockAnalytics.totalSessions.toLocaleString(), 
            icon: TrendingUp, 
            color: 'from-purple-500 to-violet-500', 
            bgColor: 'from-purple-50 to-violet-50',
            change: '+8% this week',
            changeColor: 'text-green-600'
          },
          { 
            key: 'avgSession', 
            value: mockAnalytics.averageSessionDuration, 
            icon: Clock, 
            color: 'from-orange-500 to-pink-500', 
            bgColor: 'from-orange-50 to-pink-50',
            change: '+3 min increase',
            changeColor: 'text-green-600'
          }
        ].map(({ key, value, icon: Icon, color, bgColor, change, changeColor }) => (
          <Card key={key} className={`bg-gradient-to-r ${bgColor} border-0 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group`}>
            <CardContent className="p-4 md:p-6 lg:p-8">
              <div>
                <p className={`text-sm font-semibold ${theme.colors.muted} mb-2`}>{t(key)}</p>
                <p className="text-3xl font-bold text-gray-800 group-hover:scale-105 transition-transform">{value}</p>
                <p className={`text-xs ${changeColor} mt-2 font-medium`}>{change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Platform Analytics — keep Most Used Features only */}
      <Card className={`${theme.colors.card} border-0 shadow-xl hover:shadow-2xl transition-shadow`}>
        <CardHeader>
          <CardTitle className={`flex items-center ${theme.colors.text}`}>
            <BarChart3 className="w-6 h-6 mr-3 text-blue-500" />
            {t('platformAnalytics')}
            <Badge className="ml-3 bg-green-100 text-green-800">{t('liveData')}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className={`font-semibold ${theme.colors.text} mb-4`}>{t('mostUsedFeatures')}</h4>
              <div className="space-y-4">
                {mockAnalytics.mostUsedFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${theme.colors.primary} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                        {index + 1}
                      </div>
                      <span className={`font-medium ${theme.colors.text}`}>{feature.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-3">
                        <div 
                          className={`bg-gradient-to-r ${theme.colors.primary} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${feature.usage}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-semibold ${theme.colors.text} min-w-[3rem]`}>{feature.usage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Alerts removed per request */}
    </div>
  );

  const renderChatbot = () => (
    <Card className={`chat-shell ${theme.colors.card} border-0 shadow-2xl`}>
      <CardHeader className="flex-shrink-0">
        <div className="w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <MessageCircle className="w-6 h-6 mr-2 text-cyan-500" />
              <CardTitle className={`${theme.colors.text} mb-0`}>{t('aiCompanion')}</CardTitle>
              <Sparkles className="w-5 h-5 ml-2 text-yellow-500 animate-pulse" />
            </div>

            <div className="flex items-center space-x-2">
              <button aria-label="New chat" title={t('newChat') || 'New Chat'} onClick={handleNewAdminChat} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
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

      <CardContent className="chat-panel">
        {/* Messages Area */}
        <div className={`chat-messages border rounded-xl bg-gradient-to-br ${theme.colors.secondary}`}>
          <div className="space-y-4 w-full pb-4 px-2 sm:px-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} mb-3`}
              >
                <div className={`flex ${message.isBot ? 'items-start space-x-3' : 'flex-row-reverse items-start space-x-3 space-x-reverse'} max-w-xl w-full`}>
                  {message.isBot && (
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div className={`flex flex-col ${message.isBot ? 'items-start' : 'items-end'} w-full`}>
                    <div className={`inline-block p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow ${
                        message.isBot 
                          ? `${theme.colors.card}` 
                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      }`}>
                        {message.audioUrl ? (
                          <audio controls className="w-56 sm:w-96">
                            <source src={message.audioUrl} />
                            Your browser does not support the audio element.
                          </audio>
                        ) : (
                          <p className={`chat-bubble text-sm ${message.isBot ? theme.colors.text : 'text-white'}`}>
                            {message.text}
                          </p>
                        )}
                      </div>
                    <p className={`text-xs ${theme.colors.muted} mt-1 ${message.isBot ? 'text-left' : 'text-right'}`}>
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </div>

                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start justify-start">
                <div className={`${theme.colors.card} p-4 rounded-xl shadow-lg inline-block`}> <Loader className="w-5 h-5 animate-spin text-cyan-500" /> </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="chat-input-bar bg-white dark:bg-gray-900">
          <div className="chat-input-inner">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('typeYourMessageHere')}
              className={`flex-1 px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 ${theme.colors.card} resize-none text-sm sm:text-base`}
              rows="1"
              disabled={isLoading}
              style={{ minHeight: '40px', maxHeight: '120px' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />

            <button
              aria-label={isRecording ? 'Stop recording' : 'Voice message'}
              onClick={async () => {
                try {
                  if (isRecording) {
                    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop();
                  } else {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    streamRef.current = stream;
                    const mr = new MediaRecorder(stream);
                    mediaRecorderRef.current = mr;
                    const chunks = [];
                    mr.ondataavailable = e => chunks.push(e.data);
                    mr.onstop = () => {
                      const blob = new Blob(chunks, { type: 'audio/webm' });
                      const url = URL.createObjectURL(blob);
                      const audioMsg = { id: Date.now(), isBot: false, audioUrl: url, timestamp: new Date() };
                      setMessages(prev => [...prev, audioMsg]);
                      stream.getTracks().forEach(t => t.stop());
                      streamRef.current = null;
                      mediaRecorderRef.current = null;
                      setIsRecording(false);
                    };
                    mr.start();
                    setIsRecording(true);
                  }
                } catch (e) {
                  console.error('Recording failed', e);
                }
              }}
              className={`w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center rounded-xl transition-all hover:shadow-lg ${isRecording ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              title={isRecording ? 'Stop recording' : 'Voice message'}
            >
              <Mic className={`w-4 h-4 sm:w-5 sm:h-5 ${isRecording ? 'text-white' : 'text-blue-600'}`} />
            </button>

            <Button 
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 sm:w-12 sm:h-12 sm:px-6 flex-shrink-0 bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              title="Send message"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
          </div>
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
      case 'analytics':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className={`text-3xl font-bold ${theme.colors.text} whitespace-nowrap flex items-center`}>
                <BarChart3 className="w-8 h-8 mr-3 text-green-500" />
                {t('platformAnalytics')}
              </h2>
            </div>
            <AnalyticsModule />
          </div>
        );
      case 'community':
        return <CommunityManagement />;
      case 'announcements':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-4xl font-bold ${theme.colors.text} flex items-center`}>
                  {t('announcements')} Hub
                  <Crown className="w-8 h-8 ml-3 text-yellow-500 animate-pulse" />
                </h2>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-8 lg:gap-12 max-w-7xl mx-auto">
              {/* Announcement Management Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                    <div className="text-lg">📣</div>
                  </div>
                  <h2 className={`text-2xl font-semibold ${theme.colors.text}`}>{t('announcements')}</h2>
                </div>
                <AnnouncementManagement />
              </div>
            </div>
          </div>
        );
      case 'forms':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-4xl font-bold ${theme.colors.text} flex items-center`}>
                  Form Creation Hub
                  <FileText className="w-8 h-8 ml-3 text-cyan-500 animate-pulse" />
                </h2>
              </div>
            </div>
            <FormManagement />
          </div>
        );
      case 'users':
        return <UserManagement />;
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

// Wrap default export with an ErrorBoundary to catch runtime render errors
export default function AdminDashboardWithBoundary(props) {
  return (
    <ErrorBoundary>
      <AdminDashboard {...props} />
    </ErrorBoundary>
  );
}