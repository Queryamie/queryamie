import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { 
  CheckIcon, 
  StarIcon,
  SparklesIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { Zap, Crown, Rocket, Mail, MessageSquare } from 'lucide-react';

const Pricing: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      icon: Zap,
      price: "GHS 0",
      period: "forever",
      description: "Perfect for individuals getting started with AI document chat",
      features: [
        "5 documents per month",
        "Basic chat functionality", 
        "Standard response time",
        "Community support",
        "Basic file formats (PDF, TXT)",
        "Email support"
      ],
      cta: "Start Free",
      popular: false,
      color: "from-gray-500 to-gray-600"
    },
    {
      name: "Professional", 
      icon: Crown,
      price: "GHS 11",
      period: "per month",
      description: "Ideal for professionals and small teams with advanced needs",
      features: [
        "Unlimited documents",
        "Voice chat & responses",
        "160+ language translation",
        "Priority support",
        "All file formats",
        "API access",
        "Advanced analytics",
        "Custom integrations"
      ],
      cta: "Contact Sales",
      popular: true,
      color: "from-primary-500 to-primary-600"
    },
    {
      name: "Enterprise",
      icon: Rocket, 
      price: "Custom",
      period: "contact us",
      description: "For large organizations requiring advanced security and features",
      features: [
        "Everything in Professional",
        "Private cloud deployment",
        "Custom AI training",
        "White-label solution",
        "99.9% SLA guarantee",
        "Dedicated account manager",
        "Advanced security & compliance",
        "Custom development"
      ],
      cta: "Contact Sales",
      popular: false,
      color: "from-accent-500 to-accent-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
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

  const handleContactSales = () => {
    window.location.href = "mailto:queryamiee@gmail.com?subject=QueryAmie Pricing Inquiry&body=Hello,%0D%0A%0D%0AI'm interested in learning more about QueryAmie's pricing plans. Please provide more information about:%0D%0A%0D%0A- Professional plan features%0D%0A- Enterprise solutions%0D%0A- Custom pricing options%0D%0A%0D%0AThank you!";
  };

  const handleCtaClick = (cta: string) => {
    if (cta === "Start Free") {
      navigate('/register');
    } else if (cta === "Contact Sales") {
      handleContactSales();
    }
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-dark-800 to-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 mb-6">
              <SparklesIcon className="w-4 h-4 text-primary-400 mr-2" />
              <span className="text-sm font-medium text-primary-300">
                Simple, Transparent Pricing
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Choose Your Perfect
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                QueryAmie Plan
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Start free and scale as you grow. All plans include our core AI features 
              with different limits and advanced capabilities.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`relative bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-8 border ${
                  plan.popular 
                    ? 'border-primary-500 shadow-glow' 
                    : 'border-dark-600 hover:border-primary-500/50'
                } transition-all duration-300 group`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                      <StarIcon className="w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>

                {/* Plan Details */}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{plan.description}</p>

                {/* Pricing */}
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-2">/ {plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <CheckIcon className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-lg hover:shadow-glow'
                      : 'border-2 border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCtaClick(plan.cta)}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Section */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-primary-600/10 to-accent-600/10 rounded-2xl p-8 md:p-12 border border-primary-500/20 text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              We offer custom pricing for large organizations, educational institutions, 
              and unique use cases. Let's discuss how QueryAmie can fit your specific needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="btn-primary flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContactSales}
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Sales Team
              </motion.button>
              
              <motion.a
                href="/schedule-demo"
                className="btn-outline flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Schedule Demo
              </motion.a>
            </div>

            {/* Contact Info */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center">
                <EnvelopeIcon className="w-4 h-4 mr-2" />
                <span>queryamiee@gmail.com</span>
              </div>
              <div className="flex items-center">
                <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                <span>24/7 Support Available</span>
              </div>
            </div>
          </motion.div>

          {/* FAQ Link */}
          <motion.div variants={itemVariants} className="text-center mt-12">
            <p className="text-gray-400">
              Have questions about our plans? 
              <a href="#faq" className="text-primary-400 hover:text-primary-300 ml-1 underline">
                Check our FAQ section
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing; 