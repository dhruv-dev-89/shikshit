const http = require('http');

http.get('http://127.0.0.1:9222/json', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const tabs = JSON.parse(data);
    const targetTab = tabs.find(t => t.url.includes('product-services.html')) || tabs[0];
    console.log('Connecting to tab:', targetTab.title, targetTab.url);
    const ws = new WebSocket(targetTab.webSocketDebuggerUrl);

    ws.onopen = () => {
      const expr = `(() => {
        const header = document.querySelector('.shikshit-header');
        const nav = document.querySelector('.shikshit-navbar');
        const brand = document.querySelector('.shikshit-brand');
        const logo = document.querySelector('.shikshit-logo');
        const menu = document.querySelector('.shikshit-nav-menu');
        const actions = document.querySelector('.shikshit-nav-actions');
        const hero = document.querySelector('.products-hero');
        const heroGrid = document.querySelector('.products-hero-grid');
        const heroContent = document.querySelector('.products-hero-content');
        const badge = document.querySelector('.products-hero-badge');
        const title = document.querySelector('.products-hero-title');
        const visual = document.querySelector('.products-hero-visual');
        const statBadge = document.querySelector('.products-stat-badge');

        function getMetrics(el) {
          if (!el) return null;
          const cs = window.getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return {
            tag: el.tagName,
            rect: { top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), height: Math.round(r.height) },
            padding: cs.paddingTop + ' ' + cs.paddingRight + ' ' + cs.paddingBottom + ' ' + cs.paddingLeft,
            margin: cs.marginTop + ' ' + cs.marginRight + ' ' + cs.marginBottom + ' ' + cs.marginLeft,
            gap: cs.gap,
            height: cs.height,
            width: cs.width,
            naturalWidth: el.naturalWidth,
            naturalHeight: el.naturalHeight
          };
        }

        return {
          window: { innerWidth: window.innerWidth, innerHeight: window.innerHeight },
          header: getMetrics(header),
          nav: getMetrics(nav),
          brand: getMetrics(brand),
          logo: getMetrics(logo),
          menu: getMetrics(menu),
          actions: getMetrics(actions),
          hero: getMetrics(hero),
          heroGrid: getMetrics(heroGrid),
          heroContent: getMetrics(heroContent),
          badge: getMetrics(badge),
          title: getMetrics(title),
          visual: getMetrics(visual),
          statBadge: getMetrics(statBadge)
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
