/* ============================================================
   SHINING CAREER — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Footer Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Smooth scroll for all anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navbarHeight = document.getElementById('navbar').offsetHeight;
        const top = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
        closeMobileMenu();
      }
    });
  });

  /* ---------- Navbar scroll shadow ---------- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
      navbar.style.boxShadow = '0 2px 16px rgba(0,0,0,.10)';
    } else {
      navbar.style.boxShadow = '0 1px 3px rgba(0,0,0,.08)';
    }
  }, { passive: true });

  /* ---------- Mobile Menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    if (mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-label', 'Open menu');
    }
  }

  hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  // Close mobile menu on outside click
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target)) {
      closeMobileMenu();
    }
  });

  /* ---------- Scroll Reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  // Immediately reveal elements already in view (above the fold)
  revealEls.forEach(function (el) {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('revealed');
    }
  });

  /* ---------- FAQ Accordion ---------- */
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(function (header) {
    header.addEventListener('click', function () {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      const body = this.nextElementSibling;

      // Close all open items
      accordionHeaders.forEach(function (h) {
        h.setAttribute('aria-expanded', 'false');
        const b = h.nextElementSibling;
        b.style.maxHeight = null;
        b.classList.remove('open');
      });

      // Open the clicked one if it was closed
      if (!isExpanded) {
        this.setAttribute('aria-expanded', 'true');
        body.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Contact Form ---------- */
  const applyForm = document.getElementById('applyForm');
  const formSuccess = document.getElementById('formSuccess');

  if (applyForm) {
    applyForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      const name   = document.getElementById('name').value.trim();
      const phone  = document.getElementById('phone').value.trim();
      const course = document.getElementById('course').value;

      if (!name) {
        showFieldError('name', 'Please enter your full name.');
        return;
      }
      if (!phone) {
        showFieldError('phone', 'Please enter your phone number.');
        return;
      }
      if (!course) {
        showFieldError('course', 'Please select a course.');
        return;
      }

      // Animate submission
      const submitBtn = applyForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;

      setTimeout(function () {
        applyForm.style.display = 'none';
        formSuccess.style.display = 'flex';
        formSuccess.style.flexDirection = 'column';
      }, 600);
    });

    // Clear errors on input
    applyForm.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        clearFieldError(this.id);
      });
    });
  }

  function showFieldError(fieldId, message) {
    clearFieldError(fieldId);
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.style.borderColor = '#e11d48';
    field.style.boxShadow = '0 0 0 3px rgba(225,29,72,.12)';

    const error = document.createElement('span');
    error.className = 'field-error';
    error.id = fieldId + '-error';
    error.textContent = message;
    error.style.cssText = 'color:#e11d48;font-size:0.8rem;margin-top:4px;display:block;';
    field.parentNode.appendChild(error);
    field.focus();
  }

  function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.style.borderColor = '';
    field.style.boxShadow = '';
    const error = document.getElementById(fieldId + '-error');
    if (error) error.remove();
  }

  /* ---------- Active nav link highlight on scroll ---------- */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    let currentId = '';
    const navbarHeight = navbar.offsetHeight;

    sections.forEach(function (section) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= navbarHeight + 60 && rect.bottom > navbarHeight + 60) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === '#' + currentId) {
        link.style.color = 'var(--primary)';
        link.style.fontWeight = '600';
      } else {
        link.style.color = '';
        link.style.fontWeight = '';
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ---------- Hero image load animation ---------- */
  document.querySelectorAll('.hero__image-wrap img, .about__image-wrap img').forEach(function (img) {
    img.style.transition = 'opacity 0.6s ease';
    if (!img.complete) {
      img.style.opacity = '0';
      img.addEventListener('load', function () {
        this.style.opacity = '1';
      });
    }
  });

});
