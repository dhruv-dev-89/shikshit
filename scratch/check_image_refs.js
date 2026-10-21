const fs = require('fs');
const path = require('path');

const pubImages = fs.readdirSync('public_html/images');
const htmlCssJs = [];

function getFiles(d) {
  for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
    const full = path.join(d, ent.name);
    if (ent.isDirectory()) {
      if (!['.git', '.qodo', 'scratch', 'public_html_backup'].includes(ent.name)) {
        getFiles(full);
      }
    } else if (/\.(html|css|js|json)$/i.test(ent.name)) {
      htmlCssJs.push(full);
    }
  }
}
getFiles('public_html');

const imageRefs = new Map();
for (const img of pubImages) {
  imageRefs.set(img, []);
}

for (const file of htmlCssJs) {
  const content = fs.readFileSync(file, 'utf8');
  for (const img of pubImages) {
    if (content.includes(img)) {
      imageRefs.get(img).push(file);
    }
  }
}

console.log('--- IMAGES IN public_html/images ---');
for (const [img, refs] of imageRefs.entries()) {
  if (refs.length === 0) {
    console.log(`Unreferenced image: ${img}`);
  }
}

console.log('\nReferences for client9.webp:', imageRefs.get('client9.webp'));
console.log('References for sikshitlogo.webp:', imageRefs.get('sikshitlogo.webp'));
