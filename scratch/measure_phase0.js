const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const pubDir = path.join(repoRoot, 'public_html');

const report = {};

// 1. base.css checks
const baseCssPath = path.join(pubDir, 'css/shikshit/base.css');
if (fs.existsSync(baseCssPath)) {
  const baseContent = fs.readFileSync(baseCssPath, 'utf8');
  const prmMatch = baseContent.match(/@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)[\s\S]*?\{([\s\S]*?)\n\}/);
  report.base_prm_block = prmMatch ? prmMatch[0].trim() : 'NONE';
  report.base_prm_transform_none = baseContent.includes('transform: none !important') || baseContent.includes('transform: none');
  report.base_prm_iteration_count = baseContent.includes('animation-iteration-count: 1') || baseContent.includes('animation-iteration-count:1');
  
  // Check .editorial-reveal gate
  const revealMatch = baseContent.match(/\.editorial-reveal\s*\{[\s\S]*?\}/);
  report.editorial_reveal_rule = revealMatch ? revealMatch[0].trim() : 'NONE';
  report.editorial_reveal_has_html_js_gate = baseContent.includes('html.js .editorial-reveal') || baseContent.includes('.js .editorial-reveal');
}

// 2. per css/shikshit/*.css
const shikshitCssDir = path.join(pubDir, 'css/shikshit');
const cssFiles = fs.readdirSync(shikshitCssDir).filter(f => f.endsWith('.css'));
report.css_stats = {};

cssFiles.forEach(file => {
  const content = fs.readFileSync(path.join(shikshitCssDir, file), 'utf8');
  
  const importantCount = (content.match(/!important/g) || []).length;
  const keyframesCount = (content.match(/@keyframes/g) || []).length;
  const infiniteCount = (content.match(/infinite/g) || []).length;
  const backdropFilterCount = (content.match(/backdrop-filter\s*:/g) || []).length;
  const blurCount = (content.match(/blur\(/g) || []).length;
  const willChangeCount = (content.match(/will-change\s*:/g) || []).length;
  const v100vwCount = (content.match(/100vw/g) || []).length;
  const v100vhCount = (content.match(/100vh/g) || []).length;

  const mqMatches = content.match(/@media[^{]+/g) || [];
  const breakpoints = Array.from(new Set(mqMatches.map(m => m.trim())));

  report.css_stats[file] = {
    importantCount,
    keyframesCount,
    infiniteCount,
    backdropFilterCount,
    blurCount,
    willChangeCount,
    v100vwCount,
    v100vhCount,
    breakpoints
  };
});

// Check spacing scale in tokens.css
const tokensContent = fs.readFileSync(path.join(shikshitCssDir, 'tokens.css'), 'utf8');
report.tokens_has_spacing_scale = tokensContent.includes('--space-') || tokensContent.includes('--spacing-');

// 3. js/shikshit/main.js & inner.js
const mainJsPath = path.join(pubDir, 'js/shikshit/main.js');
const innerJsPath = path.join(pubDir, 'js/shikshit/inner.js');

report.js_analysis = {};

if (fs.existsSync(mainJsPath)) {
  const mainContent = fs.readFileSync(mainJsPath, 'utf8');
  report.js_analysis.main_raf_throttle = mainContent.includes('requestAnimationFrame') ? 'Uses rAF in counters / drag / scroll' : 'NONE';
  report.js_analysis.main_drag_property = mainContent.includes('translate3d') ? 'Uses translate3d in transform' : (mainContent.includes('translate:') ? 'translate' : 'transform');
  report.js_analysis.main_parallax_pointerleave = mainContent.includes('pointerleave');
  report.js_analysis.main_counters_end_text = mainContent.includes('target.toLocaleString()') || mainContent.includes('target.toFixed');
}

if (fs.existsSync(innerJsPath)) {
  const innerContent = fs.readFileSync(innerJsPath, 'utf8');
  report.js_analysis.inner_scroll_spy_logic = {
    uses_last_entry_wins: innerContent.includes('forEach') && innerContent.includes('current ='),
    uses_scrollIntoView: innerContent.includes('scrollIntoView'),
    hardcoded_offset: innerContent.match(/\b\d{2,3}\b(?=\s*[\+\-])/g) || []
  };
  report.js_analysis.inner_anim_duration_change = innerContent.includes('animationDuration');
}

// 4. server.js checks
const serverJsContent = fs.readFileSync(path.join(repoRoot, 'server.js'), 'utf8');
report.server = {
  startsWith_without_sep: serverJsContent.includes('filePath.startsWith(ROOT_DIR)') && !serverJsContent.includes('ROOT_DIR + path.sep'),
  decodeURIComponent_has_try_catch: serverJsContent.includes('try') && serverJsContent.includes('decodeURIComponent'),
  range_validation: serverJsContent.includes('416') ? 'Validates 416' : 'Basic or Missing 416 validation',
  bind_address: serverJsContent.match(/\.listen\([^)]+\)/) ? serverJsContent.match(/\.listen\([^)]+\)/)[0] : 'default'
};

