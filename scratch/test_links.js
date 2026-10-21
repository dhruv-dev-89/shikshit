const { spawn } = require('child_process');
const http = require('http');

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
    '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-test-links',
    '--disable-gpu',
    '--no-sandbox',
    'http://localhost:3000/product-services.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const ws = await getWs();

  const evalRes = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const links = Array.from(document.querySelectorAll('a')).map(a => ({
        text: a.innerText.trim() || a.getAttribute('aria-label') || 'img/icon',
        href: a.getAttribute('href')
      }));
      const buttons = Array.from(document.querySelectorAll('button')).map(b => ({
        text: b.innerText.trim() || b.getAttribute('aria-label') || 'btn',
        onclick: b.getAttribute('onclick')
      }));
      return { totalLinks: links.length, links: links.slice(0, 15), totalButtons: buttons.length, buttons };
    })()`,
    returnByValue: true
  });

  const res = evalRes.result ? evalRes.result.value : evalRes.value;
  console.log('Total links on page:', res.totalLinks);
  console.log('Sample links:', res.links);
  console.log('Buttons:', res.buttons);

  try { ws.close(); } catch(e) {}
  chrome.kill();
  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
