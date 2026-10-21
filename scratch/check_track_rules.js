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

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-test-rules-track',
    '--disable-gpu',
    '--no-sandbox',
    'http://localhost:3000/product-services.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const ws = await getWs();

  await sendCommand(ws, 'Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });

  await sendCommand(ws, 'DOM.enable');
  await sendCommand(ws, 'CSS.enable');

  const doc = await sendCommand(ws, 'DOM.getDocument');
  const node = await sendCommand(ws, 'DOM.querySelector', {
    nodeId: doc.root.nodeId,
    selector: '.track-left'
  });

  const styles = await sendCommand(ws, 'CSS.getMatchedStylesForNode', {
    nodeId: node.nodeId
  });

  console.log('Matched CSS rules affecting .track-left under prefers-reduced-motion: reduce:');
  for (const match of styles.matchedCSSRules) {
    const selector = match.rule.selectorList.text;
    const media = match.rule.media ? match.rule.media.map(m => m.text).join(', ') : 'none';
    const props = match.rule.style.cssProperties
      .filter(p => p.name.includes('animation') || p.name.includes('transform'))
      .map(p => `${p.name}: ${p.value} (${p.important ? '!important' : ''})`);
    
    if (props.length > 0 || media.includes('reduced-motion')) {
      console.log(`\nSelector: ${selector} [Media: ${media}]`);
      console.log(`  File: ${match.rule.style.parentStyleSheetId || 'inline'}`);
      props.forEach(p => console.log(`  ${p}`));
    }
  }

  ws.close();
  chrome.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
