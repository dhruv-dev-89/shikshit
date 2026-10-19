/* ==========================================================================
   SHIKSHIT EDITORIAL INTERACTIONS & MOTION
   Subtle micro-animations, scroll progress, counter count-up,
   desktop 3D tilt, and accessible mobile menu.
   Zero disruption to existing logic, attributes, or hooks.
   ========================================================================== */

(function () {
  'use strict';

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     1. Scroll Progress Bar & Sticky Header
     ------------------------------------------------------------------------ */
  const progressBar = document.getElementById('scroll-progress-bar');
  const header = document.querySelector('.shikshit-header');

  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (progressBar && scrollHeight > 0) {
      const progress = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = progress + '%';
    }

    if (header) {
      if (scrollTop > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ------------------------------------------------------------------------
     2. Global Mobile Menu Toggle (Preserving existing toggleMobileMenu())
     ------------------------------------------------------------------------ */
  function toggleMobileMenu(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const mobileMenu = document.getElementById('mobileMenu');
    const toggleButton = document.querySelector('.mobile-menu-toggle');

    if (!mobileMenu) return;

    const isActive = mobileMenu.classList.contains('active');
    if (isActive) {
      mobileMenu.classList.remove('active');
      if (toggleButton) toggleButton.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      mobileMenu.classList.add('active');
      if (toggleButton) toggleButton.classList.add('active');
    }
  }

  window.toggleMobileMenu = toggleMobileMenu;

  // Close mobile menu on click outside
  document.addEventListener('click', function (e) {
    const mobileMenu = document.getElementById('mobileMenu');
    const toggleButton = document.querySelector('.mobile-menu-toggle');
    if (mobileMenu && mobileMenu.classList.contains('active')) {
      if (!mobileMenu.contains(e.target) && !toggleButton.contains(e.target)) {
        mobileMenu.classList.remove('active');
        if (toggleButton) toggleButton.classList.remove('active');
      }
    }
  });

  /* ------------------------------------------------------------------------
     3. Animated Stat Counters (Count up once when scrolled into view)
     ------------------------------------------------------------------------ */
  function initCounters() {
    if (prefersReducedMotion) return;

    const counterElements = document.querySelectorAll('[data-counter-target]');
    if (!counterElements.length) return;

    const counterObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-counter-target'));
          const prefix = el.getAttribute('data-counter-prefix') || '';
          const suffix = el.getAttribute('data-counter-suffix') || '';
          const isDecimal = target % 1 !== 0;
          const duration = 1600;
          const startTime = performance.now();

          function updateNum(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);
            const current = target * ease;

            if (isDecimal) {
              el.textContent = prefix + current.toFixed(1) + suffix;
            } else {
              el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
            }

            if (progress < 1) {
              requestAnimationFrame(updateNum);
            } else {
              el.textContent = prefix + (isDecimal ? target.toFixed(1) : target.toLocaleString()) + suffix;
            }
          }

          requestAnimationFrame(updateNum);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.35 });

    counterElements.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ------------------------------------------------------------------------
     4. Scroll Fade-Up Observer with Stagger
     ------------------------------------------------------------------------ */
  function initScrollReveal() {
    if (prefersReducedMotion) return;

    const revealElements = document.querySelectorAll('.editorial-reveal');
    if (!revealElements.length) return;

    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ------------------------------------------------------------------------
     5. Desktop 3D Tilt on Hero Photo Composition
     ------------------------------------------------------------------------ */
  function initHeroTilt() {
    if (prefersReducedMotion || window.innerWidth < 1024) return;

    const heroComp = document.querySelector('.hero-composition');
    if (!heroComp) return;

    heroComp.addEventListener('mousemove', function (e) {
      const rect = heroComp.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6; // Max 6 deg
      const rotateY = ((x - centerX) / centerX) * 6;

      heroComp.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
    });

    heroComp.addEventListener('mouseleave', function () {
      heroComp.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      heroComp.style.transition = 'transform 0.5s ease';
    });

    heroComp.addEventListener('mouseenter', function () {
      heroComp.style.transition = 'none';
    });
  }

  /* ------------------------------------------------------------------------
     Initialize on DOM Ready
     ------------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    initCounters();
    initScrollReveal();
    initHeroTilt();
  });
})();
