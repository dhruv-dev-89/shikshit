const fs = require('fs');
const cheerio = require('node:fs'); // we don't have cheerio, let's use regex or string parsing

const html = fs.readFileSync('public_html/product-services.html', 'utf8');

const sectionIds = [
  'scholarship-program',
  'awareness-programs',
  'olympiads',
  'financial-aid',
  'technical-training',
  'diploma-courses'
];

sectionIds.forEach(id => {
  const match = html.match(new RegExp(`<section[^>]*id="${id}"[\\s\\S]*?<\\/section>`));
  if (match) {
    const secHtml = match[0];
    const h2Match = secHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
    const h3Match = secHtml.match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
    console.log(`=== Section #${id} ===`);
    console.log('H2:', h2Match ? h2Match[1].replace(/<[^>]+>/g, '').trim() : 'NONE');
    console.log('H3:', h3Match ? h3Match[1].replace(/<[^>]+>/g, '').trim() : 'NONE');
    // Find all card headers / titles
    const cards = [];
    const h4Matches = secHtml.matchAll(/<h4[^>]*>([\s\S]*?)<\/h4>/g);
    for (const m of h4Matches) {
      cards.push(m[1].replace(/<[^>]+>/g, '').trim());
    }
    console.log('H4 items (' + cards.length + '):', cards);
    console.log('Approx length:', secHtml.length);
  } else {
    console.log(`Section #${id} NOT FOUND`);
  }
});
