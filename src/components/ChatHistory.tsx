import { useState } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface ChatSession {
  chat_id: string;
  name?: string;
  status: string;
  created_at: string;
  updated_at: string;
  analytics: {
    document_count: number;
    message_count: number;
    latest_document: string | null;
  };
}

interface ChatHistoryProps {
  chatSessions: ChatSession[];
  onSessionClick: (sessionId: string) => void;
  onDeleteClick: (sessionId: string) => void;
  currentSessionId: string | null;
}

export function ChatHistory({ chatSessions, onSessionClick, onDeleteClick, currentSessionId }: ChatHistoryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const handleDeleteClick = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessionToDelete(sessionId);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (sessionToDelete) {
      onDeleteClick(sessionToDelete);
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
      {chatSessions.length === 0 ? (
        <p className="text-sm text-gray-200 dark:text-gray-400">
          No chat history yet
        </p>
      ) : (
        <ul className="space-y-1">
          {chatSessions.map((session) => (
            <motion.li
              key={session.chat_id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                session.chat_id === currentSessionId
                  ? "bg-primary-600 text-white"
                  : "hover:bg-gray-700 text-gray-300"
              }`}
              onClick={() => onSessionClick(session.chat_id)}
            >
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm truncate">{session.name || 'New Chat'}</span>
              </div>
              <button
                onClick={(e) => handleDeleteClick(session.chat_id, e)}
                className={`p-1 rounded-full transition-colors ${
                  session.chat_id === currentSessionId
                    ? "hover:bg-primary-700 text-white"
                    : "hover:bg-gray-600 text-gray-400"
                }`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.li>
          ))}
        </ul>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h4 className="text-lg font-semibold text-gray-200 mb-4">Delete Chat</h4>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this chat?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
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
