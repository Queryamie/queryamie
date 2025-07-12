import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Plus, Edit2, Trash2, Languages, X, Menu, Upload, FileText, LogOut, Check, X as XIcon } from 'lucide-react';
import { Button } from './ui/button';
import logo from '../assets/logo.png';

// Tooltip component (fix typing)
const Tooltip: React.FC<{ label: string; children: ReactNode }> = ({ label, children }) => (
  <div className="relative group">
    {children}
    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-[9999] pointer-events-none opacity-0 group-hover:opacity-100 transition bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
      {label}
    </div>
  </div>
);

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

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  chatSessions: ChatSession[];
  currentChatId: string | null;
  startNewChat: () => void;
  selectChatSession: (chatId: string) => void;
  renameChatSession: (chatId: string, newName: string) => void;
  deleteChatSession: (chatId: string) => void;
  selectedLanguage: string;
  isTranslating: boolean;
  translateContent: (lang: string) => void;
  handleLogout: () => void;
  uploadedFiles?: { id: string; filename: string }[];
  onUploadClick?: () => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

const Sidebar: React.FC<SidebarProps & {
  editingChatId: string | null;
  editingName: string;
  setEditingName: (name: string) => void;
  saveEditedChatName: (chatId: string) => void;
  cancelEditing: () => void;
  editInputRef: React.RefObject<HTMLInputElement>;
  pendingDelete: string | null;
  confirmDelete: (chatId: string) => void;
  cancelDelete: () => void;
}> = ({
  isOpen,
  onToggle,
  chatSessions,
  currentChatId,
  startNewChat,
  selectChatSession,
  renameChatSession,
  deleteChatSession,
  selectedLanguage,
  isTranslating,
  translateContent,
  handleLogout,
  uploadedFiles = [],
  onUploadClick,
  editingChatId,
  editingName,
  setEditingName,
  saveEditedChatName,
  cancelEditing,
  editInputRef,
  pendingDelete,
  confirmDelete,
  cancelDelete,
}) => {
  const [showFilesPopover, setShowFilesPopover] = useState(false);
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const sidebarWidth = isOpen ? 'w-72 md:w-72' : isMobile ? 'w-0' : 'w-16';
  const sidebarBase = `fixed z-40 inset-y-0 left-0 bg-dark-900/95 backdrop-blur-md border-r border-dark-700/50 flex flex-col transition-all duration-300 ${sidebarWidth}`;
  const iconSize = isOpen ? 'h-5 w-5' : 'h-6 w-6';

  return (
    <>
      {/* Sidebar overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <motion.nav
        initial={false}
        animate={{ width: isOpen ? 288 : isMobile ? 0 : 64 }}
        className={sidebarBase}
        style={{ boxShadow: isOpen ? '0 0 32px 0 rgba(0,0,0,0.25)' : undefined }}
      >
        {/* Top: Toggle, Logo, System Name */}
        <div className={`flex items-center h-14 px-3 gap-3 border-b border-dark-700/50 ${!isOpen ? 'justify-center' : ''}`}>
          {/* Menu/close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-gray-400 hover:text-primary-400 hover:bg-dark-700/50 focus:outline-none transition-colors"
            aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          {isOpen && (
            <div className="flex items-center gap-3">
              <img src={logo} alt="QueryAmie Logo" className="w-8 h-8" />
              <span className="text-lg font-semibold text-white">QueryAmie</span>
            </div>
          )}
        </div>

        {/* Main nav buttons */}
        <div className={`flex flex-col gap-2 mt-6 ${isOpen ? 'px-3' : 'px-2'}`}>
          {/* New Chat Button */}
          {isOpen ? (
            <Button
              onClick={startNewChat}
              variant="ghost"
              className="justify-start w-full h-11 text-gray-300 hover:text-primary-400 hover:bg-dark-700/50 transition-colors"
            >
              <Plus className="h-5 w-5 mr-3" />
              New Chat
            </Button>
          ) : (
            <Tooltip label="New Chat">
              <Button
                onClick={startNewChat}
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-lg text-gray-400 hover:text-primary-400 hover:bg-dark-700/50 transition-colors"
              >
                <Plus className={iconSize} />
              </Button>
            </Tooltip>
          )}

          {/* View Files */}
          {isOpen ? (
            <div
              className="relative"
              onMouseEnter={() => setShowFilesPopover(true)}
              onMouseLeave={() => setShowFilesPopover(false)}
            >
              <Button
                variant="ghost"
                className="justify-start w-full h-11 text-gray-300 hover:text-primary-400 hover:bg-dark-700/50 transition-colors"
                onClick={e => e.preventDefault()}
              >
                <FileText className="h-5 w-5 mr-3" />
                View Files
                {uploadedFiles.length > 0 && (
                  <span className="ml-auto bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {uploadedFiles.length}
                  </span>
                )}
              </Button>
              <AnimatePresence>
                {showFilesPopover && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-full top-0 ml-2 w-64 bg-dark-800 border border-dark-600 rounded-lg shadow-xl p-4 z-[9999]"
                  >
                    <div className="text-sm font-medium text-white mb-3">Uploaded Documents</div>
                    {uploadedFiles.length === 0 ? (
                      <div className="text-gray-400 text-sm">No files uploaded yet.</div>
                    ) : (
                      <ul className="space-y-2 max-h-48 overflow-y-auto">
                        {uploadedFiles.map(f => (
                          <li key={f.id} className="flex items-center gap-2 p-2 rounded bg-dark-700/50">
                            <FileText className="h-4 w-4 text-primary-400 flex-shrink-0" />
                            <span className="truncate text-gray-300 text-sm">{f.filename}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Tooltip label="View Files">
              <div
                className="relative"
                onMouseEnter={() => setShowFilesPopover(true)}
                onMouseLeave={() => setShowFilesPopover(false)}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-lg text-gray-400 hover:text-primary-400 hover:bg-dark-700/50 transition-colors relative"
                  onClick={e => e.preventDefault()}
                >
                  <FileText className={iconSize} />
                  {uploadedFiles.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {uploadedFiles.length}
                    </span>
                  )}
                </Button>
                <AnimatePresence>
                  {showFilesPopover && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-full top-0 ml-2 w-64 bg-dark-800 border border-dark-600 rounded-lg shadow-xl p-4 z-[9999]"
                    >
                      <div className="text-sm font-medium text-white mb-3">Uploaded Documents</div>
                      {uploadedFiles.length === 0 ? (
                        <div className="text-gray-400 text-sm">No files uploaded yet.</div>
                      ) : (
                        <ul className="space-y-2 max-h-48 overflow-y-auto">
                          {uploadedFiles.map(f => (
                            <li key={f.id} className="flex items-center gap-2 p-2 rounded bg-dark-700/50">
                              <FileText className="h-4 w-4 text-primary-400 flex-shrink-0" />
                              <span className="truncate text-gray-300 text-sm">{f.filename}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Tooltip>
          )}

          {/* Upload Button */}
          {isOpen ? (
            <Button
              onClick={onUploadClick}
              variant="ghost"
              className="justify-start w-full h-11 text-gray-300 hover:text-primary-400 hover:bg-dark-700/50 transition-colors"
            >
              <Upload className="h-5 w-5 mr-3" />
              Upload Files
            </Button>
          ) : (
            <Tooltip label="Upload Files">
              <Button
                onClick={onUploadClick}
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-lg text-gray-400 hover:text-primary-400 hover:bg-dark-700/50 transition-colors"
              >
                <Upload className={iconSize} />
              </Button>
            </Tooltip>
          )}

          {/* Language Selector */}
          {isOpen && (
            <div className="mt-4 space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-400 px-1">
                <Languages className="h-4 w-4" />
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={e => translateContent(e.target.value)}
                disabled={isTranslating}
                className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-dark-800">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!isOpen && (
            <Tooltip label="Language">
              <div className="flex items-center justify-center mt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-lg text-gray-400 hover:text-primary-400 hover:bg-dark-700/50 transition-colors"
                >
                  <Languages className={iconSize} />
                </Button>
              </div>
            </Tooltip>
          )}
        </div>

        {/* Chat Sessions (scrollable) */}
        <div className={`flex-1 overflow-y-auto mt-6 ${isOpen ? 'px-3' : 'hidden'}`} style={{ minHeight: 0 }}>
          {chatSessions.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-8 w-8 text-gray-600 mb-3" />
              <p className="text-gray-400 text-sm">
                No conversations yet
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Start a new chat to see it here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-400 px-2 mb-3">Recent Conversations</div>
              {chatSessions.map((session) => (
                <motion.div
                  key={session.chat_id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    currentChatId === session.chat_id
                      ? 'bg-primary-500/20 border border-primary-500/30'
                      : 'bg-dark-800/50 hover:bg-dark-700/70'
                  }`}
                  onClick={() => !editingChatId && !pendingDelete && selectChatSession(session.chat_id)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <MessageSquare className="h-4 w-4 text-primary-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        {editingChatId === session.chat_id ? (
                          <div className="flex items-center w-full">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="flex-1 bg-dark-600 border border-dark-500 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-primary-500 min-w-0"
                              autoFocus
                              ref={editInputRef}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEditedChatName(session.chat_id);
                                if (e.key === 'Escape') cancelEditing();
                              }}
                              style={{ minWidth: 0 }}
                            />
                            <div className="flex items-center ml-2 gap-1 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => { e.stopPropagation(); saveEditedChatName(session.chat_id); }}
                                className="h-6 w-6 text-green-400 hover:text-green-300 hover:bg-green-500/20"
                                tabIndex={-1}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => { e.stopPropagation(); cancelEditing(); }}
                                className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                tabIndex={-1}
                              >
                                <XIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-white truncate">
                              {session.name || `Chat ${session.chat_id.slice(-6)}`}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {session.analytics.document_count} docs • {session.analytics.message_count} messages
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    {/* Action icons always at right end */}
                    {editingChatId !== session.chat_id && (
                      <div className="flex items-center space-x-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {pendingDelete === session.chat_id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => { e.stopPropagation(); confirmDelete(session.chat_id); }}
                              className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                              title="Confirm delete"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => { e.stopPropagation(); cancelDelete(); }}
                              className="h-7 w-7 text-gray-400 hover:text-gray-300 hover:bg-gray-500/20"
                              title="Cancel delete"
                            >
                              <XIcon className="h-3 w-3" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                renameChatSession(session.chat_id, session.name || `Chat ${session.chat_id.slice(-6)}`);
                              }}
                              className="h-7 w-7 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20"
                              title="Rename chat"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => { e.stopPropagation(); deleteChatSession(session.chat_id); }}
                              className="h-7 w-7 text-gray-400 hover:text-red-400 hover:bg-red-500/20"
                              title="Delete chat"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom: Profile & Logout */}
        <div className={`mt-auto border-t border-dark-700/50 ${isOpen ? 'px-3 py-4' : 'px-2 py-3'}`}>
          {isOpen ? (
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start h-11 text-gray-300 hover:text-primary-400 hover:bg-dark-700/50 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          ) : (
            <Tooltip label="Logout">
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-lg text-gray-400 hover:text-primary-400 hover:bg-dark-700/50 transition-colors"
              >
                <LogOut className={iconSize} />
              </Button>
            </Tooltip>
          )}
        </div>
      </motion.nav>
    </>
  );
};

export default Sidebar;