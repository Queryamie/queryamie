"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('');
    setIsLoading(true)

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/forgot-password?email=${encodeURIComponent(email)}`
      );
      
      console.log(response.data);
      setIsSubmitted(true)
    } catch (error: any) {
      setErrorMessage(error.response.data.detail)
      setIsLoading(false)
    } finally {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsLoading(false);
    }
  }

  const validateEmail = (email: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md space-y-8 p-8 bg-gray-800 rounded-xl shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-blue-500 p-2 rounded-full">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Forgot Password</h2>
        </div>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-200">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 text-white border-gray-600 focus:border-blue-500"
              />
            </div>
            {errorMessage && <p className="text-red-600 text-sm mt-2.5 text-center">{errorMessage}</p>}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending reset link...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
        ) : (
          <div className="text-center text-gray-200">
            <p>A password reset link has been sent to your email address.</p>
            <p>Please check your inbox and follow the instructions.</p>
          </div>
        )}
        <div className="text-center">
          <a onClick={() => {navigate("/Login")}} className="text-blue-400 hover:text-blue-300 cursor-pointer">
            Back to login
          </a>
        </div>
      </div>
    </div>
  )
}