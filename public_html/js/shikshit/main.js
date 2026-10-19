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
     5. Creative Hero Interactions (Spotlight, Parallax, and Polaroid Drag)
     ------------------------------------------------------------------------ */
  function initCreativeHero() {
    const hero = document.getElementById('hero-section') || document.querySelector('.hero');
    if (!hero) return;

    const pcs = Array.from(hero.querySelectorAll('.pc'));
    const ips = hero.querySelectorAll('.ip img');
    let hint = hero.querySelector('.hint') || document.getElementById('hint');

    // Pointermove dynamic spotlight and subtle parallax
    hero.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      const r = hero.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      hero.style.setProperty('--mx', x + 'px');
      hero.style.setProperty('--my', y + 'px');

      if (prefersReducedMotion || window.innerWidth <= 1080) return;
      const nx = (x / r.width) - 0.5;
      const ny = (y / r.height) - 0.5;

      pcs.forEach(function (p) {
        if (p.classList.contains('drag')) return;
        const k = parseFloat(p.dataset.d) || 16;
        const inner = p.firstElementChild;
        if (inner) {
          inner.style.transform = 'translate3d(' + (-nx * k) + 'px, ' + (-ny * k) + 'px, 0)';
        }
      });

      ips.forEach(function (img, idx) {
        const factor = idx ? -8 : 8;
        img.style.transform = 'scale(1.06) translate(' + (nx * factor) + 'px, ' + (ny * 4) + 'px)';
      });
    });

    // Draggable Polaroids with pointer capture and smooth translate
    pcs.forEach(function (pc) {
      let sx = 0, sy = 0, bx = 0, by = 0, dragging = false;

      pc.addEventListener('pointerdown', function (e) {
        if (window.innerWidth <= 1080 || e.button > 0) return;
        dragging = true;
        sx = e.clientX;
        sy = e.clientY;
        pc.setPointerCapture(e.pointerId);
        pc.classList.add('drag');

        if (hint) {
          hint.remove();
          hint = null;
        }
      });

      pc.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        const dx = bx + e.clientX - sx;
        const dy = by + e.clientY - sy;
        pc.style.transform = 'translate3d(' + dx + 'px, ' + dy + 'px, 0) rotate(var(--r))';
      });

      function endDrag(e) {
        if (!dragging) return;
        dragging = false;
        bx += e.clientX - sx;
        by += e.clientY - sy;
        pc.classList.remove('drag');
      }

      pc.addEventListener('pointerup', endDrag);
      pc.addEventListener('pointercancel', endDrag);
    });
  }

  /* ------------------------------------------------------------------------
     Initialize on DOM Ready
     ------------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    initCounters();
    initScrollReveal();
    initCreativeHero();
  });
})();
