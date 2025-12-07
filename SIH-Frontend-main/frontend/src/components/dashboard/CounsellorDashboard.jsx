import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@components/layout/DashboardLayout';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import {
  Calendar,
  Users,
  FileText,
  BarChart3,
  MessageCircle,
  ChevronDown,
  Brain,
  Activity,
  Heart,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Bell,
  Send,
  Mic,
  MicOff,
  User,
  Loader,
  Upload,
  Download,
  Trash2,
  Plus,
  Eye,
  Phone,
  PhoneOff
} from 'lucide-react';
import CounsellorAppointments from '@components/appointments/CounsellorAppointments';
import { mockAnnouncements } from '@data/mocks/announcements';
import { mockCommunityChats, mockAppointments } from '@mock/mockData';
import { useAnnouncements } from '@context/AnnouncementContext';
import CommunityView from '@components/community/CommunityView';
import DirectMessages from '@components/community/DirectMessages';
import { generateHistoryTitle } from '@lib/utils';
import { getAllResources, uploadResource, deleteResource, getResourceDownloadUrl } from '@services/resourceService';

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
      const tokenRes = await fetch(`${backendUrl}/api/counsellor/realtime-session`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });

      if (!tokenRes.ok) {
        const errorData = await tokenRes.text();
        console.error(`Backend error (${tokenRes.status}):`, errorData);
        throw new Error(`Failed to get session token (${tokenRes.status})`);
      }
      
      const response = await tokenRes.json();
      const { client_secret } = response.data || response;

      if (!client_secret) {
        throw new Error("No client_secret in response");
      }

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
      const errorMsg = err.message || "Connection failed";
      setStatus(`Error: ${errorMsg}. Please ensure the backend server is running.`);
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

