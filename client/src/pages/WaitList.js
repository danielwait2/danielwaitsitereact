import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiExternalLink, FiLink2 } from 'react-icons/fi';
import api from '../utils/api';
import toast from 'react-hot-toast';

function WaitList() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      const response = await api.get('/links');
      setLinks(response.data);
    } catch (error) {
      console.error('Error loading links:', error);
      toast.error('Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  const trackClick = async (linkId) => {
    try {
      await api.post(`/links/${linkId}/click`);
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
            Wait List
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            My thoughts and comments on the internet
          </p>
        </motion.div>

        {links.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            className="text-center py-20"
          >
            <div className="inline-block p-6 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <FiLink2 className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No links yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back soon for interesting links and resources!
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map((link, index) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="card-modern p-6 group cursor-pointer"
                onClick={() => {
                  trackClick(link.id);
                  window.open(link.url, '_blank', 'noopener,noreferrer');
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <FiExternalLink className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(link.date_added).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-purple-400 transition-colors">
                  {link.title}
                </h3>
                
                {link.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {link.description}
                  </p>
                )}
                
                <div className="flex items-center text-sm text-blue-600 dark:text-purple-400 font-medium">
                  <span>Visit Link</span>
                  <FiExternalLink className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WaitList;
