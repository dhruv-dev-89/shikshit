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
     2. Sticky Section Index Scroll-Spy & Gliding Navigation (Part A Fixes)
     ------------------------------------------------------------------------ */
  function initSectionIndex() {
    const bar = document.querySelector('.sticky-section-index');
    const track = document.querySelector('.index-pill-track');
    const pills = document.querySelectorAll('.index-pill');
    let glider = document.querySelector('.index-pill-glider');

    if (!bar || !track || !pills.length) return;

    if (!glider) {
      glider = document.createElement('div');
      glider.className = 'index-pill-glider';
      glider.setAttribute('aria-hidden', 'true');
      track.prepend(glider);
    }

    // Dynamic measurement of header/navbar height
    function updateNavbarHeight() {
      const header = document.querySelector('.shikshit-header') || document.querySelector('.shikshit-navbar');
      const h = header ? header.offsetHeight : 72;
      document.documentElement.style.setProperty('--navbar-height', h + 'px');
    }
    updateNavbarHeight();
    window.addEventListener('resize', updateNavbarHeight, { passive: true });

    let activePill = null;
    let isClickScrolling = false;
    let clickTimeout = null;

    function moveGlider(pill, immediate) {
      if (!pill) {
        glider.style.opacity = '0';
        return;
      }
      if (immediate) {
        glider.style.transition = 'none';
      } else {
        glider.style.transition = 'transform 350ms cubic-bezier(0.16, 1, 0.3, 1), width 350ms cubic-bezier(0.16, 1, 0.3, 1), opacity 250ms ease';
      }
      glider.style.width = pill.offsetWidth + 'px';
      glider.style.transform = 'translateX(' + pill.offsetLeft + 'px)';
      glider.style.opacity = '1';
      if (immediate) {
        glider.offsetHeight;
        glider.style.transition = '';
      }
    }

    function scrollPillInsideTrack(pill) {
      if (!track || !pill) return;
      const trackRect = track.getBoundingClientRect();
      const pillRect = pill.getBoundingClientRect();
      const targetScroll = pill.offsetLeft - (trackRect.width / 2) + (pillRect.width / 2);
      track.scrollTo({
        left: targetScroll,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    }

    function setActivePill(pill, scrollTrack = true) {
      if (!pill) return;
      if (pill === activePill) {
        moveGlider(pill);
        return;
      }
      activePill = pill;
      pills.forEach(p => {
        if (p === pill) {
          p.classList.add('active');
          p.setAttribute('aria-current', 'true');
        } else {
          p.classList.remove('active');
          p.removeAttribute('aria-current');
        }
      });
      moveGlider(pill);
      if (scrollTrack) {
        scrollPillInsideTrack(pill);
      }
    }

    // Map targets
    const pillMap = [];
    pills.forEach(pill => {
      const href = pill.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.getElementById(href.substring(1));
        if (target) {
          pillMap.push({ pill, target, id: href.substring(1) });
        }
      }
    });

    // IntersectionObserver with rootMargin around "-40% 0px -55% 0px"
    const observer = new IntersectionObserver(
      function (entries) {
        if (isClickScrolling) return;

        // Near top of page (hero section): clear highlight
        if (window.scrollY < 280) {
          if (activePill) {
            pills.forEach(p => { p.classList.remove('active'); p.removeAttribute('aria-current'); });
            activePill = null;
            glider.style.opacity = '0';
          }
          return;
        }

        // Near bottom of page: activate last pill
        if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60)) {
          const lastItem = pillMap[pillMap.length - 1];
          if (lastItem) setActivePill(lastItem.pill);
          return;
        }

        // Find intersecting elements
        const winH = window.innerHeight;
        const topBound = winH * 0.40;
        const bottomBound = winH * 0.45;

        const visibleTargets = pillMap.filter(item => {
          const rect = item.target.getBoundingClientRect();
          return rect.top <= bottomBound && rect.bottom >= topBound;
        });

        if (visibleTargets.length > 0) {
          // If the currently active pill is among the visible targets, keep it!
          const stillActive = visibleTargets.find(item => item.pill === activePill);
          if (stillActive) {
            setActivePill(stillActive.pill, false);
          } else {
            // Pick the first target in DOM sequence
            setActivePill(visibleTargets[0].pill);
          }
        }
      },
      {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0
      }
    );

    pillMap.forEach(item => {
      observer.observe(item.target);
    });

    // Global scroll listener for fast scroll & boundary checks
    function onScrollCheck() {
      if (isClickScrolling) return;

      if (window.scrollY < 280) {
        if (activePill) {
          pills.forEach(p => { p.classList.remove('active'); p.removeAttribute('aria-current'); });
          activePill = null;
          glider.style.opacity = '0';
        }
        return;
      }

      if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60)) {
        const lastItem = pillMap[pillMap.length - 1];
        if (lastItem) setActivePill(lastItem.pill);
      }
    }
    window.addEventListener('scroll', onScrollCheck, { passive: true });

    // Handle hash on page load or reload mid-page
    function handleInitialPosition() {
      updateNavbarHeight();
      if (window.location.hash) {
        const match = pillMap.find(item => '#' + item.id === window.location.hash);
        if (match) {
          setActivePill(match.pill, true);
          return;
        }
      }

      if (window.scrollY < 280) {
        glider.style.opacity = '0';
      } else {
        const winH = window.innerHeight;
        const visible = pillMap.filter(item => {
          const rect = item.target.getBoundingClientRect();
          return rect.top <= winH * 0.6 && rect.bottom >= winH * 0.2;
        });
        if (visible.length > 0) {
          setActivePill(visible[0].pill, true);
        } else {
          setActivePill(pillMap[0].pill, true);
        }
      }
    }

    setTimeout(handleInitialPosition, 100);
    window.addEventListener('resize', () => {
      if (activePill) moveGlider(activePill, true);
    }, { passive: true });

    // Smooth Scroll on Click
    pills.forEach(pill => {
      pill.addEventListener('click', function (e) {
        const href = pill.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        const target = document.getElementById(href.substring(1));
        if (!target) return;

        e.preventDefault();
        isClickScrolling = true;
        clearTimeout(clickTimeout);

        // Update URL hash without jumping
        if (history.pushState) {
          history.pushState(null, '', href);
        } else {
          window.location.hash = href;
        }

        setActivePill(pill);

        // Native smooth scroll respecting scroll-margin-top
        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });

        // Move focus to section heading (tabindex=-1)
        const heading = target.querySelector('h2, h3, h4, h5') || target;
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });

        clickTimeout = setTimeout(() => {
          isClickScrolling = false;
        }, prefersReducedMotion ? 50 : 800);
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
     6. Dynamic Scroll Velocity on Marquee Ribbons
     ------------------------------------------------------------------------ */
  function initMarqueeScrollVelocity() {
    if (prefersReducedMotion) return;
    const tracks = document.querySelectorAll('.products-hero-bands .bd div');
    if (!tracks.length) return;

    let lastScrollY = window.scrollY;
    let scrollTimeout = null;

    window.addEventListener('scroll', function () {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      if (delta > 2) {
        tracks.forEach(function (track) {
          track.style.animationDuration = track.parentElement.classList.contains('a') ? '24s' : '34s';
        });

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function () {
          tracks.forEach(function (track) {
            track.style.animationDuration = '';
          });
        }, 300);
      }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     7. Diploma Cards Staggered Reveal, Number Count-Up & Soft 3D Tilt
     ------------------------------------------------------------------------ */
  function initDiplomaCardsInteraction() {
    const cards = document.querySelectorAll('.diploma-card');
    if (!cards.length) return;

    // A. Staggered IntersectionObserver reveal & Number count-up
    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');

            // Count up sequence number badge if plain number
            const numBadge = entry.target.querySelector('.diploma-card-num');
            if (numBadge && !numBadge.dataset.counted) {
              numBadge.dataset.counted = 'true';
              const targetNum = parseInt(numBadge.textContent.trim(), 10);
              if (!isNaN(targetNum)) {
                let current = 0;
                const duration = 600;
                const stepTime = Math.max(20, Math.floor(duration / targetNum));
                const timer = setInterval(function () {
                  current += 1;
                  numBadge.textContent = current < 10 ? '0' + current : '' + current;
                  if (current >= targetNum) {
                    clearInterval(timer);
                  }
                }, stepTime);
              }
            }

            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    cards.forEach(function (card) {
      observer.observe(card);
    });

    // B. Desktop Soft 3D Tilt (Max 6deg, desktop pointer:fine only)
    if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      cards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
          if (e.target.closest('.diploma-enroll-link')) {
            card.style.transform = 'translateY(-8px)';
            return;
          }
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -5.5;
          const rotateY = ((x - centerX) / centerX) * 5.5;

          card.style.transform = 'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-8px)';
        });

        card.addEventListener('mouseleave', function () {
          card.style.transform = '';
        });
      });
    }
  }


  /* ------------------------------------------------------------------------
     8. Product & Services Section Motion (Heading reveal, Stagger, 3D Tilt, Cursor Glow)
     ------------------------------------------------------------------------ */
  function initProductServicesMotion() {
    // A. Heading Word Slide & Underline Self-Draw
    const heading = document.querySelector('.products-section-heading');
    if (heading) {
      const headingObs = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      headingObs.observe(heading);
    }

    // B. Cards Staggered Fade-Up on Viewport Entry
    const cards = document.querySelectorAll('.service-editorial-card');
    if (cards.length) {
      const cardObs = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );

      cards.forEach(function (card) {
        cardObs.observe(card);
      });

      // C. Desktop Cursor-Following Glow & Soft 3D Tilt (Max 5deg, pointer:fine only)
      if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        cards.forEach(function (card) {
          card.addEventListener('pointermove', function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Set CSS custom properties for radial glow
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');

            // Soft 3D Tilt (Max 5deg)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4.5;
            const rotateY = ((x - centerX) / centerX) * 4.5;

            card.style.transform = 'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-8px)';
          });

          card.addEventListener('pointerleave', function () {
            card.style.transform = '';
          });
        });
      }
    }
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
    initMarqueeScrollVelocity();
    initDiplomaCardsInteraction();
    initProductServicesMotion();
    initFooterMotion();
    initMemberAnimations();
    initDonateAnimations();
  });
})();
