const http = require('http');

http.get('http://127.0.0.1:9222/json', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const tabs = JSON.parse(data);
    const targetTab = tabs.find(t => t.url.includes('product-services.html')) || tabs[0];
    const ws = new WebSocket(targetTab.webSocketDebuggerUrl);

    ws.onopen = () => {
      const expr = `(() => {
        const nav = document.querySelector('.shikshit-navbar');
        const logo = document.querySelector('.shikshit-logo');
        const badge = document.querySelector('.products-hero-badge');
        const title = document.querySelector('.products-hero-title');
        const statBadge = document.querySelector('.products-stat-badge');
        const visual = document.querySelector('.products-hero-visual');

        const navRect = nav.getBoundingClientRect();
        const badgeRect = badge.getBoundingClientRect();
        const statRect = statBadge.getBoundingClientRect();
        const logoRect = logo.getBoundingClientRect();

        return {
          windowWidth: window.innerWidth,
          navbarTop: Math.round(navRect.top),
          navbarHeight: Math.round(navRect.height),
          logoWidth: Math.round(logoRect.width),
          logoHeight: Math.round(logoRect.height),
          gapNavToHeroContent: Math.round(badgeRect.top - navRect.bottom),
          badgeTop: Math.round(badgeRect.top),
          titleTop: Math.round(title.getBoundingClientRect().top),
          visualTop: Math.round(visual.getBoundingClientRect().top),
          statBadgeTop: Math.round(statRect.top)
        };
      })()`;
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true } }));
    };

    ws.onmessage = (msg) => {
      const d = JSON.parse(msg.data);
      if (d.id === 1) {
        console.log(JSON.stringify(d.result.result.value, null, 2));
        ws.close();
        process.exit(0);
      }
    };
  });
});
