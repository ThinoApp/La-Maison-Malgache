/* Product routing + cross-page shared image transition for catalogue cards. */
(() => {
  if (!document.querySelector('link[data-boutique-product-links]')) {
    const styles = document.createElement('link');
    styles.rel = 'stylesheet';
    styles.href = 'boutique-product-links.css';
    styles.dataset.boutiqueProductLinks = 'true';
    document.head.appendChild(styles);
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const routes = [
    ['Vase Ambato','vase-ambato'],
    ['Panier Anja','panier-anja'],
    ['Plateau Tsiro','plateau-tsiro'],
    ['Suspension Vola','suspension-vola'],
    ['Objet Tsingy','objet-tsingy']
  ];

  function routeFor(card){
    const name = card?.querySelector('h3')?.textContent?.trim() || '';
    return routes.find(([label]) => label === name)?.[1] || '';
  }

  function navigate(card, slug){
    if (!card || !slug) return;
    const media = card.querySelector('.product-card__media');
    const image = media?.querySelector(':scope > img') || media?.querySelector('img');
    if (!reduce && media && image) {
      const rect = media.getBoundingClientRect();
      try {
        sessionStorage.setItem('lmm-product-transition', JSON.stringify({
          slug,
          image:image.currentSrc || image.src,
          left:rect.left,
          top:rect.top,
          width:rect.width,
          height:rect.height,
          radius:0,
          time:Date.now()
        }));
      } catch (_) {}
    }
    location.href = `${slug}/`;
  }

  document.querySelectorAll('[data-product]').forEach((card) => {
    const slug = routeFor(card);
    if (!slug) return;
    card.dataset.productSlug = slug;
    card.classList.add('has-product-page');
    card.tabIndex = 0;
    card.setAttribute('role','link');
    card.setAttribute('aria-label', `Voir la fiche ${card.querySelector('h3')?.textContent?.trim() || 'produit'}`);
    card.addEventListener('click', (event) => {
      if (event.target instanceof Element && event.target.closest('a,button,input,select,summary,label')) return;
      navigate(card, slug);
    });
    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      navigate(card, slug);
    });
  });

  const featuredLink = document.querySelector('.featured-piece .shop-link');
  const featuredMedia = document.querySelector('.featured-piece__media');
  if (featuredLink) {
    featuredLink.href = 'vase-ambato/';
    featuredLink.textContent = 'Voir la fiche';
    featuredLink.addEventListener('click', (event) => {
      if (reduce || !featuredMedia) return;
      event.preventDefault();
      const image = featuredMedia.querySelector('img');
      const rect = featuredMedia.getBoundingClientRect();
      try {
        sessionStorage.setItem('lmm-product-transition', JSON.stringify({slug:'vase-ambato',image:image?.currentSrc || image?.src || '',left:rect.left,top:rect.top,width:rect.width,height:rect.height,radius:0,time:Date.now()}));
      } catch (_) {}
      location.href = 'vase-ambato/';
    });
  }
})();
