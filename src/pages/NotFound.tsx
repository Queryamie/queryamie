"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, Home, MessageCircle, HelpCircle, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import {Link} from "react-router-dom"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 text-center">
          <motion.div
            className="flex flex-col items-center space-y-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-3xl">
                <MessageSquare className="h-16 w-16 text-white" />
              </div>
              <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-2 -right-2" />
            </div>

            <div className="space-y-4">
              <motion.h1
                className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                404
              </motion.h1>
              <h2 className="text-3xl font-bold text-white">Page Not Found</h2>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on track.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link to="/">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-12 rounded-xl font-medium shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                <Home className="h-4 w-4 mr-2" />
                Return to Home
              </Button>
            </Link>

            <Link to="/chat">
              <Button
                variant="outline"
                // className="w-full border-white/20 text-white hover:bg-white/10 backdrop-blur-sm h-12 rounded-xl"
            className="w-full hidden md:inline-flex border-purple-400 text-purple-400 hover:bg-purple-400/10 hover:text-purple-300 backdrop-blur-sm rounded-xl mt-2"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Go to Chat
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="text-center mt-8 pt-6 border-t border-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className="text-gray-400 mb-3">Need help?</p>
            <Link
              to="/contact"
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium inline-flex items-center"
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              Contact Support
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
