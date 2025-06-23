"use client"

import { Button } from "@/components/ui/button"
import {
  MessageSquare,
  ArrowLeft,
  Sparkles,
  FileText,
  Shield,
  Users,
  Gavel,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"
import { motion } from "framer-motion"
import {Link} from "react-router-dom"

export default function TermsOfService() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: FileText,
      content: (
        <p className="mb-4">
          By accessing or using QueryAmie's services, you agree to be bound by these Terms of Service and all applicable
          laws and regulations. If you do not agree with any part of these terms, you may not use our services.
        </p>
      ),
    },
    {
      title: "2. Use of Services",
      icon: Shield,
      content: (
        <>
          <p className="mb-4">
            You agree to use QueryAmie's services only for lawful purposes and in accordance with these Terms of
            Service. You are prohibited from:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>
              Using the services in any way that violates any applicable federal, state, local, or international law or
              regulation
            </li>
            <li>
              Attempting to interfere with, compromise the system integrity or security, or decipher any transmissions
              to or from the servers running the service
            </li>
            <li>
              Taking any action that imposes, or may impose, an unreasonable or disproportionately large load on our
              infrastructure
            </li>
            <li>Uploading invalid data, viruses, worms, or other software agents through the service</li>
          </ul>
        </>
      ),
    },
    {
      title: "3. User Accounts",
      icon: Users,
      content: (
        <p className="mb-4">
          When you create an account with us, you must provide accurate, complete, and current information. Failure to
          do so constitutes a breach of the Terms, which may result in immediate termination of your account on our
          service.
        </p>
      ),
    },
    {
      title: "4. Intellectual Property",
      icon: Gavel,
      content: (
        <p className="mb-4">
          The service and its original content, features, and functionality are and will remain the exclusive property
          of QueryAmie and its licensors. The service is protected by copyright, trademark, and other laws of both Ghana
          and foreign countries.
        </p>
      ),
    },
    {
      title: "5. Termination",
      icon: AlertTriangle,
      content: (
        <p className="mb-4">
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason
          whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the
          service will immediately cease.
        </p>
      ),
    },
    {
      title: "6. Limitation of Liability",
      icon: Shield,
      content: (
        <p className="mb-4">
          In no event shall QueryAmie, nor its directors, employees, partners, agents, suppliers, or affiliates, be
          liable for any indirect, incidental, special, consequential or punitive damages, including without limitation,
          loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or
          inability to access or use the service.
        </p>
      ),
    },
    {
      title: "7. Changes to Terms",
      icon: RefreshCw,
      content: (
        <p className="mb-4">
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a
          material change will be determined at our sole discretion. By continuing to access or use our service after
          those revisions become effective, you agree to be bound by the revised terms.
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
              <Gavel className="h-12 w-12 text-purple-400" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Please read these terms carefully before using QueryAmie. By using our service, you agree to these terms.
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
