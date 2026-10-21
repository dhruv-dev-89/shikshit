const fs = require('fs');
const path = require('path');

const report = JSON.parse(fs.readFileSync(path.join(__dirname, 'duplicate_audit_report.json'), 'utf8'));

// Categorize duplicates:
// 1. Within public_html only
// 2. Between public_html and public_html (77)
// 3. Within public_html (77) only
// 4. Other (root files, etc.)

const withinPublicHtml = [];
const betweenPublicAnd77 = [];
const within77 = [];
const other = [];

for (const item of report) {
  const inPub = item.files.filter(f => f.startsWith('public_html/'));
  const in77 = item.files.filter(f => f.startsWith('public_html (77)/'));
  const inRoot = item.files.filter(f => !f.startsWith('public_html/') && !f.startsWith('public_html (77)/'));

  if (inPub.length > 1) {
    withinPublicHtml.push({ files: inPub, size: item.size, hash: item.hash });
  }
  if (in77.length > 1) {
    within77.push({ files: in77, size: item.size, hash: item.hash });
  }
  if (inPub.length >= 1 && in77.length >= 1) {
    betweenPublicAnd77.push({ pub: inPub, p77: in77, size: item.size, hash: item.hash });
  }
  if (inRoot.length > 0) {
    other.push(item);
  }
}

console.log('--- DUPLICATE SUMMARY ---');
console.log(`Duplicates strictly within public_html: ${withinPublicHtml.length}`);
console.log(`Duplicates strictly within public_html (77): ${within77.length}`);
console.log(`Duplicates across public_html and public_html (77): ${betweenPublicAnd77.length}`);
console.log(`Other duplicates: ${other.length}`);

if (withinPublicHtml.length > 0) {
  console.log('\nDetails of duplicates WITHIN public_html:');
  console.log(JSON.stringify(withinPublicHtml, null, 2));
}

if (within77.length > 0) {
  console.log('\nDetails of duplicates WITHIN public_html (77):');
  console.log(JSON.stringify(within77, null, 2));
}
