const { spawn } = require('child_process');
const http = require('http');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-why-0',
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
        const r = await sendCommand(ws, 'Runtime.evaluate', {
          expression: `(() => {
            const card = document.querySelector("#scholarship-program");
            const header = card.querySelector(".service-card-header");
            const inner = card.querySelector(".service-inner-grid");
            const item = card.querySelector(".service-inner-item");

            const getRules = el => {
              const matched = [];
              for (const sheet of document.styleSheets) {
                try {
                  for (const rule of sheet.cssRules) {
                    if (rule.selectorText && el.matches(rule.selectorText)) {
                      matched.push(rule.selectorText + ' -> ' + rule.cssText);
                    }
                  }
                } catch(e) {}
              }
              return matched;
            };

            return {
              cardRules: getRules(card),
              headerRules: getRules(header),
              innerRules: getRules(inner),
              itemRules: getRules(item)
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
