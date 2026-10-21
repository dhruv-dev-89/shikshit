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

async function testMember() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-test-member',
    '--disable-gpu',
    '--no-sandbox',
    'http://localhost:3000/become-a-member.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const ws = await getWs();

  console.log('Testing Become a Member interactions...');

  // 1. Check form inputs and required fields
  const res1 = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const form = document.querySelector('#membership-form form');
      const inputs = form ? Array.from(form.querySelectorAll('input, select')).map(i => ({
        type: i.type,
        placeholder: i.placeholder,
        required: i.required
      })) : [];
      return { formFound: !!form, inputsCount: inputs.length, inputs };
    })()`,
    returnByValue: true
  });
  console.log('Form inputs:', res1.value !== undefined ? res1.value : (res1.result ? res1.result.value : res1));

  // 2. Click hero CTA button
  const res2 = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('body.page-member .hero-gradient a[href*="membership-form"]');
      const startY = window.scrollY;
      if (btn) btn.click();
      return { btnFound: !!btn, startY };
    })()`,
    returnByValue: true
  });
  console.log('Hero CTA click:', res2.value !== undefined ? res2.value : (res2.result ? res2.result.value : res2));

  // 3. Check footer content loaded
  const res3 = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const footer = document.querySelector('.footer-editorial') || document.querySelector('footer');
      const links = footer ? footer.querySelectorAll('a').length : 0;
      return { footerFound: !!footer, linksCount: links };
    })()`,
    returnByValue: true
  });
  console.log('Footer verification:', res3.value !== undefined ? res3.value : (res3.result ? res3.result.value : res3));

  ws.close();
  chrome.kill();
  process.exit(0);
}

testMember().catch(err => {
  console.error(err);
  process.exit(1);
});
