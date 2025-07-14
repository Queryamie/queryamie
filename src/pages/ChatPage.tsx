import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload, Send, Plus, Loader2, Menu, X, Sparkles, MessageSquare, FileText, Square
} from 'lucide-react';
import VoiceButton from '../components/VoiceButton';
import { Button } from '../components/ui/button';
import toast from 'react-hot-toast';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import Sidebar from '../components/Sidebar';
import TextareaAutosize from 'react-textarea-autosize';
import logo from '../assets/logo.png';

// Types
interface ChatSession {
  chat_id: string;
  name?: string;
  status: string;
  created_at: string;
  updated_at: string;
  analytics: {
    document_count: number;
    message_count: number;
    latest_document: string | null;
  };
}

interface ChatMessage {
  id: string;
  sender_type: 'user' | 'ai';
  content: string;
  timestamp: string;
  sources?: string[];
  confidence?: number;
  language?: string;
}

interface UploadedFile {
  id: string;
  filename: string;
  file_type: string;
  language: string;
  word_count: number;
  summary: string;
}

// Custom markdown components for chat bubbles
const markdownComponents = {
  p: ({ children }: any) => (
    <p className="mb-2 last:mb-0 leading-relaxed text-gray-200 text-sm sm:text-base">{children}</p>
  ),
  strong: ({ children }: any) => <strong className="font-semibold text-gray-100">{children}</strong>,
  em: ({ children }: any) => <em className="italic text-gray-300">{children}</em>,
  ul: ({ children }: any) => <ul className="list-disc list-inside space-y-1 text-gray-200 ml-1">{children}</ul>,
  ol: ({ children }: any) => <ol className="list-decimal list-inside space-y-1 text-gray-200 ml-1">{children}</ol>,
  li: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-300 my-2 bg-dark-600/40 py-2 rounded-r">
      {children}
    </blockquote>
  ),
  code: ({ children, className, ...props }: any) => {
    const isInline = !className || !className.includes('language-');
    if (isInline) {
      return (
        <code className="bg-dark-700 text-gray-100 px-1 py-0.5 rounded text-xs sm:text-sm font-mono" {...props}>
          {children}
        </code>
      );
    }
    return (
      <pre className="bg-dark-800 text-gray-100 p-3 rounded-lg overflow-x-auto my-2 border border-dark-600">
        <code className="font-mono text-xs sm:text-sm" {...props}>{children}</code>
      </pre>
    );
  },
  table: ({ children }: any) => (
    <table className="w-full text-sm text-left text-gray-300 border-collapse my-2">{children}</table>
  ),
  thead: ({ children }: any) => <thead className="bg-dark-700 text-gray-100">{children}</thead>,
  tbody: ({ children }: any) => <tbody>{children}</tbody>,
  tr: ({ children }: any) => <tr className="border-b border-dark-600">{children}</tr>,
  th: ({ children }: any) => <th className="px-3 py-2 font-semibold border-r border-dark-600 last:border-r-0">{children}</th>,
  td: ({ children }: any) => <td className="px-3 py-2 border-r border-dark-600 last:border-r-0">{children}</td>,
  a: ({ href, children }: any) => (
    <a href={href} className="text-primary-400 hover:text-primary-300 underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
};


