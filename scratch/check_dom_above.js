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
        return {
          bodyChildren: Array.from(document.body.children).map(c => ({
            tag: c.tagName, id: c.id, class: c.className,
            top: Math.round(c.getBoundingClientRect().top),
            height: Math.round(c.getBoundingClientRect().height)
          })),
          mainChildren: Array.from(document.querySelector('.shikshit-main-content')?.children || []).map(c => ({
            tag: c.tagName, id: c.id, class: c.className,
            top: Math.round(c.getBoundingClientRect().top),
            height: Math.round(c.getBoundingClientRect().height)
          })),
          headerComputed: {
            top: window.getComputedStyle(document.querySelector('.shikshit-header')).top,
            marginTop: window.getComputedStyle(document.querySelector('.shikshit-header')).marginTop,
            paddingTop: window.getComputedStyle(document.querySelector('.shikshit-header')).paddingTop,
            position: window.getComputedStyle(document.querySelector('.shikshit-header')).position
          },
          mainContentComputed: {
            paddingTop: window.getComputedStyle(document.querySelector('.shikshit-main-content')).paddingTop,
            marginTop: window.getComputedStyle(document.querySelector('.shikshit-main-content')).marginTop
          },
          bodyComputed: {
            paddingTop: window.getComputedStyle(document.body).paddingTop,
            marginTop: window.getComputedStyle(document.body).marginTop
          }
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
