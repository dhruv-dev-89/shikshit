const fs = require('fs');
const path = require('path');

const htmlFiles = fs.readdirSync('public_html').filter(f => f.endsWith('.html'));
const results = {};

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join('public_html', file), 'utf8');
  const srcRegex = /src=["']([^"']+)["']/gi;
  const hrefRegex = /href=["']([^"']+\.(?:css|js))["']/gi;
  let m;
  const missing = [];

  while ((m = srcRegex.exec(content)) !== null) {
    const ref = m[1];
    if (ref.startsWith('http') || ref.startsWith('//') || ref.startsWith('data:') || ref.startsWith('#') || ref.startsWith('mailto:') || ref.startsWith('tel:')) continue;
    const cleanRef = ref.split('?')[0].split('#')[0];
    const fullPath = path.join('public_html', cleanRef);
    if (!fs.existsSync(fullPath)) {
      missing.push(ref);
    }
  }

  while ((m = hrefRegex.exec(content)) !== null) {
    const ref = m[1];
    if (ref.startsWith('http') || ref.startsWith('//') || ref.startsWith('data:') || ref.startsWith('#') || ref.startsWith('mailto:') || ref.startsWith('tel:')) continue;
    const cleanRef = ref.split('?')[0].split('#')[0];
    const fullPath = path.join('public_html', cleanRef);
    if (!fs.existsSync(fullPath)) {
      missing.push(ref);
    }
  }

  if (missing.length > 0) {
    results[file] = missing;
  }
});

console.log(JSON.stringify(results, null, 2));
