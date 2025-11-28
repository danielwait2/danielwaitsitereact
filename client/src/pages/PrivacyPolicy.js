import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

function PrivacyPolicy() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="card-modern p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Privacy Policy</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-6 prose prose-lg dark:prose-invert max-w-none">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Information We Collect</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We collect information that you provide directly to us, such as when you contact us or use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">How We Use Your Information</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Contact Us</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:daniel@waitworks.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                  daniel@waitworks.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default PrivacyPolicy;
