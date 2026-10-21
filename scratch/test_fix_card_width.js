const { spawn } = require('child_process');
const http = require('http');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-fix-width',
  '--disable-gpu',
  '--no-sandbox',
  'http://localhost:3000/product-services.html'
]);

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

setTimeout(async () => {
  http.get('http://127.0.0.1:9222/json', async res => {
    let d = ''; res.on('data', c => d += c);
    res.on('end', async () => {
      const tab = JSON.parse(d).find(t => t.type === 'page' && t.url.includes('product-services.html'));
      const ws = new WebSocket(tab.webSocketDebuggerUrl);
      ws.onopen = async () => {
        await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
          width: 1440,
          height: 900,
          deviceScaleFactor: 1,
          mobile: false
        });

        const r = await sendCommand(ws, 'Runtime.evaluate', {
          expression: `(() => {
            const card = document.querySelector("#scholarship-program");
            const wBefore = card.offsetWidth;
            
            // Try different CSS fixes
            card.style.setProperty('width', '100%', 'important');
            const wAfterWidth100 = card.offsetWidth;

            card.style.setProperty('display', 'block', 'important');
            const wAfterBlock = card.offsetWidth;

            card.style.setProperty('display', 'flex', 'important');
            const grid = card.parentElement;
            grid.style.setProperty('perspective', 'none', 'important');
            const wAfterNoPersp = card.offsetWidth;

            return {
              wBefore,
              wAfterWidth100,
              wAfterBlock,
              wAfterNoPersp,
              headerWidth: card.querySelector('.service-card-header').offsetWidth,
              innerWidth: card.querySelector('.service-inner-grid').offsetWidth
            };
          })()`,
          returnByValue: true
        });

        console.log('Diagnostic result:', r);
        ws.close();
        chrome.kill();
        process.exit(0);
      };
    });
  });
}, 2500);
