import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, File, SendIcon, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
  uploadedFiles: File[];
  onFileUpload: (files: File[]) => void;
  handleRemoveFile: (file: File) => void;
  onSubmitFiles: () => void;
  errorMessage: string | null;
  isLoading: boolean;
  isSubmitted: boolean;
}

export function FileUpload({
  uploadedFiles,
  onFileUpload,
  handleRemoveFile,
  onSubmitFiles,
  errorMessage,
  isLoading,
  isSubmitted,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    onFileUpload(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onFileUpload(files);
    }
  };

  return (
    <div className="space-y-4">
      <motion.div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-900/10"
            : "border-gray-300 dark:border-gray-700"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Upload className="mx-auto h-12 w-12 text-blue-500 dark:text-blue-400" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Drag and drop files here, or click to select files
        </p>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept=".pdf,.pptx,.docx,.txt"
          onChange={handleFileInputChange}
        />
      </motion.div>
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <ul className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: index * 0.1 }}
                className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 p-2"
              >
                <div className="flex items-center">
                  <File className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                  <span>{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => handleRemoveFile(file)}
                >
                  <X className="h-4 w-4 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-600" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </motion.li>
            ))}
          </ul>
        )}
        {errorMessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-red-600 dark:text-red-400 text-sm mt-2 text-center"
          >
            {errorMessage}
          </motion.p>
        )}
        {!isLoading && !isSubmitted && uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800"
              onClick={onSubmitFiles}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <SendIcon className="mr-2 h-4 w-4" />
                  Submit Files
                </>
              )}
            </Button>
          </motion.div>
        )}
        {isSubmitted && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-green-600 dark:text-green-400 text-sm mt-2 text-center"
          >
            Files uploaded successfully, you can start chatting now.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}