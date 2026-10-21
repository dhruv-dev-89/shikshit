const { spawn } = require('child_process');
const http = require('http');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-console',
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
      
      const consoleMessages = [];
      ws.addEventListener('message', (msg) => {
        const data = JSON.parse(msg.data);
        if (data.method === 'Console.messageAdded') {
          consoleMessages.push(data.params.message);
        }
        if (data.method === 'Runtime.consoleAPICalled') {
          consoleMessages.push(data.params);
        }
        if (data.method === 'Runtime.exceptionThrown') {
          consoleMessages.push({ exception: data.params.exceptionDetails });
        }
      });

      ws.onopen = async () => {
        await sendCommand(ws, 'Console.enable');
        await sendCommand(ws, 'Runtime.enable');
        await sendCommand(ws, 'Page.reload');
        await new Promise(r => setTimeout(r, 2000));

        console.log('Console messages:', JSON.stringify(consoleMessages, null, 2));
        ws.close();
        chrome.kill();
        process.exit(0);
      };
    });
  });
}, 2500);
