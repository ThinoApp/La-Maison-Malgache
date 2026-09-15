/* Product routing + cross-page shared image transition for catalogue cards. */
(() => {
  if (!document.querySelector('link[data-boutique-product-links]')) {
    const styles = document.createElement('link');
    styles.rel = 'stylesheet';
    styles.href = 'boutique-product-links.css';
    styles.dataset.boutiqueProductLinks = 'true';
    document.head.appendChild(styles);
  }

  function loadObsidianPolish(){
    if (!document.querySelector('link[data-boutique-obsidian]')) {
      const styles = document.createElement('link');
      styles.rel = 'stylesheet';
      styles.href = 'boutique-obsidian.css';
      styles.dataset.boutiqueObsidian = 'true';
      document.head.appendChild(styles);
    }
    if (!document.querySelector('script[data-boutique-obsidian]')) {
      const script = document.createElement('script');
      script.src = 'boutique-obsidian.js';
      script.defer = true;
      script.dataset.boutiqueObsidian = 'true';
      document.head.appendChild(script);
    }
  }

  loadObsidianPolish();

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

  function mountParallaxGallery(){
    const featured = document.querySelector('.featured-piece');
    const catalogue = document.querySelector('#catalogue');
    if (!featured || !catalogue || document.querySelector('[data-parallax-gallery]')) return;

    if (!document.querySelector('link[data-boutique-parallax-gallery]')) {
      const styles = document.createElement('link');
      styles.rel = 'stylesheet';
      styles.href = 'boutique-parallax-gallery.css';
      styles.dataset.boutiqueParallaxGallery = 'true';
      document.head.appendChild(styles);
    }

    const gallery = document.createElement('section');
    gallery.className = 'parallax-gallery';
    gallery.dataset.parallaxGallery = 'true';
    gallery.setAttribute('aria-labelledby','parallax-gallery-title');
    gallery.innerHTML = `
      <div class="parallax-gallery__sticky">
        <div class="parallax-gallery__top">
          <h2 class="parallax-gallery__heading" id="parallax-gallery-title">Quatre pièces, quatre présences.</h2>
          <div class="parallax-gallery__counter"><span data-gallery-current>01</span> / <span data-gallery-total>04</span></div>
        </div>

        <div class="parallax-gallery__side parallax-gallery__side--left" aria-hidden="true">
          <div class="parallax-gallery__thumb-track" data-gallery-thumbs-left>
            <div class="parallax-gallery__thumb"><img src="https://images.unsplash.com/photo-1695740639466-7baecca4224d?auto=format&fit=crop&w=600&q=74" alt=""></div>
            <div class="parallax-gallery__thumb"><img src="https://images.unsplash.com/photo-1646170629004-b3c84a27fc17?auto=format&fit=crop&w=600&q=74" alt=""></div>
            <div class="parallax-gallery__thumb"><img src="https://images.unsplash.com/photo-1760431215881-ea381816f1ca?auto=format&fit=crop&w=600&q=74" alt=""></div>
            <div class="parallax-gallery__thumb"><img src="https://images.unsplash.com/photo-1768902406144-a348c559c73c?auto=format&fit=crop&w=600&q=74&sat=-18" alt=""></div>
          </div>
        </div>

        <div class="parallax-gallery__side parallax-gallery__side--right" aria-hidden="true">
          <div class="parallax-gallery__thumb-track" data-gallery-thumbs-right>
            <div class="parallax-gallery__thumb"><img src="https://images.unsplash.com/photo-1695740639466-7baecca4224d?auto=format&fit=crop&w=600&q=74" alt=""></div>
            <div class="parallax-gallery__thumb"><img src="https://images.unsplash.com/photo-1646170629004-b3c84a27fc17?auto=format&fit=crop&w=600&q=74" alt=""></div>
            <div class="parallax-gallery__thumb"><img src="https://images.unsplash.com/photo-1760431215881-ea381816f1ca?auto=format&fit=crop&w=600&q=74" alt=""></div>
            <div class="parallax-gallery__thumb"><img src="https://images.unsplash.com/photo-1768902406144-a348c559c73c?auto=format&fit=crop&w=600&q=74&sat=-18" alt=""></div>
          </div>
        </div>

        <div class="parallax-gallery__stage">
          <div class="parallax-gallery__outline" aria-hidden="true"></div>
          <div class="parallax-gallery__window">
            <div class="parallax-gallery__track" data-gallery-track>
              <a class="parallax-gallery__slide" data-gallery-slide data-gallery-title="Vase Ambato" data-gallery-meta="Céramique · Hautes terres" href="vase-ambato/">
                <div class="parallax-gallery__inner" data-gallery-inner><img src="https://images.unsplash.com/photo-1695740639466-7baecca4224d?auto=format&fit=crop&w=1500&q=88" alt="Vase Ambato en céramique" loading="lazy" decoding="async"></div>
              </a>
              <a class="parallax-gallery__slide" data-gallery-slide data-gallery-title="Panier Anja" data-gallery-meta="Raphia · Tressage manuel" href="panier-anja/">
                <div class="parallax-gallery__inner" data-gallery-inner><img src="https://images.unsplash.com/photo-1646170629004-b3c84a27fc17?auto=format&fit=crop&w=1500&q=88" alt="Panier Anja en raphia" loading="lazy" decoding="async"></div>
              </a>
              <a class="parallax-gallery__slide" data-gallery-slide data-gallery-title="Plateau Tsiro" data-gallery-meta="Bois · Usage quotidien" href="plateau-tsiro/">
                <div class="parallax-gallery__inner" data-gallery-inner><img src="https://images.unsplash.com/photo-1760431215881-ea381816f1ca?auto=format&fit=crop&w=1500&q=88" alt="Plateau Tsiro en bois" loading="lazy" decoding="async"></div>
              </a>
              <a class="parallax-gallery__slide" data-gallery-slide data-gallery-title="Suspension Vola" data-gallery-meta="Raphia · Lumière filtrée" href="suspension-vola/">
                <div class="parallax-gallery__inner" data-gallery-inner><img src="https://images.unsplash.com/photo-1768902406144-a348c559c73c?auto=format&fit=crop&w=1500&q=88&sat=-18" alt="Suspension Vola en fibres naturelles" loading="lazy" decoding="async"></div>
              </a>
            </div>
          </div>
        </div>

        <div class="parallax-gallery__caption" data-gallery-caption aria-live="polite">
          <span class="parallax-gallery__caption-index" data-gallery-caption-index>01</span>
          <div class="parallax-gallery__caption-copy"><h3 data-gallery-caption-title>Vase Ambato</h3><p data-gallery-caption-meta>Céramique · Hautes terres</p></div>
        </div>
        <div class="parallax-gallery__progress" aria-hidden="true"><span></span></div>
        <div class="parallax-gallery__hint" aria-hidden="true">Faire défiler</div>
      </div>`;

    featured.insertAdjacentElement('afterend', gallery);

    const script = document.createElement('script');
    script.src = 'boutique-parallax-gallery.js';
    script.defer = true;
    script.dataset.boutiqueParallaxGallery = 'true';
    document.head.appendChild(script);
  }

  mountParallaxGallery();
})();
