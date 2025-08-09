// Comprehensive Site Analytics Tracking
(function() {
  'use strict';
  
  // Generate or get session ID
  function getSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }
  
  // Get page name from URL
  function getPageName() {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html') return 'Home';
    if (path.includes('wait-list')) return 'Wait List';
    if (path.includes('wait-works')) return 'Wait Works';
    if (path.includes('resume')) return 'Resume';
    if (path.includes('projects')) return 'Projects';
    if (path.includes('contact')) return 'Contact';
    if (path.includes('admin')) return 'Admin';
    return path.replace('/', '').replace('.html', '') || 'Unknown';
  }
  
  // Analytics data
  const analytics = {
    sessionId: getSessionId(),
    startTime: Date.now(),
    lastPageView: null,
    scrollDepth: 0,
    clicks: 0,
    timeOnPage: 0
  };
  
  // Track page view
  function trackPageView() {
    const data = {
      page: getPageName(),
      referrer: document.referrer || '',
      userAgent: navigator.userAgent,
      screenWidth: screen.width,
      screenHeight: screen.height,
      timestamp: new Date().toISOString(),
      sessionId: analytics.sessionId,
      timeOnPreviousPage: analytics.lastPageView ? Date.now() - analytics.startTime : 0,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookiesEnabled: navigator.cookieEnabled,
      onlineStatus: navigator.onLine
    };
    
    // Send to API
    fetch('https://danielwaitwebsite.danielwait1216.workers.dev/api/track-pageview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      keepalive: true
    }).catch(error => {
      console.log('Analytics tracking failed:', error);
    });
    
    analytics.lastPageView = Date.now();
  }
  
  // Track user interactions
  function trackInteraction(type, details = {}) {
    const data = {
      sessionId: analytics.sessionId,
      page: getPageName(),
      interactionType: type,
      timestamp: new Date().toISOString(),
      details: details
    };
    
    fetch('https://danielwaitwebsite.danielwait1216.workers.dev/api/track-interaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      keepalive: true
    }).catch(error => {
      console.log('Interaction tracking failed:', error);
    });
  }
  
  // Track scroll depth
  function trackScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    const winHeight = window.innerHeight;
    const scrollPercent = Math.round((scrollTop / (docHeight - winHeight)) * 100);
    
    if (scrollPercent > analytics.scrollDepth) {
      analytics.scrollDepth = scrollPercent;
      
      // Track milestone scroll depths
      if (scrollPercent >= 25 && scrollPercent < 50 && analytics.scrollDepth < 25) {
        trackInteraction('scroll', { depth: '25%' });
      } else if (scrollPercent >= 50 && scrollPercent < 75 && analytics.scrollDepth < 50) {
        trackInteraction('scroll', { depth: '50%' });
      } else if (scrollPercent >= 75 && scrollPercent < 90 && analytics.scrollDepth < 75) {
        trackInteraction('scroll', { depth: '75%' });
      } else if (scrollPercent >= 90 && analytics.scrollDepth < 90) {
        trackInteraction('scroll', { depth: '90%' });
      }
    }
  }
  
  // Track time on page
  function trackTimeOnPage() {
    analytics.timeOnPage = Date.now() - analytics.startTime;
    
    // Track time milestones
    const seconds = Math.floor(analytics.timeOnPage / 1000);
    if (seconds === 30 || seconds === 60 || seconds === 120 || seconds === 300) {
      trackInteraction('time_on_page', { seconds: seconds });
    }
  }
  
  // Track clicks on links and buttons
  function trackClick(event) {
    analytics.clicks++;
    
    const element = event.target;
    const tagName = element.tagName.toLowerCase();
    const text = element.textContent?.trim().substring(0, 50) || '';
    const href = element.href || '';
    const className = element.className || '';
    
    trackInteraction('click', {
      element: tagName,
      text: text,
      href: href,
      className: className,
      clickCount: analytics.clicks
    });
  }
  
  // Track form submissions
  function trackFormSubmission(event) {
    const form = event.target;
    const formId = form.id || '';
    const formAction = form.action || '';
    
    trackInteraction('form_submit', {
      formId: formId,
      action: formAction
    });
  }
  
  // Track page exit
  function trackPageExit() {
    const exitData = {
      sessionId: analytics.sessionId,
      page: getPageName(),
      timeOnPage: Date.now() - analytics.startTime,
      scrollDepth: analytics.scrollDepth,
      clickCount: analytics.clicks,
      timestamp: new Date().toISOString()
    };
    
    fetch('https://danielwaitwebsite.danielwait1216.workers.dev/api/track-exit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exitData),
      keepalive: true
    }).catch(error => {
      console.log('Exit tracking failed:', error);
    });
  }
  
  // Initialize tracking
  function initAnalytics() {
    // Track initial page view
    trackPageView();
    
    // Set up event listeners
    document.addEventListener('click', trackClick, true);
    document.addEventListener('submit', trackFormSubmission, true);
    window.addEventListener('scroll', trackScroll, { passive: true });
    window.addEventListener('beforeunload', trackPageExit);
    
    // Track time on page every 10 seconds
    setInterval(trackTimeOnPage, 10000);
    
    // Track visibility changes
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        trackInteraction('page_hide', { timeOnPage: Date.now() - analytics.startTime });
      } else {
        trackInteraction('page_show', { timeOnPage: Date.now() - analytics.startTime });
      }
    });
    
    // Track page resize (mobile rotation, etc.)
    window.addEventListener('resize', function() {
      trackInteraction('page_resize', {
        newWidth: window.innerWidth,
        newHeight: window.innerHeight
      });
    });
  }
  
  // Start analytics when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalytics);
  } else {
    initAnalytics();
  }
  
  // Expose analytics object for debugging
  window.siteAnalytics = analytics;
})();
