const http = require('http');

http.get('http://127.0.0.1:9222/json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const pages = JSON.parse(data);
      console.log('Pages found:', pages.map(p => ({ title: p.title, url: p.url, ws: p.webSocketDebuggerUrl })));
      const productPage = pages.find(p => p.url && p.url.includes('product-services.html'));
      if (productPage) {
        console.log('Target WS:', productPage.webSocketDebuggerUrl);
      }
    } catch (e) {
      console.error(e);
    }
  });
}).on('error', console.error);
