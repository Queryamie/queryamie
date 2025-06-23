"use client"

import { FileUpload } from "./FileUpload"
import { ChatHistory } from "./ChatHistory"
import { motion } from "framer-motion"

interface ChatSession {
  chat_id: string
  name: string | null
  status: string
  created_at: string
  updated_at: string
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  uploadedFiles: File[]
  onFileUpload: (files: File[]) => void
  handleRemoveFile: (file: File) => void
  onSubmitFiles: () => void
  chatHistory: ChatSession[]
  onSessionClick: (sessionId: string) => void
  onDeleteHistoryClick: (sessionId: string) => void
  onRenameSession: (sessionId: string, newName: string) => void
  errorMessage: string | null
  isLoading: boolean
  isSubmitted: boolean
  currentChatSessionId: string
}

export default function Sidebar({
  isOpen,
  onClose,
  uploadedFiles,
  onFileUpload,
  handleRemoveFile,
  onSubmitFiles,
  chatHistory,
  onSessionClick,
  onDeleteHistoryClick,
  onRenameSession,
  errorMessage,
  isLoading,
  isSubmitted,
  currentChatSessionId,
}: SidebarProps) {
  return (
    <motion.div
      initial={{ x: -400 }}
      animate={{ x: isOpen ? 0 : -400 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed inset-y-0 left-0 z-50 w-80 backdrop-blur-md bg-white/20 border-r border-white/20 shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 p-4 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/50 scrollbar-track-transparent">
          <FileUpload
            uploadedFiles={uploadedFiles}
            onFileUpload={onFileUpload}
            handleRemoveFile={handleRemoveFile}
            onSubmitFiles={onSubmitFiles}
            errorMessage={errorMessage}
            isLoading={isLoading}
            isSubmitted={isSubmitted}
            onClose={onClose}
          />
          <ChatHistory
            chatHistory={chatHistory}
            onSessionClick={onSessionClick}
            onDeleteHistoryClick={onDeleteHistoryClick}
            onRenameSession={onRenameSession}
            currentChatSessionId={currentChatSessionId}
          />
        </div>
      </div>
    </motion.div>
  )
}