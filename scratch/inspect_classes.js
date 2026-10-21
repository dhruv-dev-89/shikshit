const fs = require('fs');

function analyze(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\n=== CLASSES IN ${filePath} ===`);
  const cardClasses = [];
  const matches = content.match(/class=["']([^"']*)["']/g) || [];
  matches.forEach(m => {
    const val = m.replace(/class=["']|["']/g, '');
    val.split(/\s+/).forEach(c => {
      if (c.includes('card') || c.includes('intervention') || c.includes('benefit') || c.includes('advisory') || c.includes('plan')) {
        if (!cardClasses.includes(c)) cardClasses.push(c);
      }
    });
  });
  console.log('Card/Plan/Benefit classes:', cardClasses);
}

analyze('public_html/donate.html');
analyze('public_html/become-a-member.html');
