import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronDownIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const FAQ: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is QueryAmie?",
      answer: "QueryAmie is an AI-powered document intelligence platform that helps you interact with your documents through voice and text. You can upload PDFs, Word documents, PowerPoint presentations, and other files, then ask questions and get intelligent responses in over 160 languages. It combines advanced AI with voice technology and universal translation to transform how you work with documents."
    },
    {
      question: "How does the voice chat feature work?",
      answer: "Our voice chat feature uses advanced speech recognition to transcribe your spoken questions in real-time. You can speak naturally to QueryAmie about your documents, and it will respond with both text and audio answers. The system supports 160+ languages and can handle complex, multi-part questions. It's perfect for hands-free document review and accessibility needs."
    },
    {
      question: "What file formats does QueryAmie support?",
      answer: "QueryAmie supports a wide range of file formats including PDF, Microsoft Word (DOCX), PowerPoint (PPTX), Excel (XLSX), plain text files, and more. We're constantly adding support for additional formats. The AI can extract and understand content from all these formats while preserving important structural information."
    },
    {
      question: "How accurate is the translation feature?",
      answer: "Our translation system achieves over 95% accuracy for most language pairs, using context-aware AI that understands document structure and terminology. Unlike basic translation tools, QueryAmie preserves formatting, understands technical terms, and maintains the original meaning. It's particularly effective for academic papers, legal documents, and business reports."
    },
    {
      question: "Is my data secure with QueryAmie?",
      answer: "Absolutely. QueryAmie is GDPR compliant and uses enterprise-grade security measures. Your documents are encrypted in transit and at rest. We don't store your actual files - only text content and FAISS indexes for fast retrieval. You can delete your data at any time, and we offer private deployment options for enterprise customers."
    },
    {
      question: "Can I use QueryAmie with multiple documents?",
      answer: "Yes! QueryAmie excels at multi-document analysis. You can upload multiple files to a single chat session and ask questions that span across all documents. The AI understands relationships between documents and can synthesize information from multiple sources to provide comprehensive answers."
    },
    {
      question: "How does pricing work?",
      answer: "QueryAmie offers a free tier to get started, with generous limits for personal use. Our paid plans start at GHS 11/month for professionals and include unlimited document uploads, priority processing, advanced features, and premium support. Enterprise plans include custom integrations, private deployments, and dedicated support."
    },
    {
      question: "What makes QueryAmie different from other AI document tools?",
      answer: "QueryAmie is the only platform that combines voice-first interaction, universal translation, and advanced AI in one solution. While other tools focus on text-only chat, we enable natural voice conversations with your documents. Our translation capabilities and multi-language support are unmatched, making us ideal for global teams and international research."
    },
    {
      question: "Can I integrate QueryAmie with my existing workflow?",
      answer: "Yes! QueryAmie offers API access, browser extensions, and integrations with popular tools like Zotero, Google Drive, and Dropbox. We're continuously adding new integrations based on user feedback. Enterprise customers can also access custom integration options and dedicated technical support."
    },
    {
      question: "How quickly does QueryAmie process documents?",
      answer: "Document processing is typically completed within seconds, even for large files. Once processed, you get responses to your questions in under 2 seconds. Our infrastructure is optimized for speed and reliability, with 99.9% uptime and global CDN support for fast access worldwide."
    }
  ];

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-dark-800 to-dark-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-accent-500/10 to-primary-500/10 border border-accent-500/20 mb-6">
              <QuestionMarkCircleIcon className="w-4 h-4 text-accent-400 mr-2" />
              <span className="text-sm font-medium text-accent-300">
                Frequently Asked Questions
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                You asked,
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                We answer
              </span>
            </h2>
            
            <p className="text-xl text-gray-300">
              Everything you need to know about QueryAmie and how it can transform your document workflow.
            </p>
          </motion.div>

          {/* FAQ Items */}
          <motion.div variants={containerVariants} className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-xl border border-dark-600 hover:border-primary-500/50 transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between group focus:outline-none"
                >
                  <span className="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex-shrink-0"
                  >
                    <ChevronDownIcon className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5">
                        <div className="pt-2 border-t border-dark-600">
                          <p className="text-gray-300 leading-relaxed mt-3">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            variants={itemVariants}
            className="mt-16 text-center bg-gradient-to-r from-primary-600/10 to-accent-600/10 rounded-2xl p-8 border border-primary-500/20"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-300 mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Support
              </motion.button>
              <motion.button
                className="btn-outline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Documentation
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ; 