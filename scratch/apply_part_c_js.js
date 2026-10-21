const fs = require('fs');
const path = require('path');

const folders = ['public_html', 'public_html (77)'];

const memberDonateInnerJs = `
  /* ------------------------------------------------------------------------
     9. Animated Count-Up Utility (Part C)
     ------------------------------------------------------------------------ */
  function animateValue(obj, start, end, duration, prefix = '', suffix = '') {
    if (prefersReducedMotion) {
      obj.textContent = prefix + end.toLocaleString() + suffix;
      return;
    }
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // cubic ease out
      const current = Math.floor(easeProgress * (end - start) + start);
      obj.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.textContent = prefix + end.toLocaleString() + suffix;
      }
    };
    window.requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------------------
     10. Become a Member Animations (Theme: "Join the Journey")
     ------------------------------------------------------------------------ */
  function initMemberAnimations() {
    if (!document.body.classList.contains('page-member')) return;

    // A. Animate Prices Count-Up Once on View
    const cards = document.querySelectorAll('.membership-card');
    if (cards.length) {
      const cardObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            
            // Find price element inside card
            const priceEl = entry.target.querySelector('div.text-4xl, span.text-4xl, .text-3xl, .price');
            if (priceEl && !priceEl.dataset.counted) {
              priceEl.dataset.counted = 'true';
              const raw = priceEl.textContent.trim();
              const numMatch = raw.match(/[0-9,]+/);
              if (numMatch) {
                const targetNum = parseInt(numMatch[0].replace(/,/g, ''), 10);
                const prefix = raw.includes('₹') ? '₹' : '';
                const suffix = raw.split(numMatch[0])[1] || '';
                animateValue(priceEl, 0, targetNum, 1200, prefix, suffix);
              }
            }
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      cards.forEach(card => cardObserver.observe(card));
    }

    // B. Tilt on membership cards (pointer: fine only)
    if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      cards.forEach(card => {
        card.addEventListener('pointermove', e => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          const rotateX = (y / (rect.height / 2)) * -4;
          const rotateY = (x / (rect.width / 2)) * 4;
          card.style.transform = 'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-8px)';
        });
        card.addEventListener('pointerleave', () => {
          card.style.transform = '';
        });
      });
    }
  }

  /* ------------------------------------------------------------------------
     11. Donate Page Animations (Theme: "Light of Learning")
     ------------------------------------------------------------------------ */
  function initDonateAnimations() {
    if (!document.body.classList.contains('page-donate')) return;

    // A. Hero Headline Reveal & Arch Photo Zoom
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
      heroTitle.classList.add('hero-headline-reveal');
    }

    // B. Animate Impact Numbers Once on View
    const impactCards = document.querySelectorAll('#donate-form .flex.items-start');
    if (impactCards.length) {
      const impactObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const h4 = entry.target.querySelector('h4');
            if (h4 && !h4.dataset.counted) {
              h4.dataset.counted = 'true';
              const raw = h4.textContent.trim();
              const numMatch = raw.match(/[0-9,]+/);
              if (numMatch) {
                const targetNum = parseInt(numMatch[0].replace(/,/g, ''), 10);
                const prefix = raw.includes('₹') ? '₹' : '';
                const suffix = raw.split(numMatch[0])[1] || '';
                animateValue(h4, 0, targetNum, 1400, prefix, suffix);
              }
            }
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      impactCards.forEach(card => impactObs.observe(card));
    }

    // C. Tilt on Donation Card (pointer: fine only)
    if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const donateCard = document.querySelector('#donationForm') ? document.querySelector('#donationForm').closest('.bg-white') : null;
      if (donateCard) {
        donateCard.addEventListener('pointermove', e => {
          const rect = donateCard.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          const rotateX = (y / (rect.height / 2)) * -2.5;
          const rotateY = (x / (rect.width / 2)) * 2.5;
          donateCard.style.transform = 'perspective(1200px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg)';
        });
        donateCard.addEventListener('pointerleave', () => {
          donateCard.style.transform = '';
        });
      }
    }
  }
`;

for (const folder of folders) {
  const jsPath = path.join(__dirname, '..', folder, 'js', 'shikshit', 'inner.js');
  let jsContent = fs.readFileSync(jsPath, 'utf8');

  if (!jsContent.includes('initMemberAnimations')) {
    // Insert new functions before DOMContentLoaded
    jsContent = jsContent.replace(
      '/* ------------------------------------------------------------------------\n     Initialize on DOM Ready',
      memberDonateInnerJs + '\n  /* ------------------------------------------------------------------------\n     Initialize on DOM Ready'
    );

    // Call functions in DOMContentLoaded
    jsContent = jsContent.replace(
      'initFooterMotion();',
      'initFooterMotion();\n    initMemberAnimations();\n    initDonateAnimations();'
    );

    fs.writeFileSync(jsPath, jsContent, 'utf8');
    console.log(`Added Part C JS to ${folder}/js/shikshit/inner.js`);
  }
}

console.log('Part C JS updates complete.');
