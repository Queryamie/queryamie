import { useState } from "react";
import { MessageSquare, Trash2, Edit2 } from "lucide-react";
import { motion } from "framer-motion";

interface ChatSession {
  chat_id: string;
  name: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ChatHistoryProps {
  chatHistory: ChatSession[];
  onSessionClick: (sessionId: string) => void;
  onDeleteHistoryClick: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newName: string) => void;
  currentChatSessionId: string;
}

export function ChatHistory({
  chatHistory = [],
  onSessionClick,
  onDeleteHistoryClick,
  onRenameSession,
  currentChatSessionId,
}: ChatHistoryProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [sessionToRename, setSessionToRename] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const handleDeleteClick = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (sessionToDelete) {
      onDeleteHistoryClick(sessionToDelete);
    }
    setIsDeleteModalOpen(false);
    setSessionToDelete(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSessionToDelete(null);
  };

  const handleRenameClick = (sessionId: string, currentName: string | null) => {
    setSessionToRename(sessionId);
    setNewName(currentName || "");
    setIsRenameModalOpen(true);
  };

  const confirmRename = () => {
    if (sessionToRename && newName.trim()) {
      onRenameSession(sessionToRename, newName.trim());
      setIsRenameModalOpen(false);
      setSessionToRename(null);
      setNewName("");
    }
  };

  const closeRenameModal = () => {
    setIsRenameModalOpen(false);
    setSessionToRename(null);
    setNewName("");
  };

  // Filter chat sessions to only show those with valid names
  const filteredChatHistory = chatHistory.filter(session => session.name && session.name.trim());

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        Chat History
      </h3>
      {filteredChatHistory.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No named chat sessions yet
        </p>
      ) : (
        <ul className="space-y-1">
          {filteredChatHistory.map((session, index) => (
            <motion.li
              key={session.chat_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between text-sm p-2 rounded-md ${
                session.chat_id === currentChatSessionId
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <div
                onClick={() => onSessionClick(session.chat_id)}
                className="flex items-center cursor-pointer flex-grow"
              >
                <MessageSquare className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                {session.name}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRenameClick(session.chat_id, session.name);
                  }}
                  className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                  aria-label="Rename session"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(session.chat_id);
                  }}
                  className="text-red-500 hover:text-red-600 dark:hover:text-red-400"
                  aria-label="Delete session"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Are you sure you want to delete this chat session? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {isRenameModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Rename Chat Session
            </h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new chat name"
              maxLength={50}
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={closeRenameModal}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmRename}
                disabled={!newName.trim()}
                className={`px-4 py-2 rounded-md text-white ${
                  newName.trim()
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-500 cursor-not-allowed'
                }`}
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}