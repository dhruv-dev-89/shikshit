const http = require('http');

http.get('http://127.0.0.1:9222/json', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const tabs = JSON.parse(data);
    const targetTab = tabs.find(t => t.url.endsWith(':3000/') || t.url.includes('index.html')) || tabs[0];
    console.log('Connecting to:', targetTab.title, targetTab.url);
    const ws = new WebSocket(targetTab.webSocketDebuggerUrl);

    ws.onopen = () => {
      const expr = `(() => {
        const footer = document.querySelector('.footer-editorial');
        if (!footer) return { error: 'No .footer-editorial found' };
        const logo = footer.querySelector('img[src*="sikshitlogo"]');
        const logoParent = logo ? logo.parentElement : null;
        const desc = footer.querySelector('p');

        const lr = logo ? logo.getBoundingClientRect() : null;
        const lpr = logoParent ? logoParent.getBoundingClientRect() : null;
        const dr = desc ? desc.getBoundingClientRect() : null;

        return {
          logo: lr ? { width: Math.round(lr.width), height: Math.round(lr.height), top: Math.round(lr.top), left: Math.round(lr.left) } : null,
          logoNatural: logo ? { naturalWidth: logo.naturalWidth, naturalHeight: logo.naturalHeight } : null,
          logoStyle: logo ? { width: logo.style.width, height: logo.style.height, margin: logo.style.margin } : null,
          logoParentStyle: logoParent ? { display: logoParent.style.display, marginBottom: logoParent.style.marginBottom } : null,
          gapToDesc: (dr && lr) ? Math.round(dr.top - lr.bottom) : null,
          descLeft: dr ? Math.round(dr.left) : null,
          logoLeft: lr ? Math.round(lr.left) : null
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
