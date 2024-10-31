'use client'

import { useState, useEffect, useRef } from "react"
import { motion, Variants, useInView, useAnimation } from "framer-motion"
import { ReactTyped } from 'react-typed'
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MessageSquare, FileText, Zap, ArrowRight, ChevronRight, Mail, Twitter, Linkedin } from "lucide-react"
import { useNavigate } from "react-router-dom"

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
  const navigate = useNavigate();
  
  const [mounted, setMounted] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    setMounted(true)
    setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
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
          repeat: Infinity,
          repeatType: "reverse",
        },
        opacity: 1,
      },
    }),
  };

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
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-b from-violet-100 to-indigo-200 dark:from-gray-900 dark:to-indigo-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {/* Header */}
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              QueryAmie
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a onClick={() => {navigate("/Login")}}>
              <Button variant="outline" className="text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400">Log In</Button>
            </a>
            <a onClick={() => {navigate("/Register")}}>
              <Button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white">
                Sign Up
              </Button>
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-5">
          <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <motion.div
                className="text-5xl sm:text-6xl md:text-7xl mb-8 font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {mounted && (
                  <ReactTyped
                    strings={[
                      "Chat with your documents",
                      "Get summaries instantly",
                      "Extract key insights",
                      "Analyze multiple files at once"
                    ]}
                    typeSpeed={40}
                    backSpeed={50}
                    loop
                  />
                )}
              </motion.div>
              <motion.p 
                className="text-xl sm:text-2xl mb-12 text-gray-700 dark:text-gray-300 max-w-2xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Unlock the power of your documents with AI. Upload, chat, and gain insights in seconds.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <a onClick={() => {navigate("/QueryAmi")}}>
                  <Button size="lg" className="text-lg px-8 py-6 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white">
                    Start for Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </motion.div>
            </div>
            <div className="lg:w-1/2 h-[400px] lg:h-[600px] flex items-center justify-center">
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full max-w-[400px] max-h-[400px]"
              >
                {/* PDF Document */}
                <motion.rect
                  x="50" y="50" width="150" height="200"
                  rx="10" ry="10"
                  fill="none"
                  stroke={darkMode ? "#818cf8" : "#4f46e5"}
                  strokeWidth="4"
                  variants={chatAnimation}
                  initial="hidden"
                  animate="visible"
                />
                <motion.path
                  d="M70 80 L180 80 M70 110 L180 110 M70 140 L180 140 M70 170 L180 170 M70 200 L180 200"
                  fill="none"
                  stroke={darkMode ? "#818cf8" : "#4f46e5"}
                  strokeWidth="2"
                  variants={chatAnimation}
                  initial="hidden"
                  animate="visible"
                />

                {/* User */}
                <motion.circle
                  cx="300" cy="300" r="50"
                  fill="none"
                  stroke={darkMode ? "#818cf8" : "#4f46e5"}
                  strokeWidth="4"
                  variants={chatAnimation}
                  initial="hidden"
                  animate="visible"
                />
                <motion.path
                  d="M300 270 Q300 250 320 260 T340 270 M280 310 Q300 340 320 310"
                  fill="none"
                  stroke={darkMode ? "#818cf8" : "#4f46e5"}
                  strokeWidth="4"
                  variants={chatAnimation}
                  initial="hidden"
                  animate="visible"
                />

                {/* Chat Bubbles */}
                <motion.path
                  d="M210 150 L260 150 Q270 150 270 160 L270 190 Q270 200 260 200 L220 200 L210 210 L210 200 Q200 200 200 190 L200 160 Q200 150 210 150 Z"
                  fill="none"
                  stroke={darkMode ? "#818cf8" : "#4f46e5"}
                  strokeWidth="4"
                  variants={chatAnimation}
                  initial="hidden"
                  animate="visible"
                />
                <motion.path
                  d="M230 250 L280 250 Q290 250 290 260 L290 290 Q290 300 280 300 L240 300 L230 310 L230 300 Q220 300 220 290 L220 260 Q220 250 230 250 Z"
                  fill="none"
                  stroke={darkMode ? "#818cf8" : "#4f46e5"}
                  strokeWidth="4"
                  variants={chatAnimation}
                  initial="hidden"
                  animate="visible"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <motion.section
          id="features"
          className="py-20 bg-white dark:bg-gray-800"
          ref={featuresAnimation.ref}
          variants={containerVariants}
          initial="hidden"
          animate={featuresAnimation.mainControls}
        >
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-4xl sm:text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400"
              variants={itemVariants}
            >
              Powerful Features
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { icon: FileText, title: "Multi-format Support", description: "Upload PDFs, Word docs, PowerPoints, and more." },
                { icon: MessageSquare, title: "Intelligent Chat", description: "Ask questions and get accurate answers instantly." },
                { icon: Zap, title: "Quick Analysis", description: "Extract key information and insights in seconds." },
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="bg-gray-100 dark:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  variants={itemVariants}
                >
                  <feature.icon className="h-16 w-16 text-indigo-600 dark:text-indigo-400 mb-6" />
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{feature.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-lg">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section 
          id="faq" 
          className="py-20 bg-indigo-50 dark:bg-gray-900"
          ref={faqAnimation.ref}
          variants={containerVariants}
          initial="hidden"
          animate={faqAnimation.mainControls}
        >
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-4xl sm:text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400"
              variants={itemVariants}
            >
              Frequently Asked Questions
            </motion.h2>
            <Accordion type="single" collapsible className="max-w-3xl mx-auto">
              {[
                { question: "What file formats does QueryAmie support?", answer: "QueryAmie supports a wide range of file formats including PDF, DOCX, TXT, PPTX, and more. Our system is designed to handle most common document types." },
                { question: "How accurate are the answers provided by QueryAmie?", answer: "QueryAmie uses advanced AI models to provide highly accurate answers. However, as with any AI system, there may be occasional errors. We recommend using QueryAmie as a powerful assistant, but always verify critical information." },
                { question: "Is my data secure with QueryAmie?", answer: "Yes, we take data security very seriously. All uploaded documents are encrypted, and we do not store your files longer than necessary for processing. Our systems comply with industry-standard security protocols." },
                { question: "Can I use QueryAmie for multiple languages?", answer: "Currently, QueryAmie primarily supports English. However, we are actively working on expanding our language capabilities. Stay tuned for updates on multi-language support!" },
              ].map((item, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <AccordionItem value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-gray-900 dark:text-gray-100">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="py-20 bg-white dark:bg-gray-800"
          ref={ctaAnimation.ref}
          variants={containerVariants}
          initial="hidden"
          animate={ctaAnimation.mainControls}
        >
          <div className="container mx-auto px-4 text-center">
            <motion.h2 
              className="text-4xl sm:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400"
              variants={itemVariants}
            >
              Ready to Transform Your Document Workflow?
            </motion.h2>
            <motion.p 
              className="text-xl mb-12 text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Join thousands of users who are already leveraging the power of AI to interact with their documents.
            </motion.p>
            <motion.div variants={itemVariants}>
              <a onClick={() => {navigate("/Register")}}>
                <Button size="lg" className="text-lg px-8 py-6 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white">
                  Get Started for Free <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </motion.div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="bg-gray-100 dark:bg-gray-900 py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <MessageSquare className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                  QueryAmie
                </span>
              </div>
              <nav className="flex flex-wrap gap-6">
                <a onClick={() => {navigate("/Contact")}} className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-indigo-600  dark:hover:text-indigo-400 transition-colors">Contact Us</a>
                <a onClick={() => {navigate("/PrivacyPolicy")}} className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-indigo-600  dark:hover:text-indigo-400 transition-colors">Privacy Policy</a>
                <a onClick={() => {navigate("/TermsOfService")}} className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</a>
              </nav>
            </div>
            <div className="mt-8 flex flex-wrap justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} QueryAmie. All rights reserved.
              </div>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="mailto:contact@queryamie.com" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <Mail className="h-6 w-6" />
                  <span className="sr-only">Email</span>
                </a>
                <a href="https://twitter.com/AppQueryAmie" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <Twitter className="h-6 w-6" />
                  <span className="sr-only">Twitter</span>
                </a>
                <a href="https://linkedin.com/company/queryamie" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
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