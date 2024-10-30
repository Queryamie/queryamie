"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, PlusCircle, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatWindowProps {
  currentChat: string[];
  onSendMessage: (message: string) => void;
  isFileUploaded: boolean;
  onNewChat: () => void;
}

export default function ChatWindow({ currentChat, onSendMessage, isFileUploaded, onNewChat, }: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentChat]);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 bg-gray-900">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-4 pr-4 mb-4"
      >
        <AnimatePresence>
          {currentChat.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start space-x-2 ${
                index % 2 === 0 ? "justify-end" : "justify-start"
              }`}
            >
              {index % 2 !== 0 && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-gray-300" />
                </div>
              )}
              <div
                className={`p-3 rounded-lg max-w-[70%] break-words ${
                  index % 2 === 0
                    ? "bg-gray-700 text-gray-100"
                    : "bg-gray-800 text-gray-200"
                }`}
              >
                {msg}
              </div>
              {index % 2 === 0 && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-300" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex items-center space-x-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={!isFileUploaded}
          className="flex-1 bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!isFileUploaded}
          className="bg-gray-700 hover:bg-gray-600 text-gray-100"
        >
          <Send className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={onNewChat}
          className="border-gray-700 text-gray-800 hover:bg-gray-800 hover:text-gray-100"
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
