import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, FileText, Users, AlertTriangle, Scale } from 'lucide-react';

const TermsPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const termsData = [
    {
      number: "1",
      title: "Acceptance of Terms",
      content: "By accessing and using QueryAmie's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
    },
    {
      number: "2",
      title: "Use of Services",
      content: "You agree to use QueryAmie services only for lawful purposes and in accordance with these Terms. You agree not to use the service: (a) In any way that violates any applicable federal, state, local, or international law or regulation; (b) To transmit, or procure the sending of, any advertising or promotional material without our prior written consent; (c) To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity; (d) To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the service."
    },
    {
      number: "3",
      title: "User Accounts",
      content: "When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account. You agree not to disclose your password to any third party and to take sole responsibility for activities under your account."
    },
    {
      number: "4",
      title: "Intellectual Property",
      content: "The service and its original content, features, and functionality are and will remain the exclusive property of QueryAmie and its licensors. The service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent."
    },
    {
      number: "5",
      title: "Termination",
      content: "We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will stop immediately."
    },
    {
      number: "6",
      title: "Limitation of Liability",
      content: "In no event shall QueryAmie, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service."
    },
    {
      number: "7",
      title: "Changes to Terms",
      content: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion."
    }
  ];

  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 mb-6"
              >
                <Scale className="w-4 h-4 text-primary-400 mr-2" />
                <span className="text-sm font-medium text-primary-300">
                  Legal Terms & Conditions
                </span>
              </motion.div>
              
              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-5xl font-bold mb-6"
              >
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Terms of
                </span>
                <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  {" "}Service
                </span>
              </motion.h1>
              
              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-300 mb-8"
              >
                Last updated: July 2025
              </motion.p>
              
              <motion.p
                variants={itemVariants}
                className="text-lg text-gray-400 max-w-3xl mx-auto"
              >
                Please read these Terms carefully before using QueryAmie. By using our services, you agree to be bound by these terms.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-8"
            >
              {termsData.map((term) => (
                <motion.div
                  key={term.number}
                  variants={itemVariants}
                  className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-8 border border-dark-600"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">{term.number}</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white mb-4">{term.title}</h2>
                      <p className="text-gray-300 leading-relaxed">{term.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Additional Important Information */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-r from-amber-600/10 to-orange-600/10 rounded-2xl p-8 border border-amber-500/20"
              >
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="w-8 h-8 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Important Notice</h3>
                    <div className="text-gray-300 space-y-3">
                      <p>
                        These terms constitute the entire agreement between you and QueryAmie regarding 
                        your use of the service and supersede all prior and contemporaneous written or 
                        oral agreements between you and QueryAmie.
                      </p>
                      <p>
                        You may be subject to additional terms and conditions that apply when you use 
                        or purchase other QueryAmie services, which we will provide to you at the time 
                        of such use or purchase.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-r from-primary-600/10 to-accent-600/10 rounded-2xl p-8 border border-primary-500/20"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">Questions About These Terms?</h3>
                  <p className="text-gray-300 mb-6">
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <motion.a
                      href="mailto:queryamiee@gmail.com?subject=Terms of Service Inquiry"
                      className="btn-primary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Contact Legal Team
                    </motion.a>
                    <div className="text-sm text-gray-400">
                      <strong>Email:</strong> queryamiee@gmail.com
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-16 bg-dark-900/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.h3
                variants={itemVariants}
                className="text-2xl font-bold text-white text-center mb-12"
              >
                Related Documents
              </motion.h3>
              
              <motion.div
                variants={containerVariants}
                className="grid md:grid-cols-3 gap-6"
              >
                <motion.a
                  href="/privacy"
                  variants={itemVariants}
                  className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-xl p-6 border border-dark-600 hover:border-primary-500/50 transition-all duration-300 group"
                  whileHover={{ y: -4 }}
                >
                  <Shield className="w-8 h-8 text-primary-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="text-lg font-semibold text-white mb-2">Privacy Policy</h4>
                  <p className="text-gray-400 text-sm">Learn how we protect and handle your personal information</p>
                </motion.a>

                <motion.a
                  href="/contact"
                  variants={itemVariants}
                  className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-xl p-6 border border-dark-600 hover:border-accent-500/50 transition-all duration-300 group"
                  whileHover={{ y: -4 }}
                >
                  <Users className="w-8 h-8 text-accent-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="text-lg font-semibold text-white mb-2">Contact Support</h4>
                  <p className="text-gray-400 text-sm">Get help with questions about our terms and policies</p>
                </motion.a>

                <motion.a
                  href="/about"
                  variants={itemVariants}
                  className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-xl p-6 border border-dark-600 hover:border-green-500/50 transition-all duration-300 group"
                  whileHover={{ y: -4 }}
                >
                  <FileText className="w-8 h-8 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="text-lg font-semibold text-white mb-2">About QueryAmie</h4>
                  <p className="text-gray-400 text-sm">Learn more about our company and mission</p>
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage; 