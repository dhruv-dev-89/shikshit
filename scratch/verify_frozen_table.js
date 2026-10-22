const fs = require('fs');
const crypto = require('crypto');
const { execSync } = require('child_process');

const frozen = [
  'ns-mas.html',
  'scholarship.html',
  'registration.html',
  'how-it-works.html',
  'privacypolicy.html',
  'termsandservice.html',
  'components/nsmas_navbar.html',
  'components/nsmas-floating-button.html',
  'components/footer.html',
  'css/sikshitnavbar.css',
  'css/floating-buttons.css',
  'css/mobile-menu-fix.css',
  'js/floating-buttons.js',
  'js/script.js',
  'js/hamburger-menu-fix.js'
];

function sha(strOrBuf) {
  return crypto.createHash('sha256').update(strOrBuf).digest('hex');
}

console.log('=== FROZEN FILES AUDIT ===');
for (const f of frozen) {
  const p = 'public_html/' + f;
  const diskBuf = fs.readFileSync(p);
  const diskHash = sha(diskBuf);

  const gitBlob = execSync(`git rev-parse "pre-dedupe:public_html/${f}"`).toString().trim();
  const gitBuf = execSync(`git cat-file -p ${gitBlob}`, { maxBuffer: 50 * 1024 * 1024 });

  const diskNorm = diskBuf.toString('utf8').replace(/\r\n/g, '\n');
  const gitNorm = gitBuf.toString('utf8').replace(/\r\n/g, '\n');

  const textMatch = (diskNorm === gitNorm);
  console.log(`${f.padEnd(40)} Disk SHA-256: ${diskHash} | Content Match: ${textMatch ? 'MATCH' : 'MISMATCH'}`);
}
