// Shared Navigation Component
function loadNavigation() {
  const navContainer = document.getElementById("nav-container");
  if (navContainer) {
    navContainer.innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-light bg-white py-3">
                <div class="container px-5">
                    <a class="navbar-brand" href="index.html"><span class="fw-bolder text-primary">Achieve More</span></a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 small fw-bolder">
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="aboutDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    About Me
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="aboutDropdown">
                                    <li><a class="dropdown-item" href="index.html">About Me</a></li>
                                    <li><a class="dropdown-item" href="resume.html">Resume</a></li>
                                    <li><a class="dropdown-item" href="projects.html">Projects</a></li>
                                    <li><a class="dropdown-item" href="contact.html">Contact</a></li>
                                </ul>
                            </li>
                            <li class="nav-item"><a class="nav-link" href="wait-works.html">Wait Works LLC</a></li>
                            <li class="nav-item"><a class="nav-link" href="wait-list.html">Wait List</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        `;
  }
}

// Load navigation when DOM is ready
document.addEventListener("DOMContentLoaded", loadNavigation);
