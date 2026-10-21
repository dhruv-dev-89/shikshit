const fs = require('fs');

const items = JSON.parse(fs.readFileSync('scratch/svg_analysis.json', 'utf8'));

items.forEach(it => {
  console.log(`\n--- [SVG #${it.index}] Line: ${it.line} ---`);
  console.log(`Class: "${it.className}" | ViewBox: "${it.viewBox}" | WxH: "${it.width}"x"${it.height}" | Fill: "${it.fill}" | Stroke: "${it.stroke}" (w: ${it.strokeWidth})`);
  console.log(`Context Before: ${it.contextBefore.slice(-100)}`);
  console.log(`Context After: ${it.contextAfter.slice(0, 100)}`);
  console.log(`Snippet Head: ${it.snippet.slice(0, 120)}...`);
});
