const { spawn } = require('child_process');
const http = require('http');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-diag',
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
  http.get('http://127.0.0.1:9222/json', async (res) => {
    let d = ''; res.on('data', c => d += c);
    res.on('end', async () => {
      const tab = JSON.parse(d).find(t => t.type === 'page' && t.url.includes('product-services.html'));
      const ws = new WebSocket(tab.webSocketDebuggerUrl);
      ws.onopen = async () => {
        // Evaluate at default viewport
        const diag = await sendCommand(ws, 'Runtime.evaluate', {
          expression: `(() => {
            const list = [
              { name: 'Header', sel: '.shikshit-header' },
              { name: 'Navbar Pill', sel: '.shikshit-navbar' },
              { name: 'Hero Section', sel: '.products-hero' },
              { name: 'Hero Grid', sel: '.products-hero-grid' },
              { name: 'Ribbons Bands Wrapper', sel: '.products-hero-bands' },
              { name: 'Ribbon Gradient Bar', sel: '.ribbon-gradient' },
              { name: 'Ribbon White Bar', sel: '.ribbon-white' },
              { name: 'Ribbon Track Left', sel: '.track-left' },
              { name: 'Sticky Section Index Bar', sel: '.sticky-section-index' },
              { name: 'Index Pill Track', sel: '.index-pill-track' },
              { name: 'Products Section', sel: '.products-services-section' },
              { name: 'Products Container', sel: '.products-services-section .shikshit-container' },
              { name: 'Services Editorial Grid', sel: '.services-editorial-grid' },
              { name: 'Video Section', sel: '.video-carousel' },
              { name: 'CTA Band', sel: '.products-cta-band' },
              { name: 'CTA Card', sel: '.products-cta-card' },
              { name: 'Footer Container', sel: '.footer-editorial .shikshit-container' }
            ];

            return list.map(item => {
              const el = document.querySelector(item.sel);
              if (!el) return { name: item.name, status: 'MISSING' };
              const r = el.getBoundingClientRect();
              const style = window.getComputedStyle(el);
              return {
                name: item.name,
                left: r.left,
                right: r.right,
                width: r.width,
                maxWidth: style.maxWidth,
                marginLeft: style.marginLeft,
                marginRight: style.marginRight,
                paddingLeft: style.paddingLeft,
                paddingRight: style.paddingRight,
                animationName: style.animationName,
                transform: style.transform
              };
            });
          })()`,
          returnByValue: true
        });

        console.log('DOM Elements Geometry Diagnostic:');
        console.table(diag.result ? diag.result.value : diag.value);

        try { ws.close(); } catch(e) {}
        chrome.kill();
        process.exit(0);
      };
    });
  });
}, 2500);
