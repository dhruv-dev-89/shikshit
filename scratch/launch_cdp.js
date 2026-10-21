const { spawn } = require('child_process');
const http = require('http');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chrome = spawn(chromePath, [
  '--headless',
  '--remote-debugging-port=9222',
  '--user-data-dir=C:\\Users\\kesha\\Desktop\\Shikshit01\\scratch\\chrome-test',
  '--no-sandbox',
  '--disable-gpu',
  'http://localhost:3000/product-services.html'
]);

chrome.stderr.on('data', d => console.log('Chrome stderr:', d.toString()));
chrome.on('close', code => console.log('Chrome exited with code:', code));

setTimeout(() => {
  http.get('http://127.0.0.1:9222/json', res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => console.log('CDP tabs:', JSON.parse(d)));
  }).on('error', e => console.error('CDP error:', e.message));
}, 2000);
