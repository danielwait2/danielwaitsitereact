import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api'  // In production, API is served from same domain
    : '/api',  // In development, proxy handles this (see package.json)
  withCredentials: true, // Include cookies for authentication
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login if needed
      if (window.location.pathname !== '/admin-login') {
        // Only redirect if not already on login page
        // window.location.href = '/admin-login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;



