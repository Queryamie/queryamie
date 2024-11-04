"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, PlusCircle, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface ChatWindowProps {
  isSubmitSuccessful: boolean;
  onNewChat: () => void;
  chatMessages: Message[];
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  chatErrorMessage: Message | null;
  setChatErrorMessage: React.Dispatch<React.SetStateAction<Message | null>>;
  isNewChat: boolean;
  setIsNewChat: React.Dispatch<React.SetStateAction< boolean >>;
  chatHistoryMessages: Message[];
  currentChatSessionId: string;
  setCurrentChatSessionId: React.Dispatch<React.SetStateAction<string>>;
}

interface Message {
  sender: 'user' | 'QueryAmie' | 'error';
  message: string;
}


export default function ChatWindow({ isSubmitSuccessful, onNewChat, chatMessages, setChatMessages, chatErrorMessage, setChatErrorMessage, isNewChat, setIsNewChat, chatHistoryMessages, currentChatSessionId, setCurrentChatSessionId}: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const [firstResponse, setFirstResponse] = useState("");
  const [isFirstResponse, setIsFirstResponse] = useState(true);
  const [isContinuousChat, setIsContinuousChat] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, chatErrorMessage]);


  useEffect(() => {
    if (currentChatSessionId && isNewChat && isFirstResponse) {
      continueChat(firstResponse, 'QueryAmie');
    }
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



// Function to start a new chat session
function startNewChat(firstMessage: string, response: string) {
  setIsFirstResponse(true);
  setIsContinuousChat(false);
  setFirstResponse(response);  // Store firstResponse here

  const user_id = sessionStorage.getItem("userId");

  if (user_id) {
    axios.post('/api/chat/startChat', {
        user_id: user_id,
        message: firstMessage
      })
      .then(response => {
        const data = response.data;
        setCurrentChatSessionId(data.session_id);  // Setting session ID
      })
      .catch(error => {
        console.error("Error starting new chat:", error);
        setChatErrorMessage({ sender: 'error', message: "Failed to start a new chat. Please try again." });
      });
  } else {
    console.error("user id needed");
  }
}


// Function to continue saving new chat
function continueChat(message: string, sender: string) {
  const user_id = sessionStorage.getItem("userId");
  if (currentChatSessionId) {
    // Send message to backend
    axios.post(`/api/chat/addMessage/${currentChatSessionId}`, {
      user_id: user_id,
      message: message,
      sender: sender
    })
    .then(response => {
      console.log("Message sent successfully:", response.data);
      setIsNewChat(false);
      setIsFirstResponse(false);
      setIsContinuousChat(true);
      })
      .catch(error => {
        console.error("Error sending message:", error);
      });
  }
  else {
    console.error("Session id required");
  }
}



  const handleSendMessage = async () => {
    if (message.trim()) {
      const trimmedMessage = message.trim();

      try {
        setChatErrorMessage(null);

        
        setChatMessages((prevMessages) => [...prevMessages, { sender: 'user', message: trimmedMessage }]);
        setMessage("");

        const token = sessionStorage.getItem("token");

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/chat`, 
          { question: trimmedMessage }, 
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        const botResponse = response.data.answer; //response from queryAmie

        // save the new message in the database for starting a chat
        if(isNewChat) {
          startNewChat(trimmedMessage, botResponse);
        }

        // call function to be saving messages of user and queryAmie
        if (isContinuousChat) {
          continueChat(trimmedMessage, 'user');
          setTimeout(() => {
              continueChat(botResponse, 'QueryAmie');
          }, 2000);
        }
      
        setChatErrorMessage(null);
        setChatMessages((prevMessages) => [...prevMessages, { sender: 'QueryAmie', message: botResponse }]);

      } catch (error) {
        console.error("Error sending message:", error);
        setChatErrorMessage({ sender: 'error', message: "An unexpected error occurred. Please try again." });
      }
    }
  };


  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 bg-gray-900">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 pr-4 mb-4">
        <AnimatePresence>
          {chatMessages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start space-x-2 ${msg.sender === 'user' ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === 'QueryAmie' && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-gray-300" />
                </div>
              )}
              <div 
                dangerouslySetInnerHTML={{ __html: msg.message }} 
                className={`p-3 rounded-lg max-w-[70%] break-words ${msg.sender === 'user' ? "bg-gray-700 text-gray-100" : "bg-gray-800 text-gray-200"} overflow-x-auto`}
              >
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-300" />
                </div>
              )}
            </motion.div>
          ))}
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
              <div dangerouslySetInnerHTML={{ __html: chatErrorMessage.message }} className="p-3 rounded-lg max-w-[70%] break-words bg-gray-800 text-red-500"></div>
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
        <Button
          onClick={handleSendMessage}
          disabled={!isSubmitSuccessful}
          className="bg-gray-700 hover:bg-gray-600 text-gray-100">
          <Send className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={onNewChat} className="border-gray-700 text-gray-800 hover:bg-gray-800 hover:text-gray-100">
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
