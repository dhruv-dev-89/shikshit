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

async function testScrollSpy() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-test-spy',
    '--disable-gpu',
    '--no-sandbox',
    'http://localhost:3000/product-services.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const ws = await getWs();

  await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  const getActiveState = async () => {
    const res = await sendCommand(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const activePill = document.querySelector('.index-pill.active');
        const glider = document.querySelector('.index-pill-glider');
        const csG = glider ? window.getComputedStyle(glider) : null;
        return {
          scrollY: window.scrollY,
          activeText: activePill ? activePill.textContent.trim() : null,
          activeHref: activePill ? activePill.getAttribute('href') : null,
          activeAriaCurrent: activePill ? activePill.getAttribute('aria-current') : null,
          gliderOpacity: csG ? csG.opacity : null,
          gliderWidth: csG ? csG.width : null,
          gliderTransform: csG ? csG.transform : null,
          gliderBackground: csG ? csG.background : null
        };
      })()`,
      returnByValue: true
    });
    return res.result.value;
  };

  console.log('Initial (scrollY = 0):', await getActiveState());

  // Scroll to each target section
  const sections = [
    '#scholarship-program',
    '#awareness-programs',
    '#olympiads',
    '#financial-aid',
    '#technical-training',
    '#video-ads',
    '#diploma-courses'
  ];

  for (const s of sections) {
    await sendCommand(ws, 'Runtime.evaluate', {
      expression: `document.querySelector('${s}').scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await new Promise(r => setTimeout(r, 500));
    console.log(`Scrolled to ${s}:`, await getActiveState());
  }

  ws.close();
  chrome.kill();
  process.exit(0);
}

testScrollSpy().catch(err => {
  console.error(err);
  process.exit(1);
});
