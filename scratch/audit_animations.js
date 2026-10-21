const { spawn } = require('child_process');
const http = require('http');

function getWs() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const tabs = JSON.parse(data);
        let tab = tabs.find(t => t.type === 'page' && t.url.includes('product-services.html')) || tabs.find(t => t.type === 'page');
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

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-motion-audit',
    '--disable-gpu',
    '--no-sandbox',
    'http://localhost:3000/product-services.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const ws = await getWs();

  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:3000/product-services.html' });
  await new Promise(r => setTimeout(r, 2000));

  const motionResults = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const report = {};

      // 1. Ribbons Marquee Animation
      const leftTrack = document.querySelector('.track-left');
      const rightTrack = document.querySelector('.track-right');
      const leftAnim = leftTrack ? window.getComputedStyle(leftTrack).animationName : 'none';
      const rightAnim = rightTrack ? window.getComputedStyle(rightTrack).animationName : 'none';
      const leftDuration = leftTrack ? window.getComputedStyle(leftTrack).animationDuration : '0s';
      const rightDuration = rightTrack ? window.getComputedStyle(rightTrack).animationDuration : '0s';
      
      report.ribbons = {
        leftTrack: { animation: leftAnim, duration: leftDuration },
        rightTrack: { animation: rightAnim, duration: rightDuration },
        leftTransform: leftTrack ? window.getComputedStyle(leftTrack).transform : 'none'
      };

      // 2. Background Drift Blobs
      const blob1 = document.querySelector('.products-blob-1');
      const blob2 = document.querySelector('.products-blob-2');
      const blob3 = document.querySelector('.products-blob-3');
      report.backgroundBlobs = {
        blob1: blob1 ? window.getComputedStyle(blob1).animationName : 'none',
        blob2: blob2 ? window.getComputedStyle(blob2).animationName : 'none',
        blob3: blob3 ? window.getComputedStyle(blob3).animationName : 'none'
      };

      // 3. Hero Visual Floats
      const archFrame = document.querySelector('.products-arch-frame');
      const blobFrame = document.querySelector('.products-blob-frame');
      const statBadge = document.querySelector('.products-stat-badge');
      report.heroVisuals = {
        archFrame: archFrame ? window.getComputedStyle(archFrame).animationName : 'none',
        blobFrame: blobFrame ? window.getComputedStyle(blobFrame).animationName : 'none',
        statBadge: statBadge ? window.getComputedStyle(statBadge).animationName : 'none'
      };

      // 4. Category Card Motion & Icons
      const cardIcon = document.querySelector('.service-card-icon');
      const cardBorderGlow = document.querySelector('.card-border-glow');
      const cards = Array.from(document.querySelectorAll('.service-editorial-card'));
      report.categoryCards = {
        count: cards.length,
        iconAnimation: cardIcon ? window.getComputedStyle(cardIcon).animationName : 'none',
        hasInViewClass: cards.filter(c => c.classList.contains('in-view')).length,
        cardBorderGlowPresent: !!cardBorderGlow
      };

      // 5. Section Index Glider
      const glider = document.querySelector('.index-pill-glider');
      report.sectionGlider = {
        present: !!glider,
        transition: glider ? window.getComputedStyle(glider).transition : 'none',
        opacity: glider ? window.getComputedStyle(glider).opacity : '0',
        width: glider ? window.getComputedStyle(glider).width : '0px'
      };

      // 6. Footer Motion & WhatsApp Shine
      const footer = document.querySelector('.footer-editorial');
      const waBtn = document.querySelector('.footer-editorial a.btn-primary-gradient');
      report.footer = {
        backgroundAnimation: footer ? window.getComputedStyle(footer).animationName : 'none',
        hasInView: footer ? footer.classList.contains('in-view') : false,
        waBtnTransition: waBtn ? window.getComputedStyle(waBtn).transition : 'none'
      };

      return report;
    })()`,
    returnByValue: true
  });

  const res = motionResults.result ? motionResults.result.value : motionResults.value;
  console.log('\n--- MOTION & ANIMATION AUDIT RESULTS ---');
  console.log(JSON.stringify(res, null, 2));

  // Test Scroll Interaction & Glider / Counters
  console.log('\n--- TESTING SCROLL-TRIGGERED MOTIONS ---');
  await sendCommand(ws, 'Runtime.evaluate', {
    expression: 'window.scrollTo({ top: 1200, behavior: "smooth" })'
  });
  await new Promise(r => setTimeout(r, 1500));

  const scrollEval = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const glider = document.querySelector('.index-pill-glider');
      const activePill = document.querySelector('.index-pill.active');
      const cardsInView = document.querySelectorAll('.service-editorial-card.in-view').length;
      const progressBar = document.getElementById('scroll-progress-bar');
      return {
        scrollY: window.scrollY,
        activePillText: activePill ? activePill.innerText : 'none',
        gliderOpacity: glider ? window.getComputedStyle(glider).opacity : '0',
        gliderWidth: glider ? window.getComputedStyle(glider).width : '0px',
        gliderTransform: glider ? window.getComputedStyle(glider).transform : 'none',
        cardsInView,
        progressBarWidth: progressBar ? progressBar.style.width : '0%'
      };
    })()`,
    returnByValue: true
  });

  const sRes = scrollEval.result ? scrollEval.result.value : scrollEval.value;
  console.log('Scroll State & Glider Tracking:', JSON.stringify(sRes, null, 2));

  try { ws.close(); } catch(e) {}
  chrome.kill();
  process.exit(0);
}

run().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
