const http = require('http');
const fs = require('fs');
const path = require('path');

http.get('http://127.0.0.1:9222/json', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', async () => {
    const tabs = JSON.parse(data);
    const targetTab = tabs.find(t => t.url.includes('product-services.html')) || tabs[0];
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
      const viewports = [
        { name: 'desktop_1440', width: 1440, height: 900 },
        { name: 'tablet_768', width: 768, height: 1024 },
        { name: 'mobile_390', width: 390, height: 844 }
      ];

      for (const vp of viewports) {
        await sendCommand('Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1,
          mobile: vp.width < 800
        });

        await new Promise(r => setTimeout(r, 400));

        const evalRes = await sendCommand('Runtime.evaluate', {
          expression: `(() => {
            const nav = document.querySelector('.shikshit-navbar');
            const logo = document.querySelector('.shikshit-logo');
            const badge = document.querySelector('.products-hero-badge');
            const navRect = nav.getBoundingClientRect();
            const logoRect = logo.getBoundingClientRect();
            const badgeRect = badge ? badge.getBoundingClientRect() : null;
            return {
              viewport: ${JSON.stringify(vp.name)},
              navTop: Math.round(navRect.top),
              navHeight: Math.round(navRect.height),
              logoWidth: Math.round(logoRect.width),
              logoHeight: Math.round(logoRect.height),
              gapNavToHero: badgeRect ? Math.round(badgeRect.top - navRect.bottom) : null,
              hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
            };
          })()`,
          returnByValue: true
        });

        console.log(evalRes.result.value);

        const ss = await sendCommand('Page.captureScreenshot', {
          format: 'png',
          clip: { x: 0, y: 0, width: vp.width, height: Math.min(vp.height, 700), scale: 1 }
        });

        const outPath = path.join(__dirname, `${vp.name}.png`);
        fs.writeFileSync(outPath, Buffer.from(ss.data, 'base64'));
        console.log(`Saved screenshot: ${outPath}`);
      }

      // Reset emulation
      await sendCommand('Emulation.clearDeviceMetricsOverride');
      ws.close();
      process.exit(0);
    };
  });
});
