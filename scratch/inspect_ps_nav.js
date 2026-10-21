const fs = require('fs');

const html = fs.readFileSync('public_html/product-services.html', 'utf8');

const navMatches = html.match(/<nav[^>]*>[\s\S]*?<\/nav>/gi) || [];
console.log('Nav tags count:', navMatches.length);
navMatches.forEach((n, i) => console.log('Nav ' + (i+1) + ':\n' + n.slice(0, 400) + '...\n'));

// check for 'sticky' or 'pill' or 'section-index'
const matches = html.match(/class=["'][^"']*(?:sticky|index|pill|section)[^"']*["']/gi) || [];
console.log('Matches sample:', matches.slice(0, 15));

// Find words from prompt: Scholarships, Awareness, Olympiads, Financial Aid, Technical Training, Video Ads, Diploma Courses
['Scholarship', 'Awareness', 'Olympiad', 'Financial', 'Technical', 'Video', 'Diploma'].forEach(w => {
  const count = (html.match(new RegExp(w, 'gi')) || []).length;
  console.log(w, 'count in html:', count);
});
