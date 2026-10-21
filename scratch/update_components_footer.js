const fs = require('fs');
const path = require('path');

const folders = ['public_html', 'public_html (77)'];

const newComponentsFooterSnippet = `/* --------------------------------------------------------------------------
   FOOTER EDITORIAL BRAND & LOGO (Part B Fixes)
   -------------------------------------------------------------------------- */
.footer-editorial .footer-brand {
  display: flex !important;
  align-items: flex-start !important;
  justify-content: flex-start !important;
  margin: 0 !important;
  padding: 0 !important;
  height: 56px !important;
}

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

.footer-editorial .footer-grid > div:first-child p {
  margin-top: 16px !important;
  margin-bottom: 0 !important;
}

@media (max-width: 768px) {
  .footer-editorial .footer-brand {
    height: 48px !important;
  }

  .footer-editorial .footer-logo,
  .footer-editorial img[src*="sikshitlogo"] {
    height: 48px !important;
  }
}
`;

for (const folder of folders) {
  const compPath = path.join(__dirname, '..', folder, 'css', 'shikshit', 'components.css');
  let compCss = fs.readFileSync(compPath, 'utf8');

  const oldBrandRuleRegex = /\/\* --------------------------------------------------------------------------\s*FOOTER EDITORIAL BRAND & LOGO[\s\S]*$/;
  if (oldBrandRuleRegex.test(compCss)) {
    compCss = compCss.replace(oldBrandRuleRegex, newComponentsFooterSnippet);
    fs.writeFileSync(compPath, compCss, 'utf8');
    console.log(`Updated components.css in ${folder}`);
  }
}
