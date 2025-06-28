"use client"

import { useState, useEffect, useRef } from "react"
import { motion, type Variants, useInView, useAnimation } from "framer-motion"
import { ReactTyped } from "react-typed"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { LanguageSelector } from "@/components/ui/language-selector"
import {
  MessageSquare,
  FileText,
  FileUp,
  Zap,
  ArrowRight,
  ChevronRight,
  Mail,
  Twitter,
  Linkedin,
  Sparkles,
  Brain,
} from "lucide-react"
import { Link } from "react-router-dom"

// Custom hook for scroll animations
function useScrollAnimation() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const mainControls = useAnimation()

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible")
    }
  }, [isInView, mainControls])

  return { ref, mainControls }
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const chatAnimation: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          delay: i * 2,
          type: "spring",
          duration: 2.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        },
        opacity: 1,
      },
    }),
  }

  // Animation variants for scroll animations
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  // Use the custom hook for each section
  const featuresAnimation = useScrollAnimation()
  const faqAnimation = useScrollAnimation()
  const ctaAnimation = useScrollAnimation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <motion.div
            className="flex justify-between items-center backdrop-blur-md bg-white/10 rounded-2xl px-6 py-4 border border-white/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <MessageSquare className="h-8 w-8 text-purple-400" />
                <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                QueryAmie
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:bg-white/20 backdrop-blur-sm">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                  Sign Up
                </Button>
              </Link>
            </div>
          </motion.div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="h-[120px] sm:h-[144px] md:h-[168px] flex items-center">
                  <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
                    {mounted && (
                      <ReactTyped
                        strings={[
                          "Chat with your documents",
                          "Get summaries instantly",
                          "Extract key insights",
                          "Analyze multiple files at once",
                        ]}
                        typeSpeed={40}
                        backSpeed={50}
                        loop
                      />
                    )}
                  </div>
                </div>
              </motion.div>
              <motion.p
                className="text-xl sm:text-2xl mb-12 text-gray-300 max-w-2xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Unlock the power of your documents with AI. Upload, chat, and gain insights in seconds with our
                revolutionary document intelligence platform.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Link to="/register">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                  >
                    Start for Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-purple-400 text-purple-400 hover:bg-purple-400/10 backdrop-blur-sm"
                >
                  Watch Demo
                </Button>
              </motion.div>
            </div>
            <div className="lg:w-1/2 h-[400px] lg:h-[600px] flex items-center justify-center">
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
                <svg viewBox="0 0 400 400" className="w-full h-full max-w-[400px] max-h-[400px] relative z-10">
                  {/* PDF Document */}
                  <motion.rect
                    x="50"
                    y="50"
                    width="150"
                    height="200"
                    rx="10"
                    ry="10"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="4"
                    variants={chatAnimation}
                    initial="hidden"
                    animate="visible"
                  />
                  <motion.path
                    d="M70 80 L180 80 M70 110 L180 110 M70 140 L180 140 M70 170 L180 170 M70 200 L180 200"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2"
                    variants={chatAnimation}
                    initial="hidden"
                    animate="visible"
                  />

                  {/* User */}
                  <motion.circle
                    cx="300"
                    cy="300"
                    r="50"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="4"
                    variants={chatAnimation}
                    initial="hidden"
                    animate="visible"
                  />
                  <motion.path
                    d="M300 270 Q300 250 320 260 T340 270 M280 310 Q300 340 320 310"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="4"
                    variants={chatAnimation}
                    initial="hidden"
                    animate="visible"
                  />

                  {/* Chat Bubbles */}
                  <motion.path
                    d="M210 150 L260 150 Q270 150 270 160 L270 190 Q270 200 260 200 L220 200 L210 210 L210 200 Q200 200 200 190 L200 160 Q200 150 210 150 Z"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="4"
                    variants={chatAnimation}
                    initial="hidden"
                    animate="visible"
                  />
                  <motion.path
                    d="M230 250 L280 250 Q290 250 290 260 L290 290 Q290 300 280 300 L240 300 L230 310 L230 300 Q220 300 220 290 L220 260 Q220 250 230 250 Z"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="4"
                    variants={chatAnimation}
                    initial="hidden"
                    animate="visible"
                  />
                </svg>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How to use app section */}
        <motion.section
          id="howToUse"
          className="py-20"
          ref={featuresAnimation.ref}
          variants={containerVariants}
          initial="hidden"
          animate={featuresAnimation.mainControls}
        >
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-4xl sm:text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
              variants={itemVariants}
            >
              How to Use QueryAmie
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div variants={itemVariants}>
                <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/15">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mr-4">
                        <FileUp className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-semibold text-white">Upload Files</h3>
                    </div>
                    <ul className="list-disc list-inside text-gray-300 space-y-3 text-lg">
                      <li>Upload files and wait for confirmation of successful submission</li>
                      <li>Proceed to ask questions about your uploaded documents</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/15">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 mr-4">
                        <MessageSquare className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-semibold text-white">Start or Continue a Chat</h3>
                    </div>
                    <ul className="list-disc list-inside text-gray-300 space-y-3 text-lg">
                      <li>Ensure a document has been uploaded to start or continue a chat session</li>
                      <li>You cannot send a message if no document is uploaded</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          id="features"
          className="py-20"
          ref={featuresAnimation.ref}
          variants={containerVariants}
          initial="hidden"
          animate={featuresAnimation.mainControls}
        >
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-4xl sm:text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
              variants={itemVariants}
            >
              Powerful Features
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  icon: FileText,
                  title: "Multi-format Support",
                  description: "Upload PDFs, Word docs, PowerPoints, and more with seamless processing.",
                  gradient: "from-blue-500 to-cyan-500",
                },
                {
                  icon: Brain,
                  title: "Intelligent Chat",
                  description: "Ask questions and get accurate answers instantly with advanced AI.",
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  icon: Zap,
                  title: "Quick Analysis",
                  description: "Extract key information and insights in seconds with lightning speed.",
                  gradient: "from-yellow-500 to-orange-500",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="group backdrop-blur-md bg-white/10 p-8 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/15 hover:scale-105"
                  variants={itemVariants}
                >
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          id="faq"
          className="py-20"
          ref={faqAnimation.ref}
          variants={containerVariants}
          initial="hidden"
          animate={faqAnimation.mainControls}
        >
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-4xl sm:text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
              variants={itemVariants}
            >
              Frequently Asked Questions
            </motion.h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {[
                  {
                    question: "What file formats does QueryAmie support?",
                    answer:
                      "QueryAmie supports a wide range of file formats including PDF, DOCX, TXT, PPTX, and more. Our system is designed to handle most common document types with intelligent processing.",
                  },
                  {
                    question: "How accurate are the answers provided by QueryAmie?",
                    answer:
                      "QueryAmie uses advanced AI models to provide highly accurate answers. However, as with any AI system, there may be occasional errors. We recommend using QueryAmie as a powerful assistant, but always verify critical information.",
                  },
                  {
                    question: "Is my data secure with QueryAmie?",
                    answer:
                      "Yes, we take data security very seriously. All uploaded documents are encrypted, and we do not store your files longer than necessary for processing. Our systems comply with industry-standard security protocols.",
                  },
                  {
                    question: "Can I use QueryAmie for multiple languages?",
                    answer:
                      "Currently, QueryAmie primarily supports English. However, we are actively working on expanding our language capabilities. Stay tuned for updates on multi-language support!",
                  },
                ].map((item, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <AccordionItem
                      value={`item-${index}`}
                      className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-6"
                    >
                      <AccordionTrigger className="text-left text-white hover:text-purple-400 transition-colors py-6">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300 pb-6 text-lg leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="py-20"
          ref={ctaAnimation.ref}
          variants={containerVariants}
          initial="hidden"
          animate={ctaAnimation.mainControls}
        >
          <div className="container mx-auto px-4 text-center">
            <motion.div
              className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-12 shadow-2xl"
              variants={itemVariants}
            >
              <motion.h2
                className="text-4xl sm:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
                variants={itemVariants}
              >
                Ready to Transform Your Document Workflow?
              </motion.h2>
              <motion.p
                className="text-xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed"
                variants={itemVariants}
              >
                Join thousands of users who are already leveraging the power of AI to interact with their documents.
                Experience the future of document intelligence today.
              </motion.p>
              <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={itemVariants}>
                <Link to="/register">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                  >
                    Get Started for Free <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-purple-400 text-purple-400 hover:bg-purple-400/10 backdrop-blur-sm"
                >
                  Schedule Demo
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="py-12 backdrop-blur-md bg-white/5 border-t border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-between items-center mb-8">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="relative">
                  <MessageSquare className="h-8 w-8 text-purple-400" />
                  <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  QueryAmie
                </span>
              </div>
              <nav className="flex flex-wrap gap-6">
                <Link to="/contact" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Contact Us
                </Link>
                <Link to="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Terms of Service
                </Link>
              </nav>
            </div>
            <div className="flex flex-wrap justify-between items-center">
              <div className="text-sm text-gray-400">© {new Date().getFullYear()} QueryAmie. All rights reserved.</div>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="mailto:queryamiee@gmail.com" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Mail className="h-6 w-6" />
                  <span className="sr-only">Email</span>
                </a>
                <a
                  href="https://twitter.com/AppQueryAmie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <Twitter className="h-6 w-6" />
                  <span className="sr-only">Twitter</span>
                </a>
                <a
                  href="https://www.linkedin.com/company/queryamie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <Linkedin className="h-6 w-6" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
