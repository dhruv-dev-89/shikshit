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
          btn.classList.add('selected');
          
          // Find all rules matching btn
          const matching = [];
          for (const sheet of document.styleSheets) {
            try {
              for (const rule of sheet.cssRules) {
                if (rule.selectorText && btn.matches(rule.selectorText)) {
                  if (rule.style.color) {
                    matching.push({ sel: rule.selectorText, color: rule.style.color, priority: rule.style.getPropertyPriority('color'), href: sheet.href });
                  }
                }
              }
            } catch(e) {}
          }
          return matching;
        })()`,
        returnByValue: true
      });
      console.log('Matching Rules:', JSON.stringify(res.result.value, null, 2));
      process.exit(0);
    };
  });
});
