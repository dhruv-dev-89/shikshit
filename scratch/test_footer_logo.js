const http = require('http');

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
      const testCss = `
        .footer-editorial .footer-brand {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-bottom: 28px !important;
        }

        .footer-editorial .footer-logo,
        .footer-editorial img[src*="sikshitlogo"] {
          width: 165px !important;
          max-width: 100% !important;
          height: auto !important;
          object-fit: contain !important;
          display: block !important;
          margin: 0 !important;
        }

        @media (max-width: 768px) {
          .footer-editorial .footer-brand {
            margin-bottom: 24px !important;
          }

          .footer-editorial .footer-logo,
          .footer-editorial img[src*="sikshitlogo"] {
            width: 135px !important;
          }
        }
      `;

      await sendCommand('Runtime.evaluate', {
        expression: `(() => {
          let s = document.getElementById('test-footer-logo-css');
          if (!s) {
            s = document.createElement('style');
            s.id = 'test-footer-logo-css';
            document.head.appendChild(s);
          }
          s.textContent = ${JSON.stringify(testCss)};

          // scroll to footer
          const footer = document.querySelector('.footer-editorial');
          if (footer) footer.scrollIntoView();
        })()`
      });

      await new Promise(r => setTimeout(r, 600));

      const viewports = [
        { name: 'desktop_1440', width: 1440, height: 900, mobile: false },
        { name: 'tablet_768', width: 768, height: 1024, mobile: true },
        { name: 'mobile_390', width: 390, height: 844, mobile: true }
      ];

      for (const vp of viewports) {
        await sendCommand('Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1,
          mobile: vp.mobile
        });

        await new Promise(r => setTimeout(r, 400));

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
              isLeftAligned: Math.abs(lr.left - dr.left) < 2,
              gapToDescription: Math.round(dr.top - lr.bottom),
              hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
            };
          })()`,
          returnByValue: true
        });

        console.log(evalRes.result.value);

        // Take screenshot of footer area
        const clipRes = await sendCommand('Runtime.evaluate', {
          expression: `(() => {
            const footer = document.querySelector('.footer-editorial');
            const r = footer.getBoundingClientRect();
            return { x: 0, y: Math.max(0, r.top), width: window.innerWidth, height: Math.min(window.innerHeight, r.height) };
          })()`,
          returnByValue: true
        });

        const clip = clipRes.result.value;
        const ss = await sendCommand('Page.captureScreenshot', {
          format: 'png',
          clip: { x: clip.x, y: clip.y, width: clip.width, height: Math.min(clip.height, 450), scale: 1 }
        });

        const fs = require('fs');
        const path = require('path');
        const outPath = path.join(__dirname, `footer_${vp.name}.png`);
        fs.writeFileSync(outPath, Buffer.from(ss.data, 'base64'));
        console.log('Saved screenshot:', outPath);
      }

      await sendCommand('Emulation.clearDeviceMetricsOverride');
      ws.close();
      process.exit(0);
    };
  });
});
