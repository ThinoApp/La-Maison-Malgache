/* Shared signature cursor for Boutique, PDPs and Checkout. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine = window.matchMedia('(pointer:fine) and (hover:hover)');
  if (reduce.matches || !fine.matches) return;

  const body = document.body;
  if (!body || body.classList.contains('has-brand-cursor')) return;

  body.classList.add('has-brand-cursor');

  const cursor = document.createElement('div');
  cursor.className = 'brand-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<span class="brand-cursor__dot"></span><span class="brand-cursor__ring"><span class="brand-cursor__label"></span></span>';
  body.appendChild(cursor);

  const dot = cursor.querySelector('.brand-cursor__dot');
  const ring = cursor.querySelector('.brand-cursor__ring');
  const label = cursor.querySelector('.brand-cursor__label');

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

  const nativeSelector = 'input:not([type="button"]):not([type="submit"]),textarea,select,option';
  const interactiveSelector = 'a,button,[role="button"],summary,label';
  const cardSelectors = [
    '.product-card',
    '.related-card',
    '.parallax-gallery__slide',
    '.featured-piece__media',
    '.pdp-main-media',
    '.checkout-summary-item'
  ].join(',');

  function isLightSurface(target) {
    return Boolean(target.closest('.catalogue,.featured-piece,.universe-tabs,.pdp-buy-panel,.pdp-detail-copy,.pdp-related,.pdp-assurance,.checkout-flow,.checkout-header,.checkout-empty'));
  }

  function cardLabel(target) {
    const card = target.closest(cardSelectors);
    if (!card) return '';
    if (card.matches('.product-card,.related-card,.parallax-gallery__slide')) return 'Explorer';
    if (card.matches('.featured-piece__media,.pdp-main-media')) return 'Voir';
    if (card.matches('.checkout-summary-item')) return 'Pièce';
    return '';
  }

  function setState(target) {
    if (!(target instanceof Element)) return;
    const native = target.closest(nativeSelector);
    const card = target.closest(cardSelectors);
    const interactive = target.closest(interactiveSelector);

    cursor.classList.toggle('is-native', Boolean(native));
    cursor.classList.toggle('is-card', Boolean(card) && !native);
    cursor.classList.toggle('is-link', Boolean(interactive) && !card && !native);
    cursor.classList.toggle('is-light-surface', isLightSurface(target));
    label.textContent = card && !native ? cardLabel(target) : '';
  }

  function animate() {
    raf = 0;
    ringX += (pointerX - ringX) * .16;
    ringY += (pointerY - ringY) * .16;

    const dx = pointerX - previousX;
    const dy = pointerY - previousY;
    const speed = Math.min(18, Math.hypot(dx, dy));
    const targetStretch = 1 + speed * .022;
    const targetSquash = 1 - Math.min(.18, speed * .008);

    stretch += (targetStretch - stretch) * .22;
    squash += (targetSquash - squash) * .22;
    if (Math.abs(dx) + Math.abs(dy) > .2) angle = Math.atan2(dy, dx) * 180 / Math.PI;

    dot.style.transform = `translate3d(${pointerX}px,${pointerY}px,0) translate3d(-50%,-50%,0)`;
    ring.style.transform = `translate3d(${ringX}px,${ringY}px,0) translate3d(-50%,-50%,0) rotate(${angle}deg) scaleX(${stretch}) scaleY(${squash})`;

    previousX += (pointerX - previousX) * .55;
    previousY += (pointerY - previousY) * .55;

    const moving = Math.abs(pointerX - ringX) > .08 || Math.abs(pointerY - ringY) > .08 || Math.abs(stretch - 1) > .008 || Math.abs(squash - 1) > .008;
    if (!moving) {
      stretch += (1 - stretch) * .4;
      squash += (1 - squash) * .4;
    }
    if (visible && (moving || Math.abs(stretch - 1) > .004 || Math.abs(squash - 1) > .004)) raf = requestAnimationFrame(animate);
  }

  function request() {
    if (!raf) raf = requestAnimationFrame(animate);
  }

  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!visible) {
      visible = true;
      ringX = pointerX;
      ringY = pointerY;
      previousX = pointerX;
      previousY = pointerY;
      cursor.classList.add('is-visible');
    }
    setState(event.target);
    request();
  }, {passive:true});

  window.addEventListener('pointerdown', () => cursor.classList.add('is-pressed'), {passive:true});
  window.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'), {passive:true});
  document.addEventListener('pointerover', (event) => setState(event.target), {passive:true});
  document.addEventListener('pointerout', (event) => {
    if (event.relatedTarget) return;
    visible = false;
    cursor.classList.remove('is-visible');
  });
})();
