const fs = require('fs');
const html = fs.readFileSync('public_html/product-services.html', 'utf8');

const regex = /<(section|div)[^>]*id=['"]([^'"]+)['"][^>]*>/g;
let m;
while ((m = regex.exec(html)) !== null) {
  if (['products-services', 'scholarship-program', 'awareness-programs', 'olympiads', 'financial-aid', 'technical-training', 'video-ads', 'diploma-courses'].includes(m[2])) {
    console.log(`Tag: <${m[1]}> id="${m[2]}" char: ${m.index}`);
  }
}
