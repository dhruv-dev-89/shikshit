const fs = require('fs');

function applyHeroStack(filePath) {
  let css = fs.readFileSync(filePath, 'utf8');

  const stackRule = `
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

  if (!css.includes('Responsive single-column hero grid on tablets and mobile')) {
    css += '\n' + stackRule;
    fs.writeFileSync(filePath, css, 'utf8');
    console.log('Updated ' + filePath);
  }
}

applyHeroStack('public_html/css/shikshit/products.css');
applyHeroStack('public_html (77)/css/shikshit/products.css');
