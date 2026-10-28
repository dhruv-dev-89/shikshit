/**
 * Shikshit Careers Page — Motion Polish & Micro-Interactions
 * Features:
 * - Floating background educational SVG icons with mouse parallax
 * - Card 3D tilt with dynamic cursor-following glossy highlight
 * - Magnetic pull on primary CTA button
 * - Material ripple effect on button click
 * - Typewriter micro-copy status updater with animated notification bell
 * - Respects prefers-reduced-motion and tab visibilitychange
 */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     1. Floating SVGs Mouse Parallax
     ------------------------------------------------------------------------ */
  function initFloatingParallax() {
    if (prefersReducedMotion) return;

    const floatingItems = document.querySelectorAll('.floating-item');
    if (!floatingItems.length) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isTicking = false;

    window.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch' || window.innerWidth < 768 || document.hidden) return;
      targetX = (e.clientX / window.innerWidth) - 0.5;
      targetY = (e.clientY / window.innerHeight) - 0.5;

      if (!isTicking) {
        requestAnimationFrame(updateParallax);
        isTicking = true;
      }
    }, { passive: true });

    function updateParallax() {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      floatingItems.forEach(function (item, index) {
        const factor = (index % 3 + 1) * 25;
        const xOffset = currentX * factor;
        const yOffset = currentY * factor;
        item.style.transform = `translate3d(${xOffset.toFixed(1)}px, ${yOffset.toFixed(1)}px, 0)`;
      });

      if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
        requestAnimationFrame(updateParallax);
      } else {
        isTicking = false;
      }
    }
  }

  /* ------------------------------------------------------------------------
     2. Card 3D Tilt & Specular Gloss Highlight
     ------------------------------------------------------------------------ */
  function initCard3DTilt() {
    if (prefersReducedMotion) return;

    const card = document.getElementById('careerCard');
    if (!card) return;

    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let isTilting = false;

    card.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch' || window.innerWidth < 992) return;

      const rect = card.getBoundingClientRect();
      const cardX = e.clientX - rect.left;
      const cardY = e.clientY - rect.top;

      // Update cursor coordinate variables for radial gloss
      card.style.setProperty('--card-mouse-x', cardX + 'px');
      card.style.setProperty('--card-mouse-y', cardY + 'px');

      // Calculate tilt angles (subtle max ±4.5 deg)
      const normX = (cardX / rect.width) - 0.5;
      const normY = (cardY / rect.height) - 0.5;

      targetRotateX = -normY * 4.5;
      targetRotateY = normX * 4.5;

      if (!isTilting) {
        requestAnimationFrame(renderTilt);
        isTilting = true;
      }
    });

    card.addEventListener('mouseleave', function () {
      targetRotateX = 0;
      targetRotateY = 0;
      if (!isTilting) {
        requestAnimationFrame(renderTilt);
        isTilting = true;
      }
    });

    function renderTilt() {
      currentRotateX += (targetRotateX - currentRotateX) * 0.12;
      currentRotateY += (targetRotateY - currentRotateY) * 0.12;

      card.style.transform = `perspective(1000px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) translateY(${Math.abs(currentRotateX) > 0.1 ? -4 : 0}px)`;

      if (Math.abs(targetRotateX - currentRotateX) > 0.02 || Math.abs(targetRotateY - currentRotateY) > 0.02) {
        requestAnimationFrame(renderTilt);
      } else {
        card.style.transform = '';
        isTilting = false;
      }
    }
  }

  /* ------------------------------------------------------------------------
     3. Magnetic CTA Button with Ripple Effect
     ------------------------------------------------------------------------ */
  function initMagneticButton() {
    if (prefersReducedMotion) return;

    const ctaBtn = document.getElementById('careersMailBtn');
    if (!ctaBtn) return;

    let btnX = 0;
    let btnY = 0;
    let currentBtnX = 0;
    let currentBtnY = 0;
    let isMagnetic = false;

    ctaBtn.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch' || window.innerWidth < 992) return;

      const rect = ctaBtn.getBoundingClientRect();
      const centerX = rect.left + rect.width * 0.5;
      const centerY = rect.top + rect.height * 0.5;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      // Magnetic pull (max 6px)
      btnX = dx * 0.22;
      btnY = dy * 0.22;

      if (!isMagnetic) {
        requestAnimationFrame(renderMagnetic);
        isMagnetic = true;
      }
    });

    ctaBtn.addEventListener('mouseleave', function () {
      btnX = 0;
      btnY = 0;
      if (!isMagnetic) {
        requestAnimationFrame(renderMagnetic);
        isMagnetic = true;
      }
    });

    function renderMagnetic() {
      currentBtnX += (btnX - currentBtnX) * 0.15;
      currentBtnY += (btnY - currentBtnY) * 0.15;

      ctaBtn.style.transform = `translate3d(${currentBtnX.toFixed(1)}px, ${currentBtnY.toFixed(1)}px, 0)`;

      if (Math.abs(btnX - currentBtnX) > 0.05 || Math.abs(btnY - currentBtnY) > 0.05) {
        requestAnimationFrame(renderMagnetic);
      } else {
        ctaBtn.style.transform = '';
        isMagnetic = false;
      }
    }

    // Material Ripple on click
    ctaBtn.addEventListener('click', function (e) {
      const rect = ctaBtn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'button-ripple';
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size * 0.5;
      const y = e.clientY - rect.top - size * 0.5;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      ctaBtn.appendChild(ripple);

      ripple.addEventListener('animationend', function () {
        ripple.remove();
      });
    });
  }

  /* ------------------------------------------------------------------------
     4. Typewriter Status Line with Bell Accent
     ------------------------------------------------------------------------ */
  function initTypewriterStatus() {
    const textEl = document.getElementById('careersTypewriterText');
    if (!textEl) return;

    if (prefersReducedMotion) {
      textEl.textContent = "We'll post new openings here soon.";
      return;
    }

    const sentences = [
      "We'll post new openings here as soon as they open.",
      "Check back soon or drop us an email anytime.",
      "Empowering youth through education across India."
    ];

    let sentenceIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 50;

    function tick() {
      if (document.hidden) {
        setTimeout(tick, 500);
        return;
      }

      const currentSentence = sentences[sentenceIdx];

      if (isDeleting) {
        charIdx--;
        textEl.textContent = currentSentence.substring(0, charIdx);
        typeSpeed = 25;
      } else {
        charIdx++;
        textEl.textContent = currentSentence.substring(0, charIdx);
        typeSpeed = 48;
      }

      if (!isDeleting && charIdx === currentSentence.length) {
        // Finished typing sentence, pause before deleting
        isDeleting = true;
        typeSpeed = 3200;
      } else if (isDeleting && charIdx === 0) {
        // Finished deleting, move to next sentence
        isDeleting = false;
        sentenceIdx = (sentenceIdx + 1) % sentences.length;
        typeSpeed = 400;
      }

      setTimeout(tick, typeSpeed);
    }

    // Initial delay so hero entrance completes first
    setTimeout(tick, 1400);
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
    initFloatingParallax();
    initCard3DTilt();
    initMagneticButton();
    initTypewriterStatus();
  }
})();
