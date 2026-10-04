(function () {
  const cfg = window.SITE_CONFIG || {};
  const $all = (s) => Array.from(document.querySelectorAll(s));

  const textMap = {
    brand: cfg.brandName || 'AmazeMend',
    suite: cfg.suiteName || 'AmazeMend Repair Suite',
    product: cfg.productName || 'AmazeMend Video Repair for Windows',
    domain: cfg.domain || 'amazemend.com',
    supportEmail: cfg.supportEmail || 'support@amazemend.com',
    salesEmail: cfg.salesEmail || 'sales@amazemend.com',
    version: cfg.version || '1.0.0',
    releaseDate: cfg.releaseDate || '2026-09-30',
    fileSize: cfg.fileSize || 'Coming soon',
    company: cfg.companyName || 'AmazeMend',
    address: cfg.address || 'Your address',
    supportHours: cfg.supportHours || 'Mon–Fri, 09:00–18:00 UTC+8',
    priceMonthly: cfg.prices?.monthly || '$30.95',
    priceQuarterly: cfg.prices?.quarterly || '$60.95',
    priceYearly: cfg.prices?.yearly || '$60.95',
    priceLifetime: cfg.prices?.lifetime || '$75.95'
  };

  Object.entries(textMap).forEach(([key, value]) => {
    $all(`[data-${key}]`).forEach(el => el.textContent = value);
  });

  $all('[data-support-email]').forEach(el => {
    if (el.tagName === 'A') el.href = `mailto:${textMap.supportEmail}`;
  });
  $all('[data-sales-email]').forEach(el => {
    if (el.tagName === 'A') el.href = `mailto:${textMap.salesEmail}`;
  });
  $all('[data-download]').forEach(el => {
    el.addEventListener('click', function (e) {
      if (!cfg.downloadUrl || cfg.downloadUrl === '#') {
        e.preventDefault();
        showToast('Download URL is not configured yet. Update assets/js/config.js after uploading your installer.');
      } else {
        el.href = cfg.downloadUrl;
      }
    });
  });
  $all('[data-download-mac]').forEach(el => {
    el.addEventListener('click', function (e) {
      if (!cfg.downloadUrlMac || cfg.downloadUrlMac === '#') {
        e.preventDefault();
        showToast('macOS download is not configured yet.');
      } else {
        el.href = cfg.downloadUrlMac;
      }
    });
  });
  $all('[data-buy]').forEach(el => {
    el.addEventListener('click', function (e) {
      if (!cfg.paddleCheckoutUrl || cfg.paddleCheckoutUrl === '#') {
        e.preventDefault();
        showToast('Checkout is not connected yet. Update paddleCheckoutUrl in assets/js/config.js after Paddle setup.');
      } else {
        el.href = cfg.paddleCheckoutUrl;
      }
    });
  });

  const menuBtn = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-nav]');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
  }

  const path = window.location.pathname.split('/').pop() || 'index.html';
  $all('[data-nav]').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('is-active');
    }
  });

  $all('[data-faq-button]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      item.classList.toggle('open');
      btn.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
    });
  });

  const tabs = $all('[data-tab]');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    const group = tab.closest('[data-tabs]');
    if (!group) return;
    const target = tab.getAttribute('data-tab');
    group.querySelectorAll('[data-tab]').forEach(t => t.classList.remove('is-active'));
    group.querySelectorAll('[data-panel]').forEach(p => p.classList.remove('is-active'));
    tab.classList.add('is-active');
    const panel = group.querySelector(`[data-panel="${target}"]`);
    if (panel) panel.classList.add('is-active');
  }));

  const toast = document.createElement('div');
  toast.className = 'toast';
  document.body.appendChild(toast);
  let timer;
  function showToast(message) {
    clearTimeout(timer);
    toast.textContent = message;
    toast.classList.add('show');
    timer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
