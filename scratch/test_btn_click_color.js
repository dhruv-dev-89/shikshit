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
          const btns = Array.from(document.querySelectorAll('.amount-button'));
          return btns.map((btn, i) => {
            btn.classList.add('selected');
            const color = window.getComputedStyle(btn).color;
            const bg = window.getComputedStyle(btn).backgroundImage;
            return {
              index: i,
              text: btn.textContent.trim(),
              color,
              bg
            };
          });
        })()`,
        returnByValue: true
      });
      console.log('Result:', JSON.stringify(res.result.value, null, 2));
      process.exit(0);
    };
  });
});
