const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const prefix = process.argv[2] || 'before'; // 'before' or 'after'

const pages = [
  { name: 'index', path: '/index.html' },
  { name: 'product-services', path: '/product-services.html' },
  { name: 'become-a-member', path: '/become-a-member.html' },
  { name: 'donate', path: '/donate.html' },
  { name: 'contact', path: '/contact.html' },
  { name: 'ns-mas', path: '/ns-mas.html' }
];

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function sendCommand(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === id) {
        ws.removeEventListener('message', handler);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function main() {
  // 1. Start server
  const serverProc = spawn('node', ['server.js'], { cwd: path.resolve(__dirname, '..') });
  await sleep(1000);

  // 2. Start headless Chrome
  const chromeDataDir = path.resolve(__dirname, 'chrome-snap-' + prefix);
  if (!fs.existsSync(chromeDataDir)) fs.mkdirSync(chromeDataDir, { recursive: true });

  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=' + chromeDataDir,
    '--no-sandbox',
    '--disable-gpu',
    'about:blank'
  ]);

  await sleep(2000);

  const targetsRes = await fetch('http://127.0.0.1:9222/json');
  const targets = await targetsRes.json();
  const pageTarget = targets.find(t => t.type === 'page');
  if (!pageTarget) {
    throw new Error('No page target found');
  }

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  await sendCommand(ws, 'Page.enable');
  await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  for (const page of pages) {
    const url = 'http://localhost:3000' + page.path;
    console.log(`Navigating to ${url}...`);
    await sendCommand(ws, 'Page.navigate', { url });
    await sleep(2500);

    const shot = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png', fromSurface: true });
    const outName = `${prefix}_${page.name}.png`;
    const outPath = path.resolve(__dirname, outName);
    fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
    console.log(`Captured ${outName} (${(shot.data.length * 0.75 / 1024).toFixed(1)} KB)`);
  }

  ws.close();
  chromeProc.kill();
  serverProc.kill();
  console.log(`\nAll ${prefix} screenshots captured successfully.`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
