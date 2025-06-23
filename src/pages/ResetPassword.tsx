"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare, Loader2, Eye, EyeOff, ArrowLeft, Sparkles, CheckCircle, Check } from "lucide-react"
import { motion } from "framer-motion"
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
  const location = useLocation()

  // Extract token from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tokenFromUrl = params.get("token")
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
    } else {
      setErrorMessage("Invalid or expired link.")
    }
  }, [location.search])

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
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/reset-password`,
        {
          token: token,
          new_password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      console.log(response.data)
      setPassword("")
      setConfirmPassword("")
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

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: "" }
    if (password.length < 6) return { strength: 1, text: "Weak", color: "text-red-400" }
    if (password.length < 8) return { strength: 2, text: "Fair", color: "text-yellow-400" }
    if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { strength: 4, text: "Strong", color: "text-green-400" }
    }
    return { strength: 3, text: "Good", color: "text-blue-400" }
  }

  const passwordStrength = getPasswordStrength(password)

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
        className="w-full max-w-md relative z-10"
      >
        {/* Back to login button */}
        <Link to="/login">
          <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white hover:bg-white/10 backdrop-blur-sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
        </Link>

        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
          <div className="flex flex-col items-center space-y-4 mb-8">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white">Reset Password</h2>
            <p className="text-gray-300 text-center">Create a new password for your account</p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200 font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 backdrop-blur-sm text-white border-white/20 focus:border-purple-400 focus:ring-purple-400/20 placeholder-gray-400 rounded-xl h-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {password && (
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.strength === 1
                            ? "bg-red-500 w-1/4"
                            : passwordStrength.strength === 2
                              ? "bg-yellow-500 w-2/4"
                              : passwordStrength.strength === 3
                                ? "bg-blue-500 w-3/4"
                                : "bg-green-500 w-full"
                        }`}
                      />
                    </div>
                    <span className={`text-sm ${passwordStrength.color}`}>{passwordStrength.text}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-200 font-medium">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white/10 backdrop-blur-sm text-white border-white/20 focus:border-purple-400 focus:ring-purple-400/20 placeholder-gray-400 rounded-xl h-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {confirmPassword && password === confirmPassword && (
                  <div className="flex items-center space-x-2 text-green-400 text-sm">
                    <Check className="h-4 w-4" />
                    <span>Passwords match</span>
                  </div>
                )}
              </div>

              {errorMessage && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                >
                  {errorMessage}
                </motion.p>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-12 rounded-xl font-medium shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 w-fit">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Password Reset Successful</h3>
              <p className="text-gray-300 mb-6">Your password has been successfully reset.</p>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  Back to Login
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
