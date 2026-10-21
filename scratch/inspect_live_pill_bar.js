const http = require('http');

http.get('http://127.0.0.1:9222/json', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', async () => {
    const tabs = JSON.parse(data);
    let targetTab = tabs.find(t => t.url.includes('product-services.html')) || tabs[0];
    const ws = new WebSocket(targetTab.webSocketDebuggerUrl);

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
      await sendCommand('Page.navigate', { url: 'http://localhost:3000/product-services.html' });
      await new Promise(r => setTimeout(r, 1500));

      const evaluation = await sendCommand('Runtime.evaluate', {
        expression: `(() => {
          const bar = document.querySelector('.sticky-section-index');
          const pills = Array.from(document.querySelectorAll('.index-pill')).map(p => ({
            text: p.textContent.trim(),
            href: p.getAttribute('href'),
            targetExists: !!document.querySelector(p.getAttribute('href')),
            targetTop: document.querySelector(p.getAttribute('href')) ? document.querySelector(p.getAttribute('href')).getBoundingClientRect().top + window.scrollY : null
          }));
          const barStyle = bar ? window.getComputedStyle(bar) : {};
          const trackStyle = bar ? window.getComputedStyle(bar.querySelector('.index-pill-track')) : {};
          return {
            barExists: !!bar,
            position: barStyle.position,
            top: barStyle.top,
            zIndex: barStyle.zIndex,
            pills
          };
        })()`,
        returnByValue: true
      });

      console.log(JSON.stringify(evaluation.result.value, null, 2));
      process.exit(0);
    };
  });
});
