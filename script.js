// ============================================================================
// PAGE ROUTING & CONTENT LOADING
// ============================================================================

const pages = {
  '/': 'home.html',
  '/graffiti.html': 'pages/graffiti.html',
  '/grafisk-design.html': 'pages/grafisk-design.html',
  '/kunst-og-lerret.html': 'pages/kunst-og-lerret.html',
  '/workshops.html': 'pages/workshops.html',
  '/kontakt.html': 'pages/kontakt.html'
};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  const initialPath = window.location.pathname === '' ? '/' : window.location.pathname;
  loadPage(initialPath);
  setupNavigation();
  setupMobileMenu();
});

// Load page content
async function loadPage(path) {
  // Normalize path
  let normalizedPath = path === '/' || path === '/index.html' || path === '' ? '/' : path;
  
  let page = pages[normalizedPath];
  
  if (!page) {
    // Try to find matching page
    const found = Object.entries(pages).find(([key]) => key === normalizedPath);
    page = found ? found[1] : 'index.html';
  }

  try {
    const response = await fetch(page);
    if (!response.ok) throw new Error('Page not found');
    
    const html = await response.text();
    document.getElementById('page-content').innerHTML = html;
    updateActiveNav(normalizedPath);
    // Re-initialize any animations or scripts after loading
    initializePageScripts();
  } catch (error) {
    console.error('Error loading page:', error);
    document.getElementById('page-content').innerHTML = '<section><div class="container"><h1>404 - Side ikke funnet</h1><p>Beklager, siden du ser etter eksisterer ikke.</p></div></section>';
  }
}

// Initialize navigation
function setupNavigation() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      window.history.pushState(null, '', href);
      loadPage(href);
      closeMenu();
    });
  });
}

// Setup mobile menu toggle
function setupMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
  });
}

// Close mobile menu
function closeMenu() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  toggle.classList.remove('active');
  menu.classList.remove('active');
}

// Update active nav link
function updateActiveNav(path) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if ((path === '/' && href === '/') || (path !== '/' && href === path)) {
      link.classList.add('active');
    }
  });
}

// Initialize page-specific scripts
function initializePageScripts() {
  setupContactForm();
  setupScrollAnimations();
}

// ============================================================================
// CONTACT FORM
// ============================================================================

function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = form.querySelector('input[name="name"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const message = form.querySelector('textarea[name="message"]').value;

    // Simulate form submission
    console.log('Form submitted:', { name, email, message });
    
    // Show success message
    const successMsg = document.getElementById('form-success');
    if (successMsg) {
      successMsg.classList.add('show');
      form.style.display = 'none';
      
      // Reset after 5 seconds
      setTimeout(() => {
        form.reset();
        form.style.display = 'block';
        successMsg.classList.remove('show');
      }, 5000);
    }
  });
}

// ============================================================================
// SCROLL ANIMATIONS
// ============================================================================

function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'slideUp 0.8s ease-out forwards';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// Handle back/forward navigation
window.addEventListener('popstate', () => {
  loadPage(window.location.pathname);
});

// Add animation helper
function addScrollAnimation(selector) {
  document.querySelectorAll(selector).forEach(el => {
    el.classList.add('animate-on-scroll');
  });
}
