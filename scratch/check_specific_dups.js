const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function getHash(p) {
  return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
}

// 1. Check nested shikshit/shikshit files
const nested = [
  'css/shikshit/shikshit/base.css',
  'css/shikshit/shikshit/components.css',
  'css/shikshit/shikshit/pages.css',
  'css/shikshit/shikshit/tokens.css'
];

console.log('--- CHECKING NESTED SHIKSHIT/SHIKSHIT FILES ---');
for (const n of nested) {
  const p77Nested = path.join('public_html (77)', n);
  const p77Parent = path.join('public_html (77)', n.replace('shikshit/shikshit', 'shikshit'));
  const pubParent = path.join('public_html', n.replace('shikshit/shikshit', 'shikshit'));

  const hNested = getHash(p77Nested);
  const h77Parent = getHash(p77Parent);
  const hPubParent = getHash(pubParent);

  console.log(`${n}:`);
  console.log(`  Nested hash:      ${hNested}`);
  console.log(`  p77 parent hash:  ${h77Parent} (match? ${hNested === h77Parent})`);
  console.log(`  pub parent hash:  ${hPubParent} (match? ${hNested === hPubParent})`);
}

// 2. Check client9.webp and sikshitlogo.webp
console.log('\n--- CHECKING CLIENT9.WEBP & SIKSHITLOGO.WEBP ---');
const c9Pub = path.join('public_html', 'images', 'client9.webp');
const logoPub = path.join('public_html', 'images', 'sikshitlogo.webp');
console.log('client9 hash: ', getHash(c9Pub));
console.log('sikshitlogo hash: ', getHash(logoPub));
console.log('Matches? ', getHash(c9Pub) === getHash(logoPub));

// 3. Search references for client9.webp across all html, css, js
console.log('\n--- CHECKING REFERENCES TO client9.webp ---');
function searchRefs(target) {
  const refs = [];
  function rec(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (!['.git', '.qodo', 'scratch'].includes(ent.name)) rec(full);
      } else if (/\.(html|css|js|json)$/i.test(ent.name)) {
        const text = fs.readFileSync(full, 'utf8');
        if (text.includes(target)) {
          refs.push(full);
        }
      }
    }
  }
  rec('.');
  return refs;
}

console.log('References to client9.webp:');
console.log(searchRefs('client9.webp'));

console.log('References to AUDIT.md in web files:');
console.log(searchRefs('AUDIT.md'));

console.log('References to CHANGES.md in web files:');
console.log(searchRefs('CHANGES.md'));

console.log('References to css/shikshit/shikshit in web files:');
console.log(searchRefs('css/shikshit/shikshit'));
