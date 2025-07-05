import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Twitter, 
  Linkedin, 
  Mail, 
  MapPin,
  Mic,
  Languages,
  Zap,
  Shield,
  Heart
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Footer: React.FC = () => {
  // Newsletter subscription state
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_API}/newsletter/subscribe`, {
        email: email.trim()
      });

      toast.success('Successfully subscribed to our newsletter! Check your email for a welcome message.');
      setEmail('');
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to subscribe to newsletter. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const productLinks = [
    { name: 'Chat with Documents', href: '#' },
    { name: 'Voice Conversations', href: '#' },
    { name: 'Document Translation', href: '#' },
    { name: 'Smart Summarization', href: '#' },
    { name: 'Multi-Format Support', href: '#' },
    { name: 'API Access', href: '#' }
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about', isRoute: true },
    { name: 'Careers', href: '#', isRoute: false },
    { name: 'Blog', href: '#', isRoute: false },
    { name: 'Press Kit', href: '#', isRoute: false },
    { name: 'Contact', href: '/contact', isRoute: true },
    { name: 'Partners', href: '#trusted-by', isRoute: false }
  ];

  const supportLinks = [
    { name: 'Help Center', href: '#' },
    { name: 'Documentation', href: '#' },
    { name: 'API Docs', href: '#' },
    { name: 'Status Page', href: '#' },
    { name: 'Community', href: '#' },
    { name: 'Feedback', href: '#' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy', isRoute: true },
    { name: 'Terms of Service', href: '/terms', isRoute: true },
    { name: 'Cookie Policy', href: '#', isRoute: false },
    { name: 'GDPR Compliance', href: '#', isRoute: false },
    { name: 'Security', href: '#', isRoute: false },
    { name: 'Data Processing', href: '#', isRoute: false }
  ];

  const features = [
    { icon: Mic, text: 'Voice Chat' },
    { icon: Languages, text: '160+ Languages' },
    { icon: Zap, text: 'Lightning Fast' },
    { icon: Shield, text: 'Enterprise Security' }
  ];

  return (
    <footer className="bg-gradient-to-b from-dark-900 to-black border-t border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-16"
        >
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  QueryAmie
                </span>
              </div>
              
              <p className="text-gray-400 mb-6 leading-relaxed">
                Transform your document workflow with AI-powered intelligence. 
                Chat with documents, translate content, and extract insights 
                using voice and text in 160+ languages.
              </p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-400">
                    <feature.icon className="w-4 h-4 text-primary-400 mr-2" />
                    {feature.text}
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {[
                  { icon: Twitter, href: 'https://twitter.com/AppQueryAmie', label: 'Twitter' },
                  { icon: Linkedin, href: 'https://www.linkedin.com/company/queryamie', label: 'LinkedIn' },
                  { icon: Mail, href: 'mailto:queryamiee@gmail.com', label: 'Email' }
                ].map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-dark-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Products */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-semibold text-white mb-4">Products</h3>
              <ul className="space-y-3">
                {productLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    {link.isRoute ? (
                      <Link 
                        to={link.href}
                        className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <a 
                        href={link.href}
                        className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    {link.isRoute ? (
                      <Link 
                        to={link.href}
                        className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <a 
                        href={link.href}
                        className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Newsletter Signup */}
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-r from-primary-600/10 to-accent-600/10 rounded-2xl p-8 mb-12 border border-primary-500/20"
          >
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Stay Updated with QueryAmie
                </h3>
                <p className="text-gray-300">
                  Get the latest updates, features, and tips delivered to your inbox.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || !email.trim()}
                    className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Subscribe'
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-400 mb-1">2M+</div>
              <div className="text-sm text-gray-400">Documents Processed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-400 mb-1">160+</div>
              <div className="text-sm text-gray-400">Languages Supported</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-400 mb-1">99.9%</div>
              <div className="text-sm text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-400 mb-1">50K+</div>
              <div className="text-sm text-gray-400">Happy Users</div>
            </div>
          </motion.div>

          {/* Bottom Section */}
          <motion.div 
            variants={itemVariants}
            className="pt-8 border-t border-dark-700"
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>© {new Date().getFullYear()} QueryAmie. All rights reserved.</span>
                <div className="hidden md:flex items-center space-x-1">
                  <span>Made with</span>
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>for document lovers</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-1 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>Accra, Ghana</span>
                </div>
                <div className="flex items-center space-x-1 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>All systems operational</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 