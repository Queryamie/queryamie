'use client'

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei"
import { ReactTyped } from 'react-typed'
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MessageSquare, FileText, Zap, ArrowRight, ChevronRight } from "lucide-react"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    setMounted(true)
    setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
  }, [])

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
            <a href="/Login">
              <Button variant="outline" className="text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400">Log In</Button>
            </a>
            <a href="/Register">
              <Button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white">
                Sign Up
              </Button>
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-32">
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
                <a href="/Register">
                  <Button size="lg" className="text-lg px-8 py-6 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white">
                    Start for Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </motion.div>
            </div>
            <div className="lg:w-1/2 h-[400px] lg:h-[600px]">
              <Canvas>
                <OrbitControls enableZoom={false} />
                <ambientLight intensity={0.5} />
                <directionalLight position={[-2, 5, 2]} intensity={1} />
                <Sphere args={[1, 100, 200]} scale={2.4}>
                  <MeshDistortMaterial
                    color="#6366f1"
                    attach="material"
                    distort={0.3}
                    speed={1.5}
                    roughness={0}
                  />
                </Sphere>
              </Canvas>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl sm:text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              Powerful Features
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { icon: FileText, title: "Multi-format Support", description: "Upload PDFs, Word docs, PowerPoints, and more." },
                { icon: MessageSquare, title: "Intelligent Chat", description: "Ask questions and get accurate answers instantly." },
                { icon: Zap, title: "Quick Analysis", description: "Extract key information and insights in seconds." },
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="bg-gray-100 dark:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <feature.icon className="h-16 w-16 text-indigo-600 dark:text-indigo-400 mb-6" />
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{feature.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-lg">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-indigo-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl sm:text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="max-w-3xl mx-auto">
              {[
                { question: "What file formats does QueryAmie support?", answer: "QueryAmie supports a wide range of file formats including PDF, DOCX, TXT, PPTX, and more. Our system is designed to handle most common document types." },
                { question: "How accurate are the answers provided by QueryAmie?", answer: "QueryAmie uses advanced AI models to provide highly accurate answers. However, as with any AI system, there may be occasional errors. We recommend using QueryAmie as a powerful assistant, but always verify critical information." },
                { question: "Is my data secure with QueryAmie?", answer: "Yes, we take data security very seriously. All uploaded documents are encrypted, and we do not store your files longer than necessary for processing. Our systems comply with industry-standard security protocols." },
                { question: "Can I use QueryAmie for multiple languages?", answer: "Currently, QueryAmie primarily supports English. However, we are actively working on expanding our language capabilities. Stay tuned for updates on multi-language support!" },
              ].map((item, 
 index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-gray-900 dark:text-gray-100">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-700 dark:text-gray-300">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              Ready to Transform Your Document Workflow?
            </h2>
            <p className="text-xl mb-12 text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Join thousands of users who are already leveraging the power of AI to interact with their documents.
            </p>
            <a href="/Register">
              <Button size="lg" className="text-lg px-8 py-6 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white">
                Get Started for Free <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </section>

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
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact Us</a>
              </nav>
            </div>
            <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} QueryAmie. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}