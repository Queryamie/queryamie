"use client"

import { useState } from "react"
import { MessageSquare, Trash2, Edit2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChatSession {
  chat_id: string
  name: string | null
  status: string
  created_at: string
  updated_at: string
}

interface ChatHistoryProps {
  chatHistory: ChatSession[]
  onSessionClick: (sessionId: string) => void
  onDeleteHistoryClick: (sessionId: string) => void
  onRenameSession: (sessionId: string, newName: string) => void
  currentChatSessionId: string
}

export function ChatHistory({
  chatHistory = [],
  onSessionClick,
  onDeleteHistoryClick,
  onRenameSession,
  currentChatSessionId,
}: ChatHistoryProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const [sessionToRename, setSessionToRename] = useState<string | null>(null)
  const [newName, setNewName] = useState("")

  const handleDeleteClick = (sessionId: string) => {
    setSessionToDelete(sessionId)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (sessionToDelete) {
      onDeleteHistoryClick(sessionToDelete)
    }
    setIsDeleteModalOpen(false)
    setSessionToDelete(null)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSessionToDelete(null)
  }

  const handleRenameClick = (sessionId: string, currentName: string | null) => {
    setSessionToRename(sessionId)
    setNewName(currentName || "")
    setIsRenameModalOpen(true)
  }

  const confirmRename = () => {
    if (sessionToRename && newName.trim()) {
      onRenameSession(sessionToRename, newName.trim())
      setIsRenameModalOpen(false)
      setSessionToRename(null)
      setNewName("")
    }
  }

  const closeRenameModal = () => {
    setIsRenameModalOpen(false)
    setSessionToRename(null)
    setNewName("")
  }

  // Show all chat sessions, not just named ones
  const sortedChatHistory = [...chatHistory].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center">
        <MessageSquare className="h-5 w-5 mr-2 text-purple-400" />
        Chat History
      </h3>
      {sortedChatHistory.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No chat sessions yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {sortedChatHistory.map((session, index) => (
              <motion.div
                key={session.chat_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSessionClick(session.chat_id)}
                className={`group backdrop-blur-sm rounded-xl p-3 border transition-all duration-200 cursor-pointer ${
                  session.chat_id === currentChatSessionId
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50 shadow-lg"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-grow min-w-0">
                    <MessageSquare className="h-4 w-4 mr-3 text-purple-400 flex-shrink-0" />
                    <span className="text-white text-sm truncate font-medium">
                      {session.name || `Chat ${new Date(session.created_at).toLocaleDateString()}`}
                    </span>
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRenameClick(session.chat_id, session.name)
                      }}
                      className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteClick(session.chat_id)
                      }}
                      className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">Delete Chat Session</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this chat session? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <Button variant="ghost" onClick={closeDeleteModal} className="text-gray-400 hover:text-white">
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {isRenameModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">Rename Chat Session</h3>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new name"
              className="mb-6 bg-gray-700 border-gray-600 text-white"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <Button variant="ghost" onClick={closeRenameModal} className="text-gray-400 hover:text-white">
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={confirmRename}
                className="bg-purple-500 hover:bg-purple-600 text-white"
                disabled={!newName.trim()}
              >
                Rename
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
