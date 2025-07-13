import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTypewriter } from '../hooks/useTypewriter';
import { 
  PlayIcon, 
  SparklesIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';
import { FileText, Mic, Languages, Zap, Upload, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Chat Interface Component with Typing Animation
const ChatInterface: React.FC = () => {
  const [showUserMessage, setShowUserMessage] = useState(false);
  const [showAiResponse, setShowAiResponse] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const qaSequence = [
    {
      question: "Summarize the key findings",
      answer: "The research identifies 3 critical insights: 1) AI-assisted productivity increased by 40% across all departments, 2) Document processing time reduced from 4 hours to 60 minutes (75% improvement), and 3) Cross-language collaboration efficiency improved by 65% with real-time translation."
    },
    {
      question: "What methodology was used in this study?",
      answer: "The study employed a mixed-methods approach combining quantitative analysis of 2,847 participants across 23 countries and qualitative interviews with 156 subject matter experts. Data collection spanned 18 months using controlled A/B testing methodologies."
    },
    {
      question: "How reliable are these results?",
      answer: "Results show high statistical significance (p < 0.001) with a confidence interval of 95%. The large sample size and diverse geographic distribution ensure robust external validity. Independent peer review validates the methodology and conclusions."
    },
    {
      question: "Can you translate the abstract to French?",
      answer: "Résumé: Cette recherche examine l'impact de l'IA sur la productivité organisationnelle. Les résultats montrent une amélioration de 40% de la productivité, une réduction de 75% du temps de traitement des documents, et une collaboration multilingue 65% plus efficace."
    },
    {
      question: "What are the practical implications?",
      answer: "Organizations implementing AI document processing can expect immediate productivity gains, reduced operational costs, and enhanced global collaboration. The research recommends gradual deployment with proper training programs to maximize adoption success rates."
    }
  ];

  const [currentQA, setCurrentQA] = useState(0);
  const currentAnswer = qaSequence[currentQA]?.answer || "";
  const currentQuestion = qaSequence[currentQA]?.question || "";
  
  const { displayText, isTyping } = useTypewriter(
    currentAnswer,
    25, // slightly slower typing speed
    showAiResponse ? 800 : 0
  );

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];

    const sequence = () => {
      // Clear any existing timeouts
      timeouts.forEach(timeout => clearTimeout(timeout));
      timeouts = [];

      // Start transition phase to prevent overlapping animations
      setIsTransitioning(true);

      // Reset states with staggered timing to prevent sudden changes
      timeouts.push(setTimeout(() => setShowAiResponse(false), 100));
      timeouts.push(setTimeout(() => setShowTypingIndicator(false), 200));
      timeouts.push(setTimeout(() => setShowUserMessage(false), 300));

      // Wait for reset completion before starting new sequence
      timeouts.push(setTimeout(() => {
        setIsTransitioning(false);
        // Show user message with longer initial delay
        timeouts.push(setTimeout(() => setShowUserMessage(true), 3000));
        
        // Show typing indicator after user message with stable timing
        timeouts.push(setTimeout(() => setShowTypingIndicator(true), 4200));
        
        // Show AI response after typing indicator with stable timing
        timeouts.push(setTimeout(() => {
          setShowTypingIndicator(false);
          setShowAiResponse(true);
        }, 5500));

        // Wait for typing animation to complete before moving to next Q&A
        const typingDuration = currentAnswer.length * 40; // Adjusted for slower typing
        timeouts.push(setTimeout(() => {
          if (currentQA < qaSequence.length - 1) {
            setCurrentQA(prev => prev + 1);
          } else {
            // Reset to first question with longer pause
            timeouts.push(setTimeout(() => setCurrentQA(0), 4000));
          }
        }, typingDuration + 8000)); // Much longer pause between cycles
      }, 1000));
    };

    sequence();

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [currentQA, currentAnswer.length]);

  return (
    <div className="border-t border-dark-600 p-4 overflow-hidden">
      {/* Fixed height container to prevent layout shifts */}
      <div className="relative h-[280px] flex flex-col justify-center">
        {/* Stable container for messages with absolute positioning */}
        <div className="relative space-y-3">
          {/* User Message with stable positioning */}
          <div className="flex justify-end h-[50px] items-center">
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ 
                opacity: showUserMessage && !isTransitioning ? 1 : 0, 
                x: showUserMessage && !isTransitioning ? 0 : 20,
                scale: showUserMessage && !isTransitioning ? 1 : 0.9
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="bg-primary-600 text-white px-4 py-2 rounded-lg max-w-xs">
                <div className="flex items-center space-x-2">
                  <Mic className="w-4 h-4" />
                  <span className="text-sm">"{currentQuestion}"</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Typing Indicator with stable positioning */}
          <div className="flex justify-start h-[50px] items-center">
            {showTypingIndicator && !isTransitioning && (
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.9 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="bg-dark-600 text-gray-200 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <MessageSquare className="w-3 h-3 text-accent-400" />
                    <span className="text-xs text-accent-400">QueryAmie</span>
                  </div>
                  <div className="flex space-x-1">
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* AI Response with stable positioning and fixed height */}
          <div className="flex justify-start min-h-[120px] items-start">
            {showAiResponse && !isTransitioning && (
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="bg-dark-600 text-gray-200 px-4 py-2 rounded-lg max-w-xs">
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="w-3 h-3 text-accent-400" />
                    <span className="text-xs text-accent-400">QueryAmie</span>
                    {isTyping && (
                      <motion.div
                        className="w-1.5 h-1.5 bg-accent-400 rounded-full"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    )}
                  </div>
                  <p className="text-sm leading-relaxed">
                    {displayText || " "}
                    {isTyping && (
                      <motion.span
                        className="inline-block w-0.5 h-4 bg-accent-400 ml-0.5"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    )}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Translation indicator with stable positioning */}
          <div className="flex items-center h-[20px]">
            {showAiResponse && !isTransitioning && currentQuestion.includes("translate") && (
              <motion.div
                className="flex items-center text-xs text-gray-500 ml-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2, ease: "easeOut" }}
              >
                <Languages className="w-3 h-3 mr-1" />
                <span>Auto-translated • French detected • 98% confidence</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* Input Area with stable positioning */}
      <motion.div
        className="flex items-center space-x-2"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: showAiResponse && !isTransitioning ? 1 : 0.6 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="flex-1 bg-dark-600 rounded-lg px-3 py-2 text-sm text-gray-400">
          Ask anything about this document...
        </div>
        <motion.button
          className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Mic className="w-4 h-4 text-white" />
        </motion.button>
      </motion.div>
    </div>
  );
};

const Hero: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const navigate = useNavigate();

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-hero-gradient"></div>
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            ref={ref}
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 mb-6"
            >
              <SparklesIcon className="w-4 h-4 text-primary-400 mr-2" />
              <span className="text-sm font-medium text-primary-300">
                Enhanced with Voice Chat & Translation
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-white via-primary-100 to-accent-200 bg-clip-text text-transparent">
                Transform Complex Documents into
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-300 bg-clip-text text-transparent glow-text">
                Intelligent Conversations
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Stop spending hours reading through complex PDFs, presentations, and reports. 
              QueryAmie extracts insights, answers questions, and even speaks to you in 160+ languages.
            </motion.p>

            {/* Feature Highlights */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8"
            >
              {[
                { icon: Mic, text: "Voice Chat" },
                { icon: Languages, text: "Auto Translation" },
                { icon: FileText, text: "Multi-Format Support" },
                { icon: Zap, text: "Instant Insights" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-300">
                  <feature.icon className="w-4 h-4 text-primary-400 mr-2" />
                  {feature.text}
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                className="btn-primary flex items-center justify-center group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
              >
                <Upload className="w-5 h-5 mr-2" />
                Start for Free
                <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                className="btn-outline flex items-center justify-center"
                onClick={() => setIsVideoModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlayIcon className="w-5 h-5 mr-2" />
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={fadeInUp}
              className="mt-12 text-center lg:text-left"
            >
              <p className="text-sm text-gray-400 mb-4">Trusted by professionals worldwide</p>
              <div className="flex items-center justify-center lg:justify-start space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <span className="text-gray-300 ml-2">4.9/5 from 10,000+ users</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Interactive Demo */}
          <motion.div
            className="relative"
            variants={fadeInUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <motion.div
              animate={floatingAnimation}
              className="relative"
            >
              {/* Main Document Preview */}
              <div className="relative bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl shadow-2xl border border-dark-600 overflow-hidden">
                {/* Document Header */}
                <div className="bg-dark-700 p-4 border-b border-dark-600">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-sm text-gray-400">Research_Report.pdf</div>
                  </div>
                </div>

                {/* Document Content */}
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-600 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-600 rounded w-full"></div>
                    <div className="h-3 bg-gray-600 rounded w-5/6"></div>
                  </div>
                  
                  {/* Highlighted Section */}
                  <div className="bg-primary-500/10 border-l-4 border-primary-500 p-4 rounded">
                    <div className="space-y-2">
                      <div className="h-3 bg-primary-400/50 rounded w-2/3"></div>
                      <div className="h-3 bg-primary-400/50 rounded w-full"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-600 rounded w-4/5"></div>
                    <div className="h-3 bg-gray-600 rounded w-full"></div>
                  </div>
                </div>

                {/* Chat Interface */}
                <div className="overflow-hidden">
                  <ChatInterface />
                </div>
              </div>

              {/* Floating Feature Cards */}
              <motion.div
                className="absolute -top-6 -right-6 bg-gradient-to-r from-accent-600 to-accent-500 rounded-lg p-3 shadow-lg"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0] 
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  delay: 1
                }}
              >
                <Languages className="w-6 h-6 text-white" />
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -left-6 bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg p-3 shadow-lg"
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 0] 
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity,
                  delay: 2
                }}
              >
                <Zap className="w-6 h-6 text-white" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsVideoModalOpen(false)}
        >
          <motion.div
            className="bg-dark-800 rounded-lg p-6 max-w-4xl w-full"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video bg-dark-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PlayIcon className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                <p className="text-gray-300">Demo video coming soon!</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Hero; 