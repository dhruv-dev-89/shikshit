/**
 * Shikshit Portal Main JavaScript
 * Handles navigation, mobile drawer, counter animations, FAQ accordion, and component loading.
 */

document.addEventListener('DOMContentLoaded', function () {
  // 1. Sticky Header Shadow on Scroll
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Mobile Menu Toggle
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobileMenu');

  function toggleMenu(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!mobileMenu) return;
    const isActive = mobileMenu.classList.contains('active');
    if (isActive) {
      mobileMenu.classList.remove('active');
      if (toggleBtn) {
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    } else {
      mobileMenu.classList.add('active');
      if (toggleBtn) {
        toggleBtn.classList.add('active');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleMenu);
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', function (e) {
    if (mobileMenu && mobileMenu.classList.contains('active')) {
      if (!mobileMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        mobileMenu.classList.remove('active');
        if (toggleBtn) {
          toggleBtn.classList.remove('active');
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      }
    }
  });

  // Make available globally for backward compatibility
  window.toggleMobileMenu = toggleMenu;

  // 3. Animated Number Counters
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if ('IntersectionObserver' in window && counters.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10) || 0;
          const suffix = el.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 1800;
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = Math.ceil(target / steps);

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              count = target;
              clearInterval(timer);
            }
            el.textContent = count.toLocaleString('en-IN') + suffix;
          }, stepTime);

          obs.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    counters.forEach(counter => observer.observe(counter));
  }

  // 4. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question && answer) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close other items
        faqItems.forEach(other => {
          if (other !== item && other.classList.contains('active')) {
            other.classList.remove('active');
            const otherAnswer = other.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
            const otherBtn = other.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current
        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
          question.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          question.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // 5. Component Loader for Footer (Robust fetch with error handling)
  const footerContainers = document.querySelectorAll('[include-html]');
  footerContainers.forEach(container => {
    const file = container.getAttribute('include-html');
    if (file) {
      fetch(file)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.text();
        })
        .then(html => {
          container.innerHTML = html;
          container.removeAttribute('include-html');
        })
        .catch(err => {
          console.warn(`Could not fetch ${file}, using inline fallback`, err);
        });
    }
  });

  // 6. Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(link => {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile drawer if open
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          if (toggleBtn) toggleBtn.classList.remove('active');
        }
      }
    });
  });

  // 7. Creative Hero Interactions (Spotlight, Parallax, and Polaroid Drag)
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

      if (window.innerWidth <= 1080) return;
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

  initCreativeHero();
});
