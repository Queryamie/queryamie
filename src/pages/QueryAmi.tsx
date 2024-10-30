"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { Menu, X, MessageSquare, User, Settings, LogOut, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QueryAmi() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [chatHistory, setChatHistory] = useState<string[]>([]);
    const [currentChat, setCurrentChat] = useState<string[]>([]);
    
    const navigate = useNavigate();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleFileUpload = (newFiles: File[]) => {
        setUploadedFiles((prevFiles) => {
            const existingFileNames = new Set(prevFiles.map((file) => file.name));
            const filteredNewFiles = newFiles.filter((file) => !existingFileNames.has(file.name));
            return [...prevFiles, ...filteredNewFiles];
        });
    };

    const handleRemoveFile = (fileToRemove: File) => {
        setUploadedFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
    };


    const handleSubmitFiles = () => {
        if (uploadedFiles.length > 0) {
            console.log("Submitting files:", uploadedFiles);
        }
    };

    const handleNewChat = () => {
        setUploadedFiles([]);
        setCurrentChat([]);
    };

    const handleLogout = () => {
        navigate("/");
        console.log("Logged out");
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900">
            <header className="bg-gray-800 shadow-lg h-16 flex items-center justify-between px-4 border-b border-gray-700">
            <div className="flex items-center space-x-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-gray-300 hover:text-gray-100 hover:bg-gray-700 rounded-full"
                    onClick={toggleSidebar}
                >
                {isSidebarOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <Menu className="h-6 w-6" />
                )}
                <span className="sr-only">Toggle sidebar</span>
                </Button>
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-500 p-2 rounded-full">
                        <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-100">
                        Query<span className="text-blue-400">Amie</span>
                    </h1>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:inline-flex border-gray-600 text-gray-800 hover:text-gray-100 hover:bg-gray-700"
                    onClick={handleNewChat}
                >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    New Chat
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <User className="h-5 w-5 text-gray-300" />
                            <span className="sr-only">User menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 text-gray-100">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                            <DropdownMenuItem className="focus:bg-gray-700">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-gray-700">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="focus:bg-gray-700" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            </header>
            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={toggleSidebar}
                    uploadedFiles={uploadedFiles}
                    onFileUpload={handleFileUpload}
                    handleRemoveFile={handleRemoveFile}
                    onSubmitFiles={handleSubmitFiles}
                    chatHistory={chatHistory}
                />
                <main className="flex-1 overflow-hidden">
                    <ChatWindow
                        currentChat={currentChat}
                        onSendMessage={(message) => setCurrentChat([...currentChat, message])}
                        isFileUploaded={uploadedFiles.length > 0}
                        onNewChat={handleNewChat}
                    />
                    <Button onClick={handleSubmitFiles}>Submit Files</Button>
                </main>
            </div>
        </div>
    );
}
