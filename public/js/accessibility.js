// Accessibility Features for ADA/WCAG 2.1 AA Compliance
(function() {
  'use strict';
  
  // Accessibility configuration
  const ACCESSIBILITY_CONFIG = {
    // Focus management
    focusOutline: '2px solid #007bff',
    focusOutlineOffset: '2px',
    
    // Skip link
    skipLinkText: 'Skip to main content',
    
    // High contrast mode
    highContrastClass: 'high-contrast',
    
    // Font size controls
    fontSizeClass: 'font-size-',
    
    // Reduced motion
    reducedMotionClass: 'reduced-motion'
  };
  
  // Add skip link
  function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = ACCESSIBILITY_CONFIG.skipLinkText;
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #007bff;
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 10001;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
      this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
      this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
  
  // Add focus indicators
  function addFocusIndicators() {
    const style = document.createElement('style');
    style.textContent = `
      *:focus {
        outline: ${ACCESSIBILITY_CONFIG.focusOutline} !important;
        outline-offset: ${ACCESSIBILITY_CONFIG.focusOutlineOffset} !important;
      }
      
      .skip-link:focus {
        outline: 2px solid white !important;
        outline-offset: 2px !important;
      }
      
      /* High contrast mode */
      .high-contrast {
        filter: contrast(150%) !important;
      }
      
      .high-contrast * {
        border-color: #000 !important;
      }
      
      /* Reduced motion */
      .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      
      /* Font size controls */
      .font-size-small {
        font-size: 0.875rem !important;
      }
      
      .font-size-large {
        font-size: 1.125rem !important;
      }
      
      .font-size-xlarge {
        font-size: 1.25rem !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add accessibility toolbar
  function addAccessibilityToolbar() {
    const toolbar = document.createElement('div');
    toolbar.className = 'accessibility-toolbar';
    toolbar.setAttribute('role', 'toolbar');
    toolbar.setAttribute('aria-label', 'Accessibility options');
    toolbar.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--bg-color, white);
      border: 1px solid var(--border-color, #e0e0e0);
      border-radius: 8px;
      padding: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 10000;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      max-width: 300px;
    `;
    
    toolbar.innerHTML = `
      <button id="accessibility-toggle" class="btn btn-sm btn-outline-primary" aria-label="Toggle accessibility menu">
        <i class="bi bi-universal-access"></i>
      </button>
      <div id="accessibility-menu" class="accessibility-menu" style="display: none; width: 100%; margin-top: 10px;">
        <div class="mb-2">
          <label class="form-label small">Font Size:</label>
          <div class="btn-group btn-group-sm w-100" role="group">
            <button class="btn btn-outline-secondary" onclick="setFontSize('small')">A-</button>
            <button class="btn btn-outline-secondary" onclick="setFontSize('normal')">A</button>
            <button class="btn btn-outline-secondary" onclick="setFontSize('large')">A+</button>
          </div>
        </div>
        <div class="mb-2">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="high-contrast-toggle" onchange="toggleHighContrast()">
            <label class="form-check-label small" for="high-contrast-toggle">High Contrast</label>
          </div>
        </div>
        <div class="mb-2">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="reduced-motion-toggle" onchange="toggleReducedMotion()">
            <label class="form-check-label small" for="reduced-motion-toggle">Reduced Motion</label>
          </div>
        </div>
        <div>
          <button class="btn btn-sm btn-outline-secondary w-100" onclick="resetAccessibility()">Reset</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(toolbar);
    
    // Toggle menu
    document.getElementById('accessibility-toggle').addEventListener('click', function() {
      const menu = document.getElementById('accessibility-menu');
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });
  }
  
  // Font size controls
  window.setFontSize = function(size) {
    document.body.className = document.body.className.replace(/font-size-\w+/g, '');
    if (size !== 'normal') {
      document.body.classList.add(`font-size-${size}`);
    }
    localStorage.setItem('accessibility-font-size', size);
  };
  
  // High contrast toggle
  window.toggleHighContrast = function() {
    const enabled = document.getElementById('high-contrast-toggle').checked;
    if (enabled) {
      document.body.classList.add(ACCESSIBILITY_CONFIG.highContrastClass);
    } else {
      document.body.classList.remove(ACCESSIBILITY_CONFIG.highContrastClass);
    }
    localStorage.setItem('accessibility-high-contrast', enabled);
  };
  
  // Reduced motion toggle
  window.toggleReducedMotion = function() {
    const enabled = document.getElementById('reduced-motion-toggle').checked;
    if (enabled) {
      document.body.classList.add(ACCESSIBILITY_CONFIG.reducedMotionClass);
    } else {
      document.body.classList.remove(ACCESSIBILITY_CONFIG.reducedMotionClass);
    }
    localStorage.setItem('accessibility-reduced-motion', enabled);
  };
  
  // Reset accessibility settings
  window.resetAccessibility = function() {
    document.body.className = document.body.className.replace(/font-size-\w+/g, '');
    document.body.classList.remove(ACCESSIBILITY_CONFIG.highContrastClass);
    document.body.classList.remove(ACCESSIBILITY_CONFIG.reducedMotionClass);
    
    document.getElementById('high-contrast-toggle').checked = false;
    document.getElementById('reduced-motion-toggle').checked = false;
    
    localStorage.removeItem('accessibility-font-size');
    localStorage.removeItem('accessibility-high-contrast');
    localStorage.removeItem('accessibility-reduced-motion');
  };
  
  // Restore saved preferences
  function restorePreferences() {
    const fontSize = localStorage.getItem('accessibility-font-size');
    const highContrast = localStorage.getItem('accessibility-high-contrast') === 'true';
    const reducedMotion = localStorage.getItem('accessibility-reduced-motion') === 'true';
    
    if (fontSize && fontSize !== 'normal') {
      document.body.classList.add(`font-size-${fontSize}`);
    }
    
    if (highContrast) {
      document.body.classList.add(ACCESSIBILITY_CONFIG.highContrastClass);
      document.getElementById('high-contrast-toggle').checked = true;
    }
    
    if (reducedMotion) {
      document.body.classList.add(ACCESSIBILITY_CONFIG.reducedMotionClass);
      document.getElementById('reduced-motion-toggle').checked = true;
    }
  }
  
  // Add ARIA labels to interactive elements
  function enhanceARIA() {
    // Add main content landmark
    const main = document.querySelector('main');
    if (main && !main.id) {
      main.id = 'main-content';
    }
    
    // Enhance navigation
    const nav = document.querySelector('nav');
    if (nav && !nav.getAttribute('role')) {
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Main navigation');
    }
    
    // Enhance buttons without text
    document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(button => {
      if (!button.textContent.trim()) {
        const icon = button.querySelector('i');
        if (icon) {
          const iconClass = icon.className;
          if (iconClass.includes('bi-arrow-up')) {
            button.setAttribute('aria-label', 'Back to top');
          } else if (iconClass.includes('bi-envelope')) {
            button.setAttribute('aria-label', 'Contact');
          } else if (iconClass.includes('bi-universal-access')) {
            button.setAttribute('aria-label', 'Accessibility options');
          }
        }
      }
    });
    
    // Enhance form inputs
    document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])').forEach(input => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label && !input.getAttribute('aria-label')) {
        input.setAttribute('aria-label', label.textContent);
      }
    });
  }
  
  // Keyboard navigation enhancements
  function enhanceKeyboardNavigation() {
    // Trap focus in modals
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const modal = document.querySelector('.cookie-modal[style*="flex"]');
        if (modal) {
          const closeBtn = modal.querySelector('#cookie-modal-close, #cookie-modal-cancel');
          if (closeBtn) closeBtn.click();
        }
      }
    });
    
    // Skip to main content
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Tab' && e.shiftKey === false) {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink && document.activeElement === document.body) {
          skipLink.focus();
        }
      }
    });
  }
  
  // Initialize accessibility features
  function initAccessibility() {
    addSkipLink();
    addFocusIndicators();
    addAccessibilityToolbar();
    enhanceARIA();
    enhanceKeyboardNavigation();
    restorePreferences();
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
  
  // Public API
  window.Accessibility = {
    init: initAccessibility,
    setFontSize: window.setFontSize,
    toggleHighContrast: window.toggleHighContrast,
    toggleReducedMotion: window.toggleReducedMotion,
    reset: window.resetAccessibility
  };
})();
