/**
 * Component loader — fetches nav.html and footer.html, injects them into
 * #nav-root and #footer-root placeholders, wires the hamburger, and marks
 * the current page's nav link with aria-current="page".
 *
 * Usage in every page:
 *   <div id="nav-root"></div>
 *   ...page content...
 *   <div id="footer-root"></div>
 *   <script type="module" src="/src/components/load.js"></script>
 */

const [navHtml, footHtml] = await Promise.all([
  fetch('/src/components/nav.html').then(r => r.text()),
  fetch('/src/components/footer.html').then(r => r.text()),
]);

// Inject nav
const navRoot = document.getElementById('nav-root');
if (navRoot) navRoot.outerHTML = navHtml;

// Inject footer
const footRoot = document.getElementById('footer-root');
if (footRoot) footRoot.outerHTML = footHtml;

// Wire hamburger toggle
const toggle = document.querySelector('.nav-toggle');
const menu   = document.getElementById('nav-menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  // Close on outside click
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Mark active nav link based on current pathname
const path = location.pathname.replace(/\/$/, '') || '/';
document.querySelectorAll('#site-nav .nav-links a:not(.nav-cta)').forEach(a => {
  const href = a.getAttribute('href').replace(/\/$/, '') || '/';
  if (href === path) a.setAttribute('aria-current', 'page');
});
