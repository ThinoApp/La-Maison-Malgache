/* Advanced boutique choreography: center focus, hero depth, shared product handoff. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = window.matchMedia('(min-width:1001px)').matches;
  const fine = window.matchMedia('(pointer:fine)').matches;
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
  let sharedRaf = 0;
  let sharedSourceRect = null;
  let sharedTargetRect = null;
  let recompositionTimer = 0;

  if (!body) return;

  function productLabel(card) {
    const name = card?.querySelector('h3')?.textContent?.trim() || 'Pièce';
    const material = card?.querySelector('.product-card__info p')?.textContent?.trim() || '';
    return { name, material };
  }

  const rail = document.createElement('div');
  rail.className = 'shop-focus-rail';
  rail.setAttribute('aria-hidden', 'true');
  rail.innerHTML = '<span class="shop-focus-rail__track"><span class="shop-focus-rail__fill"></span></span><span class="shop-focus-rail__copy"><strong class="shop-focus-rail__index">01</strong><span class="shop-focus-rail__name">Pièce</span><span class="shop-focus-rail__material"></span></span>';
  body.appendChild(rail);
  const railIndex = rail.querySelector('.shop-focus-rail__index');
  const railName = rail.querySelector('.shop-focus-rail__name');
  const railMaterial = rail.querySelector('.shop-focus-rail__material');

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
    if (reduce || !desktop || !catalogue) return;
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
      const c = r.top + r.height * .5;
      const d = Math.abs(c - centerY);
      const normalized = Math.min(1, d / Math.max(innerHeight * .72, 1));
      card.style.setProperty('--shop-focus', String((1 - normalized) * .9 + .1));
      if (d < bestDistance) {
        bestDistance = d;
        best = card;
      }
    });

    setActiveCard(best);
    const total = Math.max(1, catalogue.offsetHeight - innerHeight);
    const progressed = Math.min(1, Math.max(0, -rect.top / total));
    document.documentElement.style.setProperty('--catalogue-progress', String(progressed));
  }

  let focusRaf = 0;
  const requestFocus = () => {
    if (focusRaf) return;
    focusRaf = requestAnimationFrame(() => {
      focusRaf = 0;
      updateCatalogueFocus();
    });
  };

  window.addEventListener('scroll', requestFocus, { passive:true });
  window.addEventListener('resize', requestFocus, { passive:true });

  if (!reduce && fine && desktop && hero) {
    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / Math.max(rect.width, 1) - .5;
      const ny = (event.clientY - rect.top) / Math.max(rect.height, 1) - .5;
      const root = document.documentElement.style;
      root.setProperty('--shop-hero-media-x', `${(nx * 10).toFixed(2)}px`);
      root.setProperty('--shop-hero-media-y', `${(ny * 7).toFixed(2)}px`);
      root.setProperty('--shop-hero-copy-x', `${(-nx * 4.5).toFixed(2)}px`);
      root.setProperty('--shop-hero-copy-y', `${(-ny * 3.5).toFixed(2)}px`);
    }, { passive:true });
    hero.addEventListener('pointerleave', () => {
      const root = document.documentElement.style;
      root.setProperty('--shop-hero-media-x', '0px');
      root.setProperty('--shop-hero-media-y', '0px');
      root.setProperty('--shop-hero-copy-x', '0px');
      root.setProperty('--shop-hero-copy-y', '0px');
    }, { passive:true });
  }

  products.forEach((card) => {
    const media = card.querySelector('.product-card__media');
    const image = media?.querySelector('img');
    if (!media || !image || reduce || !fine) return;
    const echo = document.createElement('span');
    echo.className = 'product-card__echo';
    const clone = image.cloneNode(true);
    clone.removeAttribute('loading');
    clone.alt = '';
    echo.appendChild(clone);
    media.prepend(echo);

    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / Math.max(rect.width, 1) - .5;
      const ny = (event.clientY - rect.top) / Math.max(rect.height, 1) - .5;
      echo.style.setProperty('--shop-echo-x', `${(nx * 8).toFixed(2)}px`);
      echo.style.setProperty('--shop-echo-y', `${(ny * 5).toFixed(2)}px`);
    }, { passive:true });

    card.addEventListener('pointerleave', () => {
      echo.style.setProperty('--shop-echo-x', '0px');
      echo.style.setProperty('--shop-echo-y', '0px');
    }, { passive:true });
  });

  function triggerRecomposition() {
    if (reduce) return;
    body.classList.remove('shop-recomposing');
    void body.offsetWidth;
    body.classList.add('shop-recomposing');
    clearTimeout(recompositionTimer);
    recompositionTimer = window.setTimeout(() => body.classList.remove('shop-recomposing'), 620);
  }

  ['click','change','input'].forEach((eventName) => {
    document.addEventListener(eventName, (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest('.universe-tabs,.catalogue-tools,.filter-panel,#reset-filters,#empty-reset,[data-jump-universe]')) return;
      triggerRecomposition();
      requestFocus();
    }, { capture:true, passive:eventName === 'input' });
  });

  function updateHeaderState() {
    const threshold = hero ? hero.offsetHeight * .58 : 320;
    body.classList.toggle('shop-header-condensed', window.scrollY > threshold);
  }
  window.addEventListener('scroll', updateHeaderState, { passive:true });
  updateHeaderState();

  if (!reduce && desktop && featuredMedia && featuredImg && firstProductMedia) {
    const ghost = document.createElement('div');
    ghost.className = 'shop-shared-product';
    ghost.setAttribute('aria-hidden', 'true');
    const ghostImg = featuredImg.cloneNode(true);
    ghostImg.alt = '';
    ghost.appendChild(ghostImg);
    body.appendChild(ghost);

    function sharedRender() {
      sharedRaf = 0;
      if (!sharedSourceRect || !sharedTargetRect) return;
      const sourceNow = featuredMedia.getBoundingClientRect();
      const targetNow = firstProductMedia.getBoundingClientRect();
      const travelStart = innerHeight * .94;
      const travelEnd = innerHeight * .24;
      const raw = (travelStart - sourceNow.bottom) / Math.max(1, travelStart - travelEnd);
      const p = Math.min(1, Math.max(0, raw));
      const eased = p * p * (3 - 2 * p);

      const left = sourceNow.left + (targetNow.left - sourceNow.left) * eased;
      const top = Math.max(-innerHeight * .1, sourceNow.top + (targetNow.top - sourceNow.top) * eased);
      const width = sourceNow.width + (targetNow.width - sourceNow.width) * eased;
      const height = sourceNow.height + (targetNow.height - sourceNow.height) * eased;

      ghost.style.left = `${left}px`;
      ghost.style.top = `${top}px`;
      ghost.style.width = `${width}px`;
      ghost.style.height = `${height}px`;
      ghost.style.borderRadius = `${Math.max(0, 28 * (1 - eased))}px`;
      ghost.style.opacity = p > .03 && p < .99 ? '1' : '0';
      const active = p > .03 && p < .99;
      ghost.classList.toggle('is-active', active);
      body.classList.toggle('shop-shared-product-active', active);
    }

    const sharedObserver = new IntersectionObserver((entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      if (!visible) {
        ghost.classList.remove('is-active');
        body.classList.remove('shop-shared-product-active');
        return;
      }
      sharedSourceRect = featuredMedia.getBoundingClientRect();
      sharedTargetRect = firstProductMedia.getBoundingClientRect();
      if (!sharedRaf) sharedRaf = requestAnimationFrame(sharedRender);
    }, { rootMargin:'60% 0px 60% 0px', threshold:0 });
    sharedObserver.observe(featuredMedia);
    sharedObserver.observe(firstProductMedia);

    window.addEventListener('scroll', () => {
      if (!sharedRaf) sharedRaf = requestAnimationFrame(sharedRender);
    }, { passive:true });
    window.addEventListener('resize', () => {
      sharedSourceRect = featuredMedia.getBoundingClientRect();
      sharedTargetRect = firstProductMedia.getBoundingClientRect();
      if (!sharedRaf) sharedRaf = requestAnimationFrame(sharedRender);
    }, { passive:true });
  }

  const gridMutation = new MutationObserver(() => requestFocus());
  if (grid) gridMutation.observe(grid, { subtree:true, childList:true, attributes:true, attributeFilter:['hidden'] });

  requestFocus();
})();
