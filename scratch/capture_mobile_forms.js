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
    '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-cap-mob-form',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const ws = await getWs();

  await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  // Donate Form on mobile
  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:3000/donate.html' });
  await new Promise(r => setTimeout(r, 1500));
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `document.getElementById('donationForm').scrollIntoView({ block: 'start' });`
  });
  await new Promise(r => setTimeout(r, 800));
  let shot = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/mobile_donate_form.png', Buffer.from(shot.data, 'base64'));

  // Member Form on mobile
  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:3000/become-a-member.html' });
  await new Promise(r => setTimeout(r, 1500));
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `document.getElementById('membership-form').scrollIntoView({ block: 'start' });`
  });
  await new Promise(r => setTimeout(r, 800));
  shot = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/mobile_member_form.png', Buffer.from(shot.data, 'base64'));

  ws.close();
  chrome.kill();
  process.exit(0);
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
