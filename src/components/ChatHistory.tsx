import { useState } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface ChatSession {
  session_id: string;
  session_name: string;
  created_at: string;
}

interface ChatHistoryProps {
  chatHistory: ChatSession[];
  onSessionClick: (sessionId: string) => void;
  onDeleteHistoryClick: (sessionId: string) => void;
  currentChatSessionId: string;
}

export function ChatHistory({ chatHistory, onSessionClick, onDeleteHistoryClick, currentChatSessionId }: ChatHistoryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const handleDeleteClick = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setIsModalOpen(true); // Open the modal for confirmation
  };

  const confirmDelete = () => {
    if (sessionToDelete) {
      onDeleteHistoryClick(sessionToDelete); // Call onDeleteHistoryClick with the session ID
    }
    setIsModalOpen(false);
    setSessionToDelete(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSessionToDelete(null);
  };

  return (
    <div className="space-y-2">
      <h3 className="text-1xl font-bold text-gray-200 dark:text-gray-300">
        Chat History
      </h3>
      {chatHistory.length === 0 ? (
        <p className="text-sm text-gray-200 dark:text-gray-400">
          No chat history yet
        </p>
      ) : (
        <ul className="space-y-1">
          {chatHistory.map((chat, index) => (
            <motion.li
              key={chat.session_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between text-sm p-2 rounded-md transition-colors cursor-pointer ${
                chat.session_id === currentChatSessionId
                  ? 'bg-blue-600 text-white' // Highlight class for the active session
                  : 'text-gray-300 dark:text-gray-400 hover:bg-blue-500 dark:hover:bg-blue-900/20'
              }`}
            >
              <div
                onClick={() => onSessionClick(chat.session_id)}
                className="flex items-center cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-800 hover:text-white" />
                {chat.session_name}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(chat.session_id);
                }}
                className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-md"
                aria-label="Delete session"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.li>
          ))}
        </ul>
      )}

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this chat session? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
