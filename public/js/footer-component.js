// Shared Footer Component
function loadFooter() {
  const footerContainer = document.getElementById("footer-container");
  if (footerContainer) {
    footerContainer.innerHTML = `
      <footer class="py-4 mt-auto border-top" style="background-color: var(--bg-color);">
        <div class="container px-5">
          <div class="row align-items-center justify-content-between flex-column flex-sm-row">
            <div class="col-auto">
              <div class="small text-muted">
                Copyright &copy; Daniel Wait 2025 <br />
                <span class="fw-bold text-primary">Achieve More</span>
              </div>
            </div>
            <div class="col-auto">
              <div class="d-flex gap-3 small">
                <a class="text-decoration-none text-muted hover-primary" href="#top">
                  <i class="bi bi-arrow-up-circle me-1"></i>Back to Top
                </a>
                <a class="text-decoration-none text-muted hover-primary" href="mailto:daniel@waitworks.com">
                  <i class="bi bi-envelope me-1"></i>Contact
                </a>
                <a class="text-decoration-none text-muted hover-primary" href="/privacy-policy.html">
                  <i class="bi bi-shield-check me-1"></i>Privacy
                </a>
              </div>
            </div>
          </div>

        </div>
      </footer>
      
      <style>
        .hover-primary:hover {
          color: var(--bs-primary) !important;
          transition: color 0.3s ease;
        }
        
        footer {
          background: var(--bg-color) !important;
          box-shadow: 0 -2px 10px var(--shadow-color);
        }
        
        footer .border-top {
          border-color: var(--border-color) !important;
        }
        
        footer a {
          transition: all 0.3s ease;
        }
        
        footer a:hover {
          transform: translateY(-1px);
        }
      </style>
    `;
  }
}

// Load footer when DOM is ready
document.addEventListener("DOMContentLoaded", loadFooter);

// Load analytics script
(function() {
  const script = document.createElement('script');
  script.src = 'js/analytics.js';
  script.async = true;
  document.head.appendChild(script);
})();

// Load cookie banner script
(function() {
  const script = document.createElement('script');
  script.src = 'js/cookie-banner.js';
  script.async = true;
  document.head.appendChild(script);
})();
