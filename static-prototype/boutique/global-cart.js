/* Shared global cart engine. Uses localStorage key `lmm-cart`. */
(() => {
  const STORAGE_KEY = 'lmm-cart';
  const body = document.body;
  if (!body) return;

  const formatPrice = (value) => `${Math.max(0, Number(value) || 0).toFixed(0)} €`;
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#039;'}[char]));
  let pulseTimer = 0;

  function normalize(items) {
    if (!Array.isArray(items)) return [];
    return items
      .filter((item) => item && item.id && Number(item.quantity) > 0)
      .map((item) => ({
        id:String(item.id),
        name:String(item.name || item.id),
        material:String(item.material || ''),
        price:Math.max(0, Number(item.price) || 0),
        image:String(item.image || ''),
        quantity:Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 1)))
      }));
  }

  function read() {
    try { return normalize(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')); }
    catch (_) { return []; }
  }

  function write(items, { pulse = true } = {}) {
    const next = normalize(items);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (_) {}
    renderAll(next);
    window.dispatchEvent(new CustomEvent('lmm:cart-change', { detail:{ items:next } }));
    if (pulse) {
      body.classList.remove('global-cart-count-pulse');
      void body.offsetWidth;
      body.classList.add('global-cart-count-pulse');
      clearTimeout(pulseTimer);
      pulseTimer = setTimeout(() => body.classList.remove('global-cart-count-pulse'), 430);
    }
    return next;
  }

  function count(items = read()) {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  function subtotal(items = read()) {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function productHref(item) {
    const inProduct = Boolean(body.dataset.productSlug);
    return inProduct ? `../${encodeURIComponent(item.id)}/` : `${encodeURIComponent(item.id)}/`;
  }

  function ensureDrawer() {
    let dialog = document.querySelector('#global-cart');
    if (dialog) return dialog;

    document.querySelectorAll('#cart-panel,#pdp-cart').forEach((legacy) => legacy.remove());

    dialog = document.createElement('dialog');
    dialog.id = 'global-cart';
    dialog.className = 'global-cart';
    dialog.setAttribute('aria-labelledby', 'global-cart-title');
    dialog.innerHTML = `
      <div class="global-cart__shell">
        <header class="global-cart__head">
          <div class="global-cart__title"><strong id="global-cart-title">Panier</strong><span data-global-cart-summary></span></div>
          <button class="global-cart__close" type="button" data-global-cart-close>Fermer</button>
        </header>
        <div class="global-cart__body" data-global-cart-body></div>
        <footer class="global-cart__footer" data-global-cart-footer>
          <div class="global-cart__summary"><span>Sous-total</span><strong data-global-cart-subtotal>0 €</strong></div>
          <p class="global-cart__shipping">Livraison et taxes calculées à l’étape suivante.</p>
          <button class="global-cart__checkout" type="button" disabled>Passer à la commande</button>
          <span class="global-cart__prototype">Checkout à connecter dans la prochaine étape</span>
        </footer>
      </div>`;
    body.appendChild(dialog);

    dialog.querySelector('[data-global-cart-close]')?.addEventListener('click', close);
    dialog.addEventListener('click', (event) => { if (event.target === dialog) close(); });
    dialog.addEventListener('close', () => {
      body.classList.remove('global-cart-open');
      document.querySelectorAll('.cart-trigger,.pdp-cart-trigger').forEach((trigger) => trigger.setAttribute('aria-expanded','false'));
    });
    dialog.addEventListener('cancel', () => body.classList.remove('global-cart-open'));
    dialog.addEventListener('click', handleDrawerClick);
    return dialog;
  }

  function renderAll(items = read()) {
    const safe = normalize(items);
    const itemCount = count(safe);
    document.querySelectorAll('[data-cart-count],.cart-trigger > span,.pdp-cart-trigger > span').forEach((el) => { el.textContent = String(itemCount); });

    const dialog = ensureDrawer();
    const bodyEl = dialog.querySelector('[data-global-cart-body]');
    const summaryEl = dialog.querySelector('[data-global-cart-summary]');
    const subtotalEl = dialog.querySelector('[data-global-cart-subtotal]');
    const checkout = dialog.querySelector('.global-cart__checkout');
    if (summaryEl) summaryEl.textContent = itemCount ? `${itemCount} ${itemCount > 1 ? 'articles' : 'article'}` : 'Vide';
    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal(safe));
    if (checkout) checkout.disabled = true;

    if (!bodyEl) return;
    if (!safe.length) {
      bodyEl.innerHTML = `<div class="global-cart__empty"><span>Votre sélection</span><h2>Le panier attend sa première pièce.</h2><p>Explorez la Boutique et ajoutez les objets que vous souhaitez garder près de vous.</p><a href="${body.dataset.productSlug ? '../' : './'}">Continuer la sélection</a></div>`;
      return;
    }

    bodyEl.innerHTML = `<div class="global-cart__list">${safe.map((item) => `
      <article class="global-cart__item" data-cart-item="${esc(item.id)}">
        <a class="global-cart__media" href="${esc(productHref(item))}" aria-label="Voir ${esc(item.name)}"><img src="${esc(item.image)}" alt="" loading="lazy" decoding="async"></a>
        <div class="global-cart__info">
          <p class="global-cart__material">${esc(item.material)}</p>
          <a class="global-cart__name" href="${esc(productHref(item))}">${esc(item.name)}</a>
          <p class="global-cart__unit">${esc(formatPrice(item.price))} l’unité</p>
          <div class="global-cart__quantity" aria-label="Quantité pour ${esc(item.name)}">
            <button type="button" data-cart-action="minus" data-cart-id="${esc(item.id)}" aria-label="Diminuer ${esc(item.name)}"${item.quantity <= 1 ? ' disabled' : ''}>−</button>
            <output>${item.quantity}</output>
            <button type="button" data-cart-action="plus" data-cart-id="${esc(item.id)}" aria-label="Augmenter ${esc(item.name)}">+</button>
          </div>
          <button class="global-cart__remove" type="button" data-cart-action="remove" data-cart-id="${esc(item.id)}">Retirer</button>
        </div>
        <strong class="global-cart__line-price">${esc(formatPrice(item.price * item.quantity))}</strong>
      </article>`).join('')}</div>`;
  }

  function mutate(id, mode) {
    const items = read();
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return items;
    if (mode === 'plus') items[index].quantity = Math.min(99, items[index].quantity + 1);
    if (mode === 'minus') items[index].quantity = Math.max(1, items[index].quantity - 1);
    if (mode === 'remove') items.splice(index, 1);
    return write(items);
  }

  function handleDrawerClick(event) {
    const button = event.target instanceof Element ? event.target.closest('[data-cart-action]') : null;
    if (!button) return;
    const id = button.getAttribute('data-cart-id') || '';
    const action = button.getAttribute('data-cart-action') || '';
    const item = button.closest('[data-cart-item]');
    if (action === 'remove' && item && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const animation = item.animate([{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX(26px)'}],{duration:240,easing:'ease-in',fill:'forwards'});
      animation.finished.then(() => mutate(id, action)).catch(() => mutate(id, action));
      return;
    }
    mutate(id, action);
  }

  function open() {
    const dialog = ensureDrawer();
    renderAll();
    if (!dialog.open) dialog.showModal();
    body.classList.add('global-cart-open');
    document.querySelectorAll('.cart-trigger,.pdp-cart-trigger').forEach((trigger) => trigger.setAttribute('aria-expanded','true'));
  }

  function close() {
    const dialog = ensureDrawer();
    if (dialog.open) dialog.close();
  }

  function add(product, quantity = 1) {
    if (!product?.id) return read();
    const items = read();
    const q = Math.max(1, Math.min(99, Math.floor(Number(quantity) || 1)));
    const existing = items.find((item) => item.id === String(product.id));
    if (existing) existing.quantity = Math.min(99, existing.quantity + q);
    else items.push({
      id:String(product.id),
      name:String(product.name || product.id),
      material:String(product.material || ''),
      price:Math.max(0, Number(product.price) || 0),
      image:String(product.image || ''),
      quantity:q
    });
    return write(items);
  }

  function bindTriggers() {
    document.querySelectorAll('.cart-trigger,.pdp-cart-trigger').forEach((trigger) => {
      trigger.setAttribute('aria-controls','global-cart');
      if (trigger.dataset.globalCartBound === 'true') return;
      trigger.dataset.globalCartBound = 'true';
      trigger.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        open();
      }, true);
    });
  }

  window.LMM_CART = { read, write, count, subtotal, add, open, close, render:renderAll };
  ensureDrawer();
  bindTriggers();
  renderAll();
  window.addEventListener('pageshow', () => { bindTriggers(); renderAll(); });
  window.addEventListener('storage', (event) => { if (event.key === STORAGE_KEY) renderAll(); });
})();
