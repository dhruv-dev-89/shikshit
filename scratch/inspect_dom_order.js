const fs = require('fs');

const html = fs.readFileSync('public_html/product-services.html', 'utf8');
const ids = ['scholarship-program', 'awareness-programs', 'olympiads', 'financial-aid', 'technical-training', 'video-ads', 'diploma-courses'];
const positions = ids.map(id => ({ id, index: html.indexOf(`id="${id}"`) }));
positions.sort((a,b) => a.index - b.index);
console.log(positions);
