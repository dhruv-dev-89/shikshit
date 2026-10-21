const fs = require('fs');

const items = JSON.parse(fs.readFileSync('scratch/svg_analysis.json', 'utf8'));

let md = '| # | Line | Location | Representation | Style & ViewBox | Size (Fallback) | Colour Class | Problems Found |\n';
md += '|---|---|---|---|---|---|---|---|\n';

items.forEach((it, idx) => {
  let rep = '';
  let loc = '';
  let targetSize = '';
  let problems = [];

  // Determine line range and meaning
  if (it.line <= 195) {
    loc = 'Navbar';
    if (it.contextBefore.includes('ns-mas.html') || it.contextAfter.includes('ns-mas.html')) {
      rep = 'Nav Link: NS-MAS';
    } else if (it.contextBefore.includes('product-services.html') || it.contextAfter.includes('product-services.html')) {
      rep = 'Nav Link: Products & Services';
    } else {
      rep = 'Nav Link: Apply Now';
    }
    targetSize = '16x16 (w-4 h-4)';
    problems.push('Missing explicit width="16" height="16"; missing explicit fill="none" (relies on shared CSS)');
  } else if (it.line <= 350) {
    loc = 'Hero Section';
    if (it.className.includes('w-6 h-6')) {
      rep = 'Hero Heading Badge (Cap)';
      targetSize = '24x24 (w-6 h-6)';
      problems.push('Missing explicit width="24" height="24" fallback');
    } else if (it.className.includes('w-24') || it.className.includes('w-32') || it.className.includes('opacity-20') || it.className.includes('opacity-15')) {
      rep = it.line < 250 ? 'Hero Floating Decor (Cap - Left)' : 'Hero Floating Decor (Cap - Right)';
      targetSize = it.className.includes('w-32') ? '128x128 (w-32 h-32)' : '96x96 (w-24 h-24)';
      problems.push('Missing explicit width/height; cap reused redundantly as decorative background; risk of overflow clipping');
    } else if (it.contextBefore.includes('Join Network') || it.contextAfter.includes('Join Network')) {
      rep = 'Hero CTA Button: "Join Our Network"';
      targetSize = '20x20 (w-5 h-5)';
      problems.push('Missing explicit width="20" height="20" fallback');
    } else if (it.contextBefore.includes('Explore Tiers') || it.contextAfter.includes('Explore Tiers')) {
      rep = 'Hero CTA Button: "Explore Tiers"';
      targetSize = '20x20 (w-5 h-5)';
      problems.push('Missing explicit width="20" height="20" fallback');
    }
  } else if (it.line <= 900) {
    if (it.className.includes('w-12 h-12')) {
      loc = 'Membership Tier Card';
      if (it.line < 450) {
        rep = 'Tier Card 1: Student Membership';
        targetSize = '48x48 (w-12 h-12)';
        problems.push('Missing width="48" height="48"; typo "text-greeni-600" renders icon uncoloured/invisible');
      } else if (it.line < 500) {
        rep = 'Tier Card 2: Professional Membership';
        targetSize = '48x48 (w-12 h-12)';
        problems.push('Missing width="48" height="48"; graduation-cap path reused inappropriately for professional');
      } else if (it.line < 550) {
        rep = 'Tier Card 3: Institution Membership';
        targetSize = '48x48 (w-12 h-12)';
        problems.push('Missing width="48" height="48"; graduation-cap path reused inappropriately for institution');
      } else {
        rep = 'Tier Card 4: Corporate Membership';
        targetSize = '48x48 (w-12 h-12)';
        problems.push('Missing width="48" height="48"; graduation-cap path reused inappropriately for corporate');
      }
    } else if (it.className.includes('benefit-icon')) {
      loc = 'Tier Benefits Checklist';
      rep = 'Tier Benefit Checklist Item';
      targetSize = '20x20 (w-5 h-5)';
      problems.push('Missing explicit width="20" height="20" fallback; depends on Tailwind class');
    }
  } else if (it.line <= 1000) {
    loc = 'Comprehensive Benefits Grid';
    targetSize = '40x40 (w-10 h-10)';
    if (it.line < 860) {
      rep = 'Benefit Tile 1: Scholarship Opportunities';
      problems.push('Missing width="40" height="40"; graduation-cap reused redundantly');
    } else if (it.line < 880) {
      rep = 'Benefit Tile 2: Workshops & Training';
      problems.push('Missing width="40" height="40"; solid icon lacks fallback sizing');
    } else if (it.line < 900) {
      rep = 'Benefit Tile 3: Networking & Community';
      problems.push('Missing width="40" height="40"; solid icon lacks fallback sizing');
    } else if (it.line < 930) {
      rep = 'Benefit Tile 4: Mentorship Programs';
      problems.push('Missing width="40" height="40"; graduation-cap reused inappropriately for mentorship');
    } else if (it.line < 950) {
      rep = 'Benefit Tile 5: Resource Library';
      problems.push('Missing width="40" height="40"; solid icon lacks fallback sizing');
    } else {
      rep = 'Benefit Tile 6: Recognition & Awards';
      problems.push('Missing width="40" height="40"; graduation-cap reused inappropriately for awards/trophy; conflicting nested viewBox');
    }
  } else if (it.line <= 1120) {
    loc = 'Application Form';
    if (it.line < 1020) {
      rep = 'Form Header: Document Check';
      targetSize = '32x32 (w-8 h-8)';
      problems.push('Missing width="32" height="32" fallback');
    } else if (it.line < 1030) {
      rep = 'Form Label: Full Name';
      targetSize = '18x18 (w-4 h-4)';
      problems.push('Missing explicit width/height; 16px rendered instead of 18px standard; alignment needed');
    } else if (it.line < 1040) {
      rep = 'Form Label: Email Address';
      targetSize = '18x18 (w-4 h-4)';
      problems.push('Missing explicit width/height; 16px rendered instead of 18px standard');
    } else if (it.line < 1050) {
      rep = 'Form Label: Phone Number';
      targetSize = '18x18 (w-4 h-4)';
      problems.push('Missing explicit width/height; 16px rendered instead of 18px standard');
    } else if (it.line < 1060) {
      rep = 'Form Label: Institution / Organization';
      targetSize = '18x18 (w-4 h-4)';
      problems.push('Missing explicit width/height; 16px rendered instead of 18px standard');
    } else if (it.line < 1075) {
      rep = 'Form Label: City / Location';
      targetSize = '18x18 (w-4 h-4)';
      problems.push('Missing explicit width/height; 16px rendered instead of 18px standard');
    } else if (it.line < 1090) {
      rep = 'Form Label: Membership Type';
      targetSize = '18x18 (w-4 h-4)';
      problems.push('Missing explicit width/height; 16px rendered instead of 18px standard');
    } else if (it.line < 1100) {
      rep = 'Form Select Chevron Dropdown';
      targetSize = '20x20 (w-5 h-5)';
      problems.push('Missing width="20" height="20" fallback; needs vertical centering inside select container');
    } else if (it.line < 1105) {
      rep = 'Submit Button: Paper Airplane (Leading)';
      targetSize = '20x20 (w-5 h-5)';
      problems.push('Missing width="20" height="20" fallback');
    } else {
      rep = 'Submit Button: Arrow Right (Trailing)';
      targetSize = '20x20 (w-5 h-5)';
      problems.push('Missing width="20" height="20" fallback');
    }
  } else {
    loc = '"Why Choose" Tiles';
    targetSize = '28x28 (w-7 h-7)';
    if (it.line < 1140) {
      rep = 'Tile 1: Equal Opportunity (Sparkles)';
      problems.push('Missing width="28" height="28" fallback; solid icon lacks stroke clarity');
    } else if (it.line < 1155) {
      rep = 'Tile 2: Comprehensive Support (Card)';
      problems.push('Missing width="28" height="28" fallback; solid icon lacks stroke clarity');
    } else if (it.line < 1170) {
      rep = 'Tile 3: Quality Education (Briefcase)';
      problems.push('Missing width="28" height="28" fallback; solid icon lacks stroke clarity');
    } else {
      rep = 'Tile 4: Community Focus (Globe)';
      problems.push('Missing width="28" height="28" fallback; solid icon lacks stroke clarity');
    }
  }

  const styleText = it.viewBox === '0 0 20 20' ? 'Solid (`0 0 20 20`)' : 'Outline (`0 0 24 24`)';
  md += `| ${it.index} | L${it.line} | ${loc} | ${rep} | ${styleText} | ${targetSize} | \`${it.className || 'none'}\` | ${problems.join('; ')} |\n`;
});

// Append the 3 floating hub icons which were on the page originally
md += `| 39 | — | Floating Action Hub | WhatsApp Icon | Outline (\`0 0 24 24\`) | 24x24 | \`#whatsapp-btn\` | Removed from page in previous authorised task |\n`;
md += `| 40 | — | Floating Action Hub | Call / Support Icon | Outline (\`0 0 24 24\`) | 24x24 | \`#support-btn\` | Removed from page in previous authorised task |\n`;
md += `| 41 | — | Floating Action Hub | Donate Heart Icon | Outline (\`0 0 24 24\`) | 24x24 | \`#donate-btn\` | Removed from page in previous authorised task |\n`;

fs.writeFileSync('scratch/audit_table.md', md);
console.log('Markdown table generated');
