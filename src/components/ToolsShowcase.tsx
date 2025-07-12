import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { 
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { 
  FileText, 
  Mic, 
  Languages, 
  BarChart3, 
  FileSpreadsheet, 
  MessageSquare, 
  Zap, 
  Brain,
  Search,
  BookOpen,
  PenTool,
  Volume2
} from 'lucide-react';

const ToolsShowcase: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const navigate = useNavigate();

  const tools = [
    {
      icon: FileText,
      title: "Smart Document Chat",
      description: "Conversational AI for PDFs, Word docs, and presentations",
      color: "from-blue-500 to-blue-600",
      category: "Document Analysis"
    },
    {
      icon: Mic,
      title: "Voice Conversations",
      description: "Speak to your documents and get voice responses",
      color: "from-purple-500 to-purple-600",
      category: "Voice Technology"
    },
    {
      icon: Languages,
      title: "Universal Translator",
      description: "Translate documents and conversations in 160+ languages",
      color: "from-green-500 to-green-600",
      category: "Translation"
    },
    {
      icon: Brain,
      title: "Smart Summarizer",
      description: "Generate intelligent summaries from complex documents",
      color: "from-indigo-500 to-indigo-600",
      category: "AI Analysis"
    },
    {
      icon: Search,
      title: "Semantic Search",
      description: "Find information across multiple documents instantly",
      color: "from-orange-500 to-orange-600",
      category: "Search & Discovery"
    },
    {
      icon: BarChart3,
      title: "Data Insights",
      description: "Extract key metrics and insights from reports",
      color: "from-red-500 to-red-600",
      category: "Analytics"
    },
    {
      icon: PenTool,
      title: "Content Generator",
      description: "Create new content based on document analysis",
      color: "from-teal-500 to-teal-600",
      category: "Content Creation"
    },
    {
      icon: Volume2,
      title: "Audio Playback",
      description: "Listen to document summaries and responses",
      color: "from-pink-500 to-pink-600",
      category: "Accessibility"
    },
    {
      icon: FileSpreadsheet,
      title: "Multi-Format Support",
      description: "Work with PDFs, DOCX, PPTX, XLSX, and more",
      color: "from-cyan-500 to-cyan-600",
      category: "File Support"
    },
    {
      icon: MessageSquare,
      title: "Context Memory",
      description: "Maintains conversation context across sessions",
      color: "from-yellow-500 to-yellow-600",
      category: "Intelligence"
    },
    {
      icon: BookOpen,
      title: "Research Assistant",
      description: "Academic and professional research support",
      color: "from-violet-500 to-violet-600",
      category: "Research"
    },
    {
      icon: Zap,
      title: "Instant Processing",
      description: "Real-time document analysis and responses",
      color: "from-amber-500 to-amber-600",
      category: "Performance"
    }
  ];

  const categories = Array.from(new Set(tools.map(tool => tool.category)));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section id="tools" className="py-20 bg-gradient-to-b from-dark-800 to-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div variants={headerVariants} className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-accent-500/10 to-primary-500/10 border border-accent-500/20 mb-6">
              <SparklesIcon className="w-4 h-4 text-accent-400 mr-2" />
              <span className="text-sm font-medium text-accent-300">
                Comprehensive Toolkit
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                The Complete Document AI
              </span>
              <br />
              <span className="bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">
                Toolkit for Everyone
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Access our comprehensive suite of AI-powered tools designed to help you extract insights, 
              communicate across languages, and transform how you work with documents.
            </p>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.slice(0, 6).map((category, index) => (
                <motion.span
                  key={category}
                  className="px-3 py-1 bg-dark-700 border border-dark-600 rounded-full text-sm text-gray-300 hover:border-primary-500/50 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {category}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Tools Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16"
          >
            {tools.map((tool) => (
              <motion.div
                key={tool.title}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-gradient-to-br from-dark-800 to-dark-700 rounded-xl p-6 border border-dark-600 hover:border-primary-500/50 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Background Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"
                     style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}></div>
                
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <tool.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors">
                      {tool.title}
                    </h3>
                    <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                    {tool.description}
                  </p>
                  
                  <span className="inline-block px-2 py-1 bg-dark-600 rounded text-xs text-gray-400 group-hover:bg-primary-600/20 group-hover:text-primary-300 transition-all">
                    {tool.category}
                  </span>
                </div>

                {/* Hover Effect */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-400/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-10 -translate-y-10"></div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            variants={headerVariants}
            className="text-center bg-gradient-to-r from-primary-600/10 to-accent-600/10 rounded-2xl p-8 md:p-12 border border-primary-500/20"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Transform Your Document Workflow?
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who are already using QueryAmie to work smarter, 
              not harder. Start your free trial today and experience the future of document AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="btn-primary flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Free Trial
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </motion.button>
              
              <motion.button
                className="btn-outline flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                View Documentation
              </motion.button>
            </div>

            {/* Feature Highlights */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary-400">Free</div>
                <div className="text-sm text-gray-400">to get started</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-accent-400">No Setup</div>
                <div className="text-sm text-gray-400">required</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary-400">24/7</div>
                <div className="text-sm text-gray-400">AI availability</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ToolsShowcase; 