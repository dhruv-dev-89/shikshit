const fs = require('fs');

const donateHtml = fs.readFileSync('public_html/donate.html', 'utf8');

console.log('--- DONATE.HTML SCRIPTS ---');
const scriptMatches = [...donateHtml.matchAll(/<script[^>]*src=["']([^"']*)["'][^>]*>/gi)];
scriptMatches.forEach(m => console.log('Script:', m[0]));

console.log('\n--- DONATE.HTML AMOUNT CHIPS / BUTTONS ---');
donateHtml.split('\n').forEach((l, i) => {
  if (l.includes('donationAmount') || l.includes('amount-button') || l.includes('amount-chip') || l.includes('customAmount')) {
    console.log(i + 1, l.slice(0, 100));
  }
});

console.log('\n--- CHECK FOR REQUIRED DONATION IDS ---');
const requiredIds = [
  'donationForm', 'donorName', 'donorEmail', 'donorPhone',
  'donationAmount', 'customAmount', 'donateButton', 'buttonText',
  'buttonSpinner', 'paymentLoading', 'paymentSuccess', 'paymentError',
  'errorMessage'
];

requiredIds.forEach(id => {
  const exists = donateHtml.includes('id="' + id + '"') || donateHtml.includes("id='" + id + "'");
  console.log(`ID #${id}: ${exists ? 'FOUND' : 'MISSING!'}`);
});
