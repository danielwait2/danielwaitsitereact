// Shared Footer Component
function loadFooter() {
  const footerContainer = document.getElementById("footer-container");
  if (footerContainer) {
    footerContainer.innerHTML = `
      <footer class="bg-white py-4 mt-auto border-top">
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
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
        }
        
        footer .border-top {
          border-color: rgba(0,0,0,0.1) !important;
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
