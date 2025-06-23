"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, ArrowLeft, Sparkles, Shield, Eye, Lock, FileText } from "lucide-react"
import { motion } from "framer-motion"
import {Link} from "react-router-dom"

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "1. Information We Collect",
      icon: FileText,
      content: (
        <>
          <p className="mb-4">We collect information you provide directly to us when you:</p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Create an account</li>
            <li>Use our services</li>
            <li>Contact our customer support</li>
            <li>Participate in surveys or promotions</li>
          </ul>
          <p>This information may include your name, email address, and any other information you choose to provide.</p>
        </>
      ),
    },
    {
      title: "2. How We Use Your Information",
      icon: Eye,
      content: (
        <>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Send you technical notices, updates, security alerts, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Communicate with you about products, services, offers, promotions, and events</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
          </ul>
        </>
      ),
    },
    {
      title: "3. Data Security",
      icon: Lock,
      content: (
        <p className="mb-4">
          We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized
          access, disclosure, alteration, and destruction. Your data is encrypted both in transit and at rest using
          industry-standard security protocols.
        </p>
      ),
    },
    {
      title: "4. Changes to this Policy",
      icon: Shield,
      content: (
        <p className="mb-4">
          We may change this privacy policy from time to time. If we make changes, we will notify you by revising the
          date at the top of the policy and, in some cases, we may provide you with additional notice such as adding a
          statement to our homepage or sending you an email notification.
        </p>
      ),
    },
  ]

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
            <div className="mx-auto mb-6 p-4 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 w-fit">
              <Shield className="h-12 w-12 text-purple-400" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-gray-400 mt-4">Last updated: {new Date().toLocaleDateString()}</p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
              >
                <div className="flex items-start space-x-4 mb-6">
                  <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0">
                    <section.icon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
                </div>
                <div className="text-gray-300 leading-relaxed ml-16">{section.content}</div>
              </motion.div>
            ))}

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex-shrink-0">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-white">5. Contact Us</h2>
              </div>
              <div className="text-gray-300 leading-relaxed ml-16">
                <p className="mb-4">If you have any questions about this privacy policy, please contact us at:</p>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-purple-400 font-medium">queryamiee@gmail.com</p>
                </div>
              </div>
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
