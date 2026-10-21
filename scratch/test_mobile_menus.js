const { spawn } = require('child_process');
const http = require('http');

function getWs() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const tabs = JSON.parse(data);
        let tab = tabs.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension')) || tabs[0];
        if (!tab) return reject(new Error('No page tab found'));
        const ws = new WebSocket(tab.webSocketDebuggerUrl);
        ws.onopen = () => resolve(ws);
        ws.onerror = reject;
      });
    }).on('error', reject);
  });
}

let msgId = 1;
function sendCommand(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = msgId++;
    const handler = (msg) => {
      const d = JSON.parse(msg.data);
      if (d.id === id) {
        ws.removeEventListener('message', handler);
        if (d.error) reject(d.error);
        else resolve(d.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

const pages = [
  'index.html',
  'about-us.html',
  'product-services.html',
  'ns-mas.html',
  'scholarship.html',
  'become-a-member.html',
  'donate.html',
  'contact.html',
  'how-it-works.html',
  'registration.html'
];

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-test-menus',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const ws = await getWs();

  await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  console.log('=== MOBILE MENU & INTERACTION AUDIT (390px) ===\n');

  for (const page of pages) {
    await sendCommand(ws, 'Page.navigate', { url: `http://localhost:3000/${page}` });
    await new Promise(r => setTimeout(r, 1200));

    const check = await sendCommand(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('.mobile-menu-toggle, #mobile-menu-toggle, #mobile-menu-button, .mobile-menu-button, [aria-label*="menu" i], [onclick*="toggleMobileMenu"]');
        const menu = document.querySelector('.mobile-menu, #mobile-menu, #mobileMenu, .shikshit-mobile-menu');

        let initialVisible = false;
        if (menu) {
          const cs = window.getComputedStyle(menu);
          initialVisible = cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0' && menu.offsetHeight > 10;
        }

        let afterClickVisible = false;
        if (btn) {
          btn.click();
        }

        return {
          hasBtn: !!btn,
          btnSelector: btn ? (btn.id ? '#' + btn.id : btn.className) : null,
          hasMenu: !!menu,
          menuSelector: menu ? (menu.id ? '#' + menu.id : menu.className) : null,
          initialVisible
        };
      })()`,
      returnByValue: true
    });

    // Wait for transition after click
    await new Promise(r => setTimeout(r, 400));

    const checkAfter = await sendCommand(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const menu = document.querySelector('.mobile-menu, #mobile-menu, #mobileMenu, .shikshit-mobile-menu');
        if (!menu) return { opened: false };
        const cs = window.getComputedStyle(menu);
        const opened = cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0' && menu.offsetHeight > 10;
        return {
          opened,
          menuHeight: menu.offsetHeight,
          menuTransform: cs.transform,
          menuOpacity: cs.opacity
        };
      })()`,
      returnByValue: true
    });

    console.log(page, {
      ...check.result.value,
      afterClick: checkAfter.result.value
    });
  }

  ws.close();
  chrome.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
