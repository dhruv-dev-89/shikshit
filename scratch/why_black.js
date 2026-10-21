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

          // Check if any inline style is set
          const inline = btn.getAttribute('style');

          // Check all rules in all sheets that set color
          const colorRules = [];
          for (let s of document.styleSheets) {
            try {
              for (let r of s.cssRules) {
                if (r.selectorText && btn.matches(r.selectorText)) {
                  if (r.style.color) {
                    colorRules.push({
                      sheet: s.href,
                      selector: r.selectorText,
                      color: r.style.color,
                      priority: r.style.getPropertyPriority('color')
                    });
                  }
                }
              }
            } catch(e) {}
          }

          // Test setting color on document.body and a new div
          const testDiv = document.createElement('div');
          testDiv.style.color = '#ffffff';
          document.body.appendChild(testDiv);
          const divColor = window.getComputedStyle(testDiv).color;
          testDiv.remove();

          btn.style.setProperty('color', '#ffffff', 'important');
          const forcedColor = window.getComputedStyle(btn).color;
          btn.removeAttribute('style');

          return {
            tagName: btn.tagName,
            outerHTML: btn.outerHTML,
            divColor,
            forcedColor,
            computedColor: window.getComputedStyle(btn).color
          };
        })()`,
        returnByValue: true
      });
      console.log('Result:', JSON.stringify(res.result.value, null, 2));
      process.exit(0);
    };
  });
});
