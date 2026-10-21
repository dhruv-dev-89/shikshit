const http = require('http');

http.get('http://127.0.0.1:9222/json', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', async () => {
    const tabs = JSON.parse(data);
    let tab = tabs.find(t => t.type === 'page') || tabs[0];
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let msgId = 1;
    function sendCommand(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        const handler = (msg) => {
          const d = JSON.parse(msg.data);
          if (d.id === id) {
            ws.removeEventListener('message', handler);
            resolve(d.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    ws.onopen = async () => {
      await sendCommand('Page.navigate', { url: 'http://localhost:3000/donate.html' });
      await new Promise(r => setTimeout(r, 1500));

      const res = await sendCommand('Runtime.evaluate', {
        expression: `(() => {
          const btn = document.querySelector('.amount-button');
          
          // Test with a fresh button created on the fly
          const b1 = document.createElement('button');
          b1.className = 'amount-button selected';
          document.body.appendChild(b1);
          b1.style.color = '#ffffff';

          const cs = window.getComputedStyle(btn);
          const props = {};
          for (let p of ['appearance', '-webkit-appearance', 'color-scheme', 'forced-color-adjust', '-webkit-text-fill-color', 'opacity']) {
            props[p] = cs.getPropertyValue(p);
          }

          return {
            props,
            freshButtonColor: window.getComputedStyle(b1).color
          };
        })()`,
        returnByValue: true
      });
      console.log('Result:', JSON.stringify(res.result.value, null, 2));
      process.exit(0);
    };
  });
});
