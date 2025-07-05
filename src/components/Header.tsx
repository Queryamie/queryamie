"use client";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Menu, X, MessageSquare, User, LogOut, PlusCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  onNewChat: () => void;
}

export default function Header({ isSidebarOpen, toggleSidebar, onNewChat }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("chat_id");
    navigate("/");
    console.log("Logged out");
  };

  return (
    <motion.header
      className="bg-white/5 backdrop-blur-md shadow-lg h-16 flex items-center justify-between px-4 border-b border-white/20" // Increased transparency
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-300 hover:text-white hover:bg-white/20 rounded-full"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <div className="hidden md:flex items-center space-x-3"> {/* Hidden on small screens */}
          <div className="relative">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            QueryAmie
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          className="hidden md:inline-flex border-purple-400 text-purple-400 hover:bg-purple-400/10 hover:text-purple-300 backdrop-blur-sm" // Hidden on small screens
          onClick={onNewChat}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          New Chat
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:text-white hover:bg-white/20 rounded-full"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white/10 backdrop-blur-md border-white/20 text-gray-100">
            <DropdownMenuLabel className="text-gray-200">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/20" />
            <DropdownMenuItem
              className="focus:bg-white/20 focus:text-white"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}