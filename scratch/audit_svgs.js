const fs = require('fs');

const content = fs.readFileSync('public_html/become-a-member.html', 'utf8');
const lines = content.split('\n');

const svgs = [];
let count = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('<svg')) {
    count++;
    // Collect until </svg>
    let svgSnippet = '';
    let j = i;
    while (j < lines.length && !lines[j].includes('</svg>')) {
      svgSnippet += lines[j] + '\n';
      j++;
    }
    if (j < lines.length) svgSnippet += lines[j];
    
    // Check surrounding context (previous 5 lines)
    const context = lines.slice(Math.max(0, i - 4), i + 1).join(' ').replace(/\s+/g, ' ');

    svgs.push({
      index: count,
      line: i + 1,
      endLine: j + 1,
      snippet: svgSnippet,
      context: context
    });
  }
}

console.log('Total SVGs found:', count);
fs.writeFileSync('scratch/svg_audit.json', JSON.stringify(svgs, null, 2));
