/**
 * Shikshit Careers Page - Motion & Interactive Experience
 * Handles word-by-word reveal triggers, mouse parallax, card spotlight,
 * copy-email micro-interaction, and accessible reduced-motion support.
 */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     1. Interactive Card Ambient Spotlight & Parallax
     ------------------------------------------------------------------------ */
  function initCardSpotlight() {
    const card = document.getElementById('careerCard');
    if (!card) return;

    card.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--card-mouse-x', x + 'px');
      card.style.setProperty('--card-mouse-y', y + 'px');
    });
  }

  /* ------------------------------------------------------------------------
     2. Ambient Background Blobs Parallax (Desktop Only)
     ------------------------------------------------------------------------ */
  function initAmbientParallax() {
    if (prefersReducedMotion) return;

    const blob1 = document.getElementById('blob1');
    const blob2 = document.getElementById('blob2');
    const blob3 = document.getElementById('blob3');
    const blob4 = document.getElementById('blob4');

    if (!blob1 && !blob2) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isTicking = false;

    window.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch' || window.innerWidth < 992) return;
      // Calculate normalized mouse coords (-0.5 to 0.5)
      targetX = (e.clientX / window.innerWidth) - 0.5;
      targetY = (e.clientY / window.innerHeight) - 0.5;

      if (!isTicking) {
        requestAnimationFrame(updateParallax);
        isTicking = true;
      }
    }, { passive: true });

    function updateParallax() {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      const px1 = currentX * 35;
      const py1 = currentY * 30;
      const px2 = -currentX * 45;
      const py2 = -currentY * 35;
      const px3 = currentX * 25;
      const py3 = currentY * 20;

      if (blob1) blob1.style.transform = `translate3d(${px1}px, ${py1}px, 0)`;
      if (blob2) blob2.style.transform = `translate3d(${px2}px, ${py2}px, 0)`;
      if (blob3) blob3.style.transform = `translate3d(${px3}px, ${py3}px, 0)`;
      if (blob4) blob4.style.transform = `translate(-50%, -50%) translate3d(${px1 * 0.5}px, ${py1 * 0.5}px, 0)`;

      if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
        requestAnimationFrame(updateParallax);
      } else {
        isTicking = false;
      }
    }
  }

  /* ------------------------------------------------------------------------
     3. Scroll Observer to Ensure Animations Fire Cleanly
     ------------------------------------------------------------------------ */
  function initScrollTriggers() {
    if (prefersReducedMotion) return;

    const card = document.getElementById('careerCard');
    if (!card) return;

    // If card is already in viewport, let the CSS entrance animation run
    // Otherwise, ensure it triggers smoothly when scrolled into view
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    observer.observe(card);
  }

  /* ------------------------------------------------------------------------
     Initialize on DOM Ready
     ------------------------------------------------------------------------ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  function initAll() {
    initCardSpotlight();
    initAmbientParallax();
    initScrollTriggers();
  }
})();
