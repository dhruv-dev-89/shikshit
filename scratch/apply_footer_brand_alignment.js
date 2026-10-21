const fs = require('fs');
const path = require('path');

const folders = ['public_html', 'public_html (77)'];
const pages = ['index.html', 'product-services.html'];

for (const folder of folders) {
  for (const page of pages) {
    const filePath = path.join(__dirname, '..', folder, page);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace the brand block inside footer-grid
    const oldBrandRegex = /<div class="footer-brand" style="[^"]*margin-bottom:\s*28px;[^"]*">\s*<img src="images\/sikshitlogo\.webp" alt="Shikshit Logo" class="footer-logo" style="[^"]*">\s*<\/div>\s*<p style="([^"]*)">\s*Empowering students/g;

    const newBrandSnippet = `<div class="footer-brand" style="display: flex; align-items: flex-start; justify-content: flex-start; margin: 0; padding: 0; height: 56px;">
              <img src="images/sikshitlogo.webp" alt="Shikshit Logo" class="footer-logo" style="height: 56px; width: auto; max-width: 100%; display: block; margin: 0; object-fit: contain;">
            </div>
            <p style="$1 margin-top: 16px; margin-bottom: 0;">
              Empowering students`;

    if (oldBrandRegex.test(content)) {
      content = content.replace(oldBrandRegex, newBrandSnippet);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated footer brand in ${folder}/${page}`);
    } else {
      console.log(`Could not match oldBrandRegex in ${folder}/${page}, checking alternative`);
      // More flexible match if needed
      const flexRegex = /<div class="footer-brand"[\s\S]*?<img src="images\/sikshitlogo\.webp"[\s\S]*?<\/div>\s*<p style="([^"]*)">\s*Empowering students/;
      if (flexRegex.test(content)) {
        content = content.replace(flexRegex, newBrandSnippet);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated footer brand (flexRegex) in ${folder}/${page}`);
      } else {
        console.warn(`WARNING: Failed to match footer brand in ${folder}/${page}`);
      }
    }
  }
}

console.log('Footer brand alignment update complete.');
