const fs = require('fs');
const report = JSON.parse(fs.readFileSync('scratch/duplicate_audit_report.json', 'utf8'));

console.log('Total duplicate sets:', report.length);
for (let i = 0; i < report.length; i++) {
  const item = report[i];
  // check if it's just between public_html and public_html (77)
  const isDirectMirror = (
    item.files.length === 2 &&
    (
      (item.files[0].startsWith('public_html/') && item.files[1] === item.files[0].replace('public_html/', 'public_html (77)/')) ||
      (item.files[1].startsWith('public_html/') && item.files[0] === item.files[1].replace('public_html/', 'public_html (77)/'))
    )
  );

  if (!isDirectMirror) {
    console.log(`[Non-Mirror Set ${i+1}] Hash: ${item.hash.slice(0, 8)} Size: ${item.size}`);
    item.files.forEach(f => console.log('   - ' + f));
  }
}
