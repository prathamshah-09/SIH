import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@context/LanguageContext';
import { useTheme } from '@context/ThemeContext';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Plus, Mic, Send, ChevronDown, Trash2 } from 'lucide-react';
import ThemeLanguageSelector from '@components/shared/ThemeLanguageSelector';
import { generateHistoryTitle } from '@lib/utils';

// Start with no pre-filled chats (remove hard-coded stored messages)

const AICompanion = () => {
  const { t } = useLanguage();
  const { theme, currentTheme } = useTheme();
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [showChatsPanel, setShowChatsPanel] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const STORAGE_KEY = 'ai_companion_chats_v1';

  const currentChat = chats.find(c => c.id === currentChatId) || null;

  useEffect(() => {
    // Prefer scrolling the messages container to bottom so the chat stays within the viewport
    const el = messagesContainerRef.current;
    if (el) {
      // allow DOM update then jump/animate to bottom
      requestAnimationFrame(() => {
        try {
          el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
        } catch (e) {
          // fallback
          el.scrollTop = el.scrollHeight;
        }
      });
      return;
    }

    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [currentChatId, chats]);

  // Load chats from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.chats) setChats(parsed.chats);
        if (parsed?.currentChatId) setCurrentChatId(parsed.currentChatId);
      }
    } catch (e) {
      console.warn('Failed to load saved chats', e);
    }
  }, []);

  // Persist chats whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ chats, currentChatId }));
    } catch (e) {
      console.warn('Failed to save chats', e);
    }
  }, [chats, currentChatId]);

  const handleNewChat = () => {
    const id = `c${Date.now()}`;
    const newChat = { id, title: `${t('newMessage') || 'New Chat'}`, messages: [] };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(id);
    setShowChatsPanel(false);
  };

  const handleSelectChat = (id) => {
    setCurrentChatId(id);
    setShowChatsPanel(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // If no chat selected, create one
    let chatId = currentChatId;
    if (!chatId) {
      chatId = `c${Date.now()}`;
      const newChat = { id: chatId, title: `${t('newMessage') || 'New Chat'}`, messages: [] };
      setChats(prev => [newChat, ...prev]);
      setCurrentChatId(chatId);
    }

    const newMessage = { id: `m${Date.now()}`, role: 'user', text: input.trim(), time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), type: 'text' };
    setChats(prev => prev.map(c => {
      if (c.id !== chatId) return c;
      const updatedMessages = [...c.messages, newMessage];
      const updated = { ...c, messages: updatedMessages };
      const defaultTitle = t('newMessage') || 'New Chat';
      if (!c.title || c.title === defaultTitle) {
        updated.title = generateHistoryTitle(updatedMessages, 3);
      }
      return updated;
    }));
    setInput('');
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
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        // add as audio message
        let chatId = currentChatId;
        if (!chatId) {
          chatId = `c${Date.now()}`;
          const newChat = { id: chatId, title: `${t('newMessage') || 'New Chat'}`, messages: [] };
          setChats(prev => [newChat, ...prev]);
          setCurrentChatId(chatId);
        }
        const audioMsg = { id: `m${Date.now()}`, role: 'user', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), type: 'audio', audioUrl: url };
        setChats(prev => prev.map(c => {
          if (c.id !== chatId) return c;
          const updatedMessages = [...c.messages, audioMsg];
          const updated = { ...c, messages: updatedMessages };
          const defaultTitle = t('newMessage') || 'New Chat';
          if (!c.title || c.title === defaultTitle) updated.title = generateHistoryTitle(updatedMessages, 3);
          return updated;
        }));
        // stop tracks
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

  return (
    <div className={`chat-shell ${theme.colors.background} ${theme.colors.card}`}>
      {/* Header - fixed */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-semibold ${theme.colors.text}`}>{t('aiCompanion') || 'AI Companion'}</h2>
          <div className="flex items-center space-x-2">
            <button aria-label="New chat" title={t('newChat') || 'New Chat'} onClick={handleNewChat} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <Plus className="w-5 h-5" />
            </button>

            <button aria-label="Show history" title={t('showHistory') || 'History'} onClick={() => setShowChatsPanel(s => !s)} className="p-2 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800 relative">
              <ChevronDown className="w-5 h-5" />

              {showChatsPanel && (
                <div className="absolute right-0 mt-2 w-64 max-h-72 overflow-auto bg-white dark:bg-gray-800 shadow-lg border rounded-md p-2 z-40">
                  {chats.length === 0 && <div className="p-2 text-sm text-gray-500">{t('noConversationsFound') || 'No conversations found'}</div>}
                  {chats.map(c => (
                    <div key={c.id} className="w-full flex items-center justify-between p-1 rounded">
                      <button onClick={() => handleSelectChat(c.id)} className="flex-1 text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                        <div className="text-sm font-medium truncate" title={c.title}>{c.title}</div>
                        <div className="text-[11px] text-gray-500 truncate">{c.messages[c.messages.length - 1]?.text || (c.messages[c.messages.length - 1]?.type === 'audio' ? 'Voice message' : '')}</div>
                      </button>
                      <button onClick={() => {
                        // delete chat
                        setChats(prev => prev.filter(x => x.id !== c.id));
                        if (currentChatId === c.id) setCurrentChatId(prev => {
                          const remaining = chats.filter(x => x.id !== c.id);
                          return remaining[0]?.id || null;
                        });
                      }} aria-label="Delete chat" className="ml-2 p-1 rounded hover:bg-red-50 text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Messages container - scrollable with fixed height, cyan/blue background */}
      <div ref={messagesContainerRef} className="chat-messages bg-gradient-to-b from-cyan-50 to-blue-50 dark:from-cyan-900 dark:to-blue-900">
        <div className="space-y-4 max-w-3xl mx-auto w-full px-2 sm:px-4">
          {currentChat?.messages?.map(msg => (
            <div key={msg.id} className={`max-w-[85%] ${msg.role === 'user' ? 'ml-auto text-right' : 'mr-auto text-left'}`}>
              <div className={`chat-bubble inline-block px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'}`}>
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

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar — fixed at bottom */}
      <div
        className="chat-input-bar"
        style={{
          backgroundColor: currentTheme === 'midnight' ? '#0f172a' : '#ffffff',
          borderTop: `1px solid ${currentTheme === 'midnight' ? '#1f2937' : '#e0f2fe'}`
        }}
      >
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
              disabled={!input.trim()}
              className="icon-tap rounded-full bg-blue-600 text-white w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Send message"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              aria-label={isRecording ? 'Stop recording' : 'Voice message'}
              onClick={() => { isRecording ? stopRecording() : startRecording(); }}
              className={`icon-tap rounded-full w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center transition-all hover:shadow-lg ${isRecording ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              title={isRecording ? 'Stop recording' : 'Voice message'}
            >
              <Mic className={`w-4 h-4 sm:w-5 sm:h-5 ${isRecording ? 'text-white' : 'text-blue-600'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICompanion;
