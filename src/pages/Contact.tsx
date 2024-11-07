"use client"

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageSquare, Mail, Phone, Send, Loader2 } from "lucide-react"
import axios from 'axios'

export default function Contact() {
    const navigate = useNavigate();

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('');
    setIsLoading(true);

    if (!name || !email || !message){
        setErrorMessage("Please fill in all fields");
        setIsLoading(false);
        return;
    }

    if (!validateEmail(email)) {
        setErrorMessage("Please enter a valid email address.");
        setIsLoading(false);
        return;
    }

    try {
      console.log("Submitting feedback:", { name, email, message });

        const response = await axios.post(`/api/feedback/feedback`, {
            name: name,
            email: email,
            message: message,
        });
        
        const token = response.data.access_token;
        sessionStorage.setItem("token", token);
    
        setIsSubmitted(true)
        setName('')
        setEmail('')
        setMessage('')
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.msg) {
            setErrorMessage(error.response.data.msg);
            setIsLoading(false);
        } else {
            setErrorMessage("Feedback failed to send.");
            setIsLoading(false);
        }
        console.error("There was an error sending your feedback:", error);
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
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <a href="/" onClick={() => {navigate("/")}} className="flex items-center space-x-2">
            <MessageSquare className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold">QueryAmie</span>
          </a>
          <a href="/" onClick={() => {navigate("/")}}>
            <Button variant="ghost">Back to Home</Button>
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            <p className="mb-6">We'd love to hear from you. Please fill out the form or contact us using the information below.</p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Mail className="h-6 w-6 text-blue-500" />
                <span>queryamiee@gmail.com</span>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="h-6 w-6 text-blue-500" />
                <span>+233 (59) 317-8619</span>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="h-6 w-6 text-blue-500" />
                <span>+233 (54) 073-4085</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">Send Us Feedback</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white h-32"
                />
              </div>
              {errorMessage && <p className="text-red-600 text-sm mt-2.5 text-center">{errorMessage}</p>}
              {!isSubmitted ? (
                <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white"
                disabled={isLoading}
                >
                {isLoading ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending your feedback...
                    </>
                ) : (
                    <>
                    <Send className="mr-2 h-4 w-4"/>
                    Send Message
                    </>
                )}
                </Button>
            ) : (
                <div className="text-center text-gray-200">
                    <p>Thank you for your feedback.</p>
                </div>
                )}
            </form>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} QueryAmi. All rights reserved.
        </div>
      </footer>
    </div>
  )
}