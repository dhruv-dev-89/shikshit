const fs = require('fs');

const donateHtml = fs.readFileSync('public_html/donate.html', 'utf8');

console.log('--- DONATE.HTML SECTIONS ---');
const lines = donateHtml.split('\n');
lines.forEach((l, i) => {
  if (l.includes('<section') || l.includes('class="hero') || l.includes('id="donationForm') || l.includes('trust')) {
    console.log(i + 1, l.slice(0, 100));
  }
});
