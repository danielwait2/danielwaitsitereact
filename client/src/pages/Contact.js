import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiMail, FiLinkedin, FiYoutube } from 'react-icons/fi';

function Contact() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 flex items-center">
      <div ref={ref} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          className="card-modern p-8 md:p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <FiMail className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-4 gradient-text"
          >
            Get in touch
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 dark:text-gray-400 mb-8"
          >
            danielwait6492@gmail.com
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="flex justify-center space-x-6"
          >
            <motion.a
              href="https://www.linkedin.com/in/danielwait2/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, y: -5 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <FiLinkedin className="w-7 h-7" />
            </motion.a>
            <motion.a
              href="https://www.youtube.com/@danielwait"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, y: -5 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 rounded-full bg-red-600 dark:bg-red-500 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <FiYoutube className="w-7 h-7" />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Contact;
