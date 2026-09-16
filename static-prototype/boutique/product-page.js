/* Shared product page engine for La Maison Malgache demo catalogue. */
(() => {
  const catalog = window.LMM_PRODUCT_CATALOG || {};
  const body = document.body;
  if (!body) return;

  function loadSharedEnhancements(){
    const assets = [
      ['link','../shared-brand-cursor.css','data-brand-cursor'],
      ['script','../shared-brand-cursor.js','data-brand-cursor'],
      ['link','../shared-a11y.css','data-shared-a11y'],
      ['script','../shared-a11y.js','data-shared-a11y']
    ];
    assets.forEach(([type,src,marker]) => {
      if (document.querySelector(`${type}[${marker}]`)) return;
      const node = document.createElement(type);
      node.setAttribute(marker,'true');
      if (type === 'link') {
        node.rel = 'stylesheet';
        node.href = src;
        document.head.appendChild(node);
      } else {
        node.src = src;
        node.defer = true;
        node.dataset.sharedEnhancement = 'true';
        document.body.appendChild(node);
      }
    });
  }

  const slug = body.dataset.productSlug || location.pathname.split('/').filter(Boolean).slice(-1)[0];
  const product = catalog[slug] || catalog['vase-ambato'];
  if (!product) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const formatPrice = (value) => `${Number(value).toFixed(0)} €`;
  const create = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  };

  document.title = `${product.name} · La Maison Malgache`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = product.description;

  const setText = (selector, text) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  };

  setText('#product-title', product.name);
  setText('.pdp-eyebrow', `${product.universe} · ${product.material}`);
  setText('.pdp-price-row strong', formatPrice(product.price));
  setText('.pdp-lead', product.lead);
  setText('.pdp-stock', product.stockText);
  setText('.pdp-media-caption', product.hero.caption);
  setText('.add-to-cart span', formatPrice(product.price));

  const mainImage = document.querySelector('#pdp-main-image');
  if (mainImage) {
    mainImage.src = product.hero.src;
    mainImage.alt = product.hero.alt;
  }

  const facts = document.querySelector('.pdp-facts');
  if (facts) {
    const fragment = document.createDocumentFragment();
    [['Matière', product.material],['Origine', product.origin],['Dimensions', product.dimensions],['Série', product.series]].forEach(([label,value]) => {
      const wrap = create('div');
      const dt = create('dt','',label);
      const dd = create('dd','',value);
      wrap.append(dt,dd);
      fragment.appendChild(wrap);
    });
    facts.replaceChildren(fragment);
  }

  const notes = document.querySelector('.pdp-notes');
  if (notes) {
    const fragment = document.createDocumentFragment();
    (product.notes || []).forEach(([title,text]) => {
      const details = create('details');
      const summary = create('summary','',title);
      const copy = create('p','',text);
      details.append(summary,copy);
      fragment.appendChild(details);
    });
    notes.replaceChildren(fragment);
  }

  const storyMedia = document.querySelector('.pdp-story-media');
  const storyCopy = document.querySelector('.pdp-story-copy');
  if (storyMedia && storyCopy && product.story?.length) {
    const storyWord = storyMedia.querySelector('.pdp-story-word');
    storyMedia.querySelectorAll('[data-story-photo]').forEach((el) => el.remove());
    product.story.forEach((step,index) => {
      const figure = create('figure',`pdp-story-photo${index === 0 ? ' is-active' : ''}`);
      figure.dataset.storyPhoto = String(index);
      const image = create('img');
      image.src = step.image;
      image.alt = step.alt;
      image.loading = 'lazy';
      image.decoding = 'async';
      figure.appendChild(image);
      storyMedia.insertBefore(figure,storyWord || null);
    });
    if (storyWord) storyWord.textContent = String(product.story[0].label || '').toUpperCase();

    storyCopy.querySelectorAll('[data-story-panel]').forEach((el) => el.remove());
    const progress = storyCopy.querySelector('.pdp-story-progress');
    product.story.forEach((step,index) => {
      const article = create('article',`pdp-story-panel${index === 0 ? ' is-active' : ''}`);
      article.dataset.storyPanel = String(index);
      const eyebrow = create('span','',`${String(index + 1).padStart(2,'0')} · ${step.label}`);
      const title = create('h2','',step.title);
      const copy = create('p','',step.text);
      article.append(eyebrow,title,copy);
      storyCopy.insertBefore(article,progress || null);
    });
    if (progress) {
      const bars = document.createDocumentFragment();
      product.story.forEach((_,index) => {
        const bar = create('span',index === 0 ? 'is-active' : '');
        bars.appendChild(bar);
      });
      progress.replaceChildren(bars);
    }

    const sentinels = document.querySelector('.pdp-story-sentinels');
    if (sentinels) {
      const fragment = document.createDocumentFragment();
      product.story.forEach((_,index) => {
        const sentinel = create('div');
        sentinel.dataset.storyStep = String(index);
        fragment.appendChild(sentinel);
      });
      sentinels.replaceChildren(fragment);
    }
  }

  setText('.pdp-detail-copy>p', product.detail.eyebrow);
  setText('#detail-title', product.detail.title);
  const detailImage = document.querySelector('.pdp-detail-media img');
  if (detailImage) {
    detailImage.src = product.detail.image;
    detailImage.alt = product.detail.alt;
  }
  const specs = document.querySelector('.pdp-detail-specs');
  if (specs) {
    const fragment = document.createDocumentFragment();
    product.detail.specs.forEach(([label,value]) => {
      const row = create('div');
      row.append(create('span','',label),create('strong','',value));
      fragment.appendChild(row);
    });
    specs.replaceChildren(fragment);
  }

  const relatedGrid = document.querySelector('.pdp-related-grid');
  if (relatedGrid) {
    const fragment = document.createDocumentFragment();
    (product.related || []).forEach((relatedSlug,index) => {
      const item = catalog[relatedSlug];
      if (!item) return;
      const link = create('a',`related-card${index === 1 ? ' related-card--wide' : ''}`);
      link.dataset.relatedIndex = String(index);
      link.href = `../${encodeURIComponent(item.slug)}/`;
      const media = create('div');
      const image = create('img');
      image.src = item.hero.src;
      image.alt = item.hero.alt;
      image.loading = 'lazy';
      image.decoding = 'async';
      media.appendChild(image);
      link.append(media,create('p','',item.material),create('h3','',item.name),create('span','',formatPrice(item.price)));
      fragment.appendChild(link);
    });
    relatedGrid.replaceChildren(fragment);
  }

  let quantity = 1;
  const qtyOutput = document.querySelector('[data-qty]');
  const qtyMinus = document.querySelector('[data-qty-minus]');
  const qtyPlus = document.querySelector('[data-qty-plus]');
  const addButton = document.querySelector('[data-add-to-cart]');
  const addTextNode = addButton ? [...addButton.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim()) : null;
  const addOriginalText = addTextNode?.nodeValue || '';
  let addFeedbackTimer = 0;

  function setQuantity(next){
    quantity = Math.max(1,Math.min(9,Number(next) || 1));
    if (qtyOutput) qtyOutput.textContent = String(quantity);
    if (qtyMinus) qtyMinus.disabled = quantity <= 1;
  }

  qtyMinus?.addEventListener('click',() => setQuantity(quantity - 1));
  qtyPlus?.addEventListener('click',() => setQuantity(quantity + 1));
  addButton?.addEventListener('click',() => {
    const cartProduct = {id:product.slug,name:product.name,material:product.material,price:product.price,image:product.hero.src};
    if (window.LMM_CART) {
      window.LMM_CART.add(cartProduct,quantity);
      window.LMM_CART.open();
    } else {
      let items = [];
      try { items = JSON.parse(localStorage.getItem('lmm-cart') || '[]'); } catch (_) {}
      const existing = items.find((item) => item.id === product.slug);
      if (existing) existing.quantity += quantity;
      else items.push({...cartProduct,quantity});
      try { localStorage.setItem('lmm-cart',JSON.stringify(items)); } catch (_) {}
    }
    addButton.classList.remove('is-added');
    void addButton.offsetWidth;
    addButton.classList.add('is-added');
    clearTimeout(addFeedbackTimer);
    if (addTextNode) addTextNode.nodeValue = addOriginalText.replace('Ajouter au panier','Ajouté au panier');
    addFeedbackTimer = window.setTimeout(() => {
      if (addTextNode) addTextNode.nodeValue = addOriginalText;
      addButton.classList.remove('is-added');
    },900);
  });

  const storyPhotos = [...document.querySelectorAll('[data-story-photo]')];
  const storyPanels = [...document.querySelectorAll('[data-story-panel]')];
  const storySentinels = [...document.querySelectorAll('[data-story-step]')];
  const storyBars = [...document.querySelectorAll('.pdp-story-progress span')];
  const storyWord = document.querySelector('.pdp-story-word');
  let storyStep = 0;
  let storyWordTimer = 0;
  function setStoryStep(index){
    const safe = Math.max(0,Math.min(storyPhotos.length - 1,index));
    if (safe === storyStep && body.dataset.storyReady === 'true') return;
    storyStep = safe;
    storyPhotos.forEach((el,i) => el.classList.toggle('is-active',i === safe));
    storyPanels.forEach((el,i) => el.classList.toggle('is-active',i === safe));
    storyBars.forEach((el,i) => el.classList.toggle('is-active',i <= safe));
    if (storyWord) {
      clearTimeout(storyWordTimer);
      const apply = () => {
        storyWord.textContent = String(product.story[safe]?.label || '').toUpperCase();
        storyWord.style.opacity = '';
        storyWord.style.transform = '';
      };
      storyWord.style.opacity = '0';
      storyWord.style.transform = 'translate3d(0,18px,0)';
      storyWordTimer = window.setTimeout(apply,reduceMotion.matches ? 0 : 170);
    }
    body.dataset.storyReady = 'true';
    body.dataset.pdpStoryStep = String(safe);
  }
  setStoryStep(0);
  if (!reduceMotion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
      if (visible.length) setStoryStep(Number(visible[0].target.dataset.storyStep || 0));
    },{rootMargin:'-46% 0px -46% 0px',threshold:0});
    storySentinels.forEach((sentinel) => observer.observe(sentinel));
  }

  const mainMedia = document.querySelector('#pdp-main-media');
  let scrollRaf = 0;
  function updateScrollState(){
    scrollRaf = 0;
    body.classList.toggle('is-pdp-scrolled',window.scrollY > 50);
  }
  window.addEventListener('scroll',() => { if (!scrollRaf) scrollRaf = requestAnimationFrame(updateScrollState); },{passive:true});
  updateScrollState();

  function resetTransitionArtifacts(){
    document.querySelectorAll('.pdp-transition-ghost').forEach((ghost) => ghost.remove());
    if (mainMedia) mainMedia.style.opacity = '';
    document.documentElement.classList.remove('pdp-transition-pending');
    body.classList.add('pdp-ready','pdp-entered');
  }

  function playIncomingTransition(){
    let transition = null;
    try { transition = JSON.parse(sessionStorage.getItem('lmm-product-transition') || 'null'); } catch (_) {}
    try { sessionStorage.removeItem('lmm-product-transition'); } catch (_) {}
    document.documentElement.classList.remove('pdp-transition-pending');
    body.classList.add('pdp-ready');
    if (reduceMotion.matches || !transition || transition.slug !== product.slug || Date.now() - transition.time > 3000 || !mainMedia || !mainImage) {
      requestAnimationFrame(() => body.classList.add('pdp-entered'));
      return;
    }
    const target = mainMedia.getBoundingClientRect();
    const ghost = create('div','pdp-transition-ghost');
    const image = create('img');
    image.src = transition.image || mainImage.src;
    image.alt = '';
    ghost.appendChild(image);
    Object.assign(ghost.style,{left:`${transition.left}px`,top:`${transition.top}px`,width:`${transition.width}px`,height:`${transition.height}px`,borderRadius:`${transition.radius || 0}px`});
    body.appendChild(ghost);
    mainMedia.style.opacity = '0';
    const animation = ghost.animate([
      {left:`${transition.left}px`,top:`${transition.top}px`,width:`${transition.width}px`,height:`${transition.height}px`,borderRadius:`${transition.radius || 0}px`},
      {left:`${target.left}px`,top:`${target.top}px`,width:`${target.width}px`,height:`${target.height}px`,borderRadius:'0 180px 180px 0'}
    ],{duration:760,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});
    animation.finished.then(() => {
      mainMedia.style.opacity = '';
      ghost.animate([{opacity:1},{opacity:0}],{duration:220,easing:'ease-out',fill:'forwards'}).finished.then(() => ghost.remove());
      body.classList.add('pdp-entered');
    }).catch(resetTransitionArtifacts);
  }

  setQuantity(1);
  loadSharedEnhancements();
  requestAnimationFrame(playIncomingTransition);
  window.addEventListener('pageshow',(event) => {
    if (event.persisted) resetTransitionArtifacts();
    updateScrollState();
  });
})();
