import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, Lock, Eye, UserCheck, Database, Globe } from 'lucide-react';

const PrivacyPage: React.FC = () => {
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
                <Shield className="w-4 h-4 text-primary-400 mr-2" />
                <span className="text-sm font-medium text-primary-300">
                  Your Privacy Matters
                </span>
              </motion.div>
              
              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-5xl font-bold mb-6"
              >
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Privacy
                </span>
                <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  {" "}Policy
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
                At QueryAmie, we take your privacy seriously. This policy explains how we collect, 
                use, and protect your information when you use our services.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Privacy Highlights */}
        <section className="py-16 bg-dark-900/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8 mb-16"
            >
              {[
                {
                  icon: Lock,
                  title: "End-to-End Encryption",
                  description: "Your documents and conversations are encrypted at rest and in transit."
                },
                {
                  icon: Eye,
                  title: "No Data Mining",
                  description: "We don't scan or analyze your documents for advertising or other purposes."
                },
                {
                  icon: UserCheck,
                  title: "You Own Your Data",
                  description: "You maintain full control and ownership of all your uploaded content."
                }
              ].map((item) => (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-xl p-6 border border-dark-600 text-center"
                >
                  <item.icon className="w-12 h-12 text-primary-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Detailed Policy */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="prose prose-invert max-w-none"
            >
              <motion.div variants={itemVariants} className="space-y-8">
                
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <Database className="w-6 h-6 text-primary-400 mr-3" />
                    Information We Collect
                  </h2>
                  <div className="text-gray-300 space-y-4">
                    <p>We collect information you provide directly to us, such as:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Account information (email, username, profile details)</li>
                      <li>Documents and files you upload to our service</li>
                      <li>Chat conversations and queries you make</li>
                      <li>Support communications and feedback</li>
                      <li>Payment information (processed securely by our payment partners)</li>
                    </ul>
                    
                    <p>We automatically collect certain information when you use our service:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Usage data and analytics</li>
                      <li>Device information and browser type</li>
                      <li>IP address and location information</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <Shield className="w-6 h-6 text-primary-400 mr-3" />
                    How We Use Your Information
                  </h2>
                  <div className="text-gray-300 space-y-4">
                    <p>We use the information we collect to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Provide, maintain, and improve our services</li>
                      <li>Process and respond to your queries and documents</li>
                      <li>Communicate with you about your account and our services</li>
                      <li>Ensure security and prevent fraud</li>
                      <li>Comply with legal obligations</li>
                      <li>Develop new features and services</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <Globe className="w-6 h-6 text-primary-400 mr-3" />
                    Information Sharing
                  </h2>
                  <div className="text-gray-300 space-y-4">
                    <p>We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>With your explicit consent</li>
                      <li>To trusted service providers who assist in operating our service</li>
                      <li>When required by law or to protect our legal rights</li>
                      <li>In connection with a business transfer or acquisition</li>
                    </ul>
                    
                    <p className="font-semibold text-primary-300">
                      Important: We never use your documents or conversations to train AI models 
                      or for any purpose other than providing our service to you.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
                  <div className="text-gray-300 space-y-4">
                    <p>We implement industry-standard security measures including:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>AES-256 encryption for data at rest</li>
                      <li>TLS encryption for data in transit</li>
                      <li>Regular security audits and penetration testing</li>
                      <li>Access controls and authentication protocols</li>
                      <li>Secure cloud infrastructure with redundancy</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
                  <div className="text-gray-300 space-y-4">
                    <p>You have the right to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Access and review your personal information</li>
                      <li>Correct inaccurate or incomplete information</li>
                      <li>Delete your account and associated data</li>
                      <li>Export your data in a portable format</li>
                      <li>Opt out of marketing communications</li>
                      <li>Request information about data processing</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Data Retention</h2>
                  <div className="text-gray-300 space-y-4">
                    <p>
                      We retain your information only as long as necessary to provide our services 
                      and fulfill the purposes outlined in this policy. When you delete your account, 
                      we will permanently delete your personal information and documents within 30 days, 
                      except where required by law to retain certain information.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">International Users</h2>
                  <div className="text-gray-300 space-y-4">
                    <p>
                      QueryAmie is based in Ghana. If you are using our service from 
                      outside Ghana, please be aware that your information may be transferred to, 
                      stored, and processed in Ghana. We ensure appropriate safeguards are in place 
                      for international data transfers.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Children's Privacy</h2>
                  <div className="text-gray-300 space-y-4">
                    <p>
                      Our service is not intended for children under 13 years of age. We do not 
                      knowingly collect personal information from children under 13. If we become 
                      aware that we have collected such information, we will delete it immediately.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
                  <div className="text-gray-300 space-y-4">
                    <p>
                      We may update this privacy policy from time to time. We will notify you of 
                      any changes by posting the new policy on this page and updating the "Last 
                      updated" date. Continued use of our service after changes are posted 
                      constitutes acceptance of the updated policy.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                  <div className="text-gray-300 space-y-4">
                    <p>
                      If you have any questions about this privacy policy or our practices, 
                      please contact us at:
                    </p>
                    <div className="bg-dark-800 rounded-lg p-4 border border-dark-600">
                      <p><strong>Email:</strong> queryamiee@gmail.com</p>
                      <p><strong>Subject:</strong> Privacy Policy Inquiry</p>
                    </div>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage; 