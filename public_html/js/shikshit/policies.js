/* Shared navigation behavior for Shikshit's legal pages. */
(function () {
  'use strict';

  const article = document.querySelector('.policy-layout > article.container');
  const details = document.querySelector('.policy-contents');
  const list = document.querySelector('.policy-contents-list');
  if (!article || !details || !list) return;

  const mobileQuery = window.matchMedia('(max-width: 900px)');
  function syncContentsMode(event) {
    details.open = !event.matches;
  }
  syncContentsMode(mobileQuery);
  mobileQuery.addEventListener?.('change', syncContentsMode);

  const headings = Array.from(article.querySelectorAll('h2, h3'));
  const usedIds = new Set();
  const links = [];
  const headingTargets = [];

  headings.forEach((heading, index) => {
    const label = heading.textContent.trim();
    if (!label) return;

    const baseId = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      || `policy-section-${index + 1}`;
    let id = baseId;
    let suffix = 2;
    while (usedIds.has(id) || (document.getElementById(id) && document.getElementById(id) !== heading)) {
      id = `${baseId}-${suffix++}`;
    }
    usedIds.add(id);
    heading.id = id;
    headingTargets.push(heading);

    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${id}`;
    link.textContent = label;
    link.addEventListener('click', () => {
      if (mobileQuery.matches) details.open = false;
    });
    item.appendChild(link);
    list.appendChild(item);
    links.push(link);

    const anchor = document.createElement('a');
    anchor.className = 'policy-anchor';
    anchor.href = `#${id}`;
    anchor.setAttribute('aria-label', `Link to section: ${label}`);
    anchor.title = 'Link to this section';
    anchor.textContent = '#';
    heading.appendChild(anchor);
  });

  function setActiveHeading(activeHeading) {
    links.forEach((link) => {
      const active = link.hash === `#${activeHeading.id}`;
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window && headingTargets.length) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) setActiveHeading(visible[0].target);
    }, { rootMargin: '-15% 0px -72% 0px', threshold: 0 });
    headingTargets.forEach((heading) => observer.observe(heading));
  } else if (headingTargets.length) {
    setActiveHeading(headingTargets[0]);
  }
})();
