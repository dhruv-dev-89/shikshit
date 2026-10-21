const fs = require('fs');
const content = fs.readFileSync('public_html/product-services.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('<body') || l.includes('</head>') || l.toLowerCase().includes('body')) {
    console.log(i + 1, l.trim());
  }
});
