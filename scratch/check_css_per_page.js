const fs = require('fs');
const path = require('path');
const htmlFiles = fs.readdirSync('public_html').filter(f => f.endsWith('.html'));
const cssPerFile = {};

htmlFiles.forEach(f => {
  const content = fs.readFileSync(path.join('public_html', f), 'utf8');
  const regex = /<link[^>]+href=["']([^"']+\.css)["']/gi;
  let m;
  const list = [];
  while ((m = regex.exec(content)) !== null) {
    list.push(m[1]);
  }
  cssPerFile[f] = list;
});
console.log(JSON.stringify(cssPerFile, null, 2));