// 5. contact.html phone numbers & styles
const contactContent = fs.readFileSync(path.join(pubDir, 'contact.html'), 'utf8');
const contactPhones = contactContent.match(/(\+?\d[\d\s\-\(\)]{8,}\d)/g) || [];
report.contact_phones = Array.from(new Set(contactPhones.map(p => p.trim())));

// Stylesheets loaded by donate.html, become-a-member.html, product-services.html
['donate.html', 'become-a-member.html', 'product-services.html'].forEach(p => {
  const c = fs.readFileSync(path.join(pubDir, p), 'utf8');
  const links = c.match(/<link[^>]+stylesheet[^>]+>/gi) || [];
  report[p + '_stylesheets'] = links.map(l => {
    const m = l.match(/href=["']([^"']+)["']/i);
    return m ? m[1] : l;
  });
});
report.shikshit_donate_css_exists = fs.existsSync(path.join(pubDir, 'css/shikshit/donate.css'));

// Check product-services.html footer
const psContent = fs.readFileSync(path.join(pubDir, 'product-services.html'), 'utf8');
report.ps_has_footer_markup = psContent.includes('<footer') || psContent.includes('include-html="components/footer.html"') || psContent.includes('include-html="components/sikshitfooter.html"');

// Tailwind CDN
const allHtmlFiles = fs.readdirSync(pubDir).filter(f => f.endsWith('.html'));
report.tailwind_pages = [];
report.meta_desc_canonical = {};
report.images_without_dims = {};
report.scripts_without_defer = {};

allHtmlFiles.forEach(h => {
  const c = fs.readFileSync(path.join(pubDir, h), 'utf8');
  if (c.includes('cdn.tailwindcss.com') || c.includes('tailwindcss')) {
    report.tailwind_pages.push(h);
  }
  
  const metaDesc = c.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  const canonical = c.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  report.meta_desc_canonical[h] = {
    has_meta_desc: !!metaDesc,
    desc: metaDesc ? metaDesc[1] : null,
    has_canonical: !!canonical,
    canonical: canonical ? canonical[1] : null
  };

  const imgs = c.match(/<img[^>]+>/gi) || [];
  const missingDims = imgs.filter(img => !img.includes('width=') || !img.includes('height=')).length;
  report.images_without_dims[h] = { total: imgs.length, missingDims };

  const scripts = c.match(/<script[^>]+src=["'][^"']+["'][^>]*>/gi) || [];
  const noDefer = scripts.filter(s => !s.includes('defer') && !s.includes('async')).length;
  report.scripts_without_defer[h] = { total: scripts.length, noDefer };
});

// 4 largest media files in public_html
function scanFiles(d) {
  let list = [];
  for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
    const full = path.join(d, ent.name);
    if (ent.isDirectory()) list = list.concat(scanFiles(full));
    else list.push({ path: path.relative(pubDir, full).replace(/\\/g, '/'), size: fs.statSync(full).size });
  }
  return list;
}
const allPubFiles = scanFiles(pubDir);
allPubFiles.sort((a, b) => b.size - a.size);
report.top_4_largest_files = allPubFiles.slice(0, 4).map(f => ({ path: f.path, size_bytes: f.size, size_mb: (f.size / (1024*1024)).toFixed(2) + ' MB' }));

// Floating hub check
const nonFrozenHtml = [
  'index.html',
  'about-us.html',
  'contact.html',
  'product-services.html',
  'become-a-member.html',
  'donate.html',
  'cookie-policy.html',
  'disclaimer.html',
  'privacy-policy.html',
  'terms.html'
];

report.floating_hub_in_non_frozen = {};
nonFrozenHtml.forEach(h => {
  const c = fs.readFileSync(path.join(pubDir, h), 'utf8');
  const hasHub = c.includes('floating-buttons.css') || c.includes('floating-buttons.js') || c.includes('floating-button') || c.includes('whatsapp-btn');
  report.floating_hub_in_non_frozen[h] = hasHub;
});

// Quick connect in contact.html
report.contact_has_quick_connect = contactContent.includes('Quick Connect') || contactContent.includes('quick-connect');

fs.writeFileSync(path.join(__dirname, 'phase0_measurements.json'), JSON.stringify(report, null, 2));
console.log('Phase 0 measurements saved to scratch/phase0_measurements.json');
