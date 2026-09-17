/* Shared signature cursor for Boutique, PDPs and Checkout. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine = window.matchMedia('(pointer:fine) and (hover:hover)');
  const body = document.body;
  if (!body || body.classList.contains('has-brand-cursor')) return;

  const supportsPopoverLayer = typeof HTMLElement.prototype.showPopover === 'function';

  let cursor = null;
  let dot = null;
  let ring = null;
  let label = null;
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

  function isCursorLayerOpen() {
    if (!cursor || !supportsPopoverLayer) return false;
    try { return cursor.matches(':popover-open'); }
    catch (_) { return false; }
  }

  function showCursorLayer({ bringToFront = false } = {}) {
    if (!cursor || !supportsPopoverLayer) return;
    try {
      if (bringToFront && isCursorLayerOpen()) cursor.hidePopover();
      if (!isCursorLayerOpen()) cursor.showPopover();
    } catch (_) {}
  }

  function hideCursorLayer() {
    if (!cursor || !supportsPopoverLayer || !isCursorLayerOpen()) return;
    try { cursor.hidePopover(); } catch (_) {}
  }

  function animate() {
    raf = 0;
    if (!enabled || !visible || !dot || !ring) return;
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
    if (moving || Math.abs(stretch - 1) > .004 || Math.abs(squash - 1) > .004) raf = requestAnimationFrame(animate);
  }

  function request() {
    if (enabled && visible && !raf) raf = requestAnimationFrame(animate);
  }

  function mount() {
    if (cursor) return;
    cursor = document.createElement('div');
    cursor.className = 'brand-cursor';
    cursor.setAttribute('aria-hidden','true');
    if (supportsPopoverLayer) cursor.setAttribute('popover','manual');
    cursor.innerHTML = '<span class="brand-cursor__dot"></span><span class="brand-cursor__ring"><span class="brand-cursor__label"></span></span>';
    body.appendChild(cursor);
    dot = cursor.querySelector('.brand-cursor__dot');
    ring = cursor.querySelector('.brand-cursor__ring');
    label = cursor.querySelector('.brand-cursor__label');
  }

  function syncCapability() {
    enabled = !reduce.matches && fine.matches;
    body.classList.toggle('has-brand-cursor',enabled);
    body.classList.toggle('brand-cursor-native-dialog-fallback',enabled && !supportsPopoverLayer);

    if (enabled) {
      mount();
      showCursorLayer();
      return;
    }

    if (!cursor) return;
    visible = false;
    cursor.classList.remove('is-visible','is-card','is-link','is-pressed','is-native','is-light-surface','is-over-cart');
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    hideCursorLayer();
  }

  window.addEventListener('pointermove',(event) => {
    if (!enabled) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
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

  /* A modal <dialog> and its ::backdrop are rendered in the browser top layer.
     Re-open the cursor popover after showModal() so it becomes the newest top-layer
     entry and therefore paints above both the drawer and its backdrop blur. */
  window.addEventListener('lmm:cart-dialog-open',() => {
    if (!enabled || !cursor) return;
    cursor.classList.add('is-over-cart','is-light-surface');
    showCursorLayer({ bringToFront:true });
  });

  window.addEventListener('lmm:cart-dialog-close',() => {
    if (!cursor) return;
    cursor.classList.remove('is-over-cart','is-light-surface','is-card','is-link','is-native','is-pressed');
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
