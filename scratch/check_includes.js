const fs = require('fs');
fs.readdirSync('public_html').filter(f => f.endsWith('.html')).forEach(f => {
  const c = fs.readFileSync('public_html/' + f, 'utf8');
  const reg = /include-html=["']([^"']+)["']/gi;
  let m;
  const list = [];
  while ((m = reg.exec(c)) !== null) {
    list.push(m[1]);
  }
  if (list.length) console.log(f, list);
});
