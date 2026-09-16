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

  function loadStylesheetOnce(href, marker) {
    if (document.querySelector(`link[${marker}]`)) return;
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = href;
    style.setAttribute(marker, 'true');
    document.head.appendChild(style);
  }

  function loadScriptOnce(src, marker) {
    if (document.querySelector(`script[${marker}]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.setAttribute(marker, 'true');
    document.body.appendChild(script);
  }

  function loadSharedEnhancements(){
    loadStylesheetOnce('shared-brand-cursor.css', 'data-brand-cursor');
    loadScriptOnce('shared-brand-cursor.js', 'data-brand-cursor');
    loadStylesheetOnce('shared-a11y.css', 'data-shared-a11y');
    loadScriptOnce('shared-a11y.js', 'data-shared-a11y');
  }

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

  universeButtons.forEach((button) => button.addEventListener('click', () => {
    activeUniverse = button.dataset.universe || 'all';
    render();
  }));
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

  render();
  loadSharedEnhancements();

  loadScriptOnce('boutique-product-links.js', 'data-boutique-product-links-script');
})();
