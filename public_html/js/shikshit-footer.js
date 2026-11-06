/**
 * Shikshit Centralized Reusable Footer Component Loader
 * Target Container: #shikshit-footer-container
 * Component Source: public_html/components/ShikshitFooter.html
 * Reference Truth:  public_html/index.html
 */
(function (global) {
  'use strict';

  // Prevent multiple initializations of this script
  if (global.__SHIKSHIT_FOOTER_LOADER_INITIALIZED__) {
    return;
  }
  global.__SHIKSHIT_FOOTER_LOADER_INITIALIZED__ = true;

  /**
   * Determine relative path prefix to the web root.
   */
  function determineBasePath(target) {
    if (global.SHIKSHIT_BASE_PATH !== undefined) {
      let b = global.SHIKSHIT_BASE_PATH;
      if (b && !b.endsWith('/')) b += '/';
      return b;
    }

    if (target && target.dataset && target.dataset.basePath !== undefined) {
      let b = target.dataset.basePath;
      if (b && !b.endsWith('/')) b += '/';
      return b;
    }

    try {
      const currentScript = document.currentScript ||
        document.querySelector('script[src*="shikshit-footer.js"]');
      if (currentScript) {
        const src = currentScript.getAttribute('src') || '';
        const match = src.match(/^(.*?)js\/shikshit-footer\.js(?:\?.*)?$/i);
        if (match && match[1] !== undefined) {
          return match[1]; // e.g. "" or "../"
        }
      }
    } catch (e) {
      // Fallback
    }

    return '';
  }

  /**
   * Ensure footer stylesheet is active in <head>.
   */
  function ensureStylesheet(basePath) {
    const existing = document.querySelector('link[href*="footer.css"]');
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = (basePath || '') + 'css/shikshit/footer.css';
      link.setAttribute('data-shikshit-footer-style', 'true');
      document.head.appendChild(link);
    }
  }

  /**
   * Generates the reference footer markup with dynamic relative paths.
   */
  function getReferenceTemplate(basePath) {
    const base = basePath || '';
    return `
    <footer class="footer-editorial" role="contentinfo">
      <div class="shikshit-container">
        <div class="footer-grid">
          <div class="footer-brand-col">
            <div class="footer-brand">
              <a href="${base}index.html" class="footer-brand-link" aria-label="Shikshit Home">
                <img src="${base}images/sikshitlogo.webp" alt="Shikshit Logo" class="footer-logo">
              </a>
            </div>
            <p class="footer-brand-desc">
              Empowering students and institutions across India through educational scholarships, practical skill development, and career guidance.
            </p>
          </div>

          <div class="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="${base}index.html">Home</a></li>
              <li><a href="${base}about-us.html">About Us</a></li>
              <li><a href="${base}product-services.html">Programs &amp; Services</a></li>
              <li><a href="${base}blogs.html">Blogs</a></li>
              <li><a href="${base}become-a-member.html">Become a Member</a></li>
              <li><a href="${base}careers.html">Career</a></li>
              <li><a href="${base}donate.html">Donate</a></li>
              <li><a href="${base}contact.html">Contact</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>NSMAS</h4>
            <ul>
              <li><a href="${base}ns-mas.html">NS-MAS Home</a></li>
              <li><a href="${base}how-it-works.html">How It Works</a></li>
              <li><a href="${base}scholarship.html">Scholarships</a></li>
              <li><a href="${base}registration.html">Student Registration</a></li>
              <li><a href="${base}privacypolicy.html">Privacy Policy</a></li>
              <li><a href="${base}termsandservice.html">Terms of Service</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Policies</h4>
            <ul>
              <li><a href="${base}privacy-policy.html">Privacy Policy</a></li>
              <li><a href="${base}terms.html">Terms &amp; Conditions</a></li>
              <li><a href="${base}disclaimer.html">Disclaimer</a></li>
              <li><a href="${base}cookie-policy.html">Cookie Policy</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Contact</h4>
            <p style="font-size: 14px; margin-bottom: 8px;">
              Email: <a href="mailto:shikshiteducation@gmail.com" style="color: var(--violet); font-weight: 600;">shikshiteducation@gmail.com</a>
            </p>
            <p style="font-size: 14px; margin-bottom: 12px;">
              Phone: <a href="tel:+917905044451" style="color: var(--violet); font-weight: 600;">+91 7905044451</a>
            </p>
            <div style="display: flex; gap: 10px; margin-top: 14px;">
              <a href="https://wa.me/917905044451" target="_blank" rel="noopener noreferrer" class="btn-pill btn-primary-gradient" style="padding: 8px 18px; font-size: 13px;">
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <span class="footer-copyright">&copy; 2026 Shikshit Education. All Rights Reserved.</span>
          <nav class="footer-social-links" aria-label="Social media links">
            <a href="https://www.facebook.com/profile.php?id=61585718603669&amp;sk=followers" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.4v3h2.7v8h3.4Z"/></svg>
            </a>
            <a href="https://twitter.com/shikshiteducation" target="_blank" rel="noopener noreferrer" aria-label="X" title="X">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.4l7.3-8.4L1.9 2h6.5l4.4 6.8L18.9 2Zm-1.1 18h1.7L7.4 3.9H5.6L17.8 20Z"/></svg>
            </a>
            <a href="https://www.youtube.com/channel/UCOSa-VBqUhlX8JNkWvoORtg" target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="YouTube">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z"/></svg>
            </a>
            <a href="https://www.instagram.com/shikshit_0?igsh=MWdvOGdscWQ1Znk1Mg==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.3-3.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/shikshit.in/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 3a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4ZM3.4 9h3.7v12H3.4V9Zm5.9 0h3.5v1.6h.1A3.8 3.8 0 0 1 16.3 8c3.8 0 4.5 2.5 4.5 5.7V21h-3.7v-6.5c0-1.6 0-3.6-2.2-3.6s-2.5 1.7-2.5 3.5V21H9.3V9Z"/></svg>
            </a>
          </nav>
        </div>
      </div>
    </footer>
    `.trim();
  }

  /**
   * Adjust relative URLs within loaded HTML markup for the given basePath.
   */
  function adjustPaths(html, basePath) {
    if (!basePath) return html;
    // Prefix relative images and internal html links
    return html
      .replace(/src="images\//g, `src="${basePath}images/`)
      .replace(/href="([^":#\/]+\.html)"/g, `href="${basePath}$1"`);
  }

  /**
   * Injects the footer into the target container.
   */
  function injectIntoContainer(container, htmlContent) {
    if (!container || container.getAttribute('data-loaded') === 'true') {
      return;
    }
    container.innerHTML = htmlContent;
    container.setAttribute('data-loaded', 'true');

    // Ensure the editorial footer has the active reveal class
    const footerEl = container.querySelector('.footer-editorial');
    if (footerEl) {
      footerEl.classList.add('in-view');
      ensureSocialLinks(footerEl);
    }

    // Force all grid column containers to be visible immediately
    const gridCols = container.querySelectorAll('.footer-grid > div');
    gridCols.forEach(function (col) {
      col.style.setProperty('opacity', '1', 'important');
      col.style.setProperty('transform', 'none', 'important');
      col.style.setProperty('visibility', 'visible', 'important');
    });

    // Attach smooth hover transitions
    const links = container.querySelectorAll('.footer-col a, .footer-editorial a');
    links.forEach(function (link) {
      link.style.transition = 'color 0.2s ease, transform 0.2s ease, box-shadow 0.25s ease';
    });

    try {
      document.dispatchEvent(new CustomEvent('shikshit:footer-loaded', { detail: { container } }));
    } catch (e) {}
  }

  // Older cached footer markup may only contain the first two social links.
  // Fill in any missing Shikshit profiles after every component load.
  function ensureSocialLinks(footer) {
    const bottom = footer.querySelector('.footer-bottom');
    if (!bottom) return;

    let nav = bottom.querySelector('.footer-social-links');
    if (!nav) {
      nav = document.createElement('nav');
      nav.className = 'footer-social-links';
      nav.setAttribute('aria-label', 'Social media links');
      bottom.appendChild(nav);
    }

    const profiles = [
      {
        label: 'Facebook',
        href: 'https://www.facebook.com/profile.php?id=61585718603669&sk=followers',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.4v3h2.7v8h3.4Z"/></svg>'
      },
      {
        label: 'X',
        href: 'https://twitter.com/shikshiteducation',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.4l7.3-8.4L1.9 2h6.5l4.4 6.8L18.9 2Zm-1.1 18h1.7L7.4 3.9H5.6L17.8 20Z"/></svg>'
      },
      {
        label: 'YouTube',
        href: 'https://www.youtube.com/channel/UCOSa-VBqUhlX8JNkWvoORtg',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z"/></svg>'
      },
      {
        label: 'Instagram',
        href: 'https://www.instagram.com/shikshit_0?igsh=MWdvOGdscWQ1Znk1Mg==',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.3-3.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z"/></svg>'
      },
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/company/shikshit.in/',
        icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 3a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4ZM3.4 9h3.7v12H3.4V9Zm5.9 0h3.5v1.6h.1A3.8 3.8 0 0 1 16.3 8c3.8 0 4.5 2.5 4.5 5.7V21h-3.7v-6.5c0-1.6 0-3.6-2.2-3.6s-2.5 1.7-2.5 3.5V21H9.3V9Z"/></svg>'
      }
    ];

    profiles.forEach(function (profile) {
      if (nav.querySelector('a[aria-label="' + profile.label + '"]')) return;
      const link = document.createElement('a');
      link.href = profile.href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', profile.label);
      link.title = profile.label;
      link.innerHTML = profile.icon;
      nav.appendChild(link);
    });
  }

  /**
   * Main loader function.
   */
  function loadShikshitFooter() {
    let containers = document.querySelectorAll(
      '#shikshit-footer-container, [data-component="shikshit-footer"]'
    );

    // If container is missing from page markup, dynamically append to body
    if (containers.length === 0) {
      const autoContainer = document.createElement('div');
      autoContainer.id = 'shikshit-footer-container';
      document.body.appendChild(autoContainer);
      containers = [autoContainer];
    }

    containers.forEach(function (container, idx) {
      // Ensure the footer is inserted exactly once
      if (idx > 0) {
        container.remove();
        return;
      }

      if (container.getAttribute('data-loaded') === 'true') {
        return;
      }

      const basePath = determineBasePath(container);
      ensureStylesheet(basePath);

      const componentUrl = basePath + 'components/ShikshitFooter.html';

      // Attempt to fetch components/ShikshitFooter.html
      fetch(componentUrl, { cache: 'no-store' })
        .then(function (response) {
          if (response.ok) {
            return response.text();
          }
          throw new Error('Network response not ok: ' + response.status);
        })
        .then(function (html) {
          injectIntoContainer(container, adjustPaths(html, basePath));
        })
        .catch(function () {
          // Robust fallback: if fetch fails (e.g. file:// protocol or offline), use the exact reference template
          injectIntoContainer(container, getReferenceTemplate(basePath));
        });
    });
  }

  // Execution triggers
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadShikshitFooter);
  } else {
    loadShikshitFooter();
  }

  window.addEventListener('load', function () {
    const loaded = document.querySelector('#shikshit-footer-container[data-loaded="true"]');
    if (!loaded) {
      loadShikshitFooter();
    }
  });

  // Global API
  global.loadShikshitFooter = loadShikshitFooter;
  global.ShikshitFooter = {
    load: loadShikshitFooter,
    getTemplate: getReferenceTemplate
  };

})(typeof window !== 'undefined' ? window : this);

