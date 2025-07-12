import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Mic, Languages, FileText, Zap, MessageSquare, Brain, Headphones, Globe } from 'lucide-react';

const Features: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const mainFeatures = [
    {
      icon: Mic,
      title: "Voice-First AI Chat",
      description: "Speak naturally to your documents. Ask questions using your voice and get instant audio responses in 160+ languages.",
      color: "from-primary-500 to-primary-600",
      features: ["Real-time transcription", "Voice responses", "Hands-free operation", "Multi-language support"]
    },
    {
      icon: Languages,
      title: "Universal Translation",
      description: "Break language barriers instantly. Upload documents in any language and chat in your preferred language.",
      color: "from-accent-500 to-accent-600",
      features: ["160+ languages", "Context-aware translation", "Preserve formatting", "Cultural nuances"]
    },
    {
      icon: Brain,
      title: "Enhanced Intelligence",
      description: "Powered by advanced AI that understands context, relationships, and nuanced questions across multiple documents.",
      color: "from-purple-500 to-purple-600",
      features: ["Multi-document analysis", "Contextual understanding", "Smart summarization", "Insight extraction"]
    }
  ];

  const additionalFeatures = [
    {
      icon: FileText,
      title: "Universal File Support",
      description: "PDF, Word, PowerPoint, Excel, and more",
      color: "text-blue-400"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get answers in under 2 seconds",
      color: "text-yellow-400"
    },
    {
      icon: MessageSquare,
      title: "Conversational Memory",
      description: "Remembers context across conversations",
      color: "text-green-400"
    },
    {
      icon: Globe,
      title: "Privacy First",
      description: "Your documents stay secure and private",
      color: "text-purple-400"
    },
    {
      icon: Headphones,
      title: "Accessibility",
      description: "Perfect for visual impairments and multitasking",
      color: "text-pink-400"
    },
    {
      icon: ShieldCheckIcon,
      title: "Enterprise Ready",
      description: "GDPR compliant with enterprise security",
      color: "text-indigo-400"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-dark-900 to-dark-800">
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
              <SparklesIcon className="w-4 h-4 text-primary-400 mr-2" />
              <span className="text-sm font-medium text-primary-300">
                Revolutionary Features
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Engage Effortlessly,
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Gain Insights Fast
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Transform how you interact with documents using cutting-edge AI, voice technology, 
              and universal translation capabilities.
            </p>
          </motion.div>

          {/* Main Features Grid */}
          <motion.div
            variants={containerVariants}
            className="grid lg:grid-cols-3 gap-8 mb-16"
          >
            {/* Voice Section Anchor */}
            <div id="voice" className="absolute -top-20"></div>
            {/* Translation Section Anchor */}
            <div id="translation" className="absolute -top-20"></div>
            {mainFeatures.map((feature) => (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="card-glow group"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary-300 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-3"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Additional Features Grid */}
          <motion.div variants={itemVariants} className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-200">
              Everything You Need for Document Intelligence
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalFeatures.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={cardVariants}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-lg p-6 border border-dark-600 hover:border-primary-500/50 transition-all duration-300"
                >
                  <feature.icon className={`w-8 h-8 ${feature.color} mb-4`} />
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Interactive Demo Section */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-primary-600/10 via-accent-600/10 to-primary-600/10 rounded-2xl p-8 md:p-12 border border-primary-500/20"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  Experience the Future of Document AI
                </h3>
                <p className="text-gray-300 mb-6">
                  See how QueryAmie transforms complex documents into intelligent conversations. 
                  Upload any document and start chatting in seconds.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-300">
                    <Mic className="w-5 h-5 text-primary-400 mr-3" />
                    <span>Say "Summarize this document" and get instant results</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Languages className="w-5 h-5 text-accent-400 mr-3" />
                    <span>Ask questions in any language you prefer</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Brain className="w-5 h-5 text-purple-400 mr-3" />
                    <span>Get contextual insights across multiple documents</span>
                  </div>
                </div>
                <motion.button
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Try Interactive Demo
                </motion.button>
              </div>

              {/* Interactive Preview */}
              <div className="relative">
                <motion.div
                  className="bg-dark-800 rounded-xl p-6 border border-dark-600"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-400">Live Demo</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-primary-600 text-white px-3 py-2 rounded-lg ml-8">
                      <div className="flex items-center space-x-2">
                        <Mic className="w-3 h-3" />
                        <span className="text-sm">"What are the main conclusions?"</span>
                      </div>
                    </div>
                    
                    <div className="bg-dark-600 text-gray-200 px-3 py-2 rounded-lg mr-8">
                      <div className="flex items-center space-x-2 mb-1">
                        <Brain className="w-3 h-3 text-accent-400" />
                        <span className="text-xs text-accent-400">QueryAmie</span>
                      </div>
                      <p className="text-sm">Based on the research, there are 3 key findings...</p>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <Languages className="w-3 h-3 mr-1" />
                      <span>Translated from French • 98% confidence</span>
                    </div>
                  </div>
                </motion.div>

                {/* Floating elements */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-accent-600 rounded-lg p-2"
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Languages className="w-4 h-4 text-white" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features; 