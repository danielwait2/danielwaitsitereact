import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLink2, FiEdit, FiTrash2, FiPlus, FiX, FiLogOut, FiBarChart2, FiTrendingUp } from 'react-icons/fi';
import api from '../utils/api';
import toast from 'react-hot-toast';

function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('links');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: ''
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authenticated && activeTab === 'links') {
      loadLinks();
    } else if (authenticated && (activeTab === 'link-analytics' || activeTab === 'site-analytics')) {
      loadAnalytics();
    }
  }, [authenticated, activeTab]);

  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/check');
      if (response.data.authenticated) {
        setAuthenticated(true);
      } else {
        navigate('/admin-login');
      }
    } catch (error) {
      navigate('/admin-login');
    } finally {
      setLoading(false);
    }
  };

  const loadLinks = async () => {
    try {
      const response = await api.get('/links');
      setLinks(response.data);
    } catch (error) {
      console.error('Error loading links:', error);
      toast.error('Failed to load links');
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await api.get('/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLink) {
        await api.put(`/links/${editingLink.id}`, formData);
        toast.success('Link updated successfully!');
      } else {
        await api.post('/links', formData);
        toast.success('Link added successfully!');
      }
      setFormData({ title: '', url: '', description: '' });
      setEditingLink(null);
      setShowEditModal(false);
      if (activeTab === 'links') {
        loadLinks();
      }
    } catch (error) {
      toast.error('Error saving link: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingLink(null);
    setFormData({ title: '', url: '', description: '' });
  };

  const handleEdit = (link) => {
    setEditingLink(link);
    setFormData({
      title: link.title,
      url: link.url,
      description: link.description || ''
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      try {
        await api.delete(`/links/${id}`);
        toast.success('Link deleted successfully!');
        loadLinks();
      } catch (error) {
        toast.error('Error deleting link: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      navigate('/admin-login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  const tabs = [
    { id: 'links', label: 'Manage Links', icon: FiLink2 },
    { id: 'link-analytics', label: 'Link Analytics', icon: FiBarChart2 },
    { id: 'site-analytics', label: 'Site Analytics', icon: FiTrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 gradient-text">Admin Panel</h1>
              <p className="text-gray-600 dark:text-gray-400">Wait List Management - Full CRUD Operations</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="mt-4 md:mt-0 px-6 py-3 rounded-xl border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center space-x-2"
            >
              <FiLogOut />
              <span>Logout</span>
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-semibold flex items-center space-x-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'links' && (
            <motion.div
              key="links"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Stats */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="card-modern p-6 text-center">
                  <div className="text-4xl font-bold gradient-text mb-2">{links.length}</div>
                  <div className="text-gray-600 dark:text-gray-400">Total Links</div>
                </div>
                <div className="card-modern p-6 text-center">
                  <div className="text-4xl font-bold gradient-text mb-2">
                    {links.filter(link => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(link.date_added) > weekAgo;
                    }).length}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Added This Week</div>
                </div>
              </div>

              {/* Add Link Form */}
              <div className="card-modern p-6 mb-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                  <FiPlus />
                  <span>Add New Link</span>
                </h3>
                <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      URL *
                    </label>
                    <input
                      type="text"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      required
                      placeholder="https://example.com"
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-modern flex items-center space-x-2"
                    >
                      <FiPlus />
                      <span>Add Link</span>
                    </motion.button>
                  </div>
                </form>
              </div>

              {/* Links Table */}
              <div className="card-modern overflow-hidden">
                {links.length === 0 ? (
                  <div className="text-center py-12">
                    <FiLink2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">No links yet</h4>
                    <p className="text-gray-600 dark:text-gray-400">Add your first link using the form above!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Title</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">URL</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Description</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Date Added</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {links.map(link => (
                          <tr key={link.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <td className="px-6 py-4">
                              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                {link.title}
                              </a>
                            </td>
                            <td className="px-6 py-4">
                              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                                {link.url}
                              </a>
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{link.description || '-'}</td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{new Date(link.date_added).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleEdit(link)}
                                  className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                                >
                                  <FiEdit />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDelete(link.id)}
                                  className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                                >
                                  <FiTrash2 />
                                </motion.button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'link-analytics' && (
            <motion.div
              key="link-analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {analytics && (
                <>
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="card-modern p-6 text-center">
                      <div className="text-4xl font-bold gradient-text mb-2">{analytics.totalLinkClicks || 0}</div>
                      <div className="text-gray-600 dark:text-gray-400">Total Link Clicks</div>
                    </div>
                    <div className="card-modern p-6 text-center">
                      <div className="text-4xl font-bold gradient-text mb-2">{analytics.activeLinks || 0}</div>
                      <div className="text-gray-600 dark:text-gray-400">Active Links</div>
                    </div>
                    <div className="card-modern p-6 text-center">
                      <div className="text-4xl font-bold gradient-text mb-2">{analytics.avgClicksPerLink || 0}</div>
                      <div className="text-gray-600 dark:text-gray-400">Avg Clicks per Link</div>
                    </div>
                  </div>

                  <div className="card-modern overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                        <FiBarChart2 />
                        <span>Link Click Analytics</span>
                      </h3>
                      {analytics.linkAnalytics && analytics.linkAnalytics.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                              <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Link Title</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Total Clicks</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">First Click</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Last Click</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {analytics.linkAnalytics.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                  <td className="px-6 py-4">
                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                      {item.title}
                                    </a>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">{item.clicks}</span>
                                  </td>
                                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                    {item.first_click ? new Date(item.first_click).toLocaleDateString() : 'Never'}
                                  </td>
                                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                    {item.last_click ? new Date(item.last_click).toLocaleDateString() : 'Never'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <FiBarChart2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h4 className="text-xl font-bold mb-2">No link click data yet</h4>
                          <p className="text-gray-600 dark:text-gray-400">Analytics will appear here once people start clicking on your links!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'site-analytics' && (
            <motion.div
              key="site-analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {analytics && analytics.siteStats && (
                <>
                  <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="card-modern p-6 text-center">
                      <div className="text-4xl font-bold gradient-text mb-2">{analytics.siteStats.totalPageViews || 0}</div>
                      <div className="text-gray-600 dark:text-gray-400">Total Page Views</div>
                    </div>
                    <div className="card-modern p-6 text-center">
                      <div className="text-4xl font-bold gradient-text mb-2">{analytics.siteStats.pageViewsToday || 0}</div>
                      <div className="text-gray-600 dark:text-gray-400">Views Today</div>
                    </div>
                    <div className="card-modern p-6 text-center">
                      <div className="text-4xl font-bold gradient-text mb-2">{analytics.siteStats.totalSessions || 0}</div>
                      <div className="text-gray-600 dark:text-gray-400">Total Sessions</div>
                    </div>
                    <div className="card-modern p-6 text-center">
                      <div className="text-4xl font-bold gradient-text mb-2">{analytics.siteStats.avgPagesPerSession || 0}</div>
                      <div className="text-gray-600 dark:text-gray-400">Avg Pages/Session</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="card-modern p-6">
                      <h4 className="text-xl font-bold mb-4 flex items-center space-x-2">
                        <FiTrendingUp />
                        <span>Popular Pages</span>
                      </h4>
                      {analytics.siteStats.popularPages && analytics.siteStats.popularPages.length > 0 ? (
                        <ul className="space-y-3">
                          {analytics.siteStats.popularPages.slice(0, 5).map((page, idx) => (
                            <li key={idx} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                              <span className="text-gray-700 dark:text-gray-300">{page.page}</span>
                              <strong className="text-blue-600 dark:text-blue-400">{page.views}</strong>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">No page data yet</p>
                      )}
                    </div>
                    <div className="card-modern p-6">
                      <h4 className="text-xl font-bold mb-4 flex items-center space-x-2">
                        <FiTrendingUp />
                        <span>Top Countries</span>
                      </h4>
                      {analytics.siteStats.countryStats && analytics.siteStats.countryStats.length > 0 ? (
                        <ul className="space-y-3">
                          {analytics.siteStats.countryStats.slice(0, 5).map((country, idx) => (
                            <li key={idx} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                              <span className="text-gray-700 dark:text-gray-300">{country.country}</span>
                              <strong className="text-green-600 dark:text-green-400">{country.count}</strong>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">No country data yet</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        <AnimatePresence>
          {showEditModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="card-modern p-8 max-w-md w-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold flex items-center space-x-2">
                    <FiEdit />
                    <span>{editingLink ? 'Edit' : 'Add'} Link</span>
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      URL *
                    </label>
                    <input
                      type="text"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      required
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex space-x-3 justify-end pt-4">
                    <motion.button
                      type="button"
                      onClick={handleCloseModal}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-modern"
                    >
                      {editingLink ? 'Save Changes' : 'Add Link'}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AdminPanel;
