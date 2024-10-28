import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface ChatHistoryProps {
  chatHistory: string[];
}

export function ChatHistory({ chatHistory }: ChatHistoryProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-200 dark:text-gray-300">
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
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center text-sm text-gray-600 dark:text-gray-400 p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <MessageSquare className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
              {chat}
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
