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
    '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-test-translate',
    '--disable-gpu',
    '--no-sandbox',
    'http://localhost:3000/product-services.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const ws = await getWs();

  await sendCommand(ws, 'Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });

  // Inject style that animates `translate`
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const style = document.createElement('style');
      style.textContent = \`
        @keyframes mqTranslateLeft {
          0% { translate: 0 0; }
          100% { translate: -50% 0; }
        }
        body.page-products .ribbon-track.track-left {
          animation: mqTranslateLeft 20s linear infinite !important;
          animation-duration: 20s !important;
          animation-iteration-count: infinite !important;
          animation-play-state: running !important;
        }
      \`;
      document.head.appendChild(style);
    })()`
  });

  const getPos = async () => {
    return await sendCommand(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('.track-left');
        const r = el.getBoundingClientRect();
        return {
          x: r.x,
          translate: window.getComputedStyle(el).translate,
          transform: window.getComputedStyle(el).transform
        };
      })()`,
      returnByValue: true
    });
  };

  const p0 = (await getPos()).result.value;
  await new Promise(r => setTimeout(r, 1000));
  const p1 = (await getPos()).result.value;

  console.log('P0:', p0);
  console.log('P1 (after 1s):', p1);
  console.log('Did track move with translate animation?', p0.x !== p1.x);

  ws.close();
  chrome.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
