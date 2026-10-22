const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const pubDir = path.join(repoRoot, 'public_html');

const pages = [
  'index.html',
  'about-us.html',
  'contact.html',
  'product-services.html',
  'become-a-member.html',
  'donate.html',
  'ns-mas.html',
  'scholarship.html',
  'registration.html',
  'how-it-works.html',
  'privacypolicy.html',
  'termsandservice.html'
];

function extractUrlsFromHtml(html) {
  const urls = new Set();
  
  // HTML tags: href, src, poster, include-html, data-src
  const tagRe = /(?:href|src|poster|include-html|data-src)\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = tagRe.exec(html)) !== null) {
    let u = m[1].trim();
    if (shouldIgnore(u)) continue;
    urls.add(cleanUrl(u));
  }

  // Inline style url(...)
  const inlineCssRe = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
  while ((m = inlineCssRe.exec(html)) !== null) {
    let u = m[1].trim();
    if (shouldIgnore(u)) continue;
    urls.add(cleanUrl(u));
  }

  return urls;
}

function extractUrlsFromCss(css, cssDirRel = '') {
  const urls = new Set();
  const cssUrlRe = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
  let m;
  while ((m = cssUrlRe.exec(css)) !== null) {
    let u = m[1].trim();
    if (shouldIgnore(u)) continue;
    u = cleanUrl(u);
    // Resolve relative to css file location if relative
    if (!u.startsWith('/')) {
      const resolved = path.join(cssDirRel, u).replace(/\\/g, '/');
      urls.add(resolved);
    } else {
      urls.add(u.slice(1));
    }
  }
  return urls;
}

function shouldIgnore(u) {
  if (!u) return true;
  if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('//')) return true;
  if (u.startsWith('#') || u.startsWith('data:') || u.startsWith('tel:') || u.startsWith('mailto:') || u.startsWith('javascript:')) return true;
  return false;
}

function cleanUrl(u) {
  // Strip query and hash
  u = u.split('?')[0].split('#')[0];
  // Strip leading slash
  if (u.startsWith('/')) u = u.slice(1);
  return u;
}

// 1. Collect all resources across all 12 pages
const allReferenced = new Set();
const cssFiles = new Set();

for (const p of pages) {
  const fullP = path.join(pubDir, p);
  if (!fs.existsSync(fullP)) continue;
  const html = fs.readFileSync(fullP, 'utf8');
  const urls = extractUrlsFromHtml(html);
  urls.forEach(u => {
    allReferenced.add(u);
    if (u.endsWith('.css')) cssFiles.add(u);
  });
}

// 2. Also parse all CSS files
for (const cssRel of cssFiles) {
  const fullCss = path.join(pubDir, cssRel);
  if (fs.existsSync(fullCss)) {
    const cssContent = fs.readFileSync(fullCss, 'utf8');
    const cssUrls = extractUrlsFromCss(cssContent, path.dirname(cssRel));
    cssUrls.forEach(u => allReferenced.add(u));
  }
}

// Also check all CSS files in public_html/css
function scanCss(dir, base = '') {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const r = base ? base + '/' + ent.name : ent.name;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) scanCss(full, r);
    else if (ent.name.endsWith('.css')) {
      const cssContent = fs.readFileSync(full, 'utf8');
      const cssUrls = extractUrlsFromCss(cssContent, path.dirname('css/' + r));
      cssUrls.forEach(u => allReferenced.add(u));
    }
  }
}
scanCss(path.join(pubDir, 'css'));

console.log(`Total unique resource references discovered: ${allReferenced.size}`);

// Check against pre-dedupe and HEAD
// In git, pre-dedupe had public_html/* and public_html (77)/*
// Server only served public_html
const missingBefore = [];
const missingAfter = [];

for (const rel of Array.from(allReferenced).sort()) {
  // Check if exists in public_html currently (HEAD)
  const fullNow = path.join(pubDir, rel);
  const existsNow = fs.existsSync(fullNow);

  // Check if existed in public_html at pre-dedupe
  let existsBefore = false;
  try {
    execSync(`git cat-file -e "pre-dedupe:public_html/${rel}"`, { stdio: 'ignore' });
    existsBefore = true;
  } catch(e) {
    existsBefore = false;
  }

  if (!existsBefore) missingBefore.push(rel);
  if (!existsNow) missingAfter.push(rel);
}

const missingBoth = missingBefore.filter(f => missingAfter.includes(f));
const missingOnlyAfter = missingAfter.filter(f => !missingBefore.includes(f));
const missingOnlyBefore = missingBefore.filter(f => !missingAfter.includes(f));

console.log('\n--- CRAWL AUDIT REPORT ---');
console.log(`Total references: ${allReferenced.size}`);
console.log(`Missing in BOTH (Pre-existing baseline 404s): ${missingBoth.length}`);
console.log(`Missing ONLY AFTER (New 404s caused by deletion): ${missingOnlyAfter.length}`);
console.log(`Missing ONLY BEFORE (Resolved): ${missingOnlyBefore.length}`);

console.log('\nDetailed Missing in BOTH (Baseline 404s):');
missingBoth.forEach(m => console.log('  [BASELINE 404]', m));

if (missingOnlyAfter.length > 0) {
  console.log('\nNEW 404s INTRODUCED:');
  missingOnlyAfter.forEach(m => console.log('  [NEW 404]', m));
} else {
  console.log('\nNEW 404s INTRODUCED: ZERO (0)');
}

fs.writeFileSync(path.join(__dirname, 'crawl_results.json'), JSON.stringify({
  totalReferences: allReferenced.size,
  missingBoth,
  missingOnlyAfter,
  missingOnlyBefore
}, null, 2));
