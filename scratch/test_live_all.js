const http = require('http');
const fs = require('fs');
const path = require('path');

function getWs() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const tabs = JSON.parse(data);
        let tab = tabs.find(t => t.type === 'page') || tabs[0];
        const ws = new WebSocket(tab.webSocketDebuggerUrl);
        ws.onopen = () => resolve(ws);
        ws.onerror = reject;
      });
    });
  });
}

let msgId = 1;
function sendCommand(ws, method, params = {}) {
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

async function runTests() {
  const ws = await getWs();
  console.log('Connected to CDP websocket');

  // Test 1: product-services.html
  console.log('\n--- 1. TESTING PRODUCT-SERVICES.HTML ---');
  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:3000/product-services.html' });
  await new Promise(r => setTimeout(r, 2000));

  // Check console logs
  const logsRes = await sendCommand(ws, 'Runtime.evaluate', {
    expression: 'window.errors || []',
    returnByValue: true
  });

  const psEvaluation = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const bar = document.querySelector('.sticky-section-index');
      const track = document.querySelector('.index-pill-track');
      const glider = document.querySelector('.index-pill-glider');
      const pills = Array.from(document.querySelectorAll('.index-pill'));
      const activePill = document.querySelector('.index-pill.active');
      
      const whatsappBtn = document.querySelector('.footer-editorial a.btn-primary-gradient');
      const waStyle = whatsappBtn ? window.getComputedStyle(whatsappBtn) : {};
      const logo = document.querySelector('.footer-editorial .footer-logo');
      const logoStyle = logo ? window.getComputedStyle(logo) : {};
      const pAfterLogo = document.querySelector('.footer-editorial .footer-grid > div:first-child p');
      const pStyle = pAfterLogo ? window.getComputedStyle(pAfterLogo) : {};
      const footer = document.querySelector('.footer-editorial');
      const footerStyle = footer ? window.getComputedStyle(footer) : {};

      return {
        barExists: !!bar,
        barPosition: bar ? window.getComputedStyle(bar).position : null,
        barTop: bar ? window.getComputedStyle(bar).top : null,
        trackBg: track ? window.getComputedStyle(track).backgroundColor : null,
        gliderExists: !!glider,
        gliderOpacity: glider ? window.getComputedStyle(glider).opacity : null,
        gliderTransform: glider ? window.getComputedStyle(glider).transform : null,
        pillsCount: pills.length,
        activePillText: activePill ? activePill.textContent.trim() : null,
        activeAriaCurrent: activePill ? activePill.getAttribute('aria-current') : null,
        waColor: waStyle.color,
        waBg: waStyle.backgroundImage || waStyle.background,
        waHref: whatsappBtn ? whatsappBtn.href : null,
        logoHeight: logoStyle.height,
        pMarginTop: pStyle.marginTop,
        footerPaddingTop: footerStyle.paddingTop,
        footerWidth: footer ? footer.offsetWidth : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Product Services Evaluation:', JSON.stringify(psEvaluation.result.value, null, 2));

  // Test 2: become-a-member.html
  console.log('\n--- 2. TESTING BECOME-A-MEMBER.HTML ---');
  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:3000/become-a-member.html' });
  await new Promise(r => setTimeout(r, 2000));

  const memberEval = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const ambient = document.querySelector('.member-ambient-layer');
      const blobs = document.querySelectorAll('.member-blob');
      const shapes = document.querySelectorAll('.member-floating-shape');
      const cards = document.querySelectorAll('.membership-card');
      const form = document.querySelector('#membership-form');
      return {
        ambientExists: !!ambient,
        ambientZIndex: ambient ? window.getComputedStyle(ambient).zIndex : null,
        blobsCount: blobs.length,
        shapesCount: shapes.length,
        cardsCount: cards.length,
        formExists: !!form
      };
    })()`,
    returnByValue: true
  });
  console.log('Member Page Evaluation:', JSON.stringify(memberEval.result.value, null, 2));

  // Test 3: donate.html
  console.log('\n--- 3. TESTING DONATE.HTML ---');
  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:3000/donate.html' });
  await new Promise(r => setTimeout(r, 2000));

  const donateEval = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const ambient = document.querySelector('.donate-ambient-layer');
      const blobs = document.querySelectorAll('.donate-blob');
      const orbs = document.querySelectorAll('.donate-floating-orb');
      const amountBtns = document.querySelectorAll('.amount-button');
      const donateBtn = document.querySelector('#donateButton');
      const donationForm = document.querySelector('#donationForm');

      // Test click first amount button
      if (amountBtns.length > 0) {
        amountBtns[0].click();
      }
      const firstBtnSelected = amountBtns.length > 0 ? amountBtns[0].classList.contains('selected') : false;
      const firstBtnColor = amountBtns.length > 0 ? window.getComputedStyle(amountBtns[0]).color : null;
      const firstBtnBg = amountBtns.length > 0 ? window.getComputedStyle(amountBtns[0]).backgroundImage : null;

      return {
        ambientExists: !!ambient,
        ambientZIndex: ambient ? window.getComputedStyle(ambient).zIndex : null,
        blobsCount: blobs.length,
        orbsCount: orbs.length,
        amountButtonsCount: amountBtns.length,
        firstBtnSelected,
        firstBtnColor,
        firstBtnBg,
        donateBtnExists: !!donateBtn,
        donationFormExists: !!donationForm
      };
    })()`,
    returnByValue: true
  });
  console.log('Donate Page Evaluation:', JSON.stringify(donateEval.result.value, null, 2));

  // Test 4: Capture responsive screenshots
  console.log('\n--- 4. CAPTURING RESPONSIVE SCREENSHOTS ---');
  const viewports = [
    { name: '360', width: 360, height: 800, mobile: true },
    { name: '768', width: 768, height: 1024, mobile: true },
    { name: '1024', width: 1024, height: 900, mobile: false },
    { name: '1440', width: 1440, height: 900, mobile: false },
    { name: '1920', width: 1920, height: 1080, mobile: false }
  ];

  for (const vp of viewports) {
    await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.mobile
    });
    await sendCommand(ws, 'Emulation.setVisibleSize', { width: vp.width, height: vp.height });

    // product-services.html
    await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:3000/product-services.html' });
    await new Promise(r => setTimeout(r, 1200));
    const shotPs = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`scratch/after_ps_${vp.name}.png`, Buffer.from(shotPs.data, 'base64'));
    console.log(`Saved scratch/after_ps_${vp.name}.png`);
  }

  // Also capture member and donate at 1440
  await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:3000/become-a-member.html' });
  await new Promise(r => setTimeout(r, 1200));
  const shotMember = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/after_member_1440.png', Buffer.from(shotMember.data, 'base64'));
  console.log('Saved scratch/after_member_1440.png');

  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:3000/donate.html' });
  await new Promise(r => setTimeout(r, 1200));
  const shotDonate = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/after_donate_1440.png', Buffer.from(shotDonate.data, 'base64'));
  console.log('Saved scratch/after_donate_1440.png');

  // Also capture footer at 1440 on index.html
  await sendCommand(ws, 'Page.navigate', { url: 'http://localhost:3000/index.html' });
  await new Promise(r => setTimeout(r, 1200));
  await sendCommand(ws, 'Runtime.evaluate', { expression: 'window.scrollTo(0, document.body.scrollHeight)' });
  await new Promise(r => setTimeout(r, 600));
  const shotFooter = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scratch/after_footer_1440.png', Buffer.from(shotFooter.data, 'base64'));
  console.log('Saved scratch/after_footer_1440.png');

  console.log('\nAll tests and screenshots complete.');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test script error:', err);
  process.exit(1);
});
