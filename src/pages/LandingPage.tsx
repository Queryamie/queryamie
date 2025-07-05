import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import LiveDemo from '../components/LiveDemo';
import TrustedBy from '../components/TrustedBy';
import ToolsShowcase from '../components/ToolsShowcase';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  return (
    <motion.div 
      className="min-h-screen bg-hero-gradient"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <LiveDemo />
        <ToolsShowcase />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </motion.div>
  );
};

export default LandingPage; 