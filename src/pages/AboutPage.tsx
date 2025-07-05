import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FileText, Users, Target, Zap, Globe, Heart } from 'lucide-react';

const AboutPage: React.FC = () => {
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
              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-5xl font-bold mb-6"
              >
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  About
                </span>
                <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  {" "}QueryAmie
                </span>
              </motion.h1>
              
              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto"
              >
                We're on a mission to transform how the world interacts with documents 
                through intelligent AI, voice technology, and universal translation.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-dark-900/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid lg:grid-cols-2 gap-12"
            >
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="w-8 h-8 text-primary-400" />
                  <h2 className="text-3xl font-bold text-white">Our Mission</h2>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  To democratize access to information by breaking down language barriers 
                  and making document intelligence accessible to everyone, everywhere. 
                  We believe that knowledge should be universal, and technology should 
                  adapt to humans, not the other way around.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Globe className="w-8 h-8 text-accent-400" />
                  <h2 className="text-3xl font-bold text-white">Our Vision</h2>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  A world where every document, in every language, can be understood 
                  and interacted with naturally through voice and conversation. 
                  We envision a future where AI serves as a bridge between human 
                  curiosity and the vast ocean of documented knowledge.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold text-white mb-6"
              >
                Our Core Values
              </motion.h2>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: Users,
                  title: "Accessibility First",
                  description: "We design for everyone, ensuring our technology is accessible to users with different abilities and technical backgrounds."
                },
                {
                  icon: Zap,
                  title: "Innovation",
                  description: "We constantly push the boundaries of what's possible, combining cutting-edge AI with practical solutions."
                },
                {
                  icon: Heart,
                  title: "Human-Centered",
                  description: "Technology should feel natural and intuitive. We prioritize user experience and human connection in everything we build."
                }
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  variants={itemVariants}
                  className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-xl p-6 border border-dark-600 hover:border-primary-500/50 transition-all duration-300"
                >
                  <value.icon className="w-12 h-12 text-primary-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 bg-dark-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center"
            >
              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold text-white mb-8"
              >
                Our Story
              </motion.h2>
              
              <motion.div
                variants={itemVariants}
                className="text-gray-300 space-y-6 leading-relaxed"
              >
                <p>
                  QueryAmie was born from a simple frustration: spending countless hours 
                  reading through documents in different languages, trying to extract 
                  key insights for research and business decisions. Our founders, 
                  working in international environments, realized that language barriers 
                  and time constraints were preventing people from accessing the 
                  information they needed.
                </p>
                
                <p>
                  We started with a vision: what if you could simply talk to your 
                  documents? What if language was no longer a barrier to understanding? 
                  What if AI could help you extract insights in seconds rather than hours?
                </p>
                
                <p>
                  Today, QueryAmie serves thousands of users worldwide—from researchers 
                  accessing international papers to businesses collaborating across 
                  continents. We're just getting started on our mission to make 
                  document intelligence universal and accessible.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-gradient-to-r from-primary-600/10 to-accent-600/10 rounded-2xl p-8 md:p-12 border border-primary-500/20 text-center"
            >
              <motion.h3
                variants={itemVariants}
                className="text-2xl md:text-3xl font-bold text-white mb-4"
              >
                Join Our Journey
              </motion.h3>
              
              <motion.p
                variants={itemVariants}
                className="text-gray-300 mb-8 max-w-2xl mx-auto"
              >
                Want to be part of our mission? We're always looking for passionate 
                people to join our team and help shape the future of document intelligence.
              </motion.p>
              
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.a
                  href="mailto:queryamiee@gmail.com"
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get in Touch
                </motion.a>
                
                <motion.a
                  href="/careers"
                  className="btn-outline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Careers
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

export default AboutPage; 