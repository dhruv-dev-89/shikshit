const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

function getWs() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const tabs = JSON.parse(data);
        let tab = tabs.find(t => t.type === 'page' && t.url.includes('product-services.html')) || tabs.find(t => t.type === 'page');
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

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-inspect-align',
    '--disable-gpu',
    '--no-sandbox',
    'http://localhost:3000/product-services.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const ws = await getWs();

  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:3000/product-services.html' });
  await new Promise(r => setTimeout(r, 2000));

  await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await new Promise(r => setTimeout(r, 800));

  // Inspect alignment of all major elements
  const alignReport = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const getB = sel => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return {
          left: b.left,
          right: b.right,
          width: b.width,
          top: b.top,
          height: b.height,
          paddingLeft: window.getComputedStyle(el).paddingLeft,
          paddingRight: window.getComputedStyle(el).paddingRight,
          marginLeft: window.getComputedStyle(el).marginLeft,
          marginRight: window.getComputedStyle(el).marginRight
        };
      };

      return {
        viewportWidth: window.innerWidth,
        navbar: getB('.shikshit-navbar'),
        heroGrid: getB('.products-hero-grid'),
        heroVisual: getB('.products-hero-visual'),
        heroContent: getB('.products-hero-content'),
        ribbonsBands: getB('.products-hero-bands'),
        ribbonGrad: getB('.ribbon-gradient'),
        ribbonWhite: getB('.ribbon-white'),
        sectionIndexBar: getB('.sticky-section-index'),
        sectionIndexTrack: getB('.index-pill-track'),
        productsContainer: getB('.products-services-section .shikshit-container'),
        servicesGrid: getB('.services-editorial-grid'),
        firstCard: getB('.service-editorial-card'),
        videoCarousel: getB('.video-carousel'),
        ctaBand: getB('.products-cta-band'),
        ctaCard: getB('.products-cta-card'),
        footerContainer: getB('.footer-editorial .shikshit-container'),
        footerGrid: getB('.footer-grid')
      };
    })()`,
    returnByValue: true
  });

  const rep = alignReport.result ? alignReport.result.value : alignReport.value;
  console.log('ALIGNMENT METRICS AT 1440px:');
  console.log(JSON.stringify(rep, null, 2));

  // Full page screenshot
  const screenshot = await sendCommand(ws, 'Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 1440, height: 2600, scale: 1 }
  });
  fs.writeFileSync(path.resolve(__dirname, 'inspect_1440_full.png'), Buffer.from(screenshot.data, 'base64'));
  console.log('Saved inspect_1440_full.png');

  try { ws.close(); } catch(e) {}
  chrome.kill();
  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
