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
  MicOff,
  Trash2,
  FileText,
  User,
  Phone,
  PhoneOff,
  Heart
} from 'lucide-react';

import DashboardLayout from '@components/layout/DashboardLayout';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { mockAnalytics } from '@data/mocks/analytics';
import AnnouncementManagement from '@components/admin/AnnouncementManagement';
import FormManagement from '@components/admin/FormManagement';
import CommunityManagement from '@components/community/CommunityManagement';
import UserManagement from '@components/admin/UserManagement';
import AnalyticsModule from '@components/admin/AnalyticsModule';
import ErrorBoundary from '@components/shared/ErrorBoundary';
import { generateHistoryTitle } from '@lib/utils';

// RealtimeVoice component (copied from StudentDashboard for Voice tab)
const RealtimeVoice = ({ onAddMessage, theme }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState("idle");
  const [transcript, setTranscript] = useState("");
  
  const pcRef = useRef(null);
  const dataChannelRef = useRef(null);
  const audioElementRef = useRef(null);

  const startRealtimeSession = async () => {
    try {
      setIsConnecting(true);
      setStatus("Connecting...");

      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const tokenRes = await fetch(`${backendUrl}/api/student/realtime-session`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });

      if (!tokenRes.ok) throw new Error("Failed to get session token");
      
      const response = await tokenRes.json();
      const { client_secret } = response.data || response;

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      audioElementRef.current = audioEl;

      pc.ontrack = e => {
        audioEl.srcObject = e.streams[0];
      };

      const dc = pc.createDataChannel("oai-events");
      dataChannelRef.current = dc;

      dc.addEventListener("message", e => {
        try {
          const event = JSON.parse(e.data);
          
          if (event.type === "response.audio_transcript.delta") {
            setTranscript(prev => prev + (event.delta || ""));
          }
          
          if (event.type === "response.audio_transcript.done") {
            const fullText = event.transcript || transcript;
            if (fullText) {
              onAddMessage({
                id: Date.now(),
                text: fullText,
                isBot: true,
                timestamp: new Date()
              });
              setTranscript("");
            }
          }

          if (event.type === "response.done") {
            setStatus("Listening...");
          }
        } catch (err) {
          console.error("DataChannel parse error:", err);
        }
      });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      pc.addTrack(stream.getTracks()[0]);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch("https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${client_secret}`,
          "Content-Type": "application/sdp"
        },
        body: offer.sdp
      });

      if (!sdpRes.ok) {
        const errorText = await sdpRes.text();
        console.error("OpenAI SDP error:", errorText);
        throw new Error("Failed to establish session");
      }

      const answerSdp = await sdpRes.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      setIsConnected(true);
      setIsConnecting(false);
      setStatus("Listening...");

      const sessionUpdate = {
        type: "session.update",
        session: {
          modalities: ["text", "audio"],
          instructions: "You are SensEase AI, an empathetic mental health companion. Keep replies short, warm, and supportive.",
          voice: "alloy",
          input_audio_format: "pcm16",
          output_audio_format: "pcm16",
          input_audio_transcription: { model: "whisper-1" },
          turn_detection: { type: "server_vad" }
        }
      };

      if (dc.readyState === "open") {
        dc.send(JSON.stringify(sessionUpdate));
      } else {
        dc.addEventListener("open", () => {
          dc.send(JSON.stringify(sessionUpdate));
        }, { once: true });
      }

    } catch (err) {
      console.error("Realtime session error:", err);
      setStatus("Error: " + err.message);
      setIsConnecting(false);
      stopRealtimeSession();
    }
  };

  const stopRealtimeSession = () => {
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }
    
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    
    if (audioElementRef.current) {
      audioElementRef.current.srcObject = null;
      audioElementRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    setStatus("idle");
    setTranscript("");
  };

  useEffect(() => {
    return () => {
      stopRealtimeSession();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 p-8">
      <div className="text-center space-y-4">
        <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center ${
          isConnected 
            ? "bg-gradient-to-br from-green-400 to-emerald-600 animate-pulse" 
            : "bg-gradient-to-br from-cyan-400 to-blue-600"
        }`}>
          <Phone className="w-16 h-16 text-white" />
        </div>

        <h3 className={`text-2xl font-bold ${theme.colors.text}`}>
          Realtime Voice Assistant
        </h3>

        {status !== "idle" && (
          <p className={`text-lg ${theme.colors.muted}`}>
            {status}
          </p>
        )}

        {transcript && (
          <div className={`mt-4 p-4 rounded-lg ${theme.colors.card} max-w-md`}>
            <p className="text-sm opacity-70">Assistant is speaking:</p>
            <p className="mt-2">{transcript}</p>
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        {!isConnected ? (
          <Button
            onClick={startRealtimeSession}
            disabled={isConnecting}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-6 text-lg"
          >
            {isConnecting ? (
              <>
                <Loader className="w-6 h-6 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Phone className="w-6 h-6 mr-2" />
                Start Voice Session
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={stopRealtimeSession}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-6 text-lg"
          >
            <PhoneOff className="w-6 h-6 mr-2" />
            End Session
          </Button>
        )}
      </div>

      <div className={`text-sm ${theme.colors.muted} text-center max-w-md`}>
        <p>Click "Start" to begin a realtime voice conversation.</p>
        <p className="mt-2">Speak naturally - the AI will respond with voice and text.</p>
      </div>
    </div>
  );
};

const TypingDots = () => (
  <div className="flex items-center space-x-1 pl-2">
    <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-cyan-400" />
    <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-cyan-400 delay-75" />
    <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-cyan-400 delay-150" />
  </div>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();

  // ==== CHATBOT STATE (from StudentDashboard) ====
  const [messages, setMessages] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [chatTab, setChatTab] = useState("chat");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [botIsTyping, setBotIsTyping] = useState(false);
  const [isUsingChatGPT, setIsUsingChatGPT] = useState(false);

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Backend integration
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const userId = typeof window !== "undefined" 
    ? window.localStorage.getItem("sensee_user_id") 
    : null;
  const [conversationId, setConversationId] = useState(null);

  // Load current conversation messages from backend
  useEffect(() => {
    console.log('[AdminDashboard] Loading messages - userId:', userId, 'conversationId:', conversationId);
    
    if (!userId || !conversationId) {
      // Show welcome message if no conversation
      const welcomeMsg = [
        {
          id: 1,
          text: "Hi! I'm your AI companion. How can I help today?",
          isBot: true,
          timestamp: new Date()
        }
      ];
      console.log('[AdminDashboard] Setting welcome message:', welcomeMsg);
      setMessages(welcomeMsg);
      return;
    }

    const loadMessages = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/api/ai/messages?conversationId=${conversationId}&userId=${userId}`,
          { credentials: 'include' }
        );
        if (!res.ok) throw new Error('Failed to load messages');
        const data = await res.json();
        
        const formatted = (data.messages || []).map(msg => ({
          id: msg.id || Date.now(),
          text: msg.content || msg.text,
          isBot: msg.role === 'assistant',
          timestamp: new Date(msg.created_at || msg.timestamp)
        }));
        
        setMessages(formatted.length > 0 ? formatted : [
          {
            id: 1,
            text: "Hi! I'm your AI companion. How can I help today?",
            isBot: true,
            timestamp: new Date()
          }
        ]);
      } catch (e) {
        console.error('Failed to load messages from backend:', e);
        setMessages([
          {
            id: 1,
            text: "Hi! I'm your AI companion. How can I help today?",
            isBot: true,
            timestamp: new Date()
          }
        ]);
      }
    };

    loadMessages();
  }, [conversationId, userId, backendUrl]);

  // Load conversation history from backend
  useEffect(() => {
    if (!userId) return;

    const loadConversations = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/api/ai/conversations?userId=${userId}&limit=20`,
          { credentials: 'include' }
        );
        if (!res.ok) throw new Error('Failed to load conversations');
        const data = await res.json();
        
        const formatted = (data.conversations || []).map(conv => ({
          id: conv.id,
          date: new Date(conv.created_at).toLocaleString(),
          title: conv.title || 'Chat',
          messages: [] // Messages loaded separately when needed
        }));
        
        setConversationHistory(formatted);
      } catch (e) {
        console.error('Failed to load conversations from backend:', e);
      }
    };

    loadConversations();
  }, [userId, backendUrl]);

  // Auto scroll
  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    const anchor = messagesEndRef.current;
    requestAnimationFrame(() => {
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth"
        });
      } else {
        anchor?.scrollIntoView({ behavior: "smooth" });
      }
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // API KEY
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

  const getWellnessResponse = msg => {
    msg = msg.toLowerCase();
    if (msg.includes("anx")) return "I hear your anxiety — let's try a grounding exercise.";
    if (msg.includes("stress")) return "Stress can be overwhelming. Want to talk about what caused it?";
    if (msg.includes("sad") || msg.includes("down"))
      return "I'm sorry you're feeling this way. I'm here to listen.";
    return "Thanks for sharing. Tell me more about what's on your mind.";
  };

  // Backend AI call (uses ChatGPT + mood tracking + DB persistence)
  const callBackendCompanion = async (userMessage) => {
    const fallback = getWellnessResponse(userMessage);

    if (!userId) {
      console.error("No userId found for AI chat (sensee_user_id not set)");
      return fallback;
    }

    try {
      setBotIsTyping(true);

      const res = await fetch(`${backendUrl}/api/ai/chat`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          conversationId,
          message: userMessage
        })
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();

      setBotIsTyping(false);
      setIsUsingChatGPT(true);

      // Update conversationId if backend returns one
      if (data.conversationId && data.conversationId !== conversationId) {
        setConversationId(data.conversationId);
      }

      return data.reply || fallback;
    } catch (e) {
      console.error("Backend AI chat error:", e);
      setBotIsTyping(false);
      // Fallback to direct ChatGPT if backend fails
      return await callChatGPTAPI(userMessage);
    }
  };

  const callChatGPTAPI = async userMessage => {
    if (!OPENAI_API_KEY) return getWellnessResponse(userMessage);

    try {
      setBotIsTyping(true);
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are SensEase AI, an empathetic mental health companion. Keep replies short, warm, and supportive."
            },
            { role: "user", content: userMessage }
          ]
        })
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      setBotIsTyping(false);
      setIsUsingChatGPT(true);

      return data.choices?.[0]?.message?.content || getWellnessResponse(userMessage);
    } catch (e) {
      setBotIsTyping(false);
      return getWellnessResponse(userMessage);
    }
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg = {
      id: Date.now(),
      text: trimmed,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Try backend first (with automatic fallback to direct ChatGPT)
    const reply = await callBackendCompanion(trimmed);

    setBotIsTyping(true);
    await new Promise(r => setTimeout(r, 400 + reply.length * 5));

    const botMsg = {
      id: Date.now() + 1,
      text: reply,
      isBot: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setBotIsTyping(false);
    setIsLoading(false);
  };

  const handleKeyPress = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const addMessageFromVoice = msg => {
    setMessages(prev => [...prev, msg]);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = e => audioChunksRef.current.push(e.data);
      mr.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await sendAudioToWhisper(blob);
        stream.getTracks().forEach(t => t.stop());
      };

      mr.start();
      setIsRecording(true);
    } catch (e) {}
  };

  const stopRecording = () => {
    try {
      mediaRecorderRef.current?.stop();
    } catch {}
    setIsRecording(false);
  };

  const sendAudioToWhisper = async blob => {
    if (!OPENAI_API_KEY) {
      alert("No API key. Add VITE_OPENAI_API_KEY to .env");
      return;
    }

    setIsTranscribing(true);
    try {
      const form = new FormData();
      form.append("file", blob, "audio.webm");
      form.append("model", "whisper-1");

      const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
        body: form
      });

      if (!res.ok) throw new Error("Whisper error");
      const data = await res.json();

      setInput(data.text || "");
    } catch (e) {}
    setIsTranscribing(false);
  };

  const startNewChat = async () => {
    if (!userId) {
      console.error('No userId for new chat');
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/api/ai/conversations`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title: 'New Chat'
        })
      });

      if (!res.ok) throw new Error('Failed to create conversation');
      const data = await res.json();
      
      setConversationId(data.id || data.conversationId);
      setMessages([
        {
          id: Date.now(),
          text: "New conversation started — how can I help you today? 💙",
          isBot: true,
          timestamp: new Date()
        }
      ]);
      setChatTab("chat");
      
      // Reload conversation list
      const convRes = await fetch(
        `${backendUrl}/api/ai/conversations?userId=${userId}&limit=20`,
        { credentials: 'include' }
      );
      if (convRes.ok) {
        const convData = await convRes.json();
        const formatted = (convData.conversations || []).map(conv => ({
          id: conv.id,
          date: new Date(conv.created_at).toLocaleString(),
          title: conv.title || 'Chat',
          messages: []
        }));
        setConversationHistory(formatted);
      }
    } catch (e) {
      console.error('Failed to create new chat:', e);
    }
  };

  const loadChat = async (chat) => {
    if (!userId) return;

    try {
      setConversationId(chat.id);
      // Messages will be loaded by the useEffect that watches conversationId
      setChatTab("chat");
    } catch (e) {
      console.error('Failed to load chat:', e);
    }
  };

  const deleteHistory = async (id) => {
    if (!userId) return;

    try {
      const res = await fetch(
        `${backendUrl}/api/ai/conversations/${id}?userId=${userId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      if (!res.ok) throw new Error('Failed to delete conversation');

      // Update local state
      const next = conversationHistory.filter(h => h.id !== id);
      setConversationHistory(next);
      
      // If deleted current conversation, clear it
      if (conversationId === id) {
        setConversationId(null);
        setMessages([
          {
            id: 1,
            text: "Hi! I'm your AI companion. How can I help today?",
            isBot: true,
            timestamp: new Date()
          }
        ]);
      }
    } catch (e) {
      console.error('Failed to delete conversation:', e);
    }
  };

  // Render bubble
  const renderChatMessage = message => (
    <div
      key={message.id}
      className={`flex items-start space-x-3 ${
        message.isBot ? "justify-start" : "justify-end"
      } message-row`}
    >
      {message.isBot && (
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
          <Heart className="w-5 h-5 text-white" />
        </div>
      )}

      <div className="max-w-md animate-message-in">
        <div
          className={`p-4 rounded-2xl shadow-md ${
            message.isBot
              ? theme.colors.card
              : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
          }`}
        >
          {message.text}
        </div>
        <p className={`text-xs ${theme.colors.muted} mt-1`}>
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })}
        </p>
      </div>

      {!message.isBot && (
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );

  // ==== END CHATBOT FUNCTIONS ====

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
        // { key: 'settings', icon: Settings, label: t('settings'), color: 'text-gray-500' }
      ].map(({ key, icon: Icon, label, color }) => (
        <Button
          key={key}
          variant={activeTab === key ? 'default' : 'ghost'}
          className={`w-full justify-start transition-all duration-300 hover:scale-105 group ${
            activeTab === key 
              ? `bg-gradient-to-r ${theme.colors.primary} text-white shadow-lg` 
              : `hover:bg-gradient-to-r hover:${theme.colors.secondary} ${theme.colors.text}`
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
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageCircle className="w-6 h-6 mr-2 text-cyan-500" />
            <CardTitle className={theme.colors.text}>
              SensEase AI Companion
            </CardTitle>
            <Sparkles className="w-5 h-5 ml-2 text-yellow-500 animate-pulse" />
          </div>

          <div className="flex items-center space-x-3">
            <Button onClick={startNewChat} variant="outline">
              <Plus className="w-4 h-4 mr-1" /> New
            </Button>

            <Badge
              className={`${
                isUsingChatGPT ? "bg-green-500" : "bg-orange-500"
              } text-white`}
            >
              {isUsingChatGPT ? "🤖 ChatGPT Active" : "⚡ Local Mode"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="chat-panel">
        <Tabs value={chatTab} onValueChange={setChatTab} className="chat-panel">

          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="chat">💬 Chat</TabsTrigger>
            <TabsTrigger value="voice">🎙️ Voice</TabsTrigger>
            <TabsTrigger value="history">📜 History</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="chat-panel">
            <div
              ref={messagesContainerRef}
              className={`chat-messages border rounded-xl bg-gradient-to-br ${theme.colors.secondary}`}
              style={{ minHeight: '400px' }}
            >
              <div className="space-y-4 w-full pb-4 px-2 sm:px-4">
                {console.log('[AdminDashboard] Rendering messages:', messages.length, messages)}
                {messages.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No messages yet. Start chatting!</p>
                  </div>
                )}
                {messages.map(m => renderChatMessage(m))}

                {botIsTyping && (
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10" />
                    <div className={`p-3 rounded-xl ${theme.colors.card}`}>
                      <TypingDots />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="chat-input-bar bg-white dark:bg-gray-900">
              <div className="chat-input-inner">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 p-2 sm:p-3 border rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-500 resize-none text-sm sm:text-base"
                  rows={1}
                  style={{ minHeight: '40px', maxHeight: '120px' }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                  }}
                />

                <button
                  onClick={() => (isRecording ? stopRecording() : startRecording())}
                  disabled={isLoading || isTranscribing}
                  className={`w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center rounded-xl ${
                    isRecording
                      ? "bg-red-500"
                      : "bg-gradient-to-br from-cyan-400 to-blue-500"
                  } text-white transition-all hover:shadow-lg`}
                  title={isRecording ? "Stop recording" : "Voice message"}
                >
                  {isRecording ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>

                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Send message"
                >
                  {isLoading ? <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Send className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="voice" className="flex-1">
            <RealtimeVoice onAddMessage={addMessageFromVoice} theme={theme} />
          </TabsContent>

          <TabsContent value="history" className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto pt-4 px-4">
              {conversationHistory.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">
                  No previous chats yet.
                </p>
              ) : (
                conversationHistory.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => loadChat(chat)}
                    className="p-4 border rounded-lg mb-3 cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex justify-between">
                      <p className="font-semibold text-sm">{chat.date}</p>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          deleteHistory(chat.id);
                        }}
                        className="text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {chat.title}
                    </p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
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