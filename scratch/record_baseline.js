const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const pages = [
  '/',
  '/index',
  '/index.html',
  '/about-us',
  '/about-us.html',
  '/contact',
  '/contact.html',
  '/product-services',
  '/product-services.html',
  '/become-a-member',
  '/become-a-member.html',
  '/donate',
  '/donate.html',
  '/ns-mas',
  '/ns-mas.html',
  '/scholarship',
  '/scholarship.html',
  '/registration',
  '/registration.html',
  '/how-it-works',
  '/how-it-works.html',
  '/privacypolicy',
  '/privacypolicy.html',
  '/termsandservice',
  '/termsandservice.html'
];

async function checkUrl(urlPath) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${urlPath}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          path: urlPath,
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          size: data.length,
          body: data
        });
      });
    }).on('error', (err) => {
      resolve({
        path: urlPath,
        statusCode: 500,
        error: err.message
      });
    });
  });
}

function extractAssets(html) {
  const assets = new Set();
  const re = /(?:href|src|include-html)=["']([^"']+)["']/g;
  let match;
  while ((match = re.exec(html)) !== null) {
    let u = match[1].trim();
    if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('//') || u.startsWith('#') || u.startsWith('tel:') || u.startsWith('mailto:') || u.startsWith('javascript:')) {
      continue;
    }
    // Remove query string or hash
    u = u.split('?')[0].split('#')[0];
    if (u) {
      if (!u.startsWith('/')) u = '/' + u;
      assets.add(u);
    }
  }
  return Array.from(assets);
}

async function main() {
  // Start server
  const serverProc = spawn('node', ['server.js'], { cwd: path.resolve(__dirname, '..') });
  
  // Wait 1 second for server to start
  await new Promise(r => setTimeout(r, 1000));

  console.log('Testing primary pages...');
  const pageResults = [];
  const allDiscoveredAssets = new Set();

  for (const p of pages) {
    const res = await checkUrl(p);
    pageResults.push({ path: res.path, statusCode: res.statusCode });
    console.log(`  ${p.padEnd(25)} -> HTTP ${res.statusCode}`);
    if (res.body && res.statusCode === 200) {
      const assets = extractAssets(res.body);
      assets.forEach(a => allDiscoveredAssets.add(a));
    }
  }

  console.log(`\nTesting ${allDiscoveredAssets.size} discovered static assets (images, css, js, etc.)...`);
  const assetResults = [];
  const notFoundAssets = [];

  for (const a of allDiscoveredAssets) {
    const res = await checkUrl(a);
    assetResults.push({ path: res.path, statusCode: res.statusCode });
    if (res.statusCode === 404) {
      notFoundAssets.push(a);
      console.log(`  404 Asset: ${a}`);
    }
  }

  const output = {
    timestamp: new Date().toISOString(),
    primaryPages: pageResults,
    page404Count: pageResults.filter(p => p.statusCode === 404).length,
    page404List: pageResults.filter(p => p.statusCode === 404).map(p => p.path),
    assetTotalCount: allDiscoveredAssets.size,
    asset404Count: notFoundAssets.length,
    asset404List: notFoundAssets
  };

  fs.writeFileSync(path.join(__dirname, 'baseline_404.json'), JSON.stringify(output, null, 2));
  console.log('\nBaseline recorded to scratch/baseline_404.json:');
  console.log(`Primary pages 404 count: ${output.page404Count}`);
  console.log(`Discovered assets 404 count: ${output.asset404Count}`);
  if (output.asset404List.length > 0) {
    console.log('Asset 404s:', output.asset404List);
  }

  serverProc.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
