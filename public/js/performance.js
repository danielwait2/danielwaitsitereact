// Performance Optimization Script
(function() {
  'use strict';
  
  // Performance monitoring
  function monitorPerformance() {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
        
        // Send to analytics if needed
        if (window.gtag) {
          gtag('event', 'LCP', {
            value: Math.round(lastEntry.startTime),
            event_category: 'Web Vitals'
          });
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      
      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.log('FID:', entry.processingStart - entry.startTime);
          
          if (window.gtag) {
            gtag('event', 'FID', {
              value: Math.round(entry.processingStart - entry.startTime),
              event_category: 'Web Vitals'
            });
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      
      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            console.log('CLS:', clsValue);
            
            if (window.gtag) {
              gtag('event', 'CLS', {
                value: Math.round(clsValue * 1000) / 1000,
                event_category: 'Web Vitals'
              });
            }
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }
  
  // Image optimization
  function optimizeImages() {
    // Lazy load images
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    }
    
    // Add loading="lazy" to images that don't have it
    document.querySelectorAll('img:not([loading])').forEach(img => {
      if (!img.classList.contains('critical')) {
        img.loading = 'lazy';
      }
    });
  }
  
  // Font optimization
  function optimizeFonts() {
    // Preload critical fonts
    const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
    fontLinks.forEach(link => {
      link.setAttribute('rel', 'preload');
      link.setAttribute('as', 'font');
      link.setAttribute('type', 'font/woff2');
      link.setAttribute('crossorigin', 'anonymous');
    });
    
    // Font display swap for better performance
    const fontFaceObserver = new FontFaceObserver('Plus Jakarta Sans');
    fontFaceObserver.load().then(() => {
      document.documentElement.classList.add('fonts-loaded');
    }).catch(() => {
      // Font failed to load, use fallback
      document.documentElement.classList.add('fonts-failed');
    });
  }
  
  // Resource hints
  function addResourceHints() {
    // Preconnect to external domains
    const domains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdn.jsdelivr.net'
    ];
    
    domains.forEach(domain => {
      if (!document.querySelector(`link[href="${domain}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    });
  }
  
  // Critical CSS inline
  function inlineCriticalCSS() {
    // Add critical CSS for above-the-fold content
    const criticalCSS = `
      .navbar { display: flex !important; }
      .display-3 { font-size: 3rem !important; }
      .btn { display: inline-block !important; }
      .profile-img { max-width: 100% !important; height: auto !important; }
    `;
    
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    style.setAttribute('data-critical', 'true');
    document.head.insertBefore(style, document.head.firstChild);
  }
  
  // Service Worker registration for caching
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }
  
  // Initialize performance optimizations
  function initPerformance() {
    monitorPerformance();
    optimizeImages();
    optimizeFonts();
    addResourceHints();
    inlineCriticalCSS();
    registerServiceWorker();
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerformance);
  } else {
    initPerformance();
  }
  
  // Public API
  window.Performance = {
    init: initPerformance,
    monitor: monitorPerformance,
    optimizeImages: optimizeImages
  };
})();
