import React, { useState, useEffect } from 'react';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog';
import {
  Send,
  MessageCircle,
  Plus,
  X,
  Clock,
  CheckCircle,
  Circle,
  Search,
  Phone,
  User,
  ArrowLeft,
  MoreVertical,
  Mic,
} from 'lucide-react';
import { mockCounsellors, mockUsers, mockStudents } from '@mock/mockData';

// Ephemeral conversations (no persistence). TODO: Replace with backend chat service.
let ephemeralConversations = [];

const getConversations = () => [...ephemeralConversations];
const saveConversations = (conversations) => { ephemeralConversations = conversations; };

// NOTE: In real app this comes from auth; use mock users for now

const DirectMessages = ({ userRole = 'student' }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = React.useRef(null);
  const streamRef = React.useRef(null);
  // derive current user from role (mock)
  const currentUser = userRole === 'student' ? mockUsers.student : mockUsers.counsellor;

  // Load conversations on mount
  useEffect(() => {
    setConversations(getConversations());
    setLoading(false);
  }, []);

  // Filter conversations based on current user role
  const filteredConversations = conversations.filter(conv => {
    if (userRole === 'student') {
      return conv.studentId === currentUser.id;
    } else {
      return conv.counsellorId === currentUser.id;
    }
  });

  const searchedConversations = filteredConversations.filter(conv => {
    const otherParty = userRole === 'student'
      ? mockCounsellors.find(c => c.id === conv.counsellorId)
      : { name: conv.studentName, id: conv.studentId };
    return otherParty?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Send message handler
  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    const updated = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            {
              id: `msg_${Date.now()}`,
              sender: currentUser.id,
              senderName: currentUser.name,
              senderRole: userRole,
              content: messageText,
              timestamp: new Date().toISOString(),
              read: false,
            }
          ],
          lastMessage: messageText,
          lastMessageTime: new Date().toISOString(),
        };
      }
      return conv;
    });

    setConversations(updated);
    saveConversations(updated);
    setMessageText('');
  };

  // Audio recording handlers
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
        handleSendAudioMessage(url);
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

  const handleSendAudioMessage = (audioUrl) => {
    if (!selectedConversation) return;

    const updated = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            {
              id: `msg_${Date.now()}`,
              sender: currentUser.id,
              senderName: currentUser.name,
              senderRole: userRole,
              content: 'Audio message',
              audioUrl: audioUrl,
              type: 'audio',
              timestamp: new Date().toISOString(),
              read: false,
            }
          ],
          lastMessage: 'Audio message',
          lastMessageTime: new Date().toISOString(),
        };
      }
      return conv;
    });
    setConversations(updated);
    // update selected conversation
    setSelectedConversation(updated.find(c => c.id === selectedConversation.id));
  };

  // Start new conversation
  const handleStartConversation = (counsellor) => {
    const existingConv = conversations.find(
      c => c.studentId === currentUser.id && c.counsellorId === counsellor.id
    );

    if (existingConv) {
      setSelectedConversation(existingConv);
      setIsNewChatOpen(false);
      return;
    }

    const newConversation = {
      id: `conv_${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      counsellorId: counsellor.id,
      counsellorName: counsellor.name,
      messages: [],
      lastMessage: '',
      lastMessageTime: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const updated = [...conversations, newConversation];
    setConversations(updated);
    saveConversations(updated);
    setSelectedConversation(newConversation);
    setIsNewChatOpen(false);
  };

  // For counsellors: start conversation with a student
  const handleStartConversationWithStudent = (student) => {
    const existingConv = conversations.find(
      c => c.studentId === student.id && c.counsellorId === currentUser.id
    );

    if (existingConv) {
      setSelectedConversation(existingConv);
      setIsNewChatOpen(false);
      return;
    }

    const newConversation = {
      id: `conv_${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      counsellorId: currentUser.id,
      counsellorName: currentUser.name,
      messages: [],
      lastMessage: '',
      lastMessageTime: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const updated = [...conversations, newConversation];
    setConversations(updated);
    saveConversations(updated);
    setSelectedConversation(newConversation);
    setIsNewChatOpen(false);
  };

  const getOtherPartyInfo = () => {
    if (!selectedConversation) return null;
    if (userRole === 'student') {
      return mockCounsellors.find(c => c.id === selectedConversation.counsellorId);
    }
    return {
      id: selectedConversation.studentId,
      name: selectedConversation.studentName,
      isAvailable: true,
    };
  };

  const otherPartyInfo = getOtherPartyInfo();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Chat view
  if (selectedConversation) {
    return (
      <div className="space-y-6 h-screen flex flex-col">
        {/* Header */}
        <Card className={`${theme.colors.card} border-0 shadow-lg`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {otherPartyInfo?.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${theme.colors.text}`}>{otherPartyInfo?.name}</h3>
                    <div className="flex items-center space-x-1">
                      {otherPartyInfo?.isAvailable ? (
                        <>
                          <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                          <span className="text-xs text-green-600">Online</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-2 h-2 text-gray-400" />
                          <span className="text-xs text-gray-500">Offline</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled={!otherPartyInfo?.isAvailable}>
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages Area */}
        <Card className={`${theme.colors.card} border-0 shadow-lg flex-1 flex flex-col overflow-hidden`}>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedConversation.messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className={theme.colors.muted}>{t('noMessagesYet')}</p>
                </div>
              </div>
            ) : (
              selectedConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === currentUser.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.sender === currentUser.id
                        ? 'bg-blue-500 text-white'
                        : `${theme.colors.secondary} ${theme.colors.text}`
                    }`}
                  >
                    {msg.sender !== currentUser.id && (
                      <p className="text-xs font-semibold mb-1 opacity-75">{msg.senderName}</p>
                    )}
                    {msg.type === 'audio' ? (
                      <audio controls className="w-full max-w-xs">
                        <source src={msg.audioUrl} />
                        Your browser does not support the audio element.
                      </audio>
                    ) : (
                      <p className="break-words text-sm">{msg.content}</p>
                    )}
                    <div className="flex items-center justify-end space-x-1 mt-1 text-xs opacity-75">
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.sender === currentUser.id && msg.read && (
                        <CheckCircle className="w-3 h-3" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-3 items-end">
              <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={t('typeMessagePlaceholder')}
                className="flex-1 min-h-[50px] resize-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <div className="flex space-x-2 items-center">
                <Button
                  onClick={() => isRecording ? stopRecording() : startRecording()}
                  className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                  title={isRecording ? 'Stop recording' : 'Send voice message'}
                >
                  <Mic className={`w-4 h-4 ${isRecording ? 'text-white' : 'text-gray-700'}`} />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Conversations List view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-semibold ${theme.colors.text} flex items-center gap-3`}>
            <span className={`text-xl font-semibold mr-2`}>Direct</span>
            <span className={`text-xl font-semibold truncate`}>{t('messagesLabel')}</span>
            {userRole === 'counsellor' && (
              <MessageCircle className="w-7 h-7 ml-2 text-blue-500 animate-pulse" />
            )}
          </h2>
          <p className={`${theme.colors.muted} mt-2 text-base`}>
            {userRole === 'counsellor' ? '1-to-1 conversations with students' : t('directMessagesDesc')}
          </p>
        </div>

        <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-xl text-white transition-all duration-300 hover:scale-105">
              <Plus className="w-4 h-4 mr-2" />
              New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-500" />
                {userRole === 'student' ? (t('selectCounsellor') || 'Select a Counsellor') : (t('selectStudent') || 'Select a Student')}
              </DialogTitle>
              <DialogDescription>
                {userRole === 'student'
                  ? (t('selectCounsellorDesc') || 'Choose a counsellor to start a direct message conversation.')
                  : (t('selectStudentDesc') || 'Choose a student to start a direct message conversation.')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {userRole === 'student' ? (
                mockCounsellors.map((counsellor) => (
                  <button
                    key={counsellor.id}
                    onClick={() => handleStartConversation(counsellor)}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${`${theme.colors.card} border-gray-200 hover:border-blue-300`}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {counsellor.name.charAt(0)}
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className={`font-semibold ${theme.colors.text}`}>{counsellor.name}</h4>
                        <p className={`text-sm ${theme.colors.muted}`}>{counsellor.specialization}</p>
                        {counsellor.isAvailable && (
                          <Badge className="mt-1 bg-green-100 text-green-800 text-xs">Available</Badge>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                mockStudents.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => handleStartConversationWithStudent(student)}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${`${theme.colors.card} border-gray-200 hover:border-blue-300`}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className={`font-semibold ${theme.colors.text}`}>{student.name}</h4>
                        <p className={`text-sm ${theme.colors.muted}`}>{student.email}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder={t('searchConversationsPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Conversations List */}
      {searchedConversations.length === 0 ? (
        <Card className={`${theme.colors.card} text-center shadow-lg`}>
          <CardContent className="p-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className={`text-xl font-semibold mb-2 ${theme.colors.text}`}>
              {searchQuery ? t('noConversationsFound') || 'No conversations found' : t('noDirectMessages')}
            </h3>
            <p className={`${theme.colors.muted} mb-6`}>
              {userRole === 'student'
                ? t('startConversationCounsellor')
                : t('noIncomingMessagesYet')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {searchedConversations.map((conv) => {
            const otherParty = userRole === 'student'
              ? mockCounsellors.find(c => c.id === conv.counsellorId)
              : { name: conv.studentName, id: conv.studentId };

            return (
              <Card
                key={conv.id}
                className={`${theme.colors.card} cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-102 border-0 shadow-md`}
                onClick={() => setSelectedConversation(conv)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {otherParty?.name?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold ${theme.colors.text}`}>{otherParty?.name}</h4>
                        <p className={`text-sm ${theme.colors.muted} truncate`}>
                          {conv.lastMessage || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span className={`text-xs ${theme.colors.muted}`}>
                        {new Date(conv.lastMessageTime).toLocaleDateString()}
                      </span>
                      {conv.messages.some(m => m.sender !== currentUser.id && !m.read) && (
                        <Badge className="bg-blue-500 text-white text-xs">
                          {conv.messages.filter(m => m.sender !== currentUser.id && !m.read).length}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DirectMessages;
