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
  Heart,
  Smile,
  Settings
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

const TypingDots = () => {
  const [message, setMessage] = useState('SensEase is thinking');
  
  useEffect(() => {
    const messages = [
      'SensEase is thinking',
      'SensEase is crafting a response',
      'SensEase is here for you',
      'Processing with care',
      'Gathering thoughtful insights'
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    setMessage(randomMsg);
  }, []);

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full animate-bounce bg-cyan-400" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full animate-bounce bg-cyan-500" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full animate-bounce bg-blue-500" style={{ animationDelay: '300ms' }} />
        </div>
        <span className="text-xs text-gray-500 italic animate-pulse">{message}...</span>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { theme, currentTheme } = useTheme();
  const { t, isRTL } = useLanguage();

  // Theme helpers for conditional styling
  const isDarkLike = currentTheme === 'midnight';
  const isOceanLike = currentTheme === 'ocean';

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
  const [isLiveTranscribing, setIsLiveTranscribing] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [messageReactions, setMessageReactions] = useState({}); // { messageId: emoji }
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [reactionsEnabled, setReactionsEnabled] = useState(true); // Toggle for emoji reactions
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [incognitoMode, setIncognitoMode] = useState(false); // Incognito (temporary chats)
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  // Load persisted incognito setting
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sensee_incognito_mode');
      if (saved) setIncognitoMode(saved === 'true');
    } catch (e) {}
  }, []);

  // Backend integration
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const userId = typeof window !== "undefined" 
    ? window.localStorage.getItem("sensee_user_id") 
    : null;
  const [conversationId, setConversationId] = useState(null);
  const [shouldLoadMessages, setShouldLoadMessages] = useState(true);

  // Load current conversation messages from backend
  useEffect(() => {
    console.log('[AdminDashboard] Loading messages - userId:', userId, 'conversationId:', conversationId, 'shouldLoad:', shouldLoadMessages);
    
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
      setShouldLoadMessages(true);
      return;
    }

    // Don't reload if we just sent a message
    if (!shouldLoadMessages) {
      console.log('[AdminDashboard] Skipping message reload after send');
      setShouldLoadMessages(true);
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
          id: msg.id || Date.now() + Math.random(),
          text: msg.message || msg.content || msg.text || '',
          isBot: msg.sender === 'assistant',
          timestamp: new Date(msg.created_at || msg.timestamp)
        })).filter(msg => msg.text && msg.text.trim()); // Filter out empty messages
        
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
  }, [conversationId, userId, backendUrl, shouldLoadMessages]);

  // Function to refresh conversation list
  const refreshConversations = async () => {
    if (!userId) return;
    
    try {
      const res = await fetch(
        `${backendUrl}/api/ai/conversations?userId=${userId}&limit=20`,
        { credentials: 'include' }
      );
      if (!res.ok) throw new Error('Failed to load conversations');
      const data = await res.json();
      
      console.log('[Conversations] Backend response:', data);
      
      const formatted = (data.conversations || []).map(conv => ({
        id: conv.id,
        date: new Date(conv.created_at).toLocaleString(),
        title: conv.title || 'New Chat',
        messages: [] // Messages loaded separately when needed
      }));
      
      console.log('[Conversations] Formatted:', formatted);
      setConversationHistory(formatted);
    } catch (e) {
      console.error('Failed to load conversations from backend:', e);
    }
  };

  // Load conversation history from backend
  useEffect(() => {
    refreshConversations();
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

  // Initialize SpeechRecognition for live transcription
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        console.log('[AdminDashboard LiveTranscription] Started listening');
        setIsLiveTranscribing(true);
        setLiveTranscript('');
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        if (finalTranscript) {
          setInput(prev => prev + finalTranscript + ' ');
          setLiveTranscript(interimTranscript);
        } else {
          setLiveTranscript(interimTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('[AdminDashboard LiveTranscription] Error:', event.error);
        setIsLiveTranscribing(false);
        setLiveTranscript('');
      };

      recognition.onend = () => {
        console.log('[AdminDashboard LiveTranscription] Stopped listening');
        setIsLiveTranscribing(false);
        setLiveTranscript('');
      };
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  // API KEY
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

  // Crisis detection keywords
  const detectCrisis = (msg) => {
    const text = msg.toLowerCase();
    const crisisKeywords = [
      'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die',
      'self harm', 'self-harm', 'cut myself', 'hurt myself', 'harm myself',
      'no reason to live', 'better off dead', 'can\'t go on', 'end it all',
      'take my life', 'not worth living'
    ];
    
    return crisisKeywords.some(keyword => text.includes(keyword));
  };

  // Safety resources response
  const getSafetyResponse = () => {
    return `I'm really concerned about what you're sharing. Your safety is the top priority. Please reach out to these resources immediately:

🆘 **EMERGENCY HELPLINES:**
• **National Suicide Prevention Lifeline (US):** 988 or 1-800-273-8255 (24/7)
• **Crisis Text Line:** Text HOME to 741741 (24/7)
• **International Association for Suicide Prevention:** https://www.iasp.info/resources/Crisis_Centres/

🇮🇳 **INDIA HELPLINES:**
• **AASRA:** +91-9820466726 (24/7)
• **Vandrevala Foundation:** 1860-2662-345 / 1800-2333-330 (24/7)
• **iCall:** +91-22-25521111 (Mon-Sat, 8am-10pm)
• **Sneha Foundation:** +91-44-24640050 (24/7)

🏥 **IMMEDIATE ACTIONS:**
• Call emergency services: 911 (US) or 112 (India)
• Go to your nearest emergency room
• Reach out to a trusted friend or family member
• Contact your counselor or therapist

You are not alone, and there are people who want to help. Please reach out to one of these resources right now.`;
  };

  const getWellnessResponse = msg => {
    // Check for crisis first
    if (detectCrisis(msg)) {
      return getSafetyResponse();
    }
    
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
      // If incognito mode is enabled, bypass backend and call ChatGPT directly (do not persist)
      if (incognitoMode) {
        setBotIsTyping(true);
        const reply = await callChatGPTAPI(userMessage);
        setBotIsTyping(false);
        setIsUsingChatGPT(true);
        return reply || fallback;
      }

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

      // Update conversationId if backend returns one (but don't reload messages)
      if (data.conversationId && data.conversationId !== conversationId) {
        setShouldLoadMessages(false); // Prevent reload after setting conversationId
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

    // Check for crisis immediately
    if (detectCrisis(trimmed)) {
      const safetyMsg = {
        id: Date.now() + 1,
        text: getSafetyResponse(),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, safetyMsg]);
      setIsLoading(false);
      return;
    }

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

    // Only add bot message if it's not already in the messages array
    setMessages(prev => {
      const alreadyExists = prev.some(msg => msg.text === reply && msg.isBot && 
        Math.abs(new Date(msg.timestamp).getTime() - Date.now()) < 5000);
      if (alreadyExists) {
        console.log('[AdminDashboard] Duplicate bot message prevented');
        return prev;
      }
      return [...prev, botMsg];
    });
    setBotIsTyping(false);
    setIsLoading(false);
    
    // Refresh conversation list to show updated history (unless incognito)
    if (!incognitoMode) refreshConversations();
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
    if (recognitionRef.current && !isLiveTranscribing) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error('Failed to start speech recognition:', e);
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isLiveTranscribing) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Failed to stop speech recognition:', e);
      }
    }
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
      // If incognito, do not create conversation in backend; just reset local messages
      if (incognitoMode) {
        setConversationId(null);
        setMessages([
          {
            id: Date.now(),
            text: "New conversation started — how can I help you today? 💙",
            isBot: true,
            timestamp: new Date()
          }
        ]);
        setChatTab("chat");
        return;
      }
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
      refreshConversations();
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
  const handleReaction = (messageId, emoji) => {
    setMessageReactions(prev => ({
      ...prev,
      [messageId]: prev[messageId] === emoji ? null : emoji // Toggle reaction
    }));
  };

  const insertEmoji = (emoji) => {
    setInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const commonEmojis = [
    '😊', '😂', '❤️', '👍', '🙏', '😢', '😔', '😌', '💪', '✨',
    '🌟', '💙', '🤗', '😇', '🥰', '😍', '🎉', '👏', '🙌', '💯',
    '🔥', '⭐', '💕', '😅', '😭', '🤔', '😴', '😊', '🌈', '☀️'
  ];

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
        
        {/* Reaction buttons for bot messages */}
        {message.isBot && reactionsEnabled && (
          <div className="flex items-center space-x-2 mt-2">
            {['👍', '❤️', '😢', '💪', '🙏'].map(emoji => (
              <button
                key={emoji}
                onClick={() => handleReaction(message.id, emoji)}
                className={`text-lg transition-all hover:scale-125 ${
                  messageReactions[message.id] === emoji 
                    ? 'scale-125 drop-shadow-lg' 
                    : 'opacity-50 hover:opacity-100'
                }`}
                title={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
        
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

  const renderChatbot = () => (
    <Card className={`chat-shell ${theme.colors.card} border-0 shadow-2xl`}>
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
            <MessageCircle className="w-6 h-6 mr-2 text-cyan-500" />
            <CardTitle className={theme.colors.text}>
              {t('aiCompanionTitle') || 'SensEase AI Companion'}
            </CardTitle>
            <Sparkles className="w-5 h-5 ml-2 text-yellow-500 animate-pulse" />
            {incognitoMode && (
              <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-white">
                Incognito
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Settings dropdown for reactions */}
            <div className="relative">
              <button
                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Chat Settings"
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              {showSettingsDropdown && (
                <div className="absolute right-0 top-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 w-64 z-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-pink-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Reactions</span>
                    </div>
                    <button
                      onClick={() => setReactionsEnabled(!reactionsEnabled)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        reactionsEnabled ? 'bg-cyan-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        reactionsEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {reactionsEnabled ? 'You can react to bot messages with emojis' : 'Emoji reactions are disabled'}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Incognito Mode</span>
                    </div>
                    <button
                      onClick={() => {
                        const next = !incognitoMode;
                        if (next) {
                          const ok = window.confirm('Turn on Incognito Mode? Chats will not be saved to your account.');
                          if (!ok) return;
                        }
                        setIncognitoMode(next);
                        try { localStorage.setItem('sensee_incognito_mode', next ? 'true' : 'false'); } catch(e) {}
                      }}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        incognitoMode ? 'bg-gray-700' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        incognitoMode ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {incognitoMode ? 'Incognito on — chats will not be saved' : 'Incognito off — chats saved to account'}
                  </p>
                </div>
              )}
            </div>

            <Button onClick={startNewChat} variant="outline">
              <Plus className="w-4 h-4 mr-1" /> {t('newChat') || 'New'}
            </Button>

            <Badge
              className={`${
                isUsingChatGPT ? "bg-green-500" : "bg-orange-500"
              } text-white`}
            >
              {isUsingChatGPT
                ? t('chatgptActive') || "🤖 ChatGPT Active"
                : t('localMode') || "⚡ Local Mode"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="chat-panel">
        <Tabs value={chatTab} onValueChange={setChatTab} className="chat-panel">

          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="chat">💬 {t('chatTab') || 'Chat'}</TabsTrigger>
            <TabsTrigger value="voice">🎙️ {t('voiceTab') || 'Voice'}</TabsTrigger>
            <TabsTrigger value="history">📜 {t('historyTab') || 'History'}</TabsTrigger>
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
              <div className="chat-input-inner relative">
                <textarea
                  value={input + (liveTranscript ? ' ' + liveTranscript : '')}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isLiveTranscribing
                    ? t('listeningPlaceholder') || "Listening... Speak now"
                    : t('typeMessagePlaceholder') || "Type your message..."}
                  className="flex-1 p-2 sm:p-3 border rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-500 resize-none text-sm sm:text-base"
                  rows={1}
                  style={{ minHeight: '40px', maxHeight: '120px' }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                  }}
                  disabled={isLiveTranscribing}
                />

                {/* Emoji Picker Popup */}
                {showEmojiPicker && (
                  <div className="absolute bottom-16 left-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-2xl p-4 z-50 w-80 max-h-64 overflow-y-auto">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Choose an emoji</h3>
                      <button
                        onClick={() => setShowEmojiPicker(false)}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="grid grid-cols-8 gap-2">
                      {commonEmojis.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => insertEmoji(emoji)}
                          className="text-2xl hover:scale-125 transition-transform hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1"
                          title={emoji}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Emoji Button */}
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  disabled={isLoading || isLiveTranscribing}
                  className={`w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center rounded-xl ${
                    showEmojiPicker
                      ? "bg-yellow-400"
                      : "bg-gradient-to-br from-yellow-400 to-orange-500"
                  } text-white transition-all hover:shadow-lg`}
                  title="Add emoji"
                >
                  <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <button
                  onClick={() => (isRecording ? stopRecording() : startRecording())}
                  disabled={isLoading || isTranscribing}
                  className={`w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center rounded-xl ${
                    isLiveTranscribing
                      ? "bg-red-500 animate-pulse"
                      : "bg-gradient-to-br from-cyan-400 to-blue-500"
                  } text-white transition-all hover:shadow-lg`}
                  title={isLiveTranscribing ? "Stop live transcription" : "Start live transcription"}
                >
                  {isLiveTranscribing ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
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
              <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2 px-4">
                <p className="mb-1">💡 Our chatbot can make mistakes</p>
                <p>🔒 To keep your chats private, turn on incognito mode</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="voice" className="flex-1">
            <RealtimeVoice onAddMessage={addMessageFromVoice} theme={theme} />
          </TabsContent>

          <TabsContent value="history" className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto pt-4 px-4 max-w-4xl mx-auto">
              {conversationHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <p className="text-gray-500 dark:text-gray-400 mb-2 text-lg">📜 No previous chats yet</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm">Start a conversation to see your history here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {conversationHistory.map(chat => (
                    <div
                      key={chat.id}
                      onClick={() => loadChat(chat)}
                      className={`p-4 border rounded-xl mb-3 cursor-pointer transition-all hover:shadow-md ${
                        theme.currentTheme === 'midnight' 
                          ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' 
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm mb-1 ${
                            theme.currentTheme === 'midnight' ? 'text-gray-200' : 'text-gray-800'
                          }`}>{chat.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{chat.date}</p>
                        </div>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            deleteHistory(chat.id);
                          }}
                          className="ml-3 p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Delete conversation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Platform Analytics */}
      <Card className={`${isDarkLike ? 'bg-transparent border border-white/20' : 'bg-white border border-gray-200'} shadow-xl hover:shadow-2xl transition-shadow`}>
        <CardHeader>
          <CardTitle className={`flex items-center ${isDarkLike ? 'text-white' : (isOceanLike ? 'text-black' : '')}`}>
            <BarChart3 className="w-6 h-6 mr-3 text-blue-500" />
            {t('platformAnalytics')}
            <Badge className="ml-3 bg-green-100 text-green-800">{t('liveData')}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className={`${isDarkLike ? 'font-semibold text-white mb-4' : (isOceanLike ? 'font-semibold text-black mb-4' : 'font-semibold mb-4')}`}>{t('mostUsedFeatures')}</h4>
              <div className="space-y-4">
                {mockAnalytics.mostUsedFeatures.map((feature, index) => (
                  <div key={index} className={`${isDarkLike ? 'flex items-center justify-between p-4 rounded-lg border border-white/10 hover:shadow-md transition-shadow' : 'flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:shadow-md transition-shadow'}`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${theme.colors.primary} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                        {index + 1}
                      </div>
                      <span className={`${isDarkLike ? 'font-medium text-white' : (isOceanLike ? 'font-medium text-black' : 'font-medium')}`}>{feature.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-white/10 rounded-full h-3">
                        <div 
                          className={`bg-gradient-to-r ${theme.colors.primary} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${feature.usage}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-semibold ${isDarkLike ? 'text-white' : (isOceanLike ? 'text-black' : '')} min-w-[3rem]`}>{feature.usage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
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

              <div className="grid grid-cols-1 gap-8 lg:gap-12 max-w-7xl mx-auto">
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
                    {t('formCreationHub')}
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

  export default function AdminDashboardWithBoundary(props) {
    return (
      <ErrorBoundary>
        <AdminDashboard {...props} />
      </ErrorBoundary>
    );
  }
