/* Shared signature cursor for Boutique, PDPs and Checkout. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine = window.matchMedia('(pointer:fine) and (hover:hover)');
  const body = document.body;
  if (!body || body.classList.contains('has-brand-cursor')) return;

  let cursor = null;
  let dot = null;
  let ring = null;
  let label = null;
  let clientX = -120;
  let clientY = -120;
  let pointerX = -120;
  let pointerY = -120;
  let previousX = pointerX;
  let previousY = pointerY;
  let ringX = pointerX;
  let ringY = pointerY;
  let stretch = 1;
  let squash = 1;
  let angle = 0;
  let visible = false;
  let raf = 0;
  let enabled = false;
  let hostMotionUntil = 0;

  const nativeSelector = 'input:not([type="button"]):not([type="submit"]),textarea,select,option';
  const interactiveSelector = 'a,button,[role="button"],summary,label';
  const cardSelectors = ['.product-card','.related-card','.parallax-gallery__slide','.featured-piece__media'].join(',');

  function isLightSurface(target) {
    return Boolean(target.closest('.catalogue,.featured-piece,.universe-tabs,.pdp-buy-panel,.pdp-detail-copy,.pdp-related,.pdp-assurance,.checkout-flow,.checkout-header,.checkout-empty,.global-cart'));
  }

  function cardLabel(target) {
    const card = target.closest(cardSelectors);
    if (!card) return '';
    if (card.matches('.product-card,.related-card,.parallax-gallery__slide')) return 'Explorer';
    if (card.matches('.featured-piece__media')) return 'Voir';
    return '';
  }

  function setState(target) {
    if (!enabled || !(target instanceof Element) || !cursor || !label) return;
    const native = target.closest(nativeSelector);
    const card = target.closest(cardSelectors);
    const interactive = target.closest(interactiveSelector);
    cursor.classList.toggle('is-native',Boolean(native));
    cursor.classList.toggle('is-card',Boolean(card) && !native);
    cursor.classList.toggle('is-link',Boolean(interactive) && !card && !native);
    cursor.classList.toggle('is-light-surface',isLightSurface(target));
    label.textContent = card && !native ? cardLabel(target) : '';
  }

  function activeDialogFor(target) {
    if (target instanceof Element) {
      const direct = target.closest('dialog[open]');
      if (direct instanceof HTMLDialogElement) return direct;
    }
    const cart = document.querySelector('#global-cart[open]');
    return cart instanceof HTMLDialogElement ? cart : null;
  }

  function updatePointerCoordinates() {
    if (!cursor) return;
    const host = cursor.parentElement;
    if (host instanceof HTMLDialogElement) {
      const rect = host.getBoundingClientRect();
      pointerX = clientX - rect.left;
      pointerY = clientY - rect.top;
      return;
    }
    pointerX = clientX;
    pointerY = clientY;
  }

  function hostCursor(host, { trackTransition = false } = {}) {
    if (!cursor || !host || cursor.parentElement === host) {
      if (trackTransition) hostMotionUntil = performance.now() + 620;
      return;
    }

    host.appendChild(cursor);
    cursor.classList.toggle('is-top-layer', host instanceof HTMLDialogElement);
    if (trackTransition) hostMotionUntil = performance.now() + 620;
    updatePointerCoordinates();
    ringX = pointerX;
    ringY = pointerY;
    previousX = pointerX;
    previousY = pointerY;
    if (visible) request();
  }

  function syncCursorHost(target, options) {
    const dialog = activeDialogFor(target);
    hostCursor(dialog || body, options);
  }

  function animate() {
    raf = 0;
    if (!enabled || !visible || !dot || !ring) return;

    updatePointerCoordinates();
    ringX += (pointerX - ringX) * .16;
    ringY += (pointerY - ringY) * .16;
    const dx = pointerX - previousX;
    const dy = pointerY - previousY;
    const speed = Math.min(18,Math.hypot(dx,dy));
    const targetStretch = 1 + speed * .022;
    const targetSquash = 1 - Math.min(.18,speed * .008);
    stretch += (targetStretch - stretch) * .22;
    squash += (targetSquash - squash) * .22;
    if (Math.abs(dx) + Math.abs(dy) > .2) angle = Math.atan2(dy,dx) * 180 / Math.PI;
    dot.style.transform = `translate3d(${pointerX}px,${pointerY}px,0) translate3d(-50%,-50%,0)`;
    ring.style.transform = `translate3d(${ringX}px,${ringY}px,0) translate3d(-50%,-50%,0) rotate(${angle}deg) scaleX(${stretch}) scaleY(${squash})`;
    previousX += (pointerX - previousX) * .55;
    previousY += (pointerY - previousY) * .55;
    const moving = Math.abs(pointerX - ringX) > .08 || Math.abs(pointerY - ringY) > .08 || Math.abs(stretch - 1) > .008 || Math.abs(squash - 1) > .008;
    if (!moving) {
      stretch += (1 - stretch) * .4;
      squash += (1 - squash) * .4;
    }

    const trackingHostTransition = performance.now() < hostMotionUntil;
    if (moving || trackingHostTransition || Math.abs(stretch - 1) > .004 || Math.abs(squash - 1) > .004) {
      raf = requestAnimationFrame(animate);
    }
  }

  function request() {
    if (enabled && visible && !raf) raf = requestAnimationFrame(animate);
  }

  function mount() {
    if (cursor) return;
    cursor = document.createElement('div');
    cursor.className = 'brand-cursor';
    cursor.setAttribute('aria-hidden','true');
    cursor.innerHTML = '<span class="brand-cursor__dot"></span><span class="brand-cursor__ring"><span class="brand-cursor__label"></span></span>';
    body.appendChild(cursor);
    dot = cursor.querySelector('.brand-cursor__dot');
    ring = cursor.querySelector('.brand-cursor__ring');
    label = cursor.querySelector('.brand-cursor__label');
  }

  function syncCapability() {
    enabled = !reduce.matches && fine.matches;
    body.classList.toggle('has-brand-cursor',enabled);
    if (enabled) {
      mount();
      syncCursorHost(document.activeElement, { trackTransition:false });
    }
    if (!enabled && cursor) {
      visible = false;
      cursor.classList.remove('is-visible','is-card','is-link','is-pressed','is-native','is-light-surface','is-top-layer');
      if (cursor.parentElement !== body) body.appendChild(cursor);
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      hostMotionUntil = 0;
    }
  }

  window.addEventListener('pointermove',(event) => {
    if (!enabled) return;
    clientX = event.clientX;
    clientY = event.clientY;
    syncCursorHost(event.target);
    updatePointerCoordinates();
    if (!visible) {
      visible = true;
      ringX = pointerX;
      ringY = pointerY;
      previousX = pointerX;
      previousY = pointerY;
      cursor?.classList.add('is-visible');
    }
    setState(event.target);
    request();
  },{passive:true});

  window.addEventListener('pointerdown',() => { if (enabled) cursor?.classList.add('is-pressed'); },{passive:true});
  window.addEventListener('pointerup',() => cursor?.classList.remove('is-pressed'),{passive:true});
  document.addEventListener('pointerover',(event) => setState(event.target),{passive:true});
  document.addEventListener('pointerout',(event) => {
    if (event.relatedTarget) return;
    visible = false;
    cursor?.classList.remove('is-visible');
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  });

  window.addEventListener('lmm:cart-dialog-open',(event) => {
    if (!enabled || !cursor) return;
    const dialog = event.detail?.dialog;
    if (!(dialog instanceof HTMLDialogElement)) return;
    hostCursor(dialog, { trackTransition:true });
    cursor.classList.add('is-light-surface');
  });

  window.addEventListener('lmm:cart-dialog-close',() => {
    if (!cursor) return;
    hostCursor(body);
    cursor.classList.remove('is-top-layer','is-light-surface','is-card','is-link','is-native','is-pressed');
    hostMotionUntil = 0;
    visible = false;
    cursor.classList.remove('is-visible');
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  });

  document.addEventListener('visibilitychange',() => {
    if (document.visibilityState === 'hidden') {
      visible = false;
      cursor?.classList.remove('is-visible');
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }
  });

  reduce.addEventListener?.('change',syncCapability);
  fine.addEventListener?.('change',syncCapability);
  syncCapability();
})();
