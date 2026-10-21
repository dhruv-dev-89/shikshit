const fs = require('fs');
const content = fs.readFileSync('public_html/product-services.html', 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('<section') || (line.includes('<!--') && (line.includes('Section') || line.includes('Product') || line.includes('Diploma')))) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
