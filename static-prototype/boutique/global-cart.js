/* Shared global cart engine. Uses localStorage key `lmm-cart`. */
(() => {
  const STORAGE_KEY = 'lmm-cart';
  const body = document.body;
  if (!body) return;

  const formatPrice = (value) => `${Math.max(0, Number(value) || 0).toFixed(0)} €`;
  let pulseTimer = 0;
  let restoreFocusTo = null;

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
    if (pulse && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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

  function checkoutHref() {
    return body.dataset.productSlug ? '../checkout/' : 'checkout/';
  }

  function continueHref() {
    return body.dataset.productSlug ? '../' : './';
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
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
          <div class="global-cart__title"><strong id="global-cart-title">Panier</strong><span data-global-cart-summary aria-live="polite"></span></div>
          <button class="global-cart__close" type="button" data-global-cart-close>Fermer</button>
        </header>
        <div class="global-cart__body" data-global-cart-body></div>
        <footer class="global-cart__footer" data-global-cart-footer>
          <div class="global-cart__summary"><span>Sous-total</span><strong data-global-cart-subtotal>0 €</strong></div>
          <p class="global-cart__shipping">Livraison et taxes calculées à l’étape suivante.</p>
          <button class="global-cart__checkout" type="button" disabled>Passer à la commande</button>
          <span class="global-cart__prototype">Paiement de démonstration, aucune transaction réelle</span>
        </footer>
      </div>`;
    body.appendChild(dialog);

    dialog.querySelector('[data-global-cart-close]')?.addEventListener('click', close);
    dialog.querySelector('.global-cart__checkout')?.addEventListener('click', () => {
      if (!read().length) return;
      close({ restoreFocus:false });
      location.href = checkoutHref();
    });
    dialog.addEventListener('click', (event) => { if (event.target === dialog) close(); });
    dialog.addEventListener('close', () => {
      body.classList.remove('global-cart-open');
      document.querySelectorAll('.cart-trigger,.pdp-cart-trigger').forEach((trigger) => trigger.setAttribute('aria-expanded','false'));
    });
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      close();
    });
    dialog.addEventListener('click', handleDrawerClick);
    return dialog;
  }

  function renderEmpty(bodyEl) {
    bodyEl.replaceChildren();
    const wrapper = element('div','global-cart__empty');
    wrapper.append(
      element('span','', 'Votre sélection'),
      element('h2','', 'Le panier attend sa première pièce.'),
      element('p','', 'Explorez la Boutique et ajoutez les objets que vous souhaitez garder près de vous.')
    );
    const link = element('a','', 'Continuer la sélection');
    link.href = continueHref();
    wrapper.appendChild(link);
    bodyEl.appendChild(wrapper);
  }

  function makeQuantityButton(action, item, label) {
    const button = element('button','', label === 'Diminuer' ? '−' : '+');
    button.type = 'button';
    button.dataset.cartAction = action;
    button.dataset.cartId = item.id;
    button.setAttribute('aria-label', `${label} ${item.name}`);
    if (action === 'minus' && item.quantity <= 1) button.disabled = true;
    return button;
  }

  function renderItems(bodyEl, items) {
    bodyEl.replaceChildren();
    const list = element('div','global-cart__list');

    items.forEach((item) => {
      const article = element('article','global-cart__item');
      article.dataset.cartItem = item.id;

      const media = element('a','global-cart__media');
      media.href = productHref(item);
      media.setAttribute('aria-label', `Voir ${item.name}`);
      const image = document.createElement('img');
      image.src = item.image;
      image.alt = '';
      image.loading = 'lazy';
      image.decoding = 'async';
      media.appendChild(image);

      const info = element('div','global-cart__info');
      info.appendChild(element('p','global-cart__material', item.material));
      const name = element('a','global-cart__name', item.name);
      name.href = productHref(item);
      info.appendChild(name);
      info.appendChild(element('p','global-cart__unit', `${formatPrice(item.price)} l’unité`));

      const quantity = element('div','global-cart__quantity');
      quantity.setAttribute('aria-label', `Quantité pour ${item.name}`);
      quantity.appendChild(makeQuantityButton('minus', item, 'Diminuer'));
      const output = element('output','', String(item.quantity));
      output.setAttribute('aria-live','polite');
      quantity.appendChild(output);
      quantity.appendChild(makeQuantityButton('plus', item, 'Augmenter'));
      info.appendChild(quantity);

      const remove = element('button','global-cart__remove','Retirer');
      remove.type = 'button';
      remove.dataset.cartAction = 'remove';
      remove.dataset.cartId = item.id;
      remove.setAttribute('aria-label', `Retirer ${item.name} du panier`);
      info.appendChild(remove);

      article.append(media, info, element('strong','global-cart__line-price', formatPrice(item.price * item.quantity)));
      list.appendChild(article);
    });

    bodyEl.appendChild(list);
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
    if (checkout) checkout.disabled = safe.length === 0;

    if (!bodyEl) return;
    if (!safe.length) renderEmpty(bodyEl);
    else renderItems(bodyEl, safe);
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
    const active = document.activeElement;
    restoreFocusTo = active instanceof HTMLElement ? active : null;
    renderAll();
    if (!dialog.open) dialog.showModal();
    body.classList.add('global-cart-open');
    document.querySelectorAll('.cart-trigger,.pdp-cart-trigger').forEach((trigger) => trigger.setAttribute('aria-expanded','true'));
    requestAnimationFrame(() => dialog.querySelector('[data-global-cart-close]')?.focus());
  }

  function close({ restoreFocus = true } = {}) {
    const dialog = ensureDrawer();
    if (dialog.open) dialog.close();
    if (restoreFocus && restoreFocusTo?.isConnected) {
      const target = restoreFocusTo;
      restoreFocusTo = null;
      requestAnimationFrame(() => target.focus({preventScroll:true}));
    } else if (!restoreFocus) {
      restoreFocusTo = null;
    }
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
