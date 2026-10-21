const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const repoRoot = path.resolve(__dirname, '..');
const pub = path.join(repoRoot, 'public_html');
const pub77 = path.join(repoRoot, 'public_html (77)');

function scan(dir) {
  const list = [];
  function rec(d, rel = '') {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const r = rel ? rel + '/' + ent.name : ent.name;
      const full = path.join(d, ent.name);
      if (ent.isDirectory()) {
        rec(full, r);
      } else if (ent.isFile()) {
        const hash = crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex');
        const size = fs.statSync(full).size;
        list.push({ rel: r, hash, size });
      }
    }
  }
  rec(dir);
  return list;
}

const pubFiles = scan(pub);
const pub77Files = scan(pub77);

console.log(`public_html total files: ${pubFiles.length}`);
console.log(`public_html (77) total files: ${pub77Files.length}`);

const mapPub = new Map(pubFiles.map(f => [f.rel, f]));
const map77 = new Map(pub77Files.map(f => [f.rel, f]));

const onlyInPub = [];
const onlyIn77 = [];
const identical = [];
const differentContent = [];

for (const f of pubFiles) {
  if (!map77.has(f.rel)) {
    onlyInPub.push(f);
  } else {
    const f77 = map77.get(f.rel);
    if (f.hash === f77.hash) {
      identical.push(f);
    } else {
      differentContent.push({ rel: f.rel, pub: f, p77: f77 });
    }
  }
}

for (const f of pub77Files) {
  if (!mapPub.has(f.rel)) {
    onlyIn77.push(f);
  }
}

console.log(`Identical files in both: ${identical.length}`);
console.log(`Only in public_html: ${onlyInPub.length}`);
console.log(`Only in public_html (77): ${onlyIn77.length}`);
console.log(`Different content between public_html and public_html (77): ${differentContent.length}`);

if (onlyInPub.length > 0) {
  console.log('\nFiles only in public_html:');
  console.log(onlyInPub.map(f => f.rel));
}
if (onlyIn77.length > 0) {
  console.log('\nFiles only in public_html (77):');
  console.log(onlyIn77.map(f => f.rel));
}
if (differentContent.length > 0) {
  console.log('\nFiles with different content:');
  console.log(differentContent.map(f => ({
    rel: f.rel,
    pubSize: f.pub.size,
    p77Size: f.p77.size
  })));
}
