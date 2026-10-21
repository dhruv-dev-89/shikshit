const { spawn } = require('child_process');
const http = require('http');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-diag-card',
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
              const grid = document.querySelector('.services-editorial-grid');
              const parent = card ? card.parentElement : null;
              if (!card) return 'NO CARD';
              const s = window.getComputedStyle(card);
              const gs = window.getComputedStyle(grid);
              return {
                parentClass: parent.className,
                gridDisplay: gs.display,
                gridCols: gs.gridTemplateColumns,
                gridWidth: gs.width,
                cardDisplay: s.display,
                cardWidth: s.width,
                cardMaxWidth: s.maxWidth,
                cardPadding: s.padding,
                cardRect: card.getBoundingClientRect(),
                gridRect: grid.getBoundingClientRect()
              };
            })()`,
            returnByValue: true
          }
        }));
      };
      ws.onmessage = msg => {
        console.log('Card Style Result:');
        console.log(JSON.parse(msg.data).result.result.value);
        ws.close();
        chrome.kill();
        process.exit(0);
      };
    });
  });
}, 2500);
