const fs = require('fs');
const html = fs.readFileSync('public_html/product-services.html', 'utf8');
const lines = html.split('\n');
lines.forEach((line, i) => {
  const l = line.trim();
  if (l.startsWith('<nav') || l.startsWith('<header') || l.startsWith('<section') || l.startsWith('<footer') || l.startsWith('<div class="products-') || l.startsWith('<div class="services-') || l.startsWith('<div class="video-') || l.startsWith('<div class="cta-')) {
    console.log((i+1) + ': ' + l.slice(0, 100));
  }
});
