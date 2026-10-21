const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(__dirname, '..', 'public_html', 'css', 'shikshit', 'products.css'),
  path.join(__dirname, '..', 'public_html (77)', 'css', 'shikshit', 'products.css')
];

for (const filePath of targetFiles) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Reset body.page-products padding-top
  content = content.replace(
    /body\.page-products\s*\{[\s\S]*?position:\s*relative;\s*\}/,
    `body.page-products {
  font-family: var(--font-body);
  background: var(--page-bg-gradient);
  color: var(--color-secondary-text);
  overflow-x: hidden;
  position: relative;
  padding-top: 0 !important; /* resets 100px padding-top inherited from sikshitnavbar.css */
}`
  );

  // 2. Move navbar upward to 28px from top of viewport, padding: 8px 24px
  content = content.replace(
    /body\.page-products \.shikshit-header\s*\{[\s\S]*?overflow:\s*visible\s*!important;\s*\}/,
    `body.page-products .shikshit-header {
  position: sticky !important;
  top: 28px !important;
  z-index: 1000 !important;
  width: 100% !important;
  padding: 0 16px !important;
  margin-top: 28px !important;
  margin-bottom: 0 !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  pointer-events: none !important;
  overflow: visible !important;
}`
  );

  content = content.replace(
    /padding:\s*10px\s*28px\s*!important;/,
    `padding: 8px 24px !important;`
  );

  // 3. Logo size: 100-120px on desktop with aspect ratio preserved
  content = content.replace(
    /body\.page-products \.shikshit-logo\s*\{[\s\S]*?transition:\s*height\s*0\.25s\s*ease\s*!important;\s*\}/,
    `body.page-products .shikshit-logo {
  width: 110px !important;
  height: auto !important;
  max-height: none !important;
  margin: -22px 0 !important;
  object-fit: contain !important;
  display: block !important;
  filter: drop-shadow(0 2px 6px rgba(11, 11, 59, 0.10)) !important;
  transition: transform 0.25s ease, width 0.25s ease !important;
}`
  );

  // 4. Logo shrink keyframe & scrolled logo
  content = content.replace(
    /@keyframes\s*logoShrink\s*\{[\s\S]*?height:\s*44px;\s*\}/,
    `@keyframes logoShrink {
  to {
    width: 90px;
    height: auto;
    margin: -16px 0;
  }
}`
  );

  content = content.replace(
    /body\.page-products \.shikshit-header\.scrolled \.shikshit-logo,[\s\S]*?body\.page-products \.shikshit-navbar\.scrolled \.shikshit-logo\s*\{[\s\S]*?height:\s*44px\s*!important;\s*\}/,
    `body.page-products .shikshit-header.scrolled .shikshit-logo,
body.page-products .shikshit-navbar.scrolled .shikshit-logo {
  width: 90px !important;
  height: auto !important;
  margin: -16px 0 !important;
}`
  );

  content = content.replace(
    /padding:\s*6px\s*22px\s*!important;/,
    `padding: 6px 20px !important;`
  );

  // 5. Desktop nav menu gap: 24px, nav actions gap: 10px
  content = content.replace(
    /gap:\s*28px\s*!important;\s*\n\s*list-style:\s*none\s*!important;\s*\n\s*margin:\s*0\s*!important;\s*\n\s*padding:\s*0\s*!important;\s*\n\s*\}\s*\n\s*body\.page-products \.shikshit-nav-actions\s*\{\s*\n\s*display:\s*flex\s*!important;\s*\n\s*align-items:\s*center\s*!important;\s*\n\s*gap:\s*12px\s*!important;/,
    `gap: 24px !important;\n    list-style: none !important;\n    margin: 0 !important;\n    padding: 0 !important;\n  }\n  body.page-products .shikshit-nav-actions {\n    display: flex !important;\n    align-items: center !important;\n    gap: 10px !important;`
  );

  // 6. Hero section padding: 60px 0 36px (55-70px gap from navbar), align-items: start
  content = content.replace(
    /body\.page-products \.products-hero\s*\{[\s\S]*?overflow:\s*visible;[\s\S]*?\}\s*\n\s*\.products-hero-grid\s*\{[\s\S]*?align-items:\s*center;[\s\S]*?padding:\s*0\s*24px;\s*\}/,
    `body.page-products .products-hero {
  position: relative;
  z-index: 1;
  padding: 60px 0 36px; /* balanced 60px gap below navbar */
  overflow: visible; /* allows full-bleed child ribbons to extend past viewport edges */
}

.products-hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.65fr);
  gap: 36px;
  align-items: start; /* align hero content, heading and right-side trust card neatly at top */
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 24px;
}`
  );

  // 7. Tablet media query: max-width 979px
  content = content.replace(
    /@media\s*\(max-width:\s*979px\)\s*\{\s*\n\s*body\.page-products \.shikshit-nav-menu/,
    `@media (max-width: 979px) {
  body.page-products .shikshit-header {
    top: 18px !important;
    margin-top: 18px !important;
    padding: 0 12px !important;
  }

  body.page-products .shikshit-navbar {
    height: 60px !important;
    padding: 6px 18px !important;
  }

  body.page-products .shikshit-logo {
    width: 95px !important;
    height: auto !important;
    margin: -18px 0 !important;
  }

  body.page-products .products-hero {
    padding-top: 40px !important;
  }

  body.page-products .shikshit-nav-menu`
  );

  // 8. Mobile media query: max-width 480px
  content = content.replace(
    /@media\s*\(max-width:\s*480px\)\s*\{\s*\n\s*body\.page-products \.shikshit-navbar\s*\{[\s\S]*?height:\s*58px\s*!important;[\s\S]*?body\.page-products \.shikshit-logo\s*\{[\s\S]*?height:\s*44px\s*!important;\s*\}/,
    `@media (max-width: 480px) {
  body.page-products .shikshit-header {
    top: 16px !important;
    margin-top: 16px !important;
  }

  body.page-products .shikshit-navbar {
    height: 56px !important;
    padding: 6px 14px !important;
  }

  body.page-products .shikshit-logo {
    width: 88px !important;
    height: auto !important;
    margin: -16px 0 !important;
  }

  body.page-products .products-hero {
    padding-top: 32px !important;
  }`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated:', filePath);
}
