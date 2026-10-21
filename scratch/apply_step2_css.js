const fs = require('fs');
const path = require('path');

const folders = ['public_html', 'public_html (77)'];

// 1. Updated Section Index & Footer Styles for products.css
const updatedProductsCssSnippet = `
/* ==========================================================================
   PART A: STICKY PILL-SHAPED SECTION INDEX (Robust, Accessible & Gliding)
   ========================================================================== */
:root {
  --navbar-height: 72px;
  --pillbar-top: calc(var(--navbar-height, 72px) + 12px);
  --section-scroll-margin: calc(var(--pillbar-top, 84px) + 52px + 16px);
}

body.page-products .sticky-section-index {
  position: sticky !important;
  top: var(--pillbar-top, 84px) !important;
  z-index: 90 !important;
  padding: 10px 20px !important;
  display: flex !important;
  justify-content: center !important;
  pointer-events: none !important;
  margin-top: -6px !important;
  margin-bottom: 24px !important;
  transition: top 0.25s ease !important;
}

body.page-products .index-pill-track {
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  background: rgba(255, 255, 255, 0.96) !important;
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
  padding: 6px 8px !important;
  border-radius: 9999px !important;
  border: 1px solid rgba(124, 58, 237, 0.18) !important;
  box-shadow: 0 14px 40px rgba(11, 11, 59, 0.12) !important;
  pointer-events: auto !important;
  max-width: 95vw !important;
  overflow-x: auto !important;
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
  scroll-snap-type: x mandatory !important;
  -webkit-overflow-scrolling: touch !important;
  position: relative !important;
  mask-image: linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent);
}

body.page-products .index-pill-track::-webkit-scrollbar {
  display: none !important;
}

/* Gliding active gradient pill indicator */
body.page-products .index-pill-glider {
  position: absolute !important;
  top: 6px !important;
  bottom: 6px !important;
  left: 0 !important;
  width: 0 !important;
  border-radius: 9999px !important;
  background: var(--signature-gradient) !important;
  box-shadow: 0 6px 18px rgba(192, 38, 211, 0.35) !important;
  transition: transform 350ms cubic-bezier(0.16, 1, 0.3, 1),
              width 350ms cubic-bezier(0.16, 1, 0.3, 1),
              opacity 250ms ease !important;
  z-index: 1 !important;
  pointer-events: none !important;
  opacity: 0;
}

/* Individual Pill Links */
body.page-products .index-pill {
  position: relative !important;
  z-index: 2 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 10px 18px !important;
  min-height: 44px !important;
  min-width: 44px !important;
  border-radius: 9999px !important;
  font-size: 13.5px !important;
  font-weight: 700 !important;
  color: var(--navy) !important;
  text-decoration: none !important;
  white-space: nowrap !important;
  transition: color 0.25s ease, transform 0.2s ease !important;
  border: 1px solid transparent !important;
  scroll-snap-align: center !important;
  background: transparent !important;
}

body.page-products .index-pill:hover {
  color: var(--violet) !important;
}

body.page-products .index-pill.active {
  color: #FFFFFF !important;
}

body.page-products .index-pill:focus-visible {
  outline: 3px solid var(--violet) !important;
  outline-offset: 2px !important;
}

/* Section scroll margins so headings land just below sticky pill bar */
body.page-products #scholarship-program,
body.page-products #awareness-programs,
body.page-products #olympiads,
body.page-products #financial-aid,
body.page-products #technical-training,
body.page-products #video-ads,
body.page-products #diploma-courses {
  scroll-margin-top: var(--section-scroll-margin, 155px) !important;
}

/* Responsive adjustments for pill bar */
@media (max-width: 768px) {
  body.page-products .sticky-section-index {
    padding: 6px 10px !important;
    margin-bottom: 16px !important;
  }
  body.page-products .index-pill {
    padding: 8px 14px !important;
    font-size: 12.5px !important;
  }
}

/* ==========================================================================
   PART B: EDITORIAL FOOTER ENHANCEMENTS & DEFECT FIXES
   ========================================================================== */
body.page-products .footer-editorial,
.footer-editorial {
  width: 100% !important;
  max-width: 100% !important;
  border-radius: 48px 48px 0 0 !important;
  border-top: 1px solid rgba(124, 58, 237, 0.15) !important;
  padding: 56px 24px 32px !important;
  margin-top: 60px !important;
  position: relative !important;
  z-index: 2 !important;
  background: linear-gradient(135deg, #F7F5FF 0%, #EDE9FE 40%, #FFE9E0 100%) !important;
  background-size: 200% 200% !important;
  animation: footerBgDrift 30s ease-in-out infinite alternate !important;
  box-sizing: border-box !important;
}

@keyframes footerBgDrift {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

body.page-products .footer-editorial .shikshit-container,
.footer-editorial .shikshit-container {
  max-width: 1240px !important;
  margin: 0 auto !important;
  padding: 0 !important;
}

/* Columns: 1.4fr 1fr 1fr 1.2fr top-aligned */
body.page-products .footer-grid,
.footer-editorial .footer-grid {
  display: grid !important;
  grid-template-columns: 1.4fr 1fr 1fr 1.2fr !important;
  gap: 36px !important;
  align-items: start !important;
  margin-bottom: 40px !important;
  text-align: left !important;
}

/* Brand Column: Logo top edge aligns with column headings, 56px tall, 16px gap to paragraph */
body.page-products .footer-editorial .footer-brand,
.footer-editorial .footer-brand {
  display: flex !important;
  align-items: flex-start !important;
  justify-content: flex-start !important;
  margin: 0 !important;
  padding: 0 !important;
  height: 56px !important;
}

body.page-products .footer-editorial .footer-logo,
.footer-editorial .footer-logo,
.footer-editorial img[src*="sikshitlogo"] {
  height: 56px !important;
  width: auto !important;
  max-width: 100% !important;
  object-fit: contain !important;
  display: block !important;
  margin: 0 !important;
  filter: drop-shadow(0 2px 8px rgba(11, 11, 59, 0.08)) !important;
}

body.page-products .footer-editorial .footer-grid > div:first-child p,
.footer-editorial .footer-grid > div:first-child p {
  margin-top: 16px !important;
  margin-bottom: 0 !important;
  font-size: 14.5px !important;
  line-height: 1.65 !important;
  color: var(--ink) !important;
  max-width: 340px !important;
}

/* Headings in columns */
body.page-products .footer-col h4,
.footer-editorial .footer-col h4 {
  font-size: 16px !important;
  font-weight: 700 !important;
  color: var(--navy) !important;
  margin: 0 0 16px 0 !important;
  line-height: 1.3 !important;
}

/* Links List */
body.page-products .footer-col ul,
.footer-editorial .footer-col ul {
  list-style: none !important;
  padding: 0 !important;
  margin: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 10px !important;
}

body.page-products .footer-col ul li a,
.footer-editorial .footer-col ul li a {
  color: var(--ink) !important;
  font-size: 14.5px !important;
  line-height: 1.5 !important;
  text-decoration: none !important;
  transition: color 0.2s ease !important;
  position: relative !important;
  display: inline-block !important;
  padding-bottom: 2px !important;
}

body.page-products .footer-col ul li a::after,
.footer-editorial .footer-col ul li a::after {
  content: '' !important;
  position: absolute !important;
  bottom: 0 !important;
  left: 0 !important;
  width: 0% !important;
  height: 2px !important;
  background: var(--signature-gradient) !important;
  transition: width 0.25s ease !important;
  border-radius: 2px !important;
}

body.page-products .footer-col ul li a:hover::after,
.footer-editorial .footer-col ul li a:hover::after {
  width: 100% !important;
}

body.page-products .footer-col ul li a:hover,
.footer-editorial .footer-col ul li a:hover {
  color: var(--violet) !important;
}

/* DEFECT FIX: "Chat on WhatsApp" Button with AA Contrast, White Text & Shine Sweep */
body.page-products .footer-col a.btn-primary-gradient,
body.page-products .footer-editorial a.btn-primary-gradient,
.footer-col a.btn-primary-gradient,
.footer-editorial a.btn-primary-gradient,
.footer-editorial .btn-pill.btn-primary-gradient {
  color: #FFFFFF !important;
  background: var(--signature-gradient) !important;
  font-weight: 700 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
  border-radius: 9999px !important;
  padding: 10px 22px !important;
  font-size: 13.5px !important;
  line-height: 1.3 !important;
  box-shadow: 0 4px 16px rgba(192, 38, 211, 0.35) !important;
  position: relative !important;
  overflow: hidden !important;
  text-decoration: none !important;
  border: none !important;
  transition: transform 0.25s ease, box-shadow 0.25s ease !important;
}

body.page-products .footer-col a.btn-primary-gradient::before,
.footer-editorial a.btn-primary-gradient::before {
  content: "" !important;
  position: absolute !important;
  top: 0 !important;
  left: -100% !important;
  width: 60% !important;
  height: 100% !important;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45), transparent) !important;
  transform: skewX(-25deg) !important;
  transition: left 0.6s ease !important;
  pointer-events: none !important;
}

body.page-products .footer-col a.btn-primary-gradient:hover::before,
.footer-editorial a.btn-primary-gradient:hover::before {
  left: 150% !important;
}

body.page-products .footer-col a.btn-primary-gradient:hover,
.footer-editorial a.btn-primary-gradient:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 24px rgba(192, 38, 211, 0.5) !important;
  color: #FFFFFF !important;
}

/* Footer Bottom Hairline */
body.page-products .footer-bottom,
.footer-editorial .footer-bottom {
  border-top: 1px solid rgba(124, 58, 237, 0.12) !important;
  padding-top: 24px !important;
  margin-top: 36px !important;
  text-align: center !important;
  font-size: 13.5px !important;
  color: var(--ink) !important;
}

/* Motion: Staggered reveal on viewport entrance */
.footer-editorial .footer-grid > div {
  opacity: 0;
  transform: translateY(22px);
  transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-editorial.in-view .footer-grid > div:nth-child(1) { opacity: 1; transform: translateY(0); transition-delay: 0.05s; }
.footer-editorial.in-view .footer-grid > div:nth-child(2) { opacity: 1; transform: translateY(0); transition-delay: 0.14s; }
.footer-editorial.in-view .footer-grid > div:nth-child(3) { opacity: 1; transform: translateY(0); transition-delay: 0.23s; }
.footer-editorial.in-view .footer-grid > div:nth-child(4) { opacity: 1; transform: translateY(0); transition-delay: 0.32s; }

/* Responsive Grid for Footer */
@media (max-width: 1024px) {
  body.page-products .footer-grid,
  .footer-editorial .footer-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 32px !important;
  }
}

@media (max-width: 640px) {
  body.page-products .footer-grid,
  .footer-editorial .footer-grid {
    grid-template-columns: 1fr !important;
    gap: 28px !important;
  }
}
`;

