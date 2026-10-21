const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const frozen = [
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

function sha(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

let allOk = true;
console.log('Verifying frozen files against public_html_backup:');
for (let f of frozen) {
  const pBackup = path.join('public_html_backup', f);
  const p1 = path.join('public_html', f);
  const p2 = path.join('public_html (77)', f);
  
  const hBackup = fs.existsSync(pBackup) ? sha(pBackup) : 'MISSING';
  const h1 = fs.existsSync(p1) ? sha(p1) : 'MISSING';
  const h2 = fs.existsSync(p2) ? sha(p2) : 'MISSING';
  
  const match = (hBackup === h1 && h1 === h2);
  if (!match) allOk = false;
  console.log(`${f}: ${match ? 'MATCH (OK)' : 'MISMATCH!'} [backup: ${hBackup.substring(0,8)}, p1: ${h1.substring(0,8)}, p2: ${h2.substring(0,8)}]`);
}

if (!allOk) {
  console.error('FAIL: Frozen files mismatch!');
  process.exit(1);
} else {
  console.log('\nSUCCESS: All 11 frozen files match backup 100% bit-for-bit!');
}
