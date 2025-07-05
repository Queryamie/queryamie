import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  HomeIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Search, Home, FileQuestion, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
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

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const popularPages = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About Us', path: '/about', icon: FileQuestion },
    { name: 'Contact', path: '/contact', icon: Search },
    { name: 'Sign In', path: '/login', icon: ArrowLeft },
  ];

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Background Particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl mx-auto text-center"
      >
        {/* 404 Illustration */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <motion.div
            animate={floatingAnimation}
            className="inline-block"
          >
            <div className="relative">
              {/* Large 404 Text */}
              <div className="text-8xl md:text-9xl font-bold opacity-10 text-white select-none">
                404
              </div>
              
              {/* Floating Error Icon */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1] 
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  delay: 1
                }}
              >
                <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <FileQuestion className="w-12 h-12 text-white" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Page Not Found
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-gray-400">
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Link to="/">
            <motion.button
              className="btn-primary flex items-center justify-center group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Back to Home
              <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
          
          <motion.button
            className="btn-outline flex items-center justify-center group"
            onClick={() => window.history.back()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </motion.button>
        </motion.div>

        {/* Popular Pages */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-dark-800/50 to-dark-700/50 rounded-2xl p-8 border border-dark-600/50 backdrop-blur-sm"
        >
          <div className="flex items-center justify-center mb-6">
            <MagnifyingGlassIcon className="w-5 h-5 text-primary-400 mr-2" />
            <h2 className="text-xl font-semibold text-white">
              Popular Pages
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularPages.map((page, index) => (
              <Link
                key={index}
                to={page.path}
                className="group"
              >
                <motion.div
                  className="bg-dark-700/50 hover:bg-dark-600/50 rounded-lg p-4 text-center transition-all duration-300 border border-dark-600/30 hover:border-primary-500/30"
                  whileHover={{ 
                    y: -5,
                    scale: 1.02,
                    boxShadow: "0 10px 30px rgba(14, 165, 233, 0.1)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <page.icon className="w-8 h-8 text-primary-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-gray-300 group-hover:text-white transition-colors text-sm font-medium">
                    {page.name}
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          variants={itemVariants}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-500/20 rounded-lg mb-4">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
          </div>
          <h3 className="text-white font-medium mb-2">Need Help?</h3>
          <p className="text-gray-400 text-sm mb-4">
            If you believe this is an error, please contact our support team.
          </p>
          <Link
            to="/contact"
            className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
          >
            Contact Support →
          </Link>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-r from-primary-600/20 to-accent-600/20 rounded-full blur-xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-20 right-10 w-20 h-20 bg-gradient-to-r from-accent-600/20 to-primary-600/20 rounded-full blur-xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </motion.div>
    </div>
  );
};

export default NotFoundPage; 