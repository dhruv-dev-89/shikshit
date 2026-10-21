const fs = require('fs');
const path = require('path');

const folders = ['public_html', 'public_html (77)'];

for (const folder of folders) {
  // 1. Clean up products.css end
  const prodCssPath = path.join(__dirname, '..', folder, 'css', 'shikshit', 'products.css');
  let prodCss = fs.readFileSync(prodCssPath, 'utf8');

  // Replace lines 2569-2596 if present
  const oldTrailingLogoRegex = /body\.page-products \.footer-editorial \.footer-brand\s*\{[\s\S]*?width:\s*135px\s*!important;\s*\}\s*\}/;
  if (oldTrailingLogoRegex.test(prodCss)) {
    prodCss = prodCss.replace(oldTrailingLogoRegex, `
body.page-products .footer-editorial .footer-brand {
  display: flex !important;
  align-items: flex-start !important;
  justify-content: flex-start !important;
  margin: 0 !important;
  padding: 0 !important;
  height: 56px !important;
}

body.page-products .footer-editorial .footer-logo,
body.page-products .footer-editorial img[src*="sikshitlogo"] {
  height: 56px !important;
  width: auto !important;
  max-width: 100% !important;
  object-fit: contain !important;
  display: block !important;
  margin: 0 !important;
  filter: drop-shadow(0 2px 8px rgba(11, 11, 59, 0.08)) !important;
}

@media (max-width: 768px) {
  body.page-products .footer-editorial .footer-brand {
    height: 48px !important;
  }
  body.page-products .footer-editorial .footer-logo,
  body.page-products .footer-editorial img[src*="sikshitlogo"] {
    height: 48px !important;
  }
}
`);
    fs.writeFileSync(prodCssPath, prodCss, 'utf8');
    console.log(`Cleaned up trailing footer-logo in ${folder}/css/shikshit/products.css`);
  }

  // 2. Also check if there is an old padding: 70px on footer-editorial in products.css
  const oldPaddingRegex = /body\.page-products \.footer-editorial\s*\{[\s\S]*?padding:\s*70px\s*24px\s*32px\s*!important;/;
  if (oldPaddingRegex.test(prodCss)) {
    prodCss = prodCss.replace(oldPaddingRegex, (match) => {
      return match.replace('70px', '56px');
    });
    fs.writeFileSync(prodCssPath, prodCss, 'utf8');
    console.log(`Updated footer-editorial padding to 56px in ${folder}/css/shikshit/products.css`);
  }

  // 3. Update donate.css to ensure inner elements of .amount-button.selected have color: #FFFFFF !important
  const donateCssPath = path.join(__dirname, '..', folder, 'css', 'shikshit', 'donate.css');
  let donateCss = fs.readFileSync(donateCssPath, 'utf8');

  if (!donateCss.includes('.amount-button.selected *')) {
    donateCss = donateCss.replace(
      'body.page-donate .amount-button.selected {',
      'body.page-donate .amount-button.selected,\nbody.page-donate .amount-button.selected * {'
    );
    fs.writeFileSync(donateCssPath, donateCss, 'utf8');
    console.log(`Updated .amount-button.selected * in ${folder}/css/shikshit/donate.css`);
  }
}

console.log('Fine-tuning script complete.');
