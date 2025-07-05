import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Upload, File, Send, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
  uploadedFiles: File[];
  onFileUpload: (files: File[]) => void;
  handleRemoveFile: (file: File) => void;
  onSubmitFiles: () => void;
  errorMessage: string | null,
  isLoading: boolean,
  isSubmitted: boolean,
}

export function FileUpload({ uploadedFiles, onFileUpload, handleRemoveFile, onSubmitFiles, errorMessage, isLoading, isSubmitted}: FileUploadProps) {
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
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-2"
          >
            <h3 className="text-sm font-semibold text-gray-200 dark:text-gray-300">
              Uploaded Files:
            </h3>
            <ul className="space-y-1">
              {uploadedFiles.map((file, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between text-sm text-gray-200 dark:text-gray-400 bg-gray-800 rounded-md p-2"
                >
                  <div className="flex items-center">
                    <File className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                    {file.name}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-gray-700"
                    onClick={() => handleRemoveFile(file)}
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-red-400" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </motion.li>
              ))}
            </ul>
            {errorMessage && <p className="text-red-600 text-sm mt-2.5 text-center">{errorMessage}</p>}
            {!isSubmitted ? (
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                onClick={onSubmitFiles}
              >
                {isLoading ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting your files...
                    </>
                ) : (
                    <>
                    <Send className="mr-2 h-4 w-4"/>
                    Submit Files
                    </>
                )}
              </Button>            ) : (
            <div className="text-center text-gray-200">
                <p className="text-green-500">Files submitted successfully, you can start chatting now.</p>
            </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}