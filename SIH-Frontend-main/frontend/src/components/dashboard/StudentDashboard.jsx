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
  PhoneOff
} from "lucide-react";
import { useAnnouncements } from "@context/AnnouncementContext";
import WellnessTools from "@components/wellness/WellnessTools";
import JournalWithThemeNew from "@components/wellness/JournalWithThemeNew";
import StudentAppointments from "@components/appointments/StudentAppointments";
import CommunityView from "@components/community/CommunityView";
import AudioSection from "@components/wellness/AudioSection";
import AssessmentDashboard from "@/components/assessment/AssessmentDashboard";
import DirectMessages from "@components/community/DirectMessages";

const TypingDots = () => (
  <div className="flex items-center space-x-1 pl-2">
    <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-cyan-400" />
    <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-cyan-400 delay-75" />
    <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-cyan-400 delay-150" />
  </div>
);

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
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sensee_current_chat");
      if (saved) {
        const parsed = JSON.parse(saved).map(m => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        setMessages(parsed);
      } else {
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
      console.error("Failed to load chat", e);
      setMessages([]);
    }
  }, []);

  // Load chat
  useEffect(() => {
    if (messages.length > 0)
      localStorage.setItem("sensee_current_chat", JSON.stringify(messages));
  }, [messages]);

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

    const reply = await callChatGPTAPI(trimmed);

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

  const startNewChat = () => {
    if (messages.length > 1) {
      const entry = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        messages
      };
      const next = [entry, ...conversationHistory];
      setConversationHistory(next);
      localStorage.setItem("sensee_conversation_history", JSON.stringify(next));
    }
    setMessages([
      {
        id: Date.now(),
        text: "New conversation started — how can I help you today? 💙",
        isBot: true,
        timestamp: new Date()
      }
    ]);
    setChatTab("chat");
  };

  const loadChat = chat => {
    const restored = chat.messages.map(m => ({
      ...m,
      timestamp: new Date(m.timestamp)
    }));
    setMessages(restored);
    localStorage.setItem("sensee_current_chat", JSON.stringify(restored));
    setChatTab("chat");
  };

  const deleteHistory = id => {
    const next = conversationHistory.filter(h => h.id !== id);
    setConversationHistory(next);
    localStorage.setItem("sensee_conversation_history", JSON.stringify(next));
  };

  // Render bubble
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
              SensEase AI Companion
            </CardTitle>
            <Sparkles className="w-5 h-5 ml-2 text-yellow-500 animate-pulse" />
          </div>

          <div className={`flex items-center space-x-3 ${theme.colors.text}`}>
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
{/* <TabsList className={`grid grid-cols-3 w-full dark:!bg-slate-800`}>0 */}
<TabsList 
  className="grid grid-cols-3 w-full"
  style={theme.currentTheme === 'midnight' ? { backgroundColor: 'rgb(30 41 59)' } : {}}
>

            <TabsTrigger value="chat"> Chat</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
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

            <div className={`chat-input-bar ${theme.currentTheme === 'midnight' ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="chat-input-inner">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className={`flex-1 p-2 sm:p-3 border rounded-xl focus:ring-2 focus:ring-cyan-500 resize-none text-sm sm:text-base ${theme.currentTheme === 'midnight' ? 'bg-slate-700 text-white' : 'bg-white'}`}
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

          <TabsContent value="history" className={`flex-1 overflow-hidden ${theme.currentTheme === 'midnight' ? 'bg-slate-800' : ''}`}>
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
                      {chat.messages[1]?.text || chat.messages[0].text}
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
      {activeTab === "resources" && <WellnessTools />}
      {activeTab === "audios" && <AudioSection />}
      {activeTab === "assessments" && (
        <AssessmentDashboard userRole="student" />
      )}
      {activeTab === "messages" && <DirectMessages userRole="student" />}
    </DashboardLayout>
  );
};

export default StudentDashboard;