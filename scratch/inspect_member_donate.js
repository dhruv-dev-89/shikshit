const fs = require('fs');

console.log('=== BECOME-A-MEMBER.HTML INSPECTION ===');
const memberHtml = fs.readFileSync('public_html/become-a-member.html', 'utf8');
console.log('Member HTML size:', memberHtml.length);
const memberBodyMatch = memberHtml.match(/<body[^>]*>/);
console.log('Member body tag:', memberBodyMatch ? memberBodyMatch[0] : 'None');
const memberCssMatch = [...memberHtml.matchAll(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi)];
memberCssMatch.forEach(m => console.log('Member CSS:', m[0]));

console.log('\n=== DONATE.HTML INSPECTION ===');
const donateHtml = fs.readFileSync('public_html/donate.html', 'utf8');
console.log('Donate HTML size:', donateHtml.length);
const donateBodyMatch = donateHtml.match(/<body[^>]*>/);
console.log('Donate body tag:', donateBodyMatch ? donateBodyMatch[0] : 'None');
const donateCssMatch = [...donateHtml.matchAll(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi)];
donateCssMatch.forEach(m => console.log('Donate CSS:', m[0]));
