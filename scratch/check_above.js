const http = require('http');
http.get('http://127.0.0.1:9222/json', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const tabs = JSON.parse(data);
    const targetTab = tabs.find(t => t.url.includes('product-services.html')) || tabs[0];
    const ws = new WebSocket(targetTab.webSocketDebuggerUrl);
    ws.onopen = () => {
      const expr = `(() => {
        const header = document.querySelector('.shikshit-header');
        const elementsAbove = [];
        let prev = header.previousElementSibling;
        while (prev) {
          const r = prev.getBoundingClientRect();
          elementsAbove.push({ tag: prev.tagName, id: prev.id, className: prev.className, height: r.height, top: r.top, bottom: r.bottom });
          prev = prev.previousElementSibling;
        }
        let parent = header.parentElement;
        while (parent && parent !== document.body) {
          let pprev = parent.previousElementSibling;
          while (pprev) {
            const r = pprev.getBoundingClientRect();
            elementsAbove.push({ tag: pprev.tagName, id: pprev.id, className: pprev.className, height: r.height, top: r.top, bottom: r.bottom });
            pprev = pprev.previousElementSibling;
          }
          parent = parent.parentElement;
        }
        return {
          bodyMargin: window.getComputedStyle(document.body).margin,
          bodyPadding: window.getComputedStyle(document.body).padding,
          mainContentMargin: window.getComputedStyle(document.querySelector('.shikshit-main-content')).margin,
          mainContentPadding: window.getComputedStyle(document.querySelector('.shikshit-main-content')).padding,
          elementsAbove
        };
      })()`;
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true } }));
    };
    ws.onmessage = (msg) => {
      const d = JSON.parse(msg.data);
      if (d.id === 1) {
        console.log(JSON.stringify(d.result.result.value, null, 2));
        ws.close();
        process.exit(0);
      }
    };
  });
});
