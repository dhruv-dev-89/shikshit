const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const repoRoot = path.resolve(__dirname, '..');

// Scan all files except .git, .qodo, scratch, public_html_backup
const ignoreDirs = new Set(['.git', '.qodo', 'scratch', 'public_html_backup']);

function hashFile(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function scanDir(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (dir === repoRoot && ignoreDirs.has(entry.name)) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath, fileList);
    } else if (entry.isFile()) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allFiles = scanDir(repoRoot);
console.log(`Scanned ${allFiles.length} files total (excluding .git, .qodo, scratch, public_html_backup).`);

// Group by hash
const hashMap = new Map();
for (const f of allFiles) {
  const h = hashFile(f);
  if (!hashMap.has(h)) {
    hashMap.set(h, []);
  }
  hashMap.get(h).push(f);
}

const duplicates = [];
for (const [hash, files] of hashMap.entries()) {
  if (files.length > 1) {
    const size = fs.statSync(files[0]).size;
    duplicates.push({ hash, size, files });
  }
}

console.log(`Found ${duplicates.length} unique file contents that have duplicates.`);
let totalDupFiles = 0;
duplicates.forEach(d => {
  totalDupFiles += d.files.length;
});
console.log(`Total duplicate file instances: ${totalDupFiles}`);

// Output summary
fs.writeFileSync(
  path.join(__dirname, 'duplicate_audit_report.json'),
  JSON.stringify(duplicates.map(d => ({
    hash: d.hash,
    size: d.size,
    files: d.files.map(f => path.relative(repoRoot, f).replace(/\\/g, '/'))
  })), null, 2)
);
console.log('Saved duplicate_audit_report.json');
