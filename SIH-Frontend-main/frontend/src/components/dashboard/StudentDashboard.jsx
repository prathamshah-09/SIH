import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "@components/layout/DashboardLayout";
import { useTheme } from "@context/ThemeContext";
import { useLanguage } from "@context/LanguageContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import {
  MessageCircle,
  Users,
  Calendar,
  PenTool,
  Bell,
  FileText,
  Brain,
  Heart,
  Activity,
  Sparkles,
  Send,
  Loader,
  User,
  Mic,
  MicOff,
  Plus,
  Trash2,
  Phone,
  PhoneOff,
  Smile,
  Settings
} from "lucide-react";
import { useAnnouncements } from "@context/AnnouncementContext";
import WellnessTools from "@components/wellness/WellnessTools";
import JournalWithThemeNew from "@components/wellness/JournalWithThemeNew";
import StudentAppointments from "@components/appointments/StudentAppointments";
import CommunityView from "@components/community/CommunityView";
import AudioSection from "@components/wellness/AudioSection";
import AssessmentDashboard from "@/components/Assessment/AssessmentDashboard";
import DirectMessages from "@components/community/DirectMessages";

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
            variant="animated"
          >
            {isConnecting ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Phone className="w-5 h-5 mr-2" />
                Start Voice Session
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={stopRealtimeSession}
            variant="animated"
            className="bg-gradient-to-135 from-red-600 to-red-500"
          >
            <PhoneOff className="w-5 h-5 mr-2" />
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

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { getRecentAnnouncements, incrementViews } = useAnnouncements();

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
  const [incognitoMode, setIncognitoMode] = useState(false); // Incognito / temporary chats
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  // Backend integration
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const userId = typeof window !== "undefined" 
    ? window.localStorage.getItem("sensee_user_id") 
    : null;
  const [conversationId, setConversationId] = useState(null);
  const [shouldLoadMessages, setShouldLoadMessages] = useState(true);

  // Load current conversation messages from backend
  useEffect(() => {
    console.log('[StudentDashboard] Loading messages - userId:', userId, 'conversationId:', conversationId, 'shouldLoad:', shouldLoadMessages);
    
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
      console.log('[StudentDashboard] Setting welcome message:', welcomeMsg);
      setMessages(welcomeMsg);
      setShouldLoadMessages(true);
      return;
    }

    // Don't reload if we just sent a message
    if (!shouldLoadMessages) {
      console.log('[StudentDashboard] Skipping message reload after send');
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

  // Load persisted settings
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sensee_incognito_mode');
      if (saved) setIncognitoMode(saved === 'true');
    } catch (e) {}
  }, []);

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
        console.log('[LiveTranscription] Started listening');
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

        // Update input with final transcripts, show interim as live feedback
        if (finalTranscript) {
          setInput(prev => prev + finalTranscript + ' ');
          setLiveTranscript(interimTranscript);
        } else {
          setLiveTranscript(interimTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('[LiveTranscription] Error:', event.error);
        setIsLiveTranscribing(false);
        setLiveTranscript('');
      };

      recognition.onend = () => {
        console.log('[LiveTranscription] Stopped listening');
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
      // If incognito mode is enabled, do NOT send messages to backend (avoid saving)
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
        console.log('[StudentDashboard] Duplicate bot message prevented');
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
      // If incognito mode is enabled, do not create a backend conversation; start locally
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
      <div className="max-w-md animate-message-in">
        <div
          className={`p-4 rounded-2xl shadow-md ${
            message.isBot
              ? `${theme.colors.card} ${theme.colors.text}`
              : theme.currentTheme === 'midnight' ? 'bg-slate-700 text-white' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
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
    </div>
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
                        // confirm when turning on
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
                ? t('chatgptActive') || '🤖 ChatGPT Active'
                : t('localMode') || '⚡ Local Mode'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="chat-panel">
        <Tabs value={chatTab} onValueChange={setChatTab} className="chat-panel">
{/* <TabsList className={`grid grid-cols-3 w-full dark:!bg-slate-800`}>0 */}
<TabsList 
  className="grid grid-cols-3 w-full"
  style={theme.currentTheme === 'midnight' ? { backgroundColor: 'rgb(30 41 59)' } : {}}
>

            <TabsTrigger value="chat">💬 {t('chatTab') || 'Chat'}</TabsTrigger>
            <TabsTrigger value="voice">🎙️ {t('voiceTab') || 'Voice'}</TabsTrigger>
            <TabsTrigger value="history">📜 {t('historyTab') || 'History'}</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="chat-panel">
            <div
              ref={messagesContainerRef}
className={`chat-messages border rounded-xl ${
  theme.currentTheme === 'midnight' 
    ? 'bg-slate-800' 
    : `bg-gradient-to-br ${theme.colors.secondary}`
}`}
>
            
              <div className="space-y-4 w-full pb-4 px-2 sm:px-4">
                {messages.map(m => renderChatMessage(m))}

                {botIsTyping && (
                  <div className="flex items-start space-x-3 animate-fade-in">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div className={`p-4 rounded-2xl shadow-md ${theme.colors.card}`}>
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
                    ? t('listeningPlaceholder') || 'Listening... Speak now'
                    : t('typeMessagePlaceholder') || 'Type your message...'}
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

          <TabsContent value="history" className={`flex-1 overflow-hidden ${theme.currentTheme === 'midnight' ? 'bg-slate-800' : ''}`}>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-4xl font-bold ${theme.colors.text} flex items-center`}>
            {t('welcomeToSensEase')}
            <Sparkles className="w-8 h-8 ml-2 text-yellow-500 animate-spin" style={{ animationDuration: "3s" }} />
          </h2>
          <p className={`${theme.colors.muted} mt-2 text-lg`}>
            {t('personalWellnessCompanion')}
          </p>
        </div>
      </div>

      <Card className={`${theme.colors.card} p-6 shadow-xl`}>
        <CardHeader>
          <CardTitle className={`flex items-center ${theme.colors.text}`}>
            {t('recentUpdates')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getRecentAnnouncements(3).map(a => (
            <div
              key={a.id}
              className={`p-4 rounded-lg border mb-3 cursor-pointer transition-all ${theme.currentTheme === 'midnight' ? 'hover:bg-black-600' : 'hover:bg-white-100'}`}
              onClick={() => incrementViews(a.id)}
            >
              <p className={`font-semibold ${theme.colors.text}`}>{a.title}</p>
              <p className={`text-sm ${theme.currentTheme === 'midnight' ? 'text-slate-300' : 'text-gray-500'}`}>{a.content}</p>
              <p className={`text-xs mt-1 opacity-70 ${theme.colors.text}`}>{a.date}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const sidebarContent = (
    <nav className="space-y-2">
      {[
        { key: "overview", icon: Activity, label: t("overview") },
        { key: "chatbot", icon: MessageCircle, label: t("aiCompanion") },
        { key: "community", icon: Users, label: t("community") },
        { key: "appointments", icon: Calendar, label: t("appointments") },
        { key: "messages", icon: MessageCircle, label: t("Messages") },
        { key: "journaling", icon: PenTool, label: t("journaling") },
        { key: "assessments", icon: FileText, label: t("assessments") },
        { key: "audios", icon: Activity, label: t("Audios") },
        { key: "resources", icon: Brain, label: t("wellnessTools") }
      ].map(({ key, icon: Icon, label }) => (
        <Button
          key={key}
          variant={activeTab === key ? "animated" : "ghost"}
          onClick={() => setActiveTab(key)}
          className={`w-full justify-start ${
            activeTab === key
              ? ""
              : theme.colors.text
          }`}
        >
          <Icon className="w-4 h-4 mr-2" />
          {label}
        </Button>
      ))}
    </nav>
  );

  return (
    <DashboardLayout sidebarContent={sidebarContent}>
      {activeTab === "overview" && renderOverview()}
      {activeTab === "chatbot" && renderChatbot()}
      {activeTab === "community" && <CommunityView userRole="student" />}
      {activeTab === "appointments" && <StudentAppointments />}
      {activeTab === "journaling" && (
        <JournalWithThemeNew onBack={() => setActiveTab("overview")} />
      )}
      {activeTab === "resources" && <WellnessTools onNavigateToJournaling={() => setActiveTab("journaling")} />}
      {activeTab === "audios" && <AudioSection />}
      {activeTab === "assessments" && (
        <AssessmentDashboard userRole="student" />
      )}
      {activeTab === "messages" && <DirectMessages userRole="student" />}
    </DashboardLayout>
  );
};

export default StudentDashboard;