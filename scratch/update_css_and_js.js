const fs = require('fs');
const path = require('path');

const cssAdditions = `
/* ==========================================================================
   PRODUCT & SERVICES RESTYLED SECTION (Strictly Scoped under body.page-products)
   Layout: 3-column desktop grid (2 tablet, 1 mobile), 28px gap, same-height cards.
   Card: 32px radius, 1px lavender border, 0 14px 44px soft violet shadow, 32px padding.
   01-06 faded outlined numeral watermarks, 60px category gradient circles,
   light 2-column sub-items (#F7F5FF fill, 18px radius, 14px padding, 36px icon circle,
   amount pills), interactive cursor-following glow, border sweep, 3D tilt, and stagger.
   ========================================================================== */

body.page-products .products-services-section {
  position: relative !important;
  z-index: 2 !important;
  padding: 100px 0 !important;
  overflow: hidden !important;
  background: transparent !important;
}

body.page-products .products-services-section::before {
  content: '';
  position: absolute;
  top: 15%;
  left: 8%;
  width: 580px;
  height: 580px;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, rgba(236, 72, 153, 0.04) 50%, transparent 70%);
  filter: blur(80px);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  animation: driftSectionBlob 24s ease-in-out infinite alternate;
}

@keyframes driftSectionBlob {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(45px, -35px) scale(1.09); }
}

body.page-products .products-services-section .shikshit-container {
  max-width: 1200px !important;
  padding: 0 24px !important;
  margin: 0 auto !important;
  position: relative !important;
  z-index: 1 !important;
}

/* Section Header */
body.page-products .products-services-section .shikshit-section-header {
  text-align: center !important;
  margin-bottom: 56px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
}

body.page-products .products-services-section .shikshit-chip {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  background: #EDE9FE !important;
  color: var(--violet) !important;
  border: 1px solid rgba(124, 58, 237, 0.18) !important;
  border-radius: var(--radius-pill) !important;
  padding: 7px 18px !important;
  font-size: 13px !important;
  font-weight: 700 !important;
  letter-spacing: 0.04em !important;
  text-transform: uppercase !important;
  margin-bottom: 18px !important;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.08) !important;
}

/* Heading with Word-Slide Mask & Self-Drawing Signature Underline */
body.page-products .products-section-heading {
  font-size: clamp(2.2rem, 4.4vw, 3.4rem) !important;
  font-weight: 800 !important;
  color: var(--navy) !important;
  text-align: center !important;
  line-height: 1.16 !important;
  letter-spacing: -0.03em !important;
  margin: 0 0 20px 0 !important;
  position: relative !important;
  display: inline-block !important;
  padding-bottom: 12px !important;
}

body.page-products .products-section-heading .heading-line {
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
}

body.page-products .products-section-heading .heading-word {
  display: inline-block;
  transform: translateY(115%);
  opacity: 0;
  transition: transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.75s ease;
}

body.page-products .products-section-heading.in-view .heading-word {
  transform: translateY(0);
  opacity: 1;
}

body.page-products .products-section-heading .heading-word:nth-child(1) { transition-delay: 0.05s; }
body.page-products .products-section-heading .heading-word:nth-child(2) { transition-delay: 0.12s; }
body.page-products .products-section-heading .heading-word:nth-child(3) { transition-delay: 0.19s; }

body.page-products .editorial-heading-underline {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -4px;
  width: 280px;
  height: 18px;
  pointer-events: none;
  overflow: visible;
}

body.page-products .editorial-heading-underline path {
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
  transition: stroke-dashoffset 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.35s;
}

body.page-products .products-section-heading.in-view .editorial-heading-underline path {
  stroke-dashoffset: 0;
}

body.page-products .products-services-section .shikshit-section-subtitle {
  font-size: 1.1rem !important;
  color: var(--ink) !important;
  max-width: 640px !important;
  margin: 0 auto !important;
  line-height: 1.65 !important;
  text-align: center !important;
}

/* 3-Column Desktop Grid */
body.page-products .services-editorial-grid {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important;
  gap: 28px !important;
  align-items: stretch !important;
  margin-top: 48px !important;
  perspective: 1200px;
}

@media (max-width: 1024px) {
  body.page-products .services-editorial-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 24px !important;
  }
}

@media (max-width: 720px) {
  body.page-products .services-editorial-grid {
    grid-template-columns: 1fr !important;
    gap: 22px !important;
  }
}

/* The Category Card */
body.page-products .service-editorial-card {
  position: relative !important;
  background: #FFFFFF !important;
  border-radius: 32px !important;
  border: 1px solid rgba(124, 58, 237, 0.12) !important;
  box-shadow: 0 14px 44px rgba(124, 58, 237, 0.11) !important;
  padding: 32px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: flex-start !important;
  height: 100% !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
  isolation: isolate;
  scroll-margin-top: 155px !important;
  opacity: 0;
  transform: translateY(34px) scale(0.97);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.7s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.4s ease,
              border-color 0.4s ease !important;
}

body.page-products .service-editorial-card.in-view {
  opacity: 1 !important;
  transform: translateY(0) scale(1) !important;
}

/* Stagger between cards on entry */
body.page-products .service-editorial-card:nth-child(1) { transition-delay: 0.08s !important; }
body.page-products .service-editorial-card:nth-child(2) { transition-delay: 0.16s !important; }
body.page-products .service-editorial-card:nth-child(3) { transition-delay: 0.24s !important; }
body.page-products .service-editorial-card:nth-child(4) { transition-delay: 0.32s !important; }
body.page-products .service-editorial-card:nth-child(5) { transition-delay: 0.40s !important; }
body.page-products .service-editorial-card:nth-child(6) { transition-delay: 0.48s !important; }

/* Large Faded Outlined Numeral Watermark (01 to 06) */
body.page-products .service-editorial-card::after {
  position: absolute;
  top: 16px;
  right: 22px;
  font-family: var(--font-display, 'Plus Jakarta Sans', sans-serif);
  font-size: clamp(3.2rem, 4.8vw, 4.4rem);
  font-weight: 900;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(124, 58, 237, 0.16);
  pointer-events: none;
  user-select: none;
  z-index: 1;
  transition: transform 0.35s ease, -webkit-text-stroke-color 0.35s ease;
}

body.page-products .service-editorial-card[data-card="01"]::after { content: '01'; }
body.page-products .service-editorial-card[data-card="02"]::after { content: '02'; }
body.page-products .service-editorial-card[data-card="03"]::after { content: '03'; }
body.page-products .service-editorial-card[data-card="04"]::after { content: '04'; }
body.page-products .service-editorial-card[data-card="05"]::after { content: '05'; }
body.page-products .service-editorial-card[data-card="06"]::after { content: '06'; }

/* Cursor-Following Radial Glow & Sweeping Hairline Border */
body.page-products .service-editorial-card {
  --mouse-x: 50%;
  --mouse-y: 50%;
}

body.page-products .service-editorial-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(380px circle at var(--mouse-x) var(--mouse-y), rgba(124, 58, 237, 0.08), transparent 60%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

body.page-products .card-border-glow {
  position: absolute;
  inset: -1px;
  border-radius: 33px;
  padding: 1.5px;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.4), rgba(192, 38, 211, 0.4), rgba(236, 72, 153, 0.4), rgba(124, 58, 237, 0.4));
  background-size: 300% 300%;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0.3;
  transition: opacity 0.35s ease;
  z-index: 2;
}

@media (hover: hover) and (pointer: fine) {
  body.page-products .service-editorial-card:hover,
  body.page-products .service-editorial-card:focus-within {
    transform: translateY(-8px) scale(1.01) !important;
    box-shadow: 0 24px 60px rgba(124, 58, 237, 0.2) !important;
    border-color: rgba(124, 58, 237, 0.32) !important;
  }

  body.page-products .service-editorial-card:hover::before {
    opacity: 1;
  }

  body.page-products .service-editorial-card:hover .card-border-glow,
  body.page-products .service-editorial-card:focus-within .card-border-glow {
    opacity: 1;
    animation: borderSweep 4s linear infinite;
  }

  body.page-products .service-editorial-card:hover .service-card-icon {
    transform: rotate(-8deg) scale(1.1) !important;
  }

  body.page-products .service-editorial-card:hover::after {
    transform: translate(-4px, -4px);
    -webkit-text-stroke-color: rgba(124, 58, 237, 0.45);
  }
}

@keyframes borderSweep {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Card Header */
body.page-products .service-card-header {
  display: flex !important;
  align-items: center !important;
  gap: 16px !important;
  margin-bottom: 10px !important;
  position: relative !important;
  z-index: 3 !important;
}

body.page-products .service-card-icon {
  width: 60px !important;
  height: 60px !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-shrink: 0 !important;
  box-shadow: 0 8px 22px rgba(124, 58, 237, 0.22) !important;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
  animation: gentleIconFloat 5s ease-in-out infinite alternate !important;
}

@keyframes gentleIconFloat {
  0% { transform: translateY(-5px); }
  100% { transform: translateY(5px); }
}

/* Category Gradient Variations */
body.page-products .icon-grad-1 { background: linear-gradient(135deg, #7C3AED, #C026D3) !important; animation-delay: 0s !important; }
body.page-products .icon-grad-2 { background: linear-gradient(135deg, #EC4899, #F97316) !important; animation-delay: 0.8s !important; }
body.page-products .icon-grad-3 { background: linear-gradient(135deg, #6366F1, #06B6D4) !important; animation-delay: 1.6s !important; }
body.page-products .icon-grad-4 { background: linear-gradient(135deg, #C026D3, #EC4899) !important; animation-delay: 2.4s !important; }
body.page-products .icon-grad-5 { background: linear-gradient(135deg, #0B0B3B, #7C3AED) !important; animation-delay: 3.2s !important; }
body.page-products .icon-grad-6 { background: linear-gradient(135deg, #7C3AED, #06B6D4) !important; animation-delay: 4.0s !important; }

body.page-products .card-header-emoji {
  font-size: 26px !important;
  line-height: 1 !important;
  display: block !important;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25));
}

body.page-products .service-card-title {
  font-size: 1.4rem !important;
  font-weight: 800 !important;
  color: var(--navy) !important;
  line-height: 1.22 !important;
  margin: 0 0 4px !important;
  letter-spacing: -0.02em !important;
}

body.page-products .service-card-subtitle {
  font-size: 13px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.08em !important;
  font-weight: 700 !important;
  color: var(--violet) !important;
  margin: 0 !important;
}

body.page-products .card-accent-line {
  width: 0;
  height: 3px;
  background: var(--signature-gradient);
  border-radius: 999px;
  margin: 8px 0 20px;
  transition: width 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;
}

body.page-products .service-editorial-card.in-view .card-accent-line {
  width: 48px;
}

/* Sub-Items: Clean 2-Column Grid of Light Items */
body.page-products .service-inner-grid {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
  gap: 12px !important;
  width: 100% !important;
  position: relative !important;
  z-index: 3 !important;
  align-items: stretch !important;
}

@media (max-width: 480px) {
  body.page-products .service-inner-grid {
    grid-template-columns: 1fr !important;
  }
}

body.page-products .service-inner-item {
  background: #F7F5FF !important;
  border: none !important;
  border-radius: 18px !important;
  padding: 14px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  justify-content: flex-start !important;
  box-sizing: border-box !important;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              background 0.25s ease,
              box-shadow 0.25s ease !important;
  opacity: 0;
  transform: translateY(16px);
}

body.page-products .service-editorial-card.in-view .service-inner-item {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

/* Cascading stagger per sub-item (60ms) after card appears */
body.page-products .service-editorial-card.in-view .service-inner-item:nth-child(1) { transition-delay: 0.12s !important; }
body.page-products .service-editorial-card.in-view .service-inner-item:nth-child(2) { transition-delay: 0.18s !important; }
body.page-products .service-editorial-card.in-view .service-inner-item:nth-child(3) { transition-delay: 0.24s !important; }
body.page-products .service-editorial-card.in-view .service-inner-item:nth-child(4) { transition-delay: 0.30s !important; }
body.page-products .service-editorial-card.in-view .service-inner-item:nth-child(5) { transition-delay: 0.36s !important; }
body.page-products .service-editorial-card.in-view .service-inner-item:nth-child(6) { transition-delay: 0.42s !important; }

body.page-products .service-inner-item:hover {
  transform: translateX(4px) !important;
  background: linear-gradient(135deg, #EDE9FE 0%, #F5F3FF 100%) !important;
  box-shadow: 0 6px 18px rgba(124, 58, 237, 0.09) !important;
}

body.page-products .item-icon-circle {
  width: 36px !important;
  height: 36px !important;
  border-radius: 50% !important;
  background: rgba(124, 58, 237, 0.1) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 17px !important;
  flex-shrink: 0 !important;
  margin-bottom: 10px !important;
  transition: background 0.25s ease, transform 0.25s ease !important;
}

body.page-products .service-inner-item:hover .item-icon-circle {
  background: var(--signature-gradient) !important;
  transform: scale(1.08) !important;
}

body.page-products .item-body {
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  width: 100% !important;
  height: 100% !important;
}

body.page-products .service-inner-item h5 {
  font-size: 15.5px !important;
  font-weight: 700 !important;
  color: var(--navy) !important;
  margin: 0 0 6px !important;
  line-height: 1.3 !important;
}

body.page-products .service-inner-item p {
  font-size: 14px !important;
  line-height: 1.6 !important;
  color: var(--ink) !important;
  margin: 0 0 auto !important;
}

/* Amount Pill Chip */
body.page-products .service-amount-pill {
  display: inline-flex !important;
  align-items: center !important;
  margin-top: 10px !important;
  padding: 4px 12px !important;
  border-radius: var(--radius-pill) !important;
  background: #EDE9FE !important;
  color: var(--violet) !important;
  font-size: 12.5px !important;
  font-weight: 700 !important;
  letter-spacing: 0.01em !important;
  border: 1px solid rgba(124, 58, 237, 0.16) !important;
  transition: transform 0.25s ease !important;
}

body.page-products .service-inner-item:hover .service-amount-pill {
  animation: amountChipPulse 0.5s ease-in-out 1 !important;
}

@keyframes amountChipPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

/* Shorter Card (Diploma Courses, 2 items) Balanced with Decorative Glow & Badge */
body.page-products .service-editorial-card.card-diploma {
  background: radial-gradient(circle at 85% 85%, rgba(124, 58, 237, 0.07) 0%, rgba(192, 38, 211, 0.03) 50%, #FFFFFF 85%) !important;
}

body.page-products .diploma-balance-ornament {
  margin-top: auto !important;
  padding-top: 18px !important;
  width: 100% !important;
  position: relative !important;
  z-index: 3 !important;
}

body.page-products .diploma-ornament-badge {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  padding: 14px 18px !important;
  border-radius: 18px !important;
  background: linear-gradient(135deg, rgba(237, 233, 254, 0.75), rgba(247, 245, 255, 0.9)) !important;
  border: 1.5px dashed rgba(124, 58, 237, 0.28) !important;
  color: var(--navy) !important;
  font-size: 13.5px !important;
  font-weight: 700 !important;
  box-shadow: 0 4px 16px rgba(124, 58, 237, 0.06) !important;
}

body.page-products .diploma-ornament-badge svg {
  color: var(--violet) !important;
  flex-shrink: 0 !important;
}

/* Visible Focus Rings (3px violet) */
body.page-products .service-editorial-card:focus-visible,
body.page-products .service-inner-item:focus-visible,
body.page-products a:focus-visible,
body.page-products button:focus-visible {
  outline: 3px solid var(--violet) !important;
  outline-offset: 3px !important;
}

/* Prefers Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  body.page-products .products-services-section::before,
  body.page-products .service-editorial-card,
  body.page-products .service-inner-item,
  body.page-products .service-card-icon,
  body.page-products .card-accent-line,
  body.page-products .heading-word,
  body.page-products .editorial-heading-underline path,
  body.page-products .card-border-glow {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    opacity: 1 !important;
    stroke-dashoffset: 0 !important;
    width: 48px !important;
  }
}
`;

