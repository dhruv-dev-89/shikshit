const fs = require('fs');
const path = require('path');

const ROOT_DIRS = ['public_html', 'public_html (77)'];

function updateFileInRoots(relativePath, updater) {
  ROOT_DIRS.forEach(rootDir => {
    const filePath = path.join(rootDir, relativePath);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const updated = updater(content, filePath);
    if (updated !== content) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`Updated: ${filePath}`);
    } else {
      console.log(`No change needed for: ${filePath}`);
    }
  });
}

console.log('--- Step 1: Fixing product-services.html ---');
updateFileInRoots('product-services.html', (content) => {
  // 1. Remove 404 style.css
  content = content.replace(/<link\s+rel=["']stylesheet["']\s+href=["']css\/style\.css["']\s*\/?>\r?\n?/gi, '');

  // 2. Replace unthrottled video carousel script
  const oldScriptRegex = /<script>const track = document\.querySelector\('\.carousel-track'\);[\s\S]*?track\.addEventListener\('mouseleave', startAutoScroll\);[\s\S]*?<\/script>/gi;
  
  const refinedScript = `<script>
    (function () {
      const track = document.querySelector('.carousel-track');
      const section = document.getElementById('video-ads') || track;
      if (!track) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Clone items once to create seamless infinite loop
      const items = Array.from(track.querySelectorAll('.video-item'));
      if (items.length && !track.dataset.cloned) {
        track.dataset.cloned = 'true';
        items.forEach(function (item) {
          const clone = item.cloneNode(true);
          track.appendChild(clone);
        });
      }

      if (prefersReducedMotion) return;

      let isPaused = false;
      let isVisible = false;
      let rafId = null;
      let lastTime = performance.now();
      const speedPxPerSec = 35; // smooth 35px/s drift

      function step(currentTime) {
        const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
        lastTime = currentTime;

        if (!isPaused && isVisible) {
          track.scrollLeft += speedPxPerSec * delta;
          const halfWidth = track.scrollWidth / 2;
          if (halfWidth > 0 && track.scrollLeft >= halfWidth) {
            track.scrollLeft -= halfWidth;
          }
        }

        rafId = requestAnimationFrame(step);
      }

      function start() {
        if (!rafId && !prefersReducedMotion) {
          lastTime = performance.now();
          rafId = requestAnimationFrame(step);
        }
      }

      function stop() {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }

      // Intersection Observer - only run when section is actually on-screen
      if ('IntersectionObserver' in window && section) {
        const obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            isVisible = entry.isIntersecting;
            if (isVisible) {
              start();
            } else {
              stop();
            }
          });
        }, { threshold: 0.05 });
        obs.observe(section);
      } else {
        isVisible = true;
        start();
      }

      // Smooth interaction pauses
      track.addEventListener('pointerenter', function () { isPaused = true; });
      track.addEventListener('pointerleave', function () { isPaused = false; });
      track.addEventListener('pointerdown', function () { isPaused = true; });
      window.addEventListener('pointerup', function () { isPaused = false; });
      track.addEventListener('touchstart', function () { isPaused = true; }, { passive: true });
      track.addEventListener('touchend', function () { isPaused = false; }, { passive: true });
      track.addEventListener('focusin', function () { isPaused = true; });
      track.addEventListener('focusout', function () { isPaused = false; });
    })();
  </script>`;

  if (oldScriptRegex.test(content)) {
    content = content.replace(oldScriptRegex, refinedScript);
  } else {
    console.log('Video carousel script regex did not match directly, checking alternate match');
  }

  return content;
});

console.log('\n--- Step 2: Fixing scholarship.html ---');
updateFileInRoots('scholarship.html', (content) => {
  // 1. Remove 404 styles.css references
  content = content.replace(/<!--\s*<link href="css\/styles\.css" rel="stylesheet">\s*-->\r?\n?/gi, '');
  content = content.replace(/<link href="css\/styles\.css" rel="stylesheet">\r?\n?/gi, '');

  // 2. Wrap setHeroHeight and lastVh in safe closure and expose window.setHeroHeight
  // Locate the height-fix script block
  const oldHeightFix = /\/\/ Function to set hero height to exactly viewport height minus navbar[\s\S]*?let lastVh = window\.innerHeight;[\s\S]*?<\/script>/gi;

  const newHeightFix = `// Function to set hero height to exactly viewport height minus navbar
        function setHeroHeight() {
            const navbar = document.querySelector('nav') || document.querySelector('header') || document.querySelector('.navbar-container');
            const navbarHeight = navbar ? navbar.offsetHeight : 70;
            const heroSection = document.querySelector('.hero-section');

            const isMobile = window.innerWidth <= 767;
            const isTablet = window.innerWidth > 767 && window.innerWidth <= 1024;

            if (heroSection) {
                const exactHeight = window.innerHeight - navbarHeight;
                heroSection.style.height = '100vh';
                heroSection.style.minHeight = '100vh';
                heroSection.style.maxHeight = '100vh';
                heroSection.style.overflow = 'hidden';
                heroSection.style.display = 'flex';
                heroSection.style.alignItems = 'center';
                heroSection.style.justifyContent = 'center';
                heroSection.style.padding = '0';

                document.documentElement.style.setProperty('--hero-height', exactHeight + 'px');
                heroSection.setAttribute('data-viewport-adjusted', 'true');
                heroSection.setAttribute('data-mobile-view', isMobile ? 'true' : 'false');
                heroSection.setAttribute('data-tablet-view', isTablet ? 'true' : 'false');
            }
        }
        window.setHeroHeight = setHeroHeight;

        (function () {
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                setTimeout(setHeroHeight, 0);
            } else {
                document.addEventListener('DOMContentLoaded', () => setTimeout(setHeroHeight, 0));
            }

            window.addEventListener('load', setHeroHeight);

            let resizeTimer;
            window.addEventListener('resize', function() {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(setHeroHeight, 100);
            });

            [0, 100, 300, 500, 1000].forEach(d => setTimeout(setHeroHeight, d));

            const observer = new MutationObserver(() => setHeroHeight());
            observer.observe(document.body, {
                childList: true,
                subtree: false,
                attributes: false
            });

            window.addEventListener('orientationchange', function() {
                setTimeout(setHeroHeight, 200);
            });

            let scholarshipLastVh = window.innerHeight;
            window.addEventListener('scroll', function() {
                if (Math.abs(scholarshipLastVh - window.innerHeight) > 20) {
                    setHeroHeight();
                    scholarshipLastVh = window.innerHeight;
                }
            }, { passive: true });
        })();
    </script>`;

  if (oldHeightFix.test(content)) {
    content = content.replace(oldHeightFix, newHeightFix);
  }

  // 3. Ensure checkIncludeHtmlCompletion safely checks typeof setHeroHeight
  content = content.replace(
    /setTimeout\(setHeroHeight,\s*0\);/g,
    "if (typeof setHeroHeight === 'function') setTimeout(setHeroHeight, 0);"
  );
  content = content.replace(
    /setTimeout\(setHeroHeight,\s*100\);/g,
    "if (typeof setHeroHeight === 'function') setTimeout(setHeroHeight, 100);"
  );

  return content;
});

console.log('\n--- Step 3: Fixing about-us.html ---');
updateFileInRoots('about-us.html', (content) => {
  // 1. Remove 404 styles.css
  content = content.replace(/<link href="css\/styles\.css" rel="stylesheet"\s*\/?>\r?\n?/gi, '');

  // 2. Remove 404 scripts
  const deadScripts = [
    'mobile-menu-fix-new.js',
    'mobile-menu-position-fix.js',
    'mobile-menu-fix.js',
    'mobile-menu-button-fix.js',
    'direct-mobile-menu-fix.js',
    'direct-fix.js',
    'fix-hamburger-menu.js',
    'search-toggle-fix.js',
    'mobile-search-fix.js'
  ];

  deadScripts.forEach(script => {
    const reg = new RegExp(`<script src=["']js\\/${script}["']><\\/script>\\r?\\n?`, 'gi');
    content = content.replace(reg, '');
  });

  return content;
});

console.log('\n--- Step 4: Fixing how-it-works.html ---');
updateFileInRoots('how-it-works.html', (content) => {
  // Remove 404 styles.css
  content = content.replace(/<link href="css\/styles\.css" rel="stylesheet"\s*\/?>\r?\n?/gi, '');
  return content;
});

console.log('\n--- Step 5: Fixing contact.html & registration.html ---');
['contact.html', 'registration.html'].forEach(page => {
  updateFileInRoots(page, (content) => {
    content = content.replace(/<script src=["']js\/responsive-handler\.js["']><\/script>\r?\n?/gi, '');
    return content;
  });
});

console.log('\n--- Step 6: Polishing js/animation-fix.js ---');
updateFileInRoots('js/animation-fix.js', (content) => {
  // Add prefers-reduced-motion check and duplicate listener guard
  const improvedScript = `/**
 * Animation Fix Script
 * Ensures motion and reveals apply smoothly and respect prefers-reduced-motion.
 */
(function() {
    'use strict';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function applyAnimationFixes() {
        if (prefersReducedMotion) {
            // Under reduced motion, make all elements immediately visible without animation
            document.querySelectorAll('.scholarship-card, .float-animation, .animate-float, .slide-in-left, .slide-in-right, .slide-in-up, .animate-fadeIn').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
                el.style.animation = 'none';
                el.style.transition = 'none';
            });
            return;
        }

        // Apply smooth floating animations
        document.querySelectorAll('.float-animation').forEach(el => {
            if (!el.dataset.animFloat) {
                el.dataset.animFloat = 'true';
                el.style.animation = 'floatUpDown 4s ease-in-out infinite';
            }
        });

        document.querySelectorAll('.animate-float').forEach(el => {
            if (!el.dataset.animFloatIcon) {
                el.dataset.animFloatIcon = 'true';
                el.style.animation = 'floatIcon 3s ease-in-out infinite';
            }
        });

        // Scholarship cards smooth reveal and hover
        document.querySelectorAll('.scholarship-card').forEach((card, index) => {
            if (!card.classList.contains('scholarship-card-animated')) {
                card.classList.add('scholarship-card-animated');
                card.style.animationDelay = (index * 0.08) + 's';
            }
            if (!card.dataset.hoverBound) {
                card.dataset.hoverBound = 'true';
                card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-6px)';
                    card.style.boxShadow = '0 16px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -5px rgba(0, 0, 0, 0.04)';
                });
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0)';
                    card.style.boxShadow = '';
                });
            }
        });

        // Slide animations
        document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up').forEach(el => {
            if (getComputedStyle(el).opacity === '0') {
                el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                el.style.opacity = '1';
                el.style.transform = 'none';
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyAnimationFixes);
    } else {
        applyAnimationFixes();
    }
    window.addEventListener('load', applyAnimationFixes);
})();
`;
  return improvedScript;
});

console.log('\n--- Step 7: Polishing js/hamburger-menu-fix.js ---');
updateFileInRoots('js/hamburger-menu-fix.js', (content) => {
  // Replace the instant display='none' with smooth transition out
  const oldCloseRegex = /mobileMenu\.classList\.add\('hidden'\);\s*mobileMenu\.style\.display = 'none';\s*mobileMenu\.style\.opacity = '0';\s*mobileMenu\.style\.visibility = 'hidden';\s*mobileMenu\.style\.transform = 'translateY\(-8px\)';/gi;

  const newClose = `mobileMenu.style.opacity = '0';
                    mobileMenu.style.transform = 'translateY(-8px)';
                    setTimeout(() => {
                        if (mobileMenu.style.opacity === '0') {
                            mobileMenu.classList.add('hidden');
                            mobileMenu.style.display = 'none';
                            mobileMenu.style.visibility = 'hidden';
                        }
                    }, 250);`;

  if (oldCloseRegex.test(content)) {
    content = content.replace(oldCloseRegex, newClose);
  }

  // Also replace opening sequence to ensure transition triggers smoothly
  const oldOpenRegex = /mobileMenu\.classList\.remove\('hidden'\);\s*mobileMenu\.style\.display = 'block';\s*mobileMenu\.style\.opacity = '1';\s*mobileMenu\.style\.visibility = 'visible';\s*mobileMenu\.style\.transform = 'translateY\(0\)';/gi;

  const newOpen = `mobileMenu.classList.remove('hidden');
                    mobileMenu.style.display = 'block';
                    mobileMenu.style.visibility = 'visible';
                    mobileMenu.offsetHeight; // force reflow for smooth transition
                    mobileMenu.style.opacity = '1';
                    mobileMenu.style.transform = 'translateY(0)';`;

  if (oldOpenRegex.test(content)) {
    content = content.replace(oldOpenRegex, newOpen);
  }

  return content;
});

console.log('\n--- Step 8: Adding prefers-reduced-motion to tokens.css ---');
updateFileInRoots('css/shikshit/tokens.css', (content) => {
  if (!content.includes('prefers-reduced-motion')) {
    content += `\n\n/* Global Reduced Motion Preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
`;
  }
  return content;
});

console.log('\nAll updates applied successfully!');