const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  
  // States
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isUploading, setIsUploading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const streamingRef = useRef<boolean>(false);
  
  // Get auth token
  const getAuthToken = () => localStorage.getItem('access_token');

  // API calls
  const apiCall = async (endpoint: string, options: { method?: string; data?: any; headers?: any } = {}) => {
    const token = getAuthToken();
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await axios({
        url: `${import.meta.env.VITE_BACKEND_API}${endpoint}`,
        method: options.method || 'GET',
        data: options.data,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
        },
      });
      return response;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
        return;
      }
      throw error;
    }
  };

  // Load chat sessions
  const loadChatSessions = async () => {
    try {
      const response = await apiCall('/chat/sessions');
      if (response) {
        const sessionsWithMessages = response.data.filter((session: ChatSession) => 
          session.analytics.message_count > 0
        );
        setChatSessions(sessionsWithMessages);
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      toast.error('Failed to load chat sessions');
    }
  };

  // Start new chat session
  const startNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setUploadedFiles([]);
    setIsSidebarOpen(false);
    navigate('/chat');
  };

  // Load chat messages
  const loadMessages = async (chatId: string) => {
    try {
      const response = await apiCall(`/chat/${chatId}/messages`);
      if (response) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    }
  };

  // Load chat status and files
  const loadChatStatus = async (chatId: string) => {
    try {
      const response = await apiCall(`/chat/${chatId}/status`);
      if (response) {
        setUploadedFiles(response.data.files || []);
      }
    } catch (error) {
      console.error('Error loading chat status:', error);
      toast.error('Failed to load chat status');
    }
  };

  // Select chat session
  const selectChatSession = async (chatId: string) => {
    setCurrentChatId(chatId);
    await Promise.all([
      loadMessages(chatId),
      loadChatStatus(chatId)
    ]);
    setIsSidebarOpen(false);
    navigate(`/chat/${chatId}`);
  };

  // Handle file upload
  const handleFileUpload = async (files: FileList) => {
    let chatIdToUse = currentChatId;
    if (!chatIdToUse) {
      const response = await apiCall('/chat/start', { method: 'POST' });
      if (response && response.data && response.data.chat_id) {
        chatIdToUse = response.data.chat_id;
        setCurrentChatId(chatIdToUse);
        setMessages([]);
        setUploadedFiles([]);
        await loadChatSessions();
        navigate(`/chat/${chatIdToUse}`);
      } else {
        toast.error('Failed to create new chat session');
        return;
      }
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
      const response = await apiCall(`/chat/${chatIdToUse}/upload`, {
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response) {
        setUploadedFiles(prev => {
          const existingIds = new Set(prev.map(f => f.id));
          const newFiles = (response.data.files || []).filter((f: UploadedFile) => !existingIds.has(f.id));
          return [...prev, ...newFiles];
        });
        await loadChatSessions();
        toast.success('Files uploaded successfully');
      }
    } catch (error: any) {
      console.error('Error uploading files:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to upload files. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // Frontend streaming simulation
  const simulateTyping = async (text: string, messageId: string, sources?: string[], confidence?: number, language?: string) => {
    
    // Split into characters for more realistic typing effect
    const chars = text.split('');
    let currentText = '';
    
    for (let i = 0; i < chars.length; i++) {
      // Check if streaming was cancelled using ref
      if (!streamingRef.current) {
        // If cancelled, show the full text immediately
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { 
                  ...msg, 
                  content: text,
                  sources: sources && sources.length > 0 ? sources : undefined,
                  confidence,
                  language
                }
              : msg
          )
        );
        return;
      }
      
      currentText += chars[i];
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, content: currentText }
            : msg
        )
      );
      
      // Faster typing for spaces and punctuation, slower for letters
      const char = chars[i];
      let delay = 10; // Base delay (reduced from 20)
      
      if (char === ' ') {
        delay = 5; // Fast for spaces (reduced from 10)
      } else if (char === '.' || char === '!' || char === '?') {
        delay = 50; // Pause at sentence endings (reduced from 100)
      } else if (char === ',') {
        delay = 25; // Short pause at commas (reduced from 50)
      } else {
        delay = Math.random() * 20 + 10; // 10-30ms for regular characters (reduced from 20-60ms)
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    // Final update with metadata (ensure we have the complete text)
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              content: text,
              sources: sources && sources.length > 0 ? sources : undefined,
              confidence,
              language
            }
          : msg
      )
    );
  };

  // Send message with frontend streaming
  const sendMessage = async () => {
    if (!currentMessage.trim()) return;
    let chatIdToUse = currentChatId;
    if (!chatIdToUse) {
      const response = await apiCall('/chat/start', { method: 'POST' });
      if (response && response.data && response.data.chat_id) {
        chatIdToUse = response.data.chat_id;
        setCurrentChatId(chatIdToUse);
        setMessages([]);
        setUploadedFiles([]);
        await loadChatSessions();
        navigate(`/chat/${chatIdToUse}`);
      } else {
        toast.error('Failed to create new chat session');
        return;
      }
    }
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender_type: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Create AI message placeholder for streaming
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: ChatMessage = {
      id: aiMessageId,
      sender_type: 'ai',
      content: '',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, aiMessage]);
    
    const messageToSend = currentMessage;
    setCurrentMessage('');
    setIsLoading(true);
    
    try {
      const response = await apiCall(`/chat/${chatIdToUse}/message`, {
        method: 'POST',
        data: {
          content: messageToSend,
          stream: false, // Disable backend streaming
        },
      });

      if (response) {
        setIsStreaming(true);
        streamingRef.current = true;
        setIsLoading(false); // Stop loading since we got the response
        
        // Simulate typing effect with the received response
        await simulateTyping(
          response.data.answer,
          aiMessageId,
          response.data.sources,
          response.data.confidence,
          response.data.language
        );
        
        setIsStreaming(false);
        streamingRef.current = false;
        await loadChatSessions(); // Ensure sidebar updates after sending first message
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to send message. Please try again.';
      toast.error(errorMessage);
      
      // Remove the failed AI message
      setMessages(prev => prev.filter(msg => msg.id !== aiMessageId));
      setIsLoading(false);
      setIsStreaming(false);
      streamingRef.current = false;
    }
  };

  // Stop streaming
  const stopStreaming = () => {
    setIsStreaming(false);
    streamingRef.current = false;
    setIsLoading(false);
  };

  // Voice message handler with frontend streaming
  const handleVoiceMessage = async (voiceText: string) => {
    if (!voiceText.trim() || !currentChatId) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender_type: 'user',
      content: voiceText,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Create AI message placeholder for streaming
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: ChatMessage = {
      id: aiMessageId,
      sender_type: 'ai',
      content: '',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, aiMessage]);
    
    setIsLoading(true);

    try {
      const response = await apiCall(`/chat/${currentChatId}/message`, {
        method: 'POST',
        data: {
          content: voiceText,
          stream: false, // Disable backend streaming
        },
      });

      if (response) {
        setIsStreaming(true);
        streamingRef.current = true;
        setIsLoading(false); // Stop loading since we got the response
        
        // Simulate typing effect with the received response
        await simulateTyping(
          response.data.answer,
          aiMessageId,
          response.data.sources,
          response.data.confidence,
          response.data.language
        );
        
        setIsStreaming(false);
        streamingRef.current = false;
      }
    } catch (error: any) {
      console.error('Error sending voice message:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to send voice message. Please try again.';
      toast.error(errorMessage);
      
      // Remove the failed AI message
      setMessages(prev => prev.filter(msg => msg.id !== aiMessageId));
      setIsLoading(false);
      setIsStreaming(false);
      streamingRef.current = false;
    }
  };

  // Start editing chat name
  const startEditingChatName = (chatId: string, currentName: string) => {
    setEditingChatId(chatId);
    setEditingName(currentName);
    setTimeout(() => {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }, 0);
  };

  // Save edited chat name
  const saveEditedChatName = async (chatId: string) => {
    if (!editingName.trim()) {
      toast.error('Chat name cannot be empty');
      return;
    }
    
    try {
      const response = await apiCall(`/chat/${chatId}/rename`, {
        method: 'POST',
        data: { name: editingName.trim() },
      });

      if (response) {
        setChatSessions(prev => 
          prev.map(chat => 
            chat.chat_id === chatId 
              ? { ...chat, name: editingName.trim() }
              : chat
          )
        );
        toast.success('Chat renamed successfully');
      }
    } catch (error: any) {
      console.error('Error renaming chat:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to rename chat. Please try again.';
      toast.error(errorMessage);
    } finally {
      setEditingChatId(null);
      setEditingName('');
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingChatId(null);
    setEditingName('');
  };

  // Delete chat session
  const deleteChatSession = async (chatId: string) => {
    try {
      await apiCall(`/chat/${chatId}/delete`, {
        method: 'DELETE',
      });

      setChatSessions(prev => prev.filter(chat => chat.chat_id !== chatId));
      
      if (currentChatId === chatId) {
        setCurrentChatId(null);
        setMessages([]);
        setUploadedFiles([]);
        navigate('/chat');
      }

      toast.success('Chat deleted successfully');
    } catch (error: any) {
      console.error('Error deleting chat:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to delete chat. Please try again.';
      toast.error(errorMessage);
    } finally {
      setPendingDelete(null);
    }
  };

  // Translate content
  const translateContent = async (targetLang: string) => {
    if (isTranslating) return;
    
    setIsTranslating(true);
    try {
      const texts: Record<string, any> = {};
      messages.forEach((msg, index) => {
        texts[`message_${index}`] = msg.content;
      });

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/translate`, {
        texts: texts,
        target_lang: targetLang,
        context: 'Chat interface messages',
      });

      if (response.data.success) {
        const translatedMessages = messages.map((msg, index) => ({
          ...msg,
          content: response.data.translations[`message_${index}`] || msg.content,
        }));
        setMessages(translatedMessages);
        localStorage.setItem('selectedLanguage', targetLang);
        setSelectedLanguage(targetLang);
        toast.success('Messages translated successfully');
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Failed to translate messages');
    } finally {
      setIsTranslating(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  // Effects
  useEffect(() => {
    loadChatSessions();
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang) {
      setSelectedLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (chatId && chatId !== currentChatId) {
      setCurrentChatId(chatId);
      loadMessages(chatId);
      loadChatStatus(chatId);
    }
  }, [chatId]);

  // Handle sidebar visibility on resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-dark-900 relative">
      {/* Mobile menu button */}
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-[100] bg-dark-800/90 backdrop-blur-sm border border-dark-600 rounded-xl p-2 shadow-lg"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isSidebarOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
        </button>
      )}

      {/* Sidebar */}
      {(!isMobile || isSidebarOpen) && (
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          chatSessions={chatSessions}
          currentChatId={currentChatId}
          startNewChat={startNewChat}
          selectChatSession={selectChatSession}
          renameChatSession={(chatId) => {
            const chat = chatSessions.find(c => c.chat_id === chatId);
            if (chat) {
              startEditingChatName(chatId, chat.name || `Chat ${chatId.slice(-6)}`);
            }
          }}
          deleteChatSession={(chatId) => setPendingDelete(chatId)}
          selectedLanguage={selectedLanguage}
          isTranslating={isTranslating}
          translateContent={translateContent}
          handleLogout={handleLogout}
          uploadedFiles={uploadedFiles.map(f => ({ id: f.id, filename: f.filename }))}
          onUploadClick={!isUploading ? () => fileInputRef.current?.click() : undefined}
          editingChatId={editingChatId}
          editingName={editingName}
          setEditingName={setEditingName}
          saveEditedChatName={saveEditedChatName}
          cancelEditing={cancelEditing}
          editInputRef={editInputRef}
          pendingDelete={pendingDelete}
          confirmDelete={deleteChatSession}
          cancelDelete={() => setPendingDelete(null)}
        />
      )}

      {/* Main content */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ${
        isMobile ? 'ml-0' : isSidebarOpen ? 'ml-72' : 'ml-20'
      }`}>
        {/* Full-screen drag overlay */}
        {isDragging && (
          <div
            className="fixed inset-0 bg-primary-600/20 backdrop-blur-sm z-50 flex items-center justify-center"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <div className="bg-dark-800/90 backdrop-blur-sm rounded-2xl p-8 border border-primary-500/50">
                <Upload className="mx-auto h-16 w-16 text-primary-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Drop files to upload</h3>
                <p className="text-gray-300">Release to add documents to your chat</p>
              </div>
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.pptx,.ppt,.xlsx,.xls,.txt,.csv"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
        />

        {/* Messages area */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 lg:p-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              {uploadedFiles.length === 0 ? (
                <div className="text-center max-w-md">
                  <div className="bg-gradient-to-r from-primary-500 to-purple-500 p-3 rounded-full inline-block mb-6">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">Welcome to QueryAmie</h2>
                  <p className="text-gray-400 mb-6">
                    Start by uploading a document to chat with your files, or begin a conversation.
                  </p>
                </div>
              ) : (
                <div className="text-center max-w-md">
                  <div className="bg-gradient-to-r from-primary-500 to-purple-500 p-3 rounded-full inline-block mb-6">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">Ready to chat!</h2>
                  <p className="text-gray-400 mb-6">
                    Your documents are uploaded. Ask me anything about them.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {uploadedFiles.slice(0, 3).map(file => (
                      <div key={file.id} className="bg-dark-700 px-3 py-1 rounded-full text-sm text-gray-300 flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {file.filename.length > 20 ? `${file.filename.substring(0, 20)}...` : file.filename}
                      </div>
                    ))}
                    {uploadedFiles.length > 3 && (
                      <div className="bg-dark-700 px-3 py-1 rounded-full text-sm text-gray-300">
                        +{uploadedFiles.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Input area for empty state */}
              <div className="w-full max-w-3xl mt-8">
                <div className="bg-dark-800/85 backdrop-blur-sm rounded-2xl shadow-xl p-4">
                  <div className="flex flex-col space-y-3">
                    <TextareaAutosize
                      value={currentMessage}
                      onChange={e => setCurrentMessage(e.target.value)}
                      placeholder={uploadedFiles.length === 0 ? 'Upload a document to start chatting' : 'Ask anything about your documents...'}
                      minRows={1}
                      maxRows={7}
                      className="w-full bg-transparent outline-none focus:outline-none border-none focus:border-none shadow-none focus:shadow-none ring-0 focus:ring-0 resize-none text-white text-base font-normal placeholder-gray-400 placeholder:text-base placeholder:font-normal px-3 py-2"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      disabled={uploadedFiles.length === 0 || isLoading}
                    />
                    <div className="flex justify-between items-center">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-primary-400"
                        disabled={isUploading}
                      >
                        <Plus className="h-5 w-5 mr-1" />
                        Add Files
                      </Button>
                      <div className="flex items-center space-x-2">
                        <VoiceButton
                          onVoiceMessage={handleVoiceMessage}
                          disabled={isLoading || uploadedFiles.length === 0}
                          chatId={currentChatId || ''}
                        />
                        {isStreaming ? (
                          <Button
                            onClick={stopStreaming}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2"
                          >
                            <Square className="h-5 w-5" />
                          </Button>
                        ) : (
                          <Button
                            onClick={sendMessage}
                            disabled={uploadedFiles.length === 0 || !currentMessage.trim() || isLoading}
                            className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-4 py-2"
                          >
                            <Send className="h-5 w-5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto px-2">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-3xl rounded-2xl px-4 py-3 ${
                      message.sender_type === 'user'
                        ? 'bg-dark-700/80 backdrop-blur-sm border border-dark-600/50 text-gray-100 shadow-lg'
                        : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-1">
                        {message.sender_type === 'ai' ? (
                          <div className="prose prose-invert max-w-none break-words">
                            <ReactMarkdown components={markdownComponents}>
                              {message.content}
                            </ReactMarkdown>
                            {isStreaming && message.content && message.id === messages[messages.length - 1]?.id && (
                              <img 
                                src={logo} 
                                alt="Logo"
                                className="inline-block w-4 h-4 ml-1 animate-pulse opacity-70"
                              />
                            )}
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap leading-relaxed break-words text-sm sm:text-base">{message.content}</p>
                        )}
                        {message.sender_type === 'ai' && message.sources && message.sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-600/50">
                            <p className="text-xs text-gray-400 mb-2">Sources:</p>
                            <div className="flex flex-wrap gap-1">
                              {message.sources.map((source, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-dark-600/50 px-2 py-1 rounded-full text-gray-300 border border-dark-500/50"
                                >
                                  {source}
                                </span>
                              ))}
                            </div>
                            {message.confidence && (
                              <p className="text-xs text-gray-400 mt-2">
                                Confidence: {Math.round(message.confidence * 100)}%
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-3 flex items-center space-x-3">
                    <div className="bg-primary-500/20 p-2 rounded-full">
                      <img 
                        src={logo} 
                        alt="Logo"
                        className="h-5 w-5 opacity-70"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin text-primary-400" />
                      <span className="text-gray-300">
                        {isStreaming ? 'QueryAmie is responding...' : 'QueryAmie is thinking...'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message input (sticky at bottom) */}
        {messages.length > 0 && (
          <div className="p-4 lg:p-8 sticky bottom-0 z-30 bg-gradient-to-t from-dark-900 to-transparent">
            <div className="max-w-3xl mx-auto">
              <div className="bg-dark-800/85 backdrop-blur-sm rounded-2xl shadow-xl p-4">
                <div className="flex flex-col space-y-3">
                  <TextareaAutosize
                    value={currentMessage}
                    onChange={e => setCurrentMessage(e.target.value)}
                    placeholder="Ask anything about your documents..."
                    minRows={1}
                    maxRows={7}
                    className="w-full bg-transparent outline-none focus:outline-none border-none focus:border-none shadow-none focus:shadow-none ring-0 focus:ring-0 resize-none text-white text-base font-normal placeholder-gray-400 placeholder:text-base placeholder:font-normal px-3 py-2"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    disabled={uploadedFiles.length === 0 || isLoading}
                  />
                  <div className="flex justify-between items-center">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-primary-400"
                      disabled={isUploading}
                    >
                      <Plus className="h-5 w-5 mr-1" />
                      Add Files
                    </Button>
                    <div className="flex items-center space-x-2">
                      <VoiceButton
                        onVoiceMessage={handleVoiceMessage}
                        disabled={isLoading || uploadedFiles.length === 0}
                        chatId={currentChatId || ''}
                      />
                      {isStreaming ? (
                        <Button
                          onClick={stopStreaming}
                          className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2"
                        >
                          <Square className="h-5 w-5" />
                        </Button>
                      ) : (
                        <Button
                          onClick={sendMessage}
                          disabled={uploadedFiles.length === 0 || !currentMessage.trim() || isLoading}
                          className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-4 py-2"
                        >
                          <Send className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload loader overlay */}
        {isUploading && (
          <div className="fixed inset-0 bg-dark-900/70 z-[200] flex flex-col items-center justify-center">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary-400 mb-4" />
              <span className="text-white text-lg font-semibold">Uploading files...</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;