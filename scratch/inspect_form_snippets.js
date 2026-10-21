const fs = require('fs');

const donateHtml = fs.readFileSync('public_html/donate.html', 'utf8');
const memberHtml = fs.readFileSync('public_html/become-a-member.html', 'utf8');

console.log('--- DONATE.HTML FORM & CARDS SNIPPET ---');
const donateFormMatch = donateHtml.match(/<section[^>]*id=["']donate-form["'][\s\S]*?<\/section>/i);
if (donateFormMatch) {
  console.log(donateFormMatch[0].slice(0, 1500));
}

console.log('\n--- BECOME-A-MEMBER.HTML FORM & CARDS SNIPPET ---');
const memberFormMatch = memberHtml.match(/<section[^>]*id=["']membership-form["'][\s\S]*?<\/section>/i);
if (memberFormMatch) {
  console.log(memberFormMatch[0].slice(0, 1500));
}
