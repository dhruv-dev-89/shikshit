const fs = require('fs');

function updateHtml(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Remove navbar class from <nav class="shikshit-navbar navbar"
    content = content.replace(
        '<nav class="shikshit-navbar navbar" aria-label="Main Navigation">',
        '<nav class="shikshit-navbar" aria-label="Main Navigation">'
    );

    // 2. Restructure the ribbons marquee
    const ribbonRegex = /<!-- Tilted Double Ribbon Marquee -->[\s\S]*?<div class="products-hero-bands" aria-hidden="true">[\s\S]*?<\/div>\s*<\/section>/;

    const newRibbonMarkup = `<!-- Tilted Double Ribbon Marquee -->
      <div class="products-hero-bands" aria-hidden="true">
        <!-- Top Ribbon: Signature Gradient (-1.8deg, scrolls left, 40s) -->
        <div class="ribbon ribbon-gradient">
          <div class="ribbon-track track-left">
            <div class="track-half">
              <span>★ SCHOLARSHIPS UP TO ₹25,000</span>
              <span class="ribbon-dot">•</span>
              <span>UGC APPROVED DIPLOMAS</span>
              <span class="ribbon-dot">•</span>
              <span>NATIONAL OLYMPIADS</span>
              <span class="ribbon-dot">•</span>
              <span>TECHNICAL &amp; VOCATIONAL TRAINING</span>
              <span class="ribbon-dot">•</span>
              <span>FINANCIAL AID ASSISTANCE</span>
              <span class="ribbon-dot">•</span>
              <span>COMMUNITY AWARENESS INITIATIVES</span>
              <span class="ribbon-dot">•</span>
              <span>★ SCHOLARSHIPS UP TO ₹25,000</span>
              <span class="ribbon-dot">•</span>
              <span>UGC APPROVED DIPLOMAS</span>
              <span class="ribbon-dot">•</span>
              <span>NATIONAL OLYMPIADS</span>
              <span class="ribbon-dot">•</span>
              <span>TECHNICAL &amp; VOCATIONAL TRAINING</span>
              <span class="ribbon-dot">•</span>
              <span>FINANCIAL AID ASSISTANCE</span>
              <span class="ribbon-dot">•</span>
              <span>COMMUNITY AWARENESS INITIATIVES</span>
              <span class="ribbon-dot">•</span>
              <span>★ SCHOLARSHIPS UP TO ₹25,000</span>
              <span class="ribbon-dot">•</span>
              <span>UGC APPROVED DIPLOMAS</span>
              <span class="ribbon-dot">•</span>
              <span>NATIONAL OLYMPIADS</span>
              <span class="ribbon-dot">•</span>
              <span>TECHNICAL &amp; VOCATIONAL TRAINING</span>
              <span class="ribbon-dot">•</span>
              <span>FINANCIAL AID ASSISTANCE</span>
              <span class="ribbon-dot">•</span>
              <span>COMMUNITY AWARENESS INITIATIVES</span>
              <span class="ribbon-dot">•</span>
            </div>
            <div class="track-half" aria-hidden="true">
              <span>★ SCHOLARSHIPS UP TO ₹25,000</span>
              <span class="ribbon-dot">•</span>
              <span>UGC APPROVED DIPLOMAS</span>
              <span class="ribbon-dot">•</span>
              <span>NATIONAL OLYMPIADS</span>
              <span class="ribbon-dot">•</span>
              <span>TECHNICAL &amp; VOCATIONAL TRAINING</span>
              <span class="ribbon-dot">•</span>
              <span>FINANCIAL AID ASSISTANCE</span>
              <span class="ribbon-dot">•</span>
              <span>COMMUNITY AWARENESS INITIATIVES</span>
              <span class="ribbon-dot">•</span>
              <span>★ SCHOLARSHIPS UP TO ₹25,000</span>
              <span class="ribbon-dot">•</span>
              <span>UGC APPROVED DIPLOMAS</span>
              <span class="ribbon-dot">•</span>
              <span>NATIONAL OLYMPIADS</span>
              <span class="ribbon-dot">•</span>
              <span>TECHNICAL &amp; VOCATIONAL TRAINING</span>
              <span class="ribbon-dot">•</span>
              <span>FINANCIAL AID ASSISTANCE</span>
              <span class="ribbon-dot">•</span>
              <span>COMMUNITY AWARENESS INITIATIVES</span>
              <span class="ribbon-dot">•</span>
              <span>★ SCHOLARSHIPS UP TO ₹25,000</span>
              <span class="ribbon-dot">•</span>
              <span>UGC APPROVED DIPLOMAS</span>
              <span class="ribbon-dot">•</span>
              <span>NATIONAL OLYMPIADS</span>
              <span class="ribbon-dot">•</span>
              <span>TECHNICAL &amp; VOCATIONAL TRAINING</span>
              <span class="ribbon-dot">•</span>
              <span>FINANCIAL AID ASSISTANCE</span>
              <span class="ribbon-dot">•</span>
              <span>COMMUNITY AWARENESS INITIATIVES</span>
              <span class="ribbon-dot">•</span>
            </div>
          </div>
        </div>

        <!-- Crossing Ribbon: White Glass (+1.5deg, scrolls right, 55s) -->
        <div class="ribbon ribbon-white">
          <div class="ribbon-track track-right">
            <div class="track-half">
              <span>MERIT SCHOLARSHIPS</span>
              <span class="ribbon-dot">•</span>
              <span>DIGITAL MARKETING</span>
              <span class="ribbon-dot">•</span>
              <span>WEB DEVELOPMENT</span>
              <span class="ribbon-dot">•</span>
              <span>SCIENCE &amp; MATH OLYMPIADS</span>
              <span class="ribbon-dot">•</span>
              <span>COMMUNITY EMPOWERMENT</span>
              <span class="ribbon-dot">•</span>
              <span>AI &amp; CLOUD COMPUTING</span>
              <span class="ribbon-dot">•</span>
              <span>MERIT SCHOLARSHIPS</span>
              <span class="ribbon-dot">•</span>
              <span>DIGITAL MARKETING</span>
              <span class="ribbon-dot">•</span>
              <span>WEB DEVELOPMENT</span>
              <span class="ribbon-dot">•</span>
              <span>SCIENCE &amp; MATH OLYMPIADS</span>
              <span class="ribbon-dot">•</span>
              <span>COMMUNITY EMPOWERMENT</span>
              <span class="ribbon-dot">•</span>
              <span>AI &amp; CLOUD COMPUTING</span>
              <span class="ribbon-dot">•</span>
              <span>MERIT SCHOLARSHIPS</span>
              <span class="ribbon-dot">•</span>
              <span>DIGITAL MARKETING</span>
              <span class="ribbon-dot">•</span>
              <span>WEB DEVELOPMENT</span>
              <span class="ribbon-dot">•</span>
              <span>SCIENCE &amp; MATH OLYMPIADS</span>
              <span class="ribbon-dot">•</span>
              <span>COMMUNITY EMPOWERMENT</span>
              <span class="ribbon-dot">•</span>
              <span>AI &amp; CLOUD COMPUTING</span>
              <span class="ribbon-dot">•</span>
            </div>
            <div class="track-half" aria-hidden="true">
              <span>MERIT SCHOLARSHIPS</span>
              <span class="ribbon-dot">•</span>
              <span>DIGITAL MARKETING</span>
              <span class="ribbon-dot">•</span>
              <span>WEB DEVELOPMENT</span>
              <span class="ribbon-dot">•</span>
              <span>SCIENCE &amp; MATH OLYMPIADS</span>
              <span class="ribbon-dot">•</span>
              <span>COMMUNITY EMPOWERMENT</span>
              <span class="ribbon-dot">•</span>
              <span>AI &amp; CLOUD COMPUTING</span>
              <span class="ribbon-dot">•</span>
              <span>MERIT SCHOLARSHIPS</span>
              <span class="ribbon-dot">•</span>
              <span>DIGITAL MARKETING</span>
              <span class="ribbon-dot">•</span>
              <span>WEB DEVELOPMENT</span>
              <span class="ribbon-dot">•</span>
              <span>SCIENCE &amp; MATH OLYMPIADS</span>
              <span class="ribbon-dot">•</span>
              <span>COMMUNITY EMPOWERMENT</span>
              <span class="ribbon-dot">•</span>
              <span>AI &amp; CLOUD COMPUTING</span>
              <span class="ribbon-dot">•</span>
              <span>MERIT SCHOLARSHIPS</span>
              <span class="ribbon-dot">•</span>
              <span>DIGITAL MARKETING</span>
              <span class="ribbon-dot">•</span>
              <span>WEB DEVELOPMENT</span>
              <span class="ribbon-dot">•</span>
              <span>SCIENCE &amp; MATH OLYMPIADS</span>
              <span class="ribbon-dot">•</span>
              <span>COMMUNITY EMPOWERMENT</span>
              <span class="ribbon-dot">•</span>
              <span>AI &amp; CLOUD COMPUTING</span>
              <span class="ribbon-dot">•</span>
            </div>
          </div>
        </div>
      </div>
    </section>`;

    content = content.replace(ribbonRegex, newRibbonMarkup);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated HTML: ${filePath}`);
}

updateHtml('c:/Users/kesha/Desktop/Shikshit01/public_html/product-services.html');
updateHtml('c:/Users/kesha/Desktop/Shikshit01/public_html (77)/product-services.html');
