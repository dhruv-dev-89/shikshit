const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const pubDir = path.join(repoRoot, 'public_html');

const frozenFiles = new Set([
  'ns-mas.html',
  'scholarship.html',
  'registration.html',
  'how-it-works.html',
  'privacypolicy.html',
  'termsandservice.html',
  'components/nsmas_navbar.html',
  'components/nsmas-floating-button.html',
  'components/footer.html',
  'css/sikshitnavbar.css',
  'css/floating-buttons.css',
  'css/mobile-menu-fix.css',
  'js/floating-buttons.js',
  'js/script.js',
  'js/hamburger-menu-fix.js'
]);

function getHtmlFiles(dir, base = '') {
  let res = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const r = base ? base + '/' + ent.name : ent.name;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) res = res.concat(getHtmlFiles(full, r));
    else if (ent.name.endsWith('.html')) res.push(r);
  }
  return res;
}

const htmlFiles = getHtmlFiles(pubDir);

function shouldIgnore(u) {
  if (!u) return true;
  const s = u.trim().toLowerCase();
  if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('//')) return true;
  if (s.startsWith('#') || s.startsWith('data:') || s.startsWith('tel:') || s.startsWith('mailto:') || s.startsWith('javascript:')) return true;
  return false;
}

function cleanUrl(u) {
  return u.trim().split('?')[0].split('#')[0];
}

function resolveTarget(sourceFileRel, rawUrl) {
  const c = cleanUrl(rawUrl);
  if (!c) return null;
  if (c.startsWith('/')) {
    return c.slice(1);
  }
  const sourceDir = path.dirname(sourceFileRel);
  const resolved = path.join(sourceDir, c).replace(/\\/g, '/');
  return resolved;
}

// Map: targetPath -> Set of referencing pages
const missingMap = new Map();
const foundMap = new Map();

function recordRef(sourceFileRel, rawUrl, type) {
  if (shouldIgnore(rawUrl)) return;
  const target = resolveTarget(sourceFileRel, rawUrl);
  if (!target) return;

  const targetFull = path.join(pubDir, target);
  let exists = fs.existsSync(targetFull);

  // If a link doesn't have .html, test target + .html
  if (!exists && !path.extname(target) && fs.existsSync(targetFull + '.html')) {
    exists = true;
  }

  if (exists) {
    if (!foundMap.has(target)) foundMap.set(target, new Set());
    foundMap.get(target).add(sourceFileRel);
  } else {
    if (!missingMap.has(target)) missingMap.set(target, new Set());
    missingMap.get(target).add(sourceFileRel);
  }
}

// Parse HTML files
for (const h of htmlFiles) {
  const content = fs.readFileSync(path.join(pubDir, h), 'utf8');

  // 1. Tag attributes: href, src, poster, include-html, data-src
  const attrRe = /(?:href|src|poster|include-html|data-src)\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = attrRe.exec(content)) !== null) {
    recordRef(h, m[1], 'tag');
  }

  // 2. Inline style url(...)
  const cssUrlRe = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
  while ((m = cssUrlRe.exec(content)) !== null) {
    recordRef(h, m[1], 'inline-css');
  }
}

// Parse all referenced CSS files for url(...)
const cssFilesScanned = new Set();
function scanCssFile(cssRel, referencedByPage) {
  if (cssFilesScanned.has(cssRel)) return;
  cssFilesScanned.add(cssRel);

  const full = path.join(pubDir, cssRel);
  if (!fs.existsSync(full)) return;

  const content = fs.readFileSync(full, 'utf8');
  const cssUrlRe = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
  let m;
  while ((m = cssUrlRe.exec(content)) !== null) {
    if (shouldIgnore(m[1])) continue;
    const raw = m[1].trim();
    const resolved = resolveTarget(cssRel, raw);
    if (!resolved) continue;

    const targetFull = path.join(pubDir, resolved);
    const exists = fs.existsSync(targetFull);
    if (!exists) {
      if (!missingMap.has(resolved)) missingMap.set(resolved, new Set());
      missingMap.get(resolved).add(`${referencedByPage} (via ${cssRel})`);
    }
  }
}

// Find all CSS referenced by HTML
for (const [target, pages] of foundMap.entries()) {
  if (target.endsWith('.css')) {
    for (const p of pages) {
      scanCssFile(target, p);
    }
  }
}

// Output detailed audit
const missingList = [];
for (const [file, pages] of missingMap.entries()) {
  const pageArr = Array.from(pages);
  const onlyFrozen = pageArr.every(p => {
    const baseP = p.split(' ')[0];
    return frozenFiles.has(baseP);
  });
  const anyFrozen = pageArr.some(p => {
    const baseP = p.split(' ')[0];
    return frozenFiles.has(baseP);
  });
  missingList.push({
    file,
    pages: pageArr,
    onlyFrozen,
    anyFrozen
  });
}

// Sort alphabetically by file
missingList.sort((a, b) => a.file.localeCompare(b.file));

fs.writeFileSync(path.join(__dirname, 'all_html_crawl.json'), JSON.stringify(missingList, null, 2));

console.log(`Total missing targets found: ${missingList.length}`);
console.log(`Missing ONLY in frozen pages: ${missingList.filter(m => m.onlyFrozen).length}`);
console.log(`Missing in non-frozen pages: ${missingList.filter(m => !m.onlyFrozen).length}`);

// Check specific files requested by user
const specificChecks = [
  'css/style.css',
  'css/styles.css',
  'js/responsive-handler.js',
  'direct-fix.js',
  'js/direct-fix.js',
  'direct-mobile-menu-fix.js',
  'js/direct-mobile-menu-fix.js',
  'fix-hamburger-menu.js',
  'js/fix-hamburger-menu.js',
  'mobile-menu-button-fix.js',
  'js/mobile-menu-button-fix.js',
  'mobile-menu-fix-new.js',
  'js/mobile-menu-fix-new.js',
  'mobile-menu-fix.js',
  'js/mobile-menu-fix.js',
  'mobile-menu-position-fix.js',
  'js/mobile-menu-position-fix.js',
  'mobile-search-fix.js',
  'js/mobile-search-fix.js',
  'search-toggle-fix.js',
  'js/search-toggle-fix.js',
  'video1.mp4',
  'video2.mp4',
  'video3.mp4',
  'video4.mp4',
  'video5.mp4',
  'video6.mp4',
  'images/video1.mp4',
  'scholarships.html'
];

console.log('\n--- SPECIFIC REQUESTED CHECKS ---');
for (const s of specificChecks) {
  const m = missingList.find(x => x.file === s || x.file.endsWith('/' + s) || s.endsWith(x.file));
  if (m) {
    console.log(`[MISSING] ${s} -> referenced by: ${m.pages.join(', ')} (Only frozen: ${m.onlyFrozen})`);
  } else {
    // Check if it exists on disk
    const onDisk = fs.existsSync(path.join(pubDir, s));
    console.log(`[STATUS]  ${s} -> Exists on disk? ${onDisk}`);
  }
}
