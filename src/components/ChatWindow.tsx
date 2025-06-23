"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, PlusCircle, Bot, User, Paperclip, Loader, Sparkles, FileText } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import ReactMarkdown from "react-markdown"

interface ChatWindowProps {
  isSubmitSuccessful: boolean
  isSidebarOpen: boolean
  toggleSidebar: () => void
  onNewChat: () => void
  chatMessages: Message[]
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>
  chatErrorMessage: Message | null
  setChatErrorMessage: React.Dispatch<React.SetStateAction<Message | null>>
  isNewChat: boolean
  setIsNewChat: React.Dispatch<React.SetStateAction<boolean>>
  chatHistoryMessages: Message[]
  currentChatSessionId: string
  setCurrentChatSessionId: React.Dispatch<React.SetStateAction<string>>
}

interface Message {
  id: string
  sender_type: "user" | "assistant" | "error"
  content: string
  timestamp: string
  file_context_used?: string[]
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
  const [message, setMessage] = useState("")
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const hasMessages = chatMessages.length > 0 || chatErrorMessage
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages, chatErrorMessage])

  useEffect(() => {
    if (chatHistoryMessages.length > 0) {
      setChatMessages(chatHistoryMessages)
    }
  }, [chatHistoryMessages, setChatMessages])

  const handleSendMessage = async () => {
    if (!message.trim() || !currentChatSessionId) return

    const trimmedMessage = message.trim()
    const userMessage: Message = {
      id: Date.now().toString(),
      sender_type: "user",
      content: trimmedMessage,
      timestamp: new Date().toISOString(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsLoading(true)
    setChatErrorMessage(null)

    try {
      console.log("this is the question: ", trimmedMessage)
      const token = sessionStorage.getItem("access_token")
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/chat/${currentChatSessionId}/message`,
        { content: trimmedMessage },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const { answer } = response.data
      const botMessage: Message = {
        id: Date.now().toString(),
        sender_type: "assistant",
        content: answer,
        timestamp: new Date().toISOString(),
      }

      setChatMessages((prev) => [...prev, botMessage])
      setIsNewChat(false)
    } catch (error) {
      console.error("Error sending message:", error)
      setChatErrorMessage({
        id: Date.now().toString(),
        sender_type: "error",
        content: "An unexpected error occurred. Please try again.",
        timestamp: new Date().toISOString(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full w-full backdrop-blur-sm bg-white/5 overflow-y-auto">
      {/* Chat Messages Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
      >
        <AnimatePresence>
          {!hasMessages && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center h-full text-center py-12"
            >
              <motion.div
                className="relative mb-8"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-3xl">
                  <Bot className="h-12 w-12 text-white" />
                </div>
                <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-2 -right-2" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-2xl"
              >
                <h2 className="text-3xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  Welcome to QueryAmie!
                </h2>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  I'm your AI document assistant. Upload your documents and start asking questions to unlock insights,
                  get summaries, and explore your content in new ways.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <div className="flex items-center space-x-2 text-purple-400">
                    <FileText className="h-5 w-5" />
                    <span className="text-sm">Upload documents</span>
                  </div>
                  <div className="flex items-center space-x-2 text-pink-400">
                    <Bot className="h-5 w-5" />
                    <span className="text-sm">Ask questions</span>
                  </div>
                  <div className="flex items-center space-x-2 text-yellow-400">
                    <Sparkles className="h-5 w-5" />
                    <span className="text-sm">Get insights</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {chatMessages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex items-start space-x-4 ${msg.sender_type === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender_type === "assistant" && (
                <motion.div
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
              )}

              <motion.div
                className={`max-w-[75%] rounded-2xl p-4 shadow-lg ${
                  msg.sender_type === "user"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "backdrop-blur-md bg-white/10 border border-white/20 text-white"
                }`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-4 mb-2 last:mb-0 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 last:mb-0 space-y-1">{children}</ol>,
                    code: ({ children }) => (
                      <code className="bg-black/20 px-2 py-1 rounded text-sm font-mono">{children}</code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-black/30 p-3 rounded-lg overflow-x-auto text-sm font-mono border border-white/10">
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </motion.div>

              {msg.sender_type === "user" && (
                <motion.div
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-start space-x-4 justify-start"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Loader className="w-5 h-5 animate-spin text-purple-400" />
                  <span className="text-white">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          {chatErrorMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-start space-x-4 justify-start"
            >
              <div className="w-10 h-10 rounded-2xl bg-red-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="max-w-[75%] backdrop-blur-md bg-red-500/10 border border-red-500/20 rounded-2xl p-4 shadow-lg">
                <div className="text-red-400">
                  <ReactMarkdown>{chatErrorMessage.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/20 backdrop-blur-md bg-white/5">
        <div className="flex items-end space-x-4 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                isSubmitSuccessful
                  ? "Ask me anything about your documents..."
                  : "Upload documents first to start chatting..."
              }
              onKeyPress={handleKeyPress}
              disabled={!isSubmitSuccessful || !currentChatSessionId || isLoading}
              className="bg-white/10 backdrop-blur-sm text-white border-white/20 focus:border-purple-400 focus:ring-purple-400/20 placeholder-gray-400 rounded-2xl h-12 pr-10" // Adjusted pr-12 to pr-10
            />
            {message && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-2 top-2 transform -translate-y-1/2"
              >
                <Button
                  onClick={handleSendMessage}
                  disabled={!isSubmitSuccessful || !currentChatSessionId || isLoading}
                  size="icon"
                  className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="hidden md:inline-flex border-purple-400 text-purple-400 hover:bg-purple-400/10 hover:text-purple-300 backdrop-blur-sm"
            onClick={isSmallScreen && isSidebarOpen ? onNewChat : toggleSidebar}
          >
            {isSmallScreen && isSidebarOpen ? (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Chat
              </>
            ) : (
              <>
                <Paperclip className="h-4 w-4 mr-2" />
                Files
              </>
            )}
          </Button>
        </div>

        {!isSubmitSuccessful && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-400 text-sm mt-3"
          >
            Upload and submit documents to start chatting
          </motion.p>
        )}
      </div>
    </div>
  )
}
