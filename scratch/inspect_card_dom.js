const { spawn } = require('child_process');
const http = require('http');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-card-dom',
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
            const card = document.querySelector('.service-editorial-card');
            const children = Array.from(card.children).map(ch => ({
              tag: ch.tagName,
              className: ch.className,
              width: ch.offsetWidth,
              height: ch.offsetHeight,
              rect: ch.getBoundingClientRect(),
              styleDisplay: window.getComputedStyle(ch).display
            }));
            
            return {
              card: {
                className: card.className,
                offsetWidth: card.offsetWidth,
                offsetHeight: card.offsetHeight,
                scrollWidth: card.scrollWidth,
                scrollHeight: card.scrollHeight,
                clientWidth: card.clientWidth,
                clientHeight: card.clientHeight
              },
              children
            };
          })()`,
          returnByValue: true
        });

        console.log(JSON.stringify(r.result ? r.result.value : r.value, null, 2));
        ws.close();
        chrome.kill();
        process.exit(0);
      };
    });
  });
}, 2500);
