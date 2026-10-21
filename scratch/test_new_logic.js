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

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-test-new-logic',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const ws = await getWs();

  const logs = [];
  ws.addEventListener('message', (msg) => {
    const d = JSON.parse(msg.data);
    if (d.method === 'Runtime.consoleAPICalled') {
      logs.push(d.params.args.map(a => a.value));
    } else if (d.method === 'Runtime.exceptionThrown') {
      logs.push(['EXCEPTION', d.params.exceptionDetails]);
    }
  });
  await sendCommand(ws, 'Runtime.enable');

  // Test at 1440px
  await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:3000/product-services.html' });
  await new Promise(r => setTimeout(r, 2000));

  const debugInfo = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const active = document.querySelector('.index-pill.active');
      const glider = document.querySelector('.index-pill-glider');
      const gStyle = glider ? window.getComputedStyle(glider) : null;
      return {
        activeExists: !!active,
        activeOffsetWidth: active ? active.offsetWidth : null,
        activeOffsetLeft: active ? active.offsetLeft : null,
        gliderInlineWidth: glider ? glider.style.width : null,
        gliderInlineTransform: glider ? glider.style.transform : null,
        gliderInlineOpacity: glider ? glider.style.opacity : null,
        gliderComputedWidth: gStyle ? gStyle.width : null,
        gliderComputedOpacity: gStyle ? gStyle.opacity : null,
        gliderComputedDisplay: gStyle ? gStyle.display : null,
        gliderComputedVisibility: gStyle ? gStyle.visibility : null
      };
    })()`,
    returnByValue: true
  });

  console.log('--- Debug info ---', debugInfo.result.value);
  console.log('--- Console logs ---', logs);

  ws.close();
  chrome.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
