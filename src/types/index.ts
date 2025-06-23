export interface Message {
  id: string;
  sender_type: 'user' | 'assistant' | 'error';
  content: string;
  timestamp: string;
  file_context_used?: string[];
}

export interface ChatSession {
  chat_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}