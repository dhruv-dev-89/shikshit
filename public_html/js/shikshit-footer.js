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
          <div>
            <div class="footer-brand" style="display: flex; align-items: flex-start; justify-content: flex-start; margin: 0; padding: 0; height: 56px;">
              <img src="${base}images/sikshitlogo.webp" alt="Shikshit Logo" class="footer-logo" style="height: 56px; width: auto; max-width: 100%; display: block; margin: 0; object-fit: contain;">
            </div>
            <p style="font-size: 14.5px; line-height: 1.65; color: var(--ink); max-width: 340px; margin-top: 16px; margin-bottom: 0;">
              Empowering students and institutions across India through educational scholarships, practical skill development, and career guidance.
            </p>
          </div>

          <div class="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="${base}index.html">Home</a></li>
              <li><a href="${base}about-us.html">About Us</a></li>
              <li><a href="${base}product-services.html">Programs &amp; Services</a></li>
              <li><a href="${base}how-it-works.html">How It Works</a></li>
              <li><a href="${base}scholarship.html">Scholarships</a></li>
              <li><a href="${base}ns-mas.html">NS-MAS Scholarship</a></li>
              <li><a href="${base}become-a-member.html">Become a Member</a></li>
              <li><a href="${base}registration.html">Student Registration</a></li>
              <li><a href="${base}careers.html">Career</a></li>
              <li><a href="${base}donate.html">Donate</a></li>
              <li><a href="${base}contact.html">Contact</a></li>
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
          &copy; 2026 Shikshit Education. All Rights Reserved.
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
      fetch(componentUrl)
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

