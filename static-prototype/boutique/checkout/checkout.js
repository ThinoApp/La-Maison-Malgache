/* Demo checkout flow. No payment credentials are collected or transmitted. */
(() => {
  const CART_KEY = 'lmm-cart';
  const DRAFT_KEY = 'lmm-checkout-draft';
  const form = document.querySelector('#checkout-form');
  const empty = document.querySelector('[data-checkout-empty]');
  const steps = [...document.querySelectorAll('[data-checkout-step]')];
  const indicators = [...document.querySelectorAll('[data-step-indicator]')];
  const summaryItems = document.querySelector('[data-summary-items]');
  const subtotalEl = document.querySelector('[data-summary-subtotal]');
  const shippingEl = document.querySelector('[data-summary-shipping]');
  const totalEl = document.querySelector('[data-summary-total]');
  const demoConfirm = document.querySelector('[data-demo-confirm]');
  const confirmButton = document.querySelector('[data-confirm-order]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentStep = 1;
  let completedOrder = null;

  function loadSharedEnhancements(){
    const assets = [
      ['link','../shared-brand-cursor.css','data-brand-cursor'],
      ['script','../shared-brand-cursor.js','data-brand-cursor'],
      ['link','../shared-a11y.css','data-shared-a11y'],
      ['script','../shared-a11y.js','data-shared-a11y']
    ];
    assets.forEach(([type,src,marker]) => {
      if (document.querySelector(`${type}[${marker}]`)) return;
      const node = document.createElement(type);
      node.setAttribute(marker,'true');
      if (type === 'link') {
        node.rel = 'stylesheet';
        node.href = src;
        document.head.appendChild(node);
      } else {
        node.src = src;
        node.defer = true;
        document.body.appendChild(node);
      }
    });
  }

  const formatPrice = (value) => `${Math.max(0, Number(value) || 0).toFixed(0)} €`;

  function readCart() {
    try {
      const items = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      return Array.isArray(items) ? items.filter((item) => item && item.id && Number(item.quantity) > 0) : [];
    } catch (_) { return []; }
  }

  function subtotal(items) {
    return items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
  }

  function shippingPrice() {
    const mode = form?.elements?.shipping?.value || 'standard';
    return mode === 'express' ? 24 : 12;
  }

  function shippingLabel() {
    return shippingPrice() === 24 ? 'Livraison express · 24 €' : 'Livraison standard · 12 €';
  }

  function activeItems() {
    return completedOrder?.items || readCart();
  }

  function renderSummaryItem(item) {
    const article = document.createElement('article');
    article.className = 'checkout-summary-item';

    const image = document.createElement('img');
    image.src = String(item.image || '');
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';

    const copy = document.createElement('div');
    const material = document.createElement('p');
    material.textContent = String(item.material || '');
    const name = document.createElement('h3');
    name.textContent = String(item.name || item.id || 'Pièce');
    const quantity = document.createElement('small');
    quantity.textContent = `Quantité ${Math.max(1, Number(item.quantity) || 1)}`;
    copy.append(material, name, quantity);

    const linePrice = document.createElement('strong');
    linePrice.textContent = formatPrice((Number(item.price) || 0) * Math.max(1, Number(item.quantity) || 1));

    article.append(image, copy, linePrice);
    return article;
  }

  function renderSummary() {
    const items = activeItems();
    const sub = subtotal(items);
    const shipping = completedOrder?.shippingPrice ?? shippingPrice();
    if (summaryItems) {
      const fragment = document.createDocumentFragment();
      items.forEach((item) => fragment.appendChild(renderSummaryItem(item)));
      summaryItems.replaceChildren(fragment);
    }
    if (subtotalEl) subtotalEl.textContent = formatPrice(sub);
    if (shippingEl) shippingEl.textContent = items.length ? formatPrice(shipping) : '0 €';
    if (totalEl) totalEl.textContent = formatPrice(items.length ? sub + shipping : 0);
  }

  function showEmptyState() {
    const items = readCart();
    const shouldShow = !items.length && !completedOrder;
    if (empty) empty.hidden = !shouldShow;
    if (form) form.hidden = shouldShow;
    document.querySelector('.checkout-progress')?.toggleAttribute('hidden', shouldShow);
    renderSummary();
  }

  function focusActiveStep() {
    const active = steps.find((step) => !step.hidden);
    const heading = active?.querySelector('h1,h2');
    if (!(heading instanceof HTMLElement)) return;
    heading.tabIndex = -1;
    requestAnimationFrame(() => heading.focus({preventScroll:true}));
  }

  function setStep(next, { focus = true } = {}) {
    currentStep = Math.max(1, Math.min(4, Number(next) || 1));
    steps.forEach((step) => {
      const active = Number(step.dataset.checkoutStep) === currentStep;
      step.hidden = !active;
      step.classList.toggle('is-active', active);
    });
    indicators.forEach((indicator) => {
      const index = Number(indicator.dataset.stepIndicator);
      indicator.classList.toggle('is-active', index === currentStep);
      indicator.classList.toggle('is-complete', index < currentStep);
      if (index === currentStep) indicator.setAttribute('aria-current', 'step');
      else indicator.removeAttribute('aria-current');
    });
    if (!reduceMotion.matches) window.scrollTo({ top:0, behavior:'smooth' });
    else window.scrollTo(0,0);
    if (focus) focusActiveStep();
  }

  function fieldError(name, message) {
    const field = form?.elements?.[name];
    const error = document.querySelector(`[data-error-for="${name}"]`);
    if (field) field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (error) error.textContent = message || '';
  }

  function validateContact() {
    if (!form) return false;
    const required = ['email','firstname','lastname','address','postal','city','country'];
    let valid = true;
    required.forEach((name) => {
      const field = form.elements[name];
      const value = String(field?.value || '').trim();
      let message = value ? '' : 'Ce champ est requis.';
      if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = 'Saisissez une adresse e-mail valide.';
      if (name === 'postal' && value && value.length < 3) message = 'Saisissez un code postal valide.';
      fieldError(name, message);
      if (message) valid = false;
    });
    if (!valid) form.querySelector('[aria-invalid="true"]')?.focus();
    return valid;
  }

  function saveDraft() {
    if (!form) return;
    const data = {};
    ['email','firstname','lastname','address','address2','postal','city','country','phone'].forEach((name) => {
      data[name] = String(form.elements[name]?.value || '');
    });
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(data)); } catch (_) {}
  }

  function restoreDraft() {
    if (!form) return;
    let data = null;
    try { data = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null'); } catch (_) {}
    if (!data) return;
    Object.entries(data).forEach(([name, value]) => {
      if (form.elements[name]) form.elements[name].value = String(value || '');
    });
  }

  function addressText() {
    if (!form) return '';
    const f = form.elements;
    return [f.firstname?.value, f.lastname?.value, f.address?.value, f.address2?.value, `${f.postal?.value || ''} ${f.city?.value || ''}`.trim(), f.country?.value]
      .filter((value) => String(value || '').trim())
      .join(', ');
  }

  function syncReview() {
    const address = addressText();
    const email = String(form?.elements?.email?.value || '');
    const recap = document.querySelector('[data-address-recap]');
    if (recap) recap.textContent = address;
    const contact = document.querySelector('[data-review-contact]');
    const addressReview = document.querySelector('[data-review-address]');
    const shippingReview = document.querySelector('[data-review-shipping]');
    if (contact) contact.textContent = email;
    if (addressReview) addressReview.textContent = address;
    if (shippingReview) shippingReview.textContent = shippingLabel();
    renderSummary();
  }

  function makeReference() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2,'0');
    const month = String(now.getMonth() + 1).padStart(2,'0');
    const suffix = Math.random().toString(36).slice(2,6).toUpperCase();
    return `DEMO-${day}${month}-${suffix}`;
  }

  function confirmOrder() {
    const items = readCart();
    if (!items.length || !demoConfirm?.checked) return;
    const email = String(form?.elements?.email?.value || '');
    completedOrder = {
      items:items.map((item) => ({...item})),
      subtotal:subtotal(items),
      shippingPrice:shippingPrice(),
      shipping:shippingLabel(),
      email,
      address:addressText(),
      reference:makeReference()
    };
    try {
      sessionStorage.setItem('lmm-last-demo-order', JSON.stringify(completedOrder));
      sessionStorage.removeItem(DRAFT_KEY);
      localStorage.setItem(CART_KEY, '[]');
    } catch (_) {}
    const ref = document.querySelector('[data-order-reference]');
    const emailEl = document.querySelector('[data-order-email]');
    if (ref) ref.textContent = completedOrder.reference;
    if (emailEl) emailEl.textContent = completedOrder.email;
    renderSummary();
    setStep(4);
    window.dispatchEvent(new CustomEvent('lmm:cart-change', { detail:{ items:[] } }));
  }

  document.querySelectorAll('[data-next-step]').forEach((button) => {
    button.addEventListener('click', () => {
      const next = Number(button.dataset.nextStep);
      if (currentStep === 1 && !validateContact()) return;
      saveDraft();
      syncReview();
      setStep(next);
    });
  });
  document.querySelectorAll('[data-prev-step]').forEach((button) => button.addEventListener('click', () => setStep(Number(button.dataset.prevStep))));

  form?.addEventListener('input', (event) => {
    const name = event.target?.name;
    if (name && event.target.getAttribute('aria-invalid') === 'true') fieldError(name, '');
    saveDraft();
  });
  form?.addEventListener('change', (event) => {
    if (event.target?.name === 'shipping') syncReview();
  });
  demoConfirm?.addEventListener('change', () => {
    if (confirmButton) confirmButton.disabled = !demoConfirm.checked;
  });
  confirmButton?.addEventListener('click', confirmOrder);
  form?.addEventListener('submit', (event) => event.preventDefault());

  restoreDraft();
  showEmptyState();
  syncReview();
  setStep(1,{focus:false});
  loadSharedEnhancements();
})();
