"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, File, SendIcon, X, Loader2, CheckCircle, FileText } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface FileUploadProps {
  uploadedFiles: File[]
  onFileUpload: (files: File[]) => void
  handleRemoveFile: (file: File) => void
  onSubmitFiles: () => void
  errorMessage: string | null
  isLoading: boolean
  isSubmitted: boolean
  onClose: () => void
}

export function FileUpload({
  uploadedFiles,
  onFileUpload,
  handleRemoveFile,
  onSubmitFiles,
  errorMessage,
  isLoading,
  isSubmitted,
  onClose
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    onFileUpload(files)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      onFileUpload(files)
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-400" />
      case "doc":
      case "docx":
        return <FileText className="h-4 w-4 text-blue-400" />
      case "txt":
        return <FileText className="h-4 w-4 text-gray-400" />
      case "pptx":
      case "ppt":
        return <FileText className="h-4 w-4 text-orange-400" />
      default:
        return <File className="h-4 w-4 text-purple-400" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-4">
      <div className="flex-none flex items-center justify-between ">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Upload className="h-5 w-5 mr-2 text-purple-400" />
          Upload Documents
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-400 hover:text-white hover:bg-white/20 rounded-full"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      <motion.div
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-purple-400 bg-purple-500/10 scale-105"
            : "border-white/30 hover:border-white/50 hover:bg-white/5"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 w-fit">
            <Upload className="h-8 w-8 text-purple-400" />
          </div>
          <p className="text-white font-medium mb-2">{isDragging ? "Drop files here" : "Drag and drop files here"}</p>
          <p className="text-sm text-gray-400">or click to select files</p>
          <p className="text-xs text-gray-500 mt-2">Supports PDF, DOCX, TXT, PPTX</p>
        </motion.div>
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <h4 className="text-sm font-medium text-gray-300">Uploaded Files</h4>
            {uploadedFiles.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getFileIcon(file.name)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate font-medium">{file.name}</p>
                    <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-red-500/20 text-red-400 hover:text-red-300 flex-shrink-0"
                  onClick={() => handleRemoveFile(file)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
          >
            <p className="text-red-400 text-sm text-center">{errorMessage}</p>
          </motion.div>
        )}

        {!isLoading && !isSubmitted && uploadedFiles.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-12 rounded-xl font-medium shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              onClick={onSubmitFiles}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <SendIcon className="mr-2 h-4 w-4" />
                  Upload Files
                </>
              )}
            </Button>
          </motion.div>
        )}

        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
          >
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              <p className="text-sm font-medium">Files uploaded successfully!</p>
            </div>
            <p className="text-xs text-green-300 text-center mt-1">You can now start chatting about your documents</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
