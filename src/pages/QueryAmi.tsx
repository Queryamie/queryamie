"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { Menu, X, MessageSquare, User, LogOut, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Message {
  sender: 'user' | 'QueryAmie' | 'error';
  message: string;
}

interface ChatSession {
    session_id: string;
    session_name: string;
    created_at: string;
}


export default function QueryAmi() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [chatErrorMessage, setChatErrorMessage] = useState<Message | null>(null);
    const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
    const [isNewChat, setIsNewChat] = useState(true);
    const [isContinuousChat, setIsContinuousChat] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
    const [chatHistoryMessages, setChatHistoryMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [currentChatSessionId, setCurrentChatSessionId] = useState('');
    let historyCurrentChatSessionId = '';
    
    const navigate = useNavigate();
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Redirect if no token is present
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    const handleFileUpload = (newFiles: File[]) => {
        setIsSubmitted(false); //clear message and show the submit button again.
        setIsSubmitSuccessful(false)    //user must submit before they can continue to chat
        setUploadedFiles((prevFiles) => {
            const existingFileNames = new Set(prevFiles.map((file) => file.name));
            const filteredNewFiles = newFiles.filter((file) => !existingFileNames.has(file.name));
            return [...prevFiles, ...filteredNewFiles];
        });
    };

    const handleRemoveFile = (fileToRemove: File) => {
        setIsSubmitted(false); //clear message and show the submit button again.
        setUploadedFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
    };

    const handleSubmitFiles = async () => {
        setErrorMessage('');
        setIsLoading(true);

        if (uploadedFiles.length > 0) {
            const formData = new FormData();
            uploadedFiles.forEach((file) => formData.append("files", file));
    
            const token = sessionStorage.getItem("token");
            try {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/upload_documents`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}` // Add the authorization header
                    }
                });
                console.log("Files uploaded successfully:", response.data.msg);
                setIsSubmitSuccessful(true);
                setIsLoading(false);
                setIsSubmitted(true);
                // setUploadedFiles([]);
            } catch (error) {
                console.error("Upload failed:", error);
                setErrorMessage("Error Uploading File(s).");
                setIsLoading(false);
            }
        }
        else{
            setErrorMessage("Please upload a new file to submit");
        }
    };
            

    const handleNewChat = () => {
        setCurrentChatSessionId('');
        setUploadedFiles([]);
        setChatMessages([]);
        setIsSubmitSuccessful(false);
        setIsSubmitted(false);
        setChatErrorMessage(null);
        setIsNewChat(true);
    };


    useEffect(() => {
        fetchChatHistory();
        const interval = setInterval(fetchChatHistory, 1000);
        return () => clearInterval(interval);
    }, []);


    // This is for fetching all the chat history
    const fetchChatHistory = async () => {
        try {
            const response = await axios.get(
                `/api/chat/getChatSessions`,
                {
                    params: {
                        user_id: sessionStorage.getItem("userId"),
                    }
                }
            );
            const data = response.data;
            if (data.error) {
                console.error("Error", data.error);
            } else {
                setChatHistory(data.chat_sessions);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Fetch messages for the selected session
    const handleFetchSessionMessages = async (sessionId:string) => {
        if(sessionId) {
            try {
                const response = await axios.post(`/api/chat/getSessionMessages?session_id=${sessionId}`, {
                    user_id: sessionStorage.getItem("userId")
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = response.data;
                if (data.error) {
                    console.log(data.error);
                } else {
                    setChatHistoryMessages(data.messages);
                    setIsSidebarOpen(false) //close side bar
                    if(sessionId !== currentChatSessionId){
                        console.log("fetched chat history messages, the session id for fetching old messages: ", sessionId);
                        setCurrentChatSessionId(sessionId);
                        historyCurrentChatSessionId = sessionId;
                        console.log("i have updated the current chat session id to the old chat: ", currentChatSessionId);
                        setIsSubmitSuccessful(false)    //user must submit before they can continue to chat
                        setIsSubmitted(false); //clear message and show the submit button again.
                        setIsNewChat(false);    //don't start a new chat
                        setIsContinuousChat(true); //continue new chat
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
        else {
            console.error("session id needed to fetch messages");
        }
    }



    const handleDeleteChatHistory = async (sessionId: string) => {
        if(sessionId) {
            try {
                const userId = sessionStorage.getItem("userId");
                const response = await axios.delete(`/api/chat/deleteChatSession?session_id=${sessionId}`, {
                    params: { user_id: userId }
                });
        
                const data = response.data;
                if (data.error) {
                    console.error(data.error);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
        else {
            console.error("Session id required for deletion");
        }
    };




    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userId");
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
                            {/* <DropdownMenuItem className="focus:bg-gray-700">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-gray-700">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                        <DropdownMenuSeparator /> */}
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
                    onSessionClick={handleFetchSessionMessages}
                    onDeleteHistoryClick={handleDeleteChatHistory}
                    errorMessage={errorMessage}
                    isLoading={isLoading}
                    isSubmitted={isSubmitted}
                    currentChatSessionId={currentChatSessionId}
                />
                <main className="flex-1 overflow-hidden">
                    <ChatWindow
                        isSubmitSuccessful={isSubmitSuccessful}
                        isSidebarOpen={isSidebarOpen}
                        toggleSidebar={toggleSidebar}
                        onNewChat={handleNewChat}
                        chatMessages={chatMessages}
                        setChatMessages={setChatMessages}
                        chatErrorMessage={chatErrorMessage}
                        setChatErrorMessage={setChatErrorMessage}
                        isNewChat={isNewChat}
                        setIsNewChat={setIsNewChat}
                        isContinuousChat={isContinuousChat}
                        setIsContinuousChat={setIsContinuousChat}
                        chatHistoryMessages={chatHistoryMessages}
                        currentChatSessionId={historyCurrentChatSessionId}
                        setCurrentChatSessionId={setCurrentChatSessionId}
                    />
                    <Button
                    onClick={handleSubmitFiles}
                    >Submit Files
                    </Button>
                </main>
            </div>
        </div>
    );
}
