import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiCode, FiGlobe, FiTrendingUp, FiSettings, FiMail, FiArrowRight } from 'react-icons/fi';

const features = [
  {
    icon: FiCode,
    title: 'Software Development',
    description: 'Custom software solutions tailored to your business needs',
  },
  {
    icon: FiGlobe,
    title: 'Web Applications',
    description: 'Modern, responsive web applications built with cutting-edge technology',
  },
  {
    icon: FiTrendingUp,
    title: 'Data Analytics',
    description: 'Transform your data into actionable insights',
  },
  {
    icon: FiSettings,
    title: 'Process Optimization',
    description: 'Streamline operations and increase efficiency',
  },
];

function WaitWorks() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Wait Works LLC
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Professional technology consulting, software development, and business solutions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="card-modern p-8 md:p-12 mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">About Wait Works LLC</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            Founded by <strong className="text-gray-900 dark:text-white">Daniel Wait</strong>, Wait Works LLC specializes in custom software development, 
            web applications, and system integration to streamline your business operations.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            We help companies generate additional revenue and save time through smart automation and 
            innovative technology solutions. Our expertise includes:
          </p>
          <ul className="mt-6 space-y-3 text-gray-600 dark:text-gray-300">
            {['Custom Software Development', 'Web Application Development', 'Business Process Optimization', 'Data Analytics & Reporting', 'System Integration', 'Technology Consulting'].map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center gradient-text">Our Services</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="card-modern p-8"
                >
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="card-modern p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Contact Us</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Ready to transform your business with technology? Get in touch with us today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:daniel@waitworks.com">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-modern flex items-center space-x-2"
              >
                <FiMail />
                <span>Email Us</span>
              </motion.button>
            </a>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-modern-outline flex items-center space-x-2"
              >
                <span>Contact Page</span>
                <FiArrowRight />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default WaitWorks;
