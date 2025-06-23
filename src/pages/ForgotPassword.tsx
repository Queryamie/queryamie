"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare, Loader2, ArrowLeft, Sparkles, Mail, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import {Link} from "react-router-dom"
import axios from "axios"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setIsLoading(true)

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.")
      setIsLoading(false)
      return
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/forgot-password?email=${encodeURIComponent(email)}`,
      )

      console.log(response.data)
      setIsSubmitted(true)
    } catch (error: any) {
      setErrorMessage(error.response.data.detail)
      setIsLoading(false)
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsLoading(false)
    }
  }

  const validateEmail = (email: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(email)
  }

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
            <h2 className="text-3xl font-bold text-white">Forgot Password</h2>
            <p className="text-gray-300 text-center">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200 font-medium">
                  Email address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 backdrop-blur-sm text-white border-white/20 focus:border-purple-400 focus:ring-purple-400/20 placeholder-gray-400 rounded-xl h-12 pl-12"
                  />
                  <Mail className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                </div>
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
                    Sending reset link...
                  </>
                ) : (
                  "Send reset link"
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
              <h3 className="text-xl font-semibold text-white mb-3">Check Your Email</h3>
              <div className="space-y-2 text-gray-300">
                <p>A password reset link has been sent to your email address.</p>
                <p>Please check your inbox and follow the instructions.</p>
                <p className="text-sm">If you don't see the email, please check your spam or junk folder.</p>
              </div>
            </motion.div>
          )}

          <div className="text-center mt-8">
            <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
              Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
