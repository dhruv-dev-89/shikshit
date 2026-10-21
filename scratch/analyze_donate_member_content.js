const fs = require('fs');

function inspectPage(file) {
  const html = fs.readFileSync(file, 'utf8');
  console.log(`\n======================================================`);
  console.log(`PAGE: ${file} (Length: ${html.length})`);
  console.log(`======================================================`);

  // Section tags or main containers
  const sections = [];
  const sectionRegex = /<section[^>]*id=["']([^"']*)["'][^>]*>|<section[^>]*class=["']([^"']*)["'][^>]*>/gi;
  let m;
  while ((m = sectionRegex.exec(html)) !== null) {
    sections.push(m[1] ? `#${m[1]}` : `.${m[2].trim().replace(/\s+/g, '.')}`);
  }
  console.log('Sections found:', sections.slice(0, 10));

  // Forms
  const forms = html.match(/<form[^>]*>[\s\S]*?<\/form>/gi) || [];
  console.log('Forms count:', forms.length);
  forms.forEach((f, idx) => {
    const id = f.match(/id=["']([^"']*)["']/i);
    const action = f.match(/action=["']([^"']*)["']/i);
    const inputs = f.match(/<input[^>]*>/gi) || [];
    const selects = f.match(/<select[^>]*>/gi) || [];
    const buttons = f.match(/<button[^>]*>[\s\S]*?<\/button>/gi) || [];
    console.log(`  Form ${idx+1}: id="${id ? id[1] : ''}" action="${action ? action[1] : ''}"`);
    console.log(`    Inputs: ${inputs.length}, Selects: ${selects.length}, Buttons: ${buttons.length}`);
    inputs.forEach(inp => console.log('      input:', inp.slice(0, 100)));
    selects.forEach(sel => console.log('      select:', sel.slice(0, 100)));
    buttons.forEach(btn => console.log('      button:', btn.slice(0, 100).replace(/\n/g, ' ')));
  });

  // Buttons outside forms
  const allButtons = html.match(/<button[^>]*>[\s\S]*?<\/button>/gi) || [];
  console.log('Total buttons on page:', allButtons.length);
  
  // Headings
  const headings = html.match(/<h[1-3][^>]*>[\s\S]*?<\/h[1-3]>/gi) || [];
  console.log('Headings sample:');
  headings.slice(0, 8).forEach(h => console.log('   ' + h.replace(/<[^>]+>/g, '').trim().slice(0, 70)));
}

inspectPage('public_html/donate.html');
inspectPage('public_html/become-a-member.html');
