const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const files = [
  'product-services.html',
  'index.html',
  'become-a-member.html',
  'donate.html',
  'css/shikshit/products.css',
  'css/shikshit/member.css',
  'css/shikshit/donate.css',
  'css/shikshit/components.css',
  'js/shikshit/inner.js'
];

function sha(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

let allOk = true;
console.log('Verifying parity between public_html and public_html (77):');
for (let f of files) {
  const p1 = path.join('public_html', f);
  const p2 = path.join('public_html (77)', f);
  
  const h1 = fs.existsSync(p1) ? sha(p1) : 'MISSING';
  const h2 = fs.existsSync(p2) ? sha(p2) : 'MISSING';
  
  const match = (h1 === h2 && h1 !== 'MISSING');
  if (!match) allOk = false;
  console.log(`${f}: ${match ? 'PARITY OK' : 'MISMATCH!'} [p1: ${h1.substring(0,8)}, p2: ${h2.substring(0,8)}]`);
}

if (!allOk) {
  console.error('FAIL: Files do not match between folders!');
  process.exit(1);
} else {
  console.log('\nSUCCESS: All files have 100% bit-for-bit parity across both directories!');
}
