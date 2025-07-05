import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { StarIcon } from '@heroicons/react/24/solid';
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

const Testimonials: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const testimonials = [
    {
      name: "Paul Williams, PhD",
      role: "Student",
      company: "NDSU",
      content: "QueryAmie's AI-powered tools have streamlined my research workflow. The ability to interact with documents using natural language is a breakthrough for academic productivity.",
      rating: 5,
      avatar: "👨‍🏫"
    },
    {
      name: "Dr. Kwame Mensah",
      role: "Research Director",
      company: "KNUST",
      content: "QueryAmie has revolutionized how we handle research papers. The voice feature is incredible - I can literally talk to documents while walking to meetings. The translation capability opened up so many international papers we couldn't efficiently access before.",
      rating: 5,
      avatar: "👨‍🔬"
    },
    {
      name: "Akosua Boateng",
      role: "Legal Counsel",
      company: "UG",
      content: "As a lawyer dealing with hundreds of contracts monthly, QueryAmie saves me hours every day. The voice chat is perfect for hands-free document review, and the multi-language support helps with international contracts. Game changer!",
      rating: 5,
      avatar: "👩‍💼"
    },
    {
      name: "Prof. Yaw Amankwah",
      role: "Academic Researcher",
      company: "UCC",
      content: "The AI understands context better than any tool I've used. I uploaded 50 research papers and asked complex questions spanning multiple documents. QueryAmie connected concepts across papers I never would have found manually.",
      rating: 5,
      avatar: "👨‍🎓"
    },
    {
      name: "Kofi Asare",
      role: "Student",
      company: "Ashesi",
      content: "As a student, QueryAmie helps me understand complex topics quickly. I can upload lecture notes and ask questions in Twi or English. It's like having a personal tutor available 24/7!",
      rating: 5,
      avatar: "👨‍🎓"
    },
    {
      name: "Prince Obosu",
      role: "Graduate Student",
      company: "Miami University",
      content: "As a master's student, QueryAmie has been invaluable for organizing and synthesizing research materials. The AI's ability to summarize papers and extract key points has saved me countless hours.",
      rating: 5,
      avatar: "👨‍🎓"
    }
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
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-dark-900 to-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Discover Why People Love
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                QueryAmie
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of professionals, researchers, and students who have transformed 
              their document workflows with QueryAmie's AI-powered intelligence.
            </p>
          </motion.div>

          {/* Testimonials Grid */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-xl p-6 border border-dark-600 hover:border-primary-500/50 transition-all duration-300 relative group"
              >
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                  <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-primary-400" />
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mr-4 text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                    <div className="text-xs text-primary-400">{testimonial.company}</div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-accent-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-primary-600/10 to-accent-600/10 rounded-2xl p-8 md:p-12 border border-primary-500/20"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">4.9★</div>
                <div className="text-sm text-gray-400">Average Rating</div>
                <div className="text-xs text-gray-500">From 50,000+ reviews</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-accent-400 mb-2">2M+</div>
                <div className="text-sm text-gray-400">Documents Processed</div>
                <div className="text-xs text-gray-500">And growing daily</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">160+</div>
                <div className="text-sm text-gray-400">Languages Supported</div>
                <div className="text-xs text-gray-500">Including dialects</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-accent-400 mb-2">24/7</div>
                <div className="text-sm text-gray-400">AI Availability</div>
                <div className="text-xs text-gray-500">Always ready to help</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;