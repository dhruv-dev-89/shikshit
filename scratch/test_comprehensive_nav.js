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

async function testNav() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-test-comp-nav',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const ws = await getWs();

  console.log('=== TEST SUITE: Section Navigation Bar (Product & Services) ===\n');

  // 1. Desktop Test (1440x900)
  await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:3000/product-services.html' });
  await new Promise(r => setTimeout(r, 2000));

  const getState = async () => {
    const res = await sendCommand(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const active = document.querySelector('.index-pill.active');
        const glider = document.querySelector('.index-pill-glider');
        const gStyle = glider ? window.getComputedStyle(glider) : null;
        const allPills = Array.from(document.querySelectorAll('.index-pill'));
        return {
          scrollY: Math.round(window.scrollY),
          activeText: active ? active.textContent.trim() : null,
          activeHref: active ? active.getAttribute('href') : null,
          ariaCurrent: active ? active.getAttribute('aria-current') : null,
          ariaCurrentCount: allPills.filter(p => p.getAttribute('aria-current') === 'true').length,
          gliderWidth: gStyle ? gStyle.width : null,
          gliderTransform: gStyle ? gStyle.transform : null,
          gliderOpacity: gStyle ? gStyle.opacity : null,
          gliderBackground: gStyle ? gStyle.backgroundImage || gStyle.background : null
        };
      })()`,
      returnByValue: true
    });
    return res.result.value;
  };

  console.log('1. Initial Load (Desktop 1440px):', await getState());

  // 2. Click Every Pill Test
  console.log('\n2. Testing Click on each navigation pill:');
  const pillSelectors = [
    'a[href="#scholarship-program"]',
    'a[href="#awareness-programs"]',
    'a[href="#olympiads"]',
    'a[href="#financial-aid"]',
    'a[href="#technical-training"]',
    'a[href="#video-ads"]',
    'a[href="#diploma-courses"]'
  ];

  for (const sel of pillSelectors) {
    await sendCommand(ws, 'Runtime.evaluate', {
      expression: `document.querySelector('${sel}').click();`
    });
    // Wait for click scroll
    await new Promise(r => setTimeout(r, 600));
    const st = await getState();
    console.log(`  Clicked ${sel}:`, {
      activeText: st.activeText,
      activeHref: st.activeHref,
      ariaCurrent: st.ariaCurrent,
      gliderWidth: st.gliderWidth,
      gliderTransform: st.gliderTransform,
      scrollY: st.scrollY
    });
  }

  // 3. Step-by-Step Manual Scrolling Test
  console.log('\n3. Testing Manual Scrolling (Simulating scroll down page):');
  const scrollPositions = [
    0,     // Top
    800,   // Hero area
    1650,  // Row 1 start (Scholarships)
    2050,  // Row 1 middle (Awareness)
    2450,  // Row 1 lower (Olympiads)
    2850,  // Row 2 start (Financial Aid)
    3300,  // Row 2 middle (Technical Training)
    3800,  // Video Ads section
    4500   // Near bottom / CTA
  ];

  for (const pos of scrollPositions) {
    await sendCommand(ws, 'Runtime.evaluate', {
      expression: `window.scrollTo({ top: ${pos}, behavior: 'instant' });`
    });
    await new Promise(r => setTimeout(r, 150));
    const st = await getState();
    console.log(`  Scroll pos ${pos}px -> Active: "${st.activeText}" (${st.activeHref}), glider: ${st.gliderTransform}, width: ${st.gliderWidth}`);
  }

  // 4. Mobile Test (390x844)
  console.log('\n4. Mobile Viewport Test (390px iPhone 14):');
  await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:3000/product-services.html' });
  await new Promise(r => setTimeout(r, 1500));

  const mobilePillPositions = [
    '#scholarship-program',
    '#awareness-programs',
    '#olympiads',
    '#financial-aid',
    '#technical-training',
    '#diploma-courses',
    '#video-ads'
  ];

  for (const s of mobilePillPositions) {
    await sendCommand(ws, 'Runtime.evaluate', {
      expression: `document.querySelector('${s}').scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await new Promise(r => setTimeout(r, 200));
    const st = await sendCommand(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const active = document.querySelector('.index-pill.active');
        const track = document.querySelector('.index-pill-track');
        const glider = document.querySelector('.index-pill-glider');
        const gStyle = glider ? window.getComputedStyle(glider) : null;
        return {
          scrollY: Math.round(window.scrollY),
          activeText: active ? active.textContent.trim() : null,
          trackScrollLeft: Math.round(track.scrollLeft),
          gliderWidth: gStyle ? gStyle.width : null,
          gliderTransform: gStyle ? gStyle.transform : null
        };
      })()`,
      returnByValue: true
    });
    console.log(`  Mobile scrolled to ${s}:`, st.result.value);
  }

  // 5. Reduced-Motion Test
  console.log('\n5. Reduced-Motion Preference Test:');
  await sendCommand(ws, 'Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });
  const redMotionTransition = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const glider = document.querySelector('.index-pill-glider');
      return window.getComputedStyle(glider).transition;
    })()`,
    returnByValue: true
  });
  console.log('  Glider transition with prefers-reduced-motion:', redMotionTransition.result.value);

  console.log('\n=== ALL TESTS COMPLETED ===');

  ws.close();
  chrome.kill();
  process.exit(0);
}

testNav().catch(err => {
  console.error(err);
  process.exit(1);
});
