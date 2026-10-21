const fs = require('fs');
const path = require('path');

function updateCss(filePath) {
  let css = fs.readFileSync(filePath, 'utf8');

  // 1. Top of file: fluid root size and scoping
  const oldTop = `/* Shikshit Products Page Base Scoping */
html {
  scroll-padding-top: 110px;
}`;

  const newTop = `/* ==========================================================================
   SHIKSHIT PRODUCTS & SERVICES PAGE STYLESHEET
   Scoped strictly under body.page-products & html:has(body.page-products)
   Presentation Fix: Wide Screen (1920px - 3840px) & Zoom Out (25% - 100%)
   ========================================================================== */

/* Fluid root size for big screens: scoped so it applies only to this page */
html:has(body.page-products) {
  font-size: 100%;
  scroll-padding-top: 6.875rem;
  scrollbar-gutter: stable;
}
@media (min-width: 1920px) {
  html:has(body.page-products) {
    font-size: 112.5%;
  }
}
@media (min-width: 2560px) {
  html:has(body.page-products) {
    font-size: 137.5%;
  }
}
@media (min-width: 3200px) {
  html:has(body.page-products) {
    font-size: 162.5%;
  }
}
@media (min-width: 3840px) {
  html:has(body.page-products) {
    font-size: 187.5%;
  }
}`;

  if (css.includes(oldTop)) {
    css = css.replace(oldTop, newTop);
  }

  // 2. body.page-products container definition & overflow
  css = css.replace(/body\.page-products\s*\{[^}]*font-family:\s*var\(--font-body\);[^}]*\}/s, `body.page-products {
  --container: min(92vw, 75rem);
  --nav-height: 5.5rem;
  font-family: var(--font-body);
  background: var(--page-bg-gradient);
  color: var(--color-secondary-text);
  overflow-x: clip !important;
  position: relative;
  padding-top: 0 !important; /* resets 100px padding-top inherited from sikshitnavbar.css */
}`);

  // 3. Blobs: size in vw with maximum
  css = css.replace(/\.products-blob-1\s*\{([^}]*)\}/s, (m, body) => {
    let b = body.replace(/width:\s*520px;/, 'width: min(35vw, 36rem);')
                .replace(/height:\s*520px;/, 'height: min(35vw, 36rem);');
    return `.products-blob-1 {${b}}`;
  });
  css = css.replace(/\.products-blob-2\s*\{([^}]*)\}/s, (m, body) => {
    let b = body.replace(/width:\s*580px;/, 'width: min(40vw, 40rem);')
                .replace(/height:\s*580px;/, 'height: min(40vw, 40rem);');
    return `.products-blob-2 {${b}}`;
  });
  css = css.replace(/\.products-blob-3\s*\{([^}]*)\}/s, (m, body) => {
    let b = body.replace(/width:\s*540px;/, 'width: min(38vw, 38rem);')
                .replace(/height:\s*540px;/, 'height: min(38vw, 38rem);');
    return `.products-blob-3 {${b}}`;
  });

  // Section blob size
  css = css.replace(/body\.page-products \.products-services-section::before\s*\{([^}]*)\}/s, (m, body) => {
    let b = body.replace(/width:\s*580px;/, 'width: min(40vw, 40rem);')
                .replace(/height:\s*580px;/, 'height: min(40vw, 40rem);');
    return `body.page-products .products-services-section::before {${b}}`;
  });

  // 4. Navbar pill container alignment
  css = css.replace(/body\.page-products \.shikshit-navbar\s*\{([^}]*)\}/s, (m, body) => {
    let b = body.replace(/width:\s*calc\(100% - 32px\)\s*!important;/, 'width: calc(var(--container) + 2rem) !important;')
                .replace(/max-width:\s*1200px\s*!important;/, 'max-width: calc(100% - 2rem) !important;')
                .replace(/height:\s*64px\s*!important;/, 'height: 4rem !important;')
                .replace(/padding:\s*8px 24px\s*!important;/, 'padding: 0.5rem 1.5rem !important;')
                .replace(/margin:\s*0 auto\s*!important;/, 'margin: 0 auto !important; margin-inline: auto !important;');
    return `body.page-products .shikshit-navbar {${b}}`;
  });

  // 5. Hero grid & scaling
  css = css.replace(/\.products-hero-grid\s*\{([^}]*)\}/s, (m, body) => {
    return `.products-hero-grid {
  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
  gap: 4rem !important;
  align-items: center !important;
  min-height: min(78vh, 52rem) !important;
  width: 100% !important;
  max-width: var(--container) !important;
  margin: 0 auto !important;
  margin-inline: auto !important;
  padding: 0 !important;
}`;
  });

  // Hero title clamp
  css = css.replace(/\.products-hero-title\s*\{([^}]*)\}/s, (m, body) => {
    let b = body.replace(/font-size:\s*clamp\([^;]*\);/, 'font-size: clamp(2.4rem, 3.4vw + 1rem, 5rem) !important;');
    return `.products-hero-title {${b}}`;
  });

  // Hero description size
  css = css.replace(/\.products-hero-desc\s*\{([^}]*)\}/s, (m, body) => {
    let b = body.replace(/font-size:\s*clamp\([^;]*\);/, 'font-size: max(1.125rem, 1.15vw) !important;')
                .replace(/max-width:\s*640px;/, 'max-width: 42rem;');
    return `.products-hero-desc {${b}}`;
  });

  // Hero tags font size & padding
  css = css.replace(/\.products-tag-pill\s*\{([^}]*)\}/s, (m, body) => {
    let b = body.replace(/font-size:\s*12\.5px\s*!important;/, 'font-size: max(0.875rem, 0.875rem) !important;')
                .replace(/padding:\s*6px 11px\s*!important;/, 'padding: 0.375rem 0.75rem !important;');
    return `.products-tag-pill {${b}}`;
  });

  // Hero Collage scaling in rem
  css = css.replace(/\.products-hero-visual\s*\{([^}]*)\}/s, (m, body) => {
    return `.products-hero-visual {
  position: relative !important;
  width: 100% !important;
  max-width: 33rem !important;
  height: 28.75rem !important;
  margin: 0 auto !important;
  display: grid !important;
  grid-template-columns: 17.8rem 14.7rem !important;
  column-gap: -1.25rem !important;
  align-items: center !important;
  justify-content: center !important;
  overflow: visible !important;
}`;
  });

  css = css.replace(/\.products-arch-frame\s*\{([^}]*)\}/s, (m, body) => {
    let b = body.replace(/width:\s*285px;/, 'width: 17.8rem;')
                .replace(/height:\s*400px;/, 'height: 25rem;')
                .replace(/border-radius:\s*28px\s*!important;/, 'border-radius: 1.75rem !important;')
                .replace(/border:\s*5px solid #FFFFFF\s*!important;/, 'border: 0.3125rem solid #FFFFFF !important;');
    return `.products-arch-frame {${b}}`;
  });

  css = css.replace(/\.products-blob-frame\s*\{([^}]*)\}/s, (m, body) => {
    let b = body.replace(/width:\s*235px;/, 'width: 14.7rem;')
                .replace(/height:\s*270px;/, 'height: 16.875rem;')
                .replace(/border-radius:\s*28px\s*!important;/, 'border-radius: 1.75rem !important;')
                .replace(/border:\s*5px solid #FFFFFF\s*!important;/, 'border: 0.3125rem solid #FFFFFF !important;')
                .replace(/margin-left:\s*-20px;/, 'margin-left: -1.25rem;')
                .replace(/margin-top:\s*60px;/, 'margin-top: 3.75rem;');
    return `.products-blob-frame {${b}}`;
  });

  css = css.replace(/\.products-stat-badge\s*\{([^}]*)\}/s, (m, body) => {
    let b = body.replace(/border-radius:\s*20px\s*!important;/, 'border-radius: 1.25rem !important;')
                .replace(/padding:\s*14px 20px\s*!important;/, 'padding: 0.875rem 1.25rem !important;')
                .replace(/gap:\s*12px\s*!important;/, 'gap: 0.75rem !important;');
    return `.products-stat-badge {${b}}`;
  });

  css = css.replace(/\.products-stat-badge-icon\s*\{([^}]*)\}/s, (m, body) => {
    let b = body.replace(/width:\s*44px;/, 'width: 2.75rem;')
                .replace(/height:\s*44px;/, 'height: 2.75rem;')
                .replace(/border-radius:\s*12px;/, 'border-radius: 0.75rem;')
                .replace(/font-size:\s*20px;/, 'font-size: 1.25rem;');
    return `.products-stat-badge-icon {${b}}`;
  });

  css = css.replace(/\.products-stat-badge-title\s*\{([^}]*)\}/s, (m, body) => {
    let b = body.replace(/font-size:\s*17px;/, 'font-size: 1.0625rem;');
    return `.products-stat-badge-title {${b}}`;
  });

  css = css.replace(/\.products-stat-badge-sub\s*\{([^}]*)\}/s, (m, body) => {
    let b = body.replace(/font-size:\s*12\.5px;/, 'font-size: max(0.875rem, 0.875rem);');
    return `.products-stat-badge-sub {${b}}`;
  });

  css = css.replace(/\.products-arch-tag\s*\{([^}]*)\}/s, (m, body) => {
    let b = body.replace(/font-size:\s*12\.5px\s*!important;/, 'font-size: max(0.875rem, 0.875rem) !important;')
                .replace(/padding:\s*7px 16px\s*!important;/, 'padding: 0.4375rem 1rem !important;');
    return `.products-arch-tag {${b}}`;
  });

  css = css.replace(/\.products-blob-tag\s*\{([^}]*)\}/s, (m, body) => {
    let b = body.replace(/font-size:\s*12px\s*!important;/, 'font-size: max(0.875rem, 0.875rem) !important;')
                .replace(/padding:\s*6px 14px\s*!important;/, 'padding: 0.375rem 0.875rem !important;');
    return `.products-blob-tag {${b}}`;
  });

  // 6. RIBBONS: FIX 3 - FIXED-HEIGHT SLOPE, NO ROTATE
  const ribbonBlockPattern = /\/\* --------------------------------------------------------------------------\s*1\. FULL-BLEED DUAL RIBBON MARQUEE \(Defect Fix 1\)[\s\S]*?@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?body\.page-products \.ribbon-track \{[\s\S]*?\}[\s\S]*?\}/;

  const newRibbonBlock = `/* --------------------------------------------------------------------------
   1. FIXED-HEIGHT SLOPE DUAL RIBBON MARQUEE (Fix 3: Presentation Scaling)
   - Replaces rotate(deg) with a fixed-height slope clip-path
   - Width is 100% of full-width wrapper (no 100vw, no scrollbar overflow)
   - Slope stays 1.4rem at every screen width
   - Bar height 3.5rem with 0.75rem overlap forming a tidy X only in the middle
   - 4rem clear space above and below
   -------------------------------------------------------------------------- */
body.page-products .products-hero-bands {
  position: relative !important;
  width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-top: 4rem !important;
  margin-bottom: 4rem !important;
  padding: 0 !important;
  height: 6.25rem !important;
  overflow: hidden !important;
  z-index: 10 !important;
  pointer-events: auto !important;
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%) !important;
  mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%) !important;
}

body.page-products .ribbon {
  position: absolute !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  max-width: none !important;
  height: 3.5rem !important;
  display: flex !important;
  align-items: center !important;
  overflow: hidden !important;
  user-select: none !important;
  transform: none !important;
}

/* Gradient bar on top, falling slope: 0 0, 100% 1.4rem, 100% 100%, 0 calc(100% - 1.4rem) */
body.page-products .ribbon-gradient {
  top: 0 !important;
  clip-path: polygon(0 0, 100% 1.4rem, 100% 100%, 0 calc(100% - 1.4rem)) !important;
  background: var(--signature-gradient) !important;
  color: #FFFFFF !important;
  box-shadow: 0 1rem 2.5rem rgba(192, 38, 211, 0.35) !important;
  z-index: 2 !important;
  max-width: none !important;
}

/* White bar overlapping lower edge by 0.75rem, rising slope: 0 1.4rem, 100% 0, 100% calc(100% - 1.4rem), 0 100% */
body.page-products .ribbon-white {
  top: 2.75rem !important; /* 3.5rem - 0.75rem overlap = 2.75rem */
  clip-path: polygon(0 1.4rem, 100% 0, 100% calc(100% - 1.4rem), 0 100%) !important;
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(14px) !important;
  -webkit-backdrop-filter: blur(14px) !important;
  color: var(--navy) !important;
  box-shadow: 0 0.75rem 2rem rgba(124, 58, 237, 0.12) !important;
  border-top: 1px solid rgba(124, 58, 237, 0.15) !important;
  border-bottom: 1px solid rgba(124, 58, 237, 0.15) !important;
  z-index: 1 !important;
  max-width: none !important;
}

body.page-products .ribbon-track {
  display: flex !important;
  align-items: center !important;
  width: max-content !important;
  background: transparent !important;
  will-change: transform !important;
}

body.page-products .track-left {
  animation: mqRibbonLeft 40s linear infinite !important;
}

body.page-products .track-right {
  animation: mqRibbonRight 55s linear infinite !important;
}

@keyframes mqRibbonLeft {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes mqRibbonRight {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}

body.page-products .products-hero-bands:hover .ribbon-track {
  animation-play-state: paused !important;
}

body.page-products .track-half {
  display: inline-flex !important;
  align-items: center !important;
  gap: 1.75rem !important;
  white-space: nowrap !important;
  font-weight: 800 !important;
  font-size: 1.05rem !important;
  letter-spacing: -0.01em !important;
  padding-right: 1.75rem !important;
}

body.page-products .track-half span:nth-child(even),
body.page-products .ribbon-dot {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 1.25rem !important;
  line-height: 1 !important;
  opacity: 0.85 !important;
}

body.page-products .ribbon-gradient .track-half span:nth-child(even) {
  color: #FBCFE8 !important;
}

body.page-products .ribbon-white .track-half span:nth-child(even) {
  color: var(--violet) !important;
}

@media (prefers-reduced-motion: reduce) {
  body.page-products .ribbon-track {
    animation: none !important;
    transform: none !important;
    justify-content: center !important;
    width: 100% !important;
  }
}`;

  if (ribbonBlockPattern.test(css)) {
    css = css.replace(ribbonBlockPattern, newRibbonBlock);
  } else {
    console.warn('Ribbon block pattern did not match directly, checking fallback');
  }

  // Also remove rotate(deg) in media queries for ribbons
  css = css.replace(/body\.page-products \.ribbon-gradient\s*\{\s*top:\s*22px;\s*transform:\s*rotate\(-1\.8deg\);\s*\}/g, 'body.page-products .ribbon-gradient { top: 0 !important; transform: none !important; }');
  css = css.replace(/body\.page-products \.ribbon-white\s*\{\s*top:\s*58px;\s*transform:\s*rotate\(1\.5deg\);\s*\}/g, 'body.page-products .ribbon-white { top: 2.75rem !important; transform: none !important; }');
  css = css.replace(/body\.page-products \.ribbon-gradient\s*\{\s*top:\s*18px;\s*transform:\s*rotate\(-1\.6deg\);\s*\}/g, 'body.page-products .ribbon-gradient { top: 0 !important; transform: none !important; }');
  css = css.replace(/body\.page-products \.ribbon-white\s*\{\s*top:\s*54px;\s*transform:\s*rotate\(1\.4deg\);\s*\}/g, 'body.page-products .ribbon-white { top: 2.75rem !important; transform: none !important; }');

  // 7. Section-index bar
  css = css.replace(/body\.page-products \.sticky-section-index\s*\{([^}]*)\}/s, (m, body) => {
    return `body.page-products .sticky-section-index {
  position: sticky !important;
  top: var(--nav-height) !important;
  z-index: 900 !important;
  width: 100% !important;
  max-width: var(--container) !important;
  margin: 0 auto 1.5rem !important;
  margin-inline: auto !important;
  padding: 0.625rem 0 !important;
  display: flex !important;
  justify-content: center !important;
  pointer-events: none !important;
  transition: top 0.25s ease !important;
}`;
  });

  css = css.replace(/body\.page-products \.index-pill\s*\{([^}]*)\}/s, (m, body) => {
    let b = body.replace(/min-height:\s*44px\s*!important;/, 'min-height: 2.75rem !important; height: 2.75rem !important;')
                .replace(/font-size:\s*13\.5px\s*!important;/, 'font-size: max(0.9375rem, 0.9375rem) !important;')
                .replace(/padding:\s*10px 18px\s*!important;/, 'padding: 0 1.25rem !important;');
    return `body.page-products .index-pill {${b}}`;
  });

  // 8. Product & Services Section container alignment
  css = css.replace(/body\.page-products \.products-services-section \.shikshit-container\s*\{([^}]*)\}/s, (m, body) => {
    return `body.page-products .products-services-section .shikshit-container {
  width: 100% !important;
  max-width: var(--container) !important;
  padding: 0 !important;
  margin: 0 auto !important;
  margin-inline: auto !important;
  position: relative !important;
  z-index: 1 !important;
}`;
  });

  // Sub-items descriptions font size >= 0.9375rem
  css = css.replace(/body\.page-products \.service-inner-item p\s*\{([^}]*)\}/s, (m, body) => {
    let b = body.replace(/font-size:\s*14px\s*!important;/, 'font-size: max(0.9375rem, 0.9375rem) !important;');
    return `body.page-products .service-inner-item p {${b}}`;
  });

  // Sub-items amount chips font size >= 0.875rem
  css = css.replace(/body\.page-products \.service-amount-pill\s*\{([^}]*)\}/s, (m, body) => {
    let b = body.replace(/font-size:\s*12\.5px\s*!important;/, 'font-size: max(0.875rem, 0.875rem) !important;')
                .replace(/padding:\s*4px 12px\s*!important;/, 'padding: 0.25rem 0.75rem !important;');
    return `body.page-products .service-amount-pill {${b}}`;
  });

  // Sub-item subtitle chips
  css = css.replace(/body\.page-products \.service-card-subtitle\s*\{([^}]*)\}/s, (m, body) => {
    let b = body.replace(/font-size:\s*13px\s*!important;/, 'font-size: max(0.875rem, 0.875rem) !important;');
    return `body.page-products .service-card-subtitle {${b}}`;
  });

  // 9. Diploma courses container alignment
  css = css.replace(/body\.page-products #diploma-courses > div\s*\{([^}]*)\}/s, (m, body) => {
    return `body.page-products #diploma-courses > div {
  width: 100% !important;
  max-width: var(--container) !important;
  margin: 0 auto !important;
  margin-inline: auto !important;
}`;
  });

  css = css.replace(/body\.page-products \.diploma-cards-grid\s*\{([^}]*)\}/s, (m, body) => {
    let b = body.replace(/max-width:\s*1200px;/, 'width: 100% !important; max-width: var(--container) !important; margin-inline: auto !important;');
    return `body.page-products .diploma-cards-grid {${b}}`;
  });

  // 10. Video carousel container alignment
  css = css.replace(/body\.page-products \.video-carousel\s*\{([^}]*)\}/s, (m, body) => {
    return `body.page-products .video-carousel {
  width: 100% !important;
  max-width: var(--container) !important;
  margin: 0 auto !important;
  margin-inline: auto !important;
  padding: 5rem 0 !important;
  position: relative;
  overflow: hidden;
}`;
  });

  // 11. Closing CTA band
  css = css.replace(/\.products-cta-band\s*\{([^}]*)\}/s, (m, body) => {
    return `.products-cta-band {
  width: 100% !important;
  max-width: var(--container) !important;
  margin: 2.5rem auto 5rem !important;
  margin-inline: auto !important;
  padding: 0 !important;
  position: relative;
  z-index: 2;
}`;
  });

  // 12. Footer container alignment
  css = css.replace(/body\.page-products \.footer-editorial \.shikshit-container,\s*\.footer-editorial \.shikshit-container\s*\{([^}]*)\}/s, (m, body) => {
    return `body.page-products .footer-editorial .shikshit-container,
.footer-editorial .shikshit-container {
  width: 100% !important;
  max-width: var(--container) !important;
  margin: 0 auto !important;
  margin-inline: auto !important;
  padding: 0 !important;
}`;
  });

  css = css.replace(/body\.page-products \.footer-editorial \.shikshit-container\s*\{[^}]*max-width:\s*1240px;[^}]*\}/s, `body.page-products .footer-editorial .shikshit-container {
  width: 100% !important;
  max-width: var(--container) !important;
  margin: 0 auto !important;
  margin-inline: auto !important;
  padding: 0 !important;
}`);

  // Write updated css
  fs.writeFileSync(filePath, css, 'utf8');
  console.log(`Updated: ${filePath}`);
}

const f1 = path.resolve('public_html/css/shikshit/products.css');
const f2 = path.resolve('public_html (77)/css/shikshit/products.css');

updateCss(f1);
updateCss(f2);
