"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send, PlusCircle, Bot, User, Paperclip, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import VoiceButton from "./VoiceButton";

interface ChatWindowProps {
  isSubmitSuccessful: boolean;
  isSidebarOpen: boolean,
  toggleSidebar: () => void;
  onNewChat: () => void;
  chatMessages: Message[];
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  chatErrorMessage: Message | null;
  setChatErrorMessage: React.Dispatch<React.SetStateAction<Message | null>>;
  isNewChat: boolean;
  setIsNewChat: React.Dispatch<React.SetStateAction< boolean >>;
  isContinuousChat: boolean;
  setIsContinuousChat: React.Dispatch<React.SetStateAction< boolean >>;
  chatHistoryMessages: Message[];
  currentChatSessionId: string;
  setCurrentChatSessionId: React.Dispatch<React.SetStateAction<string>>;
}

interface Message {
  sender: 'user' | 'QueryAmie' | 'error';
  message: string;
}


export default function ChatWindow({ isSubmitSuccessful, isSidebarOpen, toggleSidebar, onNewChat, chatMessages, setChatMessages, chatErrorMessage, setChatErrorMessage, isNewChat, setIsNewChat, isContinuousChat, setIsContinuousChat, chatHistoryMessages, currentChatSessionId, setCurrentChatSessionId}: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const [firstResponse, setFirstResponse] = useState("");
  const [isFirstResponse, setIsFirstResponse] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const [isLoading, setIsLoading] = useState(false)
  const hasMessages = chatMessages.length > 0 || chatErrorMessage;
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Debug logging
  console.log('ChatWindow render - currentChatSessionId:', currentChatSessionId, 'isSubmitSuccessful:', isSubmitSuccessful);

  // Effect to listen for window resize and update isSmallScreen
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
  }, [currentChatSessionId]);



  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, chatErrorMessage]);


  // Updated to use new enhanced chat system
  useEffect(() => {
    // Chat session management is now handled by the new startNewChatAndSendMessage function
  }, [currentChatSessionId]);
    


  // Function to add messages from chat history to current chat
  const addMessagesToChat = (chatHistoryMessages: Message[]) => {
    chatHistoryMessages.forEach((msg) => {
        setChatMessages((prevMessages) => [
            ...prevMessages,
            { sender: msg.sender, message: msg.message }
        ]);
    });
  };

  useEffect(() => {
    if (chatHistoryMessages.length > 0) {
      setChatMessages([]);
        addMessagesToChat(chatHistoryMessages);
    }
  }, [chatHistoryMessages]);



