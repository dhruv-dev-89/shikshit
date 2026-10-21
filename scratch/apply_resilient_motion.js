const fs = require('fs');

function updateProductsCss(filePath) {
  let css = fs.readFileSync(filePath, 'utf8');

  // 1. Update keyframes mqRibbonLeft and mqRibbonRight to include both transform and translate
  css = css.replace(
    /@keyframes mqRibbonLeft\s*\{[\s\S]*?100%\s*\{[\s\S]*?\}\s*\}/g,
    `@keyframes mqRibbonLeft {
  0% {
    transform: translateX(0);
    translate: 0 0;
  }
  100% {
    transform: translateX(-50%);
    translate: -50% 0;
  }
}`
  );

  css = css.replace(
    /@keyframes mqRibbonRight\s*\{[\s\S]*?100%\s*\{[\s\S]*?\}\s*\}/g,
    `@keyframes mqRibbonRight {
  0% {
    transform: translateX(-50%);
    translate: -50% 0;
  }
  100% {
    transform: translateX(0);
    translate: 0 0;
  }
}`
  );

  // 2. Remove hover pause on ribbons so they NEVER stop moving
  css = css.replace(
    /body\.page-products\s*\.products-hero-bands:hover\s*\.ribbon-track\s*\{[^}]*animation-play-state:\s*paused[^}]*\}/g,
    `/* Continuous ribbon motion - hover pause removed */`
  );

  // 3. Make products-hero-bands pointer-events: none so clicks pass through and mouse never halts them
  css = css.replace(
    /pointer-events:\s*auto\s*!important;\s*\/\*\s*allows\s*hover\s*to\s*pause\s*ribbon\s*marquee\s*\*\//g,
    `pointer-events: none !important; /* ensures ribbons never freeze on hover */`
  );

  css = css.replace(
    /body\.page-products\s*\.products-hero-bands\s*\{([\s\S]*?)pointer-events:\s*auto\s*!important;/g,
    `body.page-products .products-hero-bands {$1pointer-events: none !important;`
  );

  // 4. Update collageFloat1, collageFloat2, gentleFloat, driftBlob1, driftBlob2, gentleIconFloat to use translate as well
  css = css.replace(
    /@keyframes collageFloat1\s*\{[\s\S]*?100%\s*\{[\s\S]*?\}\s*\}/g,
    `@keyframes collageFloat1 {
  0% { transform: translateY(0) rotate(-3deg); translate: 0 0; }
  100% { transform: translateY(-8px) rotate(-3deg); translate: 0 -8px; }
}`
  );

  css = css.replace(
    /@keyframes collageFloat2\s*\{[\s\S]*?100%\s*\{[\s\S]*?\}\s*\}/g,
    `@keyframes collageFloat2 {
  0% { transform: translateY(0) rotate(3deg); translate: 0 0; }
  100% { transform: translateY(8px) rotate(3deg); translate: 0 8px; }
}`
  );

  css = css.replace(
    /@keyframes gentleFloat\s*\{[\s\S]*?100%\s*\{[\s\S]*?\}\s*\}/g,
    `@keyframes gentleFloat {
  0% { transform: translateY(0); translate: 0 0; }
  50% { transform: translateY(-6px); translate: 0 -6px; }
  100% { transform: translateY(0); translate: 0 0; }
}`
  );

  css = css.replace(
    /@keyframes driftBlob1\s*\{[\s\S]*?100%\s*\{[\s\S]*?\}\s*\}/g,
    `@keyframes driftBlob1 {
  0% { transform: translate(0, 0) scale(1); translate: 0 0; }
  100% { transform: translate(-40px, 60px) scale(1.08); translate: -40px 60px; }
}`
  );

  css = css.replace(
    /@keyframes driftBlob2\s*\{[\s\S]*?100%\s*\{[\s\S]*?\}\s*\}/g,
    `@keyframes driftBlob2 {
  0% { transform: translate(0, 0) scale(1); translate: 0 0; }
  100% { transform: translate(50px, -40px) scale(1.06); translate: 50px -40px; }
}`
  );

  css = css.replace(
    /@keyframes gentleIconFloat\s*\{[\s\S]*?100%\s*\{[\s\S]*?\}\s*\}/g,
    `@keyframes gentleIconFloat {
  0% { transform: translateY(0) scale(1); translate: 0 0; }
  100% { transform: translateY(-4px) scale(1.04); translate: 0 -4px; }
}`
  );

  // 5. Update guaranteed motion enforcement section at bottom
  const motionPattern = /\/\* ==========================================================================\s*GUARANTEED HARDWARE-ACCELERATED MOTION[\s\S]*$/;
  const newMotionSection = `/* ==========================================================================
   GUARANTEED HARDWARE-ACCELERATED MOTION & ANIMATIONS ON PRODUCT-SERVICES
   ========================================================================== */
body.page-products .products-blob-1 {
  animation: driftBlob1 24s ease-in-out infinite alternate !important;
  animation-duration: 24s !important;
  animation-iteration-count: infinite !important;
  animation-play-state: running !important;
  will-change: translate, transform;
}

body.page-products .products-blob-2 {
  animation: driftBlob2 28s ease-in-out infinite alternate !important;
  animation-duration: 28s !important;
  animation-iteration-count: infinite !important;
  animation-play-state: running !important;
  will-change: translate, transform;
}

body.page-products .products-blob-3 {
  animation: driftBlob1 30s ease-in-out infinite alternate-reverse !important;
  animation-duration: 30s !important;
  animation-iteration-count: infinite !important;
  animation-play-state: running !important;
  will-change: translate, transform;
}

body.page-products .products-arch-frame {
  animation: collageFloat1 6s ease-in-out infinite alternate !important;
  animation-duration: 6s !important;
  animation-iteration-count: infinite !important;
  animation-play-state: running !important;
  will-change: translate, transform;
}

body.page-products .products-blob-frame {
  animation: collageFloat2 6s ease-in-out infinite alternate 1.5s !important;
  animation-duration: 6s !important;
  animation-iteration-count: infinite !important;
  animation-play-state: running !important;
  will-change: translate, transform;
}

body.page-products .products-stat-badge {
  animation: gentleFloat 6s ease-in-out infinite !important;
  animation-duration: 6s !important;
  animation-iteration-count: infinite !important;
  animation-play-state: running !important;
  will-change: translate, transform;
}

body.page-products .products-hero-bands {
  pointer-events: none !important;
}

body.page-products .ribbon-track.track-left {
  animation: mqRibbonLeft 35s linear infinite !important;
  animation-duration: 35s !important;
  animation-iteration-count: infinite !important;
  animation-play-state: running !important;
  will-change: translate, transform !important;
}

body.page-products .ribbon-track.track-right {
  animation: mqRibbonRight 45s linear infinite !important;
  animation-duration: 45s !important;
  animation-iteration-count: infinite !important;
  animation-play-state: running !important;
  will-change: translate, transform !important;
}

body.page-products .service-card-icon {
  animation: gentleIconFloat 4s ease-in-out infinite alternate !important;
  animation-duration: 4s !important;
  animation-iteration-count: infinite !important;
  animation-play-state: running !important;
  will-change: translate, transform;
}

body.page-products .card-border-glow {
  animation: borderSweep 8s linear infinite !important;
  animation-duration: 8s !important;
  animation-iteration-count: infinite !important;
  animation-play-state: running !important;
}

body.page-products .footer-editorial {
  animation: footerBgDrift 20s ease-in-out infinite alternate !important;
  animation-duration: 20s !important;
  animation-iteration-count: infinite !important;
  animation-play-state: running !important;
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

/* Responsive single-column hero grid on tablets and mobile */
@media (max-width: 991px) {
  body.page-products .products-hero-grid {
    grid-template-columns: 1fr !important;
    gap: 2.5rem !important;
    min-height: auto !important;
  }

  body.page-products .products-hero-content {
    width: 100% !important;
    max-width: 100% !important;
    text-align: center !important;
  }

  body.page-products .products-hero-badge,
  body.page-products .products-hero-tags,
  body.page-products .products-hero-cta {
    justify-content: center !important;
  }

  body.page-products .products-hero-visual {
    width: 100% !important;
    max-width: 330px !important;
    margin: 24px auto 0 !important;
    overflow: visible !important;
  }
}
`;

  if (motionPattern.test(css)) {
    css = css.replace(motionPattern, newMotionSection);
  } else {
    css += '\n' + newMotionSection;
  }

  fs.writeFileSync(filePath, css, 'utf8');
  console.log('Successfully updated ' + filePath);
}

updateProductsCss('public_html/css/shikshit/products.css');
updateProductsCss('public_html (77)/css/shikshit/products.css');
