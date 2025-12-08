import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@context/LanguageContext';
import { useTheme } from '@context/ThemeContext';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Plus, Mic, Send, ChevronDown, Trash2 } from 'lucide-react';
import ThemeLanguageSelector from '@components/shared/ThemeLanguageSelector';

const AICompanion = () => {
  const { t } = useLanguage();
  const { theme, currentTheme } = useTheme();
  const isMidnight = currentTheme === 'midnight';
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [showChatsPanel, setShowChatsPanel] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const userId = typeof window !== "undefined"
    ? window.localStorage.getItem("sensee_user_id")
    : null;

  console.log('[AICompanion] Initialized with userId:', userId, 'backendUrl:', backendUrl);

  // Helper to get auth headers with JWT token
  const getAuthHeaders = () => {
    const token = typeof window !== "undefined" 
      ? window.localStorage.getItem("authToken") 
      : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  const currentChat = chats.find(c => c.id === currentChatId) || null;

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) {
      requestAnimationFrame(() => {
        try {
          el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
        } catch (e) {
          el.scrollTop = el.scrollHeight;
        }
      });
      return;
    }

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [currentChatId, chats]);

  // Load chats from backend on mount
  useEffect(() => {
    if (!userId) return;
    
    const fetchConversations = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/api/ai/conversations?userId=${userId}&limit=10`,
          { 
            headers: getAuthHeaders(),
            credentials: 'include'
          }
        );
        if (!res.ok) throw new Error("Failed to fetch conversations");
        const data = await res.json();
        
        const formattedChats = (data.conversations || []).map(conv => ({
          id: conv.id,
          conversationId: conv.id,
          title: conv.title || `Chat ${new Date(conv.created_at).toLocaleDateString()}`,
          messages: [],
          created_at: conv.created_at
        }));
        
        setChats(formattedChats);
        if (formattedChats.length > 0) {
          setCurrentChatId(formattedChats[0].id);
        }
      } catch (e) {
        console.warn('Failed to load chats from backend', e);
      }
    };

    fetchConversations();
  }, [userId, backendUrl]);

  const handleNewChat = async () => {
    if (!userId) {
      console.error("No userId for new chat");
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/api/ai/conversations`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          userId,
          title: `${t('newMessage') || 'New Chat'}`
        })
      });

      if (!res.ok) throw new Error("Failed to create chat");
      const data = await res.json();
      
      const newChat = {
        id: data.id || data.conversationId,
        conversationId: data.id || data.conversationId,
        title: data.title || `${t('newMessage') || 'New Chat'}`,
        messages: [],
        created_at: new Date().toISOString()
      };
      
      setChats(prev => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      setShowChatsPanel(false);
      setInput('');
    } catch (e) {
      console.error('Failed to create new chat', e);
    }
  };

  const handleSelectChat = async (id) => {
    setCurrentChatId(id);
    setShowChatsPanel(false);
    
    // Load messages for this chat from backend
    try {
      const res = await fetch(
        `${backendUrl}/api/ai/messages?conversationId=${id}&userId=${userId}`,
        { 
          headers: getAuthHeaders(),
          credentials: 'include'
        }
      );
      if (!res.ok) throw new Error("Failed to load messages");
      const data = await res.json();
      
      const formattedMessages = (data.messages || []).map(m => ({
        id: m.id,
        role: m.sender === 'ai' || m.sender === 'assistant' ? 'assistant' : 'user',
        text: m.message,
        time: new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        type: 'text'
      }));
      
      setChats(prev => prev.map(c => 
        c.id === id ? { ...c, messages: formattedMessages } : c
      ));
    } catch (e) {
      console.warn('Failed to load chat messages', e);
    }
  };

  // ----- NEW: send through backend -----
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    if (!userId) {
      console.error("No userId (sensee_user_id) for AICompanion");
      return;
    }

    let chatId = currentChatId;
    
    // Create new chat if needed
    if (!chatId) {
      try {
        const res = await fetch(`${backendUrl}/api/ai/conversations`, {
          method: "POST",
          headers: getAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify({
            userId,
            title: `${t('newMessage') || 'New Chat'}`
          })
        });

        if (!res.ok) throw new Error("Failed to create chat");
        const data = await res.json();
        
        chatId = data.id || data.conversationId;
        const newChat = {
          id: chatId,
          conversationId: chatId,
          title: data.title || `${t('newMessage') || 'New Chat'}`,
          messages: [],
          created_at: new Date().toISOString()
        };
        
        setChats(prev => [newChat, ...prev]);
        setCurrentChatId(chatId);
      } catch (e) {
        console.error('Failed to create chat on send', e);
        return;
      }
    }

    const text = input.trim();
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const userMsgId = `m${Date.now()}`;
    
    setInput('');
    setIsLoading(true);

    // Show user message immediately
    setChats(prev => prev.map(c => {
      if (c.id !== chatId) return c;
      return {
        ...c,
        messages: [
          ...c.messages,
          { 
            id: userMsgId, 
            role: 'user', 
            text, 
            time, 
            type: 'text' 
          }
        ]
      };
    }));

    try {
      // Send message to backend
      const res = await fetch(`${backendUrl}/api/ai/chat`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          userId,
          conversationId: chatId,
          message: text
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Backend error:', res.status, errText);
        throw new Error(`Backend error: ${res.status}`);
      }
      
      const data = await res.json();
      const botText = data.reply || "I'm here with you. Tell me more about how you're feeling.";

      // Add bot response
      setChats(prev => prev.map(c => {
        if (c.id !== chatId) return c;
        return {
          ...c,
          conversationId: data.conversationId || chatId,
          messages: [
            ...c.messages,
            {
              id: `m${Date.now()}`,
              role: 'assistant',
              text: botText,
              time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              type: 'text'
            }
          ]
        };
      }));
    } catch (err) {
      console.error("AICompanion chat error", err);
      setChats(prev => prev.map(c => {
        if (c.id !== chatId) return c;
        return {
          ...c,
          messages: [
            ...c.messages,
            {
              id: `m${Date.now()}`,
              role: 'assistant',
              text: "Sorry, I'm having trouble connecting. Please try again.",
              time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              type: 'text'
            }
          ]
        };
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      const chunks = [];
      mr.ondataavailable = e => chunks.push(e.data);
      mr.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        
        // Send to backend for transcription
        if (!userId) {
          console.error("No userId for voice message");
          return;
        }

        let chatId = currentChatId;
        if (!chatId) {
          try {
            const res = await fetch(`${backendUrl}/api/ai/conversations`, {
              method: "POST",
              headers: getAuthHeaders(),
              credentials: 'include',
              body: JSON.stringify({
                userId,
                title: `${t('newMessage') || 'New Chat'}`
              })
            });

            if (!res.ok) throw new Error("Failed to create chat");
            const data = await res.json();
            chatId = data.id || data.conversationId;
            
            const newChat = {
              id: chatId,
              conversationId: chatId,
              title: data.title || `${t('newMessage') || 'New Chat'}`,
              messages: [],
              created_at: new Date().toISOString()
            };
            
            setChats(prev => [newChat, ...prev]);
            setCurrentChatId(chatId);
          } catch (e) {
            console.error('Failed to create chat for voice', e);
            stream.getTracks().forEach(t => t.stop());
            return;
          }
        }

        try {
          const formData = new FormData();
          formData.append('audio', blob, 'audio.webm');
          formData.append('userId', userId);

          const token = typeof window !== "undefined" 
            ? window.localStorage.getItem("authToken") 
            : null;

          const res = await fetch(`${backendUrl}/api/ai/voice`, {
            method: "POST",
            headers: {
              ...(token && { 'Authorization': `Bearer ${token}` })
            },
            credentials: 'include',
            body: formData
          });

          if (!res.ok) throw new Error("Failed to send voice message");
          const data = await res.json();

          setChats(prev => prev.map(c => {
            if (c.id !== chatId) return c;
            const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const updatedMessages = [
              ...c.messages,
              {
                id: `m${Date.now()}`,
                role: 'user',
                text: data.transcribedText || '[Voice message]',
                time,
                type: 'audio'
              }
            ];

            // Add bot response if provided
            if (data.botResponse) {
              updatedMessages.push({
                id: `m${Date.now() + 1}`,
                role: 'assistant',
                text: data.botResponse,
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                type: 'text'
              });
            }

            return {
              ...c,
              conversationId: data.conversationId || chatId,
              messages: updatedMessages
            };
          }));
        } catch (e) {
          console.error('Voice message failed', e);
        }

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

  const deleteChat = async (chatId) => {
    if (!userId) return;
    
    try {
      const res = await fetch(
        `${backendUrl}/api/ai/conversations/${chatId}?userId=${userId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
          credentials: 'include'
        }
      );

      if (!res.ok) throw new Error("Failed to delete chat");

      setChats(prev => prev.filter(c => c.id !== chatId));
      if (currentChatId === chatId) {
        setCurrentChatId(prev => {
          const remaining = chats.filter(c => c.id !== chatId);
          return remaining[0]?.id || null;
        });
      }
    } catch (e) {
      console.error('Failed to delete chat', e);
    }
  };

  return (
    <div className={`chat-shell ${theme.colors.background} ${theme.colors.card}`}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-semibold ${theme.colors.text}`}>{t('aiCompanion') || 'AI Companion'}</h2>
          <div className="flex items-center space-x-2">
            <button aria-label="New chat" title={t('newChat') || 'New Chat'} onClick={handleNewChat} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" disabled={!userId}>
              <Plus className="w-5 h-5" />
            </button>

            <button aria-label="Show history" title={t('showHistory') || 'History'} onClick={() => setShowChatsPanel(s => !s)} className="p-2 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800 relative" disabled={!userId}>
              <ChevronDown className="w-5 h-5" />

              {/* history dropdown intentionally left empty; full history panel rendered below header */}
            </button>
          </div>
        </div>
      </div>

      {showChatsPanel && (
        <div className={`w-full border-b ${isMidnight ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="max-w-4xl mx-auto px-4 py-3">
            {chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-24 text-center p-4">
                <p className="text-sm text-gray-500">{t('noConversationsFound') || 'No conversations found'}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {chats.map(c => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectChat(c.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all ${isMidnight ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' : 'bg-white border-gray-100 hover:bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm mb-1 ${isMidnight ? 'text-gray-200' : 'text-gray-800'}`}>{c.title}</p>
                        <p className="text-xs text-gray-500 truncate">{c.messages[c.messages.length - 1]?.text || (c.messages[c.messages.length - 1]?.type === 'audio' ? 'Voice message' : '')}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteChat(c.id); }}
                        className="ml-3 p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
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
        </div>
      )}

      {/* Messages */}
      <div ref={messagesContainerRef} className="chat-messages bg-gradient-to-b from-cyan-50 to-blue-50 dark:from-cyan-900 dark:to-blue-900">
        <div className="space-y-4 max-w-4xl mx-auto w-full px-2 sm:px-4">
          {!userId && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <h3 className="text-lg font-medium mb-2 text-red-600">
                {t('notLoggedIn') || 'Not Logged In'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {t('pleaseLoginToUseAI') || 'Please log in to use the AI Companion'}
              </p>
            </div>
          )}
          {userId && !currentChat && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <h3 className={`text-lg font-medium mb-2 ${theme.colors.text}`}>
                {t('welcomeToAICompanion') || 'Welcome to AI Companion'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {t('startNewChatMessage') || 'Click the + button to start a new conversation'}
              </p>
            </div>
          )}
          {currentChat?.messages?.map(msg => (
            <div key={msg.id} className={`max-w-[85%] ${msg.role === 'user' ? 'ml-auto text-right' : 'mr-auto text-left'}`}>
              <div className={`chat-bubble inline-block px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : isMidnight ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900 border border-gray-200'}`}>
                {msg.type === 'audio' ? (
                  <audio controls className="w-56 sm:w-96">
                    <source src={msg.audioUrl} />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  msg.text
                )}
              </div>
              <div className="text-xs text-gray-400 mt-1">{msg.time}</div>
            </div>
          ))}
          
          {isLoading && currentChat && (
            <div className="max-w-[85%] mr-auto text-left">
              <div className="chat-bubble inline-block px-4 py-2 rounded-lg bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="chat-input-bar bg-white dark:bg-gray-900">
        <div className="chat-input-inner">
          <Input
            placeholder={t('typeMessagePlaceholder') || 'Type your message...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 text-sm sm:text-base h-10"
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          />
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              className="icon-tap rounded-full bg-blue-600 text-white w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title={isLoading ? 'Sending...' : 'Send message'}
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              aria-label={isRecording ? 'Stop recording' : 'Voice message'}
              onClick={() => { isRecording ? stopRecording() : startRecording(); }}
              className={`icon-tap rounded-full w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl' : isMidnight ? 'bg-slate-700 hover:bg-slate-600 text-blue-400 shadow-sm hover:shadow-md' : 'bg-gray-200 hover:bg-gray-300 text-blue-600 shadow-sm hover:shadow-md'}`}
              title={isRecording ? 'Stop recording' : 'Voice message'}
            >
              <Mic className={`w-4 h-4 sm:w-5 sm:h-5 ${isRecording ? 'animate-pulse' : ''}`} />
            </button>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2 px-4">
          <p className="mb-1">💡 Our chatbot can make mistakes</p>
          <p>🔒 To keep your chats private, turn on incognito mode</p>
        </div>
      </div>
    </div>
  );
};

export default AICompanion;
