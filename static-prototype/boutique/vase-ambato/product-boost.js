/* Advanced Vase Ambato motion director. */
(() => {
  const body = document.body;
  if (!body) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = window.matchMedia('(min-width:1001px)').matches;
  const fine = window.matchMedia('(pointer:fine)').matches;

  const hero = document.querySelector('.pdp-hero');
  const mainMedia = document.querySelector('.pdp-main-media');
  const buyInner = document.querySelector('.pdp-buy-inner');
  const title = document.querySelector('.pdp-buy-panel h1');
  const story = document.querySelector('.pdp-story');
  const storyPhotos = [...document.querySelectorAll('.pdp-story-photo')];
  const storyWord = document.querySelector('.pdp-story-word');
  const detail = document.querySelector('.pdp-detail-scene');
  const detailMedia = document.querySelector('.pdp-detail-media');
  const detailImage = detailMedia?.querySelector('img');
  const detailCopy = document.querySelector('.pdp-detail-copy');
  const related = document.querySelector('.pdp-related');
  const relatedCards = [...document.querySelectorAll('.related-card')];

  if (title && !title.dataset.pdpBoostSplit) {
    const label = title.textContent.trim();
    title.dataset.pdpBoostSplit = 'true';
    title.setAttribute('aria-label', label);
    title.innerHTML = '';
    label.split(/\s+/).forEach((word, index) => {
      const span = document.createElement('span');
      span.className = 'pdp-title-word';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = word;
      const dir = index % 2 ? 1 : -1;
      span.style.setProperty('--pdp-word-x', `${dir * (8 + index * 3)}px`);
      span.style.setProperty('--pdp-word-y', `${18 + index * 5}px`);
      span.style.setProperty('--pdp-word-r', `${dir * (0.5 + index * .25)}deg`);
      span.style.setProperty('--pdp-word-delay', `${130 + index * 80}ms`);
      title.appendChild(span);
      if (index < label.split(/\s+/).length - 1) title.appendChild(document.createTextNode(' '));
    });
  }

  const rail = document.createElement('div');
  rail.className = 'pdp-scene-rail';
  rail.setAttribute('aria-hidden', 'true');
  rail.innerHTML = '<span data-scene-label="hero" class="is-active">Pièce</span><span data-scene-label="story">Histoire</span><span data-scene-label="detail">Détail</span><span data-scene-label="related">Dialogue</span>';
  body.appendChild(rail);
  const railItems = [...rail.querySelectorAll('[data-scene-label]')];

  function setScene(scene) {
    if (!scene || body.dataset.pdpScene === scene) return;
    body.dataset.pdpScene = scene;
    railItems.forEach((item) => item.classList.toggle('is-active', item.dataset.sceneLabel === scene));
  }

  const sceneEntries = [
    ['hero', hero],
    ['story', story],
    ['detail', detail],
    ['related', related]
  ].filter(([, el]) => el);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
        .sort((a, b) => Math.abs((a.boundingClientRect.top + a.boundingClientRect.height * .5) - innerHeight * .5) - Math.abs((b.boundingClientRect.top + b.boundingClientRect.height * .5) - innerHeight * .5));
      if (!visible.length) return;
      const found = sceneEntries.find(([, el]) => el === visible[0].target);
      if (found) setScene(found[0]);
    }, { rootMargin:'-38% 0px -38% 0px', threshold:0 });
    sceneEntries.forEach(([, el]) => observer.observe(el));
  } else {
    setScene('hero');
  }

  if (relatedCards.length) {
    relatedCards.forEach((card, index) => card.dataset.relatedIndex = String(index));
  }

  if (!reduce && fine && desktop && hero && mainMedia) {
    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / Math.max(rect.width, 1) - .5;
      const ny = (event.clientY - rect.top) / Math.max(rect.height, 1) - .5;
      const root = document.documentElement.style;
      root.setProperty('--pdp-hero-pointer-x', `${(nx * 11).toFixed(2)}px`);
      root.setProperty('--pdp-hero-pointer-y', `${(ny * 7).toFixed(2)}px`);
    }, { passive:true });
    hero.addEventListener('pointerleave', () => {
      const root = document.documentElement.style;
      root.setProperty('--pdp-hero-pointer-x', '0px');
      root.setProperty('--pdp-hero-pointer-y', '0px');
    }, { passive:true });
  }

  if (!reduce && fine && desktop && detailMedia && detailImage) {
    const lens = document.createElement('div');
    lens.className = 'pdp-material-lens';
    lens.setAttribute('aria-hidden', 'true');
    lens.style.backgroundImage = `url("${detailImage.currentSrc || detailImage.src}")`;
    detailMedia.appendChild(lens);

    detailMedia.addEventListener('pointerenter', () => detailMedia.classList.add('is-lens-active'));
    detailMedia.addEventListener('pointerleave', () => detailMedia.classList.remove('is-lens-active'));
    detailMedia.addEventListener('pointermove', (event) => {
      const rect = detailMedia.getBoundingClientRect();
      const lensSize = lens.offsetWidth || 220;
      const x = Math.max(8, Math.min(rect.width - lensSize - 8, event.clientX - rect.left - lensSize * .5));
      const y = Math.max(8, Math.min(rect.height - lensSize - 8, event.clientY - rect.top - lensSize * .5));
      lens.style.setProperty('--pdp-lens-x', `${x}px`);
      lens.style.setProperty('--pdp-lens-y', `${y}px`);
      const px = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100;
      const py = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100;
      lens.style.backgroundSize = '260% 260%';
      lens.style.backgroundPosition = `${px}% ${py}%`;
    }, { passive:true });
  }

  let lastY = window.scrollY;
  let lastT = performance.now();
  let velocity = 0;
  let raf = 0;

  function render() {
    raf = 0;
    if (reduce) return;
    const now = performance.now();
    const y = window.scrollY;
    const dt = Math.max(16, now - lastT);
    const rawVelocity = (y - lastY) / dt;
    velocity += (rawVelocity - velocity) * .18;
    lastY = y;
    lastT = now;

    const root = document.documentElement.style;
    const speed = Math.min(1, Math.abs(velocity) * 7.5);
    root.setProperty('--pdp-velocity-shift', `${Math.max(-14, Math.min(14, velocity * 12)).toFixed(2)}px`);
    root.setProperty('--pdp-velocity-blur', `${(speed * 1.1).toFixed(2)}px`);

    if (desktop && hero && mainMedia && buyInner) {
      const r = hero.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(innerHeight, 1)));
      root.setProperty('--pdp-hero-frame-y', `${(-p * 24).toFixed(2)}px`);
      root.setProperty('--pdp-hero-frame-scale', String(1 - p * .025));
      root.setProperty('--pdp-hero-frame-rotate', `${(-p * .45).toFixed(3)}deg`);
      root.setProperty('--pdp-buy-y', `${(p * 18).toFixed(2)}px`);
      root.setProperty('--pdp-buy-scale', String(1 - p * .012));
      root.setProperty('--pdp-hero-line', String(1 - p * .48));
    }

    if (desktop && story) {
      const r = story.getBoundingClientRect();
      const local = Math.min(1, Math.max(0, (innerHeight - r.top) / Math.max(r.height + innerHeight, 1)));
      root.setProperty('--pdp-story-image-y', `${((local - .5) * -28).toFixed(2)}px`);
    }

    if (desktop && detail) {
      const r = detail.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / Math.max(innerHeight + r.height, 1)));
      root.setProperty('--pdp-detail-y', `${((p - .5) * -34).toFixed(2)}px`);
      root.setProperty('--pdp-detail-scale', String(1.1 - p * .045));
      root.setProperty('--pdp-detail-copy-y', `${((.5 - p) * 18).toFixed(2)}px`);
    }
  }

  window.addEventListener('scroll', () => {
    if (!raf) raf = requestAnimationFrame(render);
  }, { passive:true });
  window.addEventListener('resize', () => {
    if (!raf) raf = requestAnimationFrame(render);
  }, { passive:true });

  const stepObserver = new MutationObserver(() => {
    const active = document.querySelector('[data-story-panel].is-active');
    const index = active ? Number(active.dataset.storyPanel || 0) : 0;
    body.dataset.pdpStoryStep = String(index);
  });
  document.querySelectorAll('[data-story-panel]').forEach((panel) => stepObserver.observe(panel, { attributes:true, attributeFilter:['class'] }));
  body.dataset.pdpStoryStep = '0';

  render();
})();
