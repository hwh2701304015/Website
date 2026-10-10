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
    legalUpdatedDate: cfg.legalUpdatedDate || '2026-10-09',
    fileSize: cfg.fileSize || '31 MB',
    sha256: cfg.sha256 || '6B2EF578A385C116A2DCACE5FC78711D0A868E488FCB0209600EAC4E4004AE37',
    company: cfg.companyName || 'AmazeMend',
    address: cfg.address || 'Shenzhen, Guangdong, China',
    supportHours: cfg.supportHours || 'Mon–Fri, 09:00–18:00 UTC+8',
    priceMonthly: cfg.prices?.monthly || '$30.95',
    priceYearly: cfg.prices?.yearly || '$60.95',
    priceLifetime: cfg.prices?.lifetime || '$75.95'
  };

  Object.entries(textMap).forEach(([key, value]) => {
    const attribute = key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
    $all(`[data-${attribute}]`).forEach(el => el.textContent = value);
  });

  $all('[data-support-email]').forEach(el => {
    if (el.tagName === 'A') el.href = `mailto:${textMap.supportEmail}`;
  });
  $all('[data-sales-email]').forEach(el => {
    if (el.tagName === 'A') el.href = `mailto:${textMap.salesEmail}`;
  });
  $all('[data-download]').forEach(el => {
    if (cfg.downloadUrl && cfg.downloadUrl !== '#') {
      el.href = cfg.downloadUrl;
    }
    el.addEventListener('click', function (e) {
      if (!cfg.downloadUrl || cfg.downloadUrl === '#') {
        e.preventDefault();
        showToast('The download is temporarily unavailable. Please contact support@amazemend.com for help.');
      } else {
        e.preventDefault();
        window.location.assign(cfg.downloadUrl);
      }
    });
  });
  $all('[data-download-mac]').forEach(el => {
    if (cfg.downloadUrlMac && cfg.downloadUrlMac !== '#') {
      el.href = cfg.downloadUrlMac;
    }
    el.addEventListener('click', function (e) {
      if (!cfg.downloadUrlMac || cfg.downloadUrlMac === '#') {
        e.preventDefault();
        showToast('AmazeMend is currently available for Windows only.');
      } else {
        e.preventDefault();
        window.location.assign(cfg.downloadUrlMac);
      }
    });
  });
  $all('[data-buy]').forEach(el => {
    el.addEventListener('click', function (e) {
      const plan = el.dataset.plan;
      const paddleCfg = cfg.paddle || {};
      const priceId = paddleCfg.prices?.[plan];
      const hasPaddleConfig = window.Paddle
        && paddleCfg.clientToken
        && !paddleCfg.clientToken.startsWith('replace-with-')
        && priceId
        && !priceId.startsWith('replace-with-');

      if (hasPaddleConfig) {
        e.preventDefault();
        try {
          if (paddleCfg.environment === 'sandbox') {
            Paddle.Environment.set('sandbox');
          }
          if (!window.__amazemendPaddleReady) {
            Paddle.Initialize({ token: paddleCfg.clientToken });
            window.__amazemendPaddleReady = true;
          }
          Paddle.Checkout.open({
            items: [{ priceId, quantity: 1 }],
            customData: {
              product: 'amazemend-video-repair',
              plan
            }
          });
        } catch (error) {
          showToast('Unable to open checkout. Please try again or contact support.');
        }
        return;
      }

      if (cfg.paddleCheckoutUrl && cfg.paddleCheckoutUrl !== '#') {
        el.href = cfg.paddleCheckoutUrl;
        return;
      }

      e.preventDefault();
      showToast('Checkout is temporarily unavailable. Please contact sales@amazemend.com for help.');
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

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch (error) {
        // Some browsers expose the API but block it by permission policy.
        // Continue with the selection-based fallback while the click is active.
      }
    }

    const input = document.createElement('textarea');
    input.value = text;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.focus();
    input.select();
    input.setSelectionRange(0, input.value.length);
    let copied = false;
    try {
      copied = document.execCommand('copy');
    } finally {
      input.remove();
    }
    if (!copied) throw new Error('Copy failed');
  }

  $all('[data-copy-support-email]').forEach(button => {
    button.addEventListener('click', async () => {
      try {
        await copyText(textMap.supportEmail);
        const originalText = button.textContent;
        button.textContent = 'Email copied';
        window.setTimeout(() => { button.textContent = originalText; }, 2200);
        showToast(`Support email copied: ${textMap.supportEmail}`);
      } catch (error) {
        showToast(`Please copy this address: ${textMap.supportEmail}`);
      }
    });
  });

  const supportForm = document.querySelector('[data-support-form]');
  const supportVersionInput = document.querySelector('[data-support-version-input]');
  if (supportVersionInput && !supportVersionInput.value) {
    supportVersionInput.value = textMap.version;
  }

  function buildSupportRequest(form) {
    const data = new FormData(form);
    const value = name => String(data.get(name) || '').trim();
    const topic = value('topic') || 'Support request';
    const details = [
      `Name: ${value('name')}`,
      `Reply email: ${value('email')}`,
      `Topic: ${topic}`,
      `Order email or order ID: ${value('order') || 'Not provided'}`,
      `Windows version: ${value('windows') || 'Not provided'}`,
      `AmazeMend version: ${value('version') || 'Not provided'}`,
      '',
      'Problem description:',
      value('message')
    ];
    return {
      subject: `AmazeMend Support Request - ${topic}`,
      body: details.join('\n')
    };
  }

  if (supportForm) {
    supportForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!supportForm.reportValidity()) return;
      const request = buildSupportRequest(supportForm);
      window.location.href = `mailto:${textMap.supportEmail}?subject=${encodeURIComponent(request.subject)}&body=${encodeURIComponent(request.body)}`;
    });

    const copyRequestButton = document.querySelector('[data-copy-support-request]');
    if (copyRequestButton) {
      copyRequestButton.addEventListener('click', async () => {
        if (!supportForm.reportValidity()) return;
        const request = buildSupportRequest(supportForm);
        try {
          await copyText(`${request.subject}\n\n${request.body}`);
          showToast('Support request copied. Paste it into an email to our support address.');
        } catch (error) {
          showToast('Unable to copy. Please select and copy the form details manually.');
        }
      });
    }
  }

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
