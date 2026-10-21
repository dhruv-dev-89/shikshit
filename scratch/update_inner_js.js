const fs = require('fs');

const additionCode = `
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
      'body.page-donate .py-16.lg\\\\:py-24.bg-white > div'
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
`;

function updateInnerJs(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  if (code.includes('function initFooterMotion()')) {
    console.log(filePath + ' already contains initFooterMotion');
    return;
  }

  const markerRegex = /\/\*\s*-+\s*Initialize on DOM Ready/i;
  if (markerRegex.test(code)) {
    code = code.replace(markerRegex, additionCode + '\n  /* ------------------------------------------------------------------------\n     Initialize on DOM Ready');
    fs.writeFileSync(filePath, code, 'utf8');
    console.log('Successfully updated ' + filePath);
  } else {
    console.error('Could not find marker in ' + filePath);
  }
}

updateInnerJs('public_html/js/shikshit/inner.js');
updateInnerJs('public_html (77)/js/shikshit/inner.js');
