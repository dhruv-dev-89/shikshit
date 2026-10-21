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

async function testInteractions() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-test-interact',
    '--disable-gpu',
    '--no-sandbox',
    'http://localhost:3000/donate.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const ws = await getWs();

  console.log('Testing Donate interactions...');

  // 1. Click 3000 preset amount
  const res1 = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const btn = Array.from(document.querySelectorAll('.amount-button')).find(b => b.textContent.includes('3000'));
      btn.click();
      return {
        hasSelectedClass: btn.classList.contains('selected'),
        displayedAmount: document.getElementById('donationAmount').textContent,
        globalSelectedAmount: window.selectedAmount
      };
    })()`,
    returnByValue: true
  });
  console.log('Clicked ₹3000:', res1.value !== undefined ? res1.value : (res1.result ? res1.result.value : res1));

  // 2. Click UPI payment method
  const res2 = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const method = document.querySelector('.payment-method[data-method="upi"]');
      method.click();
      return {
        hasSelectedClass: method.classList.contains('selected'),
        globalSelectedMethod: window.selectedPaymentMethod
      };
    })()`,
    returnByValue: true
  });
  console.log('Clicked UPI:', res2.value !== undefined ? res2.value : (res2.result ? res2.result.value : res2));

  // 3. Type custom amount 7500
  const res3 = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const customInput = document.getElementById('customAmount');
      customInput.value = '7500';
      customInput.dispatchEvent(new Event('input', { bubbles: true }));
      const btn3000 = Array.from(document.querySelectorAll('.amount-button')).find(b => b.textContent.includes('3000'));
      return {
        btn3000HasSelectedClass: btn3000.classList.contains('selected'),
        displayedAmount: document.getElementById('donationAmount').textContent,
        globalSelectedAmount: window.selectedAmount
      };
    })()`,
    returnByValue: true
  });
  console.log('Typed custom ₹7500:', res3.value !== undefined ? res3.value : (res3.result ? res3.result.value : res3));

  // 4. Form validation when missing required fields
  const res4 = await sendCommand(ws, 'Runtime.evaluate', {
    expression: `(() => {
      const form = document.getElementById('donationForm');
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      const errDiv = document.getElementById('paymentError');
      const errMsg = document.getElementById('errorMessage');
      return {
        errorDisplayed: errDiv.style.display,
        errorMessage: errMsg.textContent
      };
    })()`,
    returnByValue: true
  });
  console.log('Empty form validation test:', res4.value !== undefined ? res4.value : (res4.result ? res4.result.value : res4));

  ws.close();
  chrome.kill();
  process.exit(0);
}

testInteractions().catch(err => {
  console.error(err);
  process.exit(1);
});
