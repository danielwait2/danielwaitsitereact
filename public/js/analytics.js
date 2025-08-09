// Simplified Site Analytics Tracking
(function() {
  'use strict';
  
  // Generate or get session ID
  function getSessionId() {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }
  
  // Analytics tracking state
  let sessionId = getSessionId();
  let lastPageLoadTime = Date.now();
  let currentPage = window.location.pathname;
  
  // Track page view
  function trackPageView() {
    const timeOnPreviousPage = (Date.now() - lastPageLoadTime) / 1000;
    lastPageLoadTime = Date.now();
    
    const data = {
      page: currentPage,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      timestamp: new Date().toISOString(),
      sessionId: sessionId,
      timeOnPreviousPage: timeOnPreviousPage
    };
    
    // Send to API
    fetch('https://danielwaitwebsite.danielwait1216.workers.dev/api/track-pageview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }).catch(error => {
      console.warn('Analytics tracking failed:', error);
    });
  }
  
  // Initialize tracking
  function initAnalytics() {
    // Track initial page view
    trackPageView();
    
    // Track page navigation for SPA-like behavior
    window.addEventListener('popstate', () => {
      currentPage = window.location.pathname;
      trackPageView();
    });
    
    // Track final page view on page unload
    window.addEventListener('beforeunload', () => {
      trackPageView();
    });
  }
  
  // Start analytics when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalytics);
  } else {
    initAnalytics();
  }
})();
