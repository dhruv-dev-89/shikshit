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
      await sendCommand('Page.navigate', { url: 'http://localhost:3000/product-services.html' });
      await new Promise(r => setTimeout(r, 1500));

      const psCheck = await sendCommand('Runtime.evaluate', {
        expression: `(() => {
          const logo = document.querySelector('.footer-editorial .footer-logo');
          const footer = document.querySelector('.footer-editorial');
          return {
            logoTag: logo ? logo.outerHTML : null,
            logoHeight: logo ? window.getComputedStyle(logo).height : null,
            footerPaddingTop: footer ? window.getComputedStyle(footer).paddingTop : null
          };
        })()`,
        returnByValue: true
      });
      console.log('Product Services Check:', JSON.stringify(psCheck.result.value, null, 2));

      await sendCommand('Page.navigate', { url: 'http://localhost:3000/donate.html' });
      await new Promise(r => setTimeout(r, 1500));

      const donateCheck = await sendCommand('Runtime.evaluate', {
        expression: `(() => {
          const btn = document.querySelector('.amount-button');
          if (btn) btn.classList.add('selected');
          return {
            btnClasses: btn ? btn.className : null,
            btnColor: btn ? window.getComputedStyle(btn).color : null,
            btnBg: btn ? window.getComputedStyle(btn).backgroundImage : null
          };
        })()`,
        returnByValue: true
      });
      console.log('Donate Check:', JSON.stringify(donateCheck.result.value, null, 2));
      process.exit(0);
    };
  });
});
