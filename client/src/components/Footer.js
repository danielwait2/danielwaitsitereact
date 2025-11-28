import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowUp, FiMail, FiShield, FiFileText } from 'react-icons/fi';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 dark:bg-black border-t border-gray-700 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Copyright &copy; Daniel Wait 2025
            </p>
            <p className="text-white dark:text-gray-300 font-bold text-sm mt-1">
              Achieve More
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="flex items-center space-x-1 text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-all duration-300 hover:scale-110 text-sm font-medium"
            >
              <FiArrowUp />
              <span>Back to Top</span>
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href="mailto:daniel@waitworks.com"
              className="flex items-center space-x-1 text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-all duration-300 hover:scale-110 text-sm font-medium"
            >
              <FiMail />
              <span>Contact</span>
            </motion.a>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Link
                to="/privacy-policy"
                className="flex items-center space-x-1 text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-all duration-300 hover:scale-110 text-sm font-medium"
              >
                <FiShield />
                <span>Privacy</span>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Link
                to="/terms-of-service"
                className="flex items-center space-x-1 text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 transition-all duration-300 hover:scale-110 text-sm font-medium"
              >
                <FiFileText />
                <span>Terms</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
