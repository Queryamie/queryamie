"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, PlusCircle, Bot, User, Paperclip, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ReactMarkdown from "react-markdown";

interface ChatWindowProps {
  isSubmitSuccessful: boolean;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  onNewChat: () => void;
  chatMessages: Message[];
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  chatErrorMessage: Message | null;
  setChatErrorMessage: React.Dispatch<React.SetStateAction<Message | null>>;
  isNewChat: boolean;
  setIsNewChat: React.Dispatch<React.SetStateAction<boolean>>;
  chatHistoryMessages: Message[];
  currentChatSessionId: string;
  setCurrentChatSessionId: React.Dispatch<React.SetStateAction<string>>;
}

interface Message {
  id: string;
  sender_type: "user" | "assistant" | "error";
  content: string;
  timestamp: string;
  file_context_used?: string[];
}

export default function ChatWindow({
  isSubmitSuccessful,
  isSidebarOpen,
  toggleSidebar,
  onNewChat,
  chatMessages,
  setChatMessages,
  chatErrorMessage,
  setChatErrorMessage,
  setIsNewChat,
  chatHistoryMessages,
  currentChatSessionId,
}: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const [isLoading, setIsLoading] = useState(false);
  const hasMessages = chatMessages.length > 0 || chatErrorMessage;
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, chatErrorMessage]);

  useEffect(() => {
    if (chatHistoryMessages.length > 0) {
      setChatMessages(chatHistoryMessages);
    }
  }, [chatHistoryMessages, setChatMessages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !currentChatSessionId) return;

    const trimmedMessage = message.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      sender_type: "user",
      content: trimmedMessage,
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    setChatErrorMessage(null);

    try {
      console.log("this is the question: ", trimmedMessage);
      const token = sessionStorage.getItem("access_token");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/chat/${currentChatSessionId}/message`,
        { content: trimmedMessage },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { answer } = response.data;
      const botMessage: Message = {
        id: Date.now().toString(),
        sender_type: "assistant",
        content: answer,
        timestamp: new Date().toISOString(),
      };

      setChatMessages((prev) => [...prev, botMessage]);
      setIsNewChat(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatErrorMessage({
        id: Date.now().toString(),
        sender_type: "error",
        content: "An unexpected error occurred. Please try again.",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 bg-gray-900">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 pr-4 mb-4">
        <AnimatePresence>
          {!hasMessages && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-start space-x-2 justify-start"
            >
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-gray-300" />
              </div>
              <div className="p-3 rounded-lg max-w-[70%] bg-gray-800 text-gray-200 break-words space-y-2">
                <ReactMarkdown>
                  Welcome to **QueryAmie**! How can I assist you today?  
                  Please start a new chat and upload a document to get started.
                </ReactMarkdown>
              </div>
            </motion.div>
          )}
          {chatMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start space-x-2 ${msg.sender_type === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender_type === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-gray-300" />
                </div>
              )}
              <div
                className={`p-3 rounded-lg max-w-[70%] break-words ${
                  msg.sender_type === "user" ? "bg-gray-700 text-gray-100" : "bg-gray-800 text-gray-200"
                } overflow-x-auto`}
              >
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-4 mb-2 last:mb-0">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 last:mb-0">{children}</ol>,
                    code: ({ children }) => (
                      <code className="bg-slate-200 px-2 py-1 rounded text-xs font-mono">{children}</code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-slate-800 text-white p-3 rounded-lg overflow-x-auto text-xs">
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
              {msg.sender_type === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-300" />
                </div>
              )}
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-start space-x-2 justify-start"
            >
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-gray-300" />
              </div>
              <div className="p-3 rounded-lg max-w-[70%] bg-gray-800 text-gray-200 break-words">
                <Loader className="w-5 h-5 animate-spin" />
              </div>
            </motion.div>
          )}
          {chatErrorMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-start space-x-2 justify-start"
            >
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-gray-300" />
              </div>
              <div className="p-3 rounded-lg max-w-[70%] break-words bg-gray-800 text-red-500">
                <ReactMarkdown>{chatErrorMessage.content}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center space-x-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={!isSubmitSuccessful || !currentChatSessionId}
          className="flex-1 bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!isSubmitSuccessful || !currentChatSessionId}
          className="bg-gray-700 hover:bg-gray-600 text-gray-100"
        >
          <Send className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={isSmallScreen && isSidebarOpen ? onNewChat : toggleSidebar}
          className="border-gray-700 text-gray-800 hover:bg-gray-800 hover:text-gray-100"
        >
          {isSmallScreen && isSidebarOpen ? <PlusCircle className="h-4 w-4" /> : <Paperclip className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}