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
    const res = await send('Runtime.evaluate', {
      expression: `(() => {
        const card = document.querySelector('.service-editorial-card');
        const headingWord = document.querySelector('.heading-word');

        function getRules(el) {
          const rules = [];
          for (const sheet of document.styleSheets) {
            try {
              for (const rule of sheet.cssRules) {
                if (rule.selectorText && el.matches(rule.selectorText)) {
                  rules.push({ selector: rule.selectorText, css: rule.cssText });
                }
              }
            } catch(e) {}
          }
          return rules;
        }

        return {
          cardRules: getRules(card),
          headingWordRules: getRules(headingWord),
          cardStyles: {
            width: getComputedStyle(card).width,
            maxWidth: getComputedStyle(card).maxWidth,
            minWidth: getComputedStyle(card).minWidth,
            boxSizing: getComputedStyle(card).boxSizing,
            padding: getComputedStyle(card).padding,
            overflow: getComputedStyle(card).overflow
          }
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
