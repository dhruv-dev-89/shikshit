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

const pages = [
  'index.html',
  'about-us.html',
  'product-services.html',
  'ns-mas.html',
  'scholarship.html',
  'become-a-member.html',
  'donate.html',
  'contact.html',
  'how-it-works.html',
  'registration.html'
];

async function checkErrors() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-check-err',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));
  const ws = await getWs();

  let errors = [];
  let failedRequests = [];

  ws.addEventListener('message', (msg) => {
    const d = JSON.parse(msg.data);
    if (d.method === 'Runtime.consoleAPICalled') {
      if (d.params.type === 'error') {
        const text = d.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
        errors.push({ type: 'CONSOLE_ERROR', text });
      }
    } else if (d.method === 'Runtime.exceptionThrown') {
      errors.push({
        type: 'EXCEPTION',
        text: d.params.exceptionDetails.text + ' ' + (d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : '')
      });
    } else if (d.method === 'Network.responseReceived') {
      if (d.params.response.status >= 400) {
        failedRequests.push({ url: d.params.response.url, status: d.params.response.status });
      }
    }
  });

  await sendCommand(ws, 'Runtime.enable');
  await sendCommand(ws, 'Network.enable');

  const report = {};

  for (const page of pages) {
    errors = [];
    failedRequests = [];

    await sendCommand(ws, 'Page.navigate', { url: `http://localhost:3000/${page}` });
    await new Promise(r => setTimeout(r, 1200));

    report[page] = {
      errors: [...errors],
      failedRequests: [...failedRequests]
    };
  }

  ws.close();
  chrome.kill();
  console.log(JSON.stringify(report, null, 2));
}

checkErrors().catch(console.error);
