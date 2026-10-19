const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find .products-hero-bands
  const startTag = '<div class="products-hero-bands" aria-hidden="true">';
  const endTag = '</div>\n    </section>';
  
  const startIndex = content.indexOf(startTag);
  if (startIndex === -1) {
    console.error('Could not find startTag in ' + filePath);
    return false;
  }
  
  // Let's inspect the block
  const blockEnd = content.indexOf('</section>', startIndex);
  const existingBlock = content.substring(startIndex, blockEnd);
  
  // Define the canonical repeated sets (4 sets for each track)
  const setA = `            <span>★ SCHOLARSHIPS UP TO ₹25,000</span>
            <span>•</span>
            <span>UGC APPROVED DIPLOMAS</span>
            <span>•</span>
            <span>NATIONAL OLYMPIADS</span>
            <span>•</span>
            <span>TECHNICAL &amp; VOCATIONAL TRAINING</span>
            <span>•</span>
            <span>FINANCIAL AID ASSISTANCE</span>
            <span>•</span>
            <span>COMMUNITY AWARENESS INITIATIVES</span>
            <span>•</span>\n`;

  const setB = `            <span>MERIT SCHOLARSHIPS</span>
            <span>•</span>
            <span>DIGITAL MARKETING</span>
            <span>•</span>
            <span>WEB DEVELOPMENT</span>
            <span>•</span>
            <span>SCIENCE &amp; MATH OLYMPIADS</span>
            <span>•</span>
            <span>COMMUNITY EMPOWERMENT</span>
            <span>•</span>
            <span>AI &amp; CLOUD COMPUTING</span>
            <span>•</span>\n`;

  const newBlock = `<div class="products-hero-bands" aria-hidden="true">
        <div class="bd a">
          <div>
${setA.repeat(4).trimEnd()}
          </div>
        </div>
        <div class="bd b">
          <div>
${setB.repeat(4).trimEnd()}
          </div>
        </div>
      </div>
    `;

  content = content.substring(0, startIndex) + newBlock + content.substring(blockEnd);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated ' + filePath);
  return true;
}

updateFile('public_html/product-services.html');
updateFile('public_html (77)/product-services.html');
