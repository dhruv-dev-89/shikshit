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
     2. Sticky Section Index Scroll-Spy & Gliding Navigation
     ------------------------------------------------------------------------ */
  function initSectionIndex() {
    const bar = document.querySelector('.sticky-section-index');
    const track = document.querySelector('.index-pill-track');
    const pills = Array.from(document.querySelectorAll('.index-pill'));
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
    let lastClickedTarget = null;
    let lastClickedScrollY = -1;

    function moveGlider(pill, immediate) {
      if (!pill) {
        glider.style.setProperty('opacity', '0', 'important');
        return;
      }
      if (immediate || prefersReducedMotion) {
        glider.style.setProperty('transition', 'none', 'important');
      } else {
        glider.style.setProperty('transition', 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1), width 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease', 'important');
      }

      const w = pill.offsetWidth;
      const left = pill.offsetLeft;
      glider.style.setProperty('width', w + 'px', 'important');
      glider.style.setProperty('transform', 'translateX(' + left + 'px)', 'important');
      glider.style.setProperty('opacity', '1', 'important');

      if (immediate || prefersReducedMotion) {
        glider.offsetHeight; // force reflow
        glider.style.removeProperty('transition');
      }
    }

    function scrollPillInsideTrack(pill) {
      if (!track || !pill) return;
      const trackRect = track.getBoundingClientRect();
      const targetScroll = pill.offsetLeft - (trackRect.width / 2) + (pill.offsetWidth / 2);
      track.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    }

    function setActivePill(pill, scrollTrack = true, immediate = false) {
      if (!pill) return;
      if (pill === activePill) {
        moveGlider(pill, immediate);
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
      moveGlider(pill, immediate);
      if (scrollTrack) {
        scrollPillInsideTrack(pill);
      }
    }

    // Map targets from hrefs
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

    if (!pillMap.length) return;

    // Detect active section on scroll
    function determineActivePill() {
      if (isClickScrolling) return;

      const scrollY = window.scrollY;
      const winH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;

      // Bottom of page: activate last item
      if (scrollY + winH >= docH - 60) {
        setActivePill(pillMap[pillMap.length - 1].pill);
        return;
      }

      // If user recently clicked a section, keep that section active while near it
      if (lastClickedTarget && Math.abs(scrollY - lastClickedScrollY) < 140) {
        return;
      } else {
        lastClickedTarget = null;
      }

      const header = document.querySelector('.shikshit-header') || document.querySelector('.shikshit-navbar');
      const headerH = header ? header.offsetHeight : 72;
      const barH = bar.offsetHeight || 54;
      const topBarBottom = headerH + barH;
      const triggerLine = topBarBottom + 130;

      // Above the first section: keep first pill active
      const firstRect = pillMap[0].target.getBoundingClientRect();
      if (firstRect.top > triggerLine) {
        setActivePill(pillMap[0].pill);
        return;
      }

      // Find targets currently containing the trigger line
      const activeTargets = pillMap.filter(item => {
        const r = item.target.getBoundingClientRect();
        return r.top <= triggerLine && r.bottom > triggerLine;
      });

      if (activeTargets.length === 1) {
        setActivePill(activeTargets[0].pill);
        return;
      } else if (activeTargets.length > 1) {
        // Multi-column row sharing the same vertical space (desktop 3-column grid)
        const rowTop = activeTargets[0].target.getBoundingClientRect().top;
        const rowBottom = activeTargets[0].target.getBoundingClientRect().bottom;
        const rowHeight = Math.max(rowBottom - rowTop, 100);
        const progress = Math.max(0, Math.min(0.999, (triggerLine - rowTop) / rowHeight));
        const idx = Math.floor(progress * activeTargets.length);
        setActivePill(activeTargets[idx].pill);
        return;
      }

      // Fallback: pick the section whose top is closest to triggerLine
      let closest = pillMap[0];
      let minDistance = Infinity;
      pillMap.forEach(item => {
        const r = item.target.getBoundingClientRect();
        const dist = Math.abs(r.top - triggerLine);
        if (dist < minDistance) {
          minDistance = dist;
          closest = item;
        }
      });
      if (closest) {
        setActivePill(closest.pill);
      }
    }

    let scrollRafId = null;
    function onScrollThrottled() {
      if (scrollRafId) return;
      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = null;
        determineActivePill();
      });
    }

    window.addEventListener('scroll', onScrollThrottled, { passive: true });

    // Handle hash on page load or reload
    function handleInitialPosition() {
      updateNavbarHeight();
      if (window.location.hash) {
        const match = pillMap.find(item => '#' + item.id === window.location.hash);
        if (match) {
          setActivePill(match.pill, true, true);
          return;
        }
      }
      determineActivePill();
      const initialActive = document.querySelector('.index-pill.active') || pills[0];
      if (initialActive) {
        setActivePill(initialActive, true, true);
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
        lastClickedTarget = target;
        lastClickedScrollY = window.scrollY;

        // Update URL hash cleanly
        if (history.pushState) {
          history.pushState(null, '', href);
        } else {
          window.location.hash = href;
        }

        setActivePill(pill, true);

        // Native smooth scroll respecting scroll-margin-top
        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });

        // Accessible focus management: move focus to section heading
        const heading = target.querySelector('h2, h3, h4, h5') || target;
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });

        clickTimeout = setTimeout(() => {
          isClickScrolling = false;
          lastClickedScrollY = window.scrollY;
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
     9. Footer Micro-Motion & Link Transitions
     ------------------------------------------------------------------------ */
  function initFooterMotion() {
    function bindFooterLinks() {
      const socialLinks = document.querySelectorAll('.footer-editorial a, footer a, [include-html*="footer"] a');
      socialLinks.forEach(function (link) {
        if (!link.dataset.motionBound) {
          link.dataset.motionBound = 'true';
          link.style.transition = 'transform 0.2s ease, color 0.2s ease, opacity 0.2s ease';
        }
      });
    }

    bindFooterLinks();
    // In case footer was loaded asynchronously via includeHTML
    setTimeout(bindFooterLinks, 600);
    setTimeout(bindFooterLinks, 1500);
  }

  /* ------------------------------------------------------------------------
     10. Member Page Purposeful Scroll Reveals & Interactions
     ------------------------------------------------------------------------ */
  function initMemberAnimations() {
    if (!document.body.classList.contains('page-member')) return;
    if (prefersReducedMotion) return;

    const targets = document.querySelectorAll(
      'body.page-member .membership-card, ' +
      'body.page-member .benefits-card, ' +
      'body.page-member #membership-form .bg-white, ' +
      'body.page-member #membership-form .grid > div, ' +
      'body.page-member .py-20.bg-gradient-to-b .group'
    );

    if (!targets.length) return;

    const memberObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    targets.forEach(function (el, idx) {
      el.classList.add('scroll-reveal-item');
      const delay = (idx % 3) * 0.08;
      el.style.transitionDelay = delay + 's';
      memberObserver.observe(el);
    });

    // Smooth scroll for hero CTA button
    const heroBtn = document.querySelector('body.page-member .hero-gradient a[href*="membership-form"]');
    if (heroBtn) {
      heroBtn.addEventListener('click', function (e) {
        const formSection = document.getElementById('membership-form');
        if (formSection) {
          e.preventDefault();
          formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }

  /* ------------------------------------------------------------------------
     11. Donate Page Purposeful Scroll Reveals & Interactions
     ------------------------------------------------------------------------ */
  function initDonateAnimations() {
    if (!document.body.classList.contains('page-donate')) return;
    if (prefersReducedMotion) return;

    const targets = document.querySelectorAll(
      'body.page-donate #donate-form .grid.grid-cols-2 > div, ' +
      'body.page-donate #donate-form .bg-white, ' +
      'body.page-donate .intervention-card, ' +
      'body.page-donate .py-16.lg\\:py-24.bg-white > div'
    );

    if (!targets.length) return;

    const donateObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    targets.forEach(function (el, idx) {
      el.classList.add('scroll-reveal-item');
      const delay = (idx % 4) * 0.07;
      el.style.transitionDelay = delay + 's';
      donateObserver.observe(el);
    });

    // Smooth scroll for hero CTA button
    const heroBtn = document.querySelector('body.page-donate .hero-gradient a[href*="donate-form"]');
    if (heroBtn) {
      heroBtn.addEventListener('click', function (e) {
        const formSection = document.getElementById('donate-form');
        if (formSection) {
          e.preventDefault();
          formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }

  /* ------------------------------------------------------------------------
     Initialize on DOM Ready
     ------------------------------------------------------------------------ */
  function initAll() {
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
