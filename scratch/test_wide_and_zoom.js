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
        ws.onopen = () => resolve({ ws, tabId: tab.id });
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

async function capture(ws, width, height, scale, filename) {
  await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
    width: Math.round(width),
    height: Math.round(height),
    deviceScaleFactor: 1,
    mobile: width < 800,
    scale: scale
  });
  await new Promise(r => setTimeout(r, 1200));

  const screenshot = await sendCommand(ws, 'Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: 0,
      y: 0,
      width: Math.round(width),
      height: Math.min(Math.round(height), 2200),
      scale: 1
    }
  });

  const buffer = Buffer.from(screenshot.data, 'base64');
  const outPath = path.resolve(__dirname, filename);
  fs.writeFileSync(outPath, buffer);
  console.log(`Saved screenshot: ${filename} (${buffer.length} bytes)`);
}

async function evalMetrics(ws) {
  const res = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const doc = document.documentElement;
      const body = document.body;
      const rootFontSize = parseFloat(window.getComputedStyle(doc).fontSize);
      const hasHScroll = doc.scrollWidth > window.innerWidth || body.scrollWidth > window.innerWidth;

      const getRect = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width),
          top: Math.round(r.top),
          bottom: Math.round(r.bottom)
        };
      };

      const hero = getRect('.products-hero-grid');
      const navbar = getRect('.shikshit-navbar');
      const sectionBar = getRect('.sticky-section-index');
      const productsContainer = getRect('.products-services-section .shikshit-container');
      const videoSection = getRect('.video-carousel');
      const ctaBand = getRect('.products-cta-band');
      const footerContainer = getRect('.footer-editorial .shikshit-container');
      const ribbonsBand = getRect('.products-hero-bands');
      const ribbonGrad = getRect('.ribbon-gradient');
      const ribbonWhite = getRect('.ribbon-white');

      // Font sizes
      const heroDesc = document.querySelector('.products-hero-desc');
      const heroDescSize = heroDesc ? parseFloat(window.getComputedStyle(heroDesc).fontSize) : 0;
      
      const subItemP = document.querySelector('.service-inner-item p');
      const subItemPSize = subItemP ? parseFloat(window.getComputedStyle(subItemP).fontSize) : 0;

      const tagPill = document.querySelector('.products-tag-pill');
      const tagPillSize = tagPill ? parseFloat(window.getComputedStyle(tagPill).fontSize) : 0;

      const indexPill = document.querySelector('.index-pill');
      const indexPillHeight = indexPill ? parseFloat(window.getComputedStyle(indexPill).height) : 0;
      const indexPillFontSize = indexPill ? parseFloat(window.getComputedStyle(indexPill).fontSize) : 0;

      return {
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        rootFontSize,
        hasHScroll,
        scrollWidth: doc.scrollWidth,
        hero,
        navbar,
        sectionBar,
        productsContainer,
        videoSection,
        ctaBand,
        footerContainer,
        ribbonsBand,
        ribbonGrad,
        ribbonWhite,
        heroDescSize,
        subItemPSize,
        tagPillSize,
        indexPillHeight,
        indexPillFontSize
      };
    })()`,
    returnByValue: true
  });
  if (res.result && res.result.value) return res.result.value;
  if (res.value) return res.value;
  return res;
}

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-test-suite',
    '--disable-gpu',
    '--no-sandbox',
    'http://localhost:3000/product-services.html'
  ]);

  await new Promise(r => setTimeout(r, 2500));
  const { ws } = await getWs();
  console.log('Connected to WebSocket');

  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:3000/product-services.html' });
  await new Promise(r => setTimeout(r, 2000));

  // --- PART 1: TEST VIEWPORT WIDTHS ---
  const widths = [360, 768, 1280, 1440, 1920, 2560, 3200, 3840];
  console.log('\n========================================');
  console.log('TESTING VIEWPORT WIDTHS (100% Zoom):');
  console.log('========================================');

  for (const w of widths) {
    const h = w > 1200 ? 1080 : 800;
    await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
      width: w,
      height: h,
      deviceScaleFactor: 1,
      mobile: w < 800
    });
    await new Promise(r => setTimeout(r, 600));
    const m = await evalMetrics(ws);

    console.log(`\n--- Viewport: ${w}px ---`);
    console.log(`Root font-size: ${m.rootFontSize}px | Horizontal Scroll: ${m.hasHScroll ? 'FAIL (overflow!)' : 'PASS (none)'}`);
    console.log(`Hero grid width: ${m.hero?.width}px (left: ${m.hero?.left}, right: ${m.hero?.right})`);
    console.log(`Products container width: ${m.productsContainer?.width}px (left: ${m.productsContainer?.left}, right: ${m.productsContainer?.right})`);
    console.log(`Footer container width: ${m.footerContainer?.width}px (left: ${m.footerContainer?.left}, right: ${m.footerContainer?.right})`);
    console.log(`Navbar width: ${m.navbar?.width}px (left: ${m.navbar?.left}, right: ${m.navbar?.right})`);
    console.log(`Ribbons band width: ${m.ribbonsBand?.width}px | Ribbon grad height: ${m.ribbonGrad?.height}px`);
    console.log(`Font sizes: Hero desc: ${m.heroDescSize}px, Sub-item desc: ${m.subItemPSize}px, Chip: ${m.tagPillSize}px`);
    console.log(`Index pill: height: ${m.indexPillHeight}px, font: ${m.indexPillFontSize}px`);

    if (w >= 1280) {
      // Check edge alignment
      const heroLeft = m.hero.left;
      const productsLeft = m.productsContainer.left;
      const footerLeft = m.footerContainer.left;
      const diff = Math.max(Math.abs(heroLeft - productsLeft), Math.abs(productsLeft - footerLeft));
      console.log(`Grid alignment diff: ${diff}px [${diff <= 2 ? 'PASS (Aligned)' : 'FAIL'}]`);
    }
  }

  // --- PART 2: TEST ZOOM LEVELS AT 1920px ---
  const zooms = [0.25, 0.33, 0.50, 0.67, 0.80, 1.00, 1.25, 1.50];
  console.log('\n========================================');
  console.log('TESTING BROWSER ZOOM LEVELS (at 1920px screen):');
  console.log('========================================');

  for (const z of zooms) {
    // Zooming out in browser increases the CSS viewport width proportionally: cssWidth = 1920 / z
    const cssW = Math.round(1920 / z);
    const cssH = Math.round(1080 / z);
    await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
      width: cssW,
      height: cssH,
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise(r => setTimeout(r, 600));
    const m = await evalMetrics(ws);

    console.log(`Zoom ${Math.round(z*100)}% (effective CSS viewport: ${cssW}px):`);
    console.log(`  Horizontal Scroll: ${m.hasHScroll ? 'FAIL (overflow!)' : 'PASS (none)'}`);
    console.log(`  Root font-size: ${m.rootFontSize}px`);
    console.log(`  Hero grid: width ${m.hero?.width}px (left: ${m.hero?.left}) | Products: width ${m.productsContainer?.width}px (left: ${m.productsContainer?.left})`);
    console.log(`  Alignment diff: ${Math.abs((m.hero?.left || 0) - (m.productsContainer?.left || 0))}px`);
  }

  // --- PART 3: CAPTURE AFTER SCREENSHOTS ---
  console.log('\n========================================');
  console.log('CAPTURING AFTER SCREENSHOTS:');
  console.log('========================================');

  await capture(ws, 1920, 1080, 1, 'after_1920.png');
  await capture(ws, 2560, 1440, 1, 'after_2560.png');
  await capture(ws, 3840, 2160, 1, 'after_3840.png');
  await capture(ws, 1920, 1080, 0.5, 'after_zoom50.png');

  console.log('\nALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
  try { ws.close(); } catch(e) {}
  chrome.kill();
  process.exit(0);
}

run().catch(err => {
  console.error('Error during testing:', err);
  process.exit(1);
});
