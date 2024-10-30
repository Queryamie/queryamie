"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare, Loader2 } from "lucide-react"
import axios from 'axios'

export default function Register() {
  const [username, setUsername] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!username || !name || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/register`, {
        username: username,
        full_name: name,
        email: email,
        password: password,
      });
      
      const token = response.data.access_token;
      sessionStorage.setItem("token", token);
    
      navigate("/Login");
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.msg) {
        setErrorMessage(error.response.data.msg);
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
      console.error("There was an error registering the user:", error);
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
          <h2 className="text-3xl font-bold text-white">Create an account</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="username" className="text-gray-200">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-700 text-white border-gray-600 focus:border-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="name" className="text-gray-200">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-700 text-white border-gray-600 focus:border-blue-500"
            />
          </div>
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
          <div>
            <Label htmlFor="password" className="text-gray-200">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 text-white border-gray-600 focus:border-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="confirm-password" className="text-gray-200">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
        <div className="text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <a onClick={() => {navigate("/Login")}} className="cursor-pointer text-blue-400 hover:text-blue-300">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
