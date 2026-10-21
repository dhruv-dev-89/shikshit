const fs = require('fs');

function fixProductsCss(filePath) {
  let css = fs.readFileSync(filePath, 'utf8');

  // 1. Fix Navbar width and padding
  css = css.replace(
    /body\.page-products \.shikshit-navbar\s*\{[^}]*width:\s*calc\(var\(--container\)\s*\+\s*2rem\)\s*!important;[^}]*\}/g,
    `body.page-products .shikshit-navbar {
  pointer-events: auto !important;
  position: relative !important;
  width: var(--container) !important;
  max-width: var(--container) !important;
  margin: 0 auto !important;
  margin-inline: auto !important;
  left: 0 !important;
  right: 0 !important;
  height: 4rem !important;
  padding: 0.5rem 1.5rem !important;
  background: rgba(255, 255, 255, 0.90) !important;
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
  border-radius: 999px !important;
  border: 1px solid rgba(124, 58, 237, 0.14) !important;
  box-shadow: 0 10px 30px rgba(11, 11, 59, 0.08) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  box-sizing: border-box !important;
}`
  );

  // Also fix .shikshit-header padding
  css = css.replace(
    /body\.page-products \.shikshit-header\s*\{[^}]*padding:\s*0\s*16px\s*!important;[^}]*\}/g,
    `body.page-products .shikshit-header {
  position: sticky !important;
  top: 28px !important;
  z-index: 1000 !important;
  width: 100% !important;
  padding: 0 !important;
  margin-top: 28px !important;
  margin-bottom: 0 !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  pointer-events: none !important;
  overflow: visible !important;
}`
  );

  // 2. Fix Card width and collapse in .services-editorial-grid
  // Ensure .service-editorial-card has width: 100% !important; min-width: 0 !important; opacity: 1 !important; transform: none !important;
  css = css.replace(
    /body\.page-products \.service-editorial-card\s*\{([\s\S]*?)opacity:\s*0;([\s\S]*?)transform:\s*translateY\(34px\)\s*scale\(0\.97\);/g,
    `body.page-products .service-editorial-card {
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
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
  isolation: isolate;
  scroll-margin-top: 155px !important;
  opacity: 1 !important;
  transform: none !important;`
  );

  // 3. Fix erroneous #diploma-courses section override that distorted Card 06
  css = css.replace(
    /body\.page-products #diploma-courses\s*\{[^}]*padding:\s*100px\s*24px\s*!important;[^}]*background:\s*#F8FAFC\s*!important;[^}]*\}/g,
    `/* Card 06 Diploma Courses retains uniform editorial card styling */
body.page-products #diploma-courses.service-editorial-card {
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
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  scroll-margin-top: 155px !important;
  opacity: 1 !important;
  transform: none !important;
}`
  );

  css = css.replace(
    /body\.page-products #diploma-courses\s*>\s*div\s*\{[^}]*width:\s*100%\s*!important;[^}]*max-width:\s*var\(--container\)\s*!important;[^}]*\}/g,
    `body.page-products #diploma-courses > div {
  width: auto !important;
  max-width: none !important;
  margin: 0 !important;
}`
  );

  // 4. Remove or replace reduced-motion blocks that kill animations
  // Block 1: ribbons
  css = css.replace(
    /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{\s*body\.page-products\s*\.ribbon-track\s*\{[^}]*animation:\s*none\s*!important;[^}]*\}\s*\}/g,
    `/* Marquee ribbon animations preserved */`
  );

  // Block 2: services & cards
  css = css.replace(
    /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{\s*body\.page-products\s*\.products-services-section::before[\s\S]*?width:\s*48px\s*!important;\s*\}\s*\}/g,
    `/* Card transitions & animations preserved */`
  );

  // Block 3: hero visuals & blobs
  css = css.replace(
    /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{\s*\.products-blob-1[\s\S]*?transform:\s*none\s*!important;\s*\}\s*\}/g,
    `/* Ambient blob and frame animations preserved */`
  );

  // 5. Append guaranteed motion enforcement for body.page-products at the end
  const motionEnforcement = `
/* ==========================================================================
   GUARANTEED HARDWARE-ACCELERATED MOTION & ANIMATIONS ON PRODUCT-SERVICES
   ========================================================================== */
body.page-products .products-blob-1 {
  animation: driftBlob1 24s ease-in-out infinite alternate !important;
  animation-duration: 24s !important;
  animation-iteration-count: infinite !important;
  will-change: transform;
}

body.page-products .products-blob-2 {
  animation: driftBlob2 28s ease-in-out infinite alternate !important;
  animation-duration: 28s !important;
  animation-iteration-count: infinite !important;
  will-change: transform;
}

body.page-products .products-blob-3 {
  animation: driftBlob1 30s ease-in-out infinite alternate-reverse !important;
  animation-duration: 30s !important;
  animation-iteration-count: infinite !important;
  will-change: transform;
}

body.page-products .products-arch-frame {
  animation: collageFloat1 6s ease-in-out infinite alternate !important;
  animation-duration: 6s !important;
  animation-iteration-count: infinite !important;
  will-change: transform;
}

body.page-products .products-blob-frame {
  animation: collageFloat2 6s ease-in-out infinite alternate 1.5s !important;
  animation-duration: 6s !important;
  animation-iteration-count: infinite !important;
  will-change: transform;
}

body.page-products .products-stat-badge {
  animation: gentleFloat 6s ease-in-out infinite !important;
  animation-duration: 6s !important;
  animation-iteration-count: infinite !important;
  will-change: transform;
}

body.page-products .ribbon-track.track-left {
  animation: mqRibbonLeft 40s linear infinite !important;
  animation-duration: 40s !important;
  animation-iteration-count: infinite !important;
  animation-play-state: running !important;
  will-change: transform;
}

body.page-products .ribbon-track.track-right {
  animation: mqRibbonRight 55s linear infinite !important;
  animation-duration: 55s !important;
  animation-iteration-count: infinite !important;
  animation-play-state: running !important;
  will-change: transform;
}

body.page-products .products-hero-bands:hover .ribbon-track {
  animation-play-state: paused !important;
}

body.page-products .service-card-icon {
  animation: gentleIconFloat 4s ease-in-out infinite alternate !important;
  animation-duration: 4s !important;
  animation-iteration-count: infinite !important;
}

body.page-products .card-border-glow {
  animation: borderSweep 8s linear infinite !important;
  animation-duration: 8s !important;
  animation-iteration-count: infinite !important;
}

body.page-products .footer-editorial {
  animation: footerBgDrift 20s ease-in-out infinite alternate !important;
  animation-duration: 20s !important;
  animation-iteration-count: infinite !important;
}

/* Service cards grid full width & item safety */
body.page-products .services-editorial-grid {
  width: 100% !important;
  min-width: 0 !important;
}

body.page-products .service-editorial-card {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  opacity: 1 !important;
  transform: none !important;
}

body.page-products .service-card-header {
  width: 100% !important;
  min-width: 0 !important;
}

body.page-products .service-inner-grid {
  width: 100% !important;
  min-width: 0 !important;
}
`;

  if (!css.includes('GUARANTEED HARDWARE-ACCELERATED MOTION')) {
    css += motionEnforcement;
  }

  fs.writeFileSync(filePath, css, 'utf8');
  console.log(`Updated ${filePath}`);
}

fixProductsCss('public_html/css/shikshit/products.css');
fixProductsCss('public_html (77)/css/shikshit/products.css');
