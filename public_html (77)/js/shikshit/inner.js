/* ==========================================================================
   SHIKSHIT INNER PAGES INTERACTIONS & MOTION
   Scoped scroll spy, section index highlighting, 3D card tilt,
   interactive mouse-drift on pastel blobs, scroll progress bar,
   and accessible scroll reveal.
   Zero disruption to existing logic, attributes, or hooks.
   ========================================================================== */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     1. Top Scroll Progress Bar
     ------------------------------------------------------------------------ */
  function initProgressBar() {
    const bar = document.getElementById('scroll-progress-bar');
    if (!bar) return;

    function updateProgress() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ------------------------------------------------------------------------
     2. Sticky Section Index Scroll-Spy & Smooth Navigation
     ------------------------------------------------------------------------ */
  function initSectionIndex() {
    const pills = document.querySelectorAll('.index-pill');
    if (!pills.length) return;

    const sectionIds = Array.from(pills)
      .map(pill => {
        const href = pill.getAttribute('href');
        return href && href.startsWith('#') ? href.substring(1) : null;
      })
      .filter(Boolean);

    const sections = sectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const activeId = entry.target.id;
            pills.forEach(function (pill) {
              const href = pill.getAttribute('href');
              if (href === '#' + activeId) {
                pill.classList.add('active');
                // Ensure active pill is scrolled into view in horizontal overflow
                pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
              } else {
                pill.classList.remove('active');
              }
            });
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      }
    );

    sections.forEach(function (sec) {
      observer.observe(sec);
    });

    // Smooth scroll on click
    pills.forEach(function (pill) {
      pill.addEventListener('click', function (e) {
        const href = pill.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.getElementById(href.substring(1));
          if (target) {
            e.preventDefault();
            const offset = 145; // account for floating navbar & sticky index
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = target.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
          }
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. Desktop 3D Tilt on Ticket Cards
     ------------------------------------------------------------------------ */
  function initCardTilt() {
    if (prefersReducedMotion || window.innerWidth < 1024) return;

    const cards = document.querySelectorAll(
      '.scholarship-card, .awareness-card, .olympiad-card, .financial-aid-card, .technical-training-card, .service-ticket, [style*="border-radius: 16px"]'
    );

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = 'perspective(900px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-6px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ------------------------------------------------------------------------
     4. Interactive Mouse-Move Parallax on Ambient Pastel Blobs (Desktop)
     ------------------------------------------------------------------------ */
  function initMouseParallaxBlobs() {
    if (prefersReducedMotion || window.innerWidth < 1024) return;

    const blob1 = document.querySelector('.products-blob-1');
    const blob2 = document.querySelector('.products-blob-2');
    const blob3 = document.querySelector('.products-blob-3');
    if (!blob1 && !blob2 && !blob3) return;

    let targetX = 0, targetY = 0;
    let curX1 = 0, curY1 = 0;
    let curX2 = 0, curY2 = 0;
    let isTicking = false;

    window.addEventListener('mousemove', function (e) {
      targetX = (e.clientX / window.innerWidth - 0.5) * 36;
      targetY = (e.clientY / window.innerHeight - 0.5) * 36;

      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(updateBlobs);
      }
    }, { passive: true });

    function updateBlobs() {
      curX1 += (targetX - curX1) * 0.06;
      curY1 += (targetY - curY1) * 0.06;
      curX2 += (-targetX - curX2) * 0.05;
      curY2 += (-targetY - curY2) * 0.05;

      if (blob1) blob1.style.transform = 'translate3d(' + curX1.toFixed(1) + 'px, ' + curY1.toFixed(1) + 'px, 0)';
      if (blob2) blob2.style.transform = 'translate3d(' + curX2.toFixed(1) + 'px, ' + curY2.toFixed(1) + 'px, 0)';
      if (blob3) blob3.style.transform = 'translate3d(' + (curX1 * 0.6).toFixed(1) + 'px, ' + (curY2 * 0.6).toFixed(1) + 'px, 0)';

      if (Math.abs(targetX - curX1) > 0.1 || Math.abs(targetY - curY1) > 0.1) {
        requestAnimationFrame(updateBlobs);
      } else {
        isTicking = false;
      }
    }
  }

  /* ------------------------------------------------------------------------
     5. Scroll-Driven Fade-Up Reveal with Stagger
     ------------------------------------------------------------------------ */
  function initScrollReveal() {
    if (prefersReducedMotion) return;

    const targets = document.querySelectorAll(
      'body.page-products section > div > div:first-child, ' +
      'body.page-products .scholarship-card, ' +
      'body.page-products .awareness-card, ' +
      'body.page-products .olympiad-card, ' +
      'body.page-products .financial-aid-card, ' +
      'body.page-products .technical-training-card, ' +
      'body.page-products [style*="border-radius: 16px"], ' +
      'body.page-products .video-item, ' +
      'body.page-products .products-cta-card'
    );

    if (!targets.length) return;

    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    targets.forEach(function (el, idx) {
      el.classList.add('scroll-reveal-item');
      // Subtle stagger delay based on position
      const delay = (idx % 4) * 0.08;
      el.style.transitionDelay = delay + 's';
      revealObserver.observe(el);
    });
  }

  /* ------------------------------------------------------------------------
     Initialize on DOM Ready
     ------------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    initProgressBar();
    initSectionIndex();
    initCardTilt();
    initMouseParallaxBlobs();
    initScrollReveal();
  });
})();
