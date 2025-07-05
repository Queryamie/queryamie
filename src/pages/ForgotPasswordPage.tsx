import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  EnvelopeIcon,
  ArrowRightIcon,
  KeyIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Mail, Shield, Clock, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/forgot-password?email=${encodeURIComponent(email)}`);
      
      if (response.data) {
        toast.success('Password reset instructions have been sent to your email.');
        setIsEmailSent(true);
      }
    } catch (error: any) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to send reset email. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log('Password reset email resent to:', email);
    }, 1500);
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
        <div className="absolute inset-0">
          {/* Animated Background Particles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary-400 rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
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
          className="relative z-10 w-full max-w-md"
        >
          {/* Success Icon */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl mb-4">
              <CheckCircleIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Check Your Email
              </span>
            </h1>
            <p className="text-gray-300">
              We've sent a password reset link to your email address
            </p>
          </motion.div>

          {/* Success Message */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-8 border border-dark-600 shadow-2xl"
          >
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-lg mx-auto">
                <Mail className="w-6 h-6 text-green-400" />
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Email Sent Successfully
                </h2>
                <p className="text-gray-300 text-sm">
                  We've sent a password reset link to:
                </p>
                <p className="text-primary-400 font-medium mt-1">
                  {email}
                </p>
              </div>

              <div className="bg-dark-600/50 rounded-lg p-4 text-left">
                <h3 className="text-white font-medium mb-3">Next Steps:</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-400 mt-1">1.</span>
                    <span>Check your email inbox (and spam folder)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-400 mt-1">2.</span>
                    <span>Click the reset link in the email</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-400 mt-1">3.</span>
                    <span>Create a new strong password</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col space-y-3">
                <motion.button
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  className="btn-outline flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Resend Email
                    </>
                  )}
                </motion.button>

                <Link
                  to="/login"
                  className="text-center text-primary-400 hover:text-primary-300 text-sm transition-colors"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Help Text */}
          <motion.div
            variants={itemVariants}
            className="mt-8 text-center"
          >
            <p className="text-gray-400 text-sm mb-4">
              Didn't receive the email? Check your spam folder or contact support.
            </p>
            <Link
              to="/"
              className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
            >
              ← Back to home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      <div className="absolute inset-0">
        {/* Animated Background Particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
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
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo/Brand Section */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl mb-4">
            <KeyIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Forgot Password?
            </span>
          </h1>
          <p className="text-gray-300">
            No worries! Enter your email address and we'll send you a reset link
          </p>
        </motion.div>

        {/* Forgot Password Form */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-8 border border-dark-600 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  required
                />
              </div>
              <p className="mt-2 text-xs text-gray-400">
                We'll send a password reset link to this email address
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || !email}
              className="w-full btn-primary flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: email ? 1.02 : 1 }}
              whileTap={{ scale: email ? 0.98 : 1 }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Send Reset Link
                  <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-dark-800 to-dark-700 text-gray-400">
                Remember your password?
              </span>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </motion.div>

        {/* Security Features */}
        <motion.div
          variants={itemVariants}
          className="mt-8 grid grid-cols-2 gap-4 text-center"
        >
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
            <Shield className="w-4 h-4 text-green-400" />
            <span>Secure Process</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Quick Recovery</span>
          </div>
        </motion.div>

        {/* Help Text */}
        <motion.div
          variants={itemVariants}
          className="mt-8 text-center"
        >
          <p className="text-gray-400 text-sm mb-4">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              Sign up for free
            </Link>
          </p>
          <Link
            to="/"
            className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            ← Back to home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage; 