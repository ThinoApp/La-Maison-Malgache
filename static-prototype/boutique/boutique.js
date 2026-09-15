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
    return filterInputs.filter((input) => input.name === name && input.checked).map((input) => input.value);
  }

  function matches(product) {
    const materials = selectedValues('material');
    const availability = selectedValues('availability');
    const query = (search?.value || '').trim().toLowerCase();
    return (activeUniverse === 'all' || product.dataset.univers === activeUniverse)
      && (!materials.length || materials.includes(product.dataset.material))
      && (!availability.length || availability.includes(product.dataset.availability))
      && (!query || (product.dataset.name || '').toLowerCase().includes(query));
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
      } else editorial.hidden = true;
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
      product.hidden = !matches(product);
      if (!product.hidden) visibleCount += 1;
    });
    sortVisible();
    if (resultCount) resultCount.textContent = String(visibleCount);
    if (emptyState) emptyState.hidden = visibleCount !== 0;
    if (filterCount) filterCount.textContent = String(filterInputs.filter((input) => input.checked).length);
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

  universeButtons.forEach((button) => button.addEventListener('click', () => { activeUniverse = button.dataset.universe || 'all'; render(); }));
  filterInputs.forEach((input) => input.addEventListener('change', render));
  search?.addEventListener('input', render);
  sort?.addEventListener('change', render);
  reset?.addEventListener('click', resetAll);
  emptyReset?.addEventListener('click', resetAll);

  jumpButtons.forEach((button) => button.addEventListener('click', () => {
    activeUniverse = button.dataset.jumpUniverse || 'all';
    filterInputs.forEach((input) => { input.checked = false; });
    if (search) search.value = '';
    render();
    document.querySelector('#catalogue')?.scrollIntoView({ behavior:'smooth', block:'start' });
  }));

  cartTrigger?.addEventListener('click', () => { if (cartPanel) { cartPanel.showModal(); cartTrigger.setAttribute('aria-expanded','true'); } });
  closeCart?.addEventListener('click', () => { cartPanel?.close(); cartTrigger?.setAttribute('aria-expanded','false'); });
  cartPanel?.addEventListener('click', (event) => { if (event.target === cartPanel) { cartPanel.close(); cartTrigger?.setAttribute('aria-expanded','false'); } });
  cartPanel?.addEventListener('close', () => cartTrigger?.setAttribute('aria-expanded','false'));

  function syncCartCount() {
    let items = [];
    try { items = JSON.parse(localStorage.getItem('lmm-cart') || '[]'); } catch (_) {}
    const count = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const countEl = cartTrigger?.querySelector('span');
    if (countEl) countEl.textContent = String(count);
  }

  const linksStyle = document.createElement('link');
  linksStyle.rel = 'stylesheet';
  linksStyle.href = 'boutique-product-links.css';
  document.head.appendChild(linksStyle);

  render();
  syncCartCount();
  window.addEventListener('pageshow', syncCartCount);

  const linksScript = document.createElement('script');
  linksScript.src = 'boutique-product-links.js';
  linksScript.defer = true;
  document.body.appendChild(linksScript);
})();
