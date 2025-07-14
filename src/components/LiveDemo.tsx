import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTypewriter } from '../hooks/useTypewriter';
import { Mic, MessageSquare, Languages, FileText, Zap } from 'lucide-react';

const LiveDemo: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const [currentQA, setCurrentQA] = useState(0);
  const [showUserMessage, setShowUserMessage] = useState(false);
  const [showAiResponse, setShowAiResponse] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const qaSequence = [
    {
      question: "What are the main revenue streams discussed in this quarterly report?",
      answer: "The report identifies three primary revenue streams: SaaS subscriptions (65% of total revenue), professional services (25%), and licensing fees (10%). SaaS subscriptions showed 42% YoY growth, driven by enterprise client acquisitions."
    },
    {
      question: "How did the company perform compared to last quarter?",
      answer: "Revenue increased 18% QoQ to $12.4M, with net profit margin improving from 8.2% to 11.7%. Customer acquisition cost decreased by 23% while lifetime value increased 31%, indicating improved operational efficiency."
    },
    {
      question: "What are the key risks mentioned in the financial projections?",
      answer: "The report highlights market volatility, increased competition from established players, potential supply chain disruptions, and regulatory changes in data privacy laws as primary risk factors affecting future growth."
    },
    {
      question: "Can you translate the executive summary to Spanish?",
      answer: "Resumen Ejecutivo: Este trimestre mostró un crecimiento sólido con ingresos de $12.4M, un aumento del 18% trimestral. Las suscripciones SaaS lideran con 65% de participación, mientras que los servicios profesionales contribuyen con 25%."
    },
    {
      question: "What investment opportunities does the report recommend?",
      answer: "The report recommends investing in AI/ML capabilities ($2.8M), expanding international markets ($4.2M), and strengthening cybersecurity infrastructure ($1.5M). Expected ROI ranges from 25-40% over 18 months."
    }
  ];

  const currentAnswer = qaSequence[currentQA]?.answer || "";
  const { displayText, isTyping } = useTypewriter(
    currentAnswer,
    25,
    showAiResponse ? 500 : 0
  );

  useEffect(() => {
    if (!inView) return;

    const sequence = async () => {
      // Reset states
      setShowUserMessage(false);
      setShowAiResponse(false);
      setShowTypingIndicator(false);
      
      // Show user message
      setTimeout(() => setShowUserMessage(true), 800);
      
      // Show typing indicator
      setTimeout(() => setShowTypingIndicator(true), 1300);
      
      // Show AI response
      setTimeout(() => {
        setShowTypingIndicator(false);
        setShowAiResponse(true);
      }, 1800);

      // Wait for typing to complete, then move to next Q&A
      setTimeout(() => {
        if (currentQA < qaSequence.length - 1) {
          setCurrentQA(prev => prev + 1);
        } else {
          setIsComplete(true);
        }
      }, currentAnswer.length * 25 + 3000);
    };

    sequence();
  }, [inView, currentQA, currentAnswer.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-dark-800 to-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 mb-6">
              <Zap className="w-4 h-4 text-primary-400 mr-2" />
              <span className="text-sm font-medium text-primary-300">
                Live Demo
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                See QueryAmie in
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Real-Time Action
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Watch as QueryAmie processes complex documents, answers questions, 
              and provides insights in real-time across multiple languages.
            </p>
          </motion.div>

          {/* Live Demo Interface */}
          <motion.div 
            variants={itemVariants}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl border border-dark-600 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600/20 to-accent-600/20 px-6 py-4 border-b border-dark-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-primary-400" />
                    <span className="text-white font-medium">quarterly_report_q4_2024.pdf</span>
                    <span className="text-xs text-gray-400 bg-dark-600 px-2 py-1 rounded">
                      2.4 MB • 47 pages
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400">Processing</span>
                  </div>
                </div>
              </div>

              {/* Chat Interface */}
              <div className="p-6">
                <div className="space-y-4 min-h-[400px]">
                  {/* Progress Indicator */}
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                    <span>Question {currentQA + 1} of {qaSequence.length}</span>
                    <div className="flex space-x-1">
                      {qaSequence.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index <= currentQA ? 'bg-primary-400' : 'bg-dark-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Current Q&A */}
                  {qaSequence.slice(0, currentQA + 1).map((qa, index) => (
                    <div key={index} className="space-y-3">
                      {/* User Message */}
                      <motion.div
                        className="flex justify-end"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ 
                          opacity: index < currentQA || showUserMessage ? 1 : 0, 
                          x: index < currentQA || showUserMessage ? 0 : 20 
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="bg-primary-600 text-white px-4 py-3 rounded-lg max-w-md">
                          <div className="flex items-center space-x-2 mb-1">
                            <Mic className="w-4 h-4" />
                            <span className="text-xs opacity-75">Voice Input</span>
                          </div>
                          <p className="text-sm">{qa.question}</p>
                        </div>
                      </motion.div>

                      {/* Typing Indicator */}
                      {index === currentQA && showTypingIndicator && (
                        <motion.div
                          className="flex justify-start"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="bg-dark-600 text-gray-200 px-4 py-3 rounded-lg max-w-md">
                            <div className="flex items-center space-x-2 mb-2">
                              <MessageSquare className="w-4 h-4 text-accent-400" />
                              <span className="text-xs text-accent-400">QueryAmie</span>
                            </div>
                            <div className="flex space-x-1">
                              <motion.div
                                className="w-2 h-2 bg-gray-400 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                              />
                              <motion.div
                                className="w-2 h-2 bg-gray-400 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                              />
                              <motion.div
                                className="w-2 h-2 bg-gray-400 rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* AI Response */}
                      {(index < currentQA || (index === currentQA && showAiResponse)) && (
                        <motion.div
                          className="flex justify-start"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="bg-dark-600 text-gray-200 px-4 py-3 rounded-lg w-full max-w-md">
                            <div className="flex items-center space-x-2 mb-2">
                              <MessageSquare className="w-4 h-4 text-accent-400 flex-shrink-0" />
                              <span className="text-xs text-accent-400">QueryAmie</span>
                              {index === currentQA && isTyping && (
                                <motion.div
                                  className="w-1.5 h-1.5 bg-accent-400 rounded-full flex-shrink-0"
                                  animate={{ opacity: [1, 0] }}
                                  transition={{ duration: 0.5, repeat: Infinity }}
                                />
                              )}
                            </div>
                            <div className="text-sm leading-[1.4] min-h-[60px] overflow-hidden">
                              <p className="whitespace-pre-wrap break-words m-0 p-0">
                                {index === currentQA ? displayText : qa.answer}
                                {index === currentQA && isTyping && (
                                  <motion.span
                                    className="inline-block w-0.5 h-[14px] bg-accent-400 ml-0.5 align-middle"
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                  />
                                )}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Features indicator */}
                      {index === currentQA && qa.question.includes("translate") && (
                        <motion.div
                          className="flex items-center text-xs text-gray-500 ml-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 1 }}
                        >
                          <Languages className="w-3 h-3 mr-1" />
                          <span>Auto-translated • Spanish detected • 99% confidence</span>
                        </motion.div>
                      )}
                    </div>
                  ))}

                  {/* Completion Message */}
                  {isComplete && (
                    <motion.div
                      className="text-center py-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                        <Zap className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-sm font-medium text-green-400">
                          Demo Complete - Ready for your questions!
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input Area */}
                <motion.div
                  className="mt-6 flex items-center space-x-3 pt-4 border-t border-dark-600"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: isComplete ? 1 : 0.5 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex-1 bg-dark-600 rounded-lg px-4 py-3 text-sm text-gray-400">
                    {isComplete ? "Try asking your own questions..." : "Demo in progress..."}
                  </div>
                  <motion.button
                    className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center"
                    whileHover={{ scale: isComplete ? 1.1 : 1 }}
                    whileTap={{ scale: isComplete ? 0.95 : 1 }}
                    style={{ opacity: isComplete ? 1 : 0.5 }}
                  >
                    <Mic className="w-5 h-5 text-white" />
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveDemo; 