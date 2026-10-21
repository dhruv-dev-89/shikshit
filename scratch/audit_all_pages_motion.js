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

async function audit() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-audit-all',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const ws = await getWs();

  let consoleLogs = [];
  ws.addEventListener('message', (msg) => {
    const d = JSON.parse(msg.data);
    if (d.method === 'Runtime.consoleAPICalled') {
      const text = d.params.args.map(a => a.value).join(' ');
      if (!text.includes('cdn.tailwindcss.com')) {
        consoleLogs.push({ type: d.params.type, text });
      }
    } else if (d.method === 'Runtime.exceptionThrown') {
      consoleLogs.push({ type: 'EXCEPTION', text: d.params.exceptionDetails.text + ' ' + (d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : '') });
    }
  });
  await sendCommand(ws, 'Runtime.enable');

  const results = {};

  for (const page of pages) {
    console.log(`\n--- Auditing: ${page} ---`);
    consoleLogs = [];

    // Desktop check (1440x900)
    await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    await sendCommand(ws, 'Page.navigate', { url: `http://localhost:3000/${page}` });
    await new Promise(r => setTimeout(r, 1500));

    // Audit animations & scroll elements on desktop
    const desktopAudit = await sendCommand(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const animatedElements = document.querySelectorAll('[style*="animation"], [class*="animate"], .marquee, .track, .carousel, .editorial-reveal, .scroll-reveal-item');
        
        // Check for stuck hidden elements (opacity: 0 that never become visible)
        const invisibleReveal = Array.from(document.querySelectorAll('.editorial-reveal, .scroll-reveal-item, [data-reveal]'))
          .filter(el => {
            const cs = window.getComputedStyle(el);
            return cs.opacity === '0' || cs.visibility === 'hidden';
          }).length;

        // Check running CSS animations
        const runningAnimations = Array.from(document.querySelectorAll('*')).filter(el => {
          const anim = window.getComputedStyle(el).animationName;
          return anim && anim !== 'none';
        }).map(el => {
          const cs = window.getComputedStyle(el);
          return {
            tag: el.tagName,
            cls: el.className,
            name: cs.animationName,
            duration: cs.animationDuration,
            playState: cs.animationPlayState
          };
        });

        // Check carousel / marquee scrollLeft changes
        const marqueeTracks = Array.from(document.querySelectorAll('.marquee-track, .carousel-track, .ribbon-track, .track, .track-half'))
          .map(t => ({
            cls: t.className,
            scrollLeft: t.scrollLeft,
            scrollWidth: t.scrollWidth,
            clientWidth: t.clientWidth
          }));

        // Check mobile menu trigger & mobile menu
        const mobileToggle = document.querySelector('.mobile-menu-toggle, #mobile-toggle, .navbar-toggler, [data-mobile-menu]');
        const mobileMenu = document.querySelector('.mobile-menu, #mobile-menu, .shikshit-mobile-menu');

        return {
          title: document.title,
          totalReveals: document.querySelectorAll('.editorial-reveal, .scroll-reveal-item').length,
          invisibleRevealAtTop: invisibleReveal,
          runningAnimationsCount: runningAnimations.length,
          runningAnimationsSample: runningAnimations.slice(0, 5),
          marqueeTracksCount: marqueeTracks.length,
          hasMobileToggle: !!mobileToggle,
          hasMobileMenu: !!mobileMenu
        };
      })()`,
      returnByValue: true
    });

    // Test scrolling all the way to bottom and checking if reveals trigger
    await sendCommand(ws, 'Runtime.evaluate', {
      expression: `window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });`
    });
    await new Promise(r => setTimeout(r, 500));

    const revealAfterScroll = await sendCommand(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const unrevealed = Array.from(document.querySelectorAll('.editorial-reveal, .scroll-reveal-item'))
          .filter(el => {
            const cs = window.getComputedStyle(el);
            return cs.opacity === '0';
          });
        return {
          unrevealedCount: unrevealed.length,
          unrevealedSample: unrevealed.slice(0, 3).map(el => ({ tag: el.tagName, cls: el.className, id: el.id }))
        };
      })()`,
      returnByValue: true
    });

    // Mobile check (390x844)
    await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sendCommand(ws, 'Runtime.evaluate', { expression: `window.scrollTo(0, 0);` });
    await new Promise(r => setTimeout(r, 500));

    const mobileAudit = await sendCommand(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        const hasHorizontalOverflow = docW > winW;
        return {
          docW,
          winW,
          hasHorizontalOverflow,
          overflowDiff: docW - winW
        };
      })()`,
      returnByValue: true
    });

    results[page] = {
      desktop: desktopAudit.result.value,
      revealsAfterScroll: revealAfterScroll.result.value,
      mobile: mobileAudit.result.value,
      logs: consoleLogs
    };

    console.log(`  Title: ${results[page].desktop.title}`);
    console.log(`  Reveals: total ${results[page].desktop.totalReveals}, unrevealed after scroll: ${results[page].revealsAfterScroll.unrevealedCount}`);
    console.log(`  Animations running: ${results[page].desktop.runningAnimationsCount}`);
    console.log(`  Horizontal overflow on 390px mobile: ${results[page].mobile.hasHorizontalOverflow ? `YES (+${results[page].mobile.overflowDiff}px)` : 'NO (clean)'}`);
    if (consoleLogs.length) {
      console.log(`  Logs/Errors:`, consoleLogs);
    }
  }

  ws.close();
  chrome.kill();
  console.log('\nAudit complete.');
}

audit().catch(err => {
  console.error(err);
  process.exit(1);
});
