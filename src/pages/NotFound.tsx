'use client'

import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md space-y-8 p-8 bg-gray-800 rounded-xl shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-blue-500 p-2 rounded-full">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Page Not Found</h2>
          <p className="text-gray-400 text-center">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="space-y-4">
          <Button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Return to Home
          </Button>
          <Button
            onClick={() => navigate("/chat")}
            variant="outline"
            className="w-full bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
          >
            Go to Chat
          </Button>
        </div>
        <div className="text-center">
          <p className="text-gray-400">
            Need help?{" "}
            <a
              onClick={() => navigate("/support")}
              className="cursor-pointer text-blue-400 hover:text-blue-300"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}