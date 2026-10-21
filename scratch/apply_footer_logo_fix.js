const fs = require('fs');
const path = require('path');

const folders = ['public_html', 'public_html (77)'];

for (const folder of folders) {
  // 1. Update index.html
  const indexPath = path.join(__dirname, '..', folder, 'index.html');
  let indexContent = fs.readFileSync(indexPath, 'utf8');

  indexContent = indexContent.replace(
    /<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">\s*<img src="images\/sikshitlogo\.webp" alt="Shikshit Logo" style="height: 64px; width: auto; margin: -10px 0;">\s*<\/div>/,
    `<div class="footer-brand" style="display: flex; align-items: center; justify-content: flex-start; margin-bottom: 28px;">
              <img src="images/sikshitlogo.webp" alt="Shikshit Logo" class="footer-logo" style="width: 165px; max-width: 100%; height: auto; display: block; margin: 0; object-fit: contain;">
            </div>`
  );
  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log(`Updated ${folder}/index.html`);

  // 2. Update product-services.html
  const psPath = path.join(__dirname, '..', folder, 'product-services.html');
  let psContent = fs.readFileSync(psPath, 'utf8');

  psContent = psContent.replace(
    /<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">\s*<img src="images\/sikshitlogo\.webp" alt="Shikshit Logo" style="height: 64px; width: auto; margin: -10px 0;">\s*<\/div>/,
    `<div class="footer-brand" style="display: flex; align-items: center; justify-content: flex-start; margin-bottom: 28px;">
              <img src="images/sikshitlogo.webp" alt="Shikshit Logo" class="footer-logo" style="width: 165px; max-width: 100%; height: auto; display: block; margin: 0; object-fit: contain;">
            </div>`
  );
  fs.writeFileSync(psPath, psContent, 'utf8');
  console.log(`Updated ${folder}/product-services.html`);

  // 3. Update css/shikshit/components.css
  const compPath = path.join(__dirname, '..', folder, 'css', 'shikshit', 'components.css');
  let compContent = fs.readFileSync(compPath, 'utf8');

  const footerCompRule = `
/* --------------------------------------------------------------------------
   FOOTER EDITORIAL BRAND & LOGO
   -------------------------------------------------------------------------- */
.footer-editorial .footer-brand {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 28px;
}

.footer-editorial .footer-logo,
.footer-editorial img[src*="sikshitlogo"] {
  width: 165px !important;
  max-width: 100% !important;
  height: auto !important;
  object-fit: contain !important;
  display: block !important;
  margin: 0 !important;
  filter: drop-shadow(0 2px 8px rgba(11, 11, 59, 0.08));
}

@media (max-width: 768px) {
  .footer-editorial .footer-brand {
    margin-bottom: 24px !important;
  }

  .footer-editorial .footer-logo,
  .footer-editorial img[src*="sikshitlogo"] {
    width: 135px !important;
  }
}
`;
  if (!compContent.includes('FOOTER EDITORIAL BRAND & LOGO')) {
    compContent += footerCompRule;
    fs.writeFileSync(compPath, compContent, 'utf8');
    console.log(`Updated ${folder}/css/shikshit/components.css`);
  }

  // 4. Update css/shikshit/products.css
  const prodCssPath = path.join(__dirname, '..', folder, 'css', 'shikshit', 'products.css');
  let prodCssContent = fs.readFileSync(prodCssPath, 'utf8');

  const footerProdRule = `
body.page-products .footer-editorial .footer-brand {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  margin-bottom: 28px !important;
}

body.page-products .footer-editorial .footer-logo,
body.page-products .footer-editorial img[src*="sikshitlogo"] {
  width: 165px !important;
  max-width: 100% !important;
  height: auto !important;
  object-fit: contain !important;
  display: block !important;
  margin: 0 !important;
}

@media (max-width: 768px) {
  body.page-products .footer-editorial .footer-brand {
    margin-bottom: 24px !important;
  }

  body.page-products .footer-editorial .footer-logo,
  body.page-products .footer-editorial img[src*="sikshitlogo"] {
    width: 135px !important;
  }
}
`;
  if (!prodCssContent.includes('body.page-products .footer-editorial .footer-brand')) {
    prodCssContent += footerProdRule;
    fs.writeFileSync(prodCssPath, prodCssContent, 'utf8');
    console.log(`Updated ${folder}/css/shikshit/products.css`);
  }
}
console.log('All files updated successfully.');
