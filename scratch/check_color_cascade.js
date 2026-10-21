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
      await sendCommand('DOM.enable');
      await sendCommand('CSS.enable');
      await sendCommand('Page.navigate', { url: 'http://localhost:3000/donate.html' });
      await new Promise(r => setTimeout(r, 1500));

      const doc = await sendCommand('DOM.getDocument');
      const node = await sendCommand('DOM.querySelector', {
        nodeId: doc.root.nodeId,
        selector: '.amount-button'
      });

      await sendCommand('DOM.setAttributeValue', {
        nodeId: node.nodeId,
        name: 'class',
        value: 'amount-button px-4 py-3 rounded-lg font-semibold text-center selected'
      });

      const matched = await sendCommand('CSS.getMatchedStylesForNode', {
        nodeId: node.nodeId
      });

      // Find all color properties and which one wins
      const colorRules = [];
      if (matched.matchedCSSRules) {
        for (let r of matched.matchedCSSRules) {
          for (let p of r.rule.style.cssProperties) {
            if (p.name === 'color') {
              colorRules.push({
                selector: r.rule.selectorList.text,
                value: p.value,
                important: p.important
              });
            }
          }
        }
      }

      console.log('Color rules in cascade:', JSON.stringify(colorRules, null, 2));
      process.exit(0);
    };
  });
});
