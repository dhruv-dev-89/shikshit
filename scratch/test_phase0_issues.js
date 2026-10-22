const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function sendCommand(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
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
}

async function evaluate(ws, expression) {
  const res = await sendCommand(ws, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true
  });
  return res.result ? res.result.value : null;
}

async function main() {
  // Start server
  const serverProc = spawn('node', ['server.js'], { cwd: path.resolve(__dirname, '..') });
  await sleep(1000);

  const chromeDataDir = path.resolve(__dirname, 'chrome-test-p0');
  if (!fs.existsSync(chromeDataDir)) fs.mkdirSync(chromeDataDir, { recursive: true });

  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=' + chromeDataDir,
    '--no-sandbox',
    '--disable-gpu',
    'about:blank'
  ]);
  await sleep(2000);

  const targetsRes = await fetch('http://127.0.0.1:9222/json');
  const targets = await targetsRes.json();
  const pageTarget = targets.find(t => t.type === 'page');
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  await sendCommand(ws, 'Page.enable');
  await sendCommand(ws, 'DOM.enable');
  await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  const results = {};

  // TEST HOMEPAGE (index.html) with Reduced Motion OFF
  console.log('Testing index.html (Reduced Motion OFF)...');
  await sendCommand(ws, 'Emulation.setEmulatedMedia', {
    media: 'screen',
    features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }]
  });
  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:3000/index.html' });
  await sleep(2500);

  // Logo widths
  const logos = await evaluate(ws, `(() => {
    const hLogo = document.querySelector('.shikshit-header img, header img, nav img');
    const fLogo = document.querySelector('footer img, .sikshit-footer img');
    return {
      headerLogo: hLogo ? { w: hLogo.offsetWidth, h: hLogo.offsetHeight, src: hLogo.src } : null,
      footerLogo: fLogo ? { w: fLogo.offsetWidth, h: fLogo.offsetHeight, src: fLogo.src } : null
    };
  })()`);
  results.logos_1440 = logos;

  // Check ribbon movement t=0 and t=1.5s
  const ribbon0 = await evaluate(ws, `(() => {
    const tracks = Array.from(document.querySelectorAll('.ribbon-track, .ribbon-content, [class*="ribbon"]'));
    return tracks.map(t => ({ class: t.className, transform: getComputedStyle(t).transform }));
  })()`);
  await sleep(1500);
  const ribbon15 = await evaluate(ws, `(() => {
    const tracks = Array.from(document.querySelectorAll('.ribbon-track, .ribbon-content, [class*="ribbon"]'));
    return tracks.map(t => ({ class: t.className, transform: getComputedStyle(t).transform }));
  })()`);

  results.ribbonMotion = {
    t0: ribbon0,
    t15: ribbon15,
    moves: JSON.stringify(ribbon0) !== JSON.stringify(ribbon15)
  };

  // Check partner marquee movement t=0 and t=1.5s
  const marquee0 = await evaluate(ws, `(() => {
    const tracks = Array.from(document.querySelectorAll('.marquee-track, .partners-track, [class*="marquee"], [class*="partner"] ul'));
    return tracks.map(t => ({ class: t.className, transform: getComputedStyle(t).transform }));
  })()`);
  await sleep(1500);
  const marquee15 = await evaluate(ws, `(() => {
    const tracks = Array.from(document.querySelectorAll('.marquee-track, .partners-track, [class*="marquee"], [class*="partner"] ul'));
    return tracks.map(t => ({ class: t.className, transform: getComputedStyle(t).transform }));
  })()`);

  results.marqueeMotion = {
    t0: marquee0,
    t15: marquee15,
    moves: JSON.stringify(marquee0) !== JSON.stringify(marquee15)
  };

  // Polaroid drag test
  const polaroidBefore = await evaluate(ws, `(() => {
    const pc = document.querySelector('.hero .pc, .pc');
    if (!pc) return null;
    const r = pc.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height, transform: getComputedStyle(pc).transform };
  })()`);

  if (polaroidBefore) {
    // Simulate mouse drag
    await sendCommand(ws, 'Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x: polaroidBefore.x + 20,
      y: polaroidBefore.y + 20,
      button: 'left',
      buttons: 1,
      clickCount: 1
    });
    await sleep(100);
    await sendCommand(ws, 'Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: polaroidBefore.x + 120,
      y: polaroidBefore.y + 80,
      button: 'left',
      buttons: 1
    });
    await sleep(200);
    await sendCommand(ws, 'Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: polaroidBefore.x + 120,
      y: polaroidBefore.y + 80,
      button: 'left',
      buttons: 0,
      clickCount: 1
    });
    await sleep(200);
  }

  const polaroidAfter = await evaluate(ws, `(() => {
    const pc = document.querySelector('.hero .pc, .pc');
    if (!pc) return null;
    const r = pc.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height, transform: getComputedStyle(pc).transform };
  })()`);

  results.polaroidDrag = {
    before: polaroidBefore,
    after: polaroidAfter,
    moved: polaroidBefore && polaroidAfter && (polaroidBefore.x !== polaroidAfter.x || polaroidBefore.y !== polaroidAfter.y)
  };

  // TEST PRODUCT-SERVICES.HTML
  console.log('Testing product-services.html...');
  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:3000/product-services.html' });
  await sleep(2500);

  const psFooter = await evaluate(ws, `(() => {
    const f = document.querySelector('footer, .sikshit-footer, [include-html*="footer"]');
    if (!f) return { exists: false };
    const r = f.getBoundingClientRect();
    const style = getComputedStyle(f);
    return {
      exists: true,
      tag: f.tagName,
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      height: r.height,
      innerHTML_length: f.innerHTML.length,
      children: f.children.length
    };
  })()`);
  results.ps_footer = psFooter;

  // Test section index scroll spy
  const psPills = await evaluate(ws, `(() => {
    const pills = Array.from(document.querySelectorAll('.ps-nav a, .section-nav a, [class*="nav-pill"], .category-pill'));
    const active = document.querySelector('.ps-nav .active, .section-nav .active, [class*="nav-pill"].active');
    return {
      count: pills.length,
      pills: pills.map(p => ({ text: p.textContent.trim(), href: p.getAttribute('href') })),
      activeText: active ? active.textContent.trim() : null
    };
  })()`);
  results.ps_section_index = psPills;

  // TEST WITH REDUCED MOTION ON
  console.log('Testing with prefers-reduced-motion: reduce...');
  await sendCommand(ws, 'Emulation.setEmulatedMedia', {
    media: 'screen',
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });
  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:3000/index.html' });
  await sleep(2000);

  const reducedMotionChecks = await evaluate(ws, `(() => {
    const reveals = Array.from(document.querySelectorAll('.editorial-reveal'));
    const animatedElements = Array.from(document.querySelectorAll('*')).filter(el => {
      const anim = getComputedStyle(el).animationName;
      return anim && anim !== 'none';
    });
    return {
      revealCount: reveals.length,
      revealsWithIsRevealed: reveals.filter(r => r.classList.contains('is-revealed')).length,
      runningAnimationCount: animatedElements.length
    };
  })()`);
  results.reduced_motion_on = reducedMotionChecks;

  fs.writeFileSync(path.join(__dirname, 'phase0_issue_repro.json'), JSON.stringify(results, null, 2));
  console.log('Results saved to scratch/phase0_issue_repro.json');

  ws.close();
  chromeProc.kill();
  serverProc.kill();
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
