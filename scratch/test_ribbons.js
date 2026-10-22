const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function run() {
  const srv = spawn('node', ['server.js'], { cwd: path.resolve(__dirname, '..') });
  await new Promise(r => setTimeout(r, 1000));
  const chromeDataDir = path.resolve(__dirname, 'chrome-p0-ribbon');
  if (!fs.existsSync(chromeDataDir)) fs.mkdirSync(chromeDataDir, { recursive: true });
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=' + chromeDataDir,
    '--no-sandbox',
    '--disable-gpu',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 2000));

  const targetsRes = await fetch('http://127.0.0.1:9222/json');
  const targets = await targetsRes.json();
  const pageTarget = targets.find(t => t.type === 'page');
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  const send = (method, params = {}) => new Promise((resolve, reject) => {
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

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://localhost:3000/product-services.html' });
  await new Promise(r => setTimeout(r, 2500));

  const getComputed = async () => {
    const res = await send('Runtime.evaluate', {
      expression: 'Array.from(document.querySelectorAll(".ribbon-track")).map(el => ({ class: el.className, transform: getComputedStyle(el).transform, anim: getComputedStyle(el).animationName }))',
      returnByValue: true
    });
    return res.result.value;
  };

  const c0 = await getComputed();
  await new Promise(r => setTimeout(r, 1500));
  const c15 = await getComputed();

  console.log('t0:', JSON.stringify(c0, null, 2));
  console.log('t1.5s:', JSON.stringify(c15, null, 2));
  console.log('Moves?', JSON.stringify(c0) !== JSON.stringify(c15));

  ws.close();
  chrome.kill();
  srv.kill();
}
run().catch(console.error);
