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
    '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-motion-deep',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const ws = await getWs();

  for (const page of pages) {
    await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await sendCommand(ws, 'Page.navigate', { url: `http://localhost:3000/${page}` });
    await new Promise(r => setTimeout(r, 1200));

    const check = await sendCommand(ws, 'Runtime.evaluate', {
      expression: `(() => {
        // 1. Check all elements with CSS transitions or animations
        const animElements = Array.from(document.querySelectorAll('*')).filter(el => {
          const cs = window.getComputedStyle(el);
          return (cs.animationName && cs.animationName !== 'none') || (cs.transitionProperty && cs.transitionProperty !== 'none' && cs.transitionProperty !== 'all' && cs.transitionDuration !== '0s');
        });

        // 2. Check for carousels / auto-scroll tracks
        const tracks = Array.from(document.querySelectorAll('.carousel-track, .marquee-track, .ribbon, .track, .track-half')).map(t => {
          const cs = window.getComputedStyle(t);
          return {
            cls: t.className,
            scrollLeft: t.scrollLeft,
            scrollWidth: t.scrollWidth,
            animation: cs.animationName,
            overflow: cs.overflowX
          };
        });

        // 3. Check for reveals
        const reveals = Array.from(document.querySelectorAll('.editorial-reveal, .scroll-reveal-item, .reveal-item, .scholarship-reveal, [data-reveal]')).map(el => {
          const cs = window.getComputedStyle(el);
          return {
            tag: el.tagName,
            cls: el.className,
            opacity: cs.opacity,
            transform: cs.transform,
            transition: cs.transition
          };
        });

        // 4. Check for sticky elements
        const sticky = Array.from(document.querySelectorAll('*')).filter(el => {
          const cs = window.getComputedStyle(el);
          return cs.position === 'sticky' || cs.position === 'fixed';
        }).map(el => ({
          tag: el.tagName,
          id: el.id,
          cls: el.className,
          top: window.getComputedStyle(el).top,
          zIndex: window.getComputedStyle(el).zIndex
        }));

        // 5. Check if prefers-reduced-motion media queries exist in styles
        let hasReducedMotionQueries = false;
        try {
          for (const sheet of document.styleSheets) {
            try {
              for (const rule of sheet.cssRules) {
                if (rule.media && rule.media.mediaText && rule.media.mediaText.includes('prefers-reduced-motion')) {
                  hasReducedMotionQueries = true;
                  break;
                }
              }
            } catch(e) {}
            if (hasReducedMotionQueries) break;
          }
        } catch(e) {}

        return {
          page: location.pathname,
          tracks,
          revealCount: reveals.length,
          stickyCount: sticky.length,
          stickySummary: sticky.map(s => s.cls || s.id || s.tag).slice(0, 5),
          hasReducedMotionQueries
        };
      })()`,
      returnByValue: true
    });

    console.log(page, JSON.stringify(check.result.value, null, 2));
  }

  ws.close();
  chrome.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
