'use client'

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare, Loader2, Eye, EyeOff } from "lucide-react"
import axios from "axios"

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Extract token from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tokenFromUrl = urlParams.get("token")
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
    } else {
      setErrorMessage("Invalid or expired link.")
    }
  }, [location])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
  
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.")
      return
    }
  
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match")
      return
    }
  
    if (!token) {
      setErrorMessage("No token found. Please check your reset link.")
      return
    }
  
    try {
      setIsLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/reset-password`, 
        {
          token: token, 
          new_password: password
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
  
      console.log(response.data)
      setPassword('')
      setConfirmPassword('')
      setIsLoading(false)
      setIsSubmitted(true)
    } catch (error: any) {
      setErrorMessage(error.response.data.detail)
      setIsLoading(false)
    }
  }
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md space-y-8 p-8 bg-gray-800 rounded-xl shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-blue-500 p-2 rounded-full">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Reset Password</h2>
        </div>
              {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="password" className="text-gray-200">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700 text-white border-gray-600 focus:border-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="text-gray-200">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-700 text-white border-gray-600 focus:border-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
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
                Resetting password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
          ) : (
            <div className="text-center text-gray-200">
              <p>Password Reset Successful</p>
              <div className="text-center">
                <a onClick={() => {navigate("/Login")}} className="text-blue-400 hover:text-blue-300 cursor-pointer">
                  Back to login
                </a>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}