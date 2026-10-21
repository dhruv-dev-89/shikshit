const fs = require('fs');

const files = ['index.html', 'product-services.html'];

files.forEach(f => {
  const content = fs.readFileSync('public_html/' + f, 'utf8');
  const footerMatch = content.match(/<footer[\s\S]*?<\/footer>/);
  if (!footerMatch) return;
  const footerHtml = footerMatch[0];
  const linkRegex = /<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi;
  let m;
  console.log('=== FOOTER LINKS IN ' + f + ' ===');
  while ((m = linkRegex.exec(footerHtml)) !== null) {
    const href = m[1];
    const text = m[2].replace(/<[^>]*>/g, '').trim();
    let exists = false;
    let note = '';
    if (href.startsWith('http://') || href.startsWith('https://')) {
      exists = true;
      note = 'external';
    } else if (href.startsWith('mailto:') || href.startsWith('tel:')) {
      exists = true;
      note = 'protocol';
    } else if (href.startsWith('#')) {
      exists = true;
      note = 'anchor';
    } else {
      const cleanPath = href.split('?')[0].split('#')[0];
      exists = fs.existsSync('public_html/' + cleanPath);
      note = exists ? 'file exists' : 'FILE NOT FOUND!';
    }
    console.log(`[${exists ? 'OK' : 'BROKEN'}] ${text} -> ${href} (${note})`);
  }
});
