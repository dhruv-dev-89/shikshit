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
  console.log(`Setting viewport: ${width}x${height}, scale ${scale} for ${filename}...`);
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
  console.log(`Saved screenshot: ${outPath} (${buffer.length} bytes)`);
}

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-cap',
    '--disable-gpu',
    '--no-sandbox',
    'http://localhost:3000/product-services.html'
  ]);

  console.log('Spawned Chrome, waiting for CDP...');
  await new Promise(r => setTimeout(r, 2500));

  const { ws } = await getWs();
  console.log('Connected to WebSocket!');

  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:3000/product-services.html' });
  await new Promise(r => setTimeout(r, 2000));

  // 1. 1920px (100% zoom)
  await capture(ws, 1920, 1080, 1, 'before_1920.png');

  // 2. 2560px (100% zoom)
  await capture(ws, 2560, 1440, 1, 'before_2560.png');

  // 3. 3840px (100% zoom)
  await capture(ws, 3840, 2160, 1, 'before_3840.png');

  // 4. 50% zoom: In CSS/browser zoom 50%, an effective 1920px screen has a CSS viewport of 3840px, or scale 0.5
  // Alternatively, viewport 1920 with device scale / page zoom 0.5:
  // Using Emulation.setPageScaleFactor or 3840px css viewport at 1920 device
  await sendCommand(ws, 'Emulation.setPageScaleFactor', { pageScaleFactor: 0.5 }).catch(() => {});
  await capture(ws, 1920, 1080, 0.5, 'before_zoom50.png');

  console.log('Done capturing BEFORE screenshots.');
  try { ws.close(); } catch(e) {}
  chrome.kill();
  process.exit(0);
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
