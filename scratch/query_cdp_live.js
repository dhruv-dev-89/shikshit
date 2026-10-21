const wsUrl = 'ws://127.0.0.1:9222/devtools/page/8FBE9A5CC9DCC8D6D215CD6BCBB9407C';
const ws = new WebSocket(wsUrl);

ws.onopen = () => {
  // Reload page first to ensure fresh stylesheet is loaded
  ws.send(JSON.stringify({
    id: 1,
    method: 'Page.reload',
    params: { ignoreCache: true }
  }));
};

ws.onmessage = (msg) => {
  const data = JSON.parse(msg.data);
  if (data.id === 1) {
    // Page reloaded, wait 800ms and evaluate
    setTimeout(() => {
      const expr = `(() => {
        const g = document.querySelector('.ribbon-gradient');
        const w = document.querySelector('.ribbon-white');
        const p = document.querySelector('.products-hero-bands');
        return {
          windowWidth: window.innerWidth,
          gWidth: getComputedStyle(g).width,
          gMaxWidth: getComputedStyle(g).maxWidth,
          wWidth: getComputedStyle(w).width,
          wMaxWidth: getComputedStyle(w).maxWidth,
          pWidth: getComputedStyle(p).width
        };
      })()`;
      ws.send(JSON.stringify({
        id: 2,
        method: 'Runtime.evaluate',
        params: { expression: expr, returnByValue: true }
      }));
    }, 800);
  } else if (data.id === 2) {
    console.log('Live metrics after reload:', JSON.stringify(data.result?.result?.value, null, 2));
    ws.close();
    process.exit(0);
  }
};
