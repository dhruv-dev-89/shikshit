const fs = require('fs');
const path = require('path');
const http = require('http');

const pub = 'public_html';
const backup = 'public_html_backup';

console.log('=== VERIFYING SITE INTEGRITY POST-CLEANUP ===');

// 1. Verify all HTML files and their asset references
const htmlFiles = fs.readdirSync(pub).filter(f => f.endsWith('.html'));
let brokenRefs = 0;
let totalRefs = 0;

for (const htmlFile of htmlFiles) {
  const content = fs.readFileSync(path.join(pub, htmlFile), 'utf8');

  // Find src="..." and href="..."
  const regex = /(?:src|href)=["']([^"':#?]+)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const ref = match[1].trim();
    if (ref.startsWith('http') || ref.startsWith('//') || ref.startsWith('mailto:') || ref.startsWith('tel:') || ref.startsWith('javascript:')) {
      continue;
    }
    // Skip empty or anchor
    if (!ref || ref === '/') continue;

    totalRefs++;
    const resolvedPath = path.join(pub, ref);
    if (!fs.existsSync(resolvedPath)) {
      console.log(`[Broken reference in ${htmlFile}]: ${ref}`);
      brokenRefs++;
    }
  }
}

console.log(`Checked ${totalRefs} local asset and script references across ${htmlFiles.length} HTML pages.`);
console.log(`Broken references found: ${brokenRefs}`);

// 2. Verify frozen files against public_html_backup
const frozenFiles = [
  'ns-mas.html',
  'scholarship.html',
  'registration.html',
  'how-it-works.html',
  'privacypolicy.html',
  'termsandservice.html',
  'components/footer.html',
  'css/sikshitnavbar.css',
  'css/floating-buttons.css',
  'js/floating-buttons.js',
  'js/script.js'
];

const crypto = require('crypto');
function hashFile(p) {
  return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
}

let frozenMatches = 0;
for (const f of frozenFiles) {
  const pubPath = path.join(pub, f);
  const bakPath = path.join(backup, f);
  if (fs.existsSync(pubPath) && fs.existsSync(bakPath)) {
    const h1 = hashFile(pubPath);
    const h2 = hashFile(bakPath);
    if (h1 === h2) {
      frozenMatches++;
    } else {
      console.log(`[MISMATCH in frozen file]: ${f}`);
    }
  }
}
console.log(`Verified ${frozenMatches}/${frozenFiles.length} frozen files match public_html_backup bit-for-bit.`);

// 3. Check HTTP server response for index.html and product-services.html
http.get('http://localhost:3000/index.html', res => {
  console.log(`HTTP /index.html Status: ${res.statusCode}`);
  http.get('http://localhost:3000/product-services.html', res2 => {
    console.log(`HTTP /product-services.html Status: ${res2.statusCode}`);
  });
}).on('error', err => {
  console.log(`HTTP server check error: ${err.message}`);
});
