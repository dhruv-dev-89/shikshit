const fs = require('fs');
const content = fs.readFileSync('public_html/product-services.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('<section') || l.includes('class="products-') || l.includes('class="shikshit-footer') || l.includes('<footer') || l.includes('id="product')) {
    console.log(i + 1, l.trim());
  }
});
