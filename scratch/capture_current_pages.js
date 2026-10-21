const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

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

async function capture() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-cap-pages',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const ws = await getWs();

  const pages = [
    { name: 'donate', url: 'http://localhost:3000/donate.html' },
    { name: 'member', url: 'http://localhost:3000/become-a-member.html' }
  ];

  const viewports = [
    { name: 'desktop_1440', w: 1440, h: 900 },
    { name: 'tablet_768', w: 768, h: 1024 },
    { name: 'mobile_390', w: 390, h: 844 }
  ];

  for (const p of pages) {
    await sendCommand(ws, 'Page.navigate', { url: p.url });
    await new Promise(r => setTimeout(r, 1500));

    for (const vp of viewports) {
      await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: vp.w < 768
      });
      await sendCommand(ws, 'Emulation.setVisibleSize', { width: vp.w, height: vp.h });
      await new Promise(r => setTimeout(r, 800));

      const shot = await sendCommand(ws, 'Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: false
      });
      fs.writeFileSync(`scratch/current_${p.name}_${vp.name}.png`, Buffer.from(shot.data, 'base64'));
      console.log(`Captured scratch/current_${p.name}_${vp.name}.png`);
    }
  }

  ws.close();
  chrome.kill();
  process.exit(0);
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
