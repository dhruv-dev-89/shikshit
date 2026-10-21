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
      // Reload page with cache disabled
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

        await new Promise(r => setTimeout(r, 500));

        const evalRes = await sendCommand('Runtime.evaluate', {
          expression: `(() => {
            const nav = document.querySelector('.shikshit-navbar');
            const logo = document.querySelector('.shikshit-logo');
            const badge = document.querySelector('.products-hero-badge');
            const title = document.querySelector('.products-hero-title');
            const statBadge = document.querySelector('.products-stat-badge');
            const visual = document.querySelector('.products-hero-visual');

            const navRect = nav.getBoundingClientRect();
            const logoRect = logo.getBoundingClientRect();
            const badgeRect = badge ? badge.getBoundingClientRect() : null;
            const statRect = (statBadge && window.getComputedStyle(statBadge).display !== 'none') ? statBadge.getBoundingClientRect() : null;
            const visualRect = visual ? visual.getBoundingClientRect() : null;

            return {
              viewport: ${JSON.stringify(vp.name)},
              navbarTop: Math.round(navRect.top),
              navbarHeight: Math.round(navRect.height),
              logoWidth: Math.round(logoRect.width),
              logoHeight: Math.round(logoRect.height),
              gapNavToHeroContent: badgeRect ? Math.round(badgeRect.top - navRect.bottom) : null,
              badgeTop: badgeRect ? Math.round(badgeRect.top) : null,
              visualTop: visualRect ? Math.round(visualRect.top) : null,
              statBadgeTop: statRect ? Math.round(statRect.top) : null,
              hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
            };
          })()`,
          returnByValue: true
        });

        results.push(evalRes.result.value);

        const ss = await sendCommand('Page.captureScreenshot', {
          format: 'png',
          clip: { x: 0, y: 0, width: vp.width, height: Math.min(vp.height, 700), scale: 1 }
        });

        const outPath = path.join(__dirname, `final_${vp.name}.png`);
        fs.writeFileSync(outPath, Buffer.from(ss.data, 'base64'));
      }

      console.log('Final Live Test Results:\n', JSON.stringify(results, null, 2));

      // Clear emulation
      await sendCommand('Emulation.clearDeviceMetricsOverride');
      ws.close();
      process.exit(0);
    };
  });
});
