const wsUrl = 'ws://127.0.0.1:9222/devtools/page/8FBE9A5CC9DCC8D6D215CD6BCBB9407C';
const ws = new WebSocket(wsUrl);

ws.onopen = () => {
  const expr = `(() => {
    const g = document.querySelector('.ribbon-gradient');
    g.style.setProperty('max-width', 'none', 'important');
    return {
      newGWidth: getComputedStyle(g).width,
      newGMaxWidth: getComputedStyle(g).maxWidth
    };
  })()`;

  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: { expression: expr, returnByValue: true }
  }));
};

ws.onmessage = (msg) => {
  const res = JSON.parse(msg.data);
  console.log('Result after setProperty important:', JSON.stringify(res.result?.result?.value, null, 2));
  ws.close();
  process.exit(0);
};
