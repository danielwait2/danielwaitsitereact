// Analytics tracking utility
let sessionId = null;
let lastPage = null;
let pageLoadTime = Date.now();

// Generate or retrieve session ID
function getSessionId() {
  if (!sessionId) {
    sessionId = sessionStorage.getItem('sessionId') || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
}

// Track page view
export function trackPageView(page) {
  const timeOnPreviousPage = lastPage ? Date.now() - pageLoadTime : null;
  pageLoadTime = Date.now();

  const analyticsData = {
    page: page,
    sessionId: getSessionId(),
    referrer: document.referrer || '',
    userAgent: navigator.userAgent,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    timestamp: new Date().toISOString(),
    timeOnPreviousPage: timeOnPreviousPage
  };

  // Send to backend (non-blocking)
  // Use fetch with credentials for cookie support
  fetch('/api/analytics/pageview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include', // Include cookies
    body: JSON.stringify(analyticsData)
  }).catch(error => {
    console.log('Analytics tracking failed:', error);
  });

  lastPage = page;
}

// Initialize analytics on page load
export function initAnalytics() {
  // Track initial page load
  trackPageView(window.location.pathname);

  // Track route changes (for React Router)
  window.addEventListener('popstate', () => {
    trackPageView(window.location.pathname);
  });
}

