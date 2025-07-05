import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const TrustedBy: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // University logos data with imported images
  const companies = [
    { name: 'KNUST', logo: '/src/assets/knust.png' },
    { name: 'UG', logo: '/src/assets/ug.png' },
    { name: 'UCC', logo: '/src/assets/ucc.png' },
    { name: 'UEW', logo: '/src/assets/uew.png' },
    { name: 'Ashesi', logo: '/src/assets/ashesi.png' },
    { name: 'UDS', logo: '/src/assets/uds.png' },
    { name: 'UHAS', logo: '/src/assets/uhas.png' },
    { name: 'UPSA', logo: '/src/assets/upsa.png' },
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
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="trusted-by" className="py-16 bg-dark-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="mb-12">
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-4">
              Trusted by leading institutions worldwide
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-300">
              <div className="flex items-center">
                <span className="text-primary-400 font-semibold">2M+</span>
                <span className="ml-1">Documents Processed</span>
              </div>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <div className="flex items-center">
                <span className="text-accent-400 font-semibold">160+</span>
                <span className="ml-1">Languages Supported</span>
              </div>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <div className="flex items-center">
                <span className="text-primary-400 font-semibold">99.9%</span>
                <span className="ml-1">Uptime</span>
              </div>
            </div>
          </motion.div>

          {/* Company Logos Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-4 md:grid-cols-8 gap-8 items-center"
          >
            {companies.map((company) => (
              <motion.div
                key={company.name}
                variants={itemVariants}
                className="flex flex-col items-center group cursor-pointer"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-dark-700 to-dark-600 rounded-xl flex items-center justify-center mb-2 group-hover:from-primary-600/20 group-hover:to-accent-600/20 transition-all duration-300 border border-dark-500 group-hover:border-primary-500/50">
                  <img src={company.logo} alt={`${company.name} logo`} className="max-w-[70%] max-h-[70%] object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors text-center">
                  {company.name}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            variants={itemVariants}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-400 mb-2">4.9★</div>
              <div className="text-sm text-gray-400">Average Rating</div>
              <div className="text-xs text-gray-500">From 50,000+ reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-400 mb-2">24/7</div>
              <div className="text-sm text-gray-400">AI Availability</div>
              <div className="text-xs text-gray-500">Always ready to help</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-400 mb-2">&lt;2s</div>
              <div className="text-sm text-gray-400">Response Time</div>
              <div className="text-xs text-gray-500">Lightning fast answers</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedBy; 