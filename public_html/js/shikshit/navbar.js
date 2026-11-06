(function () {
  'use strict';

  const host = document.getElementById('shikshit-navbar-container');
  if (!host) return;

  const componentPath = host.dataset.navbarComponent || 'components/ShikshitNavbar.html';

  fetch(componentPath)
    .then(function (response) {
      if (!response.ok) throw new Error('Navbar component request failed: ' + response.status);
      return response.text();
    })
    .then(function (markup) {
      host.classList.add('shikshit-navbar-spacer');
      host.setAttribute('aria-hidden', 'true');
      host.insertAdjacentHTML('afterend', markup);
      const header = document.querySelector('.shikshit-header');
      const menu = document.getElementById('shikshitMobileMenu');
      const toggle = document.getElementById('shikshitMobileMenuToggle');
      const currentPath = window.location.pathname.replace(/\/$/, '/index.html');

      document.querySelectorAll('.shikshit-header a[href]').forEach(function (link) {
        const linkPath = new URL(link.href, window.location.href).pathname.replace(/\/$/, '/index.html');
        if (linkPath === currentPath && link.classList.contains('shikshit-nav-link')) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      });

      function closeMenu() {
        if (!menu || !toggle) return;
        menu.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }

      if (menu && toggle) {
        toggle.addEventListener('click', function () {
          const open = !menu.classList.contains('active');
          menu.classList.toggle('active', open);
          toggle.classList.toggle('active', open);
          toggle.setAttribute('aria-expanded', String(open));
        });
        menu.addEventListener('click', function (event) {
          if (event.target.closest('a')) closeMenu();
        });
        document.addEventListener('click', function (event) {
          if (!header.contains(event.target)) closeMenu();
        });
        document.addEventListener('keydown', function (event) {
          if (event.key === 'Escape') closeMenu();
        });
      }

      function updateScrolledState() {
        if (header) header.classList.toggle('scrolled', window.scrollY > 40);
      }

      function sizeNavbarSpacer() {
        if (!header || !host) return;
        const heroOverlaysHeader = document.body.classList.contains('page-member') ||
          document.body.classList.contains('page-donate');
        host.style.height = heroOverlaysHeader ? '0px' : header.offsetHeight + 'px';
      }

      window.addEventListener('scroll', updateScrolledState, { passive: true });
      window.addEventListener('resize', sizeNavbarSpacer, { passive: true });
      sizeNavbarSpacer();
      updateScrolledState();
      document.dispatchEvent(new CustomEvent('shikshit:navbar-loaded'));
    })
    .catch(function (error) {
      console.error('Could not load the shared Shikshit navbar.', error);
    });
})();
