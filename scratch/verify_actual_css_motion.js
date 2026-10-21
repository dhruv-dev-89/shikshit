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
    '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-test-live-ribbons',
    '--disable-gpu',
    '--no-sandbox',
    'http://localhost:3000/product-services.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const ws = await getWs();

  // Test under BOTH prefers-reduced-motion: reduce AND no-preference
  for (const mode of ['reduce', 'no-preference']) {
    console.log(`\n========================================`);
    console.log(`TESTING LIVE CSS UNDER prefers-reduced-motion: ${mode}`);
    console.log(`========================================`);

    await sendCommand(ws, 'Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: mode }]
    });

    // Reload page to ensure clean stylesheet application under this media setting
    await sendCommand(ws, 'Page.reload', { ignoreCache: true });
    await new Promise(r => setTimeout(r, 1500));

    const getMetrics = async () => {
      const res = await sendCommand(ws, 'Runtime.evaluate', {
        expression: `(() => {
          const l = document.querySelector('.track-left');
          const r = document.querySelector('.track-right');
          const rl = l.getBoundingClientRect();
          const rr = r.getBoundingClientRect();
          const csL = window.getComputedStyle(l);
          const csR = window.getComputedStyle(r);
          return {
            leftX: rl.x,
            leftTranslate: csL.translate,
            leftTransform: csL.transform,
            leftAnimPlayState: csL.animationPlayState,
            rightX: rr.x,
            rightTranslate: csR.translate,
            rightTransform: csR.transform,
            rightAnimPlayState: csR.animationPlayState
          };
        })()`,
        returnByValue: true
      });
      return res.result.value;
    };

    const m0 = await getMetrics();
    await new Promise(r => setTimeout(r, 1200));
    const m1 = await getMetrics();
    await new Promise(r => setTimeout(r, 1200));
    const m2 = await getMetrics();

    console.log('T = 0.0s:', m0);
    console.log('T = 1.2s:', m1);
    console.log('T = 2.4s:', m2);

    const leftDelta = Math.abs(m2.leftX - m0.leftX);
    const rightDelta = Math.abs(m2.rightX - m0.rightX);

    console.log(`Left track 2.4s movement delta: ${leftDelta.toFixed(2)}px`);
    console.log(`Right track 2.4s movement delta: ${rightDelta.toFixed(2)}px`);
    console.log(`Left track continuously moving: ${leftDelta > 15}`);
    console.log(`Right track continuously moving: ${rightDelta > 15}`);
  }

  ws.close();
  chrome.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
