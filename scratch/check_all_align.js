const { spawn } = require('child_process');
const http = require('http');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-diag-sections',
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
              const selectors = [
                '.shikshit-navbar',
                '.products-hero-grid',
                '.sticky-section-index',
                '.products-services-section .shikshit-container',
                '.services-editorial-grid',
                '#diploma-courses > div',
                '.diploma-cards-grid',
                '.video-carousel',
                '.products-cta-band',
                '.footer-editorial .shikshit-container'
              ];
              return selectors.map(sel => {
                const el = document.querySelector(sel);
                if (!el) return { sel, found: false };
                const b = el.getBoundingClientRect();
                return {
                  sel,
                  left: b.left,
                  right: b.right,
                  width: b.width
                };
              });
            })()`,
            returnByValue: true
          }
        }));
      };
      ws.onmessage = msg => {
        console.log(JSON.stringify(JSON.parse(msg.data).result.result.value, null, 2));
        ws.close();
        chrome.kill();
        process.exit(0);
      };
    });
  });
}, 2500);
