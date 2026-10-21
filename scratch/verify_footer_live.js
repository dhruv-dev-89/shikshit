const http = require('http');
const fs = require('fs');
const path = require('path');

http.get('http://127.0.0.1:9222/json', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', async () => {
    const tabs = JSON.parse(data);
    const homeTab = tabs.find(t => t.url.endsWith(':3000/') || t.url.includes('index.html')) || tabs[0];
    const ws = new WebSocket(homeTab.webSocketDebuggerUrl);

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
      // Reload page fresh
      await sendCommand('Page.reload', { ignoreCache: true });
      await new Promise(r => setTimeout(r, 1200));

      const viewports = [
        { name: 'desktop_1440', width: 1440, height: 900, mobile: false },
        { name: 'tablet_768', width: 768, height: 1024, mobile: true },
        { name: 'mobile_390', width: 390, height: 844, mobile: true }
      ];

      const results = [];

      for (const vp of viewports) {
        await sendCommand('Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1,
          mobile: vp.mobile
        });

        await new Promise(r => setTimeout(r, 400));

        // Scroll to footer
        await sendCommand('Runtime.evaluate', {
          expression: `document.querySelector('.footer-editorial')?.scrollIntoView()`
        });

        await new Promise(r => setTimeout(r, 300));

        const evalRes = await sendCommand('Runtime.evaluate', {
          expression: `(() => {
            const footer = document.querySelector('.footer-editorial');
            const logo = footer.querySelector('img[src*="sikshitlogo"]');
            const desc = footer.querySelector('p');

            const lr = logo.getBoundingClientRect();
            const dr = desc.getBoundingClientRect();

            return {
              viewport: ${JSON.stringify(vp.name)},
              logoWidth: Math.round(lr.width),
              logoHeight: Math.round(lr.height),
              logoLeft: Math.round(lr.left),
              descLeft: Math.round(dr.left),
              isLeftAligned: Math.abs(lr.left - dr.left) <= 2,
              gapToDescription: Math.round(dr.top - lr.bottom),
              hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
            };
          })()`,
          returnByValue: true
        });

        results.push(evalRes.result.value);

        // Capture viewport screenshot showing the footer
        const ss = await sendCommand('Page.captureScreenshot', {
          format: 'png',
          clip: { x: 0, y: vp.height - 450, width: vp.width, height: 450, scale: 1 }
        });

        const outPath = path.join(__dirname, `verified_footer_${vp.name}.png`);
        fs.writeFileSync(outPath, Buffer.from(ss.data, 'base64'));
        console.log(`Saved screenshot: ${outPath}`);
      }

      console.log('Homepage Footer Results:\n', JSON.stringify(results, null, 2));

      await sendCommand('Emulation.clearDeviceMetricsOverride');
      ws.close();
      process.exit(0);
    };
  });
});
