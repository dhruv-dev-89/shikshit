const fs = require('fs');
const path = require('path');

const folders = ['public_html', 'public_html (77)'];

// ============================================================================
// 1. UPDATE product-services.html (Add Glider in pill track & ensure headings have tabindex="-1")
// ============================================================================
for (const folder of folders) {
  const psPath = path.join(__dirname, '..', folder, 'product-services.html');
  let psContent = fs.readFileSync(psPath, 'utf8');

  // Add glider into index-pill-track if not present
  if (!psContent.includes('class="index-pill-glider"')) {
    psContent = psContent.replace(
      /<div class="index-pill-track">/g,
      '<div class="index-pill-track">\n        <div class="index-pill-glider" aria-hidden="true"></div>'
    );
  }

  // Ensure pills have aria-current on active and proper aria labels
  psContent = psContent.replace(
    /<a href="#scholarship-program" class="index-pill active">Scholarships<\/a>/g,
    '<a href="#scholarship-program" class="index-pill active" aria-current="true">Scholarships</a>'
  );

  fs.writeFileSync(psPath, psContent, 'utf8');
  console.log(`Updated product-services.html in ${folder}`);
}

console.log('Step 1 complete.');