for (const folder of folders) {
  // A. Update css/shikshit/products.css
  const prodCssPath = path.join(__dirname, '..', folder, 'css', 'shikshit', 'products.css');
  let prodCss = fs.readFileSync(prodCssPath, 'utf8');

  // Replace old section 2 sticky index if present
  const oldIndexRegex = /\/\* --------------------------------------------------------------------------\s*2\. STICKY PILL-SHAPED SECTION INDEX[\s\S]*?(?=\/\* ==========================================================================|$)/;
  if (oldIndexRegex.test(prodCss)) {
    prodCss = prodCss.replace(oldIndexRegex, updatedProductsCssSnippet);
  } else {
    prodCss += '\n' + updatedProductsCssSnippet;
  }
  fs.writeFileSync(prodCssPath, prodCss, 'utf8');
  console.log(`Updated products.css in ${folder}`);

  // B. Update css/shikshit/pages.css (Shared footer styles)
  const pagesCssPath = path.join(__dirname, '..', folder, 'css', 'shikshit', 'pages.css');
  if (fs.existsSync(pagesCssPath)) {
    let pagesCss = fs.readFileSync(pagesCssPath, 'utf8');
    // Ensure footer-editorial styles in pages.css also have the defect fixes
    if (!pagesCss.includes('btn-primary-gradient')) {
      pagesCss += '\n' + `
/* Footer WhatsApp Specificity Fix & Brand Alignment */
.footer-editorial a.btn-primary-gradient,
.footer-editorial .btn-pill.btn-primary-gradient {
  color: #FFFFFF !important;
  background: var(--signature-gradient) !important;
  box-shadow: 0 4px 16px rgba(192, 38, 211, 0.35) !important;
}
.footer-editorial .footer-brand {
  height: 56px !important;
  margin-bottom: 0 !important;
}
.footer-editorial .footer-logo {
  height: 56px !important;
  width: auto !important;
}
.footer-editorial .footer-brand + p,
.footer-editorial .footer-grid > div:first-child p {
  margin-top: 16px !important;
}
`;
      fs.writeFileSync(pagesCssPath, pagesCss, 'utf8');
      console.log(`Updated pages.css in ${folder}`);
    }
  }
}

console.log('Step 2 (products.css & pages.css) complete.');
