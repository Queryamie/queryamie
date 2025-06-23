"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageSquare, Mail, Phone, Send, Loader2, ArrowLeft, Sparkles, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import {Link} from "react-router-dom"
import axios from "axios"

export default function Contact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setIsLoading(true)

    if (!name || !email || !message) {
      setErrorMessage("Please fill in all fields")
      setIsLoading(false)
      return
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.")
      setIsLoading(false)
      return
    }

    try {
      console.log("Submitting feedback:", { name, email, message })

      const response = await axios.post(`/api/feedback/feedback`, {
        name: name,
        email: email,
        message: message,
      })

      const token = response.data.access_token
      sessionStorage.setItem("access_token", token)

      setIsSubmitted(true)
      setName("")
      setEmail("")
      setMessage("")
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.msg) {
        setErrorMessage(error.response.data.msg)
        setIsLoading(false)
      } else {
        setErrorMessage("Feedback failed to send.")
        setIsLoading(false)
      }
      console.error("There was an error sending your feedback:", error)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="backdrop-blur-md bg-white/10 border-b border-white/20">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <Sparkles className="h-3 w-3 text-yellow-400 absolute -top-1 -right-1" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                QueryAmie
              </span>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="text-white hover:bg-white/20 backdrop-blur-sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We'd love to hear from you. Get in touch and let us know how we can help.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
            >
              <h2 className="text-3xl font-semibold mb-6 text-white">Get in Touch</h2>
              <p className="mb-8 text-gray-300 text-lg leading-relaxed">
                We'd love to hear from you. Please fill out the form or contact us using the information below.
              </p>

              <div className="space-y-6">
                <motion.div
                  className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-gray-300">queryamiee@gmail.com</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Phone</p>
                    <p className="text-gray-300">+233 (59) 317-8619</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Alternative Phone</p>
                    <p className="text-gray-300">+233 (54) 073-4085</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
            >
              <h2 className="text-3xl font-semibold mb-6 text-white">Send Us Feedback</h2>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-200 font-medium">
                      Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white/10 backdrop-blur-sm text-white border-white/20 focus:border-purple-400 focus:ring-purple-400/20 placeholder-gray-400 rounded-xl h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-200 font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/10 backdrop-blur-sm text-white border-white/20 focus:border-purple-400 focus:ring-purple-400/20 placeholder-gray-400 rounded-xl h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-200 font-medium">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Your message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-white/10 backdrop-blur-sm text-white border-white/20 focus:border-purple-400 focus:ring-purple-400/20 placeholder-gray-400 rounded-xl h-32 resize-none"
                    />
                  </div>

                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                    >
                      <p className="text-red-400 text-sm text-center">{errorMessage}</p>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-12 rounded-xl font-medium shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending your feedback...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 w-fit">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Thank You!</h3>
                  <p className="text-gray-300">Your message has been sent successfully. We'll get back to you soon.</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="backdrop-blur-md bg-white/5 border-t border-white/10 py-8 mt-12">
          <div className="container mx-auto px-4 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} QueryAmie. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  )
}
