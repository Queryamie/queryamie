import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  EyeIcon, 
  EyeSlashIcon,
  LockClosedIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Shield, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

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

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_API}/reset-password`, {
        token: token,
        new_password: formData.password,
      });

      setIsSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to reset password. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return { text: 'Weak', color: 'text-red-400' };
      case 2:
      case 3:
        return { text: 'Medium', color: 'text-yellow-400' };
      case 4:
      case 5:
        return { text: 'Strong', color: 'text-green-400' };
      default:
        return { text: '', color: '' };
    }
  };

  const currentPasswordStrength = passwordStrength(formData.password);
  const strengthInfo = getPasswordStrengthText(currentPasswordStrength);

  // Success state
  if (isSuccess) {
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
                Password Reset Successfully
              </span>
            </h1>
            <p className="text-gray-300">
              Your password has been updated. You can now sign in with your new password.
            </p>
          </motion.div>

          {/* Success Message */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-8 border border-dark-600 shadow-2xl"
          >
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-lg mx-auto">
                <Check className="w-6 h-6 text-green-400" />
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  All Set!
                </h2>
                <p className="text-gray-300 text-sm">
                  Your password has been successfully reset. You'll be redirected to the sign in page in a few seconds.
                </p>
              </div>

              <motion.div
                className="w-full bg-gray-700 rounded-full h-2"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 3 }}
              >
                <motion.div
                  className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3 }}
                />
              </motion.div>

              <Link
                to="/login"
                className="btn-primary inline-flex items-center"
              >
                Continue to Sign In
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Error state for invalid token
  if (error && !token) {
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
          {/* Error Icon */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl mb-4">
              <ExclamationTriangleIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Invalid Reset Link
              </span>
            </h1>
            <p className="text-gray-300">
              This password reset link is invalid or has expired.
            </p>
          </motion.div>

          {/* Error Message */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-8 border border-dark-600 shadow-2xl"
          >
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-lg mx-auto">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Link Expired or Invalid
                </h2>
                <p className="text-gray-300 text-sm">
                  {error}
                </p>
              </div>

              <div className="flex flex-col space-y-3">
                <Link
                  to="/forgot-password"
                  className="btn-primary flex items-center justify-center"
                >
                  Request New Reset Link
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>

                <Link
                  to="/login"
                  className="text-center text-primary-400 hover:text-primary-300 text-sm transition-colors"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
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
            <LockClosedIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Set New Password
            </span>
          </h1>
          <p className="text-gray-300">
            Create a strong, secure password for your QueryAmie account
          </p>
        </motion.div>

        {/* Reset Password Form */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-8 border border-dark-600 shadow-2xl"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          currentPasswordStrength <= 2
                            ? 'bg-red-500'
                            : currentPasswordStrength <= 3
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{
                          width: `${(currentPasswordStrength / 5) * 100}%`
                        }}
                      />
                    </div>
                    <span className={`text-xs ${strengthInfo.color}`}>
                      {strengthInfo.text}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="mt-2">
                  {formData.password === formData.confirmPassword && formData.confirmPassword.length > 0 ? (
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircleIcon className="h-4 w-4" />
                      <span className="text-xs">Passwords match</span>
                    </div>
                  ) : formData.confirmPassword.length > 0 ? (
                    <span className="text-xs text-red-400">Passwords do not match</span>
                  ) : null}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || !formData.password || !formData.confirmPassword}
              className="w-full btn-primary flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: (formData.password && formData.confirmPassword) ? 1.02 : 1 }}
              whileTap={{ scale: (formData.password && formData.confirmPassword) ? 0.98 : 1 }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Update Password
                  <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* Security Info */}
          <div className="mt-8 p-4 bg-dark-600/30 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-primary-400 mt-0.5" />
              <div>
                <h3 className="text-white font-medium text-sm mb-1">Password Requirements</h3>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Include uppercase and lowercase letters</li>
                  <li>• Include numbers and special characters</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          variants={itemVariants}
          className="mt-8 text-center"
        >
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

export default ResetPasswordPage; 