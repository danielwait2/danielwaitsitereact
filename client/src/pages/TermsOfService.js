import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

function TermsOfService() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Terms of Service</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-6 prose prose-lg dark:prose-invert max-w-none">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Acceptance of Terms</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Use License</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Permission is granted to temporarily download one copy of the materials on this website for personal, non-commercial transitory viewing only.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Contact Us</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at{' '}
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

export default TermsOfService;
