"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "@/components/Header";

interface Message {
  id: string;
  sender_type: 'user' | 'assistant' | 'error';
  content: string;
  timestamp: string;
  file_context_used?: string[];
}

interface ChatSession {
  chat_id: string;
  name: string | null; // Allow null for sessions without names
  status: string;
  created_at: string;
  updated_at: string;
}

export default function QueryAmi() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatErrorMessage, setChatErrorMessage] = useState<Message | null>(null);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [isNewChat, setIsNewChat] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentChatSessionId, setCurrentChatSessionId] = useState('');

  const navigate = useNavigate();
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Redirect if no token is present
  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleFileUpload = (newFiles: File[]) => {
    setIsSubmitSuccessful(false);
    setUploadedFiles((prevFiles) => {
      const existingFileNames = new Set(prevFiles.map((file) => file.name));
      const filteredNewFiles = newFiles.filter((file) => !existingFileNames.has(file.name));
      return [...prevFiles, ...filteredNewFiles];
    });
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setIsSubmitSuccessful(false);
    setUploadedFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  const handleSubmitFiles = async () => {
    setErrorMessage('');
    setIsLoading(true);

    if (!currentChatSessionId) {
      setErrorMessage("Please start a new chat before uploading files.");
      setIsLoading(false);
      return;
    }

    if (uploadedFiles.length > 0) {
      const formData = new FormData();
      uploadedFiles.forEach((file) => formData.append("files", file));
      const token = sessionStorage.getItem("access_token");

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_API}/chat/${currentChatSessionId}/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        console.log("Files uploaded successfully:", response.data);
        setIsSubmitSuccessful(true);
        setIsLoading(false);
        setUploadedFiles([]);
        // Update chat session name in chatHistory
        const { chat_name } = response.data;
        setChatHistory((prevHistory) =>
          prevHistory.map((session) =>
            session.chat_id === currentChatSessionId
              ? { ...session, name: chat_name }
              : session
          )
        );
      } catch (error) {
        console.error("Upload failed:", error);
        setErrorMessage("Error uploading file(s).");
        setIsLoading(false);
      }
    } else {
      setErrorMessage("Please upload a file to submit.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const GetNewChat = async () => {
      const token = sessionStorage.getItem("access_token");
      if (token) {
        await handleNewChat();
      }
    };
    GetNewChat();
  }, [])

  const handleNewChat = async () => {
    console.log("New chat clicked");
    try {
      const token = sessionStorage.getItem("access_token");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/chat/start`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      console.log('new chat clicked: ', response.data);
      const { chat_id } = response.data;
      console.log("New chat session id:", chat_id);
      sessionStorage.setItem("chat_id", chat_id);
      setCurrentChatSessionId(chat_id);
      setChatMessages([]);
      setChatErrorMessage(null);
      setIsSubmitSuccessful(false);
      setIsNewChat(true);
      setUploadedFiles([]);
      fetchChatHistory();
    } catch (error) {
      console.error("Error starting new chat:", error);
      setErrorMessage("Failed to start a new chat.");
    }
  };

  const fetchChatHistory = async () => {
    try {
      const token = sessionStorage.getItem("access_token");
      if (!token) {
        console.error("No token found in sessionStorage");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/chat/sessions`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      console.log('chat sessions retrieved :', response.data);
      setChatHistory(response.data);
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const handleFetchSessionMessages = async (chatId: string) => {
    if (chatId) {
      try {
        const token = sessionStorage.getItem("access_token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/chat/${chatId}/messages`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        setChatMessages(response.data);
        setCurrentChatSessionId(chatId);
        sessionStorage.setItem("chat_id", chatId);
        setIsSubmitSuccessful(true);
        setIsNewChat(false);
        setIsSidebarOpen(false);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setChatErrorMessage({
          id: Date.now().toString(),
          sender_type: 'error',
          content: "Failed to load messages.",
          timestamp: new Date().toISOString(),
        });
      }
    }
  };

  const handleDeleteChatHistory = async (chatId: string) => {
    if (chatId) {
      try {
        const token = sessionStorage.getItem("access_token");
        const response = await axios.delete(
          `${import.meta.env.VITE_BACKEND_API}/chat/${chatId}/delete`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        console.log("Chat deleted:", response.data);
        fetchChatHistory();
        if (chatId === currentChatSessionId) {
          setCurrentChatSessionId('');
          setChatMessages([]);
          setIsSubmitSuccessful(false);
          setIsNewChat(true);
        }
      } catch (error) {
        console.error("Error deleting chat:", error);
        setErrorMessage("Failed to delete chat session.");
      }
    }
  };

  const handleRenameSession = async (chatId: string, newName: string) => {
    try {
      const token = sessionStorage.getItem("access_token");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/chat/${chatId}/rename`,
        { name: newName },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      console.log("Chat renamed:", response.data);
      setChatHistory((prevHistory) =>
        prevHistory.map((session) =>
          session.chat_id === chatId
            ? { ...session, name: response.data.name }
            : session
        )
      );
    } catch (error) {
      console.error("Error renaming chat:", error);
      setErrorMessage("Failed to rename chat session.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onNewChat={handleNewChat} />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar and Main Content Wrapper */}
        <div className="flex w-full">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={toggleSidebar}
            uploadedFiles={uploadedFiles}
            onFileUpload={handleFileUpload}
            handleRemoveFile={handleRemoveFile}
            onSubmitFiles={handleSubmitFiles}
            chatHistory={chatHistory}
            onSessionClick={handleFetchSessionMessages}
            onDeleteHistoryClick={handleDeleteChatHistory}
            onRenameSession={handleRenameSession}
            errorMessage={errorMessage}
            isLoading={isLoading}
            isSubmitted={isSubmitSuccessful}
            currentChatSessionId={currentChatSessionId}
          />
          <main className="flex-1 overflow-hidden">
            <ChatWindow
              isSubmitSuccessful={isSubmitSuccessful}
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              onNewChat={handleNewChat}
              chatMessages={chatMessages}
              setChatMessages={setChatMessages}
              chatErrorMessage={chatErrorMessage}
              setChatErrorMessage={setChatErrorMessage}
              isNewChat={isNewChat}
              setIsNewChat={setIsNewChat}
              chatHistoryMessages={chatMessages}
              currentChatSessionId={currentChatSessionId}
              setCurrentChatSessionId={setCurrentChatSessionId}
            />
          </main>
        </div>
      </div>
    </div>
  );
}