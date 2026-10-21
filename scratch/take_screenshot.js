const fs = require('fs');
const path = require('path');

async function main() {
  const urlArg = process.argv[2] || 'http://localhost:3000/product-services.html';
  const outName = process.argv[3] || 'screenshot.png';
  const width = parseInt(process.argv[4] || '1440', 10);
  const height = parseInt(process.argv[5] || '900', 10);
  const mobile = process.argv[6] === 'true';

  const targetsRes = await fetch('http://127.0.0.1:9222/json');
  const targets = await targetsRes.json();
  const pageTarget = targets.find(t => t.type === 'page');
  if (!pageTarget) {
    console.error('No page target found');
    process.exit(1);
  }

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let idCounter = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = idCounter++;
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === id) {
        ws.removeEventListener('message', handler);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });

  ws.addEventListener('open', async () => {
    try {
      await send('Page.enable');
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 1,
        mobile
      });
      await send('Page.navigate', { url: urlArg });
      await new Promise(r => setTimeout(r, 2000));

      // Scroll to the products section if exists
      await send('Runtime.evaluate', {
        expression: `(() => {
          const sec = document.querySelector('.products-section, #products-services, .services-section, .products-grid') || document.querySelector('section');
          if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'start' });
        })()`
      });
      await new Promise(r => setTimeout(r, 800));

      const screenshot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
      const buffer = Buffer.from(screenshot.data, 'base64');
      const outPath = path.resolve(__dirname, outName);
      fs.writeFileSync(outPath, buffer);
      console.log(`Saved screenshot to ${outPath}`);

      // Reset device metrics override
      await send('Emulation.clearDeviceMetricsOverride');
      ws.close();
      process.exit(0);
    } catch (err) {
      console.error(err);
      ws.close();
      process.exit(1);
    }
  });
}

main();
