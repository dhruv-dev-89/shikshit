const { spawn } = require('child_process');
const http = require('http');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-test-anim',
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
        // Emulate prefers-reduced-motion: no-preference
        await sendCommand(ws, 'Emulation.setEmulatedMedia', {
          media: 'screen',
          features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }]
        });

        await new Promise(r => setTimeout(r, 600));

        const anims = await sendCommand(ws, 'Runtime.evaluate', {
          expression: `(() => {
            const getAnim = (sel) => {
              const el = document.querySelector(sel);
              if (!el) return 'NOT_FOUND';
              const s = window.getComputedStyle(el);
              return {
                animationName: s.animationName,
                animationDuration: s.animationDuration,
                animationPlayState: s.animationPlayState,
                animationIterationCount: s.animationIterationCount
              };
            };

            return {
              reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
              ribbonGradient: getAnim('.track-left'),
              ribbonWhite: getAnim('.track-right'),
              blob1: getAnim('.products-blob-1'),
              blob2: getAnim('.products-blob-2'),
              blob3: getAnim('.products-blob-3'),
              archFrame: getAnim('.products-arch-frame'),
              blobFrame: getAnim('.products-blob-frame'),
              statBadge: getAnim('.products-stat-badge'),
              cardIcon: getAnim('.service-card-icon'),
              footer: getAnim('.footer-editorial')
            };
          })()`,
          returnByValue: true
        });

        console.log('--- ALL ANIMATIONS WITH NO-PREFERENCE (ACTIVE MOTION) ---');
        console.log(JSON.stringify(anims.result ? anims.result.value : anims.value, null, 2));

        // Test hover pause on ribbon marquee
        console.log('\n--- TESTING HOVER PAUSE ON RIBBON TRACK ---');
        await sendCommand(ws, 'Runtime.evaluate', {
          expression: `(() => {
            const bands = document.querySelector('.products-hero-bands');
            const track = document.querySelector('.track-left');
            // Trigger hover
            const ev = new MouseEvent('mouseenter', { bubbles: true });
            bands.dispatchEvent(ev);
          })()`
        });

        const pauseRes = await sendCommand(ws, 'Runtime.evaluate', {
          expression: `(() => {
            // Check CSS rule for hover
            const sheets = Array.from(document.styleSheets);
            let hoverRuleFound = false;
            for (let s of sheets) {
              try {
                for (let r of s.cssRules) {
                  if (r.selectorText && r.selectorText.includes('.products-hero-bands:hover') && r.selectorText.includes('.ribbon-track')) {
                    hoverRuleFound = r.cssText;
                  }
                }
              } catch(e) {}
            }
            return { hoverRuleFound };
          })()`,
          returnByValue: true
        });
        console.log('Hover rule verification:', JSON.stringify(pauseRes.result ? pauseRes.result.value : pauseRes.value, null, 2));

        try { ws.close(); } catch(e) {}
        chrome.kill();
        process.exit(0);
      };
    });
  });
}, 2500);
