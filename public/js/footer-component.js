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
          <div class="row mt-3">
            <div class="col-12">
              <div class="text-center small text-muted">
                <span class="me-3">
                  <i class="bi bi-building me-1"></i>
                  <a href="wait-works.html" class="text-decoration-none text-muted hover-primary">Wait Works LLC</a>
                </span>
                <span class="me-3">
                  <i class="bi bi-list-ul me-1"></i>
                  <a href="wait-list.html" class="text-decoration-none text-muted hover-primary">Wait List</a>
                </span>
                <span>
                  <i class="bi bi-github me-1"></i>
                  <a href="https://github.com/danielwait2" target="_blank" class="text-decoration-none text-muted hover-primary">GitHub</a>
                </span>
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
