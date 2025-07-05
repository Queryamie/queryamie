import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  CalendarDaysIcon, 
  ClockIcon,
  UserIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  VideoCameraIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Calendar, Clock, Users, Video, Phone, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const ScheduleDemoPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    demoType: 'video',
    preferredDate: '',
    preferredTime: '',
    useCase: '',
    teamSize: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.company.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/demo/book`, formData);

      toast.success('Demo booked successfully! We will contact you shortly.');

      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        demoType: 'video',
        preferredDate: '',
        preferredTime: '',
        useCase: '',
        teamSize: ''
      });
    } catch (error: any) {
      console.error('Demo booking error:', error);
      const msg = error.response?.data?.detail || 'Failed to book demo. Please try again.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const demoFeatures = [
    "Live document processing demonstration",
    "Voice chat and translation showcase", 
    "Custom use case discussion",
    "Implementation timeline planning",
    "Pricing and deployment options",
    "Q&A with product experts"
  ];

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center mb-16"
            >
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 mb-6"
              >
                <Calendar className="w-4 h-4 text-primary-400 mr-2" />
                <span className="text-sm font-medium text-primary-300">
                  Book Your Personal Demo
                </span>
              </motion.div>
              
              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-5xl font-bold mb-6"
              >
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Schedule a
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  Live Demo
                </span>
              </motion.h1>
              
              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-300 max-w-3xl mx-auto"
              >
                See QueryAmie in action with a personalized demonstration. 
                Our experts will show you how to transform your document workflow.
              </motion.p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Demo Information */}
              <motion.div
                variants={itemVariants}
                className="space-y-8"
              >
                <div className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-8 border border-dark-600">
                  <h2 className="text-2xl font-bold text-white mb-6">What You'll See</h2>
                  <ul className="space-y-4">
                    {demoFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircleIcon className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-primary-600/10 to-accent-600/10 rounded-2xl p-8 border border-primary-500/20">
                  <h3 className="text-xl font-bold text-white mb-4">Demo Details</h3>
                  <div className="space-y-4 text-gray-300">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-primary-400" />
                      <span>30-45 minutes duration</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Video className="w-5 h-5 text-accent-400" />
                      <span>Video call or phone demo available</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-green-400" />
                      <span>Bring your team (up to 10 participants)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5 text-blue-400" />
                      <span>Live Q&A with product experts</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Booking Form */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-8 border border-dark-600"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Book Your Demo</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@company.com"
                      className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                      required
                    />
                  </div>

                  {/* Company & Phone */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                        Company *
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Company name"
                        className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Demo Type */}
                  <div>
                    <label htmlFor="demoType" className="block text-sm font-medium text-gray-300 mb-2">
                      Demo Type
                    </label>
                    <select
                      id="demoType"
                      name="demoType"
                      value={formData.demoType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    >
                      <option value="video">Video Call (Zoom/Teams)</option>
                      <option value="phone">Phone Call</option>
                      <option value="onsite">On-site (Enterprise)</option>
                    </select>
                  </div>

                  {/* Date & Time */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-300 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        id="preferredDate"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-300 mb-2">
                        Preferred Time *
                      </label>
                      <select
                        id="preferredTime"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                        required
                      >
                        <option value="">Select time</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Team Size */}
                  <div>
                    <label htmlFor="teamSize" className="block text-sm font-medium text-gray-300 mb-2">
                      Expected Attendees
                    </label>
                    <select
                      id="teamSize"
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    >
                      <option value="">Select team size</option>
                      <option value="1">Just me</option>
                      <option value="2-5">2-5 people</option>
                      <option value="6-10">6-10 people</option>
                      <option value="10+">10+ people</option>
                    </select>
                  </div>

                  {/* Use Case */}
                  <div>
                    <label htmlFor="useCase" className="block text-sm font-medium text-gray-300 mb-2">
                      What would you like to focus on?
                    </label>
                    <textarea
                      id="useCase"
                      name="useCase"
                      rows={3}
                      value={formData.useCase}
                      onChange={handleInputChange}
                      placeholder="Tell us about your specific use case, document types, or challenges you'd like to address..."
                      className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    <CalendarDaysIcon className="w-5 h-5" />
                    <span>{isSubmitting ? 'Booking...' : 'Schedule Demo'}</span>
                  </motion.button>

                  <p className="text-xs text-gray-400 text-center">
                    We'll send you a calendar invite with demo details within 2 hours.
                  </p>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-dark-900/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center"
            >
              <motion.h3
                variants={itemVariants}
                className="text-3xl font-bold text-white mb-12"
              >
                Why Schedule a Demo?
              </motion.h3>
              
              <motion.div
                variants={containerVariants}
                className="grid md:grid-cols-3 gap-8"
              >
                <motion.div variants={itemVariants} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserIcon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-3">Personalized Experience</h4>
                  <p className="text-gray-400">Tailored demo focusing on your specific use cases and requirements</p>
                </motion.div>

                <motion.div variants={itemVariants} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <VideoCameraIcon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-3">Live Interaction</h4>
                  <p className="text-gray-400">Ask questions in real-time and see immediate responses</p>
                </motion.div>

                <motion.div variants={itemVariants} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BuildingOfficeIcon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-3">Implementation Planning</h4>
                  <p className="text-gray-400">Discuss deployment timeline and integration with your existing systems</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ScheduleDemoPage; 