// Function to start a new chat session using enhanced MongoDB system
function startNewChat() {
  const token = sessionStorage.getItem("token");
  
  if (token) {
    axios.post(`${import.meta.env.VITE_BACKEND_API}/chat/start`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((response: any) => {
        const data = response.data;
        setCurrentChatSessionId(data.chat_id);  // Setting session ID
        console.log("New chat session started:", data.chat_id);
      })
      .catch((error: any) => {
        console.error("Error starting new chat:", error);
        setChatErrorMessage({ sender: 'error', message: "Failed to start a new chat. Please try again." });
      });
  } else {
    console.error("Authentication token needed");
  }
}



  const handleSendMessage = async () => {
    if (message.trim()) {
      const trimmedMessage = message.trim();

      try {
        setChatErrorMessage(null);

        // If no chat session exists, start a new one
        if (!currentChatSessionId) {
          await startNewChatAndSendMessage(trimmedMessage);
          return;
        }

        // Add user message to chat
        setChatMessages((prevMessages) => [...prevMessages, { sender: 'user', message: trimmedMessage }]);
        setMessage("");
        setIsLoading(true);

        const token = sessionStorage.getItem("token");

        // Send message using enhanced chat system
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/chat/${currentChatSessionId}/message`, 
          { content: trimmedMessage, stream: false }, 
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        const botResponse = response.data.answer;
        
        setIsLoading(false);
        setChatErrorMessage(null);
        setChatMessages((prevMessages) => [...prevMessages, { sender: 'QueryAmie', message: botResponse }]);

      } catch (error) {
        console.error("Error sending message:", error);
        setIsLoading(false);
        setChatErrorMessage({ sender: 'error', message: "An unexpected error occurred. Please try again." });
      }
    }
  };

  const startNewChatAndSendMessage = async (firstMessage: string) => {
    try {
      const token = sessionStorage.getItem("token");
      
      // Start new chat session
      const chatResponse = await axios.post(`${import.meta.env.VITE_BACKEND_API}/chat/start`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      
      const chatId = chatResponse.data.chat_id;
      setCurrentChatSessionId(chatId);
      
      // Add user message to chat
      setChatMessages((prevMessages) => [...prevMessages, { sender: 'user', message: firstMessage }]);
      setMessage("");
      setIsLoading(true);

      // Send the first message
      const messageResponse = await axios.post(`${import.meta.env.VITE_BACKEND_API}/chat/${chatId}/message`, 
        { content: firstMessage, stream: false }, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const botResponse = messageResponse.data.answer;
      
      setIsLoading(false);
      setIsNewChat(false);
      setIsContinuousChat(true);
      setChatMessages((prevMessages) => [...prevMessages, { sender: 'QueryAmie', message: botResponse }]);

    } catch (error) {
      console.error("Error starting new chat:", error);
      setIsLoading(false);
      setChatErrorMessage({ sender: 'error', message: "Failed to start a new chat. Please try again." });
    }
  };

  const handleVoiceMessage = async (voiceMessage: string) => {
    if (voiceMessage.trim()) {
      const trimmedMessage = voiceMessage.trim();

      try {
        setChatErrorMessage(null);

        // If no chat session exists, start a new one
        if (!currentChatSessionId) {
          await startNewChatAndSendMessage(trimmedMessage);
          return;
        }

        // Add the voice message to chat immediately
        setChatMessages((prevMessages) => [...prevMessages, { sender: 'user', message: trimmedMessage }]);
        setIsLoading(true);

        const token = sessionStorage.getItem("token");

        // Send message using enhanced chat system
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/chat/${currentChatSessionId}/message`, 
          { content: trimmedMessage, stream: false }, 
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        const botResponse = response.data.answer;
      
        setIsLoading(false);
        setChatErrorMessage(null);
        setChatMessages((prevMessages) => [...prevMessages, { sender: 'QueryAmie', message: botResponse }]);

      } catch (error) {
        console.error("Error sending voice message:", error);
        setIsLoading(false);
        setChatErrorMessage({ sender: 'error', message: "An unexpected error occurred with voice message. Please try again." });
      }
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
                <p>Welcome to <strong className="text-blue-400">QueryAmie</strong>! How can I assist you today?</p>
                <p>Please upload a document to get started.</p>
              </div>
            </motion.div>
          )}

          {chatMessages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start space-x-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'QueryAmie' && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-gray-300" />
                </div>
              )}
              <div className={`p-3 rounded-lg max-w-[70%] break-words ${msg.sender === 'user' ? 'bg-gray-700 text-gray-100' : 'bg-gray-800 text-gray-200'} overflow-x-auto`}>
                {msg.sender === 'user' ? (
                  <span>{msg.message}</span>
                ) : (
                  <div className="prose-chat">
                    <ReactMarkdown 
                    components={{
                      // Handle paragraphs
                      p: ({children}) => (
                        <p className="mb-2 last:mb-0 text-gray-200 leading-relaxed">
                          {children}
                        </p>
                      ),
                      // Handle bold text
                      strong: ({children}) => (
                        <strong className="font-bold text-gray-100">
                          {children}
                        </strong>
                      ),
                      // Handle italic text
                      em: ({children}) => (
                        <em className="italic text-gray-300">
                          {children}
                        </em>
                      ),
                      // Handle headings
                      h1: ({children}) => (
                        <h1 className="text-lg font-bold mb-2 text-gray-100 border-b border-gray-600 pb-1">
                          {children}
                        </h1>
                      ),
                      h2: ({children}) => (
                        <h2 className="text-base font-bold mb-2 text-gray-100">
                          {children}
                        </h2>
                      ),
                      h3: ({children}) => (
                        <h3 className="text-sm font-bold mb-1 text-gray-100">
                          {children}
                        </h3>
                      ),
                      // Handle unordered lists
                      ul: ({children}) => (
                        <ul className="list-disc list-inside mb-2 space-y-1 text-gray-200 ml-4">
                          {children}
                        </ul>
                      ),
                      // Handle ordered lists
                      ol: ({children}) => (
                        <ol className="list-decimal list-inside mb-2 space-y-1 text-gray-200 ml-4">
                          {children}
                        </ol>
                      ),
                      // Handle list items
                      li: ({children}) => (
                        <li className="text-gray-200 leading-relaxed">
                          {children}
                        </li>
                      ),
                      // Handle blockquotes
                      blockquote: ({children}) => (
                        <blockquote className="border-l-4 border-gray-600 pl-4 italic text-gray-300 my-2 bg-gray-800/30 py-2 rounded-r">
                          {children}
                        </blockquote>
                      ),
                      // Handle code blocks and inline code
                      code: ({children, className, ...props}) => {
                        const isInline = !className || !className.includes('language-');
                        if (isInline) {
                          return (
                            <code className="bg-gray-700 text-gray-100 px-1 py-0.5 rounded text-sm font-mono border border-gray-600" {...props}>
                              {children}
                            </code>
                          );
                        } else {
                          return (
                            <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto my-2 border border-gray-700">
                              <code className="font-mono text-sm" {...props}>
                                {children}
                              </code>
                            </pre>
                          );
                        }
                      },
                      // Handle links
                      a: ({href, children}) => (
                        <a 
                          href={href} 
                          className="text-blue-400 hover:text-blue-300 underline transition-colors" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                    }}
                    >
                      {msg.message}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
              {msg.sender === 'user' && (
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
                <span>{chatErrorMessage.message}</span>
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
          disabled={!isSubmitSuccessful}
          className="flex-1 bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
        />
        <VoiceButton
          onVoiceMessage={handleVoiceMessage}
          disabled={!isSubmitSuccessful}
          chatId={currentChatSessionId}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!isSubmitSuccessful}
          className="bg-gray-700 hover:bg-gray-600 text-gray-100">
          <Send className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={
            isSmallScreen
              ? isSidebarOpen
                ? onNewChat // Action when sidebar is open on a small screen
                : toggleSidebar // Action when sidebar is closed on a small screen
              : onNewChat // Default action for larger screens
          }
          className="border-gray-700 text-gray-800 hover:bg-gray-800 hover:text-gray-100"
        >
          {isSmallScreen
            ? isSidebarOpen 
              ? <PlusCircle className="h-4 w-4" /> 
              : <Paperclip className="h-4 w-4" />
            : <PlusCircle className="h-4 w-4" />
          }
        </Button>
      </div>
    </div>
  );
}