const CounsellorResourcesSection = ({ theme }) => {
  const { t } = useLanguage();
  const [resources, setResources] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [resourceName, setResourceName] = useState('');
  const [resourceDesc, setResourceDesc] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch resources on component mount
  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllResources();
      if (response.success) {
        setResources(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError(err.message || 'Failed to load resources');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (50MB max)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        alert('File size exceeds 50MB limit');
        return;
      }
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleUpload = async () => {
    if (!resourceName.trim() || !selectedFile) {
      alert('Please provide a resource name and select a file');
      return;
    }

    setIsUploading(true);
    setError(null);
    
    try {
      const response = await uploadResource({
        resource_name: resourceName,
        description: resourceDesc || undefined,
        file: selectedFile
      });

      if (response.success) {
        // Refresh resources list
        await fetchResources();
        
        // Clear form
        setResourceName('');
        setResourceDesc('');
        setSelectedFile(null);
        setFileName('');
        setShowUploadForm(false);
        
        alert('Resource uploaded successfully!');
      }
    } catch (err) {
      console.error('Error uploading resource:', err);
      setError(err.message || 'Failed to upload resource');
      alert(`Upload failed: ${err.message || 'Please try again'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (resourceId) => {
    if (!confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    try {
      const response = await deleteResource(resourceId);
      if (response.success) {
        // Remove from local state
        setResources(resources.filter(r => r.id !== resourceId));
        alert('Resource deleted successfully!');
      }
    } catch (err) {
      console.error('Error deleting resource:', err);
      alert(`Delete failed: ${err.message || 'Please try again'}`);
    }
  };

  const handleView = async (resource) => {
    try {
      const response = await getResourceDownloadUrl(resource.id);
      if (response.success && response.data.downloadUrl) {
        // Open file in new tab for preview
        window.open(response.data.downloadUrl, '_blank');
      }
    } catch (err) {
      console.error('Error viewing resource:', err);
      alert(`View failed: ${err.message || 'Please try again'}`);
    }
  };

  const handleDownload = async (resource) => {
    try {
      const response = await getResourceDownloadUrl(resource.id);
      if (response.success && response.data.downloadUrl) {
        // Create temporary link to force download
        const link = document.createElement('a');
        link.href = response.data.downloadUrl;
        link.download = resource.original_filename || resource.resource_name || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Error downloading resource:', err);
      alert(`Download failed: ${err.message || 'Please try again'}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-3xl font-bold ${theme.colors.text}`}>{t('counsellingResourcesTitle')}</h2>
        <Button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className={`${showUploadForm ? 'bg-red-500 hover:bg-red-600' : 'bg-cyan-500 hover:bg-cyan-600'} text-white`}
          disabled={isUploading}
        >
          <Plus className="w-4 h-4 mr-2" />
          {showUploadForm ? t('cancel') : t('addResource')}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {showUploadForm && (
        <Card className={`${theme.colors.card} border-2 border-cyan-500`}>
          <CardHeader>
            <CardTitle className={theme.colors.text}>{t('uploadNewResourceTitle')}</CardTitle>
            <CardDescription>{t('uploadNewResourceDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>Resource Name *</label>
              <input
                type="text"
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                placeholder="e.g., Worksheet - Anxiety Management"
                className={`w-full px-3 py-2 border rounded-lg ${theme.colors.card} ${theme.colors.text} focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                disabled={isUploading}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>Description (Optional)</label>
              <textarea
                value={resourceDesc}
                onChange={(e) => setResourceDesc(e.target.value)}
                placeholder="Describe what this resource covers..."
                rows="3"
                className={`w-full px-3 py-2 border rounded-lg ${theme.colors.card} ${theme.colors.text} focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                disabled={isUploading}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>Choose File *</label>
              <div
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-lg p-6 text-center ${isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} transition-colors ${
                  fileName ? 'border-green-500 bg-green-50' : 'border-cyan-300 hover:border-cyan-500 hover:bg-cyan-50'
                }`}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-cyan-500" />
                {fileName ? (
                  <>
                    <p className="font-medium text-green-700">{fileName}</p>
                    <p className={`text-sm ${theme.colors.muted}`}>Click to change file</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium">{t('clickToUpload')}</p>
                    <p className={`text-sm ${theme.colors.muted}`}>PDF, DOC, DOCX, PPT, PPTX, MP4, JPG, PNG, TXT (Max 50MB)</p>
                  </>
                )}
              </div>
              <input 
                ref={fileInputRef} 
                type="file" 
                onChange={handleFileSelect} 
                className="hidden" 
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.mp4" 
                disabled={isUploading}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleUpload} 
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {t('uploadResourceButton')}
                  </>
                )}
              </Button>
              <Button 
                onClick={() => { 
                  setShowUploadForm(false); 
                  setResourceName(''); 
                  setResourceDesc(''); 
                  setSelectedFile(null); 
                  setFileName(''); 
                }} 
                variant="outline" 
                className="flex-1"
                disabled={isUploading}
              >
                {t('clearButton')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-semibold ${theme.colors.text}`}>{t('yourResourcesLabel', { count: resources.length })}</h3>
        </div>

        {isLoading ? (
          <Card className={`${theme.colors.card} text-center py-12`}>
            <CardContent>
              <Loader className="w-12 h-12 mx-auto mb-4 text-cyan-500 animate-spin" />
              <p className={theme.colors.muted}>Loading resources...</p>
            </CardContent>
          </Card>
        ) : resources.length === 0 ? (
          <Card className={`${theme.colors.card} text-center py-12`}>
            <CardContent>
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className={theme.colors.muted}>No resources uploaded yet. Start by adding your first resource!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {resources.map((resource) => (
              <Card key={resource.id} className={`${theme.colors.card} hover:shadow-lg transition-all duration-300 border-0`}>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold ${theme.colors.text} truncate`}>
                        {resource.resource_name || resource.name}
                      </h4>
                      <p className={`text-sm ${theme.colors.muted} mt-1`}>
                        {resource.description || 'No description provided'}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-2">
                        <span className={theme.colors.muted}>
                          📅 {resource.created_at ? new Date(resource.created_at).toLocaleDateString() : resource.uploadedDate || 'N/A'}
                        </span>
                        <span className={theme.colors.muted}>
                          📄 {resource.file_type || resource.fileType || 'Unknown'}
                        </span>
                        {resource.file_size && (
                          <span className={theme.colors.muted}>
                            💾 {(resource.file_size / 1024).toFixed(2)} KB
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 ml-4 flex-shrink-0">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleView(resource)} 
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 w-full sm:w-auto px-3 py-2"
                      >
                        <Eye className="w-4 h-4 mr-2 inline-block" />
                        <span className="hidden sm:inline">{t('view') || 'View'}</span>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDelete(resource.id)} 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto px-3 py-2"
                      >
                        <Trash2 className="w-4 h-4 mr-2 inline-block" />
                        <span className="hidden sm:inline">{t('delete') || 'Delete'}</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
const CounsellorDashboard = () => {
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
      const saved = localStorage.getItem("sensee_counsellor_chat");
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
      localStorage.setItem("sensee_counsellor_chat", JSON.stringify(messages));
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
      localStorage.setItem("sensee_counsellor_conversation_history", JSON.stringify(next));
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
    localStorage.setItem("sensee_counsellor_chat", JSON.stringify(restored));
    setChatTab("chat");
  };

  const deleteHistory = id => {
    const next = conversationHistory.filter(h => h.id !== id);
    setConversationHistory(next);
    localStorage.setItem("sensee_counsellor_conversation_history", JSON.stringify(next));
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
              : theme.currentTheme === 'dark' ? 'bg-slate-700 text-white' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
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

  // Persist active tab so refresh keeps the same section
  useEffect(() => {
    try {
      const saved = localStorage.getItem('counsellor_active_tab');
      if (saved) setActiveTab(saved);
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('counsellor_active_tab', activeTab);
    } catch (e) {}
  }, [activeTab]);

  const sidebarContent = (
    <nav className="space-y-2">
      {[
        { key: 'overview', icon: Activity, label: t('overview') },
        { key: 'chatbot', icon: MessageCircle, label: t('aiCompanion') },
        { key: 'community', icon: Users, label: t('community') },
        { key: 'appointments', icon: Calendar, label: t('appointments') },
        { key: 'students', icon: Users, label: t('studentProgressTitle') },
        { key: 'resources', icon: Brain, label: t('resources') },
        { key: 'reports', icon: BarChart3, label: t('analytics') },
        { key: 'messages', icon: MessageCircle, label: t('messagesLabel') }
      ].map(({ key, icon: Icon, label }) => (
        <Button
          key={key}
          variant={activeTab === key ? 'animated' : 'ghost'}
          className={`w-full justify-start transition-all duration-200 ${activeTab === key
              ? ``
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
          <h2 className={`text-2xl md:text-4xl font-bold ${theme.colors.text} flex items-center whitespace-nowrap`}> 
            {t('counsellorWelcomeTitle')}
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 ml-2 text-yellow-500 animate-spin" style={{ animationDuration: '3s' }} />
          </h2>
          <p className={`${theme.colors.muted} mt-2 text-lg`}>{t('counsellorDashboardSubtitle')}</p>
        </div>
      </div>

      {/* Dashboard Stats - mobile: 2x2 boxes, desktop unchanged */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Calendar, label: t('pendingRequestsLabel'), value: '3', color: 'text-orange-500', bg: 'bg-orange-100' },
          { icon: Clock, label: t('todaysSessionsLabel'), value: '2', color: 'text-cyan-500', bg: 'bg-cyan-100' },
          { icon: CheckCircle, label: t('completedThisWeekLabel'), value: '8', color: 'text-green-500', bg: 'bg-green-100' },
          { icon: Users, label: t('activeStudentsLabel'), value: '24', color: 'text-purple-500', bg: 'bg-purple-100' }
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <Card key={label} className={`${theme.colors.card} hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${theme.colors.muted} font-medium`}>{label}</p>
                  <p className={`text-3xl font-bold ${theme.colors.text} mt-2`}>{value}</p>
                </div>
                <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions removed per design: Manage Appointments, Student Progress, Wellness Resources */}

      {/* Recent Activity - compact mobile-first rows (matches student layout) */}
      <Card className={`${theme.colors.card} border-0 shadow-xl`}>
        <CardHeader>
          <CardTitle className={`flex items-center ${theme.colors.text}`}>
            <Activity className="w-6 h-6 mr-2 text-cyan-500" />
            {t('recentActivityTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="md:hidden">
            <div className="divide-y">
              {[
                { message: 'New appointment request from Alex Johnson', time: '2 hours ago', status: 'pending' },
                { message: 'Completed session with Morgan Lee', time: '1 day ago', status: 'completed' },
                { message: 'Emma Davis requested to reschedule appointment', time: '2 days ago', status: 'action-needed' }
              ].map((activity, idx) => (
                <button key={idx} className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-start space-x-3" >
                  <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{background: activity.status === 'pending' ? '#fb923c' : activity.status === 'completed' ? '#34d399' : '#f59e0b'}} />
                  <div className="min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium truncate ${theme.colors.text}`}>{activity.message}</h4>
                      <span className={`text-xs ${theme.colors.muted} ml-2 whitespace-nowrap`}>{activity.time}</span>
                    </div>
                    <p className={`text-sm ${theme.colors.muted} mt-1 truncate`}> </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop: slightly richer layout */}
          <div className="hidden md:block">
            <div className="space-y-4">
              {[
                { message: 'New appointment request from Alex Johnson', time: '2 hours ago', status: 'pending' },
                { message: 'Completed session with Morgan Lee', time: '1 day ago', status: 'completed' },
                { message: 'Emma Davis requested to reschedule appointment', time: '2 days ago', status: 'action-needed' }
              ].map((activity, idx) => (
                <div key={idx} className={`flex items-start space-x-4 p-4 ${theme.colors.secondary} rounded-xl hover:shadow-lg transition-all duration-200`}>
                  <div className={`w-3 h-3 rounded-full mt-2 ${activity.status === 'pending' ? 'bg-orange-500' : activity.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <div className="flex-1">
                    <p className={`font-medium ${theme.colors.text}`}>{activity.message}</p>
                    <p className={`text-sm ${theme.colors.muted} mt-1`}>{activity.time}</p>
                  </div>
                  {activity.status === 'pending' && (
                    <Badge className="bg-orange-100 text-orange-700">Action Required</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Announcements - match Student Dashboard mobile-first compact rows */}
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
                <p className={`${theme.colors.muted} text-sm`}>No recent announcements.</p>
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
                  <p className={`${theme.colors.muted} text-lg`}>No recent announcements. Check back later!</p>
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
                      <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">New</Badge>
                      <span className={`text-xs ${theme.colors.muted}`}>{announcement.views} views</span>
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

  const renderStudentProgress = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl md:text-3xl font-bold ${theme.colors.text} truncate whitespace-nowrap`}>{t('studentProgressTracking')}</h2>

      <div className="grid gap-4">
        {[
          { name: 'Jordan Smith', id: 'SID-8a7b-e4c1', sessions: 4, lastSession: '2 days ago', progress: 'Excellent', trend: 'up' },
          { name: 'Taylor Wilson', id: 'SID-f2d1-c5e9', sessions: 2, lastSession: '1 week ago', progress: 'Good', trend: 'stable' },
          { name: 'Morgan Lee', id: 'SID-a9c3-b8d2', sessions: 6, lastSession: '1 day ago', progress: 'Very Good', trend: 'up' }
        ].map((student) => (
          <Card
            key={student.id}
            tabIndex={0}
            onClick={() => {}}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); /* placeholder for action */ } }}
            className={`${theme.colors.card} hover:shadow-2xl transition-transform duration-150 hover:scale-[1.008] border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-300`}
          >
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-base md:text-lg truncate ${theme.colors.text}`}>{student.name}</h3>
                  <p className={`text-sm ${theme.colors.muted} truncate mt-1`}>ID: {student.id}</p>

                  <div className={`flex flex-wrap gap-2 text-sm ${theme.colors.muted} mt-2`}>
                    <div className="px-1.5 py-0.5 bg-transparent rounded-md">
                      <span className="font-medium">{student.sessions}</span>
                      <span className="ml-1">sessions</span>
                    </div>
                    <div className="px-1.5 py-0.5 bg-transparent rounded-md truncate">Last: {student.lastSession}</div>
                  </div>
                </div>

                <div className="flex-shrink-0 text-right flex flex-col items-end">
                  <Badge className={`px-2 py-0.5 text-sm ${student.progress === 'Excellent' ? 'bg-green-100 text-green-800' : student.progress === 'Very Good' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {student.progress}
                  </Badge>
                  <div className="mt-1">
                    {student.trend === 'up' ? (
                      <div className="text-green-600 text-sm">Improving</div>
                    ) : (
                      <div className="text-gray-600 text-sm">Stable</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
<TabsList 
  className="grid grid-cols-3 w-full"
  style={theme.currentTheme === 'dark' ? { backgroundColor: 'rgb(30 41 59)' } : {}}
>

            <TabsTrigger value="chat">💬 Chat</TabsTrigger>
            <TabsTrigger value="voice">🎙️ Voice</TabsTrigger>
            <TabsTrigger value="history">📜 History</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="chat-panel">
            <div
              ref={messagesContainerRef}
              className={`chat-messages border rounded-xl ${theme.currentTheme === 'dark' ? 'bg-slate-800' : `bg-gradient-to-br ${theme.colors.secondary}`}`}
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

            <div className={`chat-input-bar ${theme.currentTheme === 'dark' ? 'bg-slate-800' : 'bg-slate-800'}`}>
              <div className="chat-input-inner">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className={`flex-1 p-2 sm:p-3 border rounded-xl focus:ring-2 focus:ring-cyan-500 resize-none text-sm sm:text-base ${theme.currentTheme === 'dark' ? 'bg-slate-700 text-white' : 'bg-white'}`}
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

          <TabsContent value="history" className={`flex-1 overflow-hidden ${theme.currentTheme === 'dark' ? 'bg-slate-800' : ''}`}>
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

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'chatbot':
        return renderChatbot();
      case 'community':
        return <CommunityView userRole="counsellor" />;
      case 'appointments':
        return <CounsellorAppointments />;
      case 'students':
        return renderStudentProgress();
      case 'resources':
        return <CounsellorResourcesSection theme={theme} />;
      case 'reports':
        return (
          <div className="space-y-6">
            <h2 className={`text-3xl font-bold ${theme.colors.text}`}>Reports & Analytics</h2>
            <Card className={`${theme.colors.card} border-0 shadow-xl`}>
              <CardContent className="p-8 text-center">
                <BarChart3 className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
                <p className={`${theme.colors.muted} text-lg`}>Analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'messages':
        return <DirectMessages userRole="counsellor" />;
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

export default CounsellorDashboard;