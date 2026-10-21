const targetsRes = await fetch('http://127.0.0.1:9222/json');
const targets = await targetsRes.json();
const pageTarget = targets.find(t => t.type === 'page');

const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

let idCounter = 1;
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = idCounter++;
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

ws.addEventListener('open', async () => {
  try {
    await send('Page.reload');
    await new Promise(r => setTimeout(r, 1000));

    const res = await send('Runtime.evaluate', {
      expression: `(() => {
        const heading = document.querySelector('.products-section-heading');
        const headingLine = document.querySelector('.heading-line');
        const headingWords = Array.from(document.querySelectorAll('.heading-word')).map(w => ({
          text: w.textContent,
          display: getComputedStyle(w).display,
          position: getComputedStyle(w).position,
          width: getComputedStyle(w).width,
          transform: getComputedStyle(w).transform
        }));
        const grid = document.querySelector('.services-editorial-grid');
        const cards = Array.from(document.querySelectorAll('.service-editorial-card')).map(c => ({
          id: c.id,
          width: getComputedStyle(c).width,
          display: getComputedStyle(c).display,
          classes: c.className
        }));

        return {
          headingWords,
          gridWidth: grid ? getComputedStyle(grid).width : null,
          gridCols: grid ? getComputedStyle(grid).gridTemplateColumns : null,
          cards
        };
      })()`,
      returnByValue: true
    });

    console.log(JSON.stringify(res.result.value, null, 2));
    ws.close();
  } catch (e) {
    console.error(e);
    ws.close();
  }
});
