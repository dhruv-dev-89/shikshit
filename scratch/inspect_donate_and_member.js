const fs = require('fs');

['public_html/donate.html', 'public_html/become-a-member.html'].forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  console.log('=== ' + f + ' ===');
  const links = content.match(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi) || [];
  links.forEach(l => console.log('  ' + l));
  const scripts = content.match(/<script[^>]*src=["'][^"']+["'][^>]*><\/script>/gi) || [];
  scripts.forEach(s => console.log('  ' + s));
  const inlineScripts = content.match(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi) || [];
  console.log('  Inline script count:', inlineScripts.length);
  const bodyTag = content.match(/<body[^>]*>/i);
  console.log('  Body tag:', bodyTag ? bodyTag[0] : '(none)');
});
