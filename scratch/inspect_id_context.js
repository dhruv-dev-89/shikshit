const fs = require('fs');

const html = fs.readFileSync('public_html/product-services.html', 'utf8');
const ids = ['scholarship-program', 'awareness-programs', 'olympiads', 'financial-aid', 'technical-training', 'video-ads', 'diploma-courses'];

ids.forEach(id => {
  const target = `id="${id}"`;
  const idx = html.indexOf(target);
  console.log(`\n=================== ${id} ===================`);
  if (idx !== -1) {
    console.log(html.slice(idx - 60, idx + 350));
  } else {
    console.log('NOT FOUND');
  }
});
