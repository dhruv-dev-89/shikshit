const fs = require('fs');

const memberHtml = fs.readFileSync('public_html/become-a-member.html', 'utf8');

console.log('--- BECOME-A-MEMBER.HTML STRUCTURE ---');
// Check for cards, form, why choose
const lines = memberHtml.split('\n');
lines.forEach((l, i) => {
  if (l.includes('membership-card') || l.includes('pricing') || l.includes('plan-card') || l.includes('form') || l.includes('why-choose') || l.includes('price')) {
    if (l.includes('class=') || l.includes('id=')) {
      console.log(i + 1, l.slice(0, 100));
    }
  }
});