function updateCss(cssPath) {
  let content = fs.readFileSync(cssPath, 'utf8');

  // Replace old Section 3 styling (from "3. SECTION LAYOUT & BENTO "TICKET/PASS" STYLING" to before "8. UGC APPROVED DIPLOMA COURSES SECTION" or "4. VIDEO")
  const section3Regex = /\/\* -{50,}\r?\n\s*3\.\s*SECTION LAYOUT & BENTO "TICKET\/PASS" STYLING[\s\S]*?(?=\/\* -{50,}\r?\n\s*(?:4\.|8\.|5\.|7\.|\/\* -{50,}))/;

  if (section3Regex.test(content)) {
    content = content.replace(section3Regex, cssAdditions);
    console.log(`Replaced Section 3 styling in ${cssPath}`);
  } else {
    // If not found, append to end
    content += '\n' + cssAdditions;
    console.log(`Appended new Section 3 styling to ${cssPath}`);
  }

  fs.writeFileSync(cssPath, content, 'utf8');
}

const c1 = path.join(__dirname, '..', 'public_html', 'css', 'shikshit', 'products.css');
const c2 = path.join(__dirname, '..', 'public_html (77)', 'css', 'shikshit', 'products.css');

updateCss(c1);
updateCss(c2);
console.log('Finished updating products.css in both folders.');

// 2. Update js/shikshit/inner.js
const jsAdditions = `
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
`;

function updateJs(jsPath) {
  let content = fs.readFileSync(jsPath, 'utf8');

  // Insert initProductServicesMotion before initDiplomaCardsInteraction or DOMContentLoaded
  if (!content.includes('initProductServicesMotion')) {
    const insertPoint = '  /* ------------------------------------------------------------------------\n     Initialize on DOM Ready';
    content = content.replace(insertPoint, jsAdditions + '\n' + insertPoint);

    // Also call it in DOMContentLoaded
    content = content.replace(
      'initDiplomaCardsInteraction();',
      'initDiplomaCardsInteraction();\n    initProductServicesMotion();'
    );
    console.log(`Added initProductServicesMotion to ${jsPath}`);
  } else {
    console.log(`initProductServicesMotion already exists in ${jsPath}`);
  }

  fs.writeFileSync(jsPath, content, 'utf8');
}

const j1 = path.join(__dirname, '..', 'public_html', 'js', 'shikshit', 'inner.js');
const j2 = path.join(__dirname, '..', 'public_html (77)', 'js', 'shikshit', 'inner.js');

updateJs(j1);
updateJs(j2);
console.log('Finished updating inner.js in both folders.');
