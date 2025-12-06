import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@components/layout/DashboardLayout';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
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
  User,
  Loader,
  Upload,
  Download,
  Trash2,
  Plus,
  Eye
} from 'lucide-react';
import CounsellorAppointments from '@components/appointments/CounsellorAppointments';
import { mockAnnouncements } from '@data/mocks/announcements';
import { mockCommunityChats, mockAppointments } from '@mock/mockData';
import { useAnnouncements } from '@context/AnnouncementContext';
import CommunityView from '@components/community/CommunityView';
import DirectMessages from '@components/community/DirectMessages';
import { generateHistoryTitle } from '@lib/utils';
import { getAllResources, uploadResource, deleteResource, getResourceDownloadUrl } from '@services/resourceService';


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

    // Load counsellor chat history
    useEffect(() => {
      try {
        const raw = localStorage.getItem('counsellor_ai_history_v1');
        if (raw) setChatHistory(JSON.parse(raw));
      } catch (e) {
        console.warn('Failed to load counsellor chat history', e);
      }
    }, []);

    useEffect(() => {
      // Add initial bot greeting only for tablet/desktop (md+)
      const greeting = {
        id: 1,
        text: "Hello! I'm your AI wellness companion. How are you feeling today? I'm here to listen and support you on your wellness journey. 💙",
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

    const persistHistory = (history) => {
      try {
        localStorage.setItem('counsellor_ai_history_v1', JSON.stringify(history));
      } catch (e) {
        console.warn('Failed to save counsellor chat history', e);
      }
    };

    const handleNewCounsellorChat = () => {
      // Save current conversation to history if non-empty
      if (messages && messages.length > 0) {
        const entry = {
          id: `c${Date.now()}`,
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

    // Voice recording (counsellor)
    const startRecording = async () => {
      try {
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
      } catch (e) {
        console.error('Recording failed', e);
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
  
    // quickResponses removed to avoid storing or showing preset messages

  const [activeTab, setActiveTab] = useState('overview');
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { getRecentAnnouncements, incrementViews } = useAnnouncements();

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
          variant={activeTab === key ? 'default' : 'ghost'}
          className={`w-full justify-start transition-all duration-200 hover:scale-105 ${activeTab === key
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
              <button aria-label="New chat" title={t('newChat') || 'New Chat'} onClick={handleNewCounsellorChat} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
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

        {/* Preset quick responses removed intentionally */}

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