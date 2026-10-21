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

async function runComprehensiveTest() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-test-suite',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));
  const ws = await getWs();

  await sendCommand(ws, 'Runtime.enable');
  await sendCommand(ws, 'Page.enable');

  const testReport = {};

  console.log('=== 1. TESTING NORMAL MOTION ACROSS VIEWPORTS ===');

  for (const page of pages) {
    console.log(`\nTesting ${page}...`);
    testReport[page] = {};

    // A. Desktop (1440x900)
    await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await sendCommand(ws, 'Page.navigate', { url: `http://localhost:3000/${page}` });
    await new Promise(r => setTimeout(r, 1200));

    // Scroll down gradually to trigger all scroll reveals
    await sendCommand(ws, 'Runtime.evaluate', {
      expression: `(async () => {
        const totalH = document.documentElement.scrollHeight;
        const step = window.innerHeight;
        for (let y = 0; y < totalH; y += step) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, 100));
        }
        window.scrollTo(0, totalH);
        await new Promise(r => setTimeout(r, 200));
      })()`,
      awaitPromise: true
    });

    const desktopRevealCheck = await sendCommand(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const reveals = Array.from(document.querySelectorAll('.editorial-reveal, .scroll-reveal-item, .scholarship-card-animated'));
        const stuckHidden = reveals.filter(el => {
          const cs = window.getComputedStyle(el);
          return cs.opacity === '0' || cs.visibility === 'hidden';
        });
        return {
          totalReveals: reveals.length,
          stuckHiddenCount: stuckHidden.length
        };
      })()`,
      returnByValue: true
    });

    testReport[page].desktop = desktopRevealCheck.result.value;

    // B. Tablet (768x1024)
    await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 768,
      height: 1024,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sendCommand(ws, 'Runtime.evaluate', { expression: `window.scrollTo(0, 0);` });
    await new Promise(r => setTimeout(r, 400));

    const tabletCheck = await sendCommand(ws, 'Runtime.evaluate', {
      expression: `(() => {
        return {
          overflow: document.documentElement.scrollWidth > window.innerWidth,
          diff: document.documentElement.scrollWidth - window.innerWidth
        };
      })()`,
      returnByValue: true
    });
    testReport[page].tablet = tabletCheck.result.value;

    // C. Mobile (390x844) & Hamburger menu test
    await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sendCommand(ws, 'Runtime.evaluate', { expression: `window.scrollTo(0, 0);` });
    await new Promise(r => setTimeout(r, 400));

    const mobileMenuTest = await sendCommand(ws, 'Runtime.evaluate', {
      expression: `(async () => {
        const toggle = document.querySelector('.mobile-menu-toggle, #mobile-menu-toggle, .mobile-menu-button');
        const menu = document.getElementById('mobile-menu') || document.getElementById('mobileMenu') || document.querySelector('.mobile-menu');
        
        const initialVisible = menu ? (window.getComputedStyle(menu).display !== 'none' && window.getComputedStyle(menu).opacity !== '0' && !menu.classList.contains('hidden')) : false;

        let openedCleanly = false;
        let closedCleanly = false;

        if (toggle && menu) {
          // Open menu
          toggle.click();
          await new Promise(r => setTimeout(r, 350));
          const csOpen = window.getComputedStyle(menu);
          openedCleanly = (csOpen.display !== 'none' && csOpen.opacity === '1');

          // Close menu
          toggle.click();
          await new Promise(r => setTimeout(r, 400));
          const csClose = window.getComputedStyle(menu);
          closedCleanly = (csClose.display === 'none' || csClose.opacity === '0' || menu.classList.contains('hidden') || !menu.classList.contains('active'));
        }

        return {
          hasToggle: !!toggle,
          hasMenu: !!menu,
          initialVisible,
          openedCleanly,
          closedCleanly,
          horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
          overflowDiff: document.documentElement.scrollWidth - window.innerWidth
        };
      })()`,
      awaitPromise: true,
      returnByValue: true
    });

    testReport[page].mobile = mobileMenuTest.result.value;
    console.log(`  Desktop: ${testReport[page].desktop.totalReveals} reveals, stuck: ${testReport[page].desktop.stuckHiddenCount}`);
    console.log(`  Tablet 768px overflow: ${testReport[page].tablet.overflow ? 'YES' : 'NO'}`);
    console.log(`  Mobile 390px menu: open=${testReport[page].mobile.openedCleanly}, close=${testReport[page].mobile.closedCleanly}, overflow=${testReport[page].mobile.horizontalOverflow ? 'YES' : 'NO'}`);
  }

  console.log('\n=== 2. TESTING PRODUCT-SERVICES SCROLL-SPY & VIDEO CAROUSEL ===');
  await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:3000/product-services.html' });
  await new Promise(r => setTimeout(r, 1200));

  const psMotionTest = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(async () => {
      const glider = document.querySelector('.index-pill-glider');
      const track = document.querySelector('.carousel-track');
      const videoSection = document.getElementById('video-ads');

      // Test scroll spy movement
      const secOlympiads = document.getElementById('olympiads');
      let gliderMoved = false;
      let initialGliderTransform = glider ? glider.style.transform : '';

      if (secOlympiads) {
        secOlympiads.scrollIntoView();
        await new Promise(r => setTimeout(r, 600));
        const newTransform = glider ? glider.style.transform : '';
        gliderMoved = (newTransform !== initialGliderTransform && newTransform.includes('translateX'));
      }

      // Test video carousel drift
      let carouselDrifted = false;
      let initialScrollLeft = track ? track.scrollLeft : 0;
      if (videoSection && track) {
        videoSection.scrollIntoView();
        await new Promise(r => setTimeout(r, 600));
        const afterScroll = track.scrollLeft;
        await new Promise(r => setTimeout(r, 800));
        const afterDrift = track.scrollLeft;
        carouselDrifted = (afterDrift > afterScroll || afterDrift > 0);
      }

      return {
        gliderPresent: !!glider,
        gliderMovedToSection: gliderMoved,
        carouselDriftingSmoothly: carouselDrifted
      };
    })()`,
    awaitPromise: true,
    returnByValue: true
  });
  console.log('Product & Services Motion:', psMotionTest.result.value);

  console.log('\n=== 3. TESTING PREFERS-REDUCED-MOTION ON ALL PAGES ===');
  // Emulate prefers-reduced-motion: reduce
  await sendCommand(ws, 'Emulation.setEmulatedMedia', {
    media: 'screen',
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });

  const reducedMotionReport = {};
  for (const page of pages) {
    await sendCommand(ws, 'Page.navigate', { url: `http://localhost:3000/${page}` });
    await new Promise(r => setTimeout(r, 800));

    const prmCheck = await sendCommand(ws, 'Runtime.evaluate', {
      expression: `(() => {
        // Under reduced motion:
        // 1. All reveal items must be 100% visible (opacity = 1)
        const invisibleReveals = Array.from(document.querySelectorAll('.editorial-reveal, .scroll-reveal-item, .scholarship-card-animated'))
          .filter(el => {
            const cs = window.getComputedStyle(el);
            return cs.opacity === '0';
          });

        // 2. Continuous animations should be stopped
        const runningKeyframeLoops = Array.from(document.querySelectorAll('.floating-button, .floating-scholarship-icons, .confetti-container'))
          .filter(el => {
            const cs = window.getComputedStyle(el);
            return cs.display !== 'none' && cs.animationDuration !== '0.001ms' && cs.animationDuration !== '0s' && cs.animationDuration !== '0.01ms';
          });

        return {
          invisibleRevealsCount: invisibleReveals.length,
          unstoppedContinuousLoops: runningKeyframeLoops.length
        };
      })()`,
      returnByValue: true
    });

    reducedMotionReport[page] = prmCheck.result.value;
    console.log(`  ${page}: invisible reveals = ${prmCheck.result.value.invisibleRevealsCount}, unstopped loops = ${prmCheck.result.value.unstoppedContinuousLoops}`);
  }

  ws.close();
  chrome.kill();
  console.log('\nComprehensive test complete.');
}

runComprehensiveTest().catch(console.error);
