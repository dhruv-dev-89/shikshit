const fs = require('fs');
const path = require('path');

const folders = ['public_html', 'public_html (77)'];

const newSectionIndexJs = `  /* ------------------------------------------------------------------------
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
  }`;

for (const folder of folders) {
  const jsPath = path.join(__dirname, '..', folder, 'js', 'shikshit', 'inner.js');
  let jsContent = fs.readFileSync(jsPath, 'utf8');

  // Replace initSectionIndex
  const oldFuncRegex = /\/\* ------------------------------------------------------------------------\s*2\. Sticky Section Index Scroll-Spy[\s\S]*?(?=\/\* ------------------------------------------------------------------------\s*3\. Desktop 3D Tilt)/;
  if (oldFuncRegex.test(jsContent)) {
    jsContent = jsContent.replace(oldFuncRegex, newSectionIndexJs + '\n\n  ');
    console.log(`Replaced initSectionIndex in ${folder}/js/shikshit/inner.js`);
  } else {
    console.error(`Could not match old initSectionIndex in ${folder}/js/shikshit/inner.js`);
  }

  // Ensure footer motion & visibility listener are present
  if (!jsContent.includes('initFooterMotion')) {
    const footerMotionJs = `
  /* ------------------------------------------------------------------------
     Footer Motion (Staggered Column Reveal)
     ------------------------------------------------------------------------ */
  function initFooterMotion() {
    const footer = document.querySelector('.footer-editorial');
    if (!footer) return;

    if (prefersReducedMotion) {
      footer.classList.add('in-view');
      return;
    }

    const footerObs = new IntersectionObserver(
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
    footerObs.observe(footer);
  }

  /* ------------------------------------------------------------------------
     Tab Visibility Listener (Pause animations when tab is hidden)
     ------------------------------------------------------------------------ */
  document.addEventListener('visibilitychange', function () {
    document.body.classList.toggle('page-animations-paused', document.hidden);
  });
`;
    // Insert before init on DOM ready
    jsContent = jsContent.replace(
      '/* ------------------------------------------------------------------------\n     Initialize on DOM Ready',
      footerMotionJs + '\n  /* ------------------------------------------------------------------------\n     Initialize on DOM Ready'
    );

    // Call initFooterMotion in DOMContentLoaded
    jsContent = jsContent.replace(
      'initProductServicesMotion();',
      'initProductServicesMotion();\n    initFooterMotion();'
    );
    console.log(`Added initFooterMotion to ${folder}/js/shikshit/inner.js`);
  }

  fs.writeFileSync(jsPath, jsContent, 'utf8');
}

console.log('Step 3 (inner.js updates) complete.');
