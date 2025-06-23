"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Sidebar from "@/components/Sidebar"
import ChatWindow from "@/components/ChatWindow"
import { Menu, X, MessageSquare, User, LogOut, PlusCircle, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"

interface Message {
  id: string
  sender_type: "user" | "assistant" | "error"
  content: string
  timestamp: string
  file_context_used?: string[]
}

interface ChatSession {
  chat_id: string
  name: string | null
  status: string
  created_at: string
  updated_at: string
}

export default function QueryAmi() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [chatErrorMessage, setChatErrorMessage] = useState<Message | null>(null)
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)
  const [isNewChat, setIsNewChat] = useState(true)
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [currentChatSessionId, setCurrentChatSessionId] = useState("")

  const navigate = useNavigate()
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

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
    const token = sessionStorage.getItem("access_token")
    if (!token) {
      navigate("/")
    }
  }, [navigate])

  const handleFileUpload = (newFiles: File[]) => {
    setIsSubmitSuccessful(false)
    setUploadedFiles((prevFiles) => {
      const existingFileNames = new Set(prevFiles.map((file) => file.name))
      const filteredNewFiles = newFiles.filter((file) => !existingFileNames.has(file.name))
      return [...prevFiles, ...filteredNewFiles]
    })
  }

  const handleRemoveFile = (fileToRemove: File) => {
    setIsSubmitSuccessful(false)
    setUploadedFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove))
  }

  const handleSubmitFiles = async () => {
    setErrorMessage("")
    setIsLoading(true)

    if (!currentChatSessionId) {
      setErrorMessage("Please start a new chat before uploading files.")
      setIsLoading(false)
      return
    }

    if (uploadedFiles.length > 0) {
      const formData = new FormData()
      uploadedFiles.forEach((file) => formData.append("files", file))
      const token = sessionStorage.getItem("access_token")

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_API}/chat/${currentChatSessionId}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          },
        )
        console.log("Files uploaded successfully:", response.data)
        setIsSubmitSuccessful(true)
        setIsLoading(false)
        setUploadedFiles([])
        const { chat_name } = response.data
        setChatHistory((prevHistory) =>
          prevHistory.map((session) =>
            session.chat_id === currentChatSessionId ? { ...session, name: chat_name } : session,
          ),
        )
      } catch (error) {
        console.error("Upload failed:", error)
        setErrorMessage("Error uploading file(s).")
        setIsLoading(false)
      }
    } else {
      setErrorMessage("Please upload a file to submit.")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const GetNewChat = async () => {
      const token = sessionStorage.getItem("access_token")
      if (token) {
        await handleNewChat()
      }
    }
    GetNewChat()
  }, [])

  const handleNewChat = async () => {
    console.log("New chat clicked")
    try {
      const token = sessionStorage.getItem("access_token")
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/chat/start`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      )
      console.log("new chat clicked: ", response.data)
      const { chat_id } = response.data
      console.log("New chat session id:", chat_id)
      sessionStorage.setItem("chat_id", chat_id)
      setCurrentChatSessionId(chat_id)
      setChatMessages([])
      setChatErrorMessage(null)
      setIsSubmitSuccessful(false)
      setIsNewChat(true)
      setUploadedFiles([])
      fetchChatHistory()
    } catch (error) {
      console.error("Error starting new chat:", error)
      setErrorMessage("Failed to start a new chat.")
    }
  }

  const fetchChatHistory = async () => {
    try {
      const token = sessionStorage.getItem("access_token")
      if (!token) {
        console.error("No token found in sessionStorage")
        return
      }

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/chat/sessions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log("chat sessions retrieved :", response.data)
      setChatHistory(response.data)
    } catch (error) {
      console.error("Error fetching chat sessions:", error)
    }
  }

  useEffect(() => {
    fetchChatHistory()
  }, [])

  const handleFetchSessionMessages = async (chatId: string) => {
    if (chatId) {
      try {
        const token = sessionStorage.getItem("access_token")
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/chat/${chatId}/messages`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setChatMessages(response.data)
        setCurrentChatSessionId(chatId)
        sessionStorage.setItem("chat_id", chatId)
        setIsSubmitSuccessful(true)
        setIsNewChat(false)
        setIsSidebarOpen(false)
      } catch (error) {
        console.error("Error fetching messages:", error)
        setChatErrorMessage({
          id: Date.now().toString(),
          sender_type: "error",
          content: "Failed to load messages.",
          timestamp: new Date().toISOString(),
        })
      }
    }
  }

  const handleDeleteChatHistory = async (chatId: string) => {
    if (chatId) {
      try {
        const token = sessionStorage.getItem("access_token")
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_API}/chat/${chatId}/delete`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log("Chat deleted:", response.data)
        fetchChatHistory()
        if (chatId === currentChatSessionId) {
          setCurrentChatSessionId("")
          setChatMessages([])
          setIsSubmitSuccessful(false)
          setIsNewChat(true)
        }
      } catch (error) {
        console.error("Error deleting chat:", error)
        setErrorMessage("Failed to delete chat session.")
      }
    }
  }

  const handleRenameSession = async (chatId: string, newName: string) => {
    try {
      const token = sessionStorage.getItem("access_token")
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/chat/${chatId}/rename`,
        { name: newName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      )
      console.log("Chat renamed:", response.data)
      setChatHistory((prevHistory) =>
        prevHistory.map((session) => (session.chat_id === chatId ? { ...session, name: response.data.name } : session)),
      )
    } catch (error) {
      console.error("Error renaming chat:", error)
      setErrorMessage("Failed to rename chat session.")
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("access_token")
    sessionStorage.removeItem("chat_id")
    navigate("/")
    console.log("Logged out")
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <header className="relative z-10 h-16 flex items-center justify-between px-4 backdrop-blur-md bg-white/10 border-b border-white/20">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-300 hover:text-white hover:bg-white/20 rounded-full"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <Sparkles className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              QueryAmie
            </h1>
          </motion.div>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:inline-flex border-purple-400/50 text-purple-400 hover:text-white hover:bg-purple-500/20 backdrop-blur-sm"
            onClick={handleNewChat}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            New Chat
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/20">
                <User className="h-5 w-5 text-gray-300" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 backdrop-blur-md bg-white/10 border border-white/20 text-white">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem className="focus:bg-white/20 cursor-pointer" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden relative z-10">
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
  )
}
