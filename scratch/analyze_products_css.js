const fs = require('fs');
const content = fs.readFileSync('public_html/css/shikshit/products.css', 'utf8');
const lines = content.split('\n');

const findings = [];
lines.forEach((l, i) => {
  if (l.includes('max-width') || l.includes('--container') || l.includes('products-hero') || l.includes('sticky-section-index') || l.includes('ribbon') || l.includes('shikshit-header') || l.includes('shikshit-navbar') || l.includes('video-carousel') || l.includes('footer-editorial') || l.includes('shikshit-container')) {
    if (l.trim().startsWith('/*') || l.includes('{') || l.includes(':')) {
      findings.push(`${i+1}: ${l.trim()}`);
    }
  }
});
console.log(findings.slice(0, 100).join('\n'));
console.log('Total matches:', findings.length);
