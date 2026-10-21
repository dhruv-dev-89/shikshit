const fs = require('fs');

const files = [
  'public_html/js/shikshit/inner.js',
  'public_html (77)/js/shikshit/inner.js'
];

const newInitSectionIndex = `    /* ------------------------------------------------------------------------
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
  }`;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const isCrlf = content.includes('\r\n');
  content = content.replace(/\r\n/g, '\n');

  // Replace from '/* ------------------------------------------------------------------------\n     2. Sticky Section Index'
  // up to '/* ------------------------------------------------------------------------\n     3. Desktop 3D Tilt'
  const startIdx = content.indexOf('/* ------------------------------------------------------------------------\n     2. Sticky Section Index');
  const endIdx = content.indexOf('/* ------------------------------------------------------------------------\n     3. Desktop 3D Tilt');

  if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx) + newInitSectionIndex + '\n\n  ' + content.substring(endIdx);
    if (isCrlf) content = content.replace(/\n/g, '\r\n');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Successfully updated section index in', file);
  } else {
    console.error('Markers not found in', file, { startIdx, endIdx });
  }
});
