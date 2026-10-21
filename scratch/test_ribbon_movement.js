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
    '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-test-ribbons',
    '--disable-gpu',
    '--no-sandbox',
    'http://localhost:3000/product-services.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const ws = await getWs();

  // Test with both prefers-reduced-motion: reduce AND no-preference
  for (const prm of ['reduce', 'no-preference']) {
    console.log(`\nTesting with prefers-reduced-motion: ${prm}`);
    await sendCommand(ws, 'Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: prm }]
    });

    const checkTrack = async () => {
      return await sendCommand(ws, 'Runtime.evaluate', {
        expression: `(() => {
          const tl = document.querySelector('.track-left');
          const tr = document.querySelector('.track-right');
          const csl = window.getComputedStyle(tl);
          const csr = window.getComputedStyle(tr);
          const rl = tl.getBoundingClientRect();
          const rr = tr.getBoundingClientRect();
          return {
            leftTrack: {
              animName: csl.animationName,
              animDuration: csl.animationDuration,
              animPlayState: csl.animationPlayState,
              transform: csl.transform,
              x: rl.x
            },
            rightTrack: {
              animName: csr.animationName,
              animDuration: csr.animationDuration,
              animPlayState: csr.animationPlayState,
              transform: csr.transform,
              x: rr.x
            }
          };
        })()`,
        returnByValue: true
      });
    };

    const t0 = (await checkTrack()).result.value;
    await new Promise(r => setTimeout(r, 1000));
    const t1 = (await checkTrack()).result.value;

    console.log('T0:', t0);
    console.log('T1 (after 1s):', t1);
    console.log('Left track moved?', t0.leftTrack.transform !== t1.leftTrack.transform || t0.leftTrack.x !== t1.leftTrack.x);
    console.log('Right track moved?', t0.rightTrack.transform !== t1.rightTrack.transform || t0.rightTrack.x !== t1.rightTrack.x);
  }

  ws.close();
  chrome.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
