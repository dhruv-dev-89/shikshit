const fs = require('fs');

const html = fs.readFileSync('public_html/product-services.html', 'utf8');

const pillTargets = [
  'scholarship-program',
  'awareness-programs',
  'olympiads',
  'financial-aid',
  'technical-training',
  'video-ads',
  'diploma-courses'
];

console.log('=== PILL TARGETS AUDIT ===');
pillTargets.forEach(id => {
  const regex = new RegExp('<([a-zA-Z0-9]+)[^>]*id=[\'"]' + id + '[\'"][^>]*>', 'g');
  let match;
  let matches = [];
  while ((match = regex.exec(html)) !== null) {
    matches.push({ tag: match[1], full: match[0], index: match.index });
  }
  console.log(`ID: #${id} -> found ${matches.length} occurrence(s)`);
  matches.forEach(m => {
    console.log(`   Tag: <${m.tag}> at char index ${m.index}`);
    console.log(`   Snippet: ${m.full.slice(0, 100)}`);
  });
});

console.log('\n=== ALL SECTIONS IN PRODUCT-SERVICES.HTML IN ORDER ===');
const allIdsRegex = /<([a-zA-Z0-9]+)[^>]*id=['"]([^'"]+)['"][^>]*>/g;
let m;
let foundSections = [];
while ((m = allIdsRegex.exec(html)) !== null) {
  if (['section', 'article', 'div'].includes(m[1].toLowerCase()) && 
      (pillTargets.includes(m[2]) || m[2].includes('product') || m[2].includes('video') || m[2].includes('courses'))) {
    foundSections.push({ tag: m[1], id: m[2], index: m.index, snippet: m[0].slice(0, 80) });
  }
}
foundSections.sort((a,b) => a.index - b.index);
foundSections.forEach((s, i) => {
  console.log(`${i+1}. <${s.tag} id="${s.id}"> (char: ${s.index})`);
});
