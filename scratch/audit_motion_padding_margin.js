const { spawn } = require('child_process');
const http = require('http');

function getWs() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const tabs = JSON.parse(data);
        let tab = tabs.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension')) || tabs[0];
        if (!tab) return reject(new Error('No page tab found'));
        const ws = new WebSocket(tab.webSocketDebuggerUrl);
        ws.onopen = () => resolve(ws);
        ws.onerror = reject;
      });
    }).on('error', reject);
  });
}

let msgId = 1;
function sendCommand(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = msgId++;
    const handler = (msg) => {
      const d = JSON.parse(msg.data);
      if (d.id === id) {
        ws.removeEventListener('message', handler);
        if (d.error) reject(d.error);
        else resolve(d.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function inspectPage(ws, url, viewports) {
  console.log(`\n======================================================`);
  console.log(`INSPECTING PAGE: ${url}`);
  console.log(`======================================================`);

  await sendCommand(ws, 'Page.navigate', { url });
  await new Promise(r => setTimeout(r, 2000));

  for (const vp of viewports) {
    console.log(`\n>>> VIEWPORT: ${vp.width}x${vp.height} (${vp.name})`);
    await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.mobile || false
    });
    await new Promise(r => setTimeout(r, 600));

    const metrics = await sendCommand(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const getMetrics = sel => {
          const el = document.querySelector(sel);
          if (!el) return null;
          const cs = window.getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return {
            sel,
            width: Math.round(r.width * 100) / 100,
            height: Math.round(r.height * 100) / 100,
            left: Math.round(r.left * 100) / 100,
            right: Math.round(r.right * 100) / 100,
            padding: cs.paddingTop + ' ' + cs.paddingRight + ' ' + cs.paddingBottom + ' ' + cs.paddingLeft,
            margin: cs.marginTop + ' ' + cs.marginRight + ' ' + cs.marginBottom + ' ' + cs.marginLeft,
            animationName: cs.animationName,
            animationDuration: cs.animationDuration,
            animationPlayState: cs.animationPlayState,
            transform: cs.transform !== 'none' ? cs.transform : 'none'
          };
        };

        const elements = [
          'header',
          '.shikshit-navbar',
          '.products-hero',
          '.products-hero-grid',
          '.products-hero-content',
          '.products-hero-visual',
          '.products-arch-frame',
          '.products-blob-frame',
          '.products-stat-badge',
          '.products-blob-1',
          '.products-blob-2',
          '.products-hero-bands',
          '.track-left',
          '.track-right',
          '.sticky-section-index',
          '.index-pill-track',
          '.products-services-section',
          '.services-editorial-grid',
          '.service-editorial-card:nth-child(1)',
          '.service-editorial-card:nth-child(2)',
          '.service-editorial-card:nth-child(6)',
          '.video-carousel',
          '.products-cta-band',
          'footer',
          '.footer-editorial'
        ];

        const results = {};
        for (const sel of elements) {
          const m = getMetrics(sel);
          if (m) results[sel] = m;
        }

        // Horizontal overflow check
        const scrollWidth = document.documentElement.scrollWidth;
        const clientWidth = document.documentElement.clientWidth;
        const hasOverflow = scrollWidth > clientWidth;

        return {
          viewportWidth: window.innerWidth,
          scrollWidth,
          clientWidth,
          hasOverflow,
          elements: results
        };
      })()`,
      returnByValue: true
    });

    const data = metrics.result.value;
    console.log(`ScrollWidth: ${data.scrollWidth}px, ClientWidth: ${data.clientWidth}px, HasOverflow: ${data.hasOverflow}`);
    console.log('\nKey Elements Metrics (Box Model & Motion):');
    for (const [sel, info] of Object.entries(data.elements)) {
      console.log(`\n[${sel}]`);
      console.log(`  Geometry: width=${info.width}px, height=${info.height}px, left=${info.left}px, right=${info.right}px`);
      console.log(`  Spacing:  padding=[${info.padding}], margin=[${info.margin}]`);
      console.log(`  Motion:   anim=${info.animationName}, dur=${info.animationDuration}, state=${info.animationPlayState}`);
    }
  }
}

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-audit-motion',
    '--disable-gpu',
    '--no-sandbox',
    'http://localhost:3000/product-services.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const ws = await getWs();

  const viewports = [
    { name: 'Desktop Standard', width: 1440, height: 900 },
    { name: 'Full HD Wide', width: 1920, height: 1080 },
    { name: 'Mobile', width: 390, height: 844, mobile: true }
  ];

  await inspectPage(ws, 'http://localhost:3000/product-services.html', viewports);
  await inspectPage(ws, 'http://localhost:3000/index.html', [
    { name: 'Desktop Standard', width: 1440, height: 900 }
  ]);

  ws.close();
  chrome.kill();
  process.exit(0);
}

run().catch(err => {
  console.error('Audit error:', err);
  process.exit(1);
});
