const fs = require('fs');
const content = fs.readFileSync('public_html/css/shikshit/products.css', 'utf8');
const lines = content.split('\n');

lines.forEach((l, i) => {
  if (l.match(/1[0-3]\d\dpx/) || l.includes('100vw') || l.includes('rotate(') || l.includes('calc(50% - 50vw)')) {
    console.log(`${i+1}: ${l.trim()}`);
  }
});
