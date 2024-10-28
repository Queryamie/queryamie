import { FileUpload } from './FileUpload'
import { ChatHistory } from './ChatHistory'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  uploadedFiles: File[]
  onFileUpload: (files: File[]) => void
  handleRemoveFile: (file: File) => void;
  onSubmitFiles: () => void
  chatHistory: string[]
}

export default function Sidebar({
  isOpen,
  onClose,
  uploadedFiles,
  onFileUpload,
  handleRemoveFile,
  onSubmitFiles,
  chatHistory,
}: SidebarProps) {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0`}
    >
      <div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-gray-400 hover:text-gray-100" 
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      <div className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-4rem)] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <FileUpload
          uploadedFiles={uploadedFiles}
          onFileUpload={onFileUpload}
          handleRemoveFile={handleRemoveFile}
          onSubmitFiles={onSubmitFiles}
        />
        <ChatHistory chatHistory={chatHistory} />
      </div>
    </div>
  )
}