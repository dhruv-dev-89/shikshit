const { spawn } = require('child_process');
const http = require('http');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-diag-rules',
  '--disable-gpu',
  '--no-sandbox',
  'http://localhost:3000/product-services.html'
]);

setTimeout(() => {
  http.get('http://127.0.0.1:9222/json', res => {
    let d = ''; res.on('data', c => d += c);
    res.on('end', () => {
      const tab = JSON.parse(d).find(t => t.type === 'page' && t.url.includes('product-services.html'));
      const ws = new WebSocket(tab.webSocketDebuggerUrl);
      ws.onopen = () => {
        ws.send(JSON.stringify({
          id: 1,
          method: 'Runtime.evaluate',
          params: {
            expression: `(() => {
              const card = document.querySelector('.service-editorial-card');
              const matched = [];
              for (const sheet of document.styleSheets) {
                try {
                  for (const rule of sheet.cssRules) {
                    if (rule.selectorText && card.matches(rule.selectorText)) {
                      matched.push({ selector: rule.selectorText, cssText: rule.cssText });
                    }
                  }
                } catch(e) {}
              }
              return matched;
            })()`,
            returnByValue: true
          }
        }));
      };
      ws.onmessage = msg => {
        const val = JSON.parse(msg.data).result.result.value;
        console.log('Matched rules on card:', val.length);
        val.forEach(r => console.log('---', r.selector, '\n', r.cssText));
        ws.close();
        chrome.kill();
        process.exit(0);
      };
    });
  });
}, 2500);
