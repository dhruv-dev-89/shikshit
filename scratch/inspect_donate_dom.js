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

async function inspect() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-inspect-donate',
    '--disable-gpu',
    '--no-sandbox',
    'http://localhost:3000/donate.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const ws = await getWs();

  // Wait 1.5s for includes
  await new Promise(r => setTimeout(r, 1500));

  const info = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const cards = document.querySelectorAll('.intervention-card');
      const footer = document.querySelector('footer, .footer-editorial, [include-html*="footer"]');
      const cardStyles = Array.from(cards).map(c => {
        const cs = window.getComputedStyle(c);
        const rect = c.getBoundingClientRect();
        return {
          display: cs.display,
          opacity: cs.opacity,
          visibility: cs.visibility,
          width: rect.width,
          height: rect.height,
          top: rect.top,
          classes: c.className
        };
      });
      return {
        cardCount: cards.length,
        cardStyles,
        footerFound: !!footer,
        footerHTML: footer ? footer.innerHTML.slice(0, 100) : ''
      };
    })()`,
    returnByValue: true
  });

  console.log(JSON.stringify(info.result.value, null, 2));

  ws.close();
  chrome.kill();
  process.exit(0);
}

inspect().catch(err => {
  console.error(err);
  process.exit(1);
});
