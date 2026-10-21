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

async function inspectSections() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-inspect-targets',
    '--disable-gpu',
    '--no-sandbox',
    'http://localhost:3000/product-services.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const ws = await getWs();

  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:3000/product-services.html' });
  await new Promise(r => setTimeout(r, 2000));

  const sections = [
    'scholarship-program',
    'awareness-programs',
    'olympiads',
    'financial-aid',
    'technical-training',
    'video-ads',
    'diploma-courses'
  ];

  const info = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      return ${JSON.stringify(sections)}.map(id => {
        const el = document.getElementById(id);
        if (!el) return { id, exists: false };
        const rect = el.getBoundingClientRect();
        return {
          id,
          exists: true,
          tagName: el.tagName,
          offsetTop: el.offsetTop,
          topFromWindow: rect.top + window.scrollY,
          height: rect.height
        };
      });
    })()`,
    returnByValue: true
  });

  console.log('Section targets:', JSON.stringify(info.result.value, null, 2));

  // Check glider styling and why width was 0
  const gliderInfo = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const glider = document.querySelector('.index-pill-glider');
      const pills = Array.from(document.querySelectorAll('.index-pill')).map(p => ({
        text: p.textContent.trim(),
        offsetWidth: p.offsetWidth,
        offsetLeft: p.offsetLeft,
        rect: p.getBoundingClientRect()
      }));
      return {
        gliderInlineWidth: glider ? glider.style.width : null,
        gliderInlineTransform: glider ? glider.style.transform : null,
        pills
      };
    })()`,
    returnByValue: true
  });

  console.log('Glider and pills info:', JSON.stringify(gliderInfo.result.value, null, 2));

  ws.close();
  chrome.kill();
  process.exit(0);
}

inspectSections().catch(err => {
  console.error(err);
  process.exit(1);
});
