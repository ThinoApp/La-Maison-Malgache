/* Advanced boutique choreography: center focus, hero depth, shared product handoff. */
(() => {
  const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopMq = window.matchMedia('(min-width:1001px)');
  const fineMq = window.matchMedia('(pointer:fine) and (hover:hover)');
  const body = document.body;
  const hero = document.querySelector('.shop-hero');
  const featuredMedia = document.querySelector('.featured-piece__media');
  const featuredImg = featuredMedia?.querySelector('img');
  const catalogue = document.querySelector('#catalogue');
  const grid = document.querySelector('#product-grid');
  const products = [...document.querySelectorAll('[data-product]')];
  const firstProduct = products.find((item) => item.dataset.rank === '1') || products[0];
  const firstProductMedia = firstProduct?.querySelector('.product-card__media');
  let activeCard = null;
  let focusRaf = 0;
  let sharedRaf = 0;
  let recompositionTimer = 0;
  let pageVisible = document.visibilityState !== 'hidden';
  if (!body) return;

  const motionAllowed = () => !reduceMq.matches && desktopMq.matches;
  const pointerAllowed = () => motionAllowed() && fineMq.matches;

  function productLabel(card) {
    return {
      name:card?.querySelector('h3')?.textContent?.trim() || 'Pièce',
      material:card?.querySelector('.product-card__info p')?.textContent?.trim() || ''
    };
  }

  const rail = document.createElement('div');
  rail.className = 'shop-focus-rail';
  rail.setAttribute('aria-hidden', 'true');
  rail.innerHTML = '<span class="shop-focus-rail__track"><span class="shop-focus-rail__fill"></span></span><span class="shop-focus-rail__copy"><strong class="shop-focus-rail__index">01</strong><span class="shop-focus-rail__name">Pièce</span><span class="shop-focus-rail__material"></span></span>';
  body.appendChild(rail);
  const railIndex = rail.querySelector('.shop-focus-rail__index');
  const railName = rail.querySelector('.shop-focus-rail__name');
  const railMaterial = rail.querySelector('.shop-focus-rail__material');

  function clearFocusStates() {
    products.forEach((card) => card.classList.remove('is-shop-focus','is-shop-near'));
    activeCard = null;
    body.classList.remove('shop-catalogue-active');
    document.documentElement.style.setProperty('--catalogue-progress','0');
  }

  function setActiveCard(card) {
    if (!card || card === activeCard) return;
    activeCard?.classList.remove('is-shop-focus');
    activeCard = card;
    activeCard.classList.add('is-shop-focus');
    const visible = products.filter((item) => !item.hidden);
    const index = Math.max(0, visible.indexOf(card));
    const label = productLabel(card);
    if (railIndex) railIndex.textContent = String(index + 1).padStart(2, '0');
    if (railName) railName.textContent = label.name;
    if (railMaterial) railMaterial.textContent = label.material;
  }

  function updateCatalogueFocus() {
    if (!pageVisible || !motionAllowed() || !catalogue) {
      clearFocusStates();
      return;
    }
    const rect = catalogue.getBoundingClientRect();
    const active = rect.top < innerHeight * .82 && rect.bottom > innerHeight * .22;
    body.classList.toggle('shop-catalogue-active', active);
    if (!active) return;

    const visible = products.filter((item) => !item.hidden);
    if (!visible.length) return;
    const centerY = innerHeight * .53;
    let best = visible[0];
    let bestDistance = Infinity;

    visible.forEach((card) => {
      const r = card.getBoundingClientRect();
      const distance = Math.abs(r.top + r.height * .5 - centerY);
      card.classList.toggle('is-shop-near', distance < innerHeight * .48);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = card;
      }
    });
    setActiveCard(best);
    const total = Math.max(1, catalogue.offsetHeight - innerHeight);
    document.documentElement.style.setProperty('--catalogue-progress', String(Math.min(1, Math.max(0, -rect.top / total))));
  }

  const requestFocus = () => {
    if (!pageVisible || focusRaf) return;
    focusRaf = requestAnimationFrame(() => { focusRaf = 0; updateCatalogueFocus(); });
  };
  window.addEventListener('scroll', requestFocus, {passive:true});
  window.addEventListener('resize', requestFocus, {passive:true});

  if (hero) {
    hero.addEventListener('pointermove', (event) => {
      if (!pageVisible || !pointerAllowed()) return;
      const rect = hero.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / Math.max(rect.width, 1) - .5;
      const ny = (event.clientY - rect.top) / Math.max(rect.height, 1) - .5;
      const root = document.documentElement.style;
      root.setProperty('--shop-hero-media-x', `${(nx * 10).toFixed(2)}px`);
      root.setProperty('--shop-hero-media-y', `${(ny * 7).toFixed(2)}px`);
      root.setProperty('--shop-hero-copy-x', `${(-nx * 4.5).toFixed(2)}px`);
      root.setProperty('--shop-hero-copy-y', `${(-ny * 3.5).toFixed(2)}px`);
    }, {passive:true});
    hero.addEventListener('pointerleave', resetHeroDepth, {passive:true});
  }

  function resetHeroDepth() {
    const root = document.documentElement.style;
    root.setProperty('--shop-hero-media-x','0px');
    root.setProperty('--shop-hero-media-y','0px');
    root.setProperty('--shop-hero-copy-x','0px');
    root.setProperty('--shop-hero-copy-y','0px');
  }

  products.forEach((card) => {
    const media = card.querySelector('.product-card__media');
    const image = media?.querySelector('img');
    if (!media || !image) return;
    let echo = null;
    const ensureEcho = () => {
      if (echo || !pointerAllowed()) return echo;
      echo = document.createElement('span');
      echo.className = 'product-card__echo';
      const clone = image.cloneNode(true);
      clone.removeAttribute('loading');
      clone.alt = '';
      echo.appendChild(clone);
      media.prepend(echo);
      return echo;
    };
    card.addEventListener('pointerenter', ensureEcho, {passive:true});
    card.addEventListener('pointermove', (event) => {
      if (!pageVisible || !pointerAllowed()) return;
      const layer = ensureEcho();
      if (!layer) return;
      const rect = card.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / Math.max(rect.width, 1) - .5;
      const ny = (event.clientY - rect.top) / Math.max(rect.height, 1) - .5;
      layer.style.setProperty('--shop-echo-x', `${(nx * 8).toFixed(2)}px`);
      layer.style.setProperty('--shop-echo-y', `${(ny * 5).toFixed(2)}px`);
    }, {passive:true});
    card.addEventListener('pointerleave', () => {
      echo?.style.setProperty('--shop-echo-x','0px');
      echo?.style.setProperty('--shop-echo-y','0px');
    }, {passive:true});
  });

  function triggerRecomposition() {
    if (reduceMq.matches) return;
    body.classList.remove('shop-recomposing');
    void body.offsetWidth;
    body.classList.add('shop-recomposing');
    clearTimeout(recompositionTimer);
    recompositionTimer = window.setTimeout(() => body.classList.remove('shop-recomposing'), 620);
  }
  ['click','change','input'].forEach((eventName) => {
    document.addEventListener(eventName, (event) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest('.universe-tabs,.catalogue-tools,.filter-panel,#reset-filters,#empty-reset,[data-jump-universe]')) return;
      triggerRecomposition();
      requestFocus();
    }, {capture:true,passive:eventName === 'input'});
  });

  function updateHeaderState() {
    const threshold = hero ? hero.offsetHeight * .58 : 320;
    body.classList.toggle('shop-header-condensed', window.scrollY > threshold);
  }
  window.addEventListener('scroll', updateHeaderState, {passive:true});
  updateHeaderState();

  let ghost = null;
  if (featuredMedia && featuredImg && firstProductMedia && 'IntersectionObserver' in window) {
    ghost = document.createElement('div');
    ghost.className = 'shop-shared-product';
    ghost.setAttribute('aria-hidden','true');
    const ghostImg = featuredImg.cloneNode(true);
    ghostImg.alt = '';
    ghost.appendChild(ghostImg);
    body.appendChild(ghost);

    function sharedRender() {
      sharedRaf = 0;
      if (!pageVisible || !motionAllowed()) {
        ghost.classList.remove('is-active');
        body.classList.remove('shop-shared-product-active');
        return;
      }
      const sourceNow = featuredMedia.getBoundingClientRect();
      const targetNow = firstProductMedia.getBoundingClientRect();
      const travelStart = innerHeight * .94;
      const travelEnd = innerHeight * .24;
      const raw = (travelStart - sourceNow.bottom) / Math.max(1, travelStart - travelEnd);
      const p = Math.min(1, Math.max(0, raw));
      const eased = p * p * (3 - 2 * p);
      ghost.style.left = `${sourceNow.left + (targetNow.left - sourceNow.left) * eased}px`;
      ghost.style.top = `${Math.max(-innerHeight * .1, sourceNow.top + (targetNow.top - sourceNow.top) * eased)}px`;
      ghost.style.width = `${sourceNow.width + (targetNow.width - sourceNow.width) * eased}px`;
      ghost.style.height = `${sourceNow.height + (targetNow.height - sourceNow.height) * eased}px`;
      ghost.style.borderRadius = `${Math.max(0,28 * (1 - eased))}px`;
      const active = p > .03 && p < .99;
      ghost.classList.toggle('is-active',active);
      body.classList.toggle('shop-shared-product-active',active);
    }

    const sharedObserver = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) {
        ghost.classList.remove('is-active');
        body.classList.remove('shop-shared-product-active');
        return;
      }
      if (!sharedRaf) sharedRaf = requestAnimationFrame(sharedRender);
    }, {rootMargin:'60% 0px 60% 0px',threshold:0});
    sharedObserver.observe(featuredMedia);
    sharedObserver.observe(firstProductMedia);
    window.addEventListener('scroll', () => { if (pageVisible && !sharedRaf) sharedRaf = requestAnimationFrame(sharedRender); }, {passive:true});
    window.addEventListener('resize', () => { if (pageVisible && !sharedRaf) sharedRaf = requestAnimationFrame(sharedRender); }, {passive:true});
  }

  if ('MutationObserver' in window && grid) {
    new MutationObserver(requestFocus).observe(grid,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden']});
  }

  function syncCapabilities() {
    resetHeroDepth();
    if (!motionAllowed()) {
      clearFocusStates();
      ghost?.classList.remove('is-active');
      body.classList.remove('shop-shared-product-active');
    } else requestFocus();
  }
  reduceMq.addEventListener?.('change',syncCapabilities);
  desktopMq.addEventListener?.('change',syncCapabilities);
  fineMq.addEventListener?.('change',syncCapabilities);

  document.addEventListener('visibilitychange', () => {
    pageVisible = document.visibilityState !== 'hidden';
    if (!pageVisible) {
      if (focusRaf) cancelAnimationFrame(focusRaf);
      if (sharedRaf) cancelAnimationFrame(sharedRaf);
      focusRaf = sharedRaf = 0;
    } else {
      requestFocus();
      updateHeaderState();
    }
  });

  requestFocus();
})();
