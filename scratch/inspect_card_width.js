const targetsRes = await fetch('http://127.0.0.1:9222/json');
const targets = await targetsRes.json();
const pageTarget = targets.find(t => t.type === 'page');
const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

ws.onopen = async () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: `(() => {
        const card = document.querySelector(".service-editorial-card");
        const parent = card.parentElement;
        const grandParent = parent.parentElement;
        return {
          cardTagName: card.tagName,
          cardOffsetWidth: card.offsetWidth,
          cardClientWidth: card.clientWidth,
          parentClass: parent.className,
          parentDisplay: getComputedStyle(parent).display,
          parentWidth: getComputedStyle(parent).width,
          parentGridCols: getComputedStyle(parent).gridTemplateColumns,
          parentAlignItems: getComputedStyle(parent).alignItems,
          parentJustifyItems: getComputedStyle(parent).justifyItems,
          grandParentClass: grandParent.className,
          grandParentWidth: getComputedStyle(grandParent).width,
          cardFlex: getComputedStyle(card).flex,
          cardGridCol: getComputedStyle(card).gridColumn,
          cardAlignSelf: getComputedStyle(card).alignSelf,
          cardJustifySelf: getComputedStyle(card).justifySelf,
          cardInlineSize: getComputedStyle(card).inlineSize,
          cardInlineStyles: card.getAttribute('style')
        };
      })()`,
      returnByValue: true
    }
  }));
};

ws.onmessage = (msg) => {
  console.log(JSON.stringify(JSON.parse(msg.data).result?.result?.value, null, 2));
  ws.close();
  process.exit(0);
};
