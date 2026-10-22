const fs = require('fs');
const path = require('path');

const targets = ['public_html (77)', 'public_html__77', 'css/shikshit/shikshit/'];

let found = 0;

function searchFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    targets.forEach(t => {
      if (content.includes(t)) {
        console.log(`Found "${t}" in ${filePath}`);
        found++;
      }
    });
  } catch (err) {
    // skip binary or unreadable
  }
}

function scanAndSearch(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      scanAndSearch(full);
    } else if (ent.isFile()) {
      searchFile(full);
    }
  }
}

console.log('Searching public_html...');
scanAndSearch('public_html');
console.log('Searching server.js...');
searchFile('server.js');
console.log('Searching AUDIT.md...');
searchFile('AUDIT.md');
console.log('Searching CHANGES.md...');
searchFile('CHANGES.md');
console.log(`Done searching. Total matches found: ${found}`);
