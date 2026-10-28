/**
 * Shikshit Careers Page - Data-Driven Mascot & Smooth Content Transitions
 *
 * Features:
 * 1. Automatic Mood & Content synchronization driven by `openPositions` data:
 *    - 0 Openings: Calm, relaxed mood. Looking at phone, slow breathing, idle sway.
 *                  Speech: "No openings today, check back soon!"
 *                  Card: "No open positions right now", original description, CTA "Get in touch about careers".
 *    - 1+ Openings: Excited mood. Big smile, celebratory jump, waves, fist raised, confetti burst on load.
 *                   Speech: "We're hiring! Come join us 🎉"
 *                   Card: "We're hiring!", "{n} open position(s) available", dynamic role cards, CTA "View openings".
 *    - Loading State: Curious mood, looking around. Speech: "Checking for openings..."
 * 2. Smooth ~300ms crossfade between states without flashing or remounting.
 * 3. Bottom-left edge placement on desktop; centered above card on mobile (<768px).
 * 4. Head-anchored speech bubble with auto-flip when near viewport boundaries.
 * 5. 3D perspective cursor tilt parallax & 5-click confetti Easter egg.
 * 6. Programmatic runtime hook: `window.setShikshitOpenings(array)` for dynamic updates.
 */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Cached DOM Elements
  const container = document.getElementById('studentAvatarContainer');
  const avatarStage = document.getElementById('avatarStage');
  const photoCalm = document.getElementById('avatarPhotoCalm');
  const photoExcited = document.getElementById('avatarPhotoExcited');
  const speechBubble = document.getElementById('avatarSpeechBubble');
  const clickHint = document.getElementById('avatarClickHint');

  // Card Content DOM Elements
  const cardBody = document.querySelector('.careers-card-body');
  const openingsTitle = document.getElementById('openings-title');
  const openingsCountLine = document.getElementById('openingsCountLine');
  const typewriterText = document.getElementById('careersTypewriterText');
  const cardText = document.getElementById('careersCardText');
  const openingsWrapper = document.getElementById('openingsListWrapper');
  const mailBtn = document.getElementById('careersMailBtn');
  const mailBtnText = document.getElementById('careersMailBtnText');

  if (!container) return;

  // State Tracking
  let currentMood = 'calm'; // 'calm' | 'excited' | 'loading'
  let clickCount = 0;
  let clickTimer = null;
  let speechHideTimer = null;
  let speechRotateTimer = null;
  let speechIndex = 0;
  let hasFiredInitialConfetti = false;
  let isEasterEggActive = false;

  // Default Copy
  const DEFAULT_EMPTY_TITLE = "No open positions right now";
  const DEFAULT_EMPTY_DESC = "We’ll post new openings on this page as soon as they become available. Please check back for future opportunities to work with Shikshit.";
  const DEFAULT_EMPTY_BELL = "We’ll post new openings here soon.";
  const DEFAULT_EMPTY_CTA = "Get in touch about careers";
  const DEFAULT_EMPTY_MAILTO = "mailto:shikshiteducation@gmail.com?subject=Career%20opportunities%20at%20Shikshit";

  const DEFAULT_HIRING_TITLE = "We're hiring!";
  const DEFAULT_HIRING_DESC = "We are expanding our team across India to bring high-impact education to every child. Explore our open roles below and apply today!";
  const DEFAULT_HIRING_BELL = "✨ Applications open for 2026-2027 academic sessions!";
  const DEFAULT_HIRING_CTA = "View openings";

  /* ------------------------------------------------------------------------
     1. Speech Bubble Helper & 4-5s Message Rotation with Fade
     ------------------------------------------------------------------------ */
  function rotateSpeechMessage() {
    if (!speechBubble || prefersReducedMotion) return;
    const config = window.SHIKSHIT_CAREERS_CONFIG || {};
    const messages = (config.speechMessages && config.speechMessages[currentMood]) || [
      "No openings today, check back soon!"
    ];
    if (!Array.isArray(messages) || messages.length <= 1) return;

    speechIndex = (speechIndex + 1) % messages.length;
    const nextMsg = messages[speechIndex];

    // Smooth ~300ms fade transition
    speechBubble.style.opacity = '0';
    speechBubble.style.transform = 'translateX(-50%) translateY(4px) scale(0.95)';

    setTimeout(function () {
      speechBubble.textContent = nextMsg;
      speechBubble.style.opacity = '1';
      speechBubble.style.transform = 'translateX(-50%) translateY(0) scale(1)';
    }, 280);
  }

  function startSpeechRotation() {
    stopSpeechRotation();
    speechRotateTimer = setInterval(rotateSpeechMessage, 4500);
  }

  function stopSpeechRotation() {
    if (speechRotateTimer) {
      clearInterval(speechRotateTimer);
      speechRotateTimer = null;
    }
  }

  function showSpeechBubble(message) {
    if (!speechBubble) return;

    speechBubble.textContent = message;
    speechBubble.classList.remove('bubble-flipped');
    speechBubble.classList.add('active');
    speechBubble.style.opacity = '1';
    speechBubble.style.transform = 'translateX(-50%) translateY(0) scale(1)';

    // Start/restart 4.5s rotation
    startSpeechRotation();
  }

  /* ------------------------------------------------------------------------
     2. Dynamic Role Cards Renderer
     ------------------------------------------------------------------------ */
  function renderRoleCards(positions) {
    if (!openingsWrapper) return;
    const listEl = openingsWrapper.querySelector('.openings-list');
    if (!listEl) return;

    listEl.innerHTML = positions.map(function (item) {
      const email = item.applyEmail || 'shikshiteducation@gmail.com';
      const tagClass = item.tagClass || 'tag-purple';
      const title = item.title || 'Educational Specialist';
      const type = item.type || 'Full-Time';
      const location = item.location || 'India';
      const desc = item.description || '';
      const perk = item.perk || 'Non-Profit Band';

      return `
        <a class="job-card" href="mailto:${email}?subject=Application%20for%20${encodeURIComponent(title)}">
          <div class="job-card-header">
            <span class="job-tag ${tagClass}">${type}</span>
            <span class="job-location">${location}</span>
          </div>
          <h3 class="job-title">${title}</h3>
          <p class="job-desc">${desc}</p>
          <div class="job-footer">
            <span class="job-perk">${perk}</span>
            <span class="job-action">Apply Now →</span>
          </div>
        </a>
      `;
    }).join('');
  }

  /* ------------------------------------------------------------------------
     3. Data-Driven Mood & Content Controller (~300ms Crossfade)
     ------------------------------------------------------------------------ */
  function applyOpeningsData(positions, animateCrossfade = true) {
    // 1. Loading State Handling
    if (positions === null || positions === 'loading') {
      currentMood = 'loading';
      container.className = 'student-avatar-container mood-loading';
      container.setAttribute('aria-label', "Student avatar checking for openings.");
      if (photoCalm) photoCalm.classList.add('active');
      if (photoExcited) photoExcited.classList.remove('active');
      showSpeechBubble("Checking for openings...");
      return;
    }

    const count = Array.isArray(positions) ? positions.length : 0;
    const targetMood = count > 0 ? 'excited' : 'calm';

    function updateDOM() {
      if (count > 0) {
        // --- 1+ OPENINGS: EXCITED MOOD ---
        currentMood = 'excited';
        container.className = 'student-avatar-container mood-excited';
        container.setAttribute('aria-label', `Student avatar celebrating ${count} open position(s)!`);

        if (photoExcited) photoExcited.classList.add('active');
        if (photoCalm) photoCalm.classList.remove('active');

        // Card Content
        if (openingsTitle) openingsTitle.textContent = DEFAULT_HIRING_TITLE;

        if (openingsCountLine) {
          openingsCountLine.textContent = `✨ ${count} open position${count > 1 ? 's' : ''} available`;
          openingsCountLine.classList.add('visible');
        }

        if (cardText) cardText.textContent = DEFAULT_HIRING_DESC;
        if (typewriterText) typewriterText.textContent = DEFAULT_HIRING_BELL;

        // Render role cards & open wrapper
        renderRoleCards(positions);
        if (openingsWrapper) {
          openingsWrapper.classList.add('open');
          openingsWrapper.setAttribute('aria-hidden', 'false');
        }

        // CTA Button
        if (mailBtnText) mailBtnText.textContent = DEFAULT_HIRING_CTA;
        if (mailBtn) {
          mailBtn.href = "#openingsListWrapper";
          mailBtn.onclick = function (e) {
            e.preventDefault();
            if (openingsWrapper) {
              openingsWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          };
        }

        // Fire celebration confetti once on load / transition
        if (!hasFiredInitialConfetti && !prefersReducedMotion) {
          hasFiredInitialConfetti = true;
          triggerConfettiStorm();
        }

        showSpeechBubble("We're hiring! Come join us 🎉");

      } else {
        // --- 0 OPENINGS: CALM / RELAXED MOOD ---
        currentMood = 'calm';
        container.className = 'student-avatar-container mood-calm';
        container.setAttribute('aria-label', "Student avatar in calm mood, no current openings.");

        if (photoCalm) photoCalm.classList.add('active');
        if (photoExcited) photoExcited.classList.remove('active');

        // Card Content
        if (openingsTitle) openingsTitle.textContent = DEFAULT_EMPTY_TITLE;

        if (openingsCountLine) {
          openingsCountLine.textContent = '';
          openingsCountLine.classList.remove('visible');
        }

        if (cardText) cardText.textContent = DEFAULT_EMPTY_DESC;
        if (typewriterText) typewriterText.textContent = DEFAULT_EMPTY_BELL;

        // Close openings list
        if (openingsWrapper) {
          openingsWrapper.classList.remove('open');
          openingsWrapper.setAttribute('aria-hidden', 'true');
        }

        // CTA Button
        if (mailBtnText) mailBtnText.textContent = DEFAULT_EMPTY_CTA;
        if (mailBtn) {
          mailBtn.href = DEFAULT_EMPTY_MAILTO;
          mailBtn.onclick = null;
        }

        showSpeechBubble("No openings today, check back soon!");
      }
    }

    if (animateCrossfade && cardBody) {
      // Smooth 300ms crossfade
      cardBody.classList.add('crossfading');
      setTimeout(function () {
        updateDOM();
        cardBody.classList.remove('crossfading');
      }, 150);
    } else {
      updateDOM();
    }
  }

  // Expose clean programmatic hook for runtime data updates / tests
  window.setShikshitOpenings = function (positionsArray) {
    applyOpeningsData(positionsArray, true);
  };

  /* ------------------------------------------------------------------------
     4. 3D Perspective Mouse Cursor Tracking
     ------------------------------------------------------------------------ */
  function init3DCursorTracking() {
    if (prefersReducedMotion || !avatarStage) return;

    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;
    let isTicking = false;

    function handlePointer(clientX, clientY) {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width * 0.5;
      const centerY = rect.top + rect.height * 0.5;

      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const maxDistance = 450;

      // Subtle tilt clamped to max ±6.5 degrees
      targetTiltY = (Math.max(-maxDistance, Math.min(maxDistance, dx)) / maxDistance) * 6.5;
      targetTiltX = -(Math.max(-maxDistance, Math.min(maxDistance, dy)) / maxDistance) * 4.5;

      if (!isTicking) {
        requestAnimationFrame(updateTilt);
        isTicking = true;
      }
    }

    window.addEventListener('pointermove', function (e) {
      if (document.hidden || e.pointerType === 'touch') return;
      handlePointer(e.clientX, e.clientY);
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      targetTiltX = 0;
      targetTiltY = 0;
      if (!isTicking) {
        requestAnimationFrame(updateTilt);
        isTicking = true;
      }
    });

    function updateTilt() {
      currentTiltX += (targetTiltX - currentTiltX) * 0.12;
      currentTiltY += (targetTiltY - currentTiltY) * 0.12;

      avatarStage.style.transform = `perspective(800px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;

      if (Math.abs(targetTiltX - currentTiltX) > 0.05 || Math.abs(targetTiltY - currentTiltY) > 0.05) {
        requestAnimationFrame(updateTilt);
      } else {
        isTicking = false;
      }
    }
  }

  /* ------------------------------------------------------------------------
     5. Avatar Interactions & 5-Click Easter Egg
     ------------------------------------------------------------------------ */
  function triggerAvatarJump() {
    container.classList.remove('jumping');
    void container.offsetWidth; // Force reflow
    container.classList.add('jumping');

    setTimeout(function () {
      container.classList.remove('jumping');
    }, 750);
  }

  function initInteractions() {
    // Show speech on hover if not currently active
    container.addEventListener('mouseenter', function () {
      if (!speechBubble.classList.contains('active')) {
        const msg = currentMood === 'excited'
          ? "We're hiring! Come join us 🎉"
          : "No openings today, check back soon!";
        showSpeechBubble(msg);
      }
    });

    // Handle avatar click / tap
    function handleAvatarClick(e) {
      if (e) e.preventDefault();

      triggerAvatarJump();

      // Click streak for 5-click easter egg
      clickCount++;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(function () {
        clickCount = 0;
        if (clickHint) clickHint.classList.remove('visible');
      }, 3500);

      if (clickHint && clickCount > 1 && clickCount < 5) {
        clickHint.textContent = `${clickCount}/5 🎒✨`;
        clickHint.classList.add('visible');
      }

      if (clickCount >= 5) {
        clickCount = 0;
        if (clickHint) clickHint.classList.remove('visible');
        triggerConfettiStorm();
        showSpeechBubble("🎉 SUPER EASTER EGG UNLOCKED! You're awesome! 🚀");
      } else {
        const msg = currentMood === 'excited'
          ? "Check out the roles below! 💼"
          : "Want to volunteer and support kids like me? 🎒";
        showSpeechBubble(msg);
      }
    }

    container.addEventListener('click', handleAvatarClick);

    // Keyboard Accessibility (Enter or Space)
    container.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        handleAvatarClick(e);
      }
    });

    // Handle window resize to auto-adjust speech bubble
    window.addEventListener('resize', function () {
      if (speechBubble && speechBubble.classList.contains('active')) {
        const rect = speechBubble.getBoundingClientRect();
        if (rect.left < 16) {
          speechBubble.classList.add('bubble-flipped');
        } else {
          speechBubble.classList.remove('bubble-flipped');
        }
      }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     6. Confetti Explosion (Miniature Books, Pencils, Stars, Mortarboards)
     ------------------------------------------------------------------------ */
  function triggerConfettiStorm() {
    if (isEasterEggActive) return;
    isEasterEggActive = true;

    const canvas = document.createElement('canvas');
    canvas.className = 'confetti-canvas-overlay';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', function () {
      if (!isEasterEggActive) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    // Origin: Avatar chest / upper body
    const rect = container.getBoundingClientRect();
    const originX = rect.left + rect.width * 0.5;
    const originY = rect.top + rect.height * 0.35;

    const particleTypes = ['book', 'pencil', 'star', 'cap', 'chip'];
    const colors = ['#7C3AED', '#C026D3', '#EC4899', '#F59E0B', '#3B82F6', '#10B981'];

    const particles = [];
    const PARTICLE_COUNT = 90;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
      const speed = Math.random() * 15 + 7;
      particles.push({
        x: originX + (Math.random() - 0.5) * 36,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 14 + 12,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.28,
        opacity: 1,
        gravity: 0.32,
        drag: 0.985
      });
    }

    let startTime = performance.now();
    const DURATION = 3200; // ms

    function drawParticle(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = Math.max(0, p.opacity);

      if (p.type === 'book') {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size * 0.45, -p.size * 0.5, p.size * 0.9, p.size);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-p.size * 0.38, -p.size * 0.45, p.size * 0.76, p.size * 0.9);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size * 0.06, -p.size * 0.45, p.size * 0.12, p.size * 0.9);
      } else if (p.type === 'pencil') {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size * 0.18, -p.size * 0.45, p.size * 0.36, p.size * 0.75);
        ctx.fillStyle = '#FDE68A';
        ctx.beginPath();
        ctx.moveTo(-p.size * 0.18, p.size * 0.3);
        ctx.lineTo(p.size * 0.18, p.size * 0.3);
        ctx.lineTo(0, p.size * 0.55);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#1F1A2E';
        ctx.beginPath();
        ctx.arc(0, p.size * 0.5, p.size * 0.08, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'cap') {
        ctx.fillStyle = '#5B21B6';
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.4);
        ctx.lineTo(p.size * 0.5, 0);
        ctx.lineTo(0, p.size * 0.3);
        ctx.lineTo(-p.size * 0.5, 0);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(p.size * 0.3, p.size * 0.25);
        ctx.stroke();
      } else if (p.type === 'star') {
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          ctx.lineTo(
            Math.cos((18 + i * 72) * Math.PI / 180) * p.size * 0.5,
            -Math.sin((18 + i * 72) * Math.PI / 180) * p.size * 0.5
          );
          ctx.lineTo(
            Math.cos((54 + i * 72) * Math.PI / 180) * p.size * 0.22,
            -Math.sin((54 + i * 72) * Math.PI / 180) * p.size * 0.22
          );
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.28, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    function animateConfetti(timestamp) {
      const elapsed = timestamp - startTime;
      ctx.clearRect(0, 0, width, height);

      particles.forEach(function (p) {
        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        if (elapsed > DURATION * 0.6) {
          p.opacity = 1 - (elapsed - DURATION * 0.6) / (DURATION * 0.4);
        }

        drawParticle(p);
      });

      if (elapsed < DURATION) {
        requestAnimationFrame(animateConfetti);
      } else {
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
        isEasterEggActive = false;
      }
    }

    requestAnimationFrame(animateConfetti);
  }

  /* ------------------------------------------------------------------------
     7. Get Notified Form (Validation, Confetti & Feedback)
     ------------------------------------------------------------------------ */
  function initNotifyForm() {
    const form = document.getElementById('careersNotifyForm');
    const emailInput = document.getElementById('notifyEmailInput');
    const feedback = document.getElementById('notifyFeedback');
    const submitBtn = document.getElementById('notifySubmitBtn');
    if (!form || !emailInput || !feedback) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = (emailInput.value || '').trim();

      if (!emailRegex.test(email)) {
        feedback.className = 'notify-feedback error';
        feedback.textContent = 'Please enter a valid email address.';
        emailInput.focus();
        return;
      }

      // Success State
      feedback.className = 'notify-feedback success';
      feedback.textContent = "🎉 You're on the list! We'll email you the moment new roles open.";
      emailInput.disabled = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Subscribed! ✓</span>';
      }

      // Celebratory Confetti Burst
      if (!prefersReducedMotion) {
        triggerConfettiStorm();
      }
    });

    emailInput.addEventListener('input', function () {
      if (feedback.classList.contains('error')) {
        feedback.textContent = '';
        feedback.className = 'notify-feedback';
      }
    });
  }

  /* ------------------------------------------------------------------------
     8. Accessible FAQ Accordion Interactivity
     ------------------------------------------------------------------------ */
  function initFaqAccordion() {
    const accordion = document.getElementById('faqAccordion');
    if (!accordion) return;

    const triggers = accordion.querySelectorAll('.faq-trigger');

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        const panelId = trigger.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);

        // Toggle state
        trigger.setAttribute('aria-expanded', !isExpanded);
        if (panel) {
          panel.hidden = isExpanded;
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     9. Scroll Reveal & Timeline Line Draw Trigger
     ------------------------------------------------------------------------ */
  function initScrollReveals() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const timeline = document.getElementById('hiringTimeline');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach(function (el) {
        el.classList.add('is-revealed');
      });
      if (timeline) timeline.classList.add('is-revealed');
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });

    if (timeline) {
      observer.observe(timeline);
    }
  }

  /* ------------------------------------------------------------------------
     10. Initialize on DOM Ready
     ------------------------------------------------------------------------ */
  function initAll() {
    init3DCursorTracking();
    initInteractions();
    initNotifyForm();
    initFaqAccordion();
    initScrollReveals();

    // Read configured positions from window.SHIKSHIT_CAREERS_CONFIG
    const config = window.SHIKSHIT_CAREERS_CONFIG || { openPositions: [] };
    const initialPositions = Array.isArray(config.openPositions) ? config.openPositions : [];

    // Apply data without crossfade on initial load
    applyOpeningsData(initialPositions, false);

    // Initial greeting speech bubble after entrance
    if (!prefersReducedMotion) {
      setTimeout(function () {
        if (speechBubble && !speechBubble.classList.contains('active')) {
          const greeting = initialPositions.length > 0
            ? "We're hiring! Come join us 🎉"
            : "No openings today, check back soon!";
          showSpeechBubble(greeting);
        }
      }, 1500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
