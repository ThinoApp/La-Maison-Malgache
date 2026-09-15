/* Vase Ambato product interactions and cross-page handoff. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;
  const mainMedia = document.querySelector('#pdp-main-media');
  const mainImage = document.querySelector('#pdp-main-image');
  const qtyOutput = document.querySelector('[data-qty]');
  const qtyMinus = document.querySelector('[data-qty-minus]');
  const qtyPlus = document.querySelector('[data-qty-plus]');
  const addButton = document.querySelector('[data-add-to-cart]');
  const cart = document.querySelector('#pdp-cart');
  const cartTrigger = document.querySelector('.pdp-cart-trigger');
  const cartClose = document.querySelector('[data-cart-close]');
  const cartBody = document.querySelector('[data-cart-body]');
  const cartCounts = [...document.querySelectorAll('[data-cart-count]')];
  const story = document.querySelector('.pdp-story');
  const storyPhotos = [...document.querySelectorAll('[data-story-photo]')];
  const storyPanels = [...document.querySelectorAll('[data-story-panel]')];
  const storySentinels = [...document.querySelectorAll('[data-story-step]')];
  const storyBars = [...document.querySelectorAll('.pdp-story-progress span')];
  const storyWord = document.querySelector('.pdp-story-word');
  const storyWords = ['MATIÈRE','GESTE','USAGE'];
  let quantity = 1;
  let storyStep = 0;

  const product = {
    id:'vase-ambato',
    name:'Vase Ambato',
    material:'Céramique',
    price:145,
    image:'https://images.unsplash.com/photo-1695740639466-7baecca4224d?auto=format&fit=crop&w=600&q=84'
  };

  function readCart(){
    try { return JSON.parse(localStorage.getItem('lmm-cart') || '[]'); }
    catch (_) { return []; }
  }

  function writeCart(items){
    try { localStorage.setItem('lmm-cart', JSON.stringify(items)); } catch (_) {}
  }

  function cartTotalCount(items){
    return items.reduce((sum,item) => sum + Number(item.quantity || 0), 0);
  }

  function updateCartUI(){
    const items = readCart();
    const count = cartTotalCount(items);
    cartCounts.forEach((el) => { el.textContent = String(count); });
    if (!cartBody) return;
    if (!items.length) {
      cartBody.innerHTML = '<div class="pdp-cart-empty">Votre panier est vide.</div>';
      return;
    }
    cartBody.innerHTML = items.map((item) => `
      <article class="pdp-cart-item">
        <img src="${item.image}" alt="">
        <div><p>${item.material}</p><h3>${item.name}</h3><p>Quantité ${item.quantity}</p></div>
        <strong>${item.price * item.quantity} €</strong>
      </article>`).join('');
  }

  function setQuantity(next){
    quantity = Math.max(1, Math.min(9, next));
    if (qtyOutput) qtyOutput.textContent = String(quantity);
    qtyMinus?.toggleAttribute('disabled', quantity <= 1);
  }

  qtyMinus?.addEventListener('click', () => setQuantity(quantity - 1));
  qtyPlus?.addEventListener('click', () => setQuantity(quantity + 1));

  addButton?.addEventListener('click', () => {
    const items = readCart();
    const existing = items.find((item) => item.id === product.id);
    if (existing) existing.quantity += quantity;
    else items.push({ ...product, quantity });
    writeCart(items);
    updateCartUI();
    addButton.classList.remove('is-added');
    void addButton.offsetWidth;
    addButton.classList.add('is-added');
    const original = addButton.firstChild?.nodeValue || 'Ajouter au panier ';
    if (addButton.firstChild) addButton.firstChild.nodeValue = 'Ajouté au panier ';
    window.setTimeout(() => {
      if (addButton.firstChild) addButton.firstChild.nodeValue = original;
    }, 900);
    cart?.showModal();
    cartTrigger?.setAttribute('aria-expanded','true');
  });

  cartTrigger?.addEventListener('click', () => {
    updateCartUI();
    cart?.showModal();
    cartTrigger.setAttribute('aria-expanded','true');
  });
  cartClose?.addEventListener('click', () => cart?.close());
  cart?.addEventListener('click', (event) => { if (event.target === cart) cart.close(); });
  cart?.addEventListener('close', () => cartTrigger?.setAttribute('aria-expanded','false'));

  function setStoryStep(index){
    const safe = Math.max(0, Math.min(storyPhotos.length - 1, index));
    if (safe === storyStep && body.dataset.storyReady === 'true') return;
    storyStep = safe;
    storyPhotos.forEach((el,i) => el.classList.toggle('is-active', i === safe));
    storyPanels.forEach((el,i) => el.classList.toggle('is-active', i === safe));
    storyBars.forEach((el,i) => el.classList.toggle('is-active', i <= safe));
    if (storyWord) {
      storyWord.style.opacity = '0';
      storyWord.style.transform = 'translate3d(0,18px,0)';
      window.setTimeout(() => {
        storyWord.textContent = storyWords[safe] || '';
        storyWord.style.opacity = '';
        storyWord.style.transform = '';
      }, reduce ? 0 : 170);
    }
    body.dataset.storyReady = 'true';
  }

  setStoryStep(0);
  if (!reduce && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
        .sort((a,b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
      if (!visible.length) return;
      setStoryStep(Number(visible[0].target.dataset.storyStep || 0));
    }, { rootMargin:'-46% 0px -46% 0px', threshold:0 });
    storySentinels.forEach((sentinel) => observer.observe(sentinel));
  }

  let scrollRaf = 0;
  function updateScrollState(){
    scrollRaf = 0;
    body.classList.toggle('is-pdp-scrolled', window.scrollY > 50);
    if (mainMedia && mainImage && !reduce && window.innerWidth > 1000) {
      const rect = mainMedia.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -rect.top / Math.max(window.innerHeight,1)));
      mainImage.style.translate = `0 ${(-p * 22).toFixed(2)}px`;
      mainImage.style.scale = String(1.03 + p * .035);
    }
  }
  window.addEventListener('scroll', () => {
    if (!scrollRaf) scrollRaf = requestAnimationFrame(updateScrollState);
  }, { passive:true });
  updateScrollState();

  function playIncomingTransition(){
    let transition = null;
    try { transition = JSON.parse(sessionStorage.getItem('lmm-product-transition') || 'null'); } catch (_) {}
    try { sessionStorage.removeItem('lmm-product-transition'); } catch (_) {}

    document.documentElement.classList.remove('pdp-transition-pending');
    body.classList.add('pdp-ready');

    if (reduce || !transition || Date.now() - transition.time > 3000 || !mainMedia || !mainImage) {
      requestAnimationFrame(() => body.classList.add('pdp-entered'));
      return;
    }

    const target = mainMedia.getBoundingClientRect();
    const ghost = document.createElement('div');
    ghost.className = 'pdp-transition-ghost';
    const image = document.createElement('img');
    image.src = transition.image || mainImage.src;
    image.alt = '';
    ghost.appendChild(image);
    Object.assign(ghost.style, {
      left:`${transition.left}px`, top:`${transition.top}px`, width:`${transition.width}px`, height:`${transition.height}px`,
      borderRadius:`${transition.radius || 0}px`
    });
    body.appendChild(ghost);
    mainMedia.style.opacity = '0';

    const animation = ghost.animate([
      { left:`${transition.left}px`, top:`${transition.top}px`, width:`${transition.width}px`, height:`${transition.height}px`, borderRadius:`${transition.radius || 0}px` },
      { left:`${target.left}px`, top:`${target.top}px`, width:`${target.width}px`, height:`${target.height}px`, borderRadius:'0 180px 180px 0' }
    ], { duration:760, easing:'cubic-bezier(.16,1,.3,1)', fill:'forwards' });

    animation.finished.then(() => {
      mainMedia.style.opacity = '';
      ghost.animate([{opacity:1},{opacity:0}],{duration:220,easing:'ease-out',fill:'forwards'}).finished.then(() => ghost.remove());
      body.classList.add('pdp-entered');
    }).catch(() => {
      mainMedia.style.opacity = '';
      ghost.remove();
      body.classList.add('pdp-entered');
    });
  }

  setQuantity(1);
  updateCartUI();
  requestAnimationFrame(playIncomingTransition);
})();
