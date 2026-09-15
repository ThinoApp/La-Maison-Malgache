(() => {
  const products = [...document.querySelectorAll('[data-product]')];
  const editorial = document.querySelector('[data-editorial]');
  const universeButtons = [...document.querySelectorAll('[data-universe]')];
  const search = document.querySelector('#product-search');
  const sort = document.querySelector('#sort-products');
  const filterInputs = [...document.querySelectorAll('.filter-panel input[type="checkbox"]')];
  const reset = document.querySelector('#reset-filters');
  const emptyReset = document.querySelector('#empty-reset');
  const emptyState = document.querySelector('#empty-state');
  const resultCount = document.querySelector('#result-count');
  const filterCount = document.querySelector('#filter-count');
  const grid = document.querySelector('#product-grid');
  const jumpButtons = [...document.querySelectorAll('[data-jump-universe]')];
  const cartTrigger = document.querySelector('.cart-trigger');
  const cartPanel = document.querySelector('#cart-panel');
  const closeCart = document.querySelector('[data-close-cart]');

  let activeUniverse = new URLSearchParams(location.search).get('univers') || 'all';
  if (!universeButtons.some((button) => button.dataset.universe === activeUniverse)) activeUniverse = 'all';

  function selectedValues(name) {
    return filterInputs
      .filter((input) => input.name === name && input.checked)
      .map((input) => input.value);
  }

  function matches(product) {
    const materials = selectedValues('material');
    const availability = selectedValues('availability');
    const query = (search?.value || '').trim().toLowerCase();

    const universeMatch = activeUniverse === 'all' || product.dataset.univers === activeUniverse;
    const materialMatch = !materials.length || materials.includes(product.dataset.material);
    const availabilityMatch = !availability.length || availability.includes(product.dataset.availability);
    const searchMatch = !query || (product.dataset.name || '').toLowerCase().includes(query);

    return universeMatch && materialMatch && availabilityMatch && searchMatch;
  }

  function sortVisible() {
    if (!grid) return;
    const mode = sort?.value || 'selection';
    const ordered = [...products].sort((a, b) => {
      if (mode === 'price-asc') return Number(a.dataset.price) - Number(b.dataset.price);
      if (mode === 'price-desc') return Number(b.dataset.price) - Number(a.dataset.price);
      if (mode === 'new') return Number(b.dataset.rank) - Number(a.dataset.rank);
      return Number(a.dataset.rank) - Number(b.dataset.rank);
    });

    ordered.forEach((product) => grid.appendChild(product));
    if (editorial) {
      const visible = ordered.filter((product) => !product.hidden);
      if (visible.length >= 4) {
        grid.insertBefore(editorial, visible[Math.min(4, visible.length - 1)]);
        editorial.hidden = false;
      } else {
        editorial.hidden = true;
      }
    }
  }

  function updateUrl() {
    const url = new URL(location.href);
    if (activeUniverse === 'all') url.searchParams.delete('univers');
    else url.searchParams.set('univers', activeUniverse);
    history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }

  function render() {
    let visibleCount = 0;
    products.forEach((product) => {
      const visible = matches(product);
      product.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    sortVisible();

    if (resultCount) resultCount.textContent = String(visibleCount);
    if (emptyState) emptyState.hidden = visibleCount !== 0;

    const appliedFilters = filterInputs.filter((input) => input.checked).length;
    if (filterCount) filterCount.textContent = String(appliedFilters);

    universeButtons.forEach((button) => {
      const active = button.dataset.universe === activeUniverse;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    updateUrl();
  }

  function resetAll() {
    activeUniverse = 'all';
    if (search) search.value = '';
    filterInputs.forEach((input) => { input.checked = false; });
    if (sort) sort.value = 'selection';
    render();
  }

  universeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeUniverse = button.dataset.universe || 'all';
      render();
    });
  });

  filterInputs.forEach((input) => input.addEventListener('change', render));
  search?.addEventListener('input', render);
  sort?.addEventListener('change', render);
  reset?.addEventListener('click', resetAll);
  emptyReset?.addEventListener('click', resetAll);

  jumpButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeUniverse = button.dataset.jumpUniverse || 'all';
      filterInputs.forEach((input) => { input.checked = false; });
      if (search) search.value = '';
      render();
      document.querySelector('#catalogue')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  cartTrigger?.addEventListener('click', () => {
    if (!cartPanel) return;
    cartPanel.showModal();
    cartTrigger.setAttribute('aria-expanded', 'true');
  });

  closeCart?.addEventListener('click', () => {
    cartPanel?.close();
    cartTrigger?.setAttribute('aria-expanded', 'false');
  });

  cartPanel?.addEventListener('click', (event) => {
    if (event.target !== cartPanel) return;
    cartPanel.close();
    cartTrigger?.setAttribute('aria-expanded', 'false');
  });

  cartPanel?.addEventListener('close', () => cartTrigger?.setAttribute('aria-expanded', 'false'));

  function syncCartCount() {
    let items = [];
    try { items = JSON.parse(localStorage.getItem('lmm-cart') || '[]'); } catch (_) {}
    const count = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const countEl = cartTrigger?.querySelector('span');
    if (countEl) countEl.textContent = String(count);
  }

  function goToAmbato(source) {
    const media = source?.querySelector?.('.product-card__media') || document.querySelector('.featured-piece__media');
    const img = media?.querySelector('img');
    if (media && img) {
      const rect = media.getBoundingClientRect();
      try {
        sessionStorage.setItem('lmm-product-transition', JSON.stringify({
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          radius: parseFloat(getComputedStyle(media).borderRadius) || 0,
          image: img.currentSrc || img.src,
          time: Date.now()
        }));
      } catch (_) {}
    }
    location.href = 'vase-ambato/';
  }

  const ambatoCard = products.find((product) => product.dataset.rank === '1');
  if (ambatoCard) {
    ambatoCard.setAttribute('role', 'link');
    ambatoCard.setAttribute('tabindex', '0');
    ambatoCard.setAttribute('aria-label', 'Voir la fiche du Vase Ambato');
    ambatoCard.style.cursor = 'pointer';
    ambatoCard.addEventListener('click', () => goToAmbato(ambatoCard));
    ambatoCard.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        goToAmbato(ambatoCard);
      }
    });
  }

  const featuredLink = document.querySelector('.featured-piece__copy .shop-link');
  featuredLink?.setAttribute('href', 'vase-ambato/');
  if (featuredLink) featuredLink.textContent = 'Découvrir la pièce';
  featuredLink?.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    goToAmbato(document.querySelector('.featured-piece'));
  });

  syncCartCount();
  window.addEventListener('pageshow', syncCartCount);
  render();
})();
