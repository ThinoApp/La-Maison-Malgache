/* Boutique interaction choreography: reveals, active rail, FLIP filtering. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;
  const grid = document.querySelector('#product-grid');
  const products = [...document.querySelectorAll('[data-product]')];
  const tabs = document.querySelector('.universe-tabs');
  const tabButtons = [...document.querySelectorAll('.universe-tabs [data-universe]')];

  const kineticTargets = [
    document.querySelector('.shop-hero h1'),
    document.querySelector('.featured-piece h2'),
    document.querySelector('.singular-story h2')
  ].filter(Boolean);

  function splitWords(el, seed = 0) {
    if (!el || el.dataset.shopKinetic === 'true') return;
    const label = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (!label) return;
    el.dataset.shopKinetic = 'true';
    el.setAttribute('aria-label', label);

    let index = 0;
    [...el.childNodes].forEach((node) => {
      if (node.nodeType !== Node.TEXT_NODE) return;
      const parts = node.nodeValue.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      parts.forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
          return;
        }
        const span = document.createElement('span');
        span.className = 'shop-kinetic-word';
        span.setAttribute('aria-hidden', 'true');
        span.textContent = part;
        const direction = ((index + seed) % 2 ? 1 : -1);
        span.style.setProperty('--word-in-x', `${direction * (8 + ((index + seed) % 3) * 5)}px`);
        span.style.setProperty('--word-in-y', `${14 + ((index + seed) % 4) * 5}px`);
        span.style.setProperty('--word-in-r', `${direction * (0.5 + ((index + seed) % 3) * .35)}deg`);
        span.style.setProperty('--word-delay', `${120 + index * 42}ms`);
        frag.appendChild(span);
        index += 1;
      });
      node.replaceWith(frag);
    });
  }

  if (!reduce) kineticTargets.forEach((target, index) => splitWords(target, index * 2));

  const revealTargets = [
    ['.featured-piece__media', 'left'],
    ['.featured-piece__copy', 'right'],
    ['.catalogue-head', 'up'],
    ['.catalogue-note', 'up'],
    ['.singular-story__copy', 'left'],
    ['.singular-story__media', 'right']
  ];

  revealTargets.forEach(([selector, direction]) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.dataset.shopReveal = direction;
    });
  });

  document.querySelectorAll('.product-card').forEach((card, index) => {
    card.dataset.shopReveal = 'up';
    card.style.setProperty('--shop-reveal-delay', `${Math.min(index * 55, 260)}ms`);
  });
  document.querySelectorAll('.shop-assurance>div').forEach((item, index) => {
    item.dataset.shopReveal = 'up';
    item.style.setProperty('--shop-reveal-delay', `${index * 70}ms`);
  });

  if (reduce || !('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-shop-reveal],.shop-assurance>div').forEach((el) => el.classList.add('is-inview'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-inview');
        observer.unobserve(entry.target);
      });
    }, { rootMargin:'0px 0px -10% 0px', threshold:.08 });

    document.querySelectorAll('[data-shop-reveal],.shop-assurance>div').forEach((el) => revealObserver.observe(el));
  }

  function updateTabIndicator() {
    if (!tabs) return;
    const active = tabButtons.find((button) => button.classList.contains('is-active'));
    if (!active) return;
    const tabRect = tabs.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    tabs.style.setProperty('--shop-tab-left', `${activeRect.left - tabRect.left + tabs.scrollLeft}px`);
    tabs.style.setProperty('--shop-tab-width', `${activeRect.width}px`);
  }

  const tabMutation = new MutationObserver(updateTabIndicator);
  tabButtons.forEach((button) => tabMutation.observe(button, { attributes:true, attributeFilter:['class'] }));
  window.addEventListener('resize', () => requestAnimationFrame(updateTabIndicator), { passive:true });
  tabs?.addEventListener('scroll', () => requestAnimationFrame(updateTabIndicator), { passive:true });

  function captureRects() {
    const rects = new Map();
    products.forEach((product) => {
      if (!product.hidden) rects.set(product, product.getBoundingClientRect());
    });
    return rects;
  }

  function playFlip(firstRects) {
    if (reduce || !grid) return;
    products.forEach((product) => {
      if (product.hidden) return;
      const first = firstRects.get(product);
      const last = product.getBoundingClientRect();
      if (!first) {
        product.classList.remove('is-filter-entering');
        void product.offsetWidth;
        product.classList.add('is-filter-entering');
        return;
      }
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      const sx = first.width / Math.max(last.width, 1);
      const sy = first.height / Math.max(last.height, 1);
      if (Math.abs(dx) < .5 && Math.abs(dy) < .5 && Math.abs(sx - 1) < .01 && Math.abs(sy - 1) < .01) return;

      product.animate([
        { transform:`translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, transformOrigin:'top left' },
        { transform:'translate(0, 0) scale(1, 1)', transformOrigin:'top left' }
      ], {
        duration:620,
        easing:'cubic-bezier(.16,1,.3,1)'
      });
    });
  }

  if (grid) {
    let beforeRects = new Map();
    const observer = new MutationObserver((mutations) => {
      const relevant = mutations.some((mutation) => mutation.type === 'childList' || mutation.attributeName === 'hidden');
      if (!relevant) return;
      requestAnimationFrame(() => playFlip(beforeRects));
    });
    observer.observe(grid, { childList:true, subtree:true, attributes:true, attributeFilter:['hidden'] });

    ['click','change','input'].forEach((eventName) => {
      document.addEventListener(eventName, (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        if (!target.closest('.universe-tabs,.catalogue-tools,.filter-panel,.filter-reset,#empty-reset,[data-jump-universe]')) return;
        beforeRects = captureRects();
        body.classList.add('shop-browsing');
      }, { capture:true, passive:eventName === 'input' });
    });
  }

  document.querySelectorAll('.product-card__media img').forEach((img) => {
    if (reduce) return;
    const card = img.closest('.product-card');
    if (!card) return;
    card.addEventListener('pointermove', (event) => {
      if (!window.matchMedia('(pointer:fine)').matches) return;
      const rect = card.getBoundingClientRect();
      const y = (event.clientY - rect.top) / Math.max(rect.height, 1) - .5;
      img.style.setProperty('--shop-image-y', `${(y * -10).toFixed(2)}px`);
    }, { passive:true });
    card.addEventListener('pointerleave', () => img.style.setProperty('--shop-image-y', '0px'), { passive:true });
  });

  requestAnimationFrame(() => {
    updateTabIndicator();
    body.classList.add('shop-motion-ready');
  });
})();
