import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, X } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';

interface RenameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newName: string) => void;
  currentName: string;
  title?: string;
  placeholder?: string;
  maxLength?: number;
}

const RenameDialog: React.FC<RenameDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentName,
  title = 'Rename Chat Session',
  placeholder = 'Enter new name...',
  maxLength = 50
}) => {
  const [name, setName] = useState(currentName);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
    }
  }, [isOpen, currentName]);

  const handleConfirm = async () => {
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName === currentName) {
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm(trimmedName);
      onClose();
    } catch (error) {
      // Error handling is done by the parent component
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-4">
                <div className="flex items-center space-x-3">
                  <Edit2 className="h-6 w-6 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">
                    {title}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 text-gray-400 hover:text-white"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="px-6 pb-4">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={placeholder}
                  maxLength={maxLength}
                  onKeyDown={handleKeyPress}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-2">
                  {name.length}/{maxLength} characters
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 p-6 pt-4 border-t border-gray-700">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={isLoading || !name.trim() || name.trim() === currentName}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RenameDialog; 