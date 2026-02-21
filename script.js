/**
 * Project Modal Logic
 * Pure Vanilla JavaScript
 */

const modal = document.getElementById('project-modal');
const modalContent = document.getElementById('modal-content');

// Select all elements that can trigger a project modal
const triggers = document.querySelectorAll('[data-project]');
// Select backdrop and close button
const closeTargets = modal.querySelectorAll('[data-close]');

/**
 * Opens modal and populates content from template
 */
triggers.forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.project;
    const tpl = document.getElementById(id);

    if (!tpl) return;

    // Clear previous content
    modalContent.innerHTML = '';
    
    // Clone template content and append
    const content = tpl.content.cloneNode(true);
    modalContent.appendChild(content);

    // Show modal with transition
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  });
});

/**
 * Closes modal and restores UI state
 */
function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  
  // Restore scrolling after fade transition
  document.body.style.overflow = '';
}

// Attach close events to backdrop and close button
closeTargets.forEach(el => {
  el.addEventListener('click', closeModal);
});

// Close modal on Escape key press
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('is-open')) {
    closeModal();
  }
});

// Smooth scroll handling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});




/**
 * Portfolio Interactive Features
 * Implements mobile navigation, dark mode toggle, and smooth scrolling
 * Pure Vanilla JavaScript - ES6+ syntax
 */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================================================
  // 1. MOBILE NAVIGATION
  // ============================================================================

  /**
   * Manages hamburger menu toggle and mobile navigation functionality
   */
  const initMobileNavigation = () => {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Guard clause: exit if required elements don't exist
    if (!hamburgerMenu || !navMenu) return;

    /**
     * Toggle mobile menu and update accessibility attributes
     */
    const toggleMenu = () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburgerMenu.setAttribute('aria-expanded', isOpen);
    };

    /**
     * Close menu and reset accessibility state
     */
    const closeMenu = () => {
      navMenu.classList.remove('open');
      hamburgerMenu.setAttribute('aria-expanded', 'false');
    };

    // Hamburger menu click handler
    hamburgerMenu.addEventListener('click', toggleMenu);

    // Close menu when any nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerMenu.contains(e.target)) {
        closeMenu();
      }
    });

    // Close menu on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  };

  // ============================================================================
  // 2. DARK MODE / LIGHT MODE TOGGLE
  // ============================================================================

  /**
   * Manages theme switching with localStorage persistence
   */
  const initThemeToggle = () => {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Guard clause: exit if theme toggle element doesn't exist
    if (!themeToggle) return;

    /**
     * Get icon element within the theme toggle button
     */
    const getIconElement = () => {
      return themeToggle.querySelector('i');
    };

    /**
     * Load saved theme from localStorage or use system preference
     */
    const loadThemePreference = () => {
      const savedTheme = localStorage.getItem('theme-preference');
      
      if (savedTheme) {
        return savedTheme;
      }

      // Use system preference if available
      return window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
    };

    /**
     * Apply theme to DOM and update icon
     */
    const applyTheme = (theme) => {
      const icon = getIconElement();
      
      if (theme === 'light') {
        htmlElement.classList.add('light-theme');
        if (icon) {
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
        }
      } else {
        htmlElement.classList.remove('light-theme');
        if (icon) {
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-moon');
        }
      }

      // Save preference to localStorage
      localStorage.setItem('theme-preference', theme);
    };

    /**
     * Toggle between light and dark themes
     */
    const toggleTheme = () => {
      const currentTheme = htmlElement.classList.contains('light-theme') 
        ? 'light' 
        : 'dark';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
    };

    // Initialize theme on page load
    const initialTheme = loadThemePreference();
    applyTheme(initialTheme);

    // Toggle theme on button click
    themeToggle.addEventListener('click', toggleTheme);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only auto-apply if user hasn't set a preference
      if (!localStorage.getItem('theme-preference')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  };

  // ============================================================================
  // 3. SMOOTH SCROLLING & HEADER EFFECTS
  // ============================================================================

  /**
   * Manages smooth scrolling and header visual effects on scroll
   */
  const initScrollFeatures = () => {
    const header = document.querySelector('.site-header');
    const scrollThreshold = 50;

    /**
     * Handle smooth scrolling for internal anchor links
     */
    const handleSmoothScroll = () => {
      const anchorLinks = document.querySelectorAll('a[href^="#"]');

      anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          const targetElement = document.querySelector(href);

          // Only prevent default if target exists (not external)
          if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
    };

    /**
     * Apply header effects based on scroll position
     */
    const handleHeaderScroll = () => {
      if (!header) return;

      const updateHeaderStyle = () => {
        const scrollPosition = window.scrollY;

        if (scrollPosition > scrollThreshold) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      };

      // Use requestAnimationFrame for smooth, performant scrolling
      let ticking = false;

      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            updateHeaderScroll();
            ticking = false;
          });
          ticking = true;
        }
      });

      // Initial check on page load
      updateHeaderStyle();
    };

    handleSmoothScroll();
    handleHeaderScroll();
  };

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  // Initialize all features
  initMobileNavigation();
  initThemeToggle();
  initScrollFeatures();
});
