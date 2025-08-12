// Cookie Banner and Consent Management
(function() {
  'use strict';
  
  // Cookie banner configuration
  const COOKIE_BANNER_CONFIG = {
    bannerId: 'cookie-banner',
    consentKey: 'cookie-consent',
    analyticsKey: 'analytics-consent',
    bannerHTML: `
      <div id="cookie-banner" class="cookie-banner" style="display: none;">
        <div class="cookie-banner-content">
          <div class="cookie-banner-text">
            <h5 class="mb-2">🍪 We use cookies to improve your experience</h5>
            <p class="mb-3">
              We use cookies and similar technologies to analyze site usage, personalize content, 
              and provide you with the best possible experience. By clicking "Accept All", you consent 
              to our use of cookies for analytics and site functionality.
            </p>
            <p class="mb-0 small text-muted">
              For more information, see our <a href="/privacy-policy.html" class="text-decoration-none">Privacy Policy</a>.
            </p>
          </div>
          <div class="cookie-banner-buttons">
            <button id="cookie-accept-all" class="btn btn-primary btn-sm me-2">
              Accept All
            </button>
            <button id="cookie-accept-essential" class="btn btn-outline-secondary btn-sm me-2">
              Essential Only
            </button>
            <button id="cookie-customize" class="btn btn-outline-secondary btn-sm">
              Customize
            </button>
          </div>
        </div>
        
        <!-- Cookie Preferences Modal -->
        <div id="cookie-preferences-modal" class="cookie-modal" style="display: none;">
          <div class="cookie-modal-content">
            <div class="cookie-modal-header">
              <h4>Cookie Preferences</h4>
              <button id="cookie-modal-close" class="btn-close" aria-label="Close"></button>
            </div>
            <div class="cookie-modal-body">
              <div class="cookie-category mb-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <h6 class="mb-0">Essential Cookies</h6>
                  <span class="badge bg-success">Always Active</span>
                </div>
                <p class="text-muted small mb-0">
                  These cookies are necessary for the website to function properly. They include 
                  admin authentication and basic site functionality.
                </p>
              </div>
              
              <div class="cookie-category mb-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <h6 class="mb-0">Analytics Cookies</h6>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="analytics-toggle" checked>
                    <label class="form-check-label" for="analytics-toggle"></label>
                  </div>
                </div>
                <p class="text-muted small mb-0">
                  These cookies help us understand how visitors interact with our website by 
                  collecting anonymous information about page views, sessions, and user behavior.
                </p>
              </div>
              
              <div class="cookie-category mb-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <h6 class="mb-0">Preference Cookies</h6>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="preference-toggle" checked>
                    <label class="form-check-label" for="preference-toggle"></label>
                  </div>
                </div>
                <p class="text-muted small mb-0">
                  These cookies remember your preferences, such as light/dark mode settings, 
                  to provide a personalized experience.
                </p>
              </div>
            </div>
            <div class="cookie-modal-footer">
              <button id="cookie-save-preferences" class="btn btn-primary">
                Save Preferences
              </button>
              <button id="cookie-modal-cancel" class="btn btn-outline-secondary ms-2">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    styles: `
      <style>
        .cookie-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--bg-color, white);
          border-top: 1px solid var(--border-color, #e0e0e0);
          box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
          z-index: 9999;
          padding: 1rem;
        }
        
        .cookie-banner-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        
        .cookie-banner-text {
          flex: 1;
        }
        
        .cookie-banner-buttons {
          display: flex;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        
        .cookie-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        
        .cookie-modal-content {
          background: var(--bg-color, white);
          border-radius: 8px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        
        .cookie-modal-header {
          padding: 1.5rem 1.5rem 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .cookie-modal-body {
          padding: 1rem 1.5rem;
        }
        
        .cookie-modal-footer {
          padding: 0 1.5rem 1.5rem;
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }
        
        .cookie-category {
          padding: 1rem;
          border: 1px solid var(--border-color, #e0e0e0);
          border-radius: 6px;
        }
        
        @media (max-width: 768px) {
          .cookie-banner-content {
            flex-direction: column;
            text-align: center;
          }
          
          .cookie-banner-buttons {
            justify-content: center;
            flex-wrap: wrap;
          }
          
          .cookie-modal-content {
            margin: 1rem;
          }
        }
      </style>
    `
  };
  
  // Cookie management functions
  function setCookie(name, value, days = 365) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }
  
  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  
  function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
  
  // Analytics control
  function enableAnalytics() {
    localStorage.setItem(COOKIE_BANNER_CONFIG.analyticsKey, 'true');
    // Analytics script will check this value
  }
  
  function disableAnalytics() {
    localStorage.setItem(COOKIE_BANNER_CONFIG.analyticsKey, 'false');
    // Clear existing analytics data
    localStorage.removeItem('sessionId');
  }
  
  // Banner management
  function showBanner() {
    const banner = document.getElementById(COOKIE_BANNER_CONFIG.bannerId);
    if (banner) {
      banner.style.display = 'block';
    }
  }
  
  function hideBanner() {
    const banner = document.getElementById(COOKIE_BANNER_CONFIG.bannerId);
    if (banner) {
      banner.style.display = 'none';
    }
  }
  
  function showPreferencesModal() {
    const modal = document.getElementById('cookie-preferences-modal');
    if (modal) {
      modal.style.display = 'flex';
      
      // Set current preferences
      const analyticsConsent = localStorage.getItem(COOKIE_BANNER_CONFIG.analyticsKey) !== 'false';
      const preferenceConsent = localStorage.getItem('preference-consent') !== 'false';
      
      document.getElementById('analytics-toggle').checked = analyticsConsent;
      document.getElementById('preference-toggle').checked = preferenceConsent;
    }
  }
  
  function hidePreferencesModal() {
    const modal = document.getElementById('cookie-preferences-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
  
  // Event handlers
  function handleAcceptAll() {
    setCookie(COOKIE_BANNER_CONFIG.consentKey, 'all', 365);
    localStorage.setItem('preference-consent', 'true');
    enableAnalytics();
    hideBanner();
  }
  
  function handleEssentialOnly() {
    setCookie(COOKIE_BANNER_CONFIG.consentKey, 'essential', 365);
    localStorage.setItem('preference-consent', 'false');
    disableAnalytics();
    hideBanner();
  }
  
  function handleSavePreferences() {
    const analyticsEnabled = document.getElementById('analytics-toggle').checked;
    const preferencesEnabled = document.getElementById('preference-toggle').checked;
    
    setCookie(COOKIE_BANNER_CONFIG.consentKey, 'custom', 365);
    localStorage.setItem('preference-consent', preferencesEnabled.toString());
    
    if (analyticsEnabled) {
      enableAnalytics();
    } else {
      disableAnalytics();
    }
    
    hidePreferencesModal();
    hideBanner();
  }
  
  // Initialize cookie banner
  function initCookieBanner() {
    // Add styles to head
    if (!document.getElementById('cookie-banner-styles')) {
      const styleElement = document.createElement('div');
      styleElement.id = 'cookie-banner-styles';
      styleElement.innerHTML = COOKIE_BANNER_CONFIG.styles;
      document.head.appendChild(styleElement);
    }
    
    // Add banner to body
    if (!document.getElementById(COOKIE_BANNER_CONFIG.bannerId)) {
      document.body.insertAdjacentHTML('beforeend', COOKIE_BANNER_CONFIG.bannerHTML);
    }
    
    // Add event listeners
    document.getElementById('cookie-accept-all')?.addEventListener('click', handleAcceptAll);
    document.getElementById('cookie-accept-essential')?.addEventListener('click', handleEssentialOnly);
    document.getElementById('cookie-customize')?.addEventListener('click', showPreferencesModal);
    document.getElementById('cookie-save-preferences')?.addEventListener('click', handleSavePreferences);
    document.getElementById('cookie-modal-close')?.addEventListener('click', hidePreferencesModal);
    document.getElementById('cookie-modal-cancel')?.addEventListener('click', hidePreferencesModal);
    
    // Close modal when clicking outside
    document.getElementById('cookie-preferences-modal')?.addEventListener('click', function(e) {
      if (e.target === this) {
        hidePreferencesModal();
      }
    });
    
    // Check if consent already given
    const consent = getCookie(COOKIE_BANNER_CONFIG.consentKey);
    if (!consent) {
      showBanner();
    }
  }
  
  // Public API
  window.CookieBanner = {
    init: initCookieBanner,
    showBanner: showBanner,
    hideBanner: hideBanner,
    enableAnalytics: enableAnalytics,
    disableAnalytics: disableAnalytics,
    getConsent: () => getCookie(COOKIE_BANNER_CONFIG.consentKey),
    hasAnalyticsConsent: () => localStorage.getItem(COOKIE_BANNER_CONFIG.analyticsKey) !== 'false'
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieBanner);
  } else {
    initCookieBanner();
  }
})();